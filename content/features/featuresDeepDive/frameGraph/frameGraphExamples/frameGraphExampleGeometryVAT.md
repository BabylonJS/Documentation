---
title: Generating geometry textures for VAT
image:
description: Use a frame graph to render geometry texture(s) for VAT
keywords: diving deeper, frame graph, geometry, examples, vat,
---

## Introduction

VAT (Vertex Animation Texture) or BVA (Baked Vertex Animation) is a way to support a large number of animated meshes by pre-calculating the animations. For more information, see [Baked Texture Animations](/features/featuresDeepDive/animation/baked_texture_animations).

VAT is not supported by the [geometry buffer renderer](/typedoc/classes/babylon.geometrybufferrenderer). Therefore, if you use it to generate a normal map (or any other geometry texture) with VAT meshes, it will not work as expected.

For example: <Playground id="#VI0JUJ#3" title="VAT and geometry buffer renderer" description="VAT not working with the geometry buffer renderer" isMain={false}/>

You can see that the spiders are not animated in the normal texture (which is used as the emissive texture on the plane facing the camera).

Let's use a frame graph to make it work!

## Using a frame graph

We will use a frame graph to generate the normal texture, instead of using the geometry buffer renderer as in the previous example.
Note that the frame graph will not take control of the entire scene rendering loop: we will not set `scene.frameGraph` with our frame graph, but rather execute it manually.

The frame graph is actually very simple; we only need a geometry renderer task and to configure it to generate the normal texture.

First, we create the frame graph and the depth texture that will be used by the geometry renderer. We also clear the depth texture:
```javascript
const frameGraph = new BABYLON.FrameGraph(scene);

const depthTexture = frameGraph.textureManager.createRenderTargetTexture("depth", {
    size: { width: 100, height: 100 },
    sizeIsPercentage: true,
    options: {
        createMipMaps: false,
        types: [BABYLON.Constants.TEXTURETYPE_UNSIGNED_BYTE],
        formats: [BABYLON.Constants.TEXTUREFORMAT_DEPTH32_FLOAT],
        samples: 1,
        useSRGBBuffers: [false],
        labels: ["depth"],
    },
});

const clearTask = new BABYLON.FrameGraphClearTextureTask("clear", frameGraph);

clearTask.clearColor = false;
clearTask.clearDepth = true;
clearTask.depthTexture = depthTexture;

frameGraph.addTask(clearTask);
```
We can now create the geometry renderer task:
```javascript
const rlist = {
    meshes: [mesh],
    particleSystems: []
}

const geomRendererTask = new BABYLON.FrameGraphGeometryRendererTask("geomRenderer", frameGraph, scene);

geomRendererTask.depthTexture = clearTask.outputDepthTexture;
geomRendererTask.objectList = rlist;
geomRendererTask.camera = camera;
geomRendererTask.samples = 1;
geomRendererTask.textureDescriptions.push({
    type: BABYLON.Constants.PREPASS_NORMAL_TEXTURE_TYPE,
    textureFormat: BABYLON.Constants.TEXTUREFORMAT_RGBA,
    textureType: BABYLON.Constants.TEXTURETYPE_UNSIGNED_BYTE,
});

frameGraph.addTask(geomRendererTask);
```
Note how we configure the task to generate the normal texture: this is an entry we add to the `geomRendererTask.textureDescriptions` array of the task.

That's all it takes to create the graph. Now we need to retrieve the texture and set it as the emissive texture of the plane material:
```javascript
let texture = null;

frameGraph.onBuildObservable.add(() => {
    const geomTexture = frameGraph.textureManager.getTextureFromHandle(geomRendererTask.geometryViewNormalTexture);
    geomTexture.incrementReferences();

    texture?.dispose();
    texture = new BABYLON.Texture("", scene, {
        internalTexture: geomTexture
    });
    texture.name = "GeomRenderer normal";
    mat.emissiveTexture = texture;
});
```
The texture can only be retrieved after the frame graph has been built, so `frameGraph.onBuildObservable` is the appropriate place to add our code. The code itself retrieves the actual texture (an `InternalTexture` instance) from the texture handle. Note that we increment the number of references to the texture, because we wrap this internal texture in a `Texture` instance (an `InternalTexture` instance cannot be defined as `mat.emissiveTexture`) and the `Texture.dispose` method decrements the number of references.

All that remains is to write the code to build the frame graph and execute it:
```javascript
await frameGraph.buildAsync();

engine.onResizeObservable.add(async () => {
    await frameGraph.buildAsync();
});

scene.onBeforeRenderObservable.add(() => {
    frameGraph.execute();
});
```
The full PG: <Playground id="#CP2RN9#322" title="VAT and frame graph" description="VAT working when using a frame graph" isMain={false} image="/img/playgroundsAndNMEs/pg-VI0JUJ-3.png"/>

You can see that the spiders are now animated in the normal texture.

## Using a node render graph

For completeness, here is the same thing using a node render graph:

Node Render Graph: <NRGE id="#USAV67#5" title="VAT and frame graph (NRGE)" description="VAT working when using a frame graph (NRGE)" isMain={false}/>

PG: <Playground id="#CP2RN9#324" image="/img/playgroundsAndNMEs/pg-CP2RN9-324.png" title="VAT and frame graph (NRG)" description="VAT working when using a frame graph (NRG)" isMain={false} image="/img/playgroundsAndNMEs/pg-VI0JUJ-3.png"/>

Notes:
* We disable `autoFillExternalInputs` when loading the node's render graph, because the list of meshes used by the geometry renderer task must not contain the plane on which we display the geometry texture (otherwise, you will get an error such as “GL_INVALID_OPERATION: glDrawElements: feedback loop formed between the frame buffer and the active texture").
* We disable the `Output` block in the render graph to avoid copying the result of the graph execution to the default frame buffer, which is a waste of GPU resources as it will be overwritten by the actual rendering of the scene.

