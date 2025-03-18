---
title: Description of the Render Graph Blocks
image:
description: A detailed overview of the Node Render Graph blocks.
keywords: diving deeper, frame graph, node render graph, rendering, node editor
---

## Input blocks

Here is the description of the input blocks supported by the node render graph framework.

Note that most of the input blocks are “external” inputs, which means that you will have to provide a value for these blocks in your code, after loading a node render graph. The only input block that can be configured as an “internal” input is the `Texture` input, in which case you can define all the characteristics of the texture (size, format, type, etc.) directly on the input inside the graph.

The NRGE preview area will try to set sensible values for the external inputs (such as using the scene camera for `Camera` inputs, using the scene meshes for `ObjectList` inputs, etc), so that the preview can still be useful. But this is only true in the context of the preview area; you will still need to supply these values yourself when using a node render graph in your code.

### Camera

This input block allows you to define a camera in the graph, which you can connect to blocks that need a camera as input. This input is always an “external” input, so you will need to supply a value for this block by code when using a node render graph in your projects.

### ObjectList

This input block allows you to define a list of objects in the graph, which you can connect to blocks that need an input list of objects. This input is always an “external” input, so you will need to provide a value for this block by code when using a node render graph in your projects.

Note that for the moment, an object list can contain a list of meshes + a list of particle systems. From a programmatic point of view, it is defined as follows:

```typescript
export class FrameGraphObjectList {
    /**
     * The meshes in the object list.
     */
    meshes: Nullable<AbstractMesh[]>;
    /**
     * The particle systems in the object list.
     */
    particleSystems: Nullable<IParticleSystem[]>;
}
```

This list may also contain a list of sprites in the future.

### ShadowLight

This input block allows you to define a shadow light (that is, a light that can generate shadows - all types of lights in Babylon, except area and hemispherical lights) in the graph, which you can connect to blocks that need a shadow light as input. This input is always an “external” input, so you will need to provide a value for this block by code when you use a node render graph in your projects.

