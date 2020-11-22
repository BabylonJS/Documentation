---
title: WebGPU Status
image: 
description: Learn the current status of the port to WebGPU as well as the next steps and caveats to be aware of.
keywords: babylon.js, advanced, WebGPU, support, status
further-reading:
video-overview:
video-content:
---

*Note that we will use Chrome Canary as our gauge browser for WebGPU features as other browsers are still lagging in term of feature support as of this writing (2020/11/21).*

## Make it work: Current status of the port
Most of the features of Babylon.js are now available in WebGPU. Here's a detailed list of what is not working / is partially working.

### Features with incomplete support
* [Point Cloud System](/typedoc/classes/babylon.pointscloudsystem)
  * WebGPU does not support a point size different from 1, so setting a value different from 1 for the point size won't be taken into account

### Features not working because not implemented yet
* [GPU particle systems](/typedoc/classes/babylon.gpuparticlesystem)
  * The current implementation is using a specific feature of WebGL2 (feedback buffers), we need to use compute shaders to implement this in WebGPU
* Reporting the GPU frame time
  * Needs to implement the [timestamp-query](https://gpuweb.github.io/gpuweb/#timestamp-query) extension
* Support of triangle fan / line loop drawing mode
  * WebGPU does not support those modes, we will need to emulate them with triangle strip and line strip
* [Occlusion Queries](/divingDeeper/occlusionQueries)
  * Not implemented yet but not supported by Chrome neither
* [Multiview / WebXR](/divingDeeper/cameras/multiViewsPart1)
  * Not implemented yet but not supported by Chrome / WebGPU specifications neither
* [Multi views (multi canvas)](/divingDeeper/scene/multiCanvas)
  * Not implemented yet but Chrome does not allow to read the data of a WebGPU canvas yet so can't be implemented

### Features implemented but not working / fully working because not implemented / fully implemented by Chrome yet
* [Anisotropic filtering](/typedoc/classes/babylon.texture#anisotropicfilteringlevel)
* 3D textures
  * [Color grading textures](/typedoc/classes/babylon.colorgradingtexture) does not work because of this
* Reading the canvas
  * [CreateScreenshot](/typedoc/classes/babylon.screenshottools#createscreenshot) does not work because of that
* [Multiple Render Targets (MRT)](/typedoc/classes/babylon.multirendertarget)
  * Chrome does not currently support more than 4 targets, so your code will crash if it is using more. In Babylon.js, MRTs are used in the geometry renderer and the pre-pass renderer
  * Also, there is currently another limitation in the MRT feature which is that we can't bind some targets and not others, so some samples using the geometry/pre-pass renderer will break because of that

## Make it fast: Optimizations
We need to implement some specific mechanisms / features to get the most of our implementation:
* Add a cache for the render pipelines
* Add a cache for the binding groups
* Add a cache for the vertex input bindings
* Use compute shaders
  * To perform some conversions when reading data from buffers
  * To replace the existing min/max computation code
  * To implement GPU particle systems
* Use WGSL when back compat is not required
* Use render bundles to improve performances
* Use `CreateReadyPipeline` for asynchronous pipeline creations
* ...and lots of others!

So, don't try to benchmark your code against WebGL just yet, it won't be representative of the real performances you will get once the steps outlined above are integrated (and notably the first 3 ones)!

## Browser Caveats
Chrome Canary does not support all WebGPU features yet, so here are some caveats as of 2020/11/21:
* No Anisotropic filtering
* No 3D textures
* Limited to 4 targets for MRTs
* Updating GPU textures with canvas / videos is slow. It means you will see really bad performance if you use dynamic GUIs (GUI that have elements which are updated on each frame) or video elements.
  * Try this PG for eg: <Playground id="#6X9UMD#13" title="Multiple dynamic GUIs + Video" description="Example showing the bad performance we currently have when using dynamic GUIs and videos" image=""/>
* No WebGPU capabilities (caps) returned by the browser
  * For the time being, we have set some hard values for the caps (4 for MSAA max samples, for eg, as Chrome does not support more yet)
* There's a bug with the WebGPU `writeTexture` method that will make some samples using very small skeletons (less than 4 bones) crash
