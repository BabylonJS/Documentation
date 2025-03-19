---
title: General Notes about Render Graph Blocks
image:
description: A detailed overview of the Node Render Graph blocks.
keywords: diving deeper, frame graph, node render graph, rendering, node editor
---

### Transient errors

Unlike other node editors (such as the node material editor and the node geometry editor), it often happens that the current state of the graph edited in the NRGE is wrong and generates an error in the window log, even if all the blocks are correctly connected. This is due to the nature of the graph - which represents rendering tasks - and the fact that certain parameter combinations are erroneous or may not be supported by your platform.

For example, if you clear a color and depth texture using a `Clear` block and update the number of color texture samples, you will immediately get an error in the console:

<font color="red">
Error: FrameGraphClearTextureTask Clear: the depth texture and the output texture must have the same number of samples.<br/>
From preview manager: Error: FrameGraphClearTextureTask Clear: the depth texture and the output texture must have the same number of samples.
</font>

As the message indicates, the two textures must use the same number of samples. This is therefore a transient error that will disappear when you have also updated the depth texture so that it uses the same number of samples as the color texture.

You will probably encounter these transient errors several times during your work with NRGE, so don't be surprised. You should be able to correct them easily by updating the correct parameter (the message should help you find the right parameter!).

### Optional inputs

Some block inputs are optional: you can easily spot them because they appear in black.

![SSR](/img/frameGraph/ssr.jpg)

In the `SSR` block, **target**, **geomBackDepth** and **dependencies** are optional.

It is important not to connect anything to these inputs if it is not necessary, because in some cases you could suffer a performance penalty by doing so! See [SSR (Screen Space Reflection)](/features/featuresDeepDive/frameGraph/frameGraphBlocks/frameGraphBlocksDescription#ssr-(screen-space-reflection)) for more explanations on the `SSR` block.

### Inputs allowing several types of connection

The "wheel" icon that you may see for some input connection points means that the input accepts several types of connection, but you cannot know what these types are by simply looking at the name of the input. For example, the `SSR` block needs a geometry depth texture as input:

![SSR](/img/frameGraph/ssr.jpg)

If you click on the connection point itself (the black wheel icon), you can see in the right-hand pane the main type of connection, as well as the other accepted types:

![SSR geomDepth accepted types](/img/frameGraph/ssr_geomdepth.jpg)

The main type is a texture that stores view depth data, but the connection point also accepts a texture with screen depth data.

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

See the [GeometryRenderer block](#geometryrenderer) section for more information.

### Description of block parameters

Most blocks have parameters that you can change to modify their behavior: you access them by clicking on the block and you can modify them in the pane on the right side of the screen.

In the rest of this document, we will generally not list/describe them, because:
* many of them are self-explanatory
* we don't want to repeat descriptions that you can find elsewhere in the documentation. For example, the description of all SSR parameters can be found in [Screen Space Reflections (SSR) Rendering Pipeline](features/featuresDeepDive/postProcesses/SSRRenderingPipeline) or in the [class documentation](/typedoc/classes/babylon.ssrrenderingpipeline).

Regarding the second point, as most (if not all) of the blocks you can use in a frame graph are wrappers around features that exist in the engine, you can always find documentation about them in other sections of the website.
