---
title: WebGPU Status
image: 
description: Learn the current status of the port to WebGPU as well as the next steps and caveats to be aware of.
keywords: babylon.js, advanced, WebGPU, support, status
further-reading:
video-overview:
video-content:
---

*Note that we will use Chrome Canary as our gauge browser for WebGPU features as other browsers are still lagging in term of feature support as of this writing (2023/08/29).*

## Make it work: Current status of the port
Most of the features of Babylon.js are now available in WebGPU. Here's a detailed list of what is not working / is partially working.

### Features with incomplete support
* [Point Cloud System](/typedoc/classes/babylon.pointscloudsystem)
  * WebGPU does not support a point size different from 1, so setting a value different from 1 for the point size won't be taken into account

### Features not working because not implemented yet
* Support for triangle fan / line loop drawing mode
  * WebGPU does not support those modes, we will need to emulate them with triangle strip and line strip
* Support types other than `float` for the vertex buffers (position, normal, uv, ...)
  * Contrary to WebGL, in WebGPU there's no automatic conversion from the type of the vertex buffer to the type used by shader
* Handle context lost/restore
* [Multiview / WebXR](/features/featuresDeepDive/cameras/multiViewsPart1)
  * Not implemented yet but not supported by Chrome / WebGPU specifications neither

## Make it fast: Optimizations
The most important optimizations have now been done (see [Optimizations](/setup/support/webGPU/webGPUOptimization)), others could be considered:
* Use compute shaders to perform some conversions when reading data from buffers
* Use compute shaders to generate mipmaps

## Other "nice-to-have" features 
* Use `CreatePipelineAsync` for asynchronous pipeline creations

## Browser Caveats
Chrome Canary does not support all WebGPU features yet (or some others are not fully functional yet), so here are some caveats:
* GPU timing in the **Inspector** does not work because timestamp queries are currently disabled in Chrome. You can start Chrome with the `--disable-dawn-features=disallow_unsafe_apis` flag if you want to enable them.
