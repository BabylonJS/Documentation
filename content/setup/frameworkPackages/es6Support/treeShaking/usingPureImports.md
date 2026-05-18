---
title: Using Pure Imports
image:
description: Import Babylon.js through pure paths and the pure barrel without losing tree-shaking.
keywords: babylon.js, pure imports, pure barrel, es6, npm, tree shaking, bundlers
further-reading:
  - title: Tree-Shaking with Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking
  - title: Registering Side Effects
    url: /setup/frameworkPackages/es6Support/treeShaking/registeringSideEffects
  - title: Troubleshooting Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking/troubleshooting
video-overview:
video-content:
---

## Import Paths

Every module in `@babylonjs/core` is available through the existing import path and, where applicable, a pure import path:

```typescript
// Existing path: includes side effects.
import { Scene } from "@babylonjs/core/scene";

// Pure path: tree-shakeable, with side effects registered manually.
import { Scene } from "@babylonjs/core/pure";
```

## The Pure Barrel

Instead of importing from individual deep paths, you can use the pure barrel:

```typescript
import { Scene, Engine, Vector3, Color3, FreeCamera } from "@babylonjs/core/pure";
```

The pure barrel re-exports the pure module graph. Your bundler figures out which symbols you actually use and removes the rest. The result is the same as importing from individual pure files, but the barrel is more convenient.

## Subdirectory Barrels

Subdirectories also expose pure barrels. Use the top-level `@babylonjs/core/pure` barrel by default; these grouped barrels are available when you intentionally want a narrower import surface:

```typescript
import { Vector3, Quaternion, Matrix } from "@babylonjs/core/Maths/pure";
import { FreeCamera, ArcRotateCamera } from "@babylonjs/core/Cameras/pure";
import { PointLight, DirectionalLight } from "@babylonjs/core/Lights/pure";
```

Use these when you want a smaller grouped import surface than the top-level pure barrel.

## What Pure Imports Include

Pure imports include:

- Class definitions, such as `Scene`, `Engine`, `Mesh`, and `Camera`.
- Functions and utilities, such as `MeshBuilder`, math helpers, and tools.
- Type definitions, interfaces, enums, and type aliases.
- Registration functions, such as `RegisterStandardMaterial()`.

Pure imports do not automatically run:

- `RegisterClass()` calls needed for deserialization by class name.
- Prototype augmentations, such as methods added to `Scene`.
- Shader registrations into the global shader store.
- Feature registrations for systems such as XR, physics, rendering extensions, and node editors.

## Registration Functions

Every side effect is wrapped in a callable registration function exported from the corresponding pure module:

```typescript
import { RegisterStandardMaterial, RegisterJoinedPhysicsEngineComponent, RegisterRay } from "@babylonjs/core/pure";

RegisterStandardMaterial();
RegisterJoinedPhysicsEngineComponent();
RegisterRay();
```

Registration functions are:

- Safe to call multiple times. Only the first call does anything; repeat calls are ignored.
- Discoverable in IDE autocomplete by typing `Register`.
- Named predictably with `Register` plus the PascalCase file name, such as `RegisterEngineMultiRender()`.

## Type Augmentations

Optional features can add methods and properties to core classes through TypeScript module augmentation. With pure imports, import the `.types` module to make TypeScript aware of those members:

```typescript
import { Scene, RegisterJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent.types";

RegisterJoinedPhysicsEngineComponent();

const scene = new Scene(engine);
scene.enablePhysics();
```

Without the `.types` import, TypeScript will not recognize the augmented method. This compile-time error is useful because it reminds you to register the feature you plan to use.

If you import from the existing non-pure path, the wrapper path includes its side effects and type exports automatically.

## Static Functions (Extracted as Free Functions)

In the tree-shaking architecture, static methods that previously lived on classes have been extracted into standalone exported functions in the `.pure.ts` files. The class statics are **not** defined in the class body — instead, they're assigned only inside the registration function (the side-effects file):

```typescript
// In animation.pure.ts:

export class Animation {
  // No static Parse() in the class body!
  // ...
}

// The free function is exported separately — always available from .pure.ts:
export function AnimationParse(parsedAnimation: any): Animation {
  // ... actual implementation ...
}

// Inside the registration function (called by animation.ts):
export function RegisterAnimation(): void {
  // ...
  Animation.Parse = AnimationParse; // static only assigned here
  RegisterClass("BABYLON.Animation", Animation);
}
```

The class static (`Animation.Parse`, etc.) is **not** defined in the class body — it's only assigned inside the registration function. This means:

- **From `.pure.ts`**: You can import the free function directly. The class itself won't have the static method.
- **After registration**: The static method becomes available on the class (for backward compat).

```typescript
// Pure: import and use the free function directly (no registration needed):
import { AnimationParse } from "@babylonjs/core/pure";
const anim = AnimationParse(data);

// Legacy: the class static only works AFTER calling the registration function:
import { Animation, RegisterAnimation } from "@babylonjs/core/pure";
RegisterAnimation(); // assigns Animation.Parse = AnimationParse
const anim = Animation.Parse(data); // now works

// Alternatively you can always import directly from the legacy path, which includes the registration side effects:
import { Animation } from "@babylonjs/core/Animations/animation";
const anim = Animation.Parse(data); // works because the existing path registers side effects
```

The naming convention is `ClassName` + `MethodName`:

| Class Static                             | Extracted Free Function                 |
| ---------------------------------------- | --------------------------------------- |
| `AnimationGroup.Parse(...)`              | `AnimationGroupParse(...)`              |
| `Animation.CreateAndStartAnimation(...)` | `AnimationCreateAndStartAnimation(...)` |
| `ReflectionProbe.Parse(...)`             | `ReflectionProbeParse(...)`             |
| `Node.ParseAnimationRanges(...)`         | `NodeParseAnimationRanges(...)`         |

Additionally, math operations are available as structural-typed free functions in dedicated `.functions.ts` files:

```typescript
// Structural interface — no class dependency at all:
import { Vector3CrossToRef } from "@babylonjs/core/Maths/math.vector.functions";
Vector3CrossToRef(a, b, result);
```

Available function files:

- `@babylonjs/core/Maths/math.vector.functions` — Vector2/3/4, Quaternion, Matrix operations
- `@babylonjs/core/Maths/math.color.functions` — Color3/4 operations

## Bundler Configuration

### Vite

Vite uses Rollup internally. No special configuration is normally required for pure imports:

```typescript
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  // Vite handles .pure imports correctly.
  // The package sideEffects metadata guides tree-shaking.
});
```

### Webpack

Webpack respects the `sideEffects` field in `package.json`. Make sure tree-shaking is enabled for production builds:

```javascript
module.exports = {
  optimization: {
    usedExports: true, // Enable tree-shaking (default in production)
    sideEffects: true, // Respect package sideEffects metadata (default)
  },
};
```

### Rollup

Rollup-based builds can mark pure modules as side-effect-free if additional control is needed:

```javascript
import { readFileSync } from "fs";

function markPureModules() {
  return {
    name: "mark-pure-modules",
    load(id) {
      if (/\.pure\.(js|ts)$/.test(id) || /\.functions\.(js|ts)$/.test(id)) {
        const code = readFileSync(id, "utf8");
        return { code, moduleSideEffects: false };
      }
      return null;
    },
  };
}

export default {
  plugins: [markPureModules() /* ... other plugins */],
};
```

## Common Patterns

### Physics Playground

This example uses Physics V2 with Havok, a ground plane, falling spheres, a hinged box chain, and shadows. It assumes your HTML contains a `<canvas id="renderCanvas"></canvas>` element and that `@babylonjs/havok` is installed.

