---
title: WebGPU Miscellaneous Optimizations
image: 
description: Learn how to optimize WebGPU for speed
keywords: babylon.js, WebGPU, optimization, speed
further-reading:
video-overview:
video-content:
---

Here are listed some miscellaneous tips to optimize WebGPU for speed.

## Avoid creating too many resources each frame
If you call `engine.enableEffect()`, make sure to pass a `DrawWrapper` to it and not an `Effect`. Else some WebGPU resources will be created each frame.

To check you are not creating unnecessary resources, when your application is running and is "stabilized" (meaning you are not creating new objects in the last frame) check `engine.countersLastFrame` and make sure `numEnableEffects` is 0. `numEnableEffects` is > 0 when you call `engine.enableEffect()` with an `Effect` and not a `DrawWrapper`: only `numEnableDrawWrapper` should be non 0.

## Optimize post processes
If setting manually the `textureSampler` property in a `onApply` observer, set `externalTextureSamplerBinding = true` for the post process to optimize performances.

If possible, don't set the `reusable` parameter of the constructor of `PostProcess` to `true`. Else there will be a continuous swapping between two textures used as the render target of the post process, which will be especially bad when in non compatibility mode as the cached render bundle will be recreated each frame.
