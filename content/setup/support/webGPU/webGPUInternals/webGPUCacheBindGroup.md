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
The `id` key in the `values` object is the ID of a bind group resource: a uniform or storage buffer, a sampler, or a texture. The `id` value for the uniform or storage buffer and texture is simply the `uniqueId` property of the corresponding class (`DataBuffer.uniqueId` and `InternalTexture.uniqueId / ExternalTexture.uniqueId`, respectively). For the sampler, it is the sampler hash code, computed by `WebGPUCacheSampler.GetSamplerHashCode()`. The cache is traversed and built by looping over all the buffers, samplers, and textures used by a shader, which is encapsulated in a `WebGPUPipelineContext`, in that order.

## Limits of the implementation
The location of a resource, meaning the group and binding indices in the `[[group(G), binding(B)]]` syntax, is not factored into the ID, and the IDs are not *globally* unique because they do not come from the same pool: there is a separate pool for the buffer and texture `uniqueId` property. So, theoretically, collisions could occur where two sets of resources point to the same cache entry. In practice, this is very unlikely to happen. Making the cache foolproof would also make it slower, and the WebGPU implementation already pays a significant cost for managing caches for some objects, mainly bind groups and render pipelines.

Also note that all uniform buffers have an offset of 0 in Babylon, and we do not have a use case where the same buffer would be used with different capacity values. That means we only need to take the buffer ID into account in the cache, not its offset or size.

## Optimization
The cache includes an optimization that simply returns the existing bind groups if the draw and material contexts have not changed since the last cache query. The draw context holds the list of uniform and storage buffers, and the material context holds the list of textures and samplers used by the shader. If those lists have not changed, the previously created bind groups are still valid.

## Monitoring the performances
Cache performance can be assessed by looking at these properties. Each property should be prefixed by `BABYLON.WebGPUCacheBindGroups.`:

| property | description |
| ---------| ----------- |
| NumBindGroupsCreatedTotal | Total of bind groups created since the start of the program |
| NumBindGroupsCreatedLastFrame | Number of bind groups created during the last frame - for best cache usage this value should be 0 on average |
| NumBindGroupsLookupLastFrame | Number of bind groups retrieved by traversing the cache |
| NumBindGroupsNoLookupLastFrame | Number of bind groups retrieved without traversing the cache because no changes in buffers/textures/samplers occurred since the last cache query for this shader |
