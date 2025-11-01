---
title: List of task classes in the frame graph framework
image:
description: Learn all about the tasks implemented in the Frame Graph system.
keywords: diving deeper, frame graph, rendering, task
---

This page describes all the tasks that are implemented in the framework and are available for your own use when creating frame graphs.

Note that most of these tasks are wrappers around existing processes in Babylon.js: whenever applicable, we will provide a link to the original documentation to avoid redundant explanations.

## Layer tasks

<H3Image title="FrameGraphGlowLayerTask" image="/img/frameGraph/task_glow.jpg" alt="Glow layer"/>

Provides the same functionalities as the [glow layer](/features/featuresDeepDive/mesh/glowLayer) class.

[Link to the class](/typedoc/classes/babylon.framegraphglowlayertask)

<Playground id="#GCG2Z7" title="Glow layer" description="Example of a frame graph using the glow layer task" isMain={true}/>

Inputs:
* **targetTexture**. The target texture to apply the effect layer to. The effect will be blended with the contents of this texture.
* **objectRendererTask**. The object renderer task used to render the objects in the texture to which the layer will be applied. This is needed because the layer may have to inject code in the rendering manager used by object renderer task.
* **layerTexture** (optional). The layer texture to render the effect into. If not provided, a default texture will be created, based on **targetTexture** size, type and format.
* **layer**. Let's you access the configuration of the glow layer itself.
<br/>
Outputs:
* **outputTexture**. The output texture of the task (same underlying texture as **targetTexture**, but the handle will be different).

<H3Image title="FrameGraphHighlightLayerTask" image="/img/frameGraph/task_highlight.jpg" alt="Highlight layer"/>

Provides the same functionalities as the [highlight layer](/features/featuresDeepDive/mesh/highlightLayer) class.

[Link to the class](/typedoc/classes/babylon.framegraphhighlightlayertask)

<Playground id="#PV8OLY#26" title="Highlight layer" description="Example of a frame graph using the highlight layer task" isMain={true}/>

Inputs:
* **targetTexture**. The target texture to apply the effect layer to. The effect will be blended with the contents of this texture.
* **objectRendererTask**. The object renderer task used to render the objects in the texture to which the layer will be applied. This is needed because the layer may have to inject code in the rendering manager used by object renderer task.
* **layerTexture** (optional). The layer texture to render the effect into. If not provided, a default texture will be created, based on **targetTexture** size, type and format.
* **layer**. Let's you access the configuration of the glow layer itself.
<br/>
Outputs:
* **outputTexture**. The output texture of the task (same underlying texture as **targetTexture**, but the handle will be different).
<br/>
Note that the **objectRendererTask** you define for the corresponding property must use a depth texture with a stencil aspect. An exception will be thrown if this is not the case.

## Miscellaneous tasks

<H3Image title="FrameGraphComputeShaderTask" image="/img/frameGraph/task_computeshader.jpg" alt="Compute shader"/>

Task used to execute a compute shader (WebGPU only).

[Link to the class](/typedoc/classes/babylon.framegraphcomputeshadertask)

<Playground engine="webgpu" id="#KOBPUW#9" title="Compute shader task" description="Example of a frame graph using the compute shader task" isMain={true}/>

Inputs:
* **dispatchSize**. Defines the dispatch size for the compute shader.
* **indirectDispatch** (optional). Defines an indirect dispatch buffer and offset. If set, this will be used instead of the **dispatchSize** property and an indirect dispatch will be performed.
* **execute** (optional). An optional execute function that will be called at the beginning of the task execution.
<br/>
You can use the **execute** function to apply additional settings (uniform parameters, textures, etc.) before executing the compute shader: see the example above.

The compute shader created by the class is accessible via the **computeShader** getter. For ease of use, all methods of the original [ComputeShader](/typedoc/classes/babylon.computeshader) class (such as `setTexture`, `setInternalTexture`, etc.) are available directly in the `FrameGraphComputeShaderTask` class.

You can create uniform buffers directly via the `FrameGraphComputeShaderTask` class by calling the `createUniformBuffer(name, description, autoUpdate)` method. The advantage over creating the buffer by calling `new UniformBuffer()` is that, by default (see the **autoUpdate** parameter in `createUniformBuffer`), the `UniformBuffer.update()` method will be called automatically before the compute shader is run. Also, the buffer will be automatically disposed when the task is disposed.

<H3Image title="FrameGraphCullObjectsTask" image="/img/frameGraph/task_cull.jpg" alt="Cull meshes"/>

Task used to cull objects that are not visible.

[Link to the class](/typedoc/classes/babylon.framegraphcullobjectstask)

<Playground id="#MJDYB1#3" title="Cull task" description="Example of a frame graph using the cull task" isMain={false}/>

Inputs:
* **objectList**. The object list to cull.
* **camera**. The camera to use for culling.
<br/>
Outputs:
* **outputObjectList**. The output object list containing the culled objects.
<br/>
Notes:
* Only meshes are culled, not particle systems
* If meshes are frozen, culling is not performed and the last culling result before switching to frozen mode is reused
* If the task is disabled, the list of output objects (**outputObjectList**) is identical to the list of input objects (**objectList**).

