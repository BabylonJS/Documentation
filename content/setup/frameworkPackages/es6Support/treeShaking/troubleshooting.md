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

Register the matching feature:

```typescript
import { registerStandardMaterial } from "@babylonjs/core/pure";

registerStandardMaterial();
```

Common triggers include:

| Error message                                          | Registration needed                      |
| ------------------------------------------------------ | ---------------------------------------- |
| `StandardMaterial needs to be imported...`             | `registerStandardMaterial()`             |
| `ImageProcessingConfiguration needs to be imported...` | `registerImageProcessingConfiguration()` |
| `ColorCurves needs to be imported...`                  | `registerColorCurves()`                  |
| `Texture needs to be imported...`                      | `registerTexture()`                      |
| `FresnelParameters needs to be imported...`            | `registerFresnelParameters()`            |
| `Ray needs to be imported...`                          | `registerRay()`                          |
| `CubeTexture needs to be imported...`                  | `registerCubeTexture()`                  |
| `InstancedMesh needs to be imported...`                | `registerInstancedMesh()`                |

### TypeError: scene.enablePhysics is not a function

The physics scene component has not been registered. The method is added to `Scene` only after registration:

```typescript
import { registerJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent.types";

registerJoinedPhysicsEngineComponent();
```

### TypeError: scene.pick is not a function

Picking functionality depends on ray registration:

```typescript
import { registerRay } from "@babylonjs/core/pure";

registerRay();
```

### TypeScript error: Property 'enablePhysics' does not exist on type 'Scene'

The runtime feature may be registered, but TypeScript still needs the type augmentation:

```typescript
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent.types";
```

Use `.types` imports for features that augment classes with additional methods or properties.

### Cascading Errors

Some features have dependencies. You might fix one missing registration and then see another error when a dependent feature is reached.

To resolve this:

1. Use `CheckMissingImports()` during development to discover unregistered stubs.
2. Prefer registration functions that handle their required transitive dependencies.
3. For scene loading, register the material, texture, and parser types that your assets use.

A common serialized-scene setup looks like this:

```typescript
registerStandardMaterial();
registerPBRMaterial();
registerImageProcessingConfiguration();
registerTexture();
registerFresnelParameters();
```

### Materials Appear Black or Default After Loading

The material class was not registered, so deserialization could not recreate it correctly. Register the material type used by your content:

```typescript
import { registerPBRMaterial } from "@babylonjs/core/pure";

registerPBRMaterial();
```

### Shader compilation error: include "X" not found

A shader include has not been registered in the shader store. Register the material or effect that owns the shader dependency:

```typescript
import { registerStandardMaterial } from "@babylonjs/core/pure";

registerStandardMaterial();
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

Not every reported module is required. The report lists what is available but unregistered, so only import the features your application actually uses.

### Side-Effect Stubs

When pure imports are used, augmented prototype methods can be represented by lightweight stubs until registration occurs. These stubs make missing side effects easier to diagnose and allow feature-detection checks to remain safe.

For example, code such as `if (scene.getPhysicsEngine()) { ... }` can evaluate to `false` when physics is not registered, instead of crashing during a feature check.

## Performance Considerations

Register side effects before you use them. A common pattern is to group application registrations near the top of your entry point:

```typescript
import { registerStandardMaterial, registerRay, registerJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";

registerStandardMaterial();
registerRay();
registerJoinedPhysicsEngineComponent();
```

Registration functions are typically small. The main bundle-size benefit comes from not importing the modules your application does not need.

## Migration Checklist

When converting an existing project to pure imports:

1. Switch value imports to `.pure` paths or the pure barrel.
2. Identify bare side-effect imports such as `import "@babylonjs/core/..."`.
3. Replace each side-effect import with the matching `registerXxx()` import and call.
4. Add `.types` imports for type augmentations you use.
5. Run `CheckMissingImports()` during development.
6. Test asset loading, picking, physics, XR, materials, and any optional systems your app uses.
7. Remove `CheckMissingImports()` from production code.
