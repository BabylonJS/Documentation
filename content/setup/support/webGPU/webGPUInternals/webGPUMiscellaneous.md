---
title: WebGPU Internals - Miscellaneous
image: 
description: Learn how the WebGPU engine has been implemented in Babylon.js
keywords: babylon.js, WebGPU, engine, implementation
further-reading:
video-overview:
video-content:
---

## Validation tests
These validation tests are excluded from WebGPU because some features are not yet implemented in Babylon.js:
* **GLTF Mesh Primitive Mode (0)** and **GLTF Mesh Primitive Mode (1)**: line loop / triangle fan not implemented yet
* **GLTF Buggy with Meshopt Compression**: formats other than `float` for the vertex buffers (*position*, *normal*, *uv*, ...) are not supported yet

When the features are implemented, the corresponding validation tests should be re-enabled.

The **Self shadowing** validation test generates rendering errors, but it is still acceptable because there are fewer than 2.5% errors. This happens because it uses an exponential shadow map whose parameters, especially `depthScale`, depend on the precision of the depth map. In WebGL, we use a 32-bit float texture, but in WebGPU it is only a half-float texture because linear filtering of 32-bit float textures is not supported, at least for the time being:

![WebGPU chart](/img/extensions/webgpu/webgpuValidationTestSelfShadowing.webp)

**Note to core developers: YOU SHOULD RUN THE VALIDATION TESTS LOCALLY OFTEN BECAUSE THEY ARE NOT RUN ON THE AZURE SERVERS!**

Run both the:
* WebGPU tests: http://localhost:1338/tests/validation/?list=webgpu&engine=webgpu
* Standard tests: http://localhost:1338/tests/validation/?list=config&engine=webgpu

You should also run them in the "check resource creation" mode: see [Check Resource Creation - WebGPU only
](/contribute/toBabylon/validationTests#check-resource-creation---webgpu-only).

## TintWASM
You should update the **TWGSL** (Tint WASM) module regularly so that it stays in sync with the **Tint** source code.

* TintWASM module: https://github.com/syntheticmagus/twgsl
* Tint repository: https://dawn.googlesource.com/tint
