---
title: List of task classes in the frame graph framework
image:
description: Learn all about the tasks implemented in the Frame Graph system.
keywords: diving deeper, frame graph, rendering, task
---

This page describes all the tasks that are implemented in the framework and are available for your own use when creating frame graphs.

Note that most of these tasks are wrappers around existing processes in Babylon.js: whenever applicable, we will provide a link to the original documentation to avoid redundant explanations.

To illustrate the use of each task, two PGs are provided:
* one using frame graph classes
* the other using a node render graph

This way, you can choose what best suits your needs.

## Layer tasks

<H3Image title="FrameGraphGlowLayerTask" image="/img/frameGraph/task_glow.jpg" alt="Glow layer"/>

Provides the same functionalities as the [glow layer](/features/featuresDeepDive/mesh/glowLayer) class.

[Link to the class](/typedoc/classes/babylon.framegraphglowlayertask)

<Playground id="#GCG2Z7#3" title="Glow layer" description="Example of a frame graph using the glow layer task" isMain={true}/>
<Playground id="#GCG2Z7#2" title="Glow layer (NRG)" description="Example of a node render graph using the glow layer block" isMain={true}/>

Inputs:
* **targetTexture**. The target texture to apply the effect layer to. The effect will be blended with the contents of this texture.
* **objectRendererTask**. The object renderer task used to render the objects in the texture to which the layer will be applied. This is needed because the layer may have to inject code in the rendering manager used by object renderer task.
* **layerTexture** (optional). The layer texture to render the effect into. If not provided, a default texture will be created, based on **targetTexture** size, type and format.
Properties:
* **layer**. Let's you access the configuration of the glow layer itself.
<br/>
Outputs:
* **outputTexture**. The output texture of the task (same underlying texture as **targetTexture**, but the handle will be different).

<H3Image title="FrameGraphHighlightLayerTask" image="/img/frameGraph/task_highlight.jpg" alt="Highlight layer"/>

Provides the same functionalities as the [highlight layer](/features/featuresDeepDive/mesh/highlightLayer) class.

[Link to the class](/typedoc/classes/babylon.framegraphhighlightlayertask)

<Playground id="#PV8OLY#28" title="Highlight layer" description="Example of a frame graph using the highlight layer task" isMain={true}/>
<Playground id="#PV8OLY#29" title="Highlight layer (NRG)" description="Example of a node render graph using the highlight layer block" isMain={true}/>

Inputs:
* **targetTexture**. The target texture to apply the effect layer to. The effect will be blended with the contents of this texture.
* **objectRendererTask**. The object renderer task used to render the objects in the texture to which the layer will be applied. This is needed because the layer may have to inject code in the rendering manager used by object renderer task.
* **layerTexture** (optional). The layer texture to render the effect into. If not provided, a default texture will be created, based on **targetTexture** size, type and format.
Properties:
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

<Playground engine="webgpu" id="#KOBPUW#11" title="Compute shader task" description="Example of a frame graph using the compute shader task" isMain={true}/>
<Playground engine="webgpu" id="#KOBPUW#14" title="Compute shader task (NRG)" description="Example of a node render graph using the compute shader block" isMain={true}/>

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

<Playground id="#MJDYB1#6" title="Cull task" description="Example of a frame graph using the cull task" isMain={false}/>
<Playground id="#MJDYB1#8" title="Cull task (NRG)" description="Example of a node render graph using the cull block" isMain={false}/>

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

<Playground id="#SUEU9U#10" title="Execute task" description="Example of a frame graph using the execute task" isMain={true}/>
<Playground id="#SUEU9U#11" title="Execute task (NRG)" description="Example of a node render graph using the execute block" isMain={true}/>

Inputs:
* **func**. The function to execute when the task is enabled.
* **funcDisabled** (optional). The function to execute when the task is disabled. If not provided, **func** is also used when the task is disabled.
* **customIsReady** (optional). Custom readiness check.
<br/>
You can use this task for any custom process you want to run during the execution of the frame graph. In the PG example above, we use it to increment a counter each time the task is executed.

## Post-process tasks

Unless otherwise specified, all post-process tasks share certain common properties.

