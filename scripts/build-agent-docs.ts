import { mkdirSync, readdirSync, rmSync, writeFileSync } from "fs";
import { dirname, join } from "path";

import { createLlmsTxt, getAgentDocsSections, getMarkdownPath, renderPageMarkdown } from "../lib/agentDocs/markdownExport";
import { getBabylonLiteContentGraph } from "../lib/babylonLiteDocs";
import { getContentGraph } from "../lib/contentGraph/buildContentGraph";
import type { ContentGraph } from "../lib/contentGraph/types";

const publicDirectory = "public";
// Committed markdown assets live under public/img and must not be removed.
const preservedDirectories = new Set([join(publicDirectory, "img")]);

const removeGeneratedMarkdown = (directory: string) => {
    readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            if (!preservedDirectories.has(entryPath)) {
                removeGeneratedMarkdown(entryPath);
            }
        } else if (entry.name.endsWith(".md")) {
            rmSync(entryPath);
        }
    });
};

const writePages = (graph: ContentGraph, unknownComponents: Map<string, Set<string>>) => {
    let count = 0;
    graph.pages
        .filter((page) => !!page.contentPath)
        .forEach((page) => {
            const filePath = join(publicDirectory, getMarkdownPath(page.route));
            const markdown = renderPageMarkdown(page, {
                graph,
                onUnknownComponent: (name) => {
                    if (!unknownComponents.has(name)) {
                        unknownComponents.set(name, new Set());
                    }
                    unknownComponents.get(name)!.add(page.sourcePath || page.route);
                },
            });
            mkdirSync(dirname(filePath), { recursive: true });
            writeFileSync(filePath, markdown, { encoding: "utf-8" });
            count++;
        });
    return count;
};

async function main() {
    removeGeneratedMarkdown(publicDirectory);

    const unknownComponents = new Map<string, Set<string>>();
    const graph = getContentGraph();
    const liteGraph = await getBabylonLiteContentGraph();

    let pageCount = writePages(graph, unknownComponents);
    if (liteGraph) {
        pageCount += writePages(liteGraph, unknownComponents);
    }

    const sections = [...getAgentDocsSections(graph), ...(liteGraph ? getAgentDocsSections(liteGraph, { rootDepth: 1, title: "Babylon Lite" }) : [])];
    writeFileSync(join(publicDirectory, "llms.txt"), createLlmsTxt({ sections }), { encoding: "utf-8" });

    console.log(`Wrote ${pageCount} markdown page(s) and ${join(publicDirectory, "llms.txt")}.`);
    unknownComponents.forEach((files, name) => {
        console.warn(`Component <${name}> has no markdown conversion; its children were kept as-is in: ${Array.from(files).join(", ")}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
