---
title: Frame Graph Frequently Asked Questions and Best Practices
image:
description: Frequently asked questions and best practices about frame graphs
keywords: diving deeper, frame graph, faq
---

## Best Practices

### Set scene.frameGraph before calling FrameGraph.buildAsync

If your frame graph is to be used at the scene level, you must set it before calling `FrameGraph.buildAsync()`, because `FrameGraph.whenReadyAsync()` (which, by default, is called as part of the execution of `buildAsync`) may require that **scene.frameGraph** be set for correct processing.

### Set isMainObjectRenderer on the appropriate object renderer

You should always have one and only one object renderer with its **isMainObjectRenderer** property set to *true*.

It will help to locate the main object renderer in the frame graph when multiple object renderers are used.

This is useful for the inspector to know which object renderer to use for additional rendering features like wireframe rendering or frustum light debugging.

It is also used to determine the main camera used by the frame graph: this is the camera used by the main object renderer.

### Set the texture sampling mode to the correct location

When writing your own post-processing task that extends `FrameGraphPostProcessTask`, you may need to set the sampling mode of a texture: don't do it via the `additionalBindings` parameter of the `FrameGraphPostProcessTask.record(skipCreationOfDisabledPasses, additionalExecute, additionalBindings)` method, but via the `additionalExecute` parameter instead!

It is tempting to do something like:

```typescript
const pass = super.record(
    skipCreationOfDisabledPasses,
    undefined,
    (context) => {
        context.setTextureSamplingMode(this.circleOfConfusionTexture, this.circleOfConfusionSamplingMode);
        context.bindTextureHandle(this._postProcessDrawWrapper.effect!, "circleOfConfusionSampler", this.circleOfConfusionTexture);
    }
);
```

but the correct way to do it is as follows:

```typescript
const pass = super.record(
    skipCreationOfDisabledPasses,
    (context) => {
        context.setTextureSamplingMode(this.circleOfConfusionTexture, this.circleOfConfusionSamplingMode);
    },
    (context) => {
        context.bindTextureHandle(this._postProcessDrawWrapper.effect!, "circleOfConfusionSampler", this.circleOfConfusionTexture);
    }
);
```

This is because `additionalBindings` is executed too late in the process, and setting the texture sampling mode at that point messes with the internal state of the engine (at least in WebGL).

### Ensure that your FrameGraphTask.record() implementation handles multiple calls

The `FrameGraphTask.record()` method can be called multiple times during the lifetime of your frame graph (if the graph is being rebuilt, for example due to a window resize). You must ensure that the objects created by your implementation of `record()` are properly deleted before being recreated by a new call (such as observers, for example).

### Avoid a texture copy if you are using at least one post-process in your graph.

If you use at least one post-process in your graph, you can avoid copying a texture by connecting the back buffer color texture to the **target** input of your last post-process.

Do:
![No texture copy](/img/frameGraph/copytexture_optim.jpg)

Don't:
![Texture copy](/img/frameGraph/copytexture_nooptim.jpg)

In fact, the `Output` block (or `FrameGraphCopyToBackbufferColorTask` if you create a graph manually) is optimized so that it does not copy the texture connected to its **texture** input if that texture is already the back buffer color texture.

Furthermore, the final post-processing does not need to allocate a new texture, as it will render directly into the color texture of the back buffer.

### Use NodeRenderGraph.onBeforeBuildObservable to update the graph before building it

Often, you will need to update one or more blocks of a node render graph before building it. The best place to do this is inside an `onBeforeBuildObservable` observer, as this observable is notified just before the graph is built.

This can help you better structure your code, instead of having all the code at the global level.

For example (taken from [This PG](https://playground.babylonjs.com/#1QCA2M#35)):

```typescript
nrg.onBeforeBuildObservable.add(() => {
    const customRenderingTask = nrg.getBlockByName("CustomRendering").task;

    customRenderingTask.objectRenderer.setMaterialForRendering(ground, groundMatForCustomRendering);

    const cameraBlock = nrg.getBlockByName("Camera");
    cameraBlock.value = camera;

    const camera2Block = nrg.getBlockByName("Camera2");
    camera2Block.value = camera2;

    const objectListBlock = nrg.getBlockByName("ObjectList");
    objectListBlock.value = { meshes: scene.meshes, particleSystems: [] };

    const objectList2Block = nrg.getBlockByName("ObjectList2");
    objectList2Block.value = { meshes: scene.meshes.slice(), particleSystems: scene.particleSystems };
});
```

## FAQ

### Why am I getting the error message "Trying to bind a null texture/sampler"?

You will get this error (in the browser console log) with WebGPU if you render to the default back buffer color texture and use at least one post-process.

This is because post-processing reads from the texture connected to its **source** input, which is impossible if the texture is the back buffer color texture (at least in WebGL, so also prohibited in WebGPU).

Reproduction: <NRGE id="#HVWCTE#1" title="Using the backbuffer color texture with a post-process" description="Error generated when using the backbuffer color texture with a post-process" isMain={false} category="NodeRenderGraph"/>

Note that in WebGL, you will not get any error messages, but the preview window will remain black.

### Why am I getting the error message "Uncaught (in promise) Error: FrameGraph._computeTextureLifespan: Texture handle "XX" not found in the texture manager."?

You probably forgot to add a task to the frame graph!

When you create a task programmatically (i.e., without using a node render graph), don't forget to add it to the frame graph:

```typescript
const renderTask = new BABYLON.FrameGraphObjectRendererTask("renderObjects", frameGraph, scene);

renderTask.targetTexture = clearTask.outputTexture;
renderTask.depthTexture = clearTask.outputDepthTexture;
renderTask.objectList = rlist;
renderTask.camera = camera;

frameGraph.addTask(renderTask); // <-- Don't forget!
```

### Why isn't my skybox showing up?

You must set **camera.ignoreCameraMaxZ** to *true* for skyboxes to work as expected with frame graphics. See the comment in [FrameGraph: adding a new task + several fixes](https://github.com/BabylonJS/Babylon.js/pull/17381) for more details.

Reproduction: <Playground id="#HBLXYO" title="Skybox not showing up" description="Frame graph with a skybox mesh not showing up" isMain={false}/>

Replace *false* with *true* on line 15 to fix the issue.

Note that the problem does not stem from the skybox itself, but from the **Mesh.ignoreCameraMaxZ** property when set to *true* (which is the case for the skybox).

### How to visualize textures generated by my frame graph?

For debugging purposes, it may be useful to be able to see all the textures generated by your frame graph in the inspector.

To enable this feature, pass *true* as the second parameter of the `FrameGraph` constructor:

```typescript
const frameGraph = new BABYLON.FrameGraph(scene, true);
```

With a node render graph, set the **debugTextures** option to *true* when loading the snippet:

```typescript
const nrg = await BABYLON.NodeRenderGraph.ParseFromSnippetAsync("PSA9PS#150", scene, { debugTextures: true });

or

const nrg = BABYLON.NodeRenderGraph.Parse(frameGraphJSONData, scene, { debugTextures: true });
await nrg.whenReadyAsync();
```

Note that due to texture reuse, it is possible that a texture may be used by multiple tasks!

For this reason, when debugging a frame graph, you can disable texture reuse by setting `frameGraph.optimizeTextureAllocation = false`.
