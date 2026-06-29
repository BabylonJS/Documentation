import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import os, { tmpdir } from "os";
import { join } from "path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { createTypeDocSearchArtifacts, getTypeDocFiles, writeTypeDocSearchArtifacts } from "../lib/buildUtils/typedoc.utils";

const tempDirectories: string[] = [];
const localArtifactsDirectories: string[] = [];

const createTempDirectory = () => {
    const directory = mkdtempSync(join(tmpdir(), "typedoc-artifacts-"));
    tempDirectories.push(directory);
    return directory;
};

const writeHtmlFile = (basePath: string, kind: string, fileName: string) => {
    const directory = join(basePath, "files", kind);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, fileName), "<html><head><title>Test</title></head><body></body></html>", { encoding: "utf-8" });
};

afterEach(() => {
    vi.restoreAllMocks();
    while (tempDirectories.length) {
        rmSync(tempDirectories.pop()!, { recursive: true, force: true });
    }
    while (localArtifactsDirectories.length) {
        rmSync(localArtifactsDirectories.pop()!, { recursive: true, force: true });
    }
});

describe("TypeDoc artifact helpers", () => {
    it("uses generated TypeDoc file casing without adding lowercase route aliases", () => {
        vi.spyOn(os, "platform").mockReturnValue("linux");
        const baseLocation = "__typedoc-casing-test";
        const basePath = join(process.cwd(), ".temp", baseLocation, "docdirectory");
        const filesPath = join(basePath, "files");
        localArtifactsDirectories.push(join(process.cwd(), ".temp", baseLocation));

        if (existsSync(localArtifactsDirectories[0])) {
            rmSync(localArtifactsDirectories[0], { recursive: true, force: true });
        }

        writeHtmlFile(basePath, "classes", "_babylonjs_core.Scene.html");
        writeFileSync(join(filesPath, "index.html"), "<html></html>", { encoding: "utf-8" });

        const paths = getTypeDocFiles(baseLocation);

        expect(paths).toHaveLength(2);
        expect(paths).toEqual(expect.arrayContaining([
            { params: { id: ["classes", "_babylonjs_core.Scene"] } },
            { params: { id: ["index"] } },
        ]));
    });

    it("creates deterministic search and legacy redirect artifacts from generated HTML", () => {
        const basePath = createTempDirectory();
        writeHtmlFile(basePath, "classes", "_babylonjs_core.Scene.html");
        writeHtmlFile(basePath, "functions", "_babylonjs_core.CreateScene.html");
        writeHtmlFile(basePath, "modules", "_babylonjs_core.html");

        const artifacts = createTypeDocSearchArtifacts(basePath, "typedoc");

        expect(artifacts.manifest).toEqual([{ module: "@babylonjs/core", file: "babylonjs-core.json", count: 3 }]);
        expect(artifacts.byModule["@babylonjs/core"]).toEqual([
            { name: "@babylonjs/core", kind: "Module", url: "/typedoc/modules/_babylonjs_core" },
            { name: "CreateScene", kind: "Function", url: "/typedoc/functions/_babylonjs_core.CreateScene" },
            { name: "Scene", kind: "Class", url: "/typedoc/classes/_babylonjs_core.Scene" },
        ]);
        expect(artifacts.legacyRedirects).toEqual({
            "classes/Scene": "/typedoc/classes/_babylonjs_core.Scene",
            "functions/CreateScene": "/typedoc/functions/_babylonjs_core.CreateScene",
            "modules/@babylonjs/core": "/typedoc/modules/_babylonjs_core",
        });
    });

    it("writes API search files, manifest, and legacy redirects under the static output directory", () => {
        const outRoot = createTempDirectory();
        const artifacts = {
            byModule: {
                "@babylonjs/core": [{ name: "Scene", kind: "Class", url: "/typedoc/classes/_babylonjs_core.Scene" }],
            },
            manifest: [{ module: "@babylonjs/core", file: "babylonjs-core.json", count: 1 }],
            legacyRedirects: { "classes/Scene": "/typedoc/classes/_babylonjs_core.Scene" },
        };

        writeTypeDocSearchArtifacts(artifacts, "typedoc", true, outRoot);

        expect(JSON.parse(readFileSync(join(outRoot, "typedoc", "manifest.json"), "utf-8"))).toEqual(artifacts.manifest);
        expect(JSON.parse(readFileSync(join(outRoot, "typedoc", "babylonjs-core.json"), "utf-8"))).toEqual(artifacts.byModule["@babylonjs/core"]);
        expect(JSON.parse(readFileSync(join(outRoot, "typedoc", "legacy-redirects.json"), "utf-8"))).toEqual(artifacts.legacyRedirects);
    });
});