<H3Image title="FrameGraphExecuteTask" image="/img/frameGraph/task_execute.jpg" alt="Execute task"/>

Task used to execute a custom function.

[Link to the class](/typedoc/classes/babylon.framegraphexecutetask)

<Playground id="#SUEU9U#4" title="Execute task" description="Example of a frame graph using the execute task" isMain={false}/>

Inputs:
* **func**. The function to execute when the task is enabled.
* **funcDisabled** (optional). The function to execute when the task is disabled. If not provided, **func** is also used when the task is disabled.
* **customIsReady** (optional). Custom readiness check.
<br/>
You can use this task for any custom process you want to run during the execution of the frame graph. In the PG example above, we use it to increment a counter each time the task is executed.

## Post-process tasks

### [FrameGraphAnaglyphTask](/typedoc/classes/babylon.framegraphanaglyphtask)

![Cull meshes](/img/frameGraph/task_anaglyph.jpg)

<Playground id="#MJDYB1#3" title="Anaglyph task" description="Example of a frame graph using the anaglyph task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphBlackAndWhiteTask](/typedoc/classes/babylon.framegraphblackandwhitetask)

![Cull meshes](/img/frameGraph/task_blackandwhite.jpg)

<Playground id="#MJDYB1#3" title="Black and white task" description="Example of a frame graph using the black and white task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphBloomTask](/typedoc/classes/babylon.framegraphbloomtask)

![Cull meshes](/img/frameGraph/task_bloom.jpg)

<Playground id="#MJDYB1#3" title="Bloom task" description="Example of a frame graph using the bloom task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphBlurTask](/typedoc/classes/babylon.framegraphblurtask)

![Cull meshes](/img/frameGraph/task_blur.jpg)

<Playground id="#MJDYB1#3" title="Blur task" description="Example of a frame graph using the blur task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphChromaticAberrationTask](/typedoc/classes/babylon.framegraphchromaticaberrationtask)

![Cull meshes](/img/frameGraph/task_chromaticaberration.jpg)

<Playground id="#MJDYB1#3" title="Chromatic aberration task" description="Example of a frame graph using the chromatic aberration task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphCircleOfConfusionTask](/typedoc/classes/babylon.framegraphcircleofconfusiontask)

![Cull meshes](/img/frameGraph/task_circleofconfusion.jpg)

<Playground id="#MJDYB1#3" title="Circle of confusion task" description="Example of a frame graph using the circle of confusion task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphColorCorrectionTask](/typedoc/classes/babylon.framegraphcolorcorrectiontask)

![Cull meshes](/img/frameGraph/task_colorcorrection.jpg)

<Playground id="#MJDYB1#3" title="Color correction task" description="Example of a frame graph using the color correction task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphConvolutionTask](/typedoc/classes/babylon.framegraphconvolutiontask)

![Cull meshes](/img/frameGraph/task_convolution.jpg)

<Playground id="#MJDYB1#3" title="Convolution task" description="Example of a frame graph using the convolution task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphCustomPostProcessTask](/typedoc/classes/babylon.framegraphcustompostprocesstask)

![Cull meshes](/img/frameGraph/task_custompostprocess.jpg)

<Playground id="#MJDYB1#3" title="Custom post-process task" description="Example of a frame graph using the custom post-process task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphDepthOfFieldTask](/typedoc/classes/babylon.framegraphdepthoffieldtask)

![Cull meshes](/img/frameGraph/task_depthoffield.jpg)

<Playground id="#MJDYB1#3" title="Depth of field task" description="Example of a frame graph using the depth of field task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphExtractHighlightsTask](/typedoc/classes/babylon.framegraphextracthighlightstask)

![Cull meshes](/img/frameGraph/task_extracthighlights.jpg)

<Playground id="#MJDYB1#3" title="Extract highlights task" description="Example of a frame graph using the extract highlights task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphFilterTask](/typedoc/classes/babylon.framegraphfiltertask)

![Cull meshes](/img/frameGraph/task_filter.jpg)

<Playground id="#MJDYB1#3" title="Filter task" description="Example of a frame graph using the filter task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphFXAATask](/typedoc/classes/babylon.framegraphfxaatask)

![Cull meshes](/img/frameGraph/task_fxaa.jpg)

<Playground id="#MJDYB1#3" title="FXAA task" description="Example of a frame graph using the FXAA task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphGrainTask](/typedoc/classes/babylon.framegraphgraintask)

![Cull meshes](/img/frameGraph/task_grain.jpg)

<Playground id="#MJDYB1#3" title="Grain task" description="Example of a frame graph using the grain task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphImageProcessingTask](/typedoc/classes/babylon.framegraphimageprocessingtask)

![Cull meshes](/img/frameGraph/task_imageprocessing.jpg)

<Playground id="#MJDYB1#3" title="Image processing task" description="Example of a frame graph using the image processing task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphMotionBlurTask](/typedoc/classes/babylon.framegraphmotionblurtask)

