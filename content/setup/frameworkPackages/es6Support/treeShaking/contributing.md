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

## The File Pattern

Most files in Babylon.js have no side effects. These use a regular filename, such as `feature.ts`, and do not need any special treatment.

The multi-file pattern only applies to modules with side effects. Those are split into up to three files:

```text
feature.pure.ts  -> Implementation and registration function
feature.types.ts -> TypeScript module augmentations, if any
feature.ts       -> Backward-compatible wrapper
```

Not every side-effect module needs all three files. The `.types.ts` file is only needed when the feature adds methods or properties to another class.

### No Side Effects: Regular File

If your feature has no side effects at all, use the regular filename: `feature.ts`. No `.pure.ts`, wrapper, or `.types.ts` file is needed. This is the most common case.

### Side Effects Without Type Augmentations: Two Files

If your feature only has `RegisterClass` calls or static assignments, with no prototype augmentation:

- `feature.pure.ts` contains the implementation and `RegisterFeature()` function.
- `feature.ts` is the wrapper that calls `RegisterFeature()`.

No `.types.ts` file is needed if there are no `declare module` blocks.

### Side Effects With Type Augmentations: Three Files

You need all three if your feature:

- Adds methods or properties to existing classes.
- Uses `declare module` to tell TypeScript about those added members.

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
export function RegisterMyFeatureSceneComponent(): void {
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
- Put all side effects inside the `RegisterXxx()` function.
- Guard registration with an idempotency flag.
- Import from `.pure` specifiers when a pure module exists.
- Keep `RegisterClass` calls inside the registration function.

### 3. Create the Wrapper

```typescript
// myFeatureSceneComponent.ts
export * from "./myFeatureSceneComponent.pure";
import { RegisterMyFeatureSceneComponent } from "./myFeatureSceneComponent.pure";

RegisterMyFeatureSceneComponent();
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
export function RegisterMyNewMesh(): void {
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
import { RegisterMyNewMesh } from "./myNewMesh.pure";

RegisterMyNewMesh();
```

## Naming Conventions

### Registration Function Naming

Registration functions always use `Register` plus the PascalCase file name:

| Filename                               | Function                                 |
| -------------------------------------- | ---------------------------------------- |
| `standardMaterial.pure.ts`             | `RegisterStandardMaterial()`             |
| `engine.multiRender.pure.ts`           | `RegisterEngineMultiRender()`            |
| `WebXRHandTracking.pure.ts`            | `RegisterWebXRHandTracking()`            |
| `joinedPhysicsEngineComponent.pure.ts` | `RegisterJoinedPhysicsEngineComponent()` |

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

## Automatic Dependencies

If a registration function depends on another registered feature, call it inside your function:

```typescript
export function RegisterMyMaterial(): void {
  if (_registered) {
    return;
  }
  _registered = true;

  // Register dependencies needed for loading saved scenes.
  RegisterTexture();
  RegisterImageProcessingConfiguration();

  RegisterClass("BABYLON.MyMaterial", MyMaterial);
  SerializationHelper._MyMaterialParser = MyMaterial.Parse;
}
```

Add automatic dependencies when:

- Your feature's `Parse()` method will trigger another missing-registration error.
- Your feature's constructor always creates instances of another registered class.
- Your feature is unusable without the dependency.

Do not add transitive registration when:

- The dependency is optional.
- Adding it would pull in a very large module from a small utility.

## The `#__PURE__` Annotation

TypeScript decorators compile to module-scope `__decorate(...)` calls, which can block tree-shaking. The build pipeline injects `/*#__PURE__*/` annotations into compiled `.pure.js` files automatically.

If your `.pure.ts` file uses decorators, no manual annotation is needed. Make sure the file uses the `.pure.ts` suffix so the post-build script can process it.

## Validation Checklist

Before submitting a PR that adds or modifies tree-shakeable code:

1. **TypeScript compiles**: `npm run build:es6` with 0 errors.
2. **ESLint passes**: `npm run lint:check`. Two custom ESLint rules enforce tree-shaking correctness.
3. **Tree-shaking verification passes**: `npm run check:treeshaking`, which verifies manifest drift, pure barrels, and side-effect stubs.
4. **Side-effects sync check passes**: `npm run check:side-effects-sync`, which verifies the `sideEffects` array in `@babylonjs/core/package.json` matches the manifest.
5. **Bundle smoke tests pass**: `npm run test:treeshaking`.

`@babylonjs/require-pure-annotation` requires `/*#__PURE__*/` on module-scope calls and static field initializers in `.pure.ts` files. It is auto-fixable.

`@babylonjs/no-side-effect-imports-in-pure` disallows side-effect-only imports in `.pure.ts` files and checks that `pure.ts` barrels only re-export side-effect-free sources.

The full CI check runs all of these together:

```bash
npm run check:treeshaking-all
```

If `check:treeshaking` fails, the error message tells you which fix command to run:

```bash
# If manifest drift is detected:
npm run update:manifest

# If sideEffects array is out of sync:
node scripts/treeshaking/syncSideEffects.mjs

# If pure barrels are out of date:
npm run generate:pure-barrels

# If side-effect stubs are out of date:
npm run generate:side-effect-stubs
```

## Automation Scripts

| Script                        | npm Command                          | Purpose                                             |
| ----------------------------- | ------------------------------------ | --------------------------------------------------- |
| `verifyTreeShaking.mjs`       | `npm run check:treeshaking`          | Unified CI check for manifest, barrels, and stubs   |
| `checkManifestDrift.mjs`      | `npm run check:manifest-drift`       | Verify manifest matches source                      |
| `generatePureBarrels.mjs`     | `npm run generate:pure-barrels`      | Regenerate `pure.ts` barrel files                   |
| `generateSideEffectStubs.mjs` | `npm run generate:side-effect-stubs` | Generate prototype warning stubs                    |
| `auditSideEffects.mjs`        | `npm run audit:side-effects`         | Scan for all side effects                           |
| `syncSideEffects.mjs`         | (manual)                             | Sync manifest to package metadata                   |
| `injectPureAnnotations.mjs`   | (runs automatically during build)    | Inject `/*#__PURE__*/` in compiled JS               |
| `bundleSmokeTest.mjs`         | `npm run test:treeshaking`           | Run tree-shaking bundle tests                       |
| `fixPureImports.mjs`          | (manual)                             | Rewrite imports in `.pure.ts` to `.pure` specifiers |

Both `generatePureBarrels.mjs` and `generateSideEffectStubs.mjs` support `--check` mode, which is used by `verifyTreeShaking.mjs` to compare expected output to committed files without modifying anything.

`syncSideEffects.mjs` also supports `--check` mode, used by `npm run check:side-effects-sync` in CI.

## Pre-Commit Hook

The Babylon.js repository uses a `.githooks/pre-commit` hook. When core source files are staged, the hook automatically:

1. Runs `npm run precommit`.
2. Regenerates the side-effects manifest with `npm run update:manifest`.
3. Regenerates pure barrels with `npm run generate:pure-barrels`.
4. Regenerates side-effect stubs with `npm run generate:side-effect-stubs`.
5. Stages the updated manifest, package metadata, and generated barrels.

After editing `.pure.ts` files, the hook handles the common generation steps. You can still run the individual commands manually to verify before committing.

## Quick Reference: File Header Convention

```typescript
// .pure.ts files:
/** This file must only contain pure code and pure imports */

// .types.ts files:
// No special header needed; these only contain declare module blocks.

// .ts wrapper files:
// No special header needed; these are thin wrappers.
```
