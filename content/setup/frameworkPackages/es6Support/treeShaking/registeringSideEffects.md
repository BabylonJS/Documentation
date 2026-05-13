---
title: Registering Side Effects
image:
description: Activate Babylon.js side-effect features explicitly when using pure imports.
keywords: babylon.js, pure imports, side effects, register functions, serialization, shaders, xr, physics
further-reading:
  - title: Tree-Shaking with Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking
  - title: Using Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking/usingPureImports
  - title: Troubleshooting Pure Imports
    url: /setup/frameworkPackages/es6Support/treeShaking/troubleshooting
video-overview:
video-content:
---

## What Are Side Effects?

In the context of tree-shaking, a side effect is any code that runs automatically when a file is imported, changing global state. Babylon.js has several categories:

| Category               | Purpose                                                           | Example                                   |
| ---------------------- | ----------------------------------------------------------------- | ----------------------------------------- |
| `RegisterClass`        | Let the engine recreate objects by name when loading saved scenes | `RegisterClass("BABYLON.Camera", Camera)` |
| Prototype augmentation | Attach optional methods to existing classes                       | `Scene.prototype.enablePhysics = ...`     |
| Shader registration    | Store shader source code for GPU compilation                      | `ShaderStore["default"] = "..."`          |
| Feature registration   | Make features available by name                                   | WebXR feature registration                |
| Node constructor       | Enable node-based editor blocks                                   | `AddNodeConstructor("Block", ...)`        |

When using pure imports, these side effects do not run automatically. You turn them on by calling the corresponding `RegisterXxx()` function.

## Finding Registration Functions

All registration functions follow the naming pattern `Register` plus the PascalCase file name:

| File                                   | Registration Function                    |
| -------------------------------------- | ---------------------------------------- |
| `standardMaterial.pure.ts`             | `RegisterStandardMaterial()`             |
| `joinedPhysicsEngineComponent.pure.ts` | `RegisterJoinedPhysicsEngineComponent()` |
| `engine.multiRender.pure.ts`           | `RegisterEngineMultiRender()`            |
| `depthRendererSceneComponent.pure.ts`  | `RegisterDepthRendererSceneComponent()`  |
| `boundingBoxRenderer.pure.ts`          | `RegisterBoundingBoxRenderer()`          |

Type `Register` in your IDE and autocomplete will list available registration functions. The names map directly to the Babylon.js module paths you already know.

## Categories of Registration

### Material and Serialization Registration

Serialized content needs class and parser registration so Babylon.js can recreate objects by class name:

```typescript
import { RegisterStandardMaterial, RegisterPBRMaterial, RegisterImageProcessingConfiguration, RegisterTexture, RegisterFresnelParameters } from "@babylonjs/core/pure";

RegisterStandardMaterial();
RegisterPBRMaterial();
RegisterImageProcessingConfiguration(); // Also registers ColorCurves automatically
RegisterTexture();
RegisterFresnelParameters();
```

Register these when loading `.babylon` files, snippets, or other serialized content that may contain those types.

### Scene Component Registration

Some features add methods to existing classes such as `Scene`, `Engine`, `Mesh`, or `Camera`:

```typescript
// Physics
import { RegisterJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent.types";

RegisterJoinedPhysicsEngineComponent();
// Now scene.enablePhysics(), scene.getPhysicsEngine(), etc. are available
```

After registration, methods such as `scene.enablePhysics()` are available at runtime. The `.types` import makes TypeScript aware of the same methods.

Other common scene component registrations include:

```typescript
import { RegisterRay, RegisterDepthRendererSceneComponent, RegisterBoundingBoxRenderer } from "@babylonjs/core/pure";

RegisterRay();
RegisterDepthRendererSceneComponent();
RegisterBoundingBoxRenderer();
```

### Engine Extension Registration

Engine extensions add capabilities like texture loading, alpha blending, multi-render targets, and uniform buffers. Three tiered helpers let you register groups of extensions at once:

```typescript
import { RegisterCoreEngineExtensions, RegisterStandardEngineExtensions, RegisterFullEngineExtensions } from "@babylonjs/core/pure";

RegisterCoreEngineExtensions(); // Minimum: DOM, render passes, GPU states, stencil
RegisterStandardEngineExtensions(); // Most apps: Core + textures, file loading, alpha, render targets, uniform buffers
RegisterFullEngineExtensions(); // Everything: Standard + cube/raw/dynamic textures, multi-render, multiview, queries, compute, video, debugging
```

