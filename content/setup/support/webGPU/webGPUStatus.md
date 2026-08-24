---
title: WebGPU Status
image: 
description: Learn the current status of the port to WebGPU as well as the next steps and caveats to be aware of.
keywords: babylon.js, advanced, WebGPU, support, status
further-reading:
video-overview:
video-content:
---


## Make it work: Current status of the port
The implementation in WebGPU is complete and, besides a few exceptions, all features are available both in WebGPU and WebGL:

### Features with incomplete support
* [Point Cloud System](/typedoc/classes/babylon.pointscloudsystem)
  * WebGPU does not support a point size different from 1, so setting the point size to a value other than 1 will not be taken into account
* [WebGPU in WebXR](/features/featuresDeepDive/webXR/webGPUXR)
  * WebGPU-XR is experimental and requires browser support for `XRGPUBinding` projection layers
  * WebGPU-XR multiview, Raw Camera Access, Space Warp, and GPU-optimized Depth Sensing are not currently supported
  * Quad layers require the runtime to expose the optional `XRGPUBinding.createQuadLayer` and `XRGPUBinding.getSubImage` methods

### Features not working because not implemented yet
* Support for triangle fan / line loop drawing mode
  * WebGPU does not support those modes, so we will need to emulate them with triangle strip and line strip

## Make it fast: Optimizations
The most important optimizations have now been done (see [Optimizations](/setup/support/webGPU/webGPUOptimization)), others could be considered:
* Use compute shaders to perform some conversions when reading data from buffers
* Use compute shaders to generate mipmaps

## Other "nice-to-have" features 
* Use `CreatePipelineAsync` for asynchronous pipeline creations

## Browser Caveats
Chrome / Chrome Canary do not support all WebGPU features yet, and some others are not fully functional, so here are some caveats:
* GPU timing in the **Inspector** does not work because timestamp queries are currently disabled in Chrome. You can start Chrome with the `--enable-dawn-features=allow_unsafe_apis` flag if you want to enable them. You can also add the `--enable-webgpu-developer-features` flag for more precise timing.
