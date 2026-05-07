---
title: Adding Tree-Shakeable Features
image:
description: Follow the Babylon.js pure-module pattern when contributing new tree-shakeable code.
keywords: babylon.js, contribute, tree shaking, pure modules, side effects, registration functions
further-reading:
  - title: Tree-Shaking with Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking
  - title: Registering Side Effects
    url: /setup/frameworkPackages/es6Support/treeShaking/registeringSideEffects
  - title: Contributing to Babylon.js
    url: /contribute/toBabylon/HowToContribute
video-overview:
video-content:
---

This guide is for contributors adding or modifying Babylon.js framework code. Application developers should start with [Using Pure Imports](/setup/frameworkPackages/es6Support/treeShaking/usingPureImports) and [Registering Side Effects](/setup/frameworkPackages/es6Support/treeShaking/registeringSideEffects).

## The Three-File Pattern

Every module with side effects is split into up to three files:

```text
feature.pure.ts  -> Implementation and registration function
feature.types.ts -> TypeScript module augmentations, if any
feature.ts       -> Backward-compatible wrapper
```

Use all three files when a feature adds methods or properties to existing classes and needs `declare module` augmentation. Use only `feature.pure.ts` and `feature.ts` when a feature has runtime side effects, such as `RegisterClass`, but no type augmentation.

### When You Need All Three Files

You need all three if your feature:

- Adds methods or properties to existing classes.
- Uses `declare module` to augment type definitions.

### When You Need Only Two Files

If your feature only has `RegisterClass` calls or static assignments, with no prototype augmentation:

- `feature.pure.ts` contains the implementation and `registerFeature()` function.
- `feature.ts` is the wrapper that calls `registerFeature()`.

No `.types.ts` file is needed if there are no `declare module` blocks.

## Step-by-Step: Adding a New Prototype Augmentation

This example adds `doSomething()` to `Scene`.

### 1. Create the Types File

```typescript
// myFeatureSceneComponent.types.ts
import type { Scene } from "../scene.pure";

declare module "../scene.pure" {
  export interface Scene {
    /**
     * Does something useful.
     * @returns The result.
     */
    doSomething(): string;
  }
}
```

Rules:

- Use type-only imports.
- Target the `.pure` module in `declare module`.
- Document augmented public members with JSDoc.

### 2. Create the Pure Implementation

```typescript
// myFeatureSceneComponent.pure.ts
/** This file must only contain pure code and pure imports */

export * from "./myFeatureSceneComponent.types";

import { Scene } from "../scene.pure";
import { RegisterClass } from "../Misc/typeStore";

export class MyFeatureSceneComponent {
  // Implementation.
}

let _registered = false;
export function registerMyFeatureSceneComponent(): void {
  if (_registered) {
    return;
  }
  _registered = true;

  Scene.prototype.doSomething = function (): string {
    return "something";
  };

  RegisterClass("BABYLON.MyFeatureSceneComponent", MyFeatureSceneComponent);
}
```

Rules:

- Start `.pure.ts` files with `/** This file must only contain pure code and pure imports */`.
- Re-export the `.types` module when the feature has type augmentations.
- Put all side effects inside the `registerXxx()` function.
- Guard registration with an idempotency flag.
- Import from `.pure` specifiers when a pure module exists.
- Keep `RegisterClass` calls inside the registration function.

### 3. Create the Wrapper

```typescript
// myFeatureSceneComponent.ts
export * from "./myFeatureSceneComponent.pure";
import { registerMyFeatureSceneComponent } from "./myFeatureSceneComponent.pure";

registerMyFeatureSceneComponent();
```

The wrapper preserves existing behavior: importing the non-pure module still runs the compatibility side effects.

### 4. Update Barrels

Add the pure export to the directory's pure barrel:

```typescript
export * from "./myFeatureSceneComponent.pure";
```

Add the existing wrapper export to the standard barrel:

```typescript
export * from "./myFeatureSceneComponent";
```

### 5. Generate Side-Effect Stubs

