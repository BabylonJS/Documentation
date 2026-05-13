---
title: Troubleshooting Pure Imports
image:
description: Diagnose common runtime and TypeScript issues when using Babylon.js pure imports.
keywords: babylon.js, pure imports, troubleshooting, side effects, tree shaking, missing imports
further-reading:
  - title: Tree-Shaking with Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking
  - title: Using Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking/usingPureImports
  - title: Registering Side Effects
    url: /setup/frameworkPackages/es6Support/treeShaking/registeringSideEffects
video-overview:
video-content:
---

## Common Errors

### "X needs to be imported before as it contains a side-effect required by your code"

This means your code reached a feature that requires registration, but the matching registration function has not been called.

For example:

```text
Uncaught StandardMaterial needs to be imported before as it contains a side-effect required by your code.
```

Import and call the corresponding registration function:

```typescript
import { RegisterStandardMaterial } from "@babylonjs/core/pure";

RegisterStandardMaterial();
```

Common triggers include:

| Error message                                          | Registration needed                      |
| ------------------------------------------------------ | ---------------------------------------- |
| `StandardMaterial needs to be imported...`             | `RegisterStandardMaterial()`             |
| `ImageProcessingConfiguration needs to be imported...` | `RegisterImageProcessingConfiguration()` |
| `ColorCurves needs to be imported...`                  | `RegisterColorCurves()`                  |
| `Texture needs to be imported...`                      | `RegisterTexture()`                      |
| `FresnelParameters needs to be imported...`            | `RegisterFresnelParameters()`            |
| `Ray needs to be imported...`                          | `RegisterRay()`                          |
| `CubeTexture needs to be imported...`                  | `RegisterCubeTexture()`                  |
| `InstancedMesh needs to be imported...`                | `RegisterInstancedMesh()`                |

### TypeError: scene.enablePhysics is not a function

The physics component has not been registered. The `enablePhysics` method only becomes available after registration:

```typescript
import { RegisterJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent.types";

RegisterJoinedPhysicsEngineComponent();
```

### Engine methods missing or textures not loading

Engine extensions have not been registered. When using pure imports, the engine starts with minimal functionality. Texture loading, alpha blending, render targets, and other engine capabilities are optional extensions.

Register engine extensions using one of the tiered helpers:

```typescript
import { RegisterStandardEngineExtensions } from "@babylonjs/core/pure";

RegisterStandardEngineExtensions();
```

