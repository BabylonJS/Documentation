---
title: WebGPU Internals - Bind Group Cache
image:
description: Learn how the WebGPU engine has been implemented in Babylon.js
keywords: babylon.js, WebGPU, engine, implementation, cache, bind group
further-reading:
video-overview:
video-content:
---

This class implements a cache of GPU bind groups to avoid recreating them each frame.

## Cache implementation

The cache is a node tree:

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

## Limits of the implementation

The location of a resource (group and binding indices in the `[[group(G), binding(B)]]` syntax) is not factored in the id and the ids are not _globally_ unique (because they are not from the same pool: there's a separate pool for the buffer and texture `uniqueId` property), so theoritically some collisions could occur where two sets of resources point to the same cache entry. In practice it will likely never occur. Making the cache foolproof would mean making it even slower and the WebGPU implementation already suffers a lot from having to handle a cache for some objects (bind groups and render pipelines mainly)...

Note also that all uniform buffers have an offset of 0 in Babylon and we don't have a use case where we would have the same buffer used with different capacity values: that means we don't need to take into account the offset/size of the buffer in the cache, only the id.

## Optimization

There is an optimization of the cache where we simply return the existing bind groups if the draw and material contexts did not change since the last cache query. Indeed, the draw context holds the list of the uniform/storage buffers and the material context the list of the textures and samplers used by the shader: if those lists did not change the previously created bind groups are still valid.

## Monitoring the performances

Performance of the cache can be assessed by looking at these properties (the property should be prefixed by `BABYLON.WebGPUCacheBindGroups.`):

| property                       | description                                                                                                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NumBindGroupsCreatedTotal      | Total of bind groups created since the start of the program                                                                                                      |
| NumBindGroupsCreatedLastFrame  | Number of bind groups created during the last frame - for best cache usage this value should be 0 on average                                                     |
| NumBindGroupsLookupLastFrame   | Number of bind groups retrieved by traversing the cache                                                                                                          |
| NumBindGroupsNoLookupLastFrame | Number of bind groups retrieved without traversing the cache because no changes in buffers/textures/samplers occurred since the last cache query for this shader |