If your feature augments prototypes, regenerate the side-effect stubs:

```bash
npm run generate:side-effect-stubs
```

This adds a lightweight missing-side-effect stub to the relevant pure class.

## Step-by-Step: Adding a RegisterClass-Only Module

If a feature only needs deserialization support and does not augment another class, create a pure implementation and wrapper:

### 1. Create the Pure Implementation

```typescript
// myNewMesh.pure.ts
/** This file must only contain pure code and pure imports */

import { Mesh } from "./mesh.pure";
import { RegisterClass } from "../Misc/typeStore";

export class MyNewMesh extends Mesh {
  // Full implementation.

  public static Parse(parsedMesh: unknown, scene: Scene): MyNewMesh {
    return new MyNewMesh("name", scene);
  }
}

let _registered = false;
export function registerMyNewMesh(): void {
  if (_registered) {
    return;
  }
  _registered = true;

  RegisterClass("BABYLON.MyNewMesh", MyNewMesh);
}
```

### 2. Create the Wrapper

```typescript
// myNewMesh.ts
export * from "./myNewMesh.pure";
import { registerMyNewMesh } from "./myNewMesh.pure";

registerMyNewMesh();
```

## Naming Conventions

### Registration Function Naming

Registration functions use `register` plus the PascalCase file name:

| Filename                               | Function                                 |
| -------------------------------------- | ---------------------------------------- |
| `standardMaterial.pure.ts`             | `registerStandardMaterial()`             |
| `engine.multiRender.pure.ts`           | `registerEngineMultiRender()`            |
| `WebXRHandTracking.pure.ts`            | `registerWebXRHandTracking()`            |
| `joinedPhysicsEngineComponent.pure.ts` | `registerJoinedPhysicsEngineComponent()` |

## Import Specifiers in Pure Files

When a `.pure.ts` module imports another module that also has a pure version, import the pure specifier:

```typescript
// Correct
import { Scene } from "../scene.pure";
import { Vector3 } from "../Maths/math.vector.pure";
import { Mesh } from "../Meshes/mesh.pure";

// Wrong: pulls in side effects
import { Scene } from "../scene";
import { Vector3 } from "../Maths/math.vector";
```

Do not import the non-pure module from a pure file, because that can pull side effects back into the pure graph.

Exception: type-only imports are erased at compile time, so they do not create runtime side effects:

```typescript
import type { Scene } from "../scene";
```

Using the pure path is still the clearest convention for new pure code.

## Static Method Extraction

When adding static methods to a class in a `.pure.ts` file, consider whether the method can be exported as a standalone function. This can improve tree-shaking for utility-style operations.

### Methods That Stay as Class Statics

Keep a method as a class static when it needs private or protected class members, when it is a static getter or setter, or when class identity is part of the public API.

### Methods That Should Be Standalone Functions

Prefer a standalone function when the method is pure computation, a simple factory, or a utility operating on structural types.

Example: if an existing class exposes `MyAsset.Parse(...)`, keep the parse implementation available from the pure module as a top-level function. Add the class static only in the wrapper so importing the pure module does not perform a static assignment side effect.

```typescript
// myAsset.pure.ts
/** This file must only contain pure code and pure imports */

export class MyAsset {
  public name: string;

  public constructor(name: string) {
    this.name = name;
  }
}

export function MyAssetParse(parsedAsset: { name: string }): MyAsset {
  return new MyAsset(parsedAsset.name);
}
```

```typescript
// myAsset.types.ts
import type { MyAssetParse } from "./myAsset.pure";

declare module "./myAsset.pure" {
  namespace MyAsset {
    export let Parse: typeof MyAssetParse;
  }
}
```

```typescript
// myAsset.ts
export * from "./myAsset.pure";
export * from "./myAsset.types";

import { MyAsset, MyAssetParse } from "./myAsset.pure";

MyAsset.Parse = MyAssetParse;
```

Users who import from `myAsset.pure` can tree-shake `MyAssetParse` independently from the compatibility static. Users who import from `myAsset` get the legacy `MyAsset.Parse(...)` API and its matching type augmentation.

