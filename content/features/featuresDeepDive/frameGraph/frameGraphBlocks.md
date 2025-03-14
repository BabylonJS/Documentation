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

### Inputs allowing several types of connection

Sometimes, an input of a block allows several types of connections, but you cannot know what these types are by simply looking at the name of the connection. For example, the `SSR` block needs a depth texture as input:

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

[TO DO]

### Texture, TextureDepthStencil

[TO DO]

## Task blocks

[TO DO]