![Cull meshes](/img/frameGraph/task_motionblur.jpg)

<Playground id="#MJDYB1#3" title="Motion blur task" description="Example of a frame graph using the motion blur task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphPassTask](/typedoc/classes/babylon.framegraphpasstask) and [FrameGraphPassCubeTask](/typedoc/classes/babylon.framegraphpasscubetask)

![Cull meshes](/img/frameGraph/task_pass.jpg)

<Playground id="#MJDYB1#3" title="Pass task" description="Example of a frame graph using the pass task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphScreenSpaceCurvatureTask](/typedoc/classes/babylon.framegraphscreenspacecurvaturetask)

![Cull meshes](/img/frameGraph/task_screenspacecurvature.jpg)

<Playground id="#MJDYB1#3" title="Screen space curvature task" description="Example of a frame graph using the Screen space curvature task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphSharpenTask](/typedoc/classes/babylon.framegraphsharpentask)

![Cull meshes](/img/frameGraph/task_sharpen.jpg)

<Playground id="#MJDYB1#3" title="Sharpen task" description="Example of a frame graph using the sharpen task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphSSAO2RenderingPipelineTask](/typedoc/classes/babylon.framegraphssao2renderingpipelinetask)

![Cull meshes](/img/frameGraph/task_ssao2.jpg)

<Playground id="#MJDYB1#3" title="SSAO2 task" description="Example of a frame graph using the SSAO2 task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphSSRRenderingPipelineTask](/typedoc/classes/babylon.framegraphssrrenderingpipelinetask)

![Cull meshes](/img/frameGraph/task_ssr.jpg)

<Playground id="#MJDYB1#3" title="SSR task" description="Example of a frame graph using the ssr task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphTAATask](/typedoc/classes/babylon.framegraphtaatask)

![Cull meshes](/img/frameGraph/task_taa.jpg)

<Playground id="#MJDYB1#3" title="TAA task" description="Example of a frame graph using the tAA task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphTonemapTask](/typedoc/classes/babylon.framegraphtonemaptask)

![Cull meshes](/img/frameGraph/task_tonemap.jpg)

<Playground id="#MJDYB1#3" title="Tonemap task" description="Example of a frame graph using the tonemap task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


## Rendering tasks

### [FrameGraphCascadedShadowGeneratorTask](/typedoc/classes/babylon.framegraphcascadedshadowgeneratortask)

![Cull meshes](/img/frameGraph/task_csm.jpg)

<Playground id="#MJDYB1#3" title="CSM task" description="Example of a frame graph using the CSM task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphGeometryRendererTask](/typedoc/classes/babylon.framegraphgeometryrenderertask)

![Cull meshes](/img/frameGraph/task_geometryrenderer.jpg)

<Playground id="#MJDYB1#3" title="Geometry renderer task" description="Example of a frame graph using the geometry renderer task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphObjectRendererTask](/typedoc/classes/babylon.framegraphobjectrenderertask)

![Cull meshes](/img/frameGraph/task_objectrenderer.jpg)

<Playground id="#MJDYB1#3" title="Object renderer task" description="Example of a frame graph using the object renderer task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphShadowGeneratorTask](/typedoc/classes/babylon.framegraphshadowgeneratortask)

![Cull meshes](/img/frameGraph/task_shadowgenerator.jpg)

<Playground id="#MJDYB1#3" title="Shadow generator task" description="Example of a frame graph using the shadow generator task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphUtilityLayerRendererTask](/typedoc/classes/babylon.framegraphutilitylayerrenderertask)

![Cull meshes](/img/frameGraph/task_utilitylayerrenderer.jpg)

<Playground id="#MJDYB1#3" title="Utility layer renderer task" description="Example of a frame graph using the utility layer renderer task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


## Texture tasks

### [FrameGraphClearTextureTask](/typedoc/classes/babylon.framegraphcleartexturetask)

![Cull meshes](/img/frameGraph/task_cleartexture.jpg)

<Playground id="#MJDYB1#3" title="Clear texture task" description="Example of a frame graph using the clear texture task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphCopyToBackbufferColorTask](/typedoc/classes/babylon.framegraphcopytobackbuffercolortask)

![Cull meshes](/img/frameGraph/task_copytobackbuffercolor.jpg)

<Playground id="#MJDYB1#3" title="Copy to backbuffer color task" description="Example of a frame graph using the copy to backbuffer color task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphCopyToTextureTask](/typedoc/classes/babylon.framegraphcopytotexturetask)

![Cull meshes](/img/frameGraph/task_copytotexture.jpg)

<Playground id="#MJDYB1#3" title="Copy to texture task" description="Example of a frame graph using the copy to texture task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphGenerateMipMapsTask](/typedoc/classes/babylon.framegraphgeneratemipmapstask)

![Cull meshes](/img/frameGraph/task_generatemipmaps.jpg)

<Playground id="#MJDYB1#3" title="Generate mipmaps task" description="Example of a frame graph using the generate mipmaps task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>

