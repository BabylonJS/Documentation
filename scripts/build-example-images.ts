import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

import puppeteer, { type Page } from "puppeteer";

import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { contentArtifactsDirectory } from "../lib/contentGraph/staticArtifacts";
import { createExampleImageReportWithBlanks, ExampleImageReference, formatExampleImageReport, isBlankImage } from "../lib/contentGraph/exampleImages";
import { getExampleLink } from "../lib/frontendUtils/frontendTools";

const dryRun = process.argv.includes("--dry-run");
const strict = process.argv.includes("--strict");
const includeBlanks = process.argv.includes("--include-blanks");
const missingCanvasZoneMessage = "Cannot read properties of null (reading 'appendChild')";
const fallbackPlaygroundViewport = { width: 2406, height: 890 };

class MissingCanvasZoneError extends Error {
    constructor() {
        super(missingCanvasZoneMessage);
    }
}

const getScreenshotOptions = (imagePath: string) =>
    imagePath.endsWith(".webp")
        ? ({ type: "webp" as const, quality: 90 })
        : ({ type: imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg") ? "jpeg" as const : "png" as const });

const getPlaygroundState = async (page: Page) =>
    page.evaluate(() => {
        type PlaygroundScene = { isLoading?: boolean; meshes?: unknown[] };

        const sceneValue = "scene" in window ? (window as typeof window & { scene?: PlaygroundScene }).scene : undefined;
        const loadingDiv = document.querySelector("#babylonjsLoadingDiv");

        return {
            hasScene: !!sceneValue,
            isLoading: sceneValue?.isLoading,
            meshCount: sceneValue?.meshes?.length,
            loadingText: loadingDiv?.textContent?.trim().slice(0, 200),
            bodyText: document.body.innerText.trim().slice(0, 200),
        };
    });

const isMissingCanvasZoneError = (state: Awaited<ReturnType<typeof getPlaygroundState>>) => state.bodyText.includes(missingCanvasZoneMessage);

const waitForPlaygroundReady = async (page: Page) => {
    try {
        await page.waitForSelector("#renderCanvas", { visible: true });
        const readiness = await page.waitForFunction(
            (missingCanvasZoneText) => {
                type PlaygroundScene = { isLoading?: boolean };

                const sceneValue = "scene" in window ? (window as typeof window & { scene?: PlaygroundScene }).scene : undefined;

                if (document.body.innerText.includes(missingCanvasZoneText)) {
                    return "missing-canvas-zone";
                }

                if (sceneValue?.isLoading === false) {
                    return "ready";
                }

                return false;
            },
            { timeout: 60000 },
            missingCanvasZoneMessage,
        );
        const readinessValue = await readiness.jsonValue();
        if (readinessValue === "missing-canvas-zone") {
            throw new MissingCanvasZoneError();
        }
        await page.waitForSelector("#babylonjsLoadingDiv", { hidden: true, timeout: 60000 });
    } catch (error) {
        if (error instanceof MissingCanvasZoneError) {
            throw error;
        }

        const state = await getPlaygroundState(page).catch((stateError) => ({ stateError: stateError instanceof Error ? stateError.message : String(stateError) }));
        console.log(`Playground did not become ready. State: ${JSON.stringify(state)}`);
        throw error;
    }
};

const loadPlayground = async (page: Page, reference: ExampleImageReference) => {
    await page.goto(getExampleLink(reference));

    try {
        await waitForPlaygroundReady(page);
        return false;
    } catch (error) {
        const state = await getPlaygroundState(page).catch(() => undefined);
        if (!(error instanceof MissingCanvasZoneError) && (!state || !isMissingCanvasZoneError(state))) {
            throw error;
        }

        console.log(`Retrying ${reference.imageUrl} in regular playground mode because full.html is missing canvasZone.`);
    await page.setViewport(fallbackPlaygroundViewport);
        await page.goto(getExampleLink(reference, false));
        await waitForPlaygroundReady(page);
        return true;
    }
};

const generateExampleImage = async (reference: ExampleImageReference) => {
    const browser = await puppeteer.launch({ headless: true });

    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        page.on("dialog", async (dialog) => {
            await dialog.dismiss();
        });

        await page.setViewport({ width: 1200, height: 800 });

        const useCanvasScreenshot = reference.type === "pg" ? await loadPlayground(page, reference) : false;

        if (reference.type !== "pg") {
            await page.goto(getExampleLink(reference));
            await page.waitForSelector("#graph-canvas", { visible: true, timeout: 60000 });
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
        mkdirSync(dirname(reference.imagePath), { recursive: true });

        if (useCanvasScreenshot) {
            const element = await page.$("#renderCanvas");
            await element!.screenshot({ path: reference.imagePath, ...getScreenshotOptions(reference.imagePath) });
        } else if (reference.type === "pg") {
            await page.screenshot({ path: reference.imagePath, fullPage: true, ...getScreenshotOptions(reference.imagePath) });
        } else {
            const element = await page.$("#graph-canvas");
            await page.setViewport({ width: 1700, height: 800 });
            await element!.screenshot({ path: reference.imagePath, ...getScreenshotOptions(reference.imagePath) });
        }

        console.log(`Generated ${reference.imageUrl} from ${reference.documentationPage}.`);

        if (await isBlankImage(reference.imagePath)) {
            console.log(`WARNING blank image: ${reference.imageUrl} rendered blank/empty from ${reference.documentationPage}.`);
            return false;
        }

        return true;
    } finally {
        await browser.close();
    }
};

const main = async () => {
    const report = await createExampleImageReportWithBlanks(getContentGraph());
    const blankImages = report.blankImages ?? [];

    mkdirSync(contentArtifactsDirectory, { recursive: true });
    writeFileSync(join(contentArtifactsDirectory, "example-image-report.json"), `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf-8" });

    console.log(formatExampleImageReport(report));

    // Regenerate missing images, and (when requested) images that currently render blank.
    const regenerationQueue = includeBlanks ? [...report.missingImages, ...blankImages] : report.missingImages;

    if (dryRun || regenerationQueue.length === 0) {
        const hasIssues = report.missingImages.length > 0 || blankImages.length > 0;
        process.exitCode = dryRun && strict && hasIssues ? 1 : 0;
        return;
    }

    let stillBlank = 0;
    for (const reference of regenerationQueue) {
        try {
            const generatedOk = await generateExampleImage(reference);
            if (!generatedOk) {
                stillBlank += 1;
            }
        } catch (error) {
            console.log(error);
            console.log(`Failed to generate ${reference.imageUrl} from ${reference.documentationPage}.`);
            process.exitCode = 1;
        }
    }

    if (strict && stillBlank > 0) {
        console.log(`${stillBlank} image(s) still rendered blank after regeneration.`);
        process.exitCode = 1;
    }
};

void main();