Inputs:
* **sourceTexture**. The source texture to apply the post process on. It's allowed to be `undefined` if the post process does not require a source texture. In that case, `targetTexture` must be provided.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **targetTexture** (optional). The target texture to render the post process to. If not supplied, a texture with the same configuration as the source texture will be created.
* **stencilState** (optional). The stencil state to use for the post process.
* **depthAttachmentTexture** (optional). The depth attachment texture to use for the post process. Note that a post-process task never writes to the depth buffer: attaching a depth texture is only useful if you want to test against the depth/stencil aspect or write to the stencil buffer.
* **depthReadOnly**. If *true*, the depth attachment will be read-only. This means that the post process will not write to the depth/stencil buffer. Setting **depthReadOnly** and **stencilReadOnly** to *true* is useful when you want to also be able to bind this same depth/stencil attachment to a shader. Note that it will only work in WebGPU, as WebGL does not support read-only depth/stencil attachments.
* **stencilReadOnly**. If *true*, the stencil attachment will be read-only. This means that the post process will not write to the stencil buffer. See above for further explanation.
* **disableColorWrite**. If *true*, color write will be disabled when applying the post process. This means that the post process will not write to the color buffer.
* **drawBackFace**. If *true*, the post process will be generated by a back face full-screen quad (CW order).
* **depthTest**. If depth testing should be enabled.
<br/>
Outputs:
* **outputTexture**. The output texture of the post process. Same texture than **targetTexture**, but with a different handle.
* **outputDepthAttachmentTexture**. The output depth attachment texture. This texture will point to the same texture than the **depthAttachmentTexture** property if it is set. Note, however, that the handle itself will be different!
<br/>
Since these properties are common to all post-process tasks, we will not repeat their description in the following sections.

In addition, all these tasks are wrappers around existing post-process classes. You should therefore refer to the documentation for these classes (for each task in the following sections, we provide a link to the corresponding post-process class) to find out which specific properties are available for each task: you can access these properties via **postProcessTask.postProcess**.

<H3Image title="FrameGraphAnaglyphTask" image="/img/frameGraph/task_anaglyph.jpg" alt="Anaglyph post-process"/>

Task which applies an anaglyph post-process.

[Link to the class](/typedoc/classes/babylon.framegraphanaglyphtask)

<Playground id="#SUEU9U#12" title="Anaglyph task" description="Example of a frame graph using the anaglyph task" isMain={false}/>
<Playground id="#SUEU9U#13" title="Anaglyph task (NRG)" description="Example of a node render graph using the anaglyph block" isMain={false}/>

Inputs:
* **leftTexture**. The texture to use as the left texture.

<H3Image title="FrameGraphBlackAndWhiteTask" image="/img/frameGraph/task_blackandwhite.jpg" alt="Black and white post-process"/>

Task which applies a black and white post-process.

[Link to the class](/typedoc/classes/babylon.framegraphblackandwhitetask)

<Playground id="#SUEU9U#14" title="Black and white task" description="Example of a frame graph using the black and white task" isMain={false}/>
<Playground id="#SUEU9U#15" title="Black and white task (NRG)" description="Example of a node render graph using the black and white block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinblackandwhitepostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphBloomTask" image="/img/frameGraph/task_bloom.jpg" alt="Bloom post-process"/>

Task which applies a bloom post-process.

[Link to the class](/typedoc/classes/babylon.framegraphbloomtask)

<Playground id="#SUEU9U#16" title="Bloom task" description="Example of a frame graph using the bloom task" isMain={false}/>
<Playground id="#SUEU9U#17" title="Bloom task (NRG)" description="Example of a node render graph using the bloom block" isMain={false}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **sourceTexture**. The source texture to apply the bloom effect on.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **targetTexture** (optional). The target texture to render the bloom effect to. If not supplied, a texture with the same configuration as the source texture will be created.
Properties:
* **hdr** (read only). Whether the bloom effect is HDR. When *true*, the bloom effect will use a higher precision texture format (half float or float). Else, it will use unsigned byte.
* [bloom](/typedoc/classes/babylon.thinbloomeffect). The properties of the post-process.
<br/>
Outputs:
* **outputTexture**. The output texture of the bloom effect.
<br/>
Note that you can set **weight**, **kernel**, **threshold**, and **hdr** at construction time (these are constructor parameters). You can change these values later via the **bloom** property, except for **hdr**, which is only a construction parameter.

<H3Image title="FrameGraphBlurTask" image="/img/frameGraph/task_blur.jpg" alt="Blur post-process"/>

