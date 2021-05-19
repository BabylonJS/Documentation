---
title: WebGPU Status
image: 
description: Learn the current status of the port to WebGPU as well as the next steps and caveats to be aware of.
keywords: babylon.js, advanced, WebGPU, support, status
further-reading:
video-overview:
video-content:
---

*Note that we will use Chrome Canary as our gauge browser for WebGPU features as other browsers are still lagging in term of feature support as of this writing (2021/05/19).*

## Make it work: Current status of the port
Most of the features of Babylon.js are now available in WebGPU. Here's a detailed list of what is not working / is partially working.

### Features with incomplete support
* [Point Cloud System](/typedoc/classes/babylon.pointscloudsystem)
  * WebGPU does not support a point size different from 1, so setting a value different from 1 for the point size won't be taken into account

### Features not working because not implemented yet
* Support for triangle fan / line loop drawing mode
  * WebGPU does not support those modes, we will need to emulate them with triangle strip and line strip
* [Occlusion Queries](/divingDeeper/occlusionQueries)
  * Not implemented yet but not supported by Chrome neither
* [Multiview / WebXR](/divingDeeper/cameras/multiViewsPart1)
  * Not implemented yet but not supported by Chrome / WebGPU specifications neither
* [Multi views (multi canvas)](/divingDeeper/scene/multiCanvas)
  * Not implemented yet but Chrome does not allow to read the data of a WebGPU canvas yet so can't be implemented

### Features implemented but not working or fully working because not implemented/fully implemented by Chrome yet
* 3D textures
  * [Color grading textures](/typedoc/classes/babylon.colorgradingtexture) does not work because of this
* Reading the canvas
  * [CreateScreenshot](/typedoc/classes/babylon.screenshottools#createscreenshot) does not work because of that
* [Multiple Render Targets (MRT)](/typedoc/classes/babylon.multirendertarget)
  * Chrome does not currently support more than 4 targets, so your code will crash if it is using more. In Babylon.js, MRTs are used in the geometry renderer and the pre-pass renderer
* MSAA can only be 1 or 4 in Chrome as of this writing

## Make it fast: Optimizations
We need to implement some specific mechanisms / features to get the most of our implementation:
* ~~Add a cache for the render pipelines~~ Done
* ~~Add a cache for the binding groups~~ Done
* Use render bundles to improve performances:
  * Done through `engine.compatibilityMode = false` but needs more work to support more features of the engine
  * Also added `engine.snapshotRendering` and `engine.snapshotRenderingMode` to improve performances in some specific cases (when scene is mostly static)
* Use compute shaders -> the `ComputeShader` class is now in
  * To perform some conversions when reading data from buffers
  * To replace the existing min/max computation code
  * To implement GPU particle systems -> **Done**!
* Use WGSL when back compat is not required
* Use `CreatePipelineAsync` for asynchronous pipeline creations
* ...and lots of others!

So, don't try to benchmark your code against WebGL just yet, it won't be representative of the real performances you will get once the steps outlined above are integrated (and notably the 3rd one)!

## Browser Caveats
Chrome Canary does not support all WebGPU features yet, so here are some caveats as of 2021/03/11:
* No 3D textures
* Limited to 4 targets for MRTs
* MSAA limited to values 1 or 4
* Updating GPU textures with canvas / videos is slow. It means you will see really bad performance if you use dynamic GUIs (GUI that have elements which are updated on each frame) or video elements.
  * Try this PG for eg: <Playground id="#6X9UMD#13" title="Multiple dynamic GUIs + Video" description="Example showing the bad performance we currently have when using dynamic GUIs and videos"/>
* No WebGPU capabilities (caps) returned by the browser
  * For the time being, we have set some hard values for the caps (4 for MSAA max samples, for eg, as Chrome does not support more yet)
