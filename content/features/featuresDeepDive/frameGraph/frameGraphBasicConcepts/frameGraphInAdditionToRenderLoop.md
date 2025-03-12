---
title: Frame Graph in addition to the scene render loop
image:
description: Learn all about the Babylon.js Frame Graph system.
keywords: diving deeper, frame graph, rendering, node editor, getting started, basic concepts
---

## Using the frame graph classes directly

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

## Using a node render graph

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