Task which applies a blur post-process.

[Link to the class](/typedoc/classes/babylon.framegraphblurtask)

<Playground id="#SUEU9U#18" title="Blur task" description="Example of a frame graph using the blur task" isMain={false}/>
<Playground id="#SUEU9U#19" title="Blur task (NRG)" description="Example of a node render graph using the blur block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinblurpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphChromaticAberrationTask" image="/img/frameGraph/task_chromaticaberration.jpg" alt="Chromatic aberration post-process"/>

Task which applies a chromatic aberration post-process.

[Link to the class](/typedoc/classes/babylon.framegraphchromaticaberrationtask)

<Playground id="#SUEU9U#21" title="Chromatic aberration task" description="Example of a frame graph using the chromatic aberration task" isMain={false}/>
<Playground id="#SUEU9U#22" title="Chromatic aberration task (NRG)" description="Example of a node render graph using the chromatic aberration block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinchromaticaberrationpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphCircleOfConfusionTask" image="/img/frameGraph/task_circleofconfusion.jpg" alt="Circle of confusion post-process"/>

Task which applies a circle of confusion post-process.

[Link to the class](/typedoc/classes/babylon.framegraphcircleofconfusiontask)

<Playground id="#SUEU9U#25" title="Circle of confusion task" description="Example of a frame graph using the circle of confusion task" isMain={false}/>
<Playground id="#SUEU9U#24" title="Circle of confusion task (NRG)" description="Example of a node render graph using the circle of confusion block" isMain={false}/>

