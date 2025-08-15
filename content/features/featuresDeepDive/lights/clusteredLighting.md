---
title: Clustered Lighting
description: Learn about Babylon's clustered lighting implementation
keywords: diving deeper, lights, lighting, forward+, clustered lighting, tiled lighting
further-reading:
  - title: "Improved Culling for Tiled and Clustered Rendering, Call of Duty: Infinite Warfare"
    url: https://advances.realtimerendering.com/s2017/2017_Sig_Improved_Culling_final.pdf
  - title: A Primer On Efficient Rendering Algorithms & Clustered Shading.
    url: http://www.aortiz.me/2018/12/21/CG.html
  - title: Clustered shading evolution in Granite
    url: https://themaister.net/blog/2020/01/10/clustered-shading-evolution-in-granite/
  - title: Compute-Less Clustered Lighting
    url: https://github.com/wizgrav/cl2
video-overview:
video-content:
---

## Introduction

When a scene has alot of lights, the per-pixel lighting calculations can get quite slow. This is because every single pixel needs to compute the lighting contribution from every single light, even if those lights might not really be affecting that pixel at all. One of the ways these lighting calculations could be dramatically sped up is if the engine had a rough idea of what lights affect the current pixel. This is the basis behind clustered lighting, also referred to as Forward+.

In Babylon, clustered lighting is implemented as its own light type, in which other point or spot lights can be added to:
```javascript
const lightContainer = new BABYLON.ClusteredLightContainer("clustered", [pointLight1, pointLight2], scene);
// More lights can be added or removed later
lightContainer.removeLight(pointLight1);
lightContainer.addLight(spotLight);
```

Clustered lighting usually follows a three-step approach along the lines of:
1. split the camera's view-space into 3D "clusters" (for example, AABB cubes)
2. for each cluster, figure out what lights affect it (within a certain range such that its contribution is signifcant)
3. at render time, find the cluster a pixel belongs to (using its screen position and depth value), and then only calculate lighting contribution from the lights for that cluster

Babylon takes a slightly different apprach to clustered lighting, which is mainly inspired by [this SIGGRAPH talk](https://advances.realtimerendering.com/s2017/2017_Sig_Improved_Culling_final.pdf) for Call of Duty: Infinite Warfare. The main takeaway is that rather than grouping lights into 3D clusters, we instead group lights both into a 2D tile (ignoring depth) and into a depth slice (ignoring screen position). At render time we then find the intersection of lights within the current screen tile AND within the current depth slice. This allows us to take advantage of traditional rendering hardware and fragment shaders to do the tiled clustering, and the depth clustering becomes simple enough to just run on the CPU.

This solution works on both WebGPU and WebGL 2 (if float color buffers are supported and blendable).

<Playground id="#CSCJO2#16" title="Sponza scene with 1000 lights" description="Example showing off the capabilities of clustered lighting by making the Sponza scene colorful" />

## Tiled Clustering

By the default the screen is split into 64 tiles accross and 64 tiles down for a total of 4,096 tiles.

![The Sponza scene with the screen covered in randomly-colored tiles](/img/features/clusteredLighting/tiles64x64.png)
<font size="2">The Sponza scene with the default tiling options. Each tile is tinted a different color.</font>

The amount of tiles can be changed using the `verticalTiles` and `horizontalTiles` options:
```javascript
lightContainer.verticalTiles = 16;
lightContainer.horizontalTiles = 9;
```

![The Sponza scene with the screen covered in less, but larger, randomly-colored tiles](/img/features/clusteredLighting/tiles16x9.png)
<font size="2">The Sponza scene with only 16 tiles across and 9 tiles down.</font>

Configuring the total tile count is a balancing act between keeping the light clustering fast by reducing the amount of tiles, while keeping the per-pixel lighting fast by keeping the tiles small<sup>[1](#footnotes)</sup>, which makes the light list for that pixel more accurate. Increasing the tile count will also increase the GPU memory usage.

To cluster the lights into the tiles we render each light against the configured tile layout using a "light proxy" (or light mesh). In Babylon this light proxy is a simple square:
![The lion face from the Sponza scene with a single light and the wireframe of a square overtop the light](/img/features/clusteredLighting/proxy.png)
<font size="2">The light proxy square.</font>

The light proxies are scaled by the `range` parameter of the light. By default the range of lights is very large, so `ClusteredLightContainer` will clamp all lights to a smaller (yet still quite large) range. If you wish to have lights with a larger range than the defualt max of 16383, this can be modified using the `maxRange` option:
```javascript
lightContainer.maxRange = 30000;
```
It is recommended to adjust the ranges of your lights so they don't all end up as the max range (which cancels out any clustering attempts).

When These light proxies are rendered they set a bit in a bitmask, which then gets iterated over during rendering. The way this bit is set differs between WebGL and WebGPU.

### WebGPU

WebGPU uses the simpler method of the two since it supports more advanced features than WebGL. The bitmasks in WebGPU are stored in an I32 storage buffer with the size `horizontalTiles x verticalTiles x numBatches` where `numBatches` is the number of lights divided by 32. When rendering light proxy, it finds the relevant bitmask for its screen position and batch number, and then sets the bit representing the light using an atomic OR operation. Notably, the light proxy does not render out any color and its fragment shader is only used for its side effects (writing to a storage buffer).

### WebGL 2

WebGL does not support storage buffers nor does it support any form of atomic writes. Instead WebGL takes advantage of the blending stage of the rendering pipeline by writing out the bit values and additively blending them together. A floating-point render target is used to ensure the blended values exactly match the fragment outputs, but sadly floating point values cannot accurately represent all 32 distinct bit values that a 32-bit int could. For this reason, the number of lights per batch in WebGL is equal to the number of fraction bits the hardware supports, which on most systems is 23.

![The Sponza scene with the screen covered in pixelated red circled of varying shades](/img/features/clusteredLighting/additiveBlending.png)
<font size="2">The result of additively blending light proxies with different bit values.</font>

To support multiple batches (when more than 23 lights are rendered) the floating-point render target is expanded vertically by the number of batches, and the light proxy is shifted based on its batch number in the vertex shader.

### Conservative Rendering (or the lack thereof)

As one final note before going onto depth clustering, its worth talking about a GPU feature called conservative rendering. Traditionally, fragment shaders are only run for pixels in which the triangle covers the center of the pixel. However this causes issues with our light proxies since we want fragment shaders to be run for every pixel (which represent tiles) the proxy intersects with, regardless of how much it intersects by. The good news is this is a thing and its called "convservative rendering", the bad news is not much hardware supports it and neither WebGL nor WebGPU expose the functionality (as of writing).

Infinity Ward also faced this issue with Call of Duty, and their solution presented in the slides is to render the light proxies at screen resolution. This works fine when writing out bits using atomic OR since multiple fragment shaders can set the same bit without issue<sup>[2](#footnotes)</sup>. For this to work in WebGL we'd have to post-process the results by reducing the full resolution down to a single pixel per tile.

Our solution to this problem, partly inspired by [this GitHub project](https://github.com/wizgrav/cl2), is to round the mesh vertices to the nearest corner away from the center (round down for vertices left of the center, round up for vertices right of the center). This means that no matter how far away from a light you are, its proxy will always render to atleast one tile on the screen.

## Depth Clustering

The depth clustering is alot more simple and can easily be done on the CPU since we're only dealing with a single dimension (depth) instead of two (screen X and Y). The depth range of the camera (from `minZ` to `maxZ`) is split into 16 slices by default, with each slice containing the minimum and maximum light index that intersects that slice. This provides a range of bitmasks (from the tiled clustering step) the fragment shader needs to check. For these minimum and maximum indices to efficiently represent the lights within the slice, the lights are sorted based on distance from the camera. Sorting is fast enough to be done each frame.

![The Sponza scene with the screen covered in randomly-colored slices getting further and further away from the camera](/img/features/clusteredLighting/slices16.png)
<font size="2">The Sponza scene with the default depth slicing options. Each slice is tinted a different color.</font>

The number of slices can be tweaked using the `depthSlices` option. Additionally, the cameras `maxZ` property can be adjusted to bring the slices closer which is recommended for smaller scenes:
```javascript
camera.maxZ = 100;
lightContainer.depthSlices = 64;
```

![The Sponza scene with the screen covered in more, but thinner, randomly-colored slices](/img/features/clusteredLighting/slices64.png)
<font size="2">The Sponza scene with a max depth of 100 split into 64 slices.</font>

To find the intersection between the tiled clustering and the depth clustering, the lighting code in the fragment shader ends up looking along the lines of (overly simplified for the sake of demonstration):
```glsl
for (int i = firstBatch; i <= lastBatch; i += 1) {
    uint mask = getBatchMask(i);
    if (i == firstBatch) {
        // clear starting bits depending on first light index
    }
    if (i == lastBatch) {
        // clear ending bits depending on last light index
    }

    while (mask != 0u) {
        int trailing = firstTrailingBit(mask);
        // Clear the bit we found
        mask ^= 1u << trailing;

        SpotLight light = getClusteredSpotLight(
            i * batchSize + trailing);
        // Compute lighting contribution
    }
}
```

## Limitations

In its current form, there are some limits to the clustered lighting implementation.

### Only spot and point lights are supported

Currently only spot and point lights are supported. Other lights will still need to be rendered separately using a non-clustered approach.

### Lights with extra textures are not supported

Some lights require binding extra textures per light. These include:
- shadow-generating lights
- spot lights with projection or IES textures

Because we don't know which lights we need until render time, we'd effectively need to bind every single texture and dynmically index them too. This is usually done with a generated texture atlas, but thats quite a bit of complex work. So for now we just don't support clustering these lights.

### Lights with a falloff other than `FALLOFF_DEFAULT` are not supported

To reduce branching in the shader, all lights are assumed to use the default falloff method (which makes it dependent on the material).

### Materials with a physical falloff may cause artefacts

The physical falloff is the only falloff method that ignores the `range` parameter on lights. This means that the range the light proxy is rendered at might be shorter than the lights actual range of influence. This falloff is still supported, just be sure to adjust the `range` of your lights accordingly so they reach a point where the physical falloff is not very noticeable anymore.

![The Sponza scene covered in lights but there are block artefacts where the lights end](/img/features/clusteredLighting/physicalFalloff.png)
<font size="2">The artefacts that can occur from incorrect range parameters when using a physical falloff.</font>

The physical falloff can be disabled on all PBR meterials using:
```javascript
for (const material of scene.meterials) {
    if (meterial instanceof BABYLON.PBRMaterial) {
        material.usePhysicalLightFalloff = false;
        // ... or alternatively ...
        material.useGLTFLightFalloff = true;
    }
}
```

---
### Footnotes
1. Making the tiles _too_ small can actually **hurt** the lighting performance, since it will cause nearby pixels to branch more frequently which dramatically hurts performance on modern GPUs. Additionally it will require more memory fetching from the GPU to get the results for all the tiles.
2. Actually, having so many fragment shaders attempting to perform the same atomic operation makes for some really _really_ bad performance, but they use some wavefront ✨black magic✨ to work around that.