For advanced features such as compute shaders, cube textures, or multiview, use `RegisterFullEngineExtensions()` instead. See [Engine Registration Tiers](/setup/frameworkPackages/es6Support/treeShaking#engine-registration-tiers) for details.

### TypeError: scene.pick is not a function (or createPickingRay)

Picking functionality depends on ray registration:

```typescript
import { RegisterRay } from "@babylonjs/core/pure";

RegisterRay();
```

### TypeScript error: Property 'enablePhysics' does not exist on type 'Scene'

The runtime feature may be registered, but TypeScript still needs the type augmentation:

```typescript
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent.types";
```

Use `.types` imports for features that augment classes with additional methods or properties.

### Cascading Errors (Fix One, Hit the Next)

Some features have dependencies. You might fix one missing registration and then see another error when a dependent feature is reached.

To resolve this:

1. Use `CheckMissingImports()` during development to discover unregistered stubs.
2. Prefer registration functions that handle their required transitive dependencies.
3. For scene loading, register the material, texture, and parser types that your assets use.

A common serialized-scene setup looks like this:

```typescript
import { RegisterStandardMaterial, RegisterPBRMaterial, RegisterImageProcessingConfiguration, RegisterTexture, RegisterFresnelParameters } from "@babylonjs/core/pure";

RegisterStandardMaterial();
RegisterPBRMaterial();
RegisterImageProcessingConfiguration();
RegisterTexture();
RegisterFresnelParameters();
```

### Materials Appear Black or Default After Loading

The material class was not registered, so deserialization could not recreate it correctly. Register the material type used by your content:

```typescript
import { RegisterPBRMaterial } from "@babylonjs/core/pure";

RegisterPBRMaterial();
```

### Shader compilation error: include "X" not found

A shader include has not been registered in the shader store. Register the material or effect that owns the shader dependency:

```typescript
import { RegisterStandardMaterial } from "@babylonjs/core/pure";

RegisterStandardMaterial();
```

For custom shaders, import the shader include module your shader needs.

## Diagnostic Tools

### CheckMissingImports

`CheckMissingImports` probes known stubs and reports side-effect modules that have not been registered:

```typescript
import { CheckMissingImports } from "@babylonjs/core/Misc/checkMissingImports";

const missing = CheckMissingImports();
if (missing.length > 0) {
  console.log("You may need to register:", missing);
}
```

It can check stubs for parser registration, scene factory methods, scene picking, texture factories, mesh parsers, and node factories.

**What it checks**:

- SerializationHelper parser stubs such as ImageProcessingConfiguration, FresnelParameters, ColorCurves, and Texture.
- Scene factory stubs such as DefaultMaterialFactory and CollisionCoordinatorFactory.
- Scene picking stubs such as Ray and createPickingRay.
- Texture factory stubs such as CubeTexture, MirrorTexture, RenderTargetTexture, and VideoTexture.
- Mesh parser stubs such as InstancedMesh, GroundMesh, LinesMesh, TrailMesh, and GaussianSplattingMesh.
- Node factory stubs such as AnimationRange.

Not every reported module is required. The report lists what is available but unregistered, so only import the features your application actually uses.

### Side-Effect Warning Stubs

When pure imports are used, augmented prototype methods can be represented by lightweight stubs until registration occurs. These stubs make missing side effects easier to diagnose and allow feature-detection checks to remain safe.

These stubs:

- Return `undefined`, so feature-detection code like `if (scene.getPhysicsEngine())` works correctly.
- Do not log warnings by default, because internal engine code may probe optional features frequently.
- Produce a clear `TypeError` if you try to use the return value as an object.

For example, code such as `if (scene.getPhysicsEngine()) { ... }` can evaluate to `false` when physics is not registered, instead of crashing during a feature check.

To debug a pure-import scene and see which missing side-effect registrations are actually being called, enable runtime stub warnings during development:

```typescript
import { SetMissingSideEffectWarningsEnabled } from "@babylonjs/core/Misc/devTools";

SetMissingSideEffectWarningsEnabled(true);
```

With this enabled, each missing side-effect stub logs at most once:

```text
[Babylon.js] Scene.getPhysicsEngine() requires a side-effect import. See: https://doc.babylonjs.com/setup/frameworkPackages/es6Support/treeShaking
```

If your code intentionally probes optional augmented APIs, suppress warnings around that synchronous probe:

```typescript
import { SuppressMissingSideEffectWarnings } from "@babylonjs/core/Misc/devTools";

SuppressMissingSideEffectWarnings(() => {
  scene.getPhysicsEngine?.();
});
```

Use runtime warnings as a development diagnostic. For a broad startup report of all known unregistered stubs, use `CheckMissingImports()` instead.

## Performance Considerations

### Registration Timing

Register side effects before you use them. A common pattern is to group application registrations near the top of your entry point:

```typescript
import { RegisterStandardMaterial, RegisterRay, RegisterJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";

RegisterStandardMaterial();
RegisterRay();
RegisterJoinedPhysicsEngineComponent();
```

### Bundle Size Impact

Registration functions are typically small. The main bundle-size benefit comes from not importing the modules your application does not need.

| Approach                                | Approximate Bundle Size |
| --------------------------------------- | ----------------------- |
| `@babylonjs/core` (everything)          | ~6+ MB minified         |
| `@babylonjs/core/pure` (typical app)    | ~1.5-3 MB minified      |
| Minimal scene (pure, few registrations) | ~1-1.5 MB minified      |

## Migration Checklist

When converting an existing project to pure imports:

1. Switch value imports to `.pure` paths or the pure barrel.
2. Identify bare side-effect imports such as `import "@babylonjs/core/..."`.
3. Replace each side-effect import with the matching `RegisterXxx` import and call.
4. Add `.types` imports for type augmentations you use.
5. Run `CheckMissingImports()` during development.
6. Test asset loading, picking, physics, XR, materials, and any optional systems your app uses.
7. Remove `CheckMissingImports()` from production code.
