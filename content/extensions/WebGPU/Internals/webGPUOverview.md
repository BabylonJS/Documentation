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

Here's a chart with the main files/classes used to implement the **WebGPU** engine:

![WebGPU chart](/img/extensions/webgpu/classesChart.png!1366)

## Core classes
Here are the core classes used in the WebGPU implementation.

### WebGPUEngine
This class is the main entry point for the WebGPU implementation. It extends `Engine` and implements all the API needed by the higher layers to work with WebGPU. Some parts of the implementation are dispatched in the `WebGPU/Extensions/` files in much the same way it is done for WebGL (in `Engines/Extensions/` for WebGL).
* we currently use the same GLSL shaders in **WebGPU** that we use in **WebGL**. Those shaders are converted to **SpirV** thanks to **GLSLlang** and **SpirV** is converted to **WGSL** by a port of `Tint` to **WASM** (**TintWASM**).
* we are using 3 command encoders: *upload*, *renderTarget* and *render*. *upload* is used when we need to upload data into textures, *renderTarget* is used to render into render targets and *render* is used for the main render pass (when rendering into the swap chain texture). They are pushed into the queue in this order: *upload* -> *render target* -> *render*. Note that the compute shader passes are also using the *renderTarget* encoder. Also, when generating the mipmaps of a render target we use the *renderTarget* encoder and not *upload* so that the mips generation is done after the rendering into the render target and not before (the commands of the *upload* encoder are pushed into the queue before the commands of the *renderTarget* encoder)
* the GPU timing (that can be seen in the *Inspector* under **Statistics / GPU Frame time**) is done using timestamp queries, but for the time being Chrome does not allow those queries by default: Chrome must be started with the `--disable-dawn-features=disallow_unsafe_apis` flag to make it work
* `_ubInvertY` and `_ubDontInvertY` are the two uniform buffers used to implement the rendering without the CSS `yScale(-1)` trick (and thus saving a copy at the end of each frame): see [this comment](https://github.com/BabylonJS/Babylon.js/pull/11616#issue-1077008145) for more information.
* when binding a `RenderTargetWrapper` (by a call to `bindFramebuffer()`), we don't create the render pass right away (this render pass is created in `_startRenderTargetRenderPass()`). It is because we will likely process a `clear()` call a short time after: we will create the render pass at that time, using the clear values passed to `clear()` to create the render pass. Doing so avoid creating a render pass when `bindFramebuffer()` is called, then closing it and recreating a new one when `clear()` is called (because the clearing is done at the same time the render pass is created by a `beginRenderPass` API call).

### WebGPUBufferManager
This class handles everything related to GPU buffers (creation, deletion, reading, writing).
* reading half float data is very slow because a conversion from half float to float must be done in the js code! To speed things up, a compute shader could be used instead
* if the row byte size is not aligned (meaning, not divisible by 256), there's an additional copying process in js to build the final buffer, making the whole process slow. A compute shader would help here too.
* when `releaseBuffer()` is called the buffer passed in is not released right away, because the buffer(s) used during the queue processing (meaning, when calling `device.queue.submit()`) must be valid. Instead, the buffer is pushed in a list that will be cleaned by a call to `destroyDeferredBuffers()` (**WebGPUEngine** calls this method at the end of a frame, after `device.queue.submit()` has been called).

### WebGPUTextureHelper
This class handles everything related to GPU textures (creation, deletion, reading, writing, generating mipmaps, etc).
* as for the GPU buffers, we use a deferred list to release the textures and wait to release them after the queue has been submitted.
* when creating a texture, we always set the `RenderAttachment | CopyDst` flags because we don't know in advance if `copyExternalImageToTexture()` will be used to update the texture (see the `updateTexture()` method) and this function requires that these flags be set
* the mipmap generation is done by issueing n render passes (*6 for a cube texture). It would probably be faster to use some optimized compute shaders instead. Also, see [Lower perf when generating mipmaps compared to webgl](https://bugs.chromium.org/p/dawn/issues/detail?id=587) for some discussions about mipmap generation perf

### WebGPUSnapshotRendering
This class implements the snapshot rendering optimization: see [Snapshot Rendering](/advanced_topics/webGPU/webGPUOptimization/webGPUSnapshotRendering) for more information about this optim. It is creating a bundle for each of the render texture (either a render target texture or the swap chain texture) at recording time and replay this bundle for all subsequent frames. Note that it is creating a bundle list instead of a single bundle because a number of APIs are not supported inside bundles (like `setViewport`, `setScissorRect`, etc): `WebGPUBundleList` is the class that manages a list of bundles interleaved with those API calls.

### WebGPUTintWASM
This class is a thin wrapper around the **TintWASM** bundle and is used to convert **SpirV** to **WGSL**.

### WebGPUOcclusionQuery
This class implements occlusion queries in WebGPU. It is a straightforward implementation which is using the `WebGPUQuerySet` helper class for the actual query stuff.

### WebGPUTimestampQuery
This class implements the GPU timing of a frame by writing a timestamp right at the beginning of the *upload* command encoder and as the last command of the *render* command encoder and by substracting the time measure of the two timestamps. As explained above, it currently only works in Chrome if it is launched with the `--disable-dawn-features=disallow_unsafe_apis` flag.


## Classes used for caching
To avoid recreating some objects each time they are needed and to save performance, a number of caches are used by the WebGPU implementation.

### WebGPUCacheBindGroup
This class implements a cache of bind groups. The cache is a node tree:
```typescript
class WebGPUBindGroupCacheNode {
    public values: { [id: number]: WebGPUBindGroupCacheNode };
    public bindGroups: GPUBindGroup[];

    constructor() {
        this.values = {};
    }
}

export class WebGPUCacheBindGroups {
    private static _Cache: WebGPUBindGroupCacheNode = new WebGPUBindGroupCacheNode();
    ...
}
```
The `id` key in the `values` object is the id of a bind group resource: a uniform/storage buffer, a sampler or a texture. The `id` value for the uniform/storage buffer and texture is simply the `uniqueId` property of the corresponding class (`DataBuffer.uniqueId` and `InternalTexture.uniqueId / ExternalTexture.uniqueId` respectively). For the sampler, it is the sampler hash code (computed by `WebGPUCacheSampler.GetSamplerHashCode()`). The cache is traversed/built by looping over all the buffers/samplers/textures used by a shader (which is encapsulated in a `WebGPUPipelineContext`), in this order.

The location of a resource (group and binding indices in the `[[group(G), binding(B)]]` syntax) is not factored in the id and the ids are not *globally* unique (because they are not from the same pool: there's a separate pool for the buffer and texture `uniqueId` property), so theoritically some collisions could occur where two sets of resources point to the same cache entry. In practice it will likely never occur. Making the cache foolproof would mean making it even slower and the WebGPU implementation already suffers a lot from having to handle a cache for some objects (bind groups and render pipelines mainly)...

Note also that all uniform buffers have an offset of 0 in Babylon and we don't have a use case where we would have the same buffer used with different capacity values: that means we don't need to take into account the offset/size of the buffer in the cache, only the id.

There is an optimization of the cache where we simply return the existing bind groups if the draw and material contexts did not change since the last cache query. Indeed, the draw context holds the list of the uniform/storage buffers and the material context the list of the textures and samplers used by the shader: if those lists did not change the previously created bind groups are still valid.

Performance of the cache can be assessed by looking at these properties (the property should be prefixed by `BABYLON.WebGPUCacheBindGroups.`):

| property | description |
| ---------| ----------- |
| NumBindGroupsCreatedTotal | Total of bind groups created since the start of the program |
| NumBindGroupsCreatedLastFrame | Number of bind groups created during the last frame - for best cache usage this value should be 0 on average |
| NumBindGroupsLookupLastFrame | Number of bind groups retrieved by traversing the cache |
| NumBindGroupsNoLookupLastFrame | Number of bind groups retrieved without traversing the cache because no changes in buffers/textures/samplers occurred since the last cache query for this shader |

### WebGPUCacheRenderPipeline, WebGPUCacheRenderPipelineTree
This class implements a cache of render pipelines. The cache is a node tree with the same structure than the bind group cache:
```typescript
class NodeState {
    public values: { [id: number]: NodeState };
    public pipeline: GPURenderPipeline;

    constructor() {
        this.values = {};
    }
}

export class WebGPUCacheRenderPipelineTree {
    private static _Cache: NodeState = new NodeState();
    ...
}
```
The difference is that the ids encode the pipeline state. As there are numerous states that define a pipeline, we need several ids. Currently, the list is:
```javascript
enum StatePosition {
    StencilReadMask = 0,
    StencilWriteMask = 1,
    DepthBias = 2,
    DepthBiasSlopeScale = 3,
    DepthStencilState = 4,
    MRTAttachments1 = 5,
    MRTAttachments2 = 6,
    RasterizationState = 7,
    ColorStates = 8,
    ShaderStage = 9,
    TextureStage = 10,
    VertexState = 11, // vertex state will consume positions 11, 12, ... depending on the number of vertex inputs

    NumStates = 12
}
```
So, the first node (`_Cache.values`) holds the stencil read mask values, the second node (`_Cache.values[stencilReadMaskValue]`) holds the stencil write mask values, the third node (`_Cache.values[stencilReadMaskValue].values[stencilWriteMaskValue]`) holds the depth bias values, and so on. To find a pipeline in the cache we simply starts from the root node, lookup the `values` property with the `stencilReadMask` current value, then lookup the `values` property of this node with the `stencilWriteMask` current value and so on, until we traverse all the states.

The state positions are ordered so that states that are less likely to change from one pipeline to another one are listed first. That's because we maintain a pointer (`_stateDirtyLowestIndex`) that contains the lowest index of all the states that have been dirtyfied (meaning the states that have changed since the last pipeline lookup) before querying the cache and we will traverse the cache from this index and not from 0 to lookup the pipeline. So, the higher `_stateDirtyLowestIndex` is the better the performances are: we will traverse less nodes to find the pipeline in the cache.

Performance of the cache can be assessed by looking at these properties (the property should be prefixed by `BABYLON.WebGPUCacheRenderPipeline.`):

| property | description |
| ---------| ----------- |
| NumCacheHitWithoutHash | Number of times a render pipeline has been retrieved without even traversing the cache because there were no state changes since the last lookup: the last pipeline has been returned |
| NumCacheHitWithHash | Number of times a render pipeline has been retrieved by traversing the cache |
| NumCacheMiss | Number of times a new render pipeline has been created because it was not existing in the cache yet |
| NumPipelineCreationLastFrame | Number of render pipelines created during the last frame - new pipelines should not be created continuously so on average this value should be 0 |

Note we tried an implementation where render pipelines where recorded in a hash map and the lookup key was a string concatenation of the state values (see the class `WebGPUCacheRenderPipelineString`) but it was dropped because the node tree implementation was faster (around 2x at the time the comparison was made - the code has changed since then so we should probably perform some new testings but I still think the node tree is faster than the hash map).

Last note: the `values` property is a regular object and not a `Map` because in our testings the object was faster.

### WebGPUCacheSampler


## Specialization of low level classes
WebGPU has its own implementations for some of the low level classes used by the Babylon.js framework.

### WebGPURenderTargetWrapper

### WebGPUHardwareTexture

### WebGPUDepthCullingState

### WebGPUStencilStateComposer


## Helper classes
There are a number of helper classes used in the WebGPU implementation. The main ones are listed below.

### WebGPUBundleList

### WebGPUClearQuad

### WebGPURenderPassWrapper

### WebGPUQuerySet


## Shader/Pipeline classes

### WebGPUShaderProcessor, WebGPUShaderProcessorGLSL, WebGPUShaderProcessorWGSL

### WebGPUShaderProcessingContext

### WebGPUPipelineContext

### WebGPUComputePipelineContext


## Context classes

### WebGPUMaterialContext

### WebGPUDrawContext

### WebGPUComputeContext