```typescript
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  CreateSphere,
  CreateBox,
  CreateGround,
  PBRMaterial,
  Color3,
  Color4,
  Vector3,
  ShadowGenerator,
  PhysicsAggregate,
  PhysicsShapeType,
  HavokPlugin,
  HingeConstraint,
  RegisterStandardEngineExtensions,
  RegisterJoinedPhysicsEngineComponent,
  RegisterPhysicsV2PhysicsEngineComponent,
} from "@babylonjs/core/pure.js";

// Engine extensions required for rendering
RegisterStandardEngineExtensions();

// Physics v2 engine components
RegisterJoinedPhysicsEngineComponent();
RegisterPhysicsV2PhysicsEngineComponent();

function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.05, 0.05, 0.1, 1);

  const camera = new ArcRotateCamera("camera", -Math.PI / 4, Math.PI / 3, 20, new Vector3(0, 3, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 8;
  camera.upperRadiusLimit = 40;

  const ambientLight = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
  ambientLight.intensity = 0.3;

  const directionalLight = new DirectionalLight("dirLight", new Vector3(-1, -2, 1).normalize(), scene);
  directionalLight.position = new Vector3(5, 10, -5);
  directionalLight.intensity = 0.8;

  const shadowGenerator = new ShadowGenerator(1024, directionalLight);
  shadowGenerator.useBlurExponentialShadowMap = true;

  const ground = CreateGround("ground", { width: 20, height: 20 }, scene);
  const groundMaterial = new PBRMaterial("groundMat", scene);
  groundMaterial.albedoColor = new Color3(0.15, 0.15, 0.15);
  groundMaterial.metallic = 0.1;
  groundMaterial.roughness = 0.9;
  ground.material = groundMaterial;
  ground.receiveShadows = true;

  const sphereColors = [new Color3(0.8, 0.2, 0.2), new Color3(0.2, 0.8, 0.2), new Color3(0.2, 0.2, 0.8), new Color3(0.8, 0.8, 0.2)];

  for (let index = 0; index < sphereColors.length; index++) {
    const sphere = CreateSphere(`sphere${index}`, { diameter: 1, segments: 16 }, scene);
    sphere.position = new Vector3((index - 1.5) * 2, 6 + index * 2, 0);

    const sphereMaterial = new PBRMaterial(`sphereMat${index}`, scene);
    sphereMaterial.albedoColor = sphereColors[index];
    sphereMaterial.metallic = 0.5;
    sphereMaterial.roughness = 0.4;
    sphere.material = sphereMaterial;

    shadowGenerator.addShadowCaster(sphere);
  }

  const boxA = CreateBox("boxA", { width: 1, height: 0.5, depth: 2 }, scene);
  boxA.position = new Vector3(4, 4, 0);
  const boxAMaterial = new PBRMaterial("boxAMat", scene);
  boxAMaterial.albedoColor = new Color3(0.6, 0.3, 0.7);
  boxAMaterial.metallic = 0.6;
  boxAMaterial.roughness = 0.3;
  boxA.material = boxAMaterial;
  shadowGenerator.addShadowCaster(boxA);

  const boxB = CreateBox("boxB", { width: 1, height: 0.5, depth: 2 }, scene);
  boxB.position = new Vector3(4, 4, 2.5);
  const boxBMaterial = new PBRMaterial("boxBMat", scene);
  boxBMaterial.albedoColor = new Color3(0.3, 0.6, 0.7);
  boxBMaterial.metallic = 0.6;
  boxBMaterial.roughness = 0.3;
  boxB.material = boxBMaterial;
  shadowGenerator.addShadowCaster(boxB);

  return scene;
}

async function initPhysics(scene: Scene, havokInstance: unknown): Promise<void> {
  const plugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -9.81, 0), plugin);

  const ground = scene.getMeshByName("ground");
  if (ground) {
    new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
  }

  for (let index = 0; index < 4; index++) {
    const sphere = scene.getMeshByName(`sphere${index}`);
    if (sphere) {
      new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.6 }, scene);
    }
  }

  const boxA = scene.getMeshByName("boxA");
  const boxB = scene.getMeshByName("boxB");
  if (!boxA || !boxB) {
    return;
  }

  const aggregateA = new PhysicsAggregate(boxA, PhysicsShapeType.BOX, { mass: 0 }, scene);
  const aggregateB = new PhysicsAggregate(boxB, PhysicsShapeType.BOX, { mass: 2 }, scene);

  const hinge = new HingeConstraint(new Vector3(0, 0, 1), new Vector3(0, 0, -1), new Vector3(1, 0, 0), new Vector3(1, 0, 0), scene);
  aggregateA.body.addConstraint(aggregateB.body, hinge);
}

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);
const scene = createScene(engine, canvas);

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());

import("@babylonjs/havok").then((havok) => {
  havok.default().then((havokInstance: unknown) => initPhysics(scene, havokInstance));
});
```

### Loading a Serialized Scene

For glTF loading, use `SceneLoader` with the pure barrel and the glTF loader package:

```typescript
import { Engine, Scene, ArcRotateCamera, DirectionalLight, Vector3, ImportMeshAsync, RegisterStandardEngineExtensions, RegisterEnginesExtensionsEngineRawTexture } from "@babylonjs/core/pure.js";

// Register glTF loader plugin
import "@babylonjs/loaders/glTF/2.0/index.js";

// Engine extensions required for rendering
RegisterStandardEngineExtensions();

// Raw texture support (needed by glTF loader internally)
RegisterEnginesExtensionsEngineRawTexture();

const MODEL_URL = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Fox/glTF-Binary/Fox.glb";

function createScene(engine) {
  const scene = new Scene(engine);

  // ── Camera ────────────────────────────────────────────────────────
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 150, new Vector3(0, 30, 0), scene);
  camera.attachControl(true);
  camera.lowerRadiusLimit = 50;
  camera.upperRadiusLimit = 300;

  const dir = new DirectionalLight("dir", new Vector3(-1, -3, -1), scene);
  dir.intensity = 0.8;
  dir.position = new Vector3(50, 100, 50);

  // ── Load animated model ───────────────────────────────────────────
  ImportMeshAsync(MODEL_URL, scene);
}
```

For `.babylon` files, serialization relies on `RegisterClass` to reconstruct objects by class name. Register the classes you expect to encounter:

```typescript
import { SceneLoader, RegisterStandardMaterial, RegisterPBRMaterial, RegisterImageProcessingConfiguration, RegisterTexture } from "@babylonjs/core/pure";

RegisterStandardMaterial();
RegisterPBRMaterial();
RegisterImageProcessingConfiguration();
RegisterTexture();

const scene = await SceneLoader.LoadAsync("./", "scene.babylon", engine);
```

### Node Material with Blocks

```typescript
import { NodeMaterial, RegisterAllNodeMaterialBlocks } from "@babylonjs/core/pure";

RegisterAllNodeMaterialBlocks();

const nodeMat = await NodeMaterial.ParseFromSnippetAsync("ABC123", scene);
```

You can also register only the block categories you need:

```typescript
import { RegisterNodeMaterialPBRBlocks, RegisterNodeMaterialMathBlocks, RegisterNodeMaterialInputBlocks } from "@babylonjs/core/pure";

RegisterNodeMaterialPBRBlocks();
RegisterNodeMaterialMathBlocks();
RegisterNodeMaterialInputBlocks();
```

### WebXR Gallery

This example creates a small VR gallery with teleportation, controller pointer selection, and interactive objects. It assumes your HTML contains a `<canvas id="renderCanvas"></canvas>` element. The glTF loader side-effect import is used so WebXR controller and hand model `.glb` assets can be loaded.

```typescript
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  CreateGround,
  CreateCylinder,
  CreateSphere,
  CreateTorus,
  CreateBox,
  PBRMaterial,
  StandardMaterial,
  Color3,
  Color4,
  Vector3,
  WebXRDefaultExperience,
  WebXRFeatureName,
  RegisterFullEngineExtensions,
  RegisterWebXRDefaultExperience,
  RegisterRay,
  RegisterInstancedMesh,
  RegisterAllNodeMaterialBlocks,
  RegisterAnimation,
  RegisterImageProcessingConfiguration,
  RegisterColorCurves,
  RegisterTexture,
  RegisterFresnelParameters,
} from "@babylonjs/core/pure";

import "@babylonjs/loaders/glTF/2.0";

RegisterFullEngineExtensions();
RegisterWebXRDefaultExperience();
RegisterRay();
RegisterInstancedMesh();
RegisterAllNodeMaterialBlocks();
RegisterAnimation();
RegisterImageProcessingConfiguration();
RegisterColorCurves();
RegisterTexture();
RegisterFresnelParameters();

function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.05, 0.05, 0.1, 1);

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 10, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 20;

  const hemisphericLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
  hemisphericLight.intensity = 0.4;

  const directionalLight = new DirectionalLight("dir", new Vector3(-1, -2, -1), scene);
  directionalLight.intensity = 0.8;
  directionalLight.position = new Vector3(5, 10, 5);

  const floor = CreateGround("floor", { width: 20, height: 20 }, scene);
  const floorMaterial = new PBRMaterial("floorMat", scene);
  floorMaterial.albedoColor = new Color3(0.15, 0.15, 0.2);
  floorMaterial.metallic = 0.1;
  floorMaterial.roughness = 0.9;
  floor.material = floorMaterial;

  const pedestalMaterial = new PBRMaterial("pedestalMat", scene);
  pedestalMaterial.albedoColor = new Color3(0.6, 0.6, 0.65);
  pedestalMaterial.metallic = 0.3;
  pedestalMaterial.roughness = 0.5;

  const positions = [new Vector3(-3, 0, 3), new Vector3(0, 0, 4), new Vector3(3, 0, 3), new Vector3(-3, 0, -3), new Vector3(3, 0, -3)];

  positions.forEach((position, index) => {
    const pedestal = CreateCylinder(`pedestal${index}`, { diameter: 0.8, height: 1 }, scene);
    pedestal.position = position.add(new Vector3(0, 0.5, 0));
    pedestal.material = pedestalMaterial;

    const object = index % 3 === 0 ? CreateSphere(`obj${index}`, { diameter: 0.5, segments: 32 }, scene) : index % 3 === 1 ? CreateTorus(`obj${index}`, { diameter: 0.5, thickness: 0.15 }, scene) : CreateBox(`obj${index}`, { size: 0.4 }, scene);
    object.position = position.add(new Vector3(0, 1.3, 0));

    const objectMaterial = new StandardMaterial(`objMat${index}`, scene);
    objectMaterial.emissiveColor = Color3.FromHSV((index / positions.length) * 360, 0.7, 0.9);
    objectMaterial.disableLighting = true;
    object.material = objectMaterial;
  });

  WebXRDefaultExperience.CreateAsync(scene, {
    floorMeshes: [floor],
    optionalFeatures: true,
    disableNearInteraction: true,
  }).then((xr) => {
    xr.teleportation?.addFloorMesh(floor);

    try {
      xr.baseExperience.featuresManager.enableFeature(WebXRFeatureName.POINTER_SELECTION, "stable", {
        xrInput: xr.input,
        enablePointerSelectionOnAllControllers: true,
        disablePointerUpOnTouchOut: false,
        forceGazeMode: false,
        disableScenePointerVectorUpdate: false,
      } as any);
    } catch {
      // Pointer selection is not available on every browser or device.
    }
  });

  return scene;
}

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);
const scene = createScene(engine, canvas);

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
```

