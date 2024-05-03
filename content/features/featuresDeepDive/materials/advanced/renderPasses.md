---
title: Render pass ids
image:
description: Learn all about render pass id in Babylon.js.
keywords: diving deeper, engine, rendering, pass
further-reading:
video-overview:
video-content:
---

Render pass ids are a new concept starting with Babylon.js 5.0.

It is used internally to enable new features (like using custom materials in the effect layers or with the depth renderer) but it can also be used by the user, to improve performances for eg.

## Generalities
Each time a mesh has to be rendered (a submesh to be more precise, as in Babylon.js the rendering is done at the submesh level), it is done in the context of a render pass and a render pass is identified by a simple id (number): hence the name `render pass id`. There's also a name associated to a render pass id, but it is used for debugging purpose only (you can get all the render pass names by doing `engine.getRenderPassNames()` - the render pass id is the index in this array).

A number of data (like the `effect`) used for the rendering is associated to this render pass. Technically, these data are stored in `SubMesh._drawWrappers`: this is an array of `DrawWrapper` and the index in this array is the render pass id.

The engine class keeps track of the current render pass id (`Engine.currentRenderPassId`) and this value is modified by the subsystems of Babylon.js:
* each `RenderTargetTexture` sets `engine.currentRenderPassId` to its own render pass id (`RenderTargetTexture.renderPassId`) before rendering the meshes (from its `renderList`)
* each camera has its own `renderPassId` which is used to render the meshes to the final texture/framebuffer

## Using render pass ids
As a user, you can create (and release) render pass ids very easily:
```javascript
const renderPassId = engine.createRenderPassId("My pass"); // the label is optional as it is used for debugging purpose only
[...]
engine.releaseRenderPassId(renderPassId);
```

The main interest for managing render pass ids yourself is to improve performances when a mesh must be rendered with different materials depending on the rendering path.

### Changing materials when rendering to the final framebuffer
For eg, if during the course of the program you must switch between Material A and Material B several times, you could simply loop over the meshes and change their `material` property. However, this is taxing on performance because each time you update the `material` property some caches must be recreated and it can have some visible impact (delay) on the rendering.

Take this PG as an example:

<Playground id="#6XIT28#1158" title="Update lots of materials" description="Simple example of changing the materials used to display a lot of meshes."/>

When you click on the **material 1** and **material 2** buttons there's a visible delay before the display is updated.

Now, if you are using two render pass ids, one for each case, and sets the `camera.renderPassId` property to the right one when clicking on the buttons, you will notice there's no delay anymore (except the first time when you click on **material 2** because the effects must be created):

<Playground id="#6XIT28#1160" title="Update lots of materials (render pass id)" description="Simple example of changing the materials used to display a lot of meshes with custom render pass ids."/>

You must use the `AbstractMesh.setMaterialForRenderPass(material, id)` method to associate a material for a mesh with a render pass id.

### Using a different material when rendering into a RenderTargetTexture
Before 5.0 it was not easy/performant to use a different material when rendering a mesh into a custom `RenderTargetTexture` and when rendering it into the final framebuffer. Thanks to the new render pass ids, you can now simply call `RenderTargetTexture.setMaterialForRenderPass(meshOrMeshes, material)` to render a mesh in the render target texture with a specific material without any performance penalty!

See an example [here](/features/featuresDeepDive/postProcesses/renderTargetTextureMultiPass#making-multiple-passes-and-composing-them)

### Using a different material when rendering with the depth renderer or into a glow/highlight layer 
In the exact same way as for the `RenderTargetTexture` class, you can use a specific material to render a mesh with the depth renderer by using the `DepthRenderer.setMaterialForRenderPass(meshOrMeshes, material)` method: internally it is simply calling `RenderTargetTexture.setMaterialForRenderPass(meshOrMeshes, material)`.

For eg, you will need a custom material to render a mesh with the depth renderer if you are using a non standard material to display the mesh to the final framebuffer (for eg, if you update the vertex positions in the vertex shader):

<Playground id="#6GFJNR#161" title="Using a custom material with the depth renderer" description="Simple example of using a custom material to render a mesh with the depth renderer."/>

Same thing for the glow/highlight layers, use the `EffectLayer.setMaterialForRenderPass(meshOrMeshes, material)` method to set a specific material to be used for this layer.
