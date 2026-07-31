---
title: WebGPU Internals - Render Pipeline Cache
image: 
description: Learn how the WebGPU engine has been implemented in Babylon.js
keywords: babylon.js, WebGPU, engine, implementation, cache, render pipeline
further-reading:
video-overview:
video-content:
---

This class implements a cache of GPU render pipelines to avoid recreating them each frame.

## Cache implementation
The cache is a node tree with the same structure as the bind group cache:
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
The difference is that the IDs encode the pipeline state. Because a pipeline is defined by many states, we need several IDs. Currently, the list is:
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
So, the first node (`_Cache.values`) holds the stencil read mask values, the second node (`_Cache.values[stencilReadMaskValue]`) holds the stencil write mask values, the third node (`_Cache.values[stencilReadMaskValue].values[stencilWriteMaskValue]`) holds the depth bias values, and so on.

To find a pipeline in the cache, we simply start from the root node, look up the `values` property with the current `stencilReadMask` value, then look up the `values` property of that node with the current `stencilWriteMask` value, and so on until we have traversed all the states.

## Optimization
The state positions are ordered so that the states least likely to change from one pipeline to another are listed first. This is because we maintain a pointer, `_stateDirtyLowestIndex`, that contains the lowest index of all the states that have been dirtied, meaning the states that have changed since the last pipeline lookup. Before querying the cache, we traverse it from this index instead of from 0. So, the higher `_stateDirtyLowestIndex` is, the better the performance, because we traverse fewer nodes to find the pipeline in the cache.

Note that we tried an implementation where render pipelines were recorded in a hash map and the lookup key was a string concatenation of the state values, see the class `WebGPUCacheRenderPipelineString`. We dropped it because the node-tree implementation was faster, around 2x faster at the time the comparison was made. The code has changed since then, so we should probably run new tests, but I still think the node tree is faster than the hash map.

One last note: the `values` property is a regular object, not a `Map`, because in our tests with Chrome, using an object was faster.

## Monitoring the performances
Cache performance can be assessed by looking at these properties. Each property should be prefixed by `BABYLON.WebGPUCacheRenderPipeline.`:

| property | description |
| ---------| ----------- |
| NumCacheHitWithoutHash | Number of times a render pipeline has been retrieved without even traversing the cache because there were no state changes since the last lookup: the last pipeline has been returned |
| NumCacheHitWithHash | Number of times a render pipeline has been retrieved by traversing the cache |
| NumCacheMiss | Number of times a new render pipeline has been created because it was not existing in the cache yet |
| NumPipelineCreationLastFrame | Number of render pipelines created during the last frame - new pipelines should not be created continuously so on average this value should be 0 |
