import { existsSync } from "fs";
import { join } from "path";

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

export const formatExampleImageReport = (report: ExampleImageReport, warningLimit = 25) => {
    const lines = [`Example image check: ${report.checkedImages} image(s), ${report.missingImages.length} missing, ${report.existingImages.length} existing.`];

    report.missingImages.slice(0, warningLimit).forEach((reference) => {
        lines.push(`MISSING ${reference.imageUrl} (${reference.documentationPage}${reference.sourcePath ? ` ${reference.sourcePath}` : ""})`);
    });

    if (report.missingImages.length > warningLimit) {
        lines.push(`... ${report.missingImages.length - warningLimit} additional missing image(s) omitted.`);
    }

    return lines.join("\n");
};