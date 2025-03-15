---
title: Frame Graph Basic Concepts and Getting Started
image:
description: Learn all about the Babylon.js Frame Graph system.
keywords: diving deeper, frame graph, rendering, node editor, getting started, basic concepts
---

## Frame Graph Introduction

### Naming

First a word about the names.

We used “Frame Graph” as the base name for our main classes (in the `src/FrameGraph/` directory), because it is the name that their inventor used in the first place (see [FrameGraph: Extensible Rendering Architecture in Frostbite](https://www.slideshare.net/DICEStudio/framegraph-extensible-rendering-architecture-in-frostbite)), and also because we don't only have rendering tasks in a frame graph (for example, we also have a culling task).

However, we have used the name “Render Graph” for the node framework (under the directory `src/FrameGraph/Node/`), built on top of the frame graph framework. This is to easily differentiate the two frameworks (the frame graph framework is autonomous, you don't have to use the node render graph framework if you don't want to), and also because it makes a nice acronym (NRG - Node Render Graph) :).

### Description

A frame graph is a DAG (Directed Acyclic Graph - a bit like NME / NGE) where each node (task) represents a render pass, or more generally a task performed when rendering a frame (we have tasks that are not render passes, such as the culling task).

Each task declares its input and output resources.

The resources can be textures, a list of renderable meshes, cameras, lights. As for the textures, they are allocated and managed by the frame graph subsystem and not directly by the tasks. This allows us to optimize the allocation of textures and reuse them during the execution of a graph, thus saving GPU memory.

By default, there is no persistence of resources between each execution of a rendering graph, unless a resource is specifically labeled as “persistent” (think of a texture that must be reused from one frame to the next). In our implementation, persistent textures are used to implement “ping-pong” textures, where we change the read and write textures with each frame (used to implement the temporal antialiasing task, for example).

To clarify the ideas, here is a simple graph:

![Basic graph](/img/frameGraph/basic_graph.jpg)

The “Color Texture”, “Depth Texture”, “Camera” and “Object List” nodes are resources (respectively, of the texture, depth texture, camera and object list type). “Clear” and “Main Rendering” are two tasks, the first clears a texture/depth texture and the second renders objects in a texture. “Output” is the output buffer (think of it as the screen output).

### Benefits

A frame graph allows a high-level knowledge of the whole frame to be acquired, which:
* simplifies and optimizes resource management
* simplifies the configuration of the rendering pipeline => Visual Editor!
* simplifies asynchronous computation and resource barriers. This is an advantage for native implementations, but for the web, we don't (yet?) have asynchronous computation and we don't have to manage resource barriers ourselves.
* allows for autonomous and efficient rendering modules
* overcomes some of the limitations of our hard-coded pipeline.

The last advantage is particularly important, as it allows things that are not possible in our current fixed pipeline, which can be described as follows (this is what the existing `Scene.render` method does):
1. Animate
1. Update cameras
1. Render RTTs declared at the scene level
1. For each camera
    1. Evaluate and dispatch active meshes for rendering / Animate and dispatch particle systems for rendering
    1. Software skinning
    1. Rendering of RTT declared at camera level
    1. Rendering of active meshes
    1. Apply post-processing to the camera

We have a number of observables that allow you to inject code between these stages, and internal components that add functionality at key points (such as shadows, layers, effect layers, etc.), but the order of tasks is always fixed and strongly centered on the camera, as you can see.

With a frame graph, nothing is defined in advance; you simply create tasks and their interconnections. The camera has no particular status; it is a resource that you can use to construct the graph, in the same way that you can use textures or lists of objects.

Automatic texture management optimizes texture allocation and can lead to substantial GPU memory savings, depending on your graph:

![Basic graph](/img/frameGraph/gpu_memory_saving.jpg)

In this simple graph, reusing textures saves 25% of the GPU's memory, but we have already seen savings of 40% or more in other graphs.

## Frame Graph Usage

There are two different ways to use a frame graph in a scene.

### Use a frame graph instead of the scene render loop

This is the best way to use frame graphs, but as the implementation is not yet fully complete (in particular, a number of rendering tasks are not yet available for frame graphs), it is also possible to use one (or more) frame graph(s) at the same time as the existing scene render loop (subject of the next section).

In this mode, the execution of a frame graph largely replaces the flow of operations normally performed by `Scene.render` as described above. To activate this mode, simply define a frame graph instance in `Scene.frameGraph`. In this mode:
* There is no longer an active camera! `Scene.activeCamera` can be defined by a frame graph task if it needs it to run, but it is reset to `null` once the task is finished. This is logical, because the camera is no longer the central resource that it was when the frame graphs are not used. Therefore, you should not rely on `Scene.activeCamera` always having a non-null value in your code.
* You must define `Scene.cameraToUseForPointers` for the camera to be used for pointer operations. By default, if nothing is defined in this property, `Scene.activeCamera` is used. But since this last property is now `null` most of the time, pointer operations will not work as expected if you do not define `Scene.cameraToUseForPointers`.
* You will not be able to define the parameters of a certain number of components via the inspector (such as rendering pipelines, effect layers, post-processing) because these are now simple tasks within a frame graph. As a workaround, if you use a node render graph to generate the frame graph, you will be able to set parameters in the node render graph editor. We will also look at how to update the inspector (when possible), so that we can adjust the settings from this tool.
* Most of the existing observables notified by `Scene.render` are no longer notified. As explained above, the execution of the frame graph replaces much of `Scene.render` (see below), so a lot of code is no longer executed.

Regarding the last point, this is what `Scene.render` does when `Scene.frameGraph` is defined:
1. Notifies `Scene.onBeforeAnimationsObservable`
1. Calls `Scene.animate`
1. Notifies `Scene.onBeforeRenderObservable`
1. Updates the cameras
1. Updates the world's mesh matrices
1. Animates the particle systems
1. Executes the frame graph
1. Notifies `Scene.onAfterRenderObservable`

As you can see, only 3 observables are notified in this case.

### Use a frame graph in addition to the existing scene render loop

In some cases, you may want to keep the existing scene rendering loop and use frame graphs as a complement. This may be because some features are still missing in frame graphs (so using a frame graph instead of the render loop is not possible), or because you want to keep your existing code and only need the additional features provided by frame graphs.

In this mode, you do not assign a value to `Scene.frameGraph` and you simply execute a frame graph yourself by calling its `execute()` method. The texture(s) updated by the execution of the frame graph can be retrieved and reused in your own code, or the output of the execution can be directly generated on the screen.

This is the simplest mode to use, the use of one (or more!) frame graphs is just a new feature that you can exploit in your own code.

## Examples of frame graphs

By way of illustration, below are two examples of the two cases outlined above.