For most applications, `RegisterStandardEngineExtensions()` is the right choice. All tiers are safe to call multiple times or in combination. Calling a higher tier after a lower one just adds the missing pieces.

You can also register individual extensions if you need fine-grained control:

```typescript
import { RegisterEnginesExtensionsEngineMultiRender, RegisterEngineTransformFeedback } from "@babylonjs/core/pure";

RegisterEnginesExtensionsEngineMultiRender();
RegisterEngineTransformFeedback();
```

### Node Editor Block Registration

Node Material, Node Geometry, Node Particle, Flow Graph, and Node Render Graph systems need block registration for deserialization and editor workflows.

Register all blocks for a system:

```typescript
import { RegisterAllNodeMaterialBlocks } from "@babylonjs/core/pure";

RegisterAllNodeMaterialBlocks();
```

Or register only selected categories:

```typescript
import { RegisterNodeMaterialPBRBlocks, RegisterNodeMaterialMathBlocks, RegisterNodeMaterialVertexBlocks } from "@babylonjs/core/pure";

RegisterNodeMaterialPBRBlocks();
RegisterNodeMaterialMathBlocks();
RegisterNodeMaterialVertexBlocks();
```

Bulk registrations include:

| Function                             | System                   | Blocks |
| ------------------------------------ | ------------------------ | ------ |
| `RegisterAllNodeMaterialBlocks()`    | Node Material Editor     | ~108   |
| `RegisterAllNodeGeometryBlocks()`    | Node Geometry Editor     | ~80    |
| `RegisterAllNodeParticleBlocks()`    | Node Particle Editor     | ~49    |
| `RegisterAllFlowGraphBlocks()`       | Flow Graph               | ~47    |
| `RegisterAllNodeRenderGraphBlocks()` | Node Render Graph Editor | ~44    |

### XR Feature Registration

```typescript
import { RegisterWebXRDefaultExperience, RegisterWebXRHandTracking, RegisterWebXRAnchorSystem, RegisterWebXRHitTest } from "@babylonjs/core/pure";

RegisterWebXRDefaultExperience();
RegisterWebXRHandTracking();
RegisterWebXRAnchorSystem();
RegisterWebXRHitTest();
```

## Automatic Dependencies

Some registration functions automatically register the features they depend on. For example:

- `RegisterImageProcessingConfiguration()` automatically calls `RegisterColorCurves()`.
- `RegisterStandardMaterial()` registers the class and its parser.

You do not need to manually register dependencies that are already handled this way. If you are unsure, calling a registration function multiple times is harmless.

## CheckMissingImports Diagnostic

If you are unsure which registrations your application needs, use the development diagnostic utility:

```typescript
import { CheckMissingImports } from "@babylonjs/core/Misc/checkMissingImports";

const missing = CheckMissingImports();
```

This scans all known placeholders and reports which features have not been registered:

```text
[Babylon.js] The following side-effect modules have not been imported:
  - Ray
  - ImageProcessingConfiguration
  - Texture
Note: These are only required if your application uses the corresponding features.
If you do use them, import the modules or their parent packages to avoid runtime errors.
See: https://doc.babylonjs.com/setup/frameworkPackages/es6Support/treeShaking
```

`CheckMissingImports` can report modules your application never uses. Treat it as a development aid, then register only the features your code actually needs. Do not include this diagnostic in production builds.

## Safe to Call Multiple Times

All registration functions are safe to call more than once. Only the first call actually does anything:

```typescript
RegisterStandardMaterial();
RegisterStandardMaterial(); // No-op, already registered
RegisterStandardMaterial(); // No-op
```

This means:

- You can safely call registration functions from multiple modules.
- Libraries can register what they need without worrying about duplicate calls.
- The order of registration usually does not matter, except for dependencies that must exist before use.

## Migration from Existing Side-Effect Imports

To migrate an existing side-effect import:

```typescript
// Before:
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent";

// After:
import { RegisterJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";
RegisterJoinedPhysicsEngineComponent();
```

The mapping is straightforward:

1. Take the side-effect import path.
2. Add `.pure` before the extension.
3. Import the matching `RegisterXxx` function from `@babylonjs/core/pure`, where `Xxx` is the PascalCase filename.
4. Call it before using the feature.
5. Add the `.types` import when the feature augments TypeScript types.
