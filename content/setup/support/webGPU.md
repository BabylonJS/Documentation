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
Since the Babylon.js 5.0 release in May 2022, WebGPU support has been available and backward compatible with the WebGL implementation of the engine. It was a huge milestone after many iterations on the specification from the [GPU for the Web Working Group](https://github.com/gpuweb/gpuweb), along with close collaboration with the teams implementing WebGPU in browsers. In 2024, we also rewrote all core engine shaders in native WGSL to avoid the use of TintWASM in full WGSL applications.

![Inspector](/img/extensions/WebGPU.webp)

### Benefits of WebGPU
The promise behind [WebGPU](https://developer.chrome.com/en/docs/web-platform/webgpu/#what) is a faster API, provided through lower-level control over system graphics resources from JavaScript, along with new capabilities. We hope to bring these improvements to developers so they can create even higher-quality 3D web games and experiences through a tool they are already familiar with: Babylon.js.

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
Because backward compatibility is one of our pillars, the only difference is that engine initialization must be asynchronous:

```javascript
const engine = new BABYLON.WebGPUEngine(canvas);
await engine.initAsync();
```

## Is WebGL still supported?
Yes! Support for WebGL and WebGPU is maintained side by side for the foreseeable future.

## WebXR support

Babylon.js supports experimental WebGPU-backed WebXR through `XRGPUBinding`. WebGPU support alone does not imply WebGPU-XR support: check the target immersive session mode and `WebXRSessionManager.IsWebGPUXRSupported` separately.

A WebGPU engine intended for XR must be created with `new WebGPUEngine(canvas, { xrCompatible: true })`, and the WebXR Layers feature must be enabled before entering XR. Because Babylon cannot swap an existing WebGPU scene to WebGL, choose the engine before creating the scene and its resources. See [WebGPU in WebXR](/features/featuresDeepDive/webXR/webGPUXR) for setup, fallback guidance, and current limitations.

## Testing WebGPU
You can refer to [this page](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) for detailed information on browser support.

Assuming you are using a browser that supports WebGPU, you can try it out yourself in the [Playground](https://playground.babylonjs.com/).

![WebGPU](/img/extensions/webGPUPlayground.webp)

All demo code is available on [GitHub](https://github.com/BabylonJS/Website/tree/master/build/Demos/WebGPU), so you can compare the WebGL and WebGPU versions and note that there are currently no differences besides initialization. We will try to keep it this way. :-)
