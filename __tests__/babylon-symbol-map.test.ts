import { describe, expect, it } from "vitest";

import symbolMap from "../lib/codeVariants/babylon-symbol-map.json";
import { normalizeModuleSpecifier } from "../scripts/generate-babylon-symbol-map";

type NamespaceName = keyof typeof symbolMap.namespaces;
type GeneratedEntry = {
    status: string;
    resolution?: {
        package: string;
        importPath: string;
        typeOnly: boolean;
        pure: { available: boolean; importPath?: string };
    };
};

function resolved(namespace: NamespaceName, symbol: string) {
    const symbols = symbolMap.namespaces[namespace].symbols as Record<string, GeneratedEntry>;
    const entry = symbols[symbol];
    expect(entry, `${namespace}.${symbol} should be mapped`).toBeDefined();
    expect(entry.status).toBe("resolved");
    if (entry.status !== "resolved" || !entry.resolution) {
        throw new Error(`${namespace}.${symbol} is ${entry.status}`);
    }
    return entry.resolution;
}

describe("Babylon symbol map", () => {
    it("maps representative core classes and free functions to deep modules", () => {
        const camera = resolved("BABYLON", "ArcRotateCamera");
        expect(camera.package).toBe("@babylonjs/core");
        expect(camera.importPath).toBe("@babylonjs/core/Cameras/arcRotateCamera");

        const importer = resolved("BABYLON", "ImportMeshAsync");
        expect(importer.package).toBe("@babylonjs/core");
        expect(importer.importPath).toBe("@babylonjs/core/Loading/sceneLoader");
    });

    it("maps the GUI namespace alias and GUI controls", () => {
        expect(symbolMap.namespaceAliases["BABYLON.GUI"]).toEqual({
            parentNamespace: "BABYLON",
            symbol: "GUI",
            packages: ["@babylonjs/gui"],
            targetNamespace: "BABYLON.GUI",
        });

        const button = resolved("BABYLON.GUI", "Button");
        expect(button.package).toBe("@babylonjs/gui");
        expect(button.importPath).toBe("@babylonjs/gui/2D/controls/button");
    });

    it("maps materials without inventing a pure barrel", () => {
        const grid = resolved("BABYLON", "GridMaterial");
        expect(grid.package).toBe("@babylonjs/materials");
        expect(grid.importPath).toBe("@babylonjs/materials/grid/gridMaterial");
        expect(grid.pure).toEqual({ available: false });
    });

    it("records pure-barrel availability", () => {
        expect(resolved("BABYLON", "ArcRotateCamera").pure).toEqual({
            available: true,
            importPath: "@babylonjs/core/pure",
        });
        expect(resolved("BABYLON.GUI", "Button").pure).toEqual({
            available: true,
            importPath: "@babylonjs/gui/pure",
        });
    });

    it("records pure public members and free-function rewrites", () => {
        expect(symbolMap.schemaVersion).toBe(3);
        const pureCore = symbolMap.namespaces.BABYLON.purePackages["@babylonjs/core"];
        expect(pureCore.functions).toContain("AnimationParse");
        expect(pureCore.functions).toContain("RegisterAnimation");
        expect(pureCore.members.Animation).not.toContain("Parse");
        expect(pureCore.registeredMembers.Animation).toContain("Parse");
        expect(pureCore.members.MeshBuilder).toContain("CreateBox");
        expect(pureCore.members.SceneLoader).toContain("ImportMeshAsync");
    });

    it("maps public type-only declarations to authoritative deep modules", () => {
        expect(resolved("BABYLON", "FrameGraphTextureHandle")).toMatchObject({
            importPath: "@babylonjs/core/FrameGraph/frameGraphTypes",
            typeOnly: true,
            pure: { available: true, importPath: "@babylonjs/core/pure" },
        });
        expect(resolved("BABYLON", "IWebXRPlane")).toMatchObject({
            importPath: "@babylonjs/core/XR/features/WebXRPlaneDetector",
            typeOnly: true,
        });
        expect(resolved("BABYLON", "EffectWrapperCreationOptions")).toMatchObject({
            importPath: "@babylonjs/core/Materials/effectRenderer",
            typeOnly: true,
        });
    });

    it("generates nested compatibility aliases from official legacy declarations", () => {
        expect(symbolMap.namespaceAliases["BABYLON.Debug"]).toEqual({
            parentNamespace: "BABYLON",
            symbol: "Debug",
            packages: ["@babylonjs/core"],
            targetNamespace: "BABYLON",
            members: {
                AxesViewer: "AxesViewer",
                BoneAxesViewer: "BoneAxesViewer",
                PhysicsViewer: "PhysicsViewer",
                SkeletonViewer: "SkeletonViewer",
            },
        });
    });

    it("includes official addons present in the extracted package set", () => {
        expect(resolved("BABYLON", "Atmosphere")).toMatchObject({
            package: "@babylonjs/addons",
            importPath: "@babylonjs/addons/atmosphere/atmosphere",
            typeOnly: false,
        });
        const symbols = symbolMap.namespaces.BABYLON.symbols as Record<string, GeneratedEntry>;
        expect(symbols.RootMotionClip).toBeUndefined();
        expect(symbols.RootMotionController).toBeUndefined();
    });

    it("does not claim unavailable inspector or removed core exports", () => {
        expect(symbolMap.metadata.packageVersions).not.toHaveProperty("@babylonjs/inspector");
        expect(symbolMap.metadata.packageVersions).not.toHaveProperty("@babylonjs/inspector-v2");
        expect(symbolMap.namespaceAliases).not.toHaveProperty("BABYLON.INSPECTOR");
        for (const symbol of ["PoseEnabledController", "WebVRFreeCamera", "Gamepads", "SprayParticleEmitter"]) {
            expect(symbolMap.namespaces.BABYLON.symbols).not.toHaveProperty(symbol);
        }
    });

    it("normalizes declaration and implementation suffixes", () => {
        expect(normalizeModuleSpecifier("@babylonjs/core", "Meshes/Builders/boxBuilder.d.ts")).toBe(
            "@babylonjs/core/Meshes/Builders/boxBuilder",
        );
        expect(normalizeModuleSpecifier("@babylonjs/gui", "2D/controls/button.pure.js")).toBe(
            "@babylonjs/gui/2D/controls/button.pure",
        );
    });
});
