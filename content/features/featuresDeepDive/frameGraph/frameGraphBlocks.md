---
title: Node Render Graph Blocks
image:
description: A detailed overview of the Node Render Graph blocks.
keywords: diving deeper, frame graph, node render graph, rendering, node editor
---

# Node Render Graph Blocks

The Node Render Graph system is based on a set of blocks representing different tasks and resources. Each block has its own set of inputs and outputs, allowing users to link them together to create complex interactions.

The preferred way to use the node framework is to use the [Node Render Graph Editor](https://nrge.babylonjs.com/) (NRGE), but you can also use it programmatically by creating instances of the different `NodeRenderGraphXXX` classes and connecting them with connection points.

## General notes

### Transient errors

Unlike other node editors (such as the node material editor and the node geometry editor), it often happens that the current state of the graph edited in the NRGE is wrong and generates an error in the window log, even if all the blocks are correctly connected. This is due to the nature of the graph - which represents rendering tasks - and the fact that certain parameter combinations are erroneous or may not be supported by your platform.

For example, if you clear a color and depth texture using a `Clear` block and update the number of color texture samples, you will immediately get an error in the console:

<font color="red">
Error: FrameGraphClearTextureTask Clear: the depth texture and the output texture must have the same number of samples.<br/>
From preview manager: Error: FrameGraphClearTextureTask Clear: the depth texture and the output texture must have the same number of samples.
</font>

As the message indicates, the two textures must use the same number of samples. This is therefore a transient error that will disappear when you have also updated the depth texture so that it uses the same number of samples as the color texture.

You will probably encounter these transient errors several times during your work with NRGE, so don't be surprised. You should be able to correct them easily by updating the correct parameter (the message should help you find the right parameter!).

### The **target** inputs

You will see that a number of blocks have an input called **target**, which may seem strange at first glance for an input connection...

This input is in fact the texture on which the block will render, and it is also the texture that will be emitted by the block through the **output** connection point, so that you can link it to another block. This input is often optional: if you don't connect anything to it, a texture will be automatically created, which has the same size/format/type as one of the block's input textures, which is generally named **source**. This is how all post-process blocks behave. Here are a few of them:

![Blocks with optional "target" input](/img/frameGraph/source_target_inputs.jpg)

In some cases, some blocks only have a **target** input and no **source** input. In this case, **target** is not optional and you must always connect an existing texture. Here is a list of some blocks that behave in this way:

![Blocks with mandatory "target" input](/img/frameGraph/target_only_inputs.jpg)

### The **dependencies** inputs

Most (if not all) blocks have a **dependencies** input. This input helps you organize the order in which the blocks are executed at runtime.

Normally, the execution order is defined by the connections between the blocks:

![Basic graph](/img/frameGraph/basic_graph.jpg)

It is obvious that the `Clear` block will be executed before the `Main Rendering` block, because the latter has input connections connected to the former.

However, it is not always possible to describe the order of execution in this way. For example, imagine that you have to render a surveillance center, where a screen shows you a view of the exterior of the building. In this case, you will have to render (R1) the exterior view in a texture and use this texture as the diffuse texture of the screen mesh material during the rendering of the surveillance center (R2). The problem is that you have no way of representing this dependency between R1 and R2 using only the standard inputs/outputs of these blocks:

![The dependencies input](/img/frameGraph/dependencies_input.jpg) <span url="https://nrge.babylonjs.com/#PSA9PS#157"/>

`CustomRendering` renders the exterior view in a texture. Without the connection to the **dependencies** entry of the `MainRendering` block, you could not make `CustomRendering` part of the graph and execute it before `MainRendering`.

Note that this **dependencies** input is specific to the node render graph framework: frame graph tasks do not have this property! If you use the frame graph framework yourself (see [Frame Graph Usage](/features/featuresDeepDive/frameGraph/frameGraphBasicConcepts#frame-graph-usage)), it is your responsibility to add tasks in a frame graph in the correct order and to ensure that if a task depends on another task, the latter is added first.

### Connection types

NRGE supports a number of connection types, those that would be expected of a node render graph: texture, camera, object list, etc.

However, in order to make things easier to discover in the user interface and to limit errors, we have divided the texture type into several types, depending on the type of data stored in the texture:
* **TextureViewDepth**: the texture stores the depth (Z coordinate) in the camera's view space
* **TextureScreenDepth**: the texture stores the depth (Z coordinate) in the screen space
* **TextureViewNormal**: the texture stores the normal in the camera's view space
* **TextureWorldNormal**: the texture stores the normal in the world space
* **TextureAlbedo**: the texture stores the albedo color
* **TextureReflectivity**: the texture stores the reflectivity color
* **TextureLocalPosition**: the texture stores the position in the model's local space
* **TextureWorldPosition**: the texture stores the position in the world space
* **TextureVelocity**: the texture stores the velocity in the screen space
* **TextureLinearVelocity**: the texture stores the linear velocity in the screen space
* **Texture**: a general purpose texture

Most of the time, these textures (except for the general purpose texture) will be generated by the `GeometryRenderer` block:

![Geometry Renderer block](/img/frameGraph/block_geometry_renderer.jpg)

To make these textures stand out, the corresponding outputs are all preceded by the prefix **geom**. The same goes for the blocks that are expecting one (or more) of these "geometry" textures as input. For example:

![Blocks with geometry textures as inputs](/img/frameGraph/blocks_input_geomtexture.jpg)

This makes it clear what kind of texture is expected for a given input and should help users to associate the right kind of texture with these blocks.

### Inputs allowing several types of connection

Sometimes, an input of a block allows several types of connections, but you cannot know what these types are by simply looking at the name of the connection. For example, the `SSR` block needs a geometry depth texture as input:

![SSR](/img/frameGraph/ssr.jpg)

If you click on the connection point itself (the green circle), you can see in the right-hand pane the main type of connection, as well as the other accepted types:

![SSR geomDepth accepted types](/img/frameGraph/ssr_geomdepth.jpg)

The main type is a texture that stores view depth data, but the connection point also accepts a texture with screen depth data.

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

This input block allows you to define a shadow light (that is, a light that can generate shadows - all types of lights in Babylon, except area lights) in the graph, which you can connect to blocks that need a shadow light as input. This input is always an “external” input, so you will need to provide a value for this block by code when you use a node render graph in your projects.

The shadow light inputs are mainly used by the `ShadowGenerator` block, which itself can be connected to an `ObjectRenderer` block to render objects with shadows (see the description of the `ShadowGenerator` block below).

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

## Task blocks

Here is the description of the task blocks supported by the node render graph framework.

### Post-Process blocks

Example of post-process blocks:

![Example of post-process blocks](/img/frameGraph/source_target_inputs.jpg)

These blocks are all constructed according to the same model:
* They have a **source** and **target** input. The **source** is the texture to which the post-processing will be applied, and the **target** is the resulting texture. **target** is the resulting texture. If **target** is not provided, a texture will be automatically created, with the same size, format, type, etc. as **source**.
* They have an **output** texture, which is the result of the post-processing applied to **source**, and which is the same texture as **target**.

You can modify the parameters of a post-process by clicking on it and changing the values in the panel on the right. For example, for the `DepthOfField` post-process:

![Parameters of DoF](/img/frameGraph/dof_parameters.jpg)

You should refer to the post-process class in the Babylon framework if you need an explanation of what each parameter does for a given post-process block ([this page](https://doc.babylonjs.com/typedoc/classes/BABYLON.DepthOfFieldEffect) for depth of field, for example).

In the rest of this section, we will focus on post-processes that have special features and will skip post-processes that should be self-explanatory (those for which you just need to connect the right inputs and define the right values for their parameters!).

#### SSR (Screen Space Reflection)

![SSR](/img/frameGraph/ssr.jpg)

The first thing to note is that **geomDepth** and **geomBackDepth** allow a view or screen space depth geometry texture, and **geomNormal** allows a view or world space normal geometry texture: as explained in [this section](#inputs-allowing-several-types-of-connection), you can see all the accepted connection types by clicking on the circle icon representing the connection point.

Furthermore, if you programmatically change the blur strength value (the `FrameGraphSSRRenderingPipelineTask.ssr.blurDispersionStrength` property) from 0 to a non-zero value, or vice versa, you must call the `NodeRenderGraph.build()` function again to rebuild the graph! This is because the frame graph task of the SSR rendering pipeline generates blur tasks when this parameter is non-zero, and does not generate them when it is zero (for performance reasons). This means that the rendering passes generated are not the same depending on this parameter, which is why you need to call `build()` again when you change it.

**geomBackDepth** is optional, and you should only connect a texture to this input if you check the **Automatic thickness computation** parameter of the SSR block. Do not connect a texture if you do not check this option, otherwise you will be penalized in terms of performance for having generated the texture when it is not used by the SSR block. If you connect something to **geomBackDepth**, you must connect the same type of texture as the one you connect to **geomDepth**: a view or a screen space depth texture. You will get an error message in the window message if you mix the types.

A typical configuration when using the **Automatic thickness computation** option is as follows:

![SSR setup for automatic thickness computation](/img/frameGraph/ssr_auto_thickness.jpg)

NRGE link: https://nrge.babylonjs.com/#L75VY0#23

Note that the `Geometry renderer back faces` block has been configured with **Reverse culling** checked, because we need the depth of the back faces! You will get an error message in the window log if you forget to check this option for the `GeometryRenderer` connected to the **geomBackDepth** input (but only if **Automatic calculation of thickness** is checked!).

PG: <Playground id="#PIZ1GK#2094" title="Using SSR in a node render graph" description="Example of a node render graph using SSR with automatic thickness computation"/>

You will see in this PG that we are rebuilding the graph (see line 67) because we have set the `ssr.blurDispersionStrength` property to 0. As the SSR block has a non-zero value in NRGE, we are in the case explained above where the graph must be rebuilt.