---
title: WebGPU Miscellaneous Optimizations
image: 
description: Learn how to optimize WebGPU for speed
keywords: babylon.js, WebGPU, optimization, speed
further-reading:
video-overview:
video-content:
---

Here are some miscellaneous tips for optimizing WebGPU for speed.

## Avoid creating too many resources each frame
If you call `engine.enableEffect()`, make sure to pass a `DrawWrapper` to it, not an `Effect`. Otherwise, some WebGPU resources will be created each frame.

To check that you are not creating unnecessary resources, once your application is running and has stabilized, meaning you did not create new objects in the last frame, check `engine.countersLastFrame` and make sure `numEnableEffects` is 0. `numEnableEffects` is greater than 0 when you call `engine.enableEffect()` with an `Effect` instead of a `DrawWrapper`. Only `numEnableDrawWrapper` should be nonzero.

## Optimize post processes
If you set the `textureSampler` property manually in an `onApply` observer, set `externalTextureSamplerBinding = true` on the post-process to improve performance.

If possible, do not set the `reusable` parameter of the `PostProcess` constructor to `true`. Otherwise, there will be continuous swapping between the two textures used as the render target of the post-process, which is especially bad in non-compatibility mode because the cached render bundle will be recreated each frame.
