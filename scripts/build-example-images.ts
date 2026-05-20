import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

import puppeteer from "puppeteer";

import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import { contentArtifactsDirectory } from "../lib/contentGraph/staticArtifacts";
import { createExampleImageReport, ExampleImageReference, formatExampleImageReport } from "../lib/contentGraph/exampleImages";
import { getExampleLink } from "../lib/frontendUtils/frontendTools";

const dryRun = process.argv.includes("--dry-run");
const strict = process.argv.includes("--strict");

const getImageType = (imagePath: string) => (imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg") ? "jpeg" : "png");

const generateExampleImage = async (reference: ExampleImageReference) => {
    const browser = await puppeteer.launch({ headless: true });

    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        page.on("dialog", async (dialog) => {
            await dialog.dismiss();
        });

        await page.setViewport({ width: 1200, height: 800 });
        await page.goto(getExampleLink(reference));

        if (reference.type === "pg") {
            await page.waitForSelector("#renderCanvas", { visible: true });
            await page.waitForFunction(`typeof scene !== 'undefined' && scene.isLoading === false`, { timeout: 60000 });
            await page.waitForSelector("#babylonjsLoadingDiv", { hidden: true, timeout: 60000 });
        } else {
            await page.waitForSelector("#graph-canvas", { visible: true, timeout: 60000 });
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
        mkdirSync(dirname(reference.imagePath), { recursive: true });

        if (reference.type === "pg") {
            await page.screenshot({ path: reference.imagePath, fullPage: true, type: getImageType(reference.imagePath) });
        } else {
            const element = await page.$("#graph-canvas");
            await page.setViewport({ width: 1700, height: 800 });
            await element!.screenshot({ path: reference.imagePath, type: getImageType(reference.imagePath) });
        }

        console.log(`Generated ${reference.imageUrl} from ${reference.documentationPage}.`);
    } finally {
        await browser.close();
    }
};

const main = async () => {
    const report = createExampleImageReport(getContentGraph());

    mkdirSync(contentArtifactsDirectory, { recursive: true });
    writeFileSync(join(contentArtifactsDirectory, "example-image-report.json"), `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf-8" });

    console.log(formatExampleImageReport(report));

    if (dryRun || report.missingImages.length === 0) {
        process.exitCode = dryRun && strict && report.missingImages.length > 0 ? 1 : 0;
        return;
    }

    for (const reference of report.missingImages) {
        try {
            await generateExampleImage(reference);
        } catch (error) {
            console.log(error);
            console.log(`Failed to generate ${reference.imageUrl} from ${reference.documentationPage}.`);
            process.exitCode = 1;
        }
    }
};

void main();