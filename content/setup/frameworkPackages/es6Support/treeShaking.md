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

Babylon.js is a large framework. `@babylonjs/core` contains over 2,200 source files covering rendering, physics, animation, XR, particles, materials, loaders, and many other systems. Most applications use only part of this functionality, so bundling the whole package can include code your application never runs.

Tree-shaking lets bundlers such as Webpack, Rollup, Vite, and esbuild figure out which code your application actually uses and remove the rest from the final bundle. This can cut bundle sizes by 50-80% depending on which features you use.

## The Challenge: Side Effects

JavaScript modules can have side effects: code that runs automatically when a file is imported, changing things globally. Babylon.js uses side effects for several compatibility and discovery features:

- Class registration, such as `RegisterClass("BABYLON.Camera", Camera)`, which lets the engine recreate objects by name when loading saved scenes.
- Prototype augmentation, such as `Scene.prototype.enablePhysics = function() {...}`, which attaches optional methods to existing classes.
- Shader registration, which stores GPU shader source code so the engine can compile it later.
- Feature registration, such as making WebXR features available by name.

When a module has side effects, bundlers cannot safely remove it just because your code does not reference one of its exports. This is why `@babylonjs/core` historically shipped with `sideEffects: ["**/*"]`, telling bundlers that every file might have side effects.

## The Pure Barrel

Babylon.js provides an alternative import system where side effects are moved into explicit registration functions. This makes it possible to import from a single barrel while keeping tree-shaking effective.

| Import style              | Example                             | Tree-shakeable | Side effects          |
| ------------------------- | ----------------------------------- | -------------- | --------------------- |
| Standard top-level barrel | `@babylonjs/core`                   | Limited        | Automatic             |
| ES6 deep imports          | `@babylonjs/core/Engines/engine.js` | Yes            | Imported explicitly   |
| Pure barrel               | `@babylonjs/core/pure`              | Yes            | Registered explicitly |

A barrel is a single file that re-exports symbols from many other files, giving you one convenient import path. The pure barrel re-exports the pure implementation modules without running their side effects. Your bundler can analyze which exports you import from the barrel and remove unused code, while features that historically depended on side effects are activated with explicit registration functions.

## How It Works

Most files in Babylon.js have no side effects and use their regular file name. The multi-file split only applies to modules that have side effects.

For those modules, the code is split into up to three files:

```text
camera.pure.ts  -> Pure implementation and registration function
camera.types.ts -> Type augmentations only, when needed
camera.ts       -> Backward-compatible wrapper that registers side effects
```

- `.pure.ts` contains the implementation. Nothing runs automatically when you import it. It exports a `RegisterXxx()` function that you call when you need the side effects.
- `.types.ts` contains TypeScript `declare module` augmentations for methods added to other classes. It is only needed when a file adds methods or properties to another class.
- `.ts` re-exports the pure module and calls the registration function to preserve existing import behavior.

If a module has no side effects, it just uses a normal `.ts` file. No `.pure.ts` or `.types.ts` file is needed.

## Quick Start

This example imports from the pure barrel and explicitly registers the core engine extensions needed for rendering. The bundler can eliminate everything you do not use.

The example assumes your HTML contains a `<canvas id="renderCanvas"></canvas>` element.

```typescript
import { Engine, Scene, FreeCamera, HemisphericLight, CreateSphere, StandardMaterial, Color3, Vector3, RegisterCoreEngineExtensions } from "@babylonjs/core/pure";

RegisterCoreEngineExtensions();

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);
const scene = new Scene(engine);

const camera = new FreeCamera("camera", new Vector3(0, 5, -10), scene);
camera.setTarget(Vector3.Zero());

new HemisphericLight("light", new Vector3(0, 1, 0), scene);

const material = new StandardMaterial("sphereMat", scene);
material.diffuseColor = new Color3(0.4, 0.6, 0.9);

const sphere = CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
sphere.material = material;

engine.runRenderLoop(() => scene.render());
```

The pure barrel re-exports every class and function from the package. Your bundler figures out which exports you actually use and removes the rest, giving you the same tree-shaking benefit as individual `.pure` imports with less import code.

### Engine Registration Tiers

Engine extensions such as texture loading, alpha blending, render targets, and uniform buffers are side effects that must be registered when using pure imports. Three tiered helpers are available:

| Helper                               | What it registers                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `RegisterCoreEngineExtensions()`     | DOM binding, render passes, GPU states, and stencil support                                      |
| `RegisterStandardEngineExtensions()` | Core plus textures, file loading, alpha, render targets, and uniform buffers                     |
| `RegisterFullEngineExtensions()`     | Standard plus cube/raw/dynamic textures, multi-render, multiview, queries, compute, video, debug |

For most applications, `RegisterStandardEngineExtensions()` is the right choice. Use `RegisterFullEngineExtensions()` if you need advanced features like compute shaders, cube textures, or multiview rendering.

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