The shadow light inputs are mainly used by the `ShadowGenerator` block, which itself can be connected to an `ObjectRenderer` block to render objects with shadows (see the description of the [ShadowGenerator](#shadowGenerator-and-cascadedshadowgenerator) block below).

### TextureBackBuffer, TextureBackBufferDepthStencil

These two input blocks allow you to use the back buffer texture and the depth/stencil texture in your graph. The back buffer texture is the screen texture, the one that will be displayed to the user.

Note that the use of these textures is subject to certain restrictions:
* You must use them together: you cannot use a normal depth/stencil texture (i.e. without a back buffer) if you use the back buffer texture in an `ObjectRenderer` block, and vice versa.
* You cannot use the back buffer texture when a block is expecting a texture that it can read. This means that it is not possible to use the back buffer texture for post-processing blocks, among others.

Given these restrictions, back buffer textures can only be used for the simplest graphs, and you may not use them much. Note that the `Output` block is responsible for copying its input texture into the back buffer texture, if the input texture is not already the back buffer texture.

### Texture, TextureDepthStencil

These two input blocks allow you to create a texture and a depth/stencil texture. These are the only resources that can be configured as “internal” or “external”:
* Internal textures are configured directly in the NRGE. You must provide all the data necessary for the creation of the texture (size, format, type, etc.).
* External textures are provided by external code, after loading/creating a graph (using `NodeRenderGraph.ParseFromSnippetAsync`, for example).

Configure a texture as “external” if you want to import an existing texture into your frame graph (see [Frame Graph in addition to the scene render loop](/features/featuresDeepDive/frameGraph/frameGraphBasicConcepts/frameGraphInAdditionToRenderLoop#using-a-node-render-graph)).

For “internal” textures, you will need to provide all the parameters necessary for creating the texture:

![Texture creation parameters](/img/frameGraph/texture_creation_params.jpg)

These parameters should be self-explanatory. Regarding **Size is in percentage**, if it is **true**, it means that the size values are percentages instead of pixel sizes. These percentages are related to the size of the output screen. If you set `Width=Height=100`, this means that the texture will be created with the same size as the output screen. If you set these values to `50`, the texture will be created with half the size of the screen, and so on. Most of the time, you will want to check **Size is in percentage** to keep your frame graph independent of the output size.

## Post-Process blocks

Example of post-process blocks:

![Example of post-process blocks](/img/frameGraph/source_target_inputs.jpg)

These blocks are all constructed according to the same model:
* They have a **source** and **target** input. The **source** is the texture to which the post-processing will be applied, and the **target** is the resulting texture. If **target** is not provided, a texture will be automatically created, with the same size, format, type, etc. as **source**.
* They have an **output** texture, which is the result of the post-processing applied to **source**, and which is the same texture as **target**.

You can modify the parameters of a post-process by clicking on it and changing the values in the panel on the right. For example, for the `DepthOfField` post-process:

![Parameters of DoF](/img/frameGraph/dof_parameters.jpg)

You should refer to the post-process class in the Babylon framework if you need an explanation of what each parameter does for a given post-process block ([this page](https://doc.babylonjs.com/typedoc/classes/BABYLON.DepthOfFieldEffect) for depth of field, for example).

In the rest of this section, we will focus on post-processes that have special features and will skip post-processes that should be self-explanatory (those for which you just need to connect the right inputs and define the right values for their parameters!).

<H3Image title="SSR (Screen Space Reflection)" image="/img/frameGraph/ssr.jpg" alt="SSR node"/>

This block allows you to apply a Screen Space Reflection post-process to a given texture.

The first thing to note is that **geomDepth** and **geomBackDepth** allow a view or screen space depth geometry texture, and **geomNormal** allows a view or world space normal geometry texture: as explained in [this section](#inputs-allowing-several-types-of-connection), you can see all the accepted connection types by clicking on the circle icon representing the connection point.

Furthermore, if you programmatically change the blur strength value (the `FrameGraphSSRRenderingPipelineTask.ssr.blurDispersionStrength` property) from 0 to a non-zero value, or vice versa, you must call the `NodeRenderGraph.build()` function again to rebuild the graph! This is because the frame graph task of the SSR rendering pipeline generates blur tasks when this parameter is non-zero, and does not generate them when it is zero (for performance reasons). This means that the rendering passes generated are not the same depending on this parameter, which is why you need to call `build()` again when you change it.

**geomBackDepth** is optional, and you should only connect a texture to this input if you check the **Automatic thickness computation** parameter of the SSR block. Do not connect a texture if you do not check this option, otherwise you will be penalized in terms of performance for having generated the texture when it is not used by the SSR block. If you connect something to **geomBackDepth**, you must connect the same type of texture as the one you connect to **geomDepth**: a view or a screen space depth texture. You will get an error message in the window message if you mix the types.

A typical configuration when using the **Automatic thickness computation** option is as follows:

![SSR setup for automatic thickness computation](/img/frameGraph/ssr_auto_thickness.jpg)

<NRGE id="#L75VY0#23" title="Using SSR in a node render graph" description="SSR setup for automatic thickness computation" isMain={true} category="NodeRenderGraph"/>

Note that the `Geometry renderer back faces` block has been configured with **Reverse culling** checked, because we need the depth of the back faces! You will get an error message in the window log if you forget to check this option for the `GeometryRenderer` connected to the **geomBackDepth** input (but only if **Automatic calculation of thickness** is checked!).

<Playground id="#PIZ1GK#2094" title="Using SSR in a node render graph" description="Example of a node render graph using SSR with automatic thickness computation" isMain={true}/>

You will see in this PG that we are rebuilding the graph (see line 67) because we have set the `ssr.blurDispersionStrength` property to 0. As the SSR block has a non-zero value in NRGE, we are in the case explained above where the graph must be rebuilt.

## Rendering blocks

<H3Image title="ObjectRenderer" image="/img/frameGraph/block_objectrenderer.jpg" alt="ObjectRenderer node"/>

This is the main block used to render objects on a texture. You can consider it as the equivalent of `RenderTargetTexture` when you want to create a render pass programmatically.

You will always get the same texture at the **output** output as the texture connected to the **target** input. The same goes for **outputDeth** and **depth** (in case you connect something to the **depth** input, which is optional).

The **shadowGenerators** input is optional and can be used if you want to generate shadows at the same time as you render the objects. This input expects a connection from a **ShadowGenerator.generator** output. If you want to render objects with shadows from multiple lights, you can use a `ResourceContainer` block to gather multiple shadow generators, and connect the container to the **shadowGenerators** input:

<NRGE id="#PSA9PS#161" title="Multiple shadow generators example (NRGE)" description="Using multiple shadow generators with an ObjectRenderer block" isMain={true} category="NodeRenderGraph"/>

<Playground id="#JWKDME#30" title="Multiple shadow generators example (PG)" description="Using multiple shadow generators with a ObjectRenderer block" isMain={true}/>

<H3Image title="GeometryRenderer" image="/img/frameGraph/block_geometry_renderer.jpg" alt="GeometryRenderer node"/>

This block is used to generate geometry textures, i.e. textures containing special data such as depths in view/screen space, normals in view/world space, reflectivity, etc.

To make these textures stand out, the corresponding outputs are all preceded by the prefix **geom**. The same goes for the blocks that are expecting one (or more) of these geometry textures as input. For example:

![Blocks with geometry textures as inputs](/img/frameGraph/blocks_input_geomtexture.jpg)

This makes it clear what kind of texture is expected for a given input and should help users to associate the right kind of texture with these blocks.

<H3Image title="ShadowGenerator and CascadedShadowGenerator" image="/img/frameGraph/block_shadowgenerator.jpg" alt="ShadowGenerator and CascadedShadowGenerator nodes"/>

Use this block when you want to generate shadows from a light. The light must be a “shadow light”, i.e. any light except area lights and hemispherical lights. The `CascadedShadowGenerator` block has the same inputs and outputs as the `ShadowGenerator` block, but with additional parameters (click on the block to access the list of parameters).

You may be surprised to see a **camera** input, because the scene is rendered from the point of view of the light to generate the shadow map, not from the point of view of a camera. This camera is necessary to:
* split the camera frustum when using a `CascadedShadowGenerator` block
* calculate the LOD of the meshes. The LOD of the meshes is defined according to the distance from a camera, not from a light.

The **generator** output is what you need to connect to the **ObjectRenderer.shadowGenerators** input, to render meshes with shadows. This is because the `ObjectRenderer` block needs more than access to the shadow map texture; it needs access to the shadow generator object itself. The **output** is the texture of the shadow map, in case you need it in other parts of the graph.

<H3Image title="TAAObjectRenderer" image="/img/frameGraph/block_taaobjectrenderer.jpg" alt="TAAObjectRenderer node"/>

This block is similar to the `ObjectRenderer` block, except that it applies a temporal anti-aliasing effect to the rendering. Refer to [Temporal Anti-Aliasing (TAA) Rendering Pipeline](/features/featuresDeepDive/postProcesses/TAARenderingPipeline) for more information on TAA and the parameters you can use to adjust the effect.

<H3Image title="UtilityLayerRenderer" image="/img/frameGraph/block_utilitylayerrenderer.jpg" alt="UtilityLayerRenderer node"/>

This block does not generate any outputs by itself, but can be used to display [Gizmos](/features/featuresDeepDive/mesh/gizmo) in a frame graph.

You will need to retrieve a reference to the utility layer by code, then use it as a parameter for the Gizmo classes.

For example:
<NRGE id="#7RTSEF" title="Use of the UtilityLayerRenderer block (NRGE)" description="Example of a node render graph using the UtilityLayerRenderer block" isMain={true} category="NodeRenderGraph"/>

<Playground id="#IFF2ZR#1" title="Use of the UtilityLayerRenderer block" description="Example of a node render graph using the UtilityLayerRenderer block" isMain={true}/>

## Layers blocks

<H3Image title="GlowLayer and HighlightLayer" image="/img/frameGraph/block_layers.jpg" alt="GlowLayer and HighlightLayer nodes"/>

These blocks allow you to use the [Glow](/features/featuresDeepDive/mesh/glowLayer) and [Highlight](/features/featuresDeepDive/mesh/highlightLayer) effect layers in your frame graphs:
* The **target** input is the texture to which the glow or highlight effect will be applied.
* The optional **layer** input is a texture on which an intermediate (internal) rendering will be generated. This texture is then blended with the **target** to generate the output. If you do not provide **layer**, a texture will be created, based on the **Layer texture ratio**, **Layer texture fixed size** and **Layer texture type** parameters:
  * If **Layer texture fixed size** is not 0, it is the size (width/height) of the layer texture in pixels. Otherwise, **Layer texture ratio** is a factor applied to the width/height of **target** to calculate the width/height of the layer texture.
  * The **Layer texture type** parameter is the type of texture of the layer.
* The **objectRenderer** input must point to the `ObjectRenderer.objectRenderer` output used to generate the **target** texture: to function correctly, the `GlowLayer` and `HighlightLayer` blocks must have access to the `ObjectRenderer` object itself and not only to the output texture.

Here is an example of how to use the `GlowLayer` block:
<NRGE id="#PSA9PS#154" title="Use of the GlowLayer block (NRGE)" description="Example Node Render Material using two GlowLayer blocks" isMain={true} category="NodeRenderGraph"/>

<Playground id="#IG8NRC#16" title="Use of the GlowLayer block (PG)" description="Example of a node render graph using the GlowLayer block" isMain={true}/>

Note that this graph renders two glow layers in two different textures, with different parameters, which you cannot do without a frame graph!

## Textures blocks

<H3Image title="Clear" image="/img/frameGraph/block_cleartexture.jpg" alt="Clear node"/>

This block allows you to clear a color and/or a depth/stencil texture. The inputs **target** and **depth** are optional, but you must provide at least one of them (otherwise there is no reason to use a `Clear` block!).

The **output** output is identical to **target**, and **outputDepth** is identical to **depth**.

<H3Image title="CopyTexture" image="/img/frameGraph/block_copytexture.jpg" alt="CopyTexture node"/>

The inputs and outputs of this block should be self-explanatory: **source** is the source texture to be copied and **target** is the texture to copy into. The **output** is the same texture as the **target**.

<H3Image title="GenerateMipmaps" image="/img/frameGraph/block_generatemipmaps.jpg" alt="GenerateMipmaps node"/>

In a frame graph, mipmaps are not generated automatically; you must use a `GenerateMipmaps` block to do so.

Once again, the inputs and outputs are self-explanatory: **target** is the texture for which the mipmaps are to be generated, and **output** is the same as **target**.

## Misc blocks

<H3Image title="Cull" image="/img/frameGraph/block_cull.jpg" alt="Cull node"/>

This block allows you to cull a list of objects against a camera frustum: you must provide the camera via the **camera** input, and the list of objects via the **objects** input. The result of this block is provided by the **output**: the list of objects that are (at least partially) inside the camera frustum.

<H3Image title="Execute" image="/img/frameGraph/block_execute.jpg" alt="Execute node"/>

This block allows you to add a custom processing during the execution of a frame graph.

Once you have added an `Execute` block in the graph flow, you must retrieve a reference to this block by program and provide the function to be executed when the block is executed:
```javascript
const executeBlock = nrg.getBlockByName("<name of the Execute block>");
executeBlock.task.func = (_context) => {
    // Code to execute when the task is executed
};
```

In WebGPU, you can use this block to execute a compute shader at a specific moment in the execution of the frame graph, for example.

<H3Image title="GUI" image="/img/frameGraph/block_gui.jpg" alt="GUI node"/>

This block allows you to apply a full-screen GUI over a frame graph texture.

Once you have added a `GUI` block to the graph flow, you must retrieve a reference to this block by program and add elements to the GUI, as you would do when you create an [AdvancedDynamicTexture](/features/featuresDeepDive/gui/gui#advanceddynamictexture) yourself. For example:
```javascript
const guiBlock = nrg.getBlockByName("<name of the GUI block>");
const gui = guiBlock.gui;

const button = BABYLON.GUI.Button.CreateSimpleButton("button", "Edit Frame Graph");

button.onPointerClickObservable.add(() => {
    nrg.edit({
        nodeRenderGraphEditorConfig: {
            hostScene: scene,
        }
    });
});

gui.addControl(button);
```

<H3Image title="ResourceContainer" image="/img/frameGraph/block_resourcecontainer.jpg" alt="ResourceContainer node"/>

This block allows you to gather several resources of any types in a single block. It can be useful when you need to pass several resources to a block that has only one input for that resource.

We saw [an example earlier](#objectrenderer), when we wanted to render objects with multiple lights generating shadows. We connected the two shadow generators to a `ResourceContainer` block and linked the container to the **ObjectRenderer.shadowGenerators** input:

![Use of the ResourceContainer block](/img/frameGraph/multiple_shadowgenerators.jpg)

<H3Image title="Output" image="/img/frameGraph/block_output.jpg" alt="Output node"/>

This is the block you must connect to in order to generate something on the screen.

Note that when you use a frame graph to generate a texture that you want to reuse elsewhere (in another frame graph, or anywhere else for that matter) and not render on the screen, you can deactivate the block to avoid a copy to the screen:

![Disabled Output block](/img/frameGraph/output_disabled.jpg)

Even in this case, you must connect something to the `Output` block, otherwise your graph will not be valid!
