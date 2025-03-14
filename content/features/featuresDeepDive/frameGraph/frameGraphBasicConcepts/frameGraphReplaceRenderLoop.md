---
title: Frame Graph replacing the scene render loop
image:
description: Learn all about the Babylon.js Frame Graph system.
keywords: diving deeper, frame graph, rendering, node editor, getting started, basic concepts
---

## Using the frame graph classes directly

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
clearTask.targetTexture = colorTexture;
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

renderTask.targetTexture = clearTask.outputTexture;
renderTask.depthTexture = clearTask.outputDepthTexture;
renderTask.objectList = rlist;
renderTask.camera = camera;

frameGraph.addTask(renderTask);
```
Once again, it's a fairly simple code. We create the appropriate task (`FrameGraphObjectRendererTask`), configure it and add it to the frame graph.
Notice how the previous task is linked to this task: the color/depth output texture of the “clear” task is defined as the target/depth input texture of the “renderObjects” task.

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

Here's the PG corresponding to this example: <Playground id="#9YU4C5#9" title="Frame Graph basic example" description="Basic frame graph example in replacement of the scene render loop (manual use of the frame graph classes)"/>

## Using a node render graph

Let's do the same thing, but this time using a node render graph created with the [Node Render Graph Editor](https://nrge.babylonjs.com/).

Here is the node render graph: https://nrge.babylonjs.com/#CCDXLX#3
(this is the default graph you get when you browse to the NRGE url)

The javascript code:
```javascript
const nrg = await BABYLON.NodeRenderGraph.ParseFromSnippetAsync("#CCDXLX", scene);

nrg.build();

await nrg.whenReadyAsync();

scene.frameGraph = nrg.frameGraph;
```
That's all you need to make it work with a node render graph!

The full PG: <Playground id="#9YU4C5#11" title="Frame Graph basic example" description="Basic frame graph example in replacement of the scene render loop (node render graph)"/>

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
