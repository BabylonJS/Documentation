import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";

import { buildBabylonLiteContentGraphFromDocsRoot } from "../lib/babylonLiteDocs";
import { createDocumentationSearchIndex, createPlaygroundSearchIndex } from "../lib/contentGraph/staticArtifacts";

const fixtureRoot = join(process.cwd(), ".temp", "babylon-lite-docs-test");

const writeFixture = (relativePath: string, content: string) => {
    const filePath = join(fixtureRoot, relativePath);
    mkdirSync(join(filePath, ".."), { recursive: true });
    writeFileSync(filePath, content, "utf-8");
};

afterEach(() => {
    if (existsSync(fixtureRoot)) {
        rmSync(fixtureRoot, { recursive: true, force: true });
    }
});

describe("Babylon Lite documentation integration", () => {
    it("builds a flavor-scoped content graph from a Lite docs root", () => {
        writeFixture(
            "porting-guide.md",
            `---
title: Porting Guide
description: Move code to Babylon Lite.
---
# Porting Guide

<Playground id="ABC#1" title="Lite playground" />
`,
        );
        writeFixture(
            "architecture/00-overview.md",
            `# Architecture Overview

See the render loop.
`,
        );

        const graph = buildBabylonLiteContentGraphFromDocsRoot(fixtureRoot);
        const documentationItems = createDocumentationSearchIndex(graph, "lite");
        const playgroundItems = createPlaygroundSearchIndex(graph, "lite");

        expect(graph.pages.map((page) => page.route)).toEqual(["/lite/architecture/00-overview", "/lite"]);
        expect(graph.pagesByRoute["/lite"].metadata.title).toBe("Porting Guide");
        expect(graph.pagesByRoute["/lite"].previousId).toEqual(["lite", "architecture", "00-overview"]);
        expect(documentationItems.map((item) => item.flavor)).toEqual(["lite", "lite"]);
        expect(playgroundItems).toEqual([
            expect.objectContaining({
                flavor: "lite",
                playgroundId: "ABC#1",
                documentationPage: "/lite",
            }),
        ]);
    });
});