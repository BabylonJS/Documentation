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

![The dependencies input](/img/frameGraph/dependencies_input.jpg)

`CustomRendering` renders the exterior view in a texture. Without the connection to the **dependencies** entry of the `MainRendering` block, you could not make `CustomRendering` part of the graph and execute it before `MainRendering`.