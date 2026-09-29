import { describe, expect, it } from "vitest";

import { transformBabylonCodeVariants } from "../lib/codeVariants/codeVariantTransformer";

describe("transformBabylonCodeVariants", () => {
    it("converts classes and free functions to standard deep imports and pure imports", () => {
        const result = transformBabylonCodeVariants(`
// Keep this camera setup comment.
const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
const box = BABYLON.CreateBox("box", {}, scene);
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6).toMatchObject({ kind: "standard-es6", success: true });
        expect(result.standardEs6.code).toContain(
            'import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";',
        );
        expect(result.standardEs6.code).toContain('import { Vector3 } from "@babylonjs/core/Maths/math.vector";');
        expect(result.standardEs6.code).toContain(
            'import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";',
        );
        expect(result.standardEs6.code).toContain("// Keep this camera setup comment.");
        expect(result.standardEs6.code).toContain("new ArcRotateCamera");
        expect(result.standardEs6.code).toContain("Vector3.Zero()");
        expect(result.standardEs6.code).toContain('CreateBox("box", {}, scene)');

        expect(result.es6Pure).toMatchObject({ kind: "es6-pure", success: true });
        expect(result.es6Pure.code).toContain(
            'import { ArcRotateCamera, CreateBox, Vector3 } from "@babylonjs/core/pure";',
        );
    });

    it("preserves compatibility-object members declared by the pure surface", () => {
        const result = transformBabylonCodeVariants(`
const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
const loaded = BABYLON.SceneLoader.ImportMeshAsync("", "/", "model.glb", scene);
const modern = BABYLON.ImportMeshAsync("model.glb", scene);
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain("MeshBuilder.CreateBox");
        expect(result.standardEs6.code).toContain("SceneLoader.ImportMeshAsync");
        expect(result.es6Pure.code).toContain(
            'import { ImportMeshAsync, MeshBuilder, SceneLoader } from "@babylonjs/core/pure";',
        );
        expect(result.es6Pure.code).toContain("MeshBuilder.CreateBox");
        expect(result.es6Pure.code).toContain("SceneLoader.ImportMeshAsync");
        expect(result.es6Pure.code).toContain('ImportMeshAsync("model.glb", scene)');
    });

    it("converts GUI namespace symbols", () => {
        const result = transformBabylonCodeVariants(
            'const button = BABYLON.GUI.Button.CreateSimpleButton("button", "Click");',
        );

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain('import { Button } from "@babylonjs/gui/2D/controls/button";');
        expect(result.standardEs6.code).toContain("Button.CreateSimpleButton");
        expect(result.es6Pure.code).toContain('import { Button } from "@babylonjs/gui/pure";');
        expect(result.es6Pure.code).toContain("Button.CreateSimpleButton");
    });

    it("rewrites an absent pure class static to its root-prefixed free function", () => {
        const result = transformBabylonCodeVariants("const animation = BABYLON.Animation.Parse(data);");

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain("Animation.Parse(data)");
        expect(result.es6Pure.code).toContain(
            'import { AnimationParse } from "@babylonjs/core/pure";',
        );
        expect(result.es6Pure.code).toContain("const animation = AnimationParse(data);");
        expect(result.es6Pure.code).not.toContain("RegisterAnimation");
    });

    it("registers an augmentation when no pure free-function rewrite exists", () => {
        const result = transformBabylonCodeVariants(
            "const isTexture = BABYLON.NodeMaterial._BlockIsTextureBlock(block);",
        );

        expect(result.diagnostics).toEqual([]);
        expect(result.es6Pure.code).toContain(
            'import { NodeMaterial, RegisterNodeMaterial } from "@babylonjs/core/pure";',
        );
        expect(result.es6Pure.code).toContain("RegisterNodeMaterial();");
        expect(result.es6Pure.code).toContain("NodeMaterial._BlockIsTextureBlock(block)");
    });

    it("aliases generated bindings deterministically when local names collide", () => {
        const result = transformBabylonCodeVariants(`
const Vector3 = makeVectorType();
const origin = BABYLON.Vector3.Zero();
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain(
            'import { Vector3 as Vector3Babylon } from "@babylonjs/core/Maths/math.vector";',
        );
        expect(result.standardEs6.code).toContain("Vector3Babylon.Zero()");
        expect(result.es6Pure.code).toContain(
            'import { Vector3 as Vector3Babylon } from "@babylonjs/core/pure";',
        );
    });

    it("converts Babylon references in interface properties and return types", () => {
        const result = transformBabylonCodeVariants(`
interface MeshOptions {
    position: BABYLON.Vector3;
    rotation?: BABYLON.Vector3;
}
const createMesh = (options: MeshOptions): BABYLON.Mesh => {
    const mesh = BABYLON.MeshBuilder.CreateBox(options.name, {}, scene);
    return mesh;
};
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6).toMatchObject({ kind: "standard-es6", success: true });
        expect(result.standardEs6.code).toContain(
            'import type { Mesh } from "@babylonjs/core/Meshes/mesh";',
        );
        expect(result.standardEs6.code).toContain(
            'import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";',
        );
        expect(result.standardEs6.code).toContain(
            'import type { Vector3 } from "@babylonjs/core/Maths/math.vector";',
        );
        expect(result.standardEs6.code).toContain("position: Vector3;");
        expect(result.standardEs6.code).toContain("(options: MeshOptions): Mesh =>");
        expect(result.standardEs6.code).not.toContain("BABYLON.");

        expect(result.es6Pure).toMatchObject({ kind: "es6-pure", success: true });
        expect(result.es6Pure.code).toContain('import { MeshBuilder } from "@babylonjs/core/pure";');
        expect(result.es6Pure.code).toContain('import type { Mesh, Vector3 } from "@babylonjs/core/pure";');
        expect(result.es6Pure.code).not.toContain("BABYLON.");
    });

    it("converts nested generic, predicate, query, and heritage type names", () => {
        const result = transformBabylonCodeVariants(`
interface MeshStream extends BABYLON.Observable<BABYLON.Mesh> {
    current: Promise<ReadonlyArray<BABYLON.Mesh>>;
    isMesh(value: unknown): value is BABYLON.Mesh;
}
type MeshConstructor = typeof BABYLON.Mesh;
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6).toMatchObject({ success: true });
        expect(result.standardEs6.code).toContain("extends Observable<Mesh>");
        expect(result.standardEs6.code).toContain("ReadonlyArray<Mesh>");
        expect(result.standardEs6.code).toContain("value is Mesh");
        expect(result.standardEs6.code).toContain("typeof Mesh");
        expect(result.standardEs6.code).not.toContain("BABYLON.");
        expect(result.es6Pure).toMatchObject({ success: true });
        expect(result.es6Pure.code).toContain('import { Mesh } from "@babylonjs/core/pure";');
        expect(result.es6Pure.code).toContain('import type { Observable } from "@babylonjs/core/pure";');
        expect(result.es6Pure.code).not.toContain("BABYLON.");
    });

    it("converts nested GUI qualified names in type positions", () => {
        const result = transformBabylonCodeVariants(`
type GuiFactory = typeof BABYLON.GUI.AdvancedDynamicTexture;
interface GuiState {
    controls: Array<BABYLON.GUI.Control | BABYLON.GUI.Button>;
}
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6).toMatchObject({ success: true });
        expect(result.standardEs6.code).toContain(
            'import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";',
        );
        expect(result.standardEs6.code).toContain(
            'import type { Button } from "@babylonjs/gui/2D/controls/button";',
        );
        expect(result.standardEs6.code).toContain(
            'import type { Control } from "@babylonjs/gui/2D/controls/control";',
        );
        expect(result.standardEs6.code).not.toContain("BABYLON.GUI");
        expect(result.es6Pure.code).toContain('import { AdvancedDynamicTexture } from "@babylonjs/gui/pure";');
        expect(result.es6Pure.code).toContain('import type { Button, Control } from "@babylonjs/gui/pure";');
        expect(result.es6Pure.code).not.toContain("BABYLON.GUI");
    });

    it("aliases imports that collide with declarations in type positions", () => {
        const result = transformBabylonCodeVariants(`
interface Mesh {
    local: true;
}
type BabylonMesh = BABYLON.Mesh;
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain(
            'import type { Mesh as MeshBabylon } from "@babylonjs/core/Meshes/mesh";',
        );
        expect(result.standardEs6.code).toContain("type BabylonMesh = MeshBabylon;");
        expect(result.es6Pure.code).toContain(
            'import type { Mesh as MeshBabylon } from "@babylonjs/core/pure";',
        );
        expect(result.es6Pure.code).toContain("type BabylonMesh = MeshBabylon;");
    });

    it("uses import type for declarations that exist only in the type surface", () => {
        const result = transformBabylonCodeVariants(`
type Handle = BABYLON.FrameGraphTextureHandle;
interface PlaneState {
    plane: BABYLON.IWebXRPlane;
    depth: BABYLON.IWebXRDepthSensingOptions;
}
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain(
            'import type { FrameGraphTextureHandle } from "@babylonjs/core/FrameGraph/frameGraphTypes";',
        );
        expect(result.standardEs6.code).toContain(
            'import type { IWebXRDepthSensingOptions } from "@babylonjs/core/XR/features/WebXRDepthSensing";',
        );
        expect(result.standardEs6.code).toContain(
            'import type { IWebXRPlane } from "@babylonjs/core/XR/features/WebXRPlaneDetector";',
        );
        expect(result.es6Pure.code).toContain(
            'import type { FrameGraphTextureHandle, IWebXRDepthSensingOptions, IWebXRPlane } from "@babylonjs/core/pure";',
        );
    });

    it("reports runtime use when only a type export exists", () => {
        const result = transformBabylonCodeVariants("const handle = BABYLON.FrameGraphTextureHandle;");

        expect(result.standardEs6).toEqual({ kind: "standard-es6", success: false });
        expect(result.es6Pure).toEqual({ kind: "es6-pure", success: false });
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "type-only-symbol-used-as-value",
                variant: "standard-es6",
                symbol: "FrameGraphTextureHandle",
            }),
            expect.objectContaining({
                code: "type-only-symbol-used-as-value",
                variant: "es6-pure",
                symbol: "FrameGraphTextureHandle",
            }),
        ]);
    });

    it("upgrades a type-position request when the same symbol is also used as a value", () => {
        const result = transformBabylonCodeVariants(`
type BabylonMesh = BABYLON.Mesh;
const mesh = new BABYLON.Mesh("mesh", scene);
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain(
            'import { Mesh } from "@babylonjs/core/Meshes/mesh";',
        );
        expect(result.standardEs6.code).not.toContain("import type { Mesh }");
        expect(result.es6Pure.code).toContain('import { Mesh } from "@babylonjs/core/pure";');
        expect(result.es6Pure.code).not.toContain("import type { Mesh }");
    });

    it("collapses generated nested compatibility namespace aliases", () => {
        const result = transformBabylonCodeVariants(
            "const axes = new BABYLON.Debug.AxesViewer(scene);",
        );

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain(
            'import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";',
        );
        expect(result.standardEs6.code).toContain("new AxesViewer(scene)");
        expect(result.standardEs6.code).not.toContain("BABYLON.Debug");
        expect(result.es6Pure.code).toContain(
            'import { AxesViewer } from "@babylonjs/core/pure";',
        );
    });

    it("maps official addon exports that are present without inventing pure support", () => {
        const runtime = transformBabylonCodeVariants("const atmosphere = new BABYLON.Atmosphere(scene);");
        expect(runtime.standardEs6.code).toContain(
            'import { Atmosphere } from "@babylonjs/addons/atmosphere/atmosphere";',
        );
        expect(runtime.es6Pure).toEqual({ kind: "es6-pure", success: false });

        const typeOnly = transformBabylonCodeVariants("type Font = BABYLON.BMFont;");
        expect(typeOnly.standardEs6.code).toContain(
            'import type { BMFont } from "@babylonjs/addons/msdfText/sdf/bmFont";',
        );
        expect(typeOnly.es6Pure).toEqual({ kind: "es6-pure", success: false });
    });

    it("keeps removed and unavailable package APIs unmapped", () => {
        for (const symbol of [
            "PoseEnabledController",
            "WebVRFreeCamera",
            "Gamepads",
            "SprayParticleEmitter",
            "RootMotionClip",
            "RootMotionController",
            "INSPECTOR",
        ]) {
            const result = transformBabylonCodeVariants(`const value = BABYLON.${symbol};`);
            expect(result.standardEs6).toEqual({ kind: "standard-es6", success: false });
            expect(result.diagnostics).toContainEqual(
                expect.objectContaining({
                    code: "unmapped-symbol",
                    variant: "standard-es6",
                    symbol,
                }),
            );
        }
    });

    it("applies pure availability diagnostics to type positions", () => {
        const result = transformBabylonCodeVariants("type Material = BABYLON.GridMaterial;");

        expect(result.standardEs6).toMatchObject({ kind: "standard-es6", success: true });
        expect(result.standardEs6.code).toContain(
            'import type { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";',
        );
        expect(result.standardEs6.code).toContain("type Material = GridMaterial;");
        expect(result.es6Pure).toEqual({ kind: "es6-pure", success: false });
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "unsupported-pure-symbol",
                variant: "es6-pure",
                symbol: "GridMaterial",
            }),
        ]);
    });

    it("fails the postcondition when an unconverted Babylon namespace access remains", () => {
        const result = transformBabylonCodeVariants('const meshType = BABYLON["Mesh"];');

        expect(result.standardEs6).toEqual({ kind: "standard-es6", success: false });
        expect(result.es6Pure).toEqual({ kind: "es6-pure", success: false });
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "unconverted-namespace-reference",
                variant: "standard-es6",
                symbol: "Mesh",
            }),
            expect.objectContaining({
                code: "unconverted-namespace-reference",
                variant: "es6-pure",
                symbol: "Mesh",
            }),
        ]);
    });

    it("reuses and merges existing imports without removing them", () => {
        const result = transformBabylonCodeVariants(`
import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Vector3 as PureVector } from "@babylonjs/core/pure";
const standard = BABYLON.Vector3.Zero();
`);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain(
            'import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";',
        );
        expect(result.standardEs6.code).toContain(
            'import { Vector3 as PureVector } from "@babylonjs/core/pure";',
        );
        expect(result.es6Pure.code).toContain("const standard = PureVector.Zero();");
        expect(result.es6Pure.code?.match(/from "@babylonjs\/core\/pure"/g)).toHaveLength(1);
    });

    it("reports an unmapped extension symbol without success-shaped output", () => {
        const result = transformBabylonCodeVariants("const terrain = new BABYLON.DynamicTerrain(options, scene);");

        expect(result.standardEs6).toEqual({ kind: "standard-es6", success: false });
        expect(result.es6Pure).toEqual({ kind: "es6-pure", success: false });
        expect(result.diagnostics).toHaveLength(2);
        expect(result.diagnostics.every((diagnostic) => diagnostic.code === "unmapped-symbol")).toBe(true);
        expect(result.diagnostics[0]).toMatchObject({
            symbol: "DynamicTerrain",
            start: { line: 1, column: 21 },
        });
    });

    it("reports pure members that have no authoritative rewrite", () => {
        const result = transformBabylonCodeVariants("BABYLON.Vector3.NotARealStatic();");

        expect(result.standardEs6.success).toBe(true);
        expect(result.es6Pure).toEqual({ kind: "es6-pure", success: false });
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "unsupported-pure-member",
                variant: "es6-pure",
                symbol: "Vector3",
                member: "NotARealStatic",
            }),
        ]);
    });

    it("does not fall back to a side-effectful module for a non-pure symbol", () => {
        const result = transformBabylonCodeVariants("const material = new BABYLON.GridMaterial('grid', scene);");

        expect(result.standardEs6.success).toBe(true);
        expect(result.standardEs6.code).toContain(
            'import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";',
        );
        expect(result.es6Pure).toEqual({ kind: "es6-pure", success: false });
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "unsupported-pure-symbol",
                variant: "es6-pure",
                symbol: "GridMaterial",
            }),
        ]);
    });

    it("uses the scanner fallback for parser failures without Babylon references", () => {
        const result = transformBabylonCodeVariants("const broken = ;");

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6).toEqual({
            kind: "standard-es6",
            success: true,
            code: "const broken = ;",
        });
        expect(result.es6Pure).toEqual({
            kind: "es6-pure",
            success: true,
            code: "const broken = ;",
        });
    });

    it("preserves ellipsis placeholders while converting their namespace chain", () => {
        const source = "const box = BABYLON.MeshBuilder.CreateBox(...);";
        const result = transformBabylonCodeVariants(source);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toBe(
            'import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";\n' +
                source.replace("BABYLON.MeshBuilder", "MeshBuilder"),
        );
        expect(result.es6Pure.code).toBe(
            'import { MeshBuilder } from "@babylonjs/core/pure";\n' +
                source.replace("BABYLON.MeshBuilder", "MeshBuilder"),
        );
    });

    it("preserves incomplete function fragments and invalid prose placeholders byte-for-byte", () => {
        const source = `function setup(scene) {
    // This fragment intentionally has no closing brace.
    const origin = BABYLON.Vector3.Zero();
    <replace with application-specific setup>
`;
        const result = transformBabylonCodeVariants(source);

        expect(result.diagnostics).toEqual([]);
        const expectedBody = source.replace("BABYLON.Vector3", "Vector3");
        expect(result.standardEs6.code).toBe(
            'import { Vector3 } from "@babylonjs/core/Maths/math.vector";\n' + expectedBody,
        );
        expect(result.es6Pure.code).toBe(
            'import { Vector3 } from "@babylonjs/core/pure";\n' + expectedBody,
        );
    });

    it("preserves comments and whitespace embedded inside converted chains", () => {
        const source =
            "const origin = BABYLON /* namespace */ . /* separator */ Vector3 /* symbol */ .Zero(...);";
        const result = transformBabylonCodeVariants(`${source}\nconst broken = ;`);

        expect(result.diagnostics).toEqual([]);
        const expectedBody =
            "const origin = Vector3 /* namespace */  /* separator */  /* symbol */ .Zero(...);\n" +
            "const broken = ;";
        expect(result.standardEs6.code).toBe(
            'import { Vector3 } from "@babylonjs/core/Maths/math.vector";\n' + expectedBody,
        );
        expect(result.es6Pure.code).toBe(
            'import { Vector3 } from "@babylonjs/core/pure";\n' + expectedBody,
        );
    });

    it("ignores namespace-looking text in comments, strings, template text, and regular expressions", () => {
        const source = `// BABYLON.Mesh stays in this comment.
const label = "BABYLON.GUI.Button";
const matcher = /BABYLON\\.Vector3/;
const message = \`BABYLON.Mesh \${BABYLON.Vector3.Zero()} BABYLON.GUI.Button\`;
const broken = ;
`;
        const result = transformBabylonCodeVariants(source);

        expect(result.diagnostics).toEqual([]);
        const expectedBody = source.replace("${BABYLON.Vector3", "${Vector3");
        expect(result.standardEs6.code).toBe(
            'import { Vector3 } from "@babylonjs/core/Maths/math.vector";\n' + expectedBody,
        );
        expect(result.es6Pure.code).toBe(
            'import { Vector3 } from "@babylonjs/core/pure";\n' + expectedBody,
        );
    });

    it("aliases fallback imports conservatively and deterministically", () => {
        const source = `const Vector3 = localVector;
const Vector3Babylon = anotherLocal;
const origin = BABYLON.Vector3.Zero();
const broken = ;
`;
        const result = transformBabylonCodeVariants(source);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toBe(
            'import { Vector3 as Vector3Babylon2 } from "@babylonjs/core/Maths/math.vector";\n' +
                source.replace("BABYLON.Vector3", "Vector3Babylon2"),
        );
        expect(result.es6Pure.code).toBe(
            'import { Vector3 as Vector3Babylon2 } from "@babylonjs/core/pure";\n' +
                source.replace("BABYLON.Vector3", "Vector3Babylon2"),
        );
    });

    it("converts GUI chains and leaves existing imports intact in fallback mode", () => {
        const source = `import { Control } from "@babylonjs/gui/2D/controls/control";
const button = BABYLON.GUI.Button.CreateSimpleButton(...);
const broken = ;
`;
        const result = transformBabylonCodeVariants(source);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toBe(
            'import { Button } from "@babylonjs/gui/2D/controls/button";\n' +
                source.replace("BABYLON.GUI.Button", "Button"),
        );
        expect(result.es6Pure.code).toBe(
            'import { Button } from "@babylonjs/gui/pure";\n' +
                source.replace("BABYLON.GUI.Button", "Button"),
        );
    });

    it("converts namespace chains in invalid type-like fragments", () => {
        const source = `type Factory = (value: BABYLON.Mesh) => BABYLON.Vector3;
type Invalid = BABYLON.GUI.Control | <control type>;
type Parser = BABYLON.Animation.Parse | <parser type>;
`;
        const result = transformBabylonCodeVariants(source);

        expect(result.diagnostics).toEqual([]);
        expect(result.standardEs6.code).toContain(
            'import type { Control } from "@babylonjs/gui/2D/controls/control";',
        );
        expect(result.standardEs6.code).toContain('import type { Mesh } from "@babylonjs/core/Meshes/mesh";');
        expect(result.standardEs6.code).toContain(
            'import type { Vector3 } from "@babylonjs/core/Maths/math.vector";',
        );
        expect(result.standardEs6.code).toContain(
            "type Factory = (value: Mesh) => Vector3;",
        );
        expect(result.standardEs6.code).toContain(
            "type Invalid = Control | <control type>;",
        );
        expect(result.standardEs6.code).toContain(
            "type Parser = Animation.Parse | <parser type>;",
        );
        expect(result.es6Pure.code).toContain(
            'import type { Animation, Mesh, Vector3 } from "@babylonjs/core/pure";',
        );
        expect(result.es6Pure.code).toContain(
            'import type { Control } from "@babylonjs/gui/pure";',
        );
        expect(result.es6Pure.code).toContain(
            "type Parser = Animation.Parse | <parser type>;",
        );
        expect(result.es6Pure.code).not.toContain("AnimationParse");
    });

    it("uses pure free-function and registration rewrites in fallback mode", () => {
        const source = `const animation = BABYLON.Animation.Parse(...);
const isTexture = BABYLON.NodeMaterial._BlockIsTextureBlock(...);
const broken = ;
`;
        const result = transformBabylonCodeVariants(source);

        expect(result.diagnostics).toEqual([]);
        expect(result.es6Pure.code).toContain(
            'import { AnimationParse, NodeMaterial, RegisterNodeMaterial } from "@babylonjs/core/pure";',
        );
        expect(result.es6Pure.code).toContain("RegisterNodeMaterial();");
        expect(result.es6Pure.code).toContain("const animation = AnimationParse(...);");
        expect(result.es6Pure.code).toContain(
            "const isTexture = NodeMaterial._BlockIsTextureBlock(...);",
        );
    });

    it("fails fallback variants without code for unsupported symbols", () => {
        const result = transformBabylonCodeVariants(
            "const terrain = new BABYLON.DynamicTerrain(...);\nconst broken = ;",
        );

        expect(result.standardEs6).toEqual({ kind: "standard-es6", success: false });
        expect(result.es6Pure).toEqual({ kind: "es6-pure", success: false });
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "unmapped-symbol",
                variant: "standard-es6",
                symbol: "DynamicTerrain",
            }),
            expect.objectContaining({
                code: "unmapped-symbol",
                variant: "es6-pure",
                symbol: "DynamicTerrain",
            }),
        ]);
    });

    it("enforces the fallback postcondition for unsupported namespace access syntax", () => {
        const result = transformBabylonCodeVariants(
            'const meshType = BABYLON["Mesh"];\nconst broken = ;',
        );

        expect(result.standardEs6).toEqual({ kind: "standard-es6", success: false });
        expect(result.es6Pure).toEqual({ kind: "es6-pure", success: false });
        expect(result.diagnostics).toEqual([
            expect.objectContaining({
                code: "unconverted-namespace-reference",
                variant: "standard-es6",
            }),
            expect.objectContaining({
                code: "unconverted-namespace-reference",
                variant: "es6-pure",
            }),
        ]);
    });

    it("keeps valid-source AST output unchanged", () => {
        const result = transformBabylonCodeVariants("const origin = BABYLON.Vector3.Zero();");

        expect(result.standardEs6.code).toBe(
            'import { Vector3 } from "@babylonjs/core/Maths/math.vector";\n' +
                "const origin = Vector3.Zero();\n",
        );
        expect(result.es6Pure.code).toBe(
            'import { Vector3 } from "@babylonjs/core/pure";\n' +
                "const origin = Vector3.Zero();\n",
        );
    });
});
