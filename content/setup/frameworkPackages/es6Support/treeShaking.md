---
title: Tree-Shaking with Pure Imports
image:
description: Use the Babylon.js pure barrel to keep a single import surface while preserving tree-shaking.
keywords: babylon.js, es6, npm, tree shaking, pure imports, pure barrel, side effects, bundle size
further-reading:
  - title: Using Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking/usingPureImports
  - title: Registering Side Effects
    url: /setup/frameworkPackages/es6Support/treeShaking/registeringSideEffects
  - title: Troubleshooting Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking/troubleshooting
video-overview:
video-content:
---

## Why Tree-Shaking Matters

Babylon.js is a large framework. `@babylonjs/core` contains rendering, physics, animation, XR, particles, materials, loaders, and many other systems. Most applications use only part of this functionality, so bundling the whole package can include code your application never runs.

Tree-shaking lets bundlers such as Webpack, Rollup, Vite, and esbuild analyze which exports your application actually uses and remove the rest from the final bundle. The exact savings depend on the features you use, but focused applications can often reduce their Babylon.js bundle significantly.

## The Challenge: Side Effects

JavaScript modules can have side effects: code that runs when a module is imported and changes global or shared state. Babylon.js uses side effects for several compatibility and discovery features:

- Class registration, such as `RegisterClass("BABYLON.Camera", Camera)`, for deserialization by class name.
- Prototype augmentation, such as adding optional methods to `Scene` or `Engine`.
- Shader registration, which stores shader source code for the engine to compile.
- Feature registration, such as making WebXR features discoverable by name.

When a module has side effects, bundlers cannot safely remove it just because your code does not reference one of its exports. This is why the traditional ES6 tree-shaking guidance recommends deep imports and explicit side-effect imports.

## The Pure Barrel

Babylon.js provides a parallel pure import system that separates implementation code from side effects. This makes it possible to import from a single barrel while keeping tree-shaking effective.

| Import style              | Example                             | Tree-shakeable | Side effects          |
| ------------------------- | ----------------------------------- | -------------- | --------------------- |
| Standard top-level barrel | `@babylonjs/core`                   | Limited        | Automatic             |
| ES6 deep imports          | `@babylonjs/core/Engines/engine.js` | Yes            | Imported explicitly   |
| Pure barrel               | `@babylonjs/core/pure`              | Yes            | Registered explicitly |

The pure barrel re-exports the pure implementation modules. Your bundler can analyze which exports you import from the barrel and remove unused code, while features that historically depended on side effects are activated with explicit registration functions.

## How It Works

Modules with side effects are split into up to three files:

```text
camera.pure.ts  -> Pure implementation and registration function
camera.types.ts -> Type augmentations only
camera.ts       -> Backward-compatible wrapper that registers side effects
```

- `.pure.ts` contains implementation code and exports a `registerXxx()` function for any side effects.
- `.types.ts` contains TypeScript `declare module` augmentations only.
- `.ts` re-exports the pure module and calls the registration function to preserve existing import behavior.

Existing imports keep working. Pure imports opt into the side-effect-free path.

## Quick Start

This complete example imports from the pure barrel, explicitly registers the rendering side effects it needs, loads an animated glTF character, places it on a ground mesh, and starts the render loop.

The glTF loader package still registers its loader plugin through a side-effect import. The Babylon.js core rendering features used by the scene are registered explicitly.

The example assumes your HTML contains a `<canvas id="renderCanvas"></canvas>` element.

```typescript
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  CreateGround,
  PBRMaterial,
  Color3,
  Color4,
  Vector3,
  ImportMeshAsync,
  registerAbstractEngineDom,
  registerAbstractEngineRenderPass,
  registerAbstractEngineStates,
  registerAbstractEngineStencil,
  registerAbstractEngineTexture,
  registerExtensionsEngineRenderTarget,
  registerEngineUniformBuffer,
} from "@babylonjs/core/pure.js";

import "@babylonjs/loaders/glTF/2.0/index.js";

registerAbstractEngineDom();
registerAbstractEngineRenderPass();
registerAbstractEngineStates();
registerAbstractEngineStencil();
registerAbstractEngineTexture();
registerExtensionsEngineRenderTarget();
registerEngineUniformBuffer();

const MODEL_URL = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Fox/glTF-Binary/Fox.glb";

function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.4, 0.6, 0.8, 1);

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 150, new Vector3(0, 30, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 50;
  camera.upperRadiusLimit = 300;

  const hemisphericLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
  hemisphericLight.intensity = 0.5;

  const directionalLight = new DirectionalLight("dir", new Vector3(-1, -3, -1), scene);
  directionalLight.intensity = 0.8;
  directionalLight.position = new Vector3(50, 100, 50);

  const ground = CreateGround("ground", { width: 200, height: 200 }, scene);
  const groundMaterial = new PBRMaterial("groundMat", scene);
  groundMaterial.albedoColor = new Color3(0.3, 0.5, 0.2);
  groundMaterial.metallic = 0;
  groundMaterial.roughness = 0.95;
  ground.material = groundMaterial;

  ImportMeshAsync(MODEL_URL, scene).then((result) => {
    const root = result.meshes[0];
    root.position = Vector3.Zero();

    const skeleton = result.skeletons[0];
    skeleton?.returnToRest();

    const animationGroups = result.animationGroups;
    animationGroups.forEach((animationGroup) => animationGroup.stop());

    const primaryAnimation = animationGroups[0];
    primaryAnimation?.start(true, 1.0);

    const secondaryAnimation = animationGroups[1];
    if (secondaryAnimation) {
      secondaryAnimation.start(true, 1.0);
      secondaryAnimation.setWeightForAllAnimatables(0.3);
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

The pure barrel gives you the convenience of a single import surface. You can still import from individual `.pure` modules when you prefer explicit deep paths.

## When to Use Pure Imports

| Scenario                              | Recommended approach                                |
| ------------------------------------- | --------------------------------------------------- |
| Production app optimizing bundle size | Pure imports and explicit registration              |
| Rapid prototyping                     | Standard imports or the Playground                  |
| Library or plugin built on Babylon.js | Pure imports, so consumers decide what to register  |
| Loading serialized scenes             | Pure imports plus registration for serialized types |
| Math-only or utility-only code        | Pure deep imports or standalone function imports    |

## Next Steps

- [Using Pure Imports](/setup/frameworkPackages/es6Support/treeShaking/usingPureImports) explains pure barrel paths, subdirectory barrels, type augmentations, static function alternatives, and bundler configuration.
- [Registering Side Effects](/setup/frameworkPackages/es6Support/treeShaking/registeringSideEffects) explains how to activate optional features when using pure imports.
- [Troubleshooting Pure Imports](/setup/frameworkPackages/es6Support/treeShaking/troubleshooting) covers the most common runtime and TypeScript errors.
- [Adding Tree-Shakeable Features](/setup/frameworkPackages/es6Support/treeShaking/contributing) describes the framework contribution pattern for pure modules.
