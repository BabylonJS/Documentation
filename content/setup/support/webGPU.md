---
title: WebGPU Support
image: 
description: Dive into understanding the full scope of support for WebGPU in Babylon.js.
keywords: babylon.js, advanced, WebGPU, support
further-reading:
video-overview:
video-content:
---

## Web GPU

## Introduction
As you might be aware, the next gen Web 3D is starting to rise.

Following the specification from the [W3C group](https://github.com/gpuweb/gpuweb), we have started our journey to support this new tech. Our plan is to deliver a support with WebGL feature parity and  the new WebGPU specifics in 5.0.

![Inspector](/img/extensions/WebGPU.png)

## Why ?
The promise behind WebGPU is an awesomely faster API providing lower level control to the graphic resources from Javascript. We hope to bring those extra performances to you in order to create even bigger Web 3D experiences through an API you are already familiar with: Babylon.js.

Also this is brigging new cool toys to the table like Compute Shaders and more to come.

## Where are we ?

See [the dedicated page](/setup/support/webGPU/webGPUStatus).

You can also follow our progress on out [Github dedicated issue](https://github.com/BabylonJS/Babylon.js/issues/6443).

## How ?
The current implementation is now merged in the main branch of the repo [Github](https://github.com/BabylonJS/Babylon.js).

We are putting a big effort all along our next release to implement the support and every contribution is more than welcome; So feel free to create some PR if you are interested in contributing to a fresh engine implementation based on cutting edge tech.

## What could go wrong ?
Even if we are now well in the development process, we are subject to potential changes as well as spec uncertainties. We will deal with them one at a time but we may be subject to change the release schedule at any time.

We have the full support from the amazing teams implementing the browsers support so it will be easier to directly chat with them when needed.

## What would the migration look like for my app ?
As back compat is one of our pillar, the only difference we wish to have is the engine initialization which needs to be asynchronous:

```javascript
const engine = new BABYLON.WebGPUEngine(canvas);
await engine.initAsync();
```

## Will WebGL still be supported ?
FOR SURE :-) There is no change of plans and we will deliver both supports side by side.

## I want to test it
You can refer [to this page](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) for detailed information on browser support.

Assuming you're using a browser that supports WebGPU, you can try it out yourself in the The [Playground](https://playground.babylonjs.com/) 

![WebGPU](/img/extensions/webGPUPlayground.jpg)

You can follow the status from the dedicated [Chrome Status Platform Page](https://www.chromestatus.com/feature/6213121689518080).

All the demos code is available on [Github](https://github.com/BabylonJS/Website/tree/master/build/Demos/WebGPU) so that you could compare both the webgl and webgpu versions and notice there are currently no differences beside the initialization. We will try to keep it this way :-)