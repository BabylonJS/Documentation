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

By way of illustration, here are two examples of the two cases outlined above.

### The frame graph replacing the scene render loop

#### Using the frame graph classes directly

Start by creating the frame graph:
```javascript
const frameGraph = new BABYLON.FrameGraph(scene, true);

scene.frameGraph = frameGraph;
scene.cameraToUseForPointers = camera;
```
The second parameter of the `FrameGraph` constructor instructs the framework to create debugging textures for the textures created by the frame graph, which you can browse in the inspector. This can help debug / understand what's going on in your code!

Let's create a color and depth texture, which will be used to render the meshes:
```javascript
const colorTexture = frameGraph.textureManager.createRenderTargetTexture("color", {
    size: { width: 100, height: 100 },
    options: {
        createMipMaps: false,
        types: [BABYLON.Constants.TEXTURETYPE_UNSIGNED_BYTE],
        formats: [BABYLON.Constants.TEXTUREFORMAT_RGBA],
        samples: 4,
        useSRGBBuffers: [false],
        labels: ["color"],
    },
    sizeIsPercentage: true,
});

const depthTexture = frameGraph.textureManager.createRenderTargetTexture("depth", {
    size: { width: 100, height: 100 },
    options: {
        createMipMaps: false,
        types: [BABYLON.Constants.TEXTURETYPE_UNSIGNED_BYTE],
        formats: [BABYLON.Constants.TEXTUREFORMAT_DEPTH32_FLOAT],
        samples: 4,
        useSRGBBuffers: [false],
        labels: ["depth"],
    },
    sizeIsPercentage: true,
});
```
It's pretty straightforward code.

You can see that we create the textures through the `frameGraph.textureManager` object. It is important to create the textures used by the frame graph in this way and not by doing `new RenderTargetTexture(...)` or `engine.createRenderTargetTexture(...)` because the textures used by a frame graph are managed in a specific way.

This is why `frameGraph.textureManager.createRenderTargetTexture` returns a texture handle (a number) and not a real texture object: most of the frame graph framework methods that deal with textures use texture handles!

Note that you can import an existing texture into a frame graph by calling `frameGraph.textureManager.importTexture()`, and this method will return a texture handle that you can use as input for frame graph tasks. There is also the inverse method `frameGraph.textureManager.getTextureFromHandle()` which allows you to obtain the real texture object from a texture handle (useful when you use a frame graph at the same time as the scene render loop - see the following section for more information).

An important property of the object passed to the `createRenderTargetTexture` method is `sizeIsPercentage`: if it is `true`, it means that the size values are percentages instead of fixed pixel sizes. These percentages are related to the size of the output screen. If you set `width=height=100`, this means that the texture will be created with the same size as the output screen. If you set these values to `50`, the texture will be created with half the size of the screen. Most of the time, you will want to set `sizeIsPercentage=true` to keep your frame graph independent of the output size.

We will now create a task that clears the textures:
```javascript
const clearTask = new BABYLON.FrameGraphClearTextureTask("clear", frameGraph);

clearTask.clearColor = true;
clearTask.clearDepth = true;
clearTask.destinationTexture = colorTexture;
clearTask.depthTexture = depthTexture;

frameGraph.addTask(clearTask);
```
This code creates a "clear" task, configures it and adds it to the frame graph.

The main task is the rendering of the meshes:
```javascript
const rlist = {
    meshes: scene.meshes,
    particleSystems: []
}

const renderTask = new BABYLON.FrameGraphObjectRendererTask("renderObjects", frameGraph, scene);

renderTask.destinationTexture = clearTask.outputTexture;
renderTask.depthTexture = clearTask.outputDepthTexture;
renderTask.objectList = rlist;
renderTask.camera = camera;

frameGraph.addTask(renderTask);
```
Once again, it's a fairly simple code. We create the appropriate task (`FrameGraphObjectRendererTask`), configure it and add it to the frame graph.
Notice how the previous task is linked to this task: the color/depth output texture of the “clear” task is defined as the destination/depth input texture of the “renderObjects” task.

The last task simply copies the texture to the output:
```javascript
const copyToBackbufferTask = new BABYLON.FrameGraphCopyToBackbufferColorTask("copytobackbuffer", frameGraph);

copyToBackbufferTask.sourceTexture = renderTask.outputTexture;

frameGraph.addTask(copyToBackbufferTask);
```
Once all the tasks have been added to the frame graph, you must build the graph by calling `FrameGraph.build()`. This ensures that everything is ready before the graph can be executed (among other things, it allocates the textures).

You can also call `await FrameGraph.whenReadyAsync()` to make sure that all the resources are ready and that the next call to `FrameGraph.execute()` (which is done automatically at the appropriate moment by the framework when `Scene.frameGraph` is defined) will render something and will not be delayed.

Finally, you must manage the resizing of the screen, so simply call `frameGraph.build()` when the engine resizes:
```javascript
engine.onResizeObservable.add(() => {
    frameGraph.build();
});

frameGraph.build();

await frameGraph.whenReadyAsync();
```

Here's the PG corresponding to this example: <Playground id="#9YU4C5#6" title="Frame Graph basic example" description="Basic frame graph example in replacement of the scene render loop (manual use of the frame graph classes)"/>

#### Using a node render graph

Let's do the same thing, but this time using a node render graph created with the [Node Render Graph Editor](https://nrge.babylonjs.com/).

Here is the node render graph: https://nrge.babylonjs.com/#CCDXLX
(this is the default graph you get when you browse to the NRGE url)

The javascript code:
```javascript
const nrg = await BABYLON.NodeRenderGraph.ParseFromSnippetAsync("#CCDXLX", scene);

nrg.build();

await nrg.whenReadyAsync();

scene.frameGraph = nrg.frameGraph;
```
That's all you need to make it work with a node render graph!

The full PG: <Playground id="#9YU4C5#7" title="Frame Graph basic example" description="Basic frame graph example in replacement of the scene render loop (node render graph)"/>

For more complicated examples, you may need to pass a third parameter to `NodeRenderGraph.ParseFromSnippetAsync()` to configure the node render graph:
```javascript
const nrg = await BABYLON.NodeRenderGraph.ParseFromSnippetAsync("#CCDXLX", scene, {
    debugTextures: false,
    autoConfigure: false,
    verbose: false,
    rebuildGraphOnEngineResize: true,
    autoFillExternalInputs: true,
});
```
The code snippet above shows you the default values of the various parameters.

`autoFillExternalInputs:true` will try to give reasonable values to certain input resources:
* `camera` resources will be set to `scene.cameras[0]` for the first camera resource, `scene.cameras[1]` for the second camera resource, and so on.
* `object list` resources will be set to `scene.meshes` and `scene.particleSystems`.
* `shadow light` resources will be set to the first shadow light of `scene.lights` for the first light resource, to the second shadow light of `scene.lights` for the second light resource, and so on.

### The frame graph in addition to the scene render loop

#### Using the frame graph classes directly

In this example, we will use a frame graph to apply a bloom + black and white post-processing to an existing scene.

We need the scene to be generated in texture, so we will create a “pass” post-process first:
```javascript
const passPostProcess = new BABYLON.PassPostProcess("pass", 1, camera);

passPostProcess.samples = 4;
passPostProcess.resize(engine.getRenderWidth(), engine.getRenderHeight(), camera);
```
We will need to access the texture of the pass post-process in the following lines, so we must ensure that this texture exists. By default, the texture will be created the first time the post-process is applied (therefore later in the rendering loop of the scene), which is why we call `resize()` ourselves, because this function will create the texture.

We now create the frame graph and import the post-process texture into it, so that we can apply the post-processes to it:
```javascript
const frameGraph = new BABYLON.FrameGraph(scene, true);

engine.onResizeObservable.add(() => {
    frameGraph.build();
});

const passPostProcessHandle = frameGraph.textureManager.importTexture("pass post-process", passPostProcess.inputTexture.texture);

passPostProcess.onSizeChangedObservable.add(() => {
    frameGraph.textureManager.importTexture("pass post-process", passPostProcess.inputTexture.texture, passPostProcessHandle);
});
```
Note that when the size of the post-process changes (due to a resizing of the window, for example), the texture will be recreated, and we will therefore have to re-import it into the frame graph. We can pass a texture handle to `importTexture` so that the texture passed as the first parameter replaces the texture associated with this handle. This way, we won't have to update the frame graph, the post-process pass texture always remains associated with `passPostProcessHandle`.

The next step is to create the bloom, black and white and copy to back buffer tasks, add them to the frame graph and build the graph:
```javascript
const bloomTask = new BABYLON.FrameGraphBloomTask("bloom", frameGraph, 0.5, 128, 0.1, false, 0.5);
bloomTask.sourceTexture = passPostProcessHandle;
frameGraph.addTask(bloomTask);

const bnwTask = new BABYLON.FrameGraphBlackAndWhiteTask("bnw", frameGraph);
bnwTask.sourceTexture = bloomTask.outputTexture;
frameGraph.addTask(bnwTask);

const copyToBackbufferTask = new BABYLON.FrameGraphCopyToBackbufferColorTask("copytobackbuffer", frameGraph);
copyToBackbufferTask.sourceTexture = bnwTask.outputTexture;
frameGraph.addTask(copyToBackbufferTask);

frameGraph.build();

await frameGraph.whenReadyAsync();
```
There is not much to say here, the code should be self-explanatory.

Finally, we need to execute the frame graph at each frame. As we use the regular rendering output of the scene, the best place is inside a `Scene.onAfterRenderObservable` observer:
```javascript
scene.onAfterRenderObservable.add(() => {
    frameGraph.execute();
});
```

The full PG: <Playground id="#RM56RY#12" title="Frame Graph basic example" description="Basic frame graph example in addition to the scene render loop (manual use of the frame graph classes)"/>

#### Using a node render graph

As before, let's do the same thing but using a node render graph.

Here is the node render graph: https://nrge.babylonjs.com/#FAPQIH#1

It is a very simple graph. We apply a bloom and then a black and white post-process to the input texture. Note that the source texture is defined as “External”, because it will be provided by external code:
![Graph](/img/frameGraph/external_graph_bloom_bnw.jpg)

The javascript code:
```javascript
const passPostProcess = new BABYLON.PassPostProcess("pass", 1, camera);

passPostProcess.samples = 4;
passPostProcess.resize(engine.getRenderWidth(), engine.getRenderHeight(), scene.activeCamera);

const nrg = await BABYLON.NodeRenderGraph.ParseFromSnippetAsync("#FAPQIH#1", scene, {
    rebuildGraphOnEngineResize: false
});

const frameGraph = nrg.frameGraph;

engine.onResizeObservable.add(() => {
    nrg.getBlockByName("Texture").value = passPostProcess.inputTexture.texture;
    nrg.build();
});

nrg.getBlockByName("Texture").value = passPostProcess.inputTexture.texture;
nrg.build();

await nrg.whenReadyAsync();

scene.onAfterRenderObservable.add(() => {
    frameGraph.execute();
});
```
As above, we create a "pass" post-process, so that the scene is rendered in a texture. This texture is set as the value of the block named “Texture”, which is our input texture in the graph.

Note that we have deactivated the automatic building of the graph when resizing the engine, because when the screen is resized, we must first update the texture of the “Texture” block before rebuilding the graph.

The rest of the code should be simple to understand.

The full PG: <Playground id="#RM56RY#14" title="Frame Graph basic example" description="Basic frame graph example in addition to the scene render loop (node render graph)"/>
