---
title: How Babylon.js Materials Work
image: 
description: Learn about how materials in Babylon.js work under the hood.
keywords: diving deeper, materials, advanced
further-reading:
video-overview:
video-content:
---

## How Materials Work

Materials are an encapsulation on top of shaders. They provide a simple way to configure and share shaders. 

## Cache and compilation
The first time a material is created, an internal object named effect will be created. The effect is the host for the vertex and pixel (fragment) shaders.
These shaders have to be compiled by the GPU from plain text to GPU machine code.

The compilation step is a process that will be done synchronously on the main thread and thus could cause a bit of lag in the rendering.

As the process is a bit expensive, once compiled an effect will remain in memory until you dispose the engine. 

Everytime you will change a property of a material (like adding a texture or enabling an option), a new effect will be compiled unless an equivalent can be found in the cache.

## Rendering optimization

Since v5.0, meshes are sorted according to the `uniqueId` property of their material, in ascending order, and are rendered in this sorted order. This is to optimize state changes and reduce the number of times these states need to be changed. You can change this order by changing the `uniqueId` value, or by using the [setRenderingOrder](/typedoc/classes/babylon.scene#setrenderingorder) method of the scene.

## Precompilation
By default, materials are compiled only when required. But you may want to precompile everything before running your rendering in order to get the smoother experience possible.

To do so, you can just prepare your material with: 

```
material.forceCompilation(mesh, function() {
    // Do something when material is compiled
});
```

For instance you could go through all your meshes and force compilation of all materials in order to get everything ready before the first frame.

## Non blocking textures
You also have the opportunity to flag textures as non blocking. By default, a material will not be able to render a mesh until its effect is compiled and all textures are loaded.

You can decide to still render your mesh even if textures are not loaded (The missing textures will be replaced by a 1x1 black texture). To do so, just call:

```
texture.isBlocking = false;
```