Inputs:
* **depthTexture**. The depth texture to use for the circle of confusion effect. It must store camera space depth (Z coordinate).
* **depthSamplingMode**. The sampling mode to use for the depth texture.
* **camera**. The camera to use for the circle of confusion effect.
Properties:
* [postProcess](/typedoc/classes/babylon.thincircleofconfusionpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphColorCorrectionTask" image="/img/frameGraph/task_colorcorrection.jpg" alt="Color correction post-process"/>

Task which applies a color correction post-process.

[Link to the class](/typedoc/classes/babylon.framegraphcolorcorrectiontask)

<Playground id="#SUEU9U#26" title="Color correction task" description="Example of a frame graph using the color correction task" isMain={false}/>
<Playground id="#SUEU9U#27" title="Color correction task (NRG)" description="Example of a node render graph using the color correction block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thincolorcorrectionpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphConvolutionTask" image="/img/frameGraph/task_convolution.jpg" alt="Convolution post-process"/>

Task which applies a convolution post-process.

[Link to the class](/typedoc/classes/babylon.framegraphconvolutiontask)

<Playground id="#SUEU9U#28" title="Convolution task" description="Example of a frame graph using the convolution task" isMain={false}/>
<Playground id="#SUEU9U#29" title="Convolution task (NRG)" description="Example of a node render graph using the convolution block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinconvolutionpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphCustomPostProcessTask" image="/img/frameGraph/task_custompostprocess.jpg" alt="Custom post-process"/>

Task which applies a custom post-process.

[Link to the class](/typedoc/classes/babylon.framegraphcustompostprocesstask)

<Playground id="#R33LVG#2" title="Custom task" description="Example of a frame graph using the custom task" isMain={true}/>

Inputs:
* **onApplyObservable**. Observable triggered when bind is called for the post process. Use this to set custom uniforms (see example playground).
<br/>

<H3Image title="FrameGraphDepthOfFieldTask" image="/img/frameGraph/task_depthoffield.jpg" alt="Depth of field post-process"/>

Task which applies a depth of field post-process.

[Link to the class](/typedoc/classes/babylon.framegraphdepthoffieldtask)

<Playground id="#SUEU9U#31" title="Depth of field task" description="Example of a frame graph using the depth of field task" isMain={true}/>
<Playground id="#SUEU9U#32" title="Depth of field task (NRG)" description="Example of a node render graph using the depth of field block" isMain={true}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **sourceTexture**. The source texture to apply the depth of field effect on.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **depthTexture**. The depth texture to use for the depth of field effect. Should store camera space depth (Z coordinate).
* **depthSamplingMode**. The sampling mode to use for the depth texture.
* **camera**. The camera used to render the scene.
* **targetTexture** (optional). The target texture to render the depth of field effect to. If not supplied, a texture with the same configuration as the source texture will be created.
Properties:
* **hdr** (read only). Whether the depth of field effect is applied on HDR textures. When true, the depth of field effect will use a higher precision texture format (half float or float). Else, it will use unsigned byte.
* [depthOfField](/typedoc/classes/babylon.thindepthoffieldeffect). The properties of the post-process.
<br/>
Outputs:
* **outputTexture**. The output texture of the depth of field effect.
<br/>
Note that **hdr** can only be set at construction time (it is a constructor parameter).

<H3Image title="FrameGraphExtractHighlightsTask" image="/img/frameGraph/task_extracthighlights.jpg" alt="Extract highlights post-process"/>

Task which applies a extract highlights post-process.

[Link to the class](/typedoc/classes/babylon.framegraphextracthighlightstask)

<Playground id="#SUEU9U#33" title="Extract highlights task" description="Example of a frame graph using the extract highlights task" isMain={false}/>
<Playground id="#SUEU9U#34" title="Extract highlights task (NRG)" description="Example of a node render graph using the extract highlights block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinextracthighlightspostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphFilterTask" image="/img/frameGraph/task_filter.jpg" alt="Filter post-process"/>

Task which applies a filter post-process.

[Link to the class](/typedoc/classes/babylon.framegraphfiltertask)

<Playground id="#SUEU9U#35" title="Filter task" description="Example of a frame graph using the filter task" isMain={false}/>
<Playground id="#SUEU9U#36" title="Filter task (NRG)" description="Example of a node render graph using the filter block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinfilterpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphFXAATask" image="/img/frameGraph/task_fxaa.jpg" alt="FXAA post-process"/>

Task which applies a FXAA post-process.

[Link to the class](/typedoc/classes/babylon.framegraphfxaatask)

<Playground id="#SUEU9U#37" title="FXAA task" description="Example of a frame graph using the FXAA task" isMain={false}/>
<Playground id="#SUEU9U#38" title="FXAA task (NRG)" description="Example of a node render graph using the FXAA block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinfxaapostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphGrainTask" image="/img/frameGraph/task_grain.jpg" alt="Grain post-process"/>

Task which applies a grain post-process.

[Link to the class](/typedoc/classes/babylon.framegraphgraintask)

<Playground id="#SUEU9U#39" title="Grain task" description="Example of a frame graph using the grain task" isMain={false}/>
<Playground id="#SUEU9U#40" title="Grain task (NRG)" description="Example of a node render graph using the grain block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thingrainpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphImageProcessingTask" image="/img/frameGraph/task_imageprocessing.jpg" alt="Image processing post-process"/>

Task which applies a image processing post-process.

[Link to the class](/typedoc/classes/babylon.framegraphimageprocessingtask)

<Playground id="#SUEU9U#45" title="Image processing task" description="Example of a frame graph using the image processing task" isMain={true}/>
<Playground id="#SUEU9U#46" title="Image processing task (NRG)" description="Example of a node render graph using the image processing block" isMain={true}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinimageprocessingpostprocess). The properties of the post-process.
<br/>
If you use this post-process, you will probably want to set **disableImageProcessing = true** on the object render that renders the texture to which the image processing is applied.
Alternatively, you can also set `FrameGraphImageProcessingTask.postProcess.fromLinearSpace = false` to indicate that the source texture is in gamma space.

<H3Image title="FrameGraphMotionBlurTask" image="/img/frameGraph/task_motionblur.jpg" alt="Motion blur post-process"/>

Task which applies a motion blur post-process.

[Link to the class](/typedoc/classes/babylon.framegraphmotionblurtask)

<Playground id="#YB006J#746" title="Motion blur task (screen based)" description="Example of a frame graph using the motion blur task (screen based)" isMain={false}/>
<Playground id="#YB006J#749" title="Motion blur task (object based)" description="Example of a frame graph using the motion blur task (object based)" isMain={true}/>
<Playground id="#YB006J#753" title="Motion blur task (NRG)" description="Example of a node render graph using the motion blur block" isMain={true}/>