## Transitive Dependencies

If a registration function requires another registered feature, call it explicitly inside registration:

```typescript
export function registerMyMaterial(): void {
  if (_registered) {
    return;
  }
  _registered = true;

  // Register transitive dependencies needed for deserialization.
  registerTexture();
  registerImageProcessingConfiguration();

  RegisterClass("BABYLON.MyMaterial", MyMaterial);
  SerializationHelper._MyMaterialParser = MyMaterial.Parse;
}
```

Add transitive registration when:

- Your feature's `Parse()` method will trigger another parser stub.
- Your feature's constructor always creates instances of another registered class.
- Your feature is unusable without the dependency.

Do not add transitive registration when:

- The dependency is optional.
- The user might not serialize that sub-feature.
- Adding it would pull in a very large module from a small utility.

## Pure Annotations

TypeScript decorators compile to module-scope `__decorate(...)` calls, which can block tree-shaking. The build pipeline injects `/*#__PURE__*/` annotations into compiled `.pure.js` files automatically.

If your `.pure.ts` file uses decorators, no manual annotation is needed. Make sure the file uses the `.pure.ts` suffix so the post-build script can process it.

## Validation Checklist

Before submitting a PR that adds or modifies tree-shakeable code:

1. Run `npm run build:es6` and confirm TypeScript compiles with 0 errors.
2. Run `npm run lint:check`. The `no-side-effect-imports-in-pure` rule catches bare side-effect imports in `.pure.ts` files and missing `/*#__PURE__*/` annotations on call expressions.
3. Run `npm run check:treeshaking`. This unified check verifies manifest drift, pure barrels, and side-effect stubs.
4. Run `npm run test:treeshaking` and confirm all bundle smoke tests pass.

If `check:treeshaking` fails, the error message tells you which fix command to run:

```bash
# If manifest drift is detected:
node scripts/treeshaking/auditSideEffects.mjs --out scripts/treeshaking/side-effects-manifest.json
node scripts/treeshaking/syncSideEffects.mjs

# If pure barrels are out of date:
npm run generate:pure-barrels

# If side-effect stubs are out of date:
npm run generate:side-effect-stubs
```

## Automation Scripts

| Script                                        | Purpose                                             | Usage                                         |
| --------------------------------------------- | --------------------------------------------------- | --------------------------------------------- |
| `verifyTreeShaking.mjs`                       | Unified CI check for manifest, barrels, and stubs   | `npm run check:treeshaking`                   |
| `checkManifestDrift.mjs`                      | Verify manifest matches source                      | `npm run check:manifest-drift`                |
| `generatePureBarrels.mjs`                     | Regenerate `pure.ts` barrel files                   | `npm run generate:pure-barrels`               |
| `generateSideEffectStubs.mjs`                 | Generate prototype warning stubs                    | `npm run generate:side-effect-stubs`          |
| `auditSideEffects.mjs`                        | Scan for all side effects                           | `npm run audit:side-effects`                  |
| `syncSideEffects.mjs`                         | Sync manifest to package metadata                   | `npm run sync:side-effects`                   |
| `injectPureAnnotations.mjs`                   | Inject `/*#__PURE__*/` in compiled JS               | Runs automatically during build               |
| `bundleSmokeTest.mjs`                         | Run tree-shaking bundle tests                       | `npm run test:treeshaking`                    |
| `fixPureImports.mjs`                          | Rewrite imports in `.pure.ts` to `.pure` specifiers | `node scripts/treeshaking/fixPureImports.mjs` |

Both `generatePureBarrels.mjs` and `generateSideEffectStubs.mjs` support `--check` mode, which is used by `verifyTreeShaking.mjs` to compare expected output to committed files without modifying anything.

## Quick Reference: File Header Convention

```typescript
// .pure.ts files:
/** This file must only contain pure code and pure imports */

// .types.ts files:
// No special header needed. These only contain declare module blocks.

// .ts wrapper files:
// No special header needed. These are thin wrappers.
```