## Migration from Existing Imports

New pure-import code should import Babylon.js core values and registration functions from `@babylonjs/core/pure`. During migration, you may temporarily keep an existing side-effect import when you have not yet converted that feature to an explicit registration call:

```typescript
import { Scene, Engine, Vector3 } from "@babylonjs/core/pure";

// Temporary migration exception: replace this with an explicit RegisterXxx() call.
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent";
```

Convert those remaining imports as you identify the registrations your application actually needs.

## Package Configuration

### The `exports` Map

The `@babylonjs/core` package uses Node.js [package exports](https://nodejs.org/api/packages.html#exports) to define entry points:

```json
"exports": {
    ".": {
        "types": "./index.d.ts",
        "import": "./index.js",
        "default": "./index.js"
    },
    "./pure": {
        "types": "./pure.d.ts",
        "import": "./pure.js",
        "default": "./pure.js"
    },
    "./*": {
        "types": "./*.d.ts",
        "import": "./*.js",
        "default": "./*.js"
    }
}
```

The `default` condition keeps compatibility with CommonJS consumers, while the `import` condition is used by ESM-aware bundlers.

### The `sideEffects` Field

The top-level `sideEffects` array in `package.json` lists every file that has module-level side effects. Bundlers use this to determine what can be safely tree-shaken. Files not in the list, including `.pure.js` files, are considered side-effect-free.

This field is maintained by `syncSideEffects.mjs`; you should not need to edit it manually.

## Testing Tree-Shaking

### ES6 Visualization Tests

The Babylon.js repository includes visualization tests that validate tree-shaking at runtime. Each test scene in `packages/tools/tests/es6Vis/` has three import styles:

- `barrel.ts` imports from `@babylonjs/core`.
- `deep.ts` imports from deep paths such as `@babylonjs/core/Engines/engine`.
- `pure.ts` imports from `@babylonjs/core/pure` or `.pure` paths.

All three styles must produce identical visual output. Run them with:

```bash
npm run test:es6vis -w @tools/tests
npm run test:es6-packages -w @tools/tests
```

The bundle size test asserts that `pure <= deep < barrel` for each scene.

### ES6 Package Smoke Tests

The `test:es6-packages` script also:

1. Type-checks all `@babylonjs/*` packages against `tsconfig.es6-smoke.json`.
2. Bundles an ESM entry that imports all public packages with esbuild.
3. Runs a Node.js smoke test that imports `@babylonjs/core` and verifies basic runtime behavior.
4. Validates editor package entry points.
