import { existsSync } from "fs";
import { join } from "path";

import sharp from "sharp";

import { getExampleImageUrl } from "../frontendUtils/frontendTools";
import type { ContentGraph, ContentGraphExampleReference, ContentGraphPage } from "./types";

export interface ExampleImageReference {
    type: ContentGraphExampleReference["type"];
    id: string;
    imageUrl: string;
    imagePath: string;
    documentationPage: string;
    sourcePath?: string;
    title?: string;
    engine?: ContentGraphExampleReference["engine"];
    snapshot?: string;
}

export interface ExampleImageReport {
    checkedImages: number;
    existingImages: ExampleImageReference[];
    missingImages: ExampleImageReference[];
    blankImages?: ExampleImageReference[];
}

const skippedExampleIds = new Set(["", "nmeId", "playgroundId"]);

const routeFromId = (id: string[]) => `/${id.join("/")}`;

const getRenderablePages = (graph: ContentGraph) => {
    const renderableRoutes = new Set(graph.routeManifest.map((route) => routeFromId(route.params.id)));
    return graph.pages.filter((page) => renderableRoutes.has(page.route));
};

export const getExampleImagePath = (imageUrl: string) => join(process.cwd(), "public", imageUrl.replace(/^\//, ""));

const createExampleImageReference = (page: ContentGraphPage, example: ContentGraphExampleReference): ExampleImageReference | undefined => {
    if (skippedExampleIds.has(example.id)) {
        return undefined;
    }

    const imageUrl = example.imageUrl || getExampleImageUrl({ type: example.type, id: example.id });
    return {
        type: example.type,
        id: example.id,
        imageUrl,
        imagePath: getExampleImagePath(imageUrl),
        documentationPage: page.route,
        sourcePath: page.sourcePath,
        title: example.title,
        engine: example.engine,
        snapshot: example.snapshot,
    };
};

export const collectExampleImageReferences = (graph: ContentGraph): ExampleImageReference[] => {
    const references = new Map<string, ExampleImageReference>();

    getRenderablePages(graph).forEach((page) => {
        page.examples.forEach((example) => {
            const reference = createExampleImageReference(page, example);
            if (reference) {
                references.set(reference.imagePath, reference);
            }
        });
    });

    return Array.from(references.values()).sort((left, right) => left.imageUrl.localeCompare(right.imageUrl));
};

export const createExampleImageReport = (graph: ContentGraph): ExampleImageReport => {
    const references = collectExampleImageReferences(graph);
    const existingImages: ExampleImageReference[] = [];
    const missingImages: ExampleImageReference[] = [];

    references.forEach((reference) => {
        if (existsSync(reference.imagePath)) {
            existingImages.push(reference);
        } else {
            missingImages.push(reference);
        }
    });

    return {
        checkedImages: references.length,
        existingImages,
        missingImages,
    };
};

/**
 * Maximum per-channel standard deviation (0-255 scale) below which an image is
 * considered blank/empty. A solid-color screenshot has a stdev of 0; real
 * playground renders measure well above 10 even for very simple scenes.
 */
export const blankImageStdevThreshold = 1;

/**
 * Detects whether an image file is blank (a single uniform color) or effectively
 * empty. Uses per-channel standard deviation so detection is independent of file
 * size and image format. Unreadable/corrupt images are treated as blank.
 */
export const isBlankImage = async (imagePath: string, threshold = blankImageStdevThreshold): Promise<boolean> => {
    try {
        const { channels } = await sharp(imagePath).stats();
        if (channels.length === 0) {
            return true;
        }

        // Ignore the alpha channel (if present) so a transparent-but-uniform image still counts as blank.
        const colorChannels = channels.length >= 3 ? channels.slice(0, 3) : channels;
        const maxStdev = Math.max(...colorChannels.map((channel) => channel.stdev));
        return maxStdev <= threshold;
    } catch {
        return true;
    }
};

/**
 * Scans a list of existing image references and returns the ones that are blank.
 * Runs with bounded concurrency to keep the check fast over thousands of images.
 */
export const detectBlankImages = async (references: ExampleImageReference[], concurrency = 8): Promise<ExampleImageReference[]> => {
    const blankImages: ExampleImageReference[] = [];
    let cursor = 0;

    const worker = async () => {
        while (cursor < references.length) {
            const reference = references[cursor++];
            if (await isBlankImage(reference.imagePath)) {
                blankImages.push(reference);
            }
        }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, references.length) }, () => worker()));

    return blankImages.sort((left, right) => left.imageUrl.localeCompare(right.imageUrl));
};

/**
 * Builds an example image report and additionally flags existing images that are
 * blank/empty. Blank images are reported separately so callers can regenerate them.
 */
export const createExampleImageReportWithBlanks = async (graph: ContentGraph): Promise<ExampleImageReport> => {
    const report = createExampleImageReport(graph);
    const blankImages = await detectBlankImages(report.existingImages);
    return { ...report, blankImages };
};

export const formatExampleImageReport = (report: ExampleImageReport, warningLimit = 25) => {
    const blankImages = report.blankImages ?? [];
    const lines = [
        `Example image check: ${report.checkedImages} image(s), ${report.missingImages.length} missing, ${blankImages.length} blank, ${report.existingImages.length} existing.`,
    ];

    report.missingImages.slice(0, warningLimit).forEach((reference) => {
        lines.push(`MISSING ${reference.imageUrl} (${reference.documentationPage}${reference.sourcePath ? ` ${reference.sourcePath}` : ""})`);
    });

    if (report.missingImages.length > warningLimit) {
        lines.push(`... ${report.missingImages.length - warningLimit} additional missing image(s) omitted.`);
    }

    blankImages.slice(0, warningLimit).forEach((reference) => {
        lines.push(`BLANK ${reference.imageUrl} (${reference.documentationPage}${reference.sourcePath ? ` ${reference.sourcePath}` : ""})`);
    });

    if (blankImages.length > warningLimit) {
        lines.push(`... ${blankImages.length - warningLimit} additional blank image(s) omitted.`);
    }

    return lines.join("\n");
};