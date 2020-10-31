# How to use PostProcessRenderPipeline
Post Process Renders pipelines allow you to create a chain of post processes and attach it to a camera.
A render pipeline can be managed by enabling and disabling some effects and displaying a specific pass for debugging.


# Base Render Pipeline

![](/img/PPArchitecture.png)

Renders Pipelines are composed of several classes.

| Class | Description |
|--------|--------|
|**`BABYLON.PostProcessRenderPipelineManager`**| Managing all pipelines, allow you to enable or disable an effect, displaying a pass of post process for debugging.|
|**`BABYLON.PostProcessRenderPipeline`**|Set of effects that can be ordered.|
|**`BABYLON.PostProcessRenderEffect`**|A render effect contains one or more post processes.|
|**`BABYLON.PostProcess`**|A render pass which will apply a shader.|

# Let's play with Render Pipeline

## Simple Pipeline
Create pipeline
```javascript
var standardPipeline = new BABYLON.PostProcessRenderPipeline(engine, "standardPipeline");
```

Create post processes. Note: Camera parameter is set to when using a pipeline and post process will be enabled when the pipeline is added to the camera.
```javascript
var blackAndWhite = new BABYLON.BlackAndWhitePostProcess("bw", 1.0, null, null, engine, false);
var horizontalBlur = new BABYLON.BlurPostProcess("hb", new BABYLON.Vector2(1.0, 0), 20, 1.0, null, null, engine, false);
```

Create an effect with multiple post processes
```javascript
var blackAndWhiteThenBlur = new BABYLON.PostProcessRenderEffect(engine, "blackAndWhiteThenBlur", function() { return [blackAndWhite, horizontalBlur] });
standardPipeline.addEffect(blackAndWhiteThenBlur);
```

Add pipeline to the scene's manager and attach to the camera
```javascript
scene.postProcessRenderPipelineManager.addPipeline(standardPipeline);
scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("standardPipeline", camera);
```

[Demo](https://www.babylonjs-playground.com/#QCGFI6)
