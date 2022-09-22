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

The cache is a node tree with the same structure than the bind group cache:

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

So, the first node (`_Cache.values`) holds the stencil read mask values, the second node (`_Cache.values[stencilReadMaskValue]`) holds the stencil write mask values, the third node (`_Cache.values[stencilReadMaskValue].values[stencilWriteMaskValue]`) holds the depth bias values, and so on.

To find a pipeline in the cache we simply starts from the root node, lookup the `values` property with the `stencilReadMask` current value, then lookup the `values` property of this node with the `stencilWriteMask` current value and so on, until we traverse all the states.

## Optimization

The state positions are ordered so that states that are less likely to change from one pipeline to another are listed first. That's because we maintain a pointer (`_stateDirtyLowestIndex`) that contains the lowest index of all the states that have been dirtyfied (meaning the states that have changed since the last pipeline lookup) before querying the cache and we will traverse the cache from this index and not from 0 to lookup the pipeline. So, the higher `_stateDirtyLowestIndex` is the better the performances are: we will traverse less nodes to find the pipeline in the cache.

Note we tried an implementation where render pipelines where recorded in a hash map and the lookup key was a string concatenation of the state values (see the class `WebGPUCacheRenderPipelineString`) but it was dropped because the node tree implementation was faster (around 2x at the time the comparison was made - the code has changed since then so we should probably perform some new testings but I still think the node tree is faster than the hash map).

Last note: the `values` property is a regular object and not a `Map` because in our testings (with Chrome) using an object was faster.

## Monitoring the performances

Performance of the cache can be assessed by looking at these properties (the property should be prefixed by `BABYLON.WebGPUCacheRenderPipeline.`):

| property                     | description                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NumCacheHitWithoutHash       | Number of times a render pipeline has been retrieved without even traversing the cache because there were no state changes since the last lookup: the last pipeline has been returned |
| NumCacheHitWithHash          | Number of times a render pipeline has been retrieved by traversing the cache                                                                                                          |
| NumCacheMiss                 | Number of times a new render pipeline has been created because it was not existing in the cache yet                                                                                   |
| NumPipelineCreationLastFrame | Number of render pipelines created during the last frame - new pipelines should not be created continuously so on average this value should be 0                                      |
