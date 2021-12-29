---
title: WebGPU Internals - Overview
image: 
description: Learn how the WebGPU engine has been implemented in Babylon.js
keywords: babylon.js, WebGPU, engine, implementation
further-reading:
video-overview:
video-content:
---

Babylon.js has an abstraction layer that helps implement new types of engines. There are currently 4 types of engines: Null, Native, WebGPU and Engine (which implements WebGL as well as additional components like audio).

The first 3 extends `Engine` and `Engine` extends `ThinEngine`, which is a low level (graphic only) API for engines. Note that it is one of the mid-term goal to have all the engines extends directly `ThinEngine` (or a specific "thin" version) instead of `Engine` to better encapsulate the implementations.

## Main classes
Here are the main classes used in the WebGPU implementation.

### [WebGPUEngine](/typedoc/classes/babylon.webgpuengine)
This class is the main entry point for the WebGPU implementation. It extends `Engine` and implements all the API needed by the higher layers to work with WebGPU. Some parts of the implementation are dispatched in the `WebGPU/Extensions/` files in much the same way it is done for WebGL (in `Engines/Extensions/` for WebGL).

### WebGPUBufferManager

### WebGPUTextureHelper

### WebGPUSnapshotRendering

## Classes used for caching
To avoid recreating some objects each time they are needed and to save performance, a number of caches are used by the WebGPU implementation.

### WebGPUCacheBindGroup

### WebGPUCacheRenderPipeline

### WebGPUCacheSampler

## Helper classes


### WebGPUBundleList

### WebGPUClearQuad