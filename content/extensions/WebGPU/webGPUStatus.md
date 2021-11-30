---
title: WebGPU Status
image: 
description: Learn the current status of the port to WebGPU as well as the next steps and caveats to be aware of.
keywords: babylon.js, advanced, WebGPU, support, status
further-reading:
video-overview:
video-content:
---

*Note that we will use Chrome Canary as our gauge browser for WebGPU features as other browsers are still lagging in term of feature support as of this writing (2021/11/17).*

## Make it work: Current status of the port
Most of the features of Babylon.js are now available in WebGPU. Here's a detailed list of what is not working / is partially working.

### Features with incomplete support
* [Point Cloud System](/typedoc/classes/babylon.pointscloudsystem)
  * WebGPU does not support a point size different from 1, so setting a value different from 1 for the point size won't be taken into account

### Features not working because not implemented yet
* Support for triangle fan / line loop drawing mode
  * WebGPU does not support those modes, we will need to emulate them with triangle strip and line strip
* [Multiview / WebXR](/divingDeeper/cameras/multiViewsPart1)
  * Not implemented yet but not supported by Chrome / WebGPU specifications neither

### Features implemented but not working or fully working because not implemented/fully implemented by Chrome yet
* MSAA can only be 1 or 4 in Chrome as of this writing

## Make it fast: Optimizations
We need to implement some specific mechanisms / features to get the most of our implementation:
* Use render bundles to improve performances:
  * Done through `engine.compatibilityMode = false` ~~but needs more work to support more features of the engine~~ => should now work as expected, need some docs
  * Also added `engine.snapshotRendering` and `engine.snapshotRenderingMode` to improve performances in some specific cases. See [Snapshot rendering](/advanced_topics/webGPU/webGPUSnapshotRendering)
* Use compute shaders -> the [ComputeShader](/advanced_topics/shaders/computeShader) class is now in
  * To perform some conversions when reading data from buffers
* Use `CreatePipelineAsync` for asynchronous pipeline creations

## Browser Caveats
Chrome Canary does not support all WebGPU features yet (or some others are not fully functional yet), so here are some caveats:
* MSAA limited to values 1 or 4
* No WebGPU capabilities (caps) returned by the browser
  * For the time being, we have set some hard values for the caps (4 for MSAA max samples, for eg, as Chrome does not support more yet)
* **error X3511: unable to unroll loop, loop does not appear to terminate in a timely manner (XXX iterations) or unrolled loop is too large, use the [unroll(n)] attribute to force an exact higher number**
  * You can sometimes get this error when using SSAO / Geometry Buffer renderer / Pre-Pass rendering... It's a known problem with the FXC compiler used by Chrome
  * See https://bugs.chromium.org/p/tint/issues/detail?id=1112
* GPU timing in the **Inspector** does not work because timestamp queries are currently disabled in Chrome. You can start Chrome with the `--disable-dawn-features=disallow_unsafe_apis` flag if you want to enable them.
