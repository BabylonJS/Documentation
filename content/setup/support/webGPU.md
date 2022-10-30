---
title: WebGPU Support
image: 
description: Dive into understanding the full scope of support for WebGPU in Babylon.js.
keywords: babylon.js, advanced, WebGPU, support
further-reading:
video-overview:
video-content:
---

## Introduction
Following the specification from the [GPU for the Web Working Group](https://github.com/gpuweb/gpuweb), we have begun the journey to support this new technology. Our plan is to deliver support with WebGPU and WebGL feature parity in Babylon 5.

![Inspector](/img/extensions/WebGPU.png)

### Benefits of WebGPU
The promise behind [WebGPU](https://developer.chrome.com/en/docs/web-platform/webgpu/#what) is an exceptionally faster API provided through lower level control to system graphics resources from JavaScript. We hope to bring these extra performance improvements to developers in order to create even higher quality 3D web games and experiences through a tool they are already familiar with: Babylon.js.

Some features WebGPU brings to the table are:
* Compute shaders
* Ray tracing ([in-progress](https://github.com/gpuweb/gpuweb/issues/535))
* Improved performance across the board
* and more...

## Progress

See the [dedicated progress page](/setup/support/webGPU/webGPUStatus).

You can also follow our progress on out [GitHub dedicated issue](https://github.com/BabylonJS/Babylon.js/issues/6443).

The current implementation of WebGPU is now merged in the main branch of the Babylon.js [GitHub repository](https://github.com/BabylonJS/Babylon.js).

We are putting in a big effort alongside our next release to implement full support. Every contribution is more than welcome, so feel free to create a PR if you are interested in contributing to the future of high performance game development on the web.

## Potential Issues
Even if we are now far into the development process, we are still subject to potential changes as well as specification uncertainties. We will handle these changes one at a time but as a result we may have to adjust the release schedule accordingly.

We have the full support from the amazing teams implementing the WebGPU into the browsers, so we can work together as needed to make development smoother for all.

## Migration of Existing Games and Apps
As backwards compatibility is one of our pillars, the only difference we wish to have is with the engine initialization which needs to be asynchronous:

```javascript
const engine = new BABYLON.WebGPUEngine(canvas);
await engine.initAsync();
```

## Will WebGL still be supported?
Yes! Support for WebGL and WebGPU will be maintained side by side for the foreseeable future.

## Testing WebGPU
You can refer to [this page](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) for detailed information on browser support.

Assuming you're using a browser that supports WebGPU, you can try it out yourself in the [Playground](https://playground.babylonjs.com/) 

![WebGPU](/img/extensions/webGPUPlayground.jpg)

Follow the status from the dedicated [Chrome Status Platform Page](https://www.chromestatus.com/feature/6213121689518080).

All demo code is available on [Github](https://github.com/BabylonJS/Website/tree/master/build/Demos/WebGPU), so you can compare both the WebGL and WebGPU versions and take notice that there are currently no differences beside initialization. We will try to keep it this way. :-)