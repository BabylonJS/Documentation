import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";

import { buildBabylonLiteContentGraphFromDocsRoot, buildBabylonLiteMenuItemsFromRelativeFiles } from "../lib/babylonLiteDocs";
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
            "00-start.md",
            `---
title: Start Here
description: Start with Babylon Lite.
---
# Start Here
`,
        );
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

        expect(graph.pages.map((page) => page.route)).toEqual(["/lite", "/lite/architecture/00-overview", "/lite/porting-guide"]);
        expect(graph.pagesByRoute["/lite"].metadata.title).toBe("Start Here");
        expect(graph.pagesByRoute["/lite"].nextId).toEqual(["lite", "architecture", "00-overview"]);
        expect(documentationItems.map((item) => item.flavor)).toEqual(["lite", "lite", "lite"]);
        expect(playgroundItems).toEqual([
            expect.objectContaining({
                flavor: "lite",
                playgroundId: "ABC#1",
                documentationPage: "/lite/porting-guide",
            }),
        ]);
    });

    it("keeps top-level menu items in folder and file name order", () => {
        const menuItems = buildBabylonLiteMenuItemsFromRelativeFiles([
            "00-welcome.md",
            "01-porting-guide.md",
            "architecture/00-overview.md",
            "architecture/01-shadow-generator.md",
        ]);

        expect(menuItems?.map((item) => item.name)).toEqual(["Welcome", "Porting Guide", "Architecture"]);
        expect(menuItems?.map((item) => item.url)).toEqual(["/lite", "/lite/01-porting-guide", "/lite/architecture/00-overview"]);
    });

    it("rewrites GitHub-native relative links to absolute Lite routes", () => {
        writeFixture("00-welcome.md", "# Welcome\n\n![Diagram](images/diagram.png)\n");
        writeFixture(
            "01-getting-started.md",
            "# Getting Started\n\nSee [Overview](architecture/00-overview.md) and [Welcome](00-welcome.md#intro).\n",
        );
        writeFixture(
            "architecture/00-overview.md",
            "# Overview\n\nBack to [Getting Started](../01-getting-started.md), see [Scene](01-scene.md), the [external site](https://babylonjs.com), and a [code sample](example.md) escaping via `[x](../../outside.md)`.\n",
        );
        writeFixture("architecture/01-scene.md", "# Scene\n");

        const graph = buildBabylonLiteContentGraphFromDocsRoot(fixtureRoot);

        const gettingStarted = graph.pagesByRoute["/lite/01-getting-started"];
        expect(gettingStarted.rawContent).toContain("[Overview](/lite/architecture/00-overview)");
        // Landing file collapses to /lite and anchors are preserved.
        expect(gettingStarted.rawContent).toContain("[Welcome](/lite#intro)");

        const overview = graph.pagesByRoute["/lite/architecture/00-overview"];
        expect(overview.rawContent).toContain("[Getting Started](/lite/01-getting-started)");
        expect(overview.rawContent).toContain("[Scene](/lite/architecture/01-scene)");
        // External links and paths escaping the docs root are left untouched.
        expect(overview.rawContent).toContain("[external site](https://babylonjs.com)");
        expect(overview.rawContent).toContain("[x](../../outside.md)");

        // Relative image assets resolve to their served /lite path.
        expect(graph.pagesByRoute["/lite"].rawContent).toContain("![Diagram](/lite/images/diagram.png)");

        // Internal-link extraction now sees the resolved routes.
        expect(overview.internalLinks).toEqual(expect.arrayContaining(["lite/01-getting-started", "lite/architecture/01-scene"]));
    });
});