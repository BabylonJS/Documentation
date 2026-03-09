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
Since the Babylon.js 5.0 release in May 2022, WebGPU support is available and backward compatible with the WebGL implementation of the engine. It was a huge milestone after many iterations on the specification from the [GPU for the Web Working Group](https://github.com/gpuweb/gpuweb) and with a tight collaboration with the amazing teams implementing WebGPU into the browsers. In 2024, we also rewrote all core engine shaders in native WSGL, to avoid the use of TintWASM in full WGLS applications.

![Inspector](/img/extensions/WebGPU.png)

### Benefits of WebGPU
The promise behind [WebGPU](https://developer.chrome.com/en/docs/web-platform/webgpu/#what) is a faster API provided through lower level control to system graphics resources from JavaScript and also new capabilities. We hope to bring these improvements to developers in order to create even higher quality 3D web games and experiences through a tool they are already familiar with: Babylon.js.

Some features WebGPU brings to the table are:
* Compute shaders
* Ray tracing ([in-progress](https://github.com/gpuweb/gpuweb/issues/535))
* Improved performance across the board
* and more...

## Progress

See the [dedicated progress page](/setup/support/webGPU/webGPUStatus).

The current implementation of WebGPU is merged in the main branch of the Babylon.js [GitHub repository](https://github.com/BabylonJS/Babylon.js).

WebGPU is also supported by [Node Material and can be defined in the editor](/features/featuresDeepDive/materials/node_material/nodeMaterial#using-node-material-with-webgl-and-webgpu).

## Migration of Existing Games and Apps
As backwards compatibility is one of our pillars, the only difference we have is with the engine initialization which needs to be asynchronous:

```javascript
const engine = new BABYLON.WebGPUEngine(canvas);
await engine.initAsync();
```

## Is WebGL still be supported?
Yes! Support for WebGL and WebGPU is maintained side by side for the foreseeable future.

## Testing WebGPU
You can refer to [this page](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) for detailed information on browser support.

Assuming you're using a browser that supports WebGPU, you can try it out yourself in the [Playground](https://playground.babylonjs.com/) 

![WebGPU](/img/extensions/webGPUPlayground.jpg)

All demo code is available on [Github](https://github.com/BabylonJS/Website/tree/master/build/Demos/WebGPU), so you can compare both the WebGL and WebGPU versions and take notice that there are currently no differences beside initialization. We will try to keep it this way. :-)
