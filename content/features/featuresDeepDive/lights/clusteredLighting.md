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
const clusteredLight = new ClusteredLight("clustered", [pointLight1, pointLight2], scene);
// More lights can be added or removed later
clusteredLight.removeLight(pointLight1);
clusteredLight.addLight(spotLight);
```

Alternatively, if you want all compatible point and spot lights to be automatically clustered, `clusteredLighting` can be enabled on the scene level:
```javascript
scene.clusteredLighting = true;
```

Clustered lighting usually follows a three-step approach along the lines of:
1. split the camera's view-space into 3D "clusters" (for example, AABB cubes)
2. for each cluster, figure out what lights affect it (within a certain range such that its contribution is signifcant)
3. at render time, find the cluster a pixel belongs to (using its screen position and depth value), and then only calculate lighting contribution from the lights for that cluster

Babylon takes a slightly different apprach to clustered lighting, which is mainly inspired by [this SIGGRAPH talk](https://advances.realtimerendering.com/s2017/2017_Sig_Improved_Culling_final.pdf) for Call of Duty: Infinite Warfare. The main takeaway is that rather than grouping lights into 3D clusters, we instead group lights both into a 2D tile (ignoring depth) and into a depth slice (ignoring screen position). At render time we then find the intersection of lights within the current screen tile AND within the current depth slice. This allows us to take advantage of traditional rendering hardware and fragment shaders to do the tiled clustering, and the depth clustering becomes simple enough to just run on the CPU.

This solution works on both WebGPU and WebGL 2 (if float color buffers are supported and blendable).

TODO: playground

## Tiled Clustering

By the default the screen is split into 64 tiles accross and 64 tiles down for a total of 4,096 tiles.

![The Sponza scene with the screen covered in randomly-colored tiles](/img/features/clusteredLighting/tiles64x64.png)
<font size="2">The Sponza scene with the default tiling options. Each tile is tinted a different color.</font>

The amount of tiles can be changed using the `verticalTiles` and `horizontalTiles` options:
```javascript
clusteredLight.verticalTiles = 16;
clusteredLight.horizontalTiles = 9;
```

![The Sponza scene with the screen covered in less, but larger, randomly-colored tiles](/img/features/clusteredLighting/tiles16x9.png)
<font size="2">The Sponza scene with only 16 tiles across and 9 tiles down.</font>

Configuring the total tile count is a balancing act between keeping the light clustering fast by reducing the amount of tiles, while keeping the per-pixel lighting fast by keeping the tiles small<sup>[1](#footnotes)</sup>, which makes the light list for that pixel more accurate. Increasing the tile count will also increase the GPU memory usage.

To cluster the lights into the tiles we render each light against the configured tile layout using a "light proxy" (or light mesh). In Babylon this light proxy is a disc:
![The lion face from the Sponza scene with a single light and the wireframe of a disc overtop the light](/img/features/clusteredLighting/proxy8.png)
<font size="2">The default light proxy disc.</font>

By default the disc is split into 8 triangles, but this can be tweaked using the `proxyTesselation` option:
```javascript
clusteredLight.proxyTesselation = 32;
```

![The lion face from the Sponza scene with a single light and the wireframe of a disc overtop the light](/img/features/clusteredLighting/proxy32.png)
<font size="2">The light proxy disc with 32 triangles.</font>

Yet again, this option is a balancing act between the light clustering performance and the per-pixel lighting performance. More triangles will make the clustering slower but will make the results more closely match the shape of the light.

These light proxies then set a bit in a bitmask, which then gets iterated over during rendering. The way this bit is set differs between WebGL and WebGPU.

TODO: talk about the `maxRange` option

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

Our solution to this problem, partly inspired by [this GitHub project](https://github.com/wizgrav/cl2), is to round the mesh vertices to the nearest corner away from the center (round down for vertices left of the center, round up for vertices right of the center). This is the cause of the wobblyness you may have noticed with the images of the proxies above.

![A very far away light with a square mesh overtop it](/img/features/clusteredLighting/proxyFar.png)
<font size="2">This rounding causes the proxies to become more square as you get further away from the light. At some point it will just be a square covering a single tile.</font>

## Depth Clustering

TODO

## Limitations

TODO

---
### Footnotes
1. Making the tiles _too_ small can actually **hurt** the lighting performance, since it will cause nearby pixels to branch more frequently which dramatically hurts performance on modern GPUs. Additionally it will require more memory fetching from the GPU to get the results for all the tiles.
2. Actually, having so many fragment shaders attempting to perform the same atomic operation makes for some really _really_ bad performance, but they use some wavefront ✨black magic✨ to work around that.
