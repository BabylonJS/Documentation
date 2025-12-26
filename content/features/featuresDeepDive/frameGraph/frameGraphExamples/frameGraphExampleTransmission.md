---
title: Rendering transmissive materials with frame graphs
image:
description: Use a frame graph to render transmissive materials / meshes
keywords: diving deeper, frame graph, rendering, node editor, examples, transmissive
---

## Introduction

Transmissive materials are materials that allow you to see through them and use a refraction texture to display what is behind the mesh with that material.

This texture is created by rendering the non-transmissive meshes and is defined as a refraction texture for transmissive materials, with a specific coordinate mode so that we have the illusion of seeing through the mesh, when in reality we are simply rendering the mesh with a special refraction texture.

For example, in the scene below, we have a single transmissive material/mesh (the amber block):

![Scene with transmissive meshes](/img/frameGraph/example_transmission_finalscene.jpg!500)

The amber mesh is rendered like this:

![Refraction texture](/img/frameGraph/example_transmission_refractiontexture.jpg!400)

In each frame, the refraction texture is regenerated to account for changes in the scene (camera or mesh movements, etc.).

## Support in Babylon.js

Transmissive materials/meshes are currently supported via the glTF extension [KHR_materials_transmission](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_transmission/README.md).

This means that you cannot directly define transmissive materials via code; you must load a .glb/.gltf file containing transmissive materials (the extension uses a `TransmissionHelper` class internally, but this is not accessible to the end user).

The implementation is as follows:
* The refraction texture is generated in a separate `RenderTargetTexture` by rendering all non-transmissive meshes.
  * This texture is defined as the refraction texture for all transmissive materials.
* The entire scene (non-transmissive + transmissive meshes) is rendered to the screen.

The `TransmissionHelper` class is responsible for rendering the refraction texture and assigning it to transmissive materials. Two separate renders are required to create a frame:

![Transmission helper](/img/frameGraph/example_transmission_transmissionhelper.jpg!700)

By using a frame graph (actually a node render graph), we are free to create transmissive materials without resorting to external .glb/.gltf files.

You may also have noticed in the description above that non-transmissive meshes are rendered twice: once to generate the refraction texture, and again when the entire scene is rendered.

Thanks to the flexibility of the node render graph, we can do better and render non-transmissive meshes only once!

## Flow of operations with the node render graph

Here are the details of the operations we will perform in the node render graph:

![Node render graph operations](/img/frameGraph/example_transmission_framegraph-operations.jpg!600)

As you can see, two additional operations are required compared to using `TransmissionHelper`: a texture copy and image post-processing.

However, in all but the simplest scenes, these operations will be faster than rendering the non-transmissive meshes twice (which in practice means rendering the scene twice, since there are usually only a few transmissive meshes in a scene).

Note that we need to generate all renders in linear space (hence the darker tones in the image above) to avoid unnecessary gamma \<-\> linear space conversions: we only apply a conversion from linear space to gamma space once at the end, using an image processing post-process.

You may be wondering why we need to copy the current texture (let's call it **T**) to use it as a refraction texture for transmissive materials, rather than just using **T**. This is because it is impossible to read and write to the same texture during a render pass. Since we render to **T** when rendering transmissive meshes, we cannot use it as a refraction texture. A copy texture is not that bad for performance, and you may even decide to use a smaller texture when copying, as you probably don't need the full final resolution for the refraction texture.

## Node render graph implementation

Here is the node render graph corresponding to the description in the previous section:

![Node render graph implementation](/img/frameGraph/example_transmission_framegraph.jpg!600)

<NRGE id="#3MVLQ7#9" title="Implementation of the node render graph" description="Rendering of transmissive materials with a node render graph" isMain={true} category="NodeRenderGraph"/>

It closely follows the operations described above:
* `RenderNonTransmissiveObjects` renders the objects in the *NonTransmissiveObjectsList* list in the **Color Texture** texture
* `Copy texture` copies **Color Texture** to **Refraction Texture**
* `RenderTransmissiveObjects` renders the objects in the *TransmissiveObjectsList* list in the **Color Texture** texture
* `Image Processing` applies a linear to gamma space conversion to **Color Texture** and generates the result in the color backbuffer

An additional task that has not yet been described is the `Gen refraction texture mipmaps` block. This block simply generates the mipmaps for the **Refraction texture**, which are necessary to simulate the glossiness of the refracted part of the scene.

Key points to highlight from this graph:
* Both the `RenderNonTransmissiveObjects` and `RenderTransmissiveObjects` rendering tasks have the **Disable image processing** option checked to render in linear space:
![Rendered in linear space](/img/frameGraph/example_transmission_prop_linearspace_render.jpg)
* The same applies to the clear color of the `Clear` block:
![Rendered in linear space](/img/frameGraph/example_transmission_prop_linearspace_clearcolor.jpg)
* The **Create mipmaps** option is checked in the `Refraction Texture` block so that the texture is created with mipmaps. Note that this does not mean that mipmaps are *generated*, but only that additional GPU memory will be allocated for mipmaps! Mipmaps are generated using the `GenerateMipmaps` block. We have also defined specific dimensions for this texture (1024x1024), as we do not need the full final screen resolution:
![Refraction texture properties](/img/frameGraph/example_transmission_prop_refractiontexture.jpg)
* The output of the `Gen refraction texture mipmaps` block is connected to the **dependencies** input of the `RenderTransmissiveObjects` block: this ensures that the texture is copied and the mipmaps are generated before this block is processed, as we will need the refraction texture during rendering.

## Playground implementation

Here is a playground that uses the node render graph described above to render a scene with transmissive materials:

<Playground id="#JWKDME#196" image="/img/playgroundsAndNMEs/pg-JWKDME-70.png" title="Node render graph for rendering transmissive materials" description="Rendering transmissive materials with a node render graph" isMain={true}/>

We have created a separate class `RenderWithTransmission`, which takes care of loading and configuring the graph for you. This should make it easier to reuse the code in your own projects, but feel free to use this code as a starting point for your own experiments!

Note that we load a .glb file that normally contains the `KHR_materials_transmission` extension, but we have created a version of the asset without this extension. The goal is to be able to compare the same scene using the existing support for transmissive materials in Babylon.js with the node render graph implementation.

Here is the same scene using the unmodified asset:

<Playground id="#SYQW69#1301" title="TransmissionHelper for rendering transmissive materials" description="Rendering transmissive materials with transmission helper" isMain={true}/>

If you open both playgrounds in two different tabs and switch between them, you will see that the renders are identical. However, if you check a frame with [Spector](https://spector.babylonjs.com/), you will see that we are performing fewer render passes in the node render graph version.
