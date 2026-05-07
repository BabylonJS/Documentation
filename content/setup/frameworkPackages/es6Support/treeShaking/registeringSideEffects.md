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

## What Side Effects Are

In the context of tree-shaking, a side effect is code that modifies shared state when a module is imported. Babylon.js uses side effects for several categories of behavior:

| Category                      | Purpose                                    | Example                                   |
| ----------------------------- | ------------------------------------------ | ----------------------------------------- |
| `RegisterClass`               | Enable deserialization by class name       | `RegisterClass("BABYLON.Camera", Camera)` |
| Prototype augmentation        | Add optional methods to core classes       | `Scene.prototype.enablePhysics = ...`     |
| Shader registration           | Register shader source for GPU compilation | `ShaderStore["default"] = "..."`          |
| Feature registration          | Make features discoverable by name         | WebXR feature registration                |
| Node constructor registration | Enable node-based editor blocks            | `AddNodeConstructor("Block", ...)`        |

With pure imports, these side effects do not run automatically. You opt in by calling the matching `registerXxx()` function.

## Finding Registration Functions

Registration functions follow the naming pattern `register` plus the PascalCase file name:

| File                                   | Registration function                    |
| -------------------------------------- | ---------------------------------------- |
| `standardMaterial.pure.ts`             | `registerStandardMaterial()`             |
| `joinedPhysicsEngineComponent.pure.ts` | `registerJoinedPhysicsEngineComponent()` |
| `engine.multiRender.pure.ts`           | `registerEngineMultiRender()`            |
| `depthRendererSceneComponent.pure.ts`  | `registerDepthRendererSceneComponent()`  |
| `boundingBoxRenderer.pure.ts`          | `registerBoundingBoxRenderer()`          |

Type `register` in your IDE to discover available registration functions. The names map directly to the Babylon.js module paths you already know.

## Material and Serialization Registration

Serialized content needs class and parser registration so Babylon.js can recreate objects by class name:

```typescript
import { registerStandardMaterial, registerPBRMaterial, registerImageProcessingConfiguration, registerTexture, registerFresnelParameters } from "@babylonjs/core/pure";

registerStandardMaterial();
registerPBRMaterial();
registerImageProcessingConfiguration();
registerTexture();
registerFresnelParameters();
```

Register these when loading `.babylon` files, snippets, or other serialized content that may contain those types.

## Scene Component Registration

Some features add methods to existing classes such as `Scene`, `Engine`, `Mesh`, or `Camera`:

```typescript
import { registerJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent.types";

registerJoinedPhysicsEngineComponent();
```

After registration, methods such as `scene.enablePhysics()` are available at runtime. The `.types` import makes TypeScript aware of the same methods.

Other common scene component registrations include:

```typescript
import { registerRay, registerDepthRendererSceneComponent, registerBoundingBoxRenderer } from "@babylonjs/core/pure";

registerRay();
registerDepthRendererSceneComponent();
registerBoundingBoxRenderer();
```

## Engine Extension Registration

Engine extensions are also explicit with pure imports:

```typescript
import { registerEngineMultiRender, registerEngineOcclusionQuery, registerEngineTransformFeedback } from "@babylonjs/core/pure";

registerEngineMultiRender();
registerEngineOcclusionQuery();
registerEngineTransformFeedback();
```

## Node Editor Block Registration

Node Material, Node Geometry, Node Particle, Flow Graph, and Node Render Graph systems need block registration for deserialization and editor workflows.

Register all blocks for a system:

```typescript
import { registerAllNodeMaterialBlocks } from "@babylonjs/core/pure";

registerAllNodeMaterialBlocks();
```

Or register only selected categories:

```typescript
import { registerNodeMaterialPBRBlocks, registerNodeMaterialMathBlocks, registerNodeMaterialVertexBlocks } from "@babylonjs/core/pure";

registerNodeMaterialPBRBlocks();
registerNodeMaterialMathBlocks();
registerNodeMaterialVertexBlocks();
```

Bulk registrations include:

| Function                             | System                   |
| ------------------------------------ | ------------------------ |
| `registerAllNodeMaterialBlocks()`    | Node Material Editor     |
| `registerAllNodeGeometryBlocks()`    | Node Geometry Editor     |
| `registerAllNodeParticleBlocks()`    | Node Particle Editor     |
| `registerAllFlowGraphBlocks()`       | Flow Graph               |
| `registerAllNodeRenderGraphBlocks()` | Node Render Graph Editor |

## XR Feature Registration

```typescript
import { registerWebXRDefaultExperience, registerWebXRHandTracking, registerWebXRAnchorSystem, registerWebXRHitTest } from "@babylonjs/core/pure";

registerWebXRDefaultExperience();
registerWebXRHandTracking();
registerWebXRAnchorSystem();
registerWebXRHitTest();
```

## Transitive Dependencies

Some registration functions register their own required dependencies. For example, `registerImageProcessingConfiguration()` can register related image-processing dependencies that are required by its parser path.

You do not need to manually register dependencies that are already handled transitively. If you are unsure, calling a registration function multiple times is harmless because registration functions are idempotent.

## CheckMissingImports Diagnostic

If you are unsure which registrations your application needs, use the development diagnostic utility:

```typescript
import { CheckMissingImports } from "@babylonjs/core/Misc/checkMissingImports";

const missing = CheckMissingImports();
```

It reports known side-effect stubs that have not been registered:

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

## Migration from Existing Side-Effect Imports

To migrate an existing side-effect import:

```typescript
// Before:
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent";

// After:
import { registerJoinedPhysicsEngineComponent } from "@babylonjs/core/pure";
registerJoinedPhysicsEngineComponent();
```

The mapping is straightforward:

1. Take the side-effect import path.
2. Import the matching `registerXxx` function from `@babylonjs/core/pure`.
3. Call it before using the feature.
4. Add the `.types` import when the feature augments TypeScript types.
