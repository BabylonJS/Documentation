import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { afterEach, describe, expect, it } from "vitest";

import { apiSearchIndexFileName, createTypeDocSearchIndex, createTypeDocSearchIndexItem, isFlavorFullyIndexed, readApiSearchIndex, writeApiSearchIndex } from "../lib/buildUtils/typedocSearchIndex.utils";

const tempDirectories: string[] = [];

const createTempDirectory = () => {
    const directory = mkdtempSync(join(tmpdir(), "typedoc-search-index-"));
    tempDirectories.push(directory);
    return directory;
};

const createPageHtml = (title: string, comment: string) =>
    `<html><head><title>${title} | Babylon.js API</title></head><body><div class="col-content"><section class="tsd-panel tsd-comment"><div class="tsd-comment tsd-typography"><p>${comment}</p></div></section><script>ignored()</script></div></body></html>`;

const writePage = (basePath: string, kind: string, fileName: string, html: string) => {
    const directory = join(basePath, "files", kind);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, fileName), html, { encoding: "utf-8" });
};

afterEach(() => {
    while (tempDirectories.length) {
        rmSync(tempDirectories.pop()!, { recursive: true, force: true });
    }
});

describe("TypeDoc API search index", () => {
    it("creates an API search record from a generated TypeDoc page", () => {
        const item = createTypeDocSearchIndexItem(createPageHtml("Scene", "Represents a scene to be rendered by the engine."), ["classes", "_babylonjs_core.Scene"], "typedoc", "babylon");

        expect(item).toEqual({
            id: "L3R5cGVkb2MvY2xhc3Nlcy9fYmFieWxvbmpzX2NvcmUuU2NlbmU=",
            flavor: "babylon",
            path: "/typedoc/classes/_babylonjs_core.Scene",
            isApi: true,
            title: "Scene",
            description: "Represents a scene to be rendered by the engine. [Babylon.js API]",
            content: expect.stringContaining("Represents a scene to be rendered by the engine."),
            keywords: ["classes", "_babylonjs_core.Scene"],
        });
        expect(item.content).not.toContain("ignored()");
    });

    it("labels lite API pages with the lite flavor", () => {
        const item = createTypeDocSearchIndexItem(createPageHtml("Scene", "Lite scene."), ["classes", "_babylonjs_lite.Scene"], "lite/typedoc", "lite");

        expect(item).toMatchObject({
            flavor: "lite",
            path: "/lite/typedoc/classes/_babylonjs_lite.Scene",
            description: "Lite scene. [Babylon Lite API]",
        });
    });

    it("falls back to the route id when a page has no comment", () => {
        const item = createTypeDocSearchIndexItem("<html><head></head><body></body></html>", ["modules", "_babylonjs_core"], "typedoc", "babylon");

        expect(item).toMatchObject({
            title: "Babylon.js API",
            description: "modules _babylonjs_core [Babylon.js API]",
        });
    });

    it("indexes every generated page sorted by path", () => {
        const basePath = createTempDirectory();
        writePage(basePath, "classes", "_babylonjs_core.Scene.html", createPageHtml("Scene", "A scene."));
        writePage(basePath, "functions", "_babylonjs_core.CreateScene.html", createPageHtml("CreateScene", "Creates a scene."));

        const items = createTypeDocSearchIndex("typedoc", "babylon", basePath);

        expect(items.map((item) => item.path)).toEqual(["/typedoc/classes/_babylonjs_core.Scene", "/typedoc/functions/_babylonjs_core.CreateScene"]);
        expect(items.every((item) => item.isApi)).toBe(true);
    });

    it("returns no records when TypeDoc artifacts are missing", () => {
        expect(createTypeDocSearchIndex("typedoc", "babylon", join(createTempDirectory(), "missing"))).toEqual([]);
    });

    it("writes and reads back the API search index artifact", () => {
        const outputDirectory = join(createTempDirectory(), "content");
        const artifact = {
            indexedTargets: ["typedoc"],
            items: [createTypeDocSearchIndexItem(createPageHtml("Scene", "A scene."), ["classes", "_babylonjs_core.Scene"], "typedoc", "babylon")],
        };

        const filePath = writeApiSearchIndex(artifact, outputDirectory);

        expect(filePath).toBe(join(outputDirectory, apiSearchIndexFileName));
        expect(readApiSearchIndex(filePath)).toEqual(artifact);
    });

    it("reads an empty artifact when the API search index is missing", () => {
        expect(readApiSearchIndex(join(createTempDirectory(), "missing.json"))).toEqual({ indexedTargets: [], items: [] });
    });

    it("only reports a flavor as fully indexed when all of its targets were generated", () => {
        expect(isFlavorFullyIndexed({ indexedTargets: ["typedoc", "packages/viewer"], items: [] }, "babylon")).toBe(true);
        // A missing viewer target would otherwise clear every babylon API document from the remote index.
        expect(isFlavorFullyIndexed({ indexedTargets: ["typedoc"], items: [] }, "babylon")).toBe(false);
        expect(isFlavorFullyIndexed({ indexedTargets: [], items: [] }, "babylon")).toBe(false);
        expect(isFlavorFullyIndexed({ indexedTargets: ["lite/typedoc"], items: [] }, "lite")).toBe(true);
        expect(isFlavorFullyIndexed({ indexedTargets: ["typedoc", "packages/viewer"], items: [] }, "lite")).toBe(false);
    });
});
