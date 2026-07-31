---
title: How To Use A Post Process Render Pipeline
image: 
description: Learn how to use a post process render pipeline in Babylon.js.
keywords: diving deeper, post processes, post process, render pipeline, render
further-reading:
video-overview:
video-content:
---

# How to use PostProcessRenderPipeline
Post process render pipelines allow you to create a chain of post processes and attach it to a camera.
A render pipeline can be managed by enabling and disabling some effects and displaying a specific pass for debugging.


## Base Render Pipeline

![](/img/PPArchitecture.webp)

Render pipelines are composed of several classes.

| Class | Description |
|--------|--------|
|**`BABYLON.PostProcessRenderPipelineManager`**|Manages all pipelines and allows you to enable or disable an effect, or display a post-process pass for debugging.|
|**`BABYLON.PostProcessRenderPipeline`**|Set of effects that can be ordered.|
|**`BABYLON.PostProcessRenderEffect`**|A render effect contains one or more post processes.|
|**`BABYLON.PostProcess`**|A render pass that applies a shader.|

## Let's Work with a Render Pipeline

### Simple Pipeline
Create a pipeline:
```javascript
var standardPipeline = new BABYLON.PostProcessRenderPipeline(engine, "standardPipeline");
```

Create post processes. Note: the camera parameter is set to `null` when using a pipeline, and the post process will be enabled when the pipeline is added to the camera.
```javascript
var blackAndWhite = new BABYLON.BlackAndWhitePostProcess("bw", 1.0, null, null, engine, false);
var horizontalBlur = new BABYLON.BlurPostProcess("hb", new BABYLON.Vector2(1.0, 0), 20, 1.0, null, null, engine, false);
```

Create an effect with multiple post processes:
```javascript
var blackAndWhiteThenBlur = new BABYLON.PostProcessRenderEffect(engine, "blackAndWhiteThenBlur", function() { return [blackAndWhite, horizontalBlur] });
standardPipeline.addEffect(blackAndWhiteThenBlur);
```

Add the pipeline to the scene's manager and attach it to the camera:
```javascript
scene.postProcessRenderPipelineManager.addPipeline(standardPipeline);
scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("standardPipeline", camera);
```

<Playground id="#QCGFI6" title="Post Process Render Pipeline Example" description="Simple example of using a post process render pipeline."/>