Inputs:
* **velocityTexture** (optional). The velocity texture to use for the motion blur effect. Needed for object-based motion blur.
* **depthTexture** (optional). The (view) depth texture to use for the motion blur effect. Needed for screen-based motion blur.
Properties:
* [postProcess](/typedoc/classes/babylon.thinmotionblurpostprocess). The properties of the post-process.
<br/>
This task requires a geometry texture as input, which depends on the type of motion blur you want to use:
* for object-based motion blur, you need to connect a **geometry velocity** texture
* for screen-based motion blur, you need to connect a **geometry view depth** texture

If the appropriate texture is not connected according to the current motion blur type, you will get an error in the console log.

Both of these textures can be generated by the [FrameGraphGeometryRendererTask](#framegraphgeometryrenderertask) task (see below).

<H3Image title="FrameGraphScreenSpaceCurvatureTask" image="/img/frameGraph/task_screenspacecurvature.jpg" alt="Screen space curvature post-process"/>

Task which applies a screen space curvature post-process.

[Link to the class](/typedoc/classes/babylon.framegraphscreenspacecurvaturetask)

<Playground id="#SUEU9U#47" title="Screen space curvature task" description="Example of a frame graph using the screen space curvature task" isMain={false}/>
<Playground id="#SUEU9U#48" title="Screen space curvature task (NRG)" description="Example of a node render graph using the screen space curvature block" isMain={false}/>

Inputs:
* **normalTexture**. The normal texture to use for the screen space curvature effect. It must store normals in camera view space.
Properties:
* [postProcess](/typedoc/classes/babylon.thinscreenspacecurvaturepostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphSharpenTask" image="/img/frameGraph/task_sharpen.jpg" alt="Sharpen post-process"/>

Task which applies a sharpen post-process.

[Link to the class](/typedoc/classes/babylon.framegraphsharpentask)

<Playground id="#SUEU9U#49" title="Sharpen task" description="Example of a frame graph using the sharpen task" isMain={false}/>
<Playground id="#SUEU9U#50" title="Sharpen task (NRG)" description="Example of a node render graph using the sharpen block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinsharpenpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphSSAO2RenderingPipelineTask" image="/img/frameGraph/task_ssao2.jpg" alt="SSAO2 post-process"/>

Task which applies a SSAO2 post-process.

[Link to the class](/typedoc/classes/babylon.framegraphssao2renderingpipelinetask)

<Playground id="#SUEU9U#51" title="SSAO2 task" description="Example of a frame graph using the SSAO2 task" isMain={true}/>
<Playground id="#SUEU9U#52" title="SSAO2 task (NRG)" description="Example of a node render graph using the SSAO2 block" isMain={true}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **sourceTexture**. The source texture to apply the SSAO2 effect on.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **depthTexture**. The depth texture used by the SSAO2 effect (Z coordinate in camera view space).
* **normalTexture**. The normal texture used by the SSAO2 effect (normal vector in camera view space).
* **camera**. The camera used to render the scene.
* **targetTexture** (optional). The target texture to render the SSAO2 effect to. If not supplied, a texture with the same configuration as the source texture will be created.
Properties:
* **ratioSSAO** (read only). The ratio between the SSAO texture size and the source texture size.
* **ratioBlur** (read only). The ratio between the SSAO blur texture size and the source texture size.
* **textureType** (read only). The texture type used by the different post processes created by SSAO2. It's a read-only property. If you want to change it, you must recreate the task and pass the appropriate texture type to the constructor.
* [ssao](/typedoc/classes/babylon.thinssao2renderingpipeline). The properties of the post-process.
<br/>
Outputs:
* **outputTexture**. The output texture of the ssao effect.
<br/>
Note that you can set **ratioSSAO**, **ratioBlur** and **textureType** only at construction time (these are constructor parameters).

<H3Image title="FrameGraphSSRRenderingPipelineTask" image="/img/frameGraph/task_ssr.jpg" alt="SSR post-process"/>

Task which applies a SSR post-process.

[Link to the class](/typedoc/classes/babylon.framegraphssrrenderingpipelinetask)

<Playground id="#SUEU9U#54" title="SSR task" description="Example of a frame graph using the SSR task" isMain={true}/>
<Playground id="#PIZ1GK#2373" title="SSR task (NRG)" description="Example of a node render graph using the SSR block" isMain={true}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **sourceTexture**. The source texture to apply the SSR effect on.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **depthTexture**. The depth texture used by the SSR effect.
* **normalTexture**. The normal texture used by the SSR effect.
* **backDepthTexture** (optional). The back depth texture used by the SSR effect. This is used when automatic thickness computation is enabled. The back depth texture is the depth texture of the scene rendered for the back side of the objects (that is, front faces are culled).
* **reflectivityTexture**. The reflectivity texture used by the SSR effect.
* **camera**. The camera used to render the scene.
* **targetTexture** (optional). The target texture to render the SSR effect to. If not supplied, a texture with the same configuration as the source texture will be created.
Properties:
* **textureType** (read only). The texture type used by the different post processes created by SSR. It's a read-only property. If you want to change it, you must recreate the task and pass the appropriate texture type to the constructor.
* [ssr](/typedoc/classes/babylon.thinssrrenderingpipeline). The properties of the post-process.
<br/>
Outputs:
* **outputTexture**. The output texture of the ssao effect.
<br/>
Note that you can set **textureType** only at construction time (this is a constructor parameter).















### [FrameGraphTAATask](/typedoc/classes/babylon.framegraphtaatask)

![TAA post-process](/img/frameGraph/task_taa.jpg)

<Playground id="#MJDYB1#3" title="TAA task" description="Example of a frame graph using the tAA task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphTonemapTask](/typedoc/classes/babylon.framegraphtonemaptask)

![Tonemap post-process](/img/frameGraph/task_tonemap.jpg)

<Playground id="#MJDYB1#3" title="Tonemap task" description="Example of a frame graph using the tonemap task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


## Rendering tasks

### [FrameGraphCascadedShadowGeneratorTask](/typedoc/classes/babylon.framegraphcascadedshadowgeneratortask)

![Cascaded shadow generator](/img/frameGraph/task_csm.jpg)

<Playground id="#MJDYB1#3" title="CSM task" description="Example of a frame graph using the CSM task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphGeometryRendererTask](/typedoc/classes/babylon.framegraphgeometryrenderertask)

![Geometry renderer](/img/frameGraph/task_geometryrenderer.jpg)

<Playground id="#MJDYB1#3" title="Geometry renderer task" description="Example of a frame graph using the geometry renderer task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphObjectRendererTask](/typedoc/classes/babylon.framegraphobjectrenderertask)

![Object renderer](/img/frameGraph/task_objectrenderer.jpg)

<Playground id="#MJDYB1#3" title="Object renderer task" description="Example of a frame graph using the object renderer task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphShadowGeneratorTask](/typedoc/classes/babylon.framegraphshadowgeneratortask)

![Shadow generator](/img/frameGraph/task_shadowgenerator.jpg)

<Playground id="#MJDYB1#3" title="Shadow generator task" description="Example of a frame graph using the shadow generator task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphUtilityLayerRendererTask](/typedoc/classes/babylon.framegraphutilitylayerrenderertask)

![Utility layer renderer](/img/frameGraph/task_utilitylayerrenderer.jpg)

<Playground id="#MJDYB1#3" title="Utility layer renderer task" description="Example of a frame graph using the utility layer renderer task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


## Texture tasks

### [FrameGraphClearTextureTask](/typedoc/classes/babylon.framegraphcleartexturetask)

![Clear texture](/img/frameGraph/task_cleartexture.jpg)

<Playground id="#MJDYB1#3" title="Clear texture task" description="Example of a frame graph using the clear texture task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphCopyToBackbufferColorTask](/typedoc/classes/babylon.framegraphcopytobackbuffercolortask)

![Copy to backbuffer color](/img/frameGraph/task_copytobackbuffercolor.jpg)

<Playground id="#MJDYB1#3" title="Copy to backbuffer color task" description="Example of a frame graph using the copy to backbuffer color task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphCopyToTextureTask](/typedoc/classes/babylon.framegraphcopytotexturetask)

![Copy to texture](/img/frameGraph/task_copytotexture.jpg)

<Playground id="#MJDYB1#3" title="Copy to texture task" description="Example of a frame graph using the copy to texture task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>


### [FrameGraphGenerateMipMapsTask](/typedoc/classes/babylon.framegraphgeneratemipmapstask)

![Generate mipmaps](/img/frameGraph/task_generatemipmaps.jpg)

<Playground id="#MJDYB1#3" title="Generate mipmaps task" description="Example of a frame graph using the generate mipmaps task" isMain={false}/>

Task used to cull objects that are not visible.

Inputs:
<br/>
Outputs:
<br/>

