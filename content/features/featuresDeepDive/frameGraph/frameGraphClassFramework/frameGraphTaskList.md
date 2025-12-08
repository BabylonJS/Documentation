---
title: Frame Graph Task List
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

<Playground id="#GCG2Z7#5" image="/img/playgroundsAndNMEs/pg-GCG2Z7-3.png" title="Glow layer" description="Example of a frame graph using the glow layer task" isMain={true}/>
<Playground id="#GCG2Z7#6" image="/img/playgroundsAndNMEs/pg-GCG2Z7-2.png" title="Glow layer (NRG)" description="Example of a node render graph using the glow layer block" isMain={true}/>

Inputs:
* **targetTexture**. The target texture to apply the effect layer to. The effect will be blended with the contents of this texture.
* **objectRendererTask**. The object renderer task used to render the objects in the texture to which the layer will be applied. This is needed because the layer may have to inject code in the rendering manager used by object renderer task.
* **layerTexture** (optional). The layer texture to render the effect into. If not provided, a default texture will be created, based on **targetTexture** size, type and format.
<br/>

Properties:
* **layer**. Let's you access the configuration of the glow layer itself.
<br/>

Outputs:
* **outputTexture**. The output texture of the task (same underlying texture as **targetTexture**, but the handle will be different).

<H3Image title="FrameGraphHighlightLayerTask" image="/img/frameGraph/task_highlight.jpg" alt="Highlight layer"/>

Provides the same functionalities as the [highlight layer](/features/featuresDeepDive/mesh/highlightLayer) class.

[Link to the class](/typedoc/classes/babylon.framegraphhighlightlayertask)

<Playground id="#PV8OLY#35" image="/img/playgroundsAndNMEs/pg-PV8OLY-28.png" title="Highlight layer" description="Example of a frame graph using the highlight layer task" isMain={true}/>
<Playground id="#PV8OLY#36" image="/img/playgroundsAndNMEs/pg-PV8OLY-29.png" title="Highlight layer (NRG)" description="Example of a node render graph using the highlight layer block" isMain={true}/>

Inputs:
* **targetTexture**. The target texture to apply the effect layer to. The effect will be blended with the contents of this texture.
* **objectRendererTask**. The object renderer task used to render the objects in the texture to which the layer will be applied. This is needed because the layer may have to inject code in the rendering manager used by object renderer task.
* **layerTexture** (optional). The layer texture to render the effect into. If not provided, a default texture will be created, based on **targetTexture** size, type and format.
<br/>

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

<Playground engine="webgpu" id="#KOBPUW#18" image="/img/playgroundsAndNMEs/pg-KOBPUW-11.png" title="Compute shader task" description="Example of a frame graph using the compute shader task" isMain={true}/>
<Playground engine="webgpu" id="#KOBPUW#19" image="/img/playgroundsAndNMEs/pg-KOBPUW-14.png" title="Compute shader task (NRG)" description="Example of a node render graph using the compute shader block" isMain={true}/>

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

<Playground id="#MJDYB1#15" image="/img/playgroundsAndNMEs/pg-MJDYB1-6.png" title="Cull task" description="Example of a frame graph using the cull task" isMain={false}/>
<Playground id="#MJDYB1#16" image="/img/playgroundsAndNMEs/pg-MJDYB1-8.png" title="Cull task (NRG)" description="Example of a node render graph using the cull block" isMain={false}/>

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

<Playground id="#SUEU9U#110" image="/img/playgroundsAndNMEs/pg-SUEU9U-10.png" title="Execute task" description="Example of a frame graph using the execute task" isMain={true}/>
<Playground id="#SUEU9U#133" image="/img/playgroundsAndNMEs/pg-SUEU9U-11.png" title="Execute task (NRG)" description="Example of a node render graph using the execute block" isMain={true}/>

Inputs:
* **func**. The function to execute when the task is enabled.
* **funcDisabled** (optional). The function to execute when the task is disabled. If not provided, **func** is also used when the task is disabled.
* **customIsReady** (optional). Custom readiness check.
<br/>

You can use this task for any custom process you want to run during the execution of the frame graph. In the PG example above, we use it to increment a counter each time the task is executed.

<H3Image title="FrameGraphGUITask" image="/img/frameGraph/task_gui.jpg" alt="GUI"/>

Task that renders a GUI texture.

[Link to the class](/typedoc/classes/babylon.gui.framegraphguitask)

<Playground id="#SUEU9U#111" image="/img/playgroundsAndNMEs/pg-SUEU9U-77.png" title="GUI task" description="Example of a frame graph using the gui task" isMain={true}/>
<Playground id="#SUEU9U#134" image="/img/playgroundsAndNMEs/pg-SUEU9U-78.png" title="GUI task (NRG)" description="Example of a node render graph using the gui block" isMain={true}/>

Inputs:
* **targetTexture**. The target texture to render the GUI to.
<br/>

Properties:
* **gui**. Gets the underlying advanced dynamic texture.
<br/>

Outputs:
* **outputTexture**. The output texture of the task. This is the same texture as the target texture, but the handles are different!
<br/>

Note that you can provide an existing instance of `AdvancedDynamicTexture` at construction time (third parameter of the constructor), but you must ensure that the **useStandalone** property is set to *true*, as this is required for correct use in frame graphs!

<H3Image title="FrameGraphLightingVolumeTask" image="/img/frameGraph/task_lightingvolume.jpg" alt="Lighting volume"/>

Task used to create a lighting volume from a directional light's shadow generator.

[Link to the class](/typedoc/classes/babylon.framegraphlightingvolumetask)

<Playground engine="webgpu" id="#3VH0AC#13" title="Lighting volume task" description="Example of a frame graph using the lighting volume task" isMain={false}/>
<Playground engine="webgpu" id="#3VH0AC#15" image="/img/playgroundsAndNMEs/pg-3VH0AC-13.png" title="Lighting volume task (NRG)" description="Example of a node render graph using the lighting volume block" isMain={false}/>

Inputs:
* **shadowGenerator**. The shadow generator used to create the lighting volume.
<br/>

Properties:
* **lightingVolume**. The lighting volume created by this task.
<br/>

Outputs:
* **outputMeshLightingVolume**. The output object list containing the lighting volume mesh. You can get the mesh by doing  `outputMeshLightingVolume.meshes[0]`.
<br/>

This task is typically used in conjunction with [FrameGraphVolumetricLightingTask](#framegraphvolumetriclightingtask) to generate volumetric lighting for a directional light.

## Post-process tasks

Unless otherwise specified, all post-process tasks share certain common properties.

Inputs:
* **sourceTexture**. The source texture to apply the post process on. It's allowed to be `undefined` if the post process does not require a source texture. In that case, `targetTexture` must be provided.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **targetTexture** (optional). The target texture to render the post process to. If not supplied, a texture with the same configuration as the source texture will be created.
* **stencilState** (optional). The stencil state to use for the post process.
* **depthAttachmentTexture** (optional). The depth attachment texture to use for the post process. Note that a post-process task never writes to the depth buffer: attaching a depth texture is only useful if you want to test against the depth/stencil aspect or write to the stencil buffer.
<br/>

Properties:
* **depthReadOnly**. If *true*, the depth attachment will be read-only. This means that the post process will not write to the depth/stencil buffer. Setting **depthReadOnly** and **stencilReadOnly** to *true* is useful when you want to also be able to bind this same depth/stencil attachment to a shader. Note that it will only work in WebGPU, as WebGL does not support read-only depth/stencil attachments.
* **stencilReadOnly**. If *true*, the stencil attachment will be read-only. This means that the post process will not write to the stencil buffer. See above for further explanation.
* **disableColorWrite**. If *true*, color write will be disabled when applying the post process. This means that the post process will not write to the color buffer.
* **drawBackFace**. If *true*, the post process will be generated by a back face full-screen quad (CW order).
* **depthTest**. If depth testing should be enabled.
* **viewport** (optional). The viewport to use when applying the post process. If set to *null*, the currently active viewport is used. If *undefined* (default), the viewport is reset to a full screen viewport before applying the post process.
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

<Playground id="#SUEU9U#112" image="/img/playgroundsAndNMEs/pg-SUEU9U-12.png" title="Anaglyph task" description="Example of a frame graph using the anaglyph task" isMain={false}/>
<Playground id="#SUEU9U#135" image="/img/playgroundsAndNMEs/pg-SUEU9U-13.png" title="Anaglyph task (NRG)" description="Example of a node render graph using the anaglyph block" isMain={false}/>

Inputs:
* **leftTexture**. The texture to use as the left texture.

<H3Image title="FrameGraphBlackAndWhiteTask" image="/img/frameGraph/task_blackandwhite.jpg" alt="Black and white post-process"/>

Task which applies a black and white post-process.

[Link to the class](/typedoc/classes/babylon.framegraphblackandwhitetask)

<Playground id="#SUEU9U#113" image="/img/playgroundsAndNMEs/pg-SUEU9U-14.png" title="Black and white task" description="Example of a frame graph using the black and white task" isMain={false}/>
<Playground id="#SUEU9U#136" image="/img/playgroundsAndNMEs/pg-SUEU9U-15.png" title="Black and white task (NRG)" description="Example of a node render graph using the black and white block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinblackandwhitepostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphBloomTask" image="/img/frameGraph/task_bloom.jpg" alt="Bloom post-process"/>

Task which applies a bloom post-process.

[Link to the class](/typedoc/classes/babylon.framegraphbloomtask)

<Playground id="#SUEU9U#114" image="/img/playgroundsAndNMEs/pg-SUEU9U-16.png" title="Bloom task" description="Example of a frame graph using the bloom task" isMain={false}/>
<Playground id="#SUEU9U#137" image="/img/playgroundsAndNMEs/pg-SUEU9U-17.png" title="Bloom task (NRG)" description="Example of a node render graph using the bloom block" isMain={false}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **sourceTexture**. The source texture to apply the bloom effect on.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **targetTexture** (optional). The target texture to render the bloom effect to. If not supplied, a texture with the same configuration as the source texture will be created.
<br/>

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

<Playground id="#SUEU9U#115" image="/img/playgroundsAndNMEs/pg-SUEU9U-18.png" title="Blur task" description="Example of a frame graph using the blur task" isMain={false}/>
<Playground id="#SUEU9U#138" image="/img/playgroundsAndNMEs/pg-SUEU9U-19.png" title="Blur task (NRG)" description="Example of a node render graph using the blur block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinblurpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphChromaticAberrationTask" image="/img/frameGraph/task_chromaticaberration.jpg" alt="Chromatic aberration post-process"/>

Task which applies a chromatic aberration post-process.

[Link to the class](/typedoc/classes/babylon.framegraphchromaticaberrationtask)

<Playground id="#SUEU9U#116" image="/img/playgroundsAndNMEs/pg-SUEU9U-21.png" title="Chromatic aberration task" description="Example of a frame graph using the chromatic aberration task" isMain={false}/>
<Playground id="#SUEU9U#139" image="/img/playgroundsAndNMEs/pg-SUEU9U-22.png" title="Chromatic aberration task (NRG)" description="Example of a node render graph using the chromatic aberration block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinchromaticaberrationpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphCircleOfConfusionTask" image="/img/frameGraph/task_circleofconfusion.jpg" alt="Circle of confusion post-process"/>

Task which applies a circle of confusion post-process.

[Link to the class](/typedoc/classes/babylon.framegraphcircleofconfusiontask)

<Playground id="#SUEU9U#117" image="/img/playgroundsAndNMEs/pg-SUEU9U-25.png" title="Circle of confusion task" description="Example of a frame graph using the circle of confusion task" isMain={false}/>
<Playground id="#SUEU9U#154" image="/img/playgroundsAndNMEs/pg-SUEU9U-24.png" title="Circle of confusion task (NRG)" description="Example of a node render graph using the circle of confusion block" isMain={false}/>

Inputs:
* **depthTexture**. The depth texture to use for the circle of confusion effect. It must store camera space depth (Z coordinate).
* **depthSamplingMode**. The sampling mode to use for the depth texture.
* **camera**. The camera to use for the circle of confusion effect.
<br/>

Properties:
* [postProcess](/typedoc/classes/babylon.thincircleofconfusionpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphColorCorrectionTask" image="/img/frameGraph/task_colorcorrection.jpg" alt="Color correction post-process"/>

Task which applies a color correction post-process.

[Link to the class](/typedoc/classes/babylon.framegraphcolorcorrectiontask)

<Playground id="#SUEU9U#118" image="/img/playgroundsAndNMEs/pg-SUEU9U-26.png" title="Color correction task" description="Example of a frame graph using the color correction task" isMain={false}/>
<Playground id="#SUEU9U#141" image="/img/playgroundsAndNMEs/pg-SUEU9U-27.png" title="Color correction task (NRG)" description="Example of a node render graph using the color correction block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thincolorcorrectionpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphConvolutionTask" image="/img/frameGraph/task_convolution.jpg" alt="Convolution post-process"/>

Task which applies a convolution post-process.

[Link to the class](/typedoc/classes/babylon.framegraphconvolutiontask)

<Playground id="#SUEU9U#119" image="/img/playgroundsAndNMEs/pg-SUEU9U-28.png" title="Convolution task" description="Example of a frame graph using the convolution task" isMain={false}/>
<Playground id="#SUEU9U#142" image="/img/playgroundsAndNMEs/pg-SUEU9U-29.png" title="Convolution task (NRG)" description="Example of a node render graph using the convolution block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinconvolutionpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphCustomPostProcessTask" image="/img/frameGraph/task_custompostprocess.jpg" alt="Custom post-process"/>

Task which applies a custom post-process.

[Link to the class](/typedoc/classes/babylon.framegraphcustompostprocesstask)

<Playground id="#R33LVG#6" image="/img/playgroundsAndNMEs/pg-R33LVG-2.png" title="Custom task" description="Example of a frame graph using the custom task" isMain={true}/>

Inputs:
* **onApplyObservable**. Observable triggered when bind is called for the post process. Use this to set custom uniforms (see example playground).
<br/>

<H3Image title="FrameGraphDepthOfFieldTask" image="/img/frameGraph/task_depthoffield.jpg" alt="Depth of field post-process"/>

Task which applies a depth of field post-process.

[Link to the class](/typedoc/classes/babylon.framegraphdepthoffieldtask)

<Playground id="#SUEU9U#120" image="/img/playgroundsAndNMEs/pg-SUEU9U-31.png" title="Depth of field task" description="Example of a frame graph using the depth of field task" isMain={true}/>
<Playground id="#SUEU9U#155" image="/img/playgroundsAndNMEs/pg-SUEU9U-32.png" title="Depth of field task (NRG)" description="Example of a node render graph using the depth of field block" isMain={true}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **sourceTexture**. The source texture to apply the depth of field effect on.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **depthTexture**. The depth texture to use for the depth of field effect. Should store camera space depth (Z coordinate).
* **depthSamplingMode**. The sampling mode to use for the depth texture.
* **camera**. The camera used to render the scene.
* **targetTexture** (optional). The target texture to render the depth of field effect to. If not supplied, a texture with the same configuration as the source texture will be created.
<br/>

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

<Playground id="#SUEU9U#121" image="/img/playgroundsAndNMEs/pg-SUEU9U-33.png" title="Extract highlights task" description="Example of a frame graph using the extract highlights task" isMain={false}/>
<Playground id="#SUEU9U#144" image="/img/playgroundsAndNMEs/pg-SUEU9U-34.png" title="Extract highlights task (NRG)" description="Example of a node render graph using the extract highlights block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinextracthighlightspostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphFilterTask" image="/img/frameGraph/task_filter.jpg" alt="Filter post-process"/>

Task which applies a filter post-process.

[Link to the class](/typedoc/classes/babylon.framegraphfiltertask)

<Playground id="#SUEU9U#122" image="/img/playgroundsAndNMEs/pg-SUEU9U-35.png" title="Filter task" description="Example of a frame graph using the filter task" isMain={false}/>
<Playground id="#SUEU9U#145" image="/img/playgroundsAndNMEs/pg-SUEU9U-36.png" title="Filter task (NRG)" description="Example of a node render graph using the filter block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinfilterpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphFXAATask" image="/img/frameGraph/task_fxaa.jpg" alt="FXAA post-process"/>

Task which applies a FXAA post-process.

[Link to the class](/typedoc/classes/babylon.framegraphfxaatask)

<Playground id="#SUEU9U#123" image="/img/playgroundsAndNMEs/pg-SUEU9U-37.png" title="FXAA task" description="Example of a frame graph using the FXAA task" isMain={false}/>
<Playground id="#SUEU9U#146" image="/img/playgroundsAndNMEs/pg-SUEU9U-38.png" title="FXAA task (NRG)" description="Example of a node render graph using the FXAA block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinfxaapostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphGrainTask" image="/img/frameGraph/task_grain.jpg" alt="Grain post-process"/>

Task which applies a grain post-process.

[Link to the class](/typedoc/classes/babylon.framegraphgraintask)

<Playground id="#SUEU9U#124" image="/img/playgroundsAndNMEs/pg-SUEU9U-39.png" title="Grain task" description="Example of a frame graph using the grain task" isMain={false}/>
<Playground id="#SUEU9U#147" image="/img/playgroundsAndNMEs/pg-SUEU9U-40.png" title="Grain task (NRG)" description="Example of a node render graph using the grain block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thingrainpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphImageProcessingTask" image="/img/frameGraph/task_imageprocessing.jpg" alt="Image processing post-process"/>

Task which applies a image processing post-process.

[Link to the class](/typedoc/classes/babylon.framegraphimageprocessingtask)

<Playground id="#SUEU9U#125" image="/img/playgroundsAndNMEs/pg-SUEU9U-45.png" title="Image processing task" description="Example of a frame graph using the image processing task" isMain={true}/>
<Playground id="#SUEU9U#148" image="/img/playgroundsAndNMEs/pg-SUEU9U-46.png" title="Image processing task (NRG)" description="Example of a node render graph using the image processing block" isMain={true}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinimageprocessingpostprocess). The properties of the post-process.
<br/>

If you use this post-process, you will probably want to set **disableImageProcessing = true** on the object render that renders the texture to which the image processing is applied.
Alternatively, you can also set `FrameGraphImageProcessingTask.postProcess.fromLinearSpace = false` to indicate that the source texture is in gamma space.

<H3Image title="FrameGraphMotionBlurTask" image="/img/frameGraph/task_motionblur.jpg" alt="Motion blur post-process"/>

Task which applies a motion blur post-process.

[Link to the class](/typedoc/classes/babylon.framegraphmotionblurtask)

<Playground id="#YB006J#790" image="/img/playgroundsAndNMEs/pg-YB006J-746.png" title="Motion blur task (screen based)" description="Example of a frame graph using the motion blur task (screen based)" isMain={false}/>
<Playground id="#YB006J#791" image="/img/playgroundsAndNMEs/pg-YB006J-749.png" title="Motion blur task (object based)" description="Example of a frame graph using the motion blur task (object based)" isMain={true}/>
<Playground id="#YB006J#794" image="/img/playgroundsAndNMEs/pg-YB006J-753.png" title="Motion blur task (NRG)" description="Example of a node render graph using the motion blur block" isMain={true}/>

Inputs:
* **velocityTexture** (optional). The velocity texture to use for the motion blur effect. Needed for object-based motion blur.
* **depthTexture** (optional). The (view) depth texture to use for the motion blur effect. Needed for screen-based motion blur.
<br/>

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

<Playground id="#SUEU9U#126" image="/img/playgroundsAndNMEs/pg-SUEU9U-47.png" title="Screen space curvature task" description="Example of a frame graph using the screen space curvature task" isMain={false}/>
<Playground id="#SUEU9U#149" image="/img/playgroundsAndNMEs/pg-SUEU9U-48.png" title="Screen space curvature task (NRG)" description="Example of a node render graph using the screen space curvature block" isMain={false}/>

Inputs:
* **normalTexture**. The normal texture to use for the screen space curvature effect. It must store normals in camera view space.
<br/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinscreenspacecurvaturepostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphSharpenTask" image="/img/frameGraph/task_sharpen.jpg" alt="Sharpen post-process"/>

Task which applies a sharpen post-process.

[Link to the class](/typedoc/classes/babylon.framegraphsharpentask)

<Playground id="#SUEU9U#127" image="/img/playgroundsAndNMEs/pg-SUEU9U-49.png" title="Sharpen task" description="Example of a frame graph using the sharpen task" isMain={false}/>
<Playground id="#SUEU9U#150" image="/img/playgroundsAndNMEs/pg-SUEU9U-58.png" title="Sharpen task (NRG)" description="Example of a node render graph using the sharpen block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thinsharpenpostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphSSAO2RenderingPipelineTask" image="/img/frameGraph/task_ssao2.jpg" alt="SSAO2 post-process"/>

Task which applies a screen-space ambient occlusion post-process.

[Link to the class](/typedoc/classes/babylon.framegraphssao2renderingpipelinetask)

<Playground id="#SUEU9U#128" image="/img/playgroundsAndNMEs/pg-SUEU9U-51.png" title="SSAO2 task" description="Example of a frame graph using the SSAO2 task" isMain={true}/>
<Playground id="#SUEU9U#156" image="/img/playgroundsAndNMEs/pg-SUEU9U-52.png" title="SSAO2 task (NRG)" description="Example of a node render graph using the SSAO2 block" isMain={true}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **sourceTexture**. The source texture to apply the SSAO2 effect on.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **depthTexture**. The depth texture used by the SSAO2 effect (Z coordinate in camera view space).
* **normalTexture**. The normal texture used by the SSAO2 effect (normal vector in camera view space).
* **camera**. The camera used to render the scene.
* **targetTexture** (optional). The target texture to render the SSAO2 effect to. If not supplied, a texture with the same configuration as the source texture will be created.
<br/>

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

Task which applies a screen-space reflection post-process.

[Link to the class](/typedoc/classes/babylon.framegraphssrrenderingpipelinetask)

<Playground id="#SUEU9U#129" image="/img/playgroundsAndNMEs/pg-SUEU9U-54.png" title="SSR task" description="Example of a frame graph using the SSR task" isMain={true}/>
<Playground id="#PIZ1GK#2388" image="/img/playgroundsAndNMEs/pg-PIZ1GK-2373.png" title="SSR task (NRG)" description="Example of a node render graph using the SSR block" isMain={true}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **sourceTexture**. The source texture to apply the SSR effect on.
* **sourceSamplingMode**. The sampling mode to use for the source texture.
* **depthTexture**. The depth texture used by the SSR effect. Can be a view or screen space depth texture.
* **normalTexture**. The normal texture used by the SSR effect. Can be a view or world space normal texture.
* **backDepthTexture** (optional). The back depth texture used by the SSR effect. Can be a view or screen space depth texture. This is used when automatic thickness computation is enabled. The back depth texture is the depth texture of the scene rendered for the back side of the objects (that is, front faces are culled).
* **reflectivityTexture**. The reflectivity texture used by the SSR effect.
* **camera**. The camera used to render the scene.
* **targetTexture** (optional). The target texture to render the SSR effect to. If not supplied, a texture with the same configuration as the source texture will be created.
<br/>

Properties:
* **textureType** (read only). The texture type used by the different post processes created by SSR. It's a read-only property. If you want to change it, you must recreate the task and pass the appropriate texture type to the constructor.
* [ssr](/typedoc/classes/babylon.thinssrrenderingpipeline). The properties of the post-process.
<br/>

Outputs:
* **outputTexture**. The output texture of the ssr effect.
<br/>

Note that you can set **textureType** only at construction time (this is a constructor parameter).

If you programmatically change the blur strength value (the `FrameGraphSSRRenderingPipelineTask.ssr.blurDispersionStrength` property) from 0 to a non-zero value, or vice versa, you must call the `FrameGraph.build()` function again to rebuild the graph! This is because the frame graph task of the SSR rendering pipeline generates blur tasks when this parameter is non-zero, and does not generate them when it is zero (for performance reasons). This means that the rendering passes generated are not the same depending on this parameter, which is why you need to call `build()` again when you change it.

**backDepthTexture** is optional, and you should only connect a texture to this input if you set **FrameGraphSSRRenderingPipelineTask.ssr.enableAutomaticThicknessComputation = true**. Do not connect a texture if you do not use this option, otherwise you will be penalized in terms of performance for having generated the texture when it is not used by the SSR block. If you connect something to **backDepthTexture**, you must connect the same type of texture as the one you connect to **depthTexture**: a view or a screen space depth texture. You will get an error message in the console if you mix the types. Also, don't forget to set **reverseCulling = true** in the geometry renderer task that generates the back depth texture, as this texture must store the depth of the back faces!

Refer to [Screen Space Reflections (SSR) Rendering Pipeline](/features/featuresDeepDive/postProcesses/SSRRenderingPipeline) for more information on SSR and the parameters you can use to adjust the effect.

<H3Image title="FrameGraphTAATask" image="/img/frameGraph/task_taa.jpg" alt="TAA post-process"/>

Task which applies a temporal anti-aliasing post-process.

[Link to the class](/typedoc/classes/babylon.framegraphtaatask)

<Playground id="#OWGOUN#19" image="/img/playgroundsAndNMEs/pg-OWGOUN-15.png" title="TAA task" description="Example of a frame graph using the TAA task" isMain={true}/>

Inputs:
* **objectRendererTask**. The object renderer task used to render the scene objects.
* **velocityTexture**. The handle to the velocity texture. Only needed if **postProcess.reprojectHistory** is enabled. Note that you must use the linear velocity texture!
<br/>

Properties:
* [postProcess](/typedoc/classes/babylon.thintaapostprocess). The properties of the post-process.
<br/>

This task is slightly different from other post-process tasks, as the **source** input is mandatory and the **target** input is not (yet) used.
In addition, this task must instrument the rendering of objects, which is why you must connect a [FrameGraphObjectRendererTask](#framegraphobjectrenderertask) instance  to the **objectRendererTask** input.

If you are using the [reprojectHistory](/features/featuresDeepDive/postProcesses/TAARenderingPipeline#reproject-history) option, you must provide a **velocityTexture** texture. You can generate this texture using the [FrameGraphGeometryRendererTask](#framegraphgeometryrenderertask) task. Note that you should not connect anything to the **velocityTexture** input if you are not using the reprojection history option, otherwise you may get rendering artifacts (and affect performance).

In addition, when using TAA post-processing, you probably don't want to use MSAA for the color/depth texture. So set their samples to 1.

Refer to [Temporal Anti-Aliasing (TAA) Rendering Pipeline](/features/featuresDeepDive/postProcesses/TAARenderingPipeline) for more information on TAA and the parameters you can use to adjust the effect.

<H3Image title="FrameGraphTonemapTask" image="/img/frameGraph/task_tonemap.jpg" alt="Tonemap post-process"/>

Task which applies a tonemap post-process.

[Link to the class](/typedoc/classes/babylon.framegraphtonemaptask)

<Playground id="#SUEU9U#130" image="/img/playgroundsAndNMEs/pg-SUEU9U-55.png" title="Tonemap task" description="Example of a frame graph using the tonemap task" isMain={false}/>
<Playground id="#SUEU9U#152" image="/img/playgroundsAndNMEs/pg-SUEU9U-57.png" title="Tonemap task (NRG)" description="Example of a node render graph using the tonemap block" isMain={false}/>

Properties:
* [postProcess](/typedoc/classes/babylon.thintonemappostprocess). The properties of the post-process.
<br/>

<H3Image title="FrameGraphVolumetricLightingTask" image="/img/frameGraph/task_volumetriclighting.jpg" alt="Volumetric lighting post-process"/>

A frame graph task that performs volumetric lighting.

[Link to the class](/typedoc/classes/babylon.framegraphvolumetriclightingtask)

<Playground engine="webgpu" id="#WLGEJB#4" image="/img/playgroundsAndNMEs/pg-WLGEJB-3.png" title="Volumetric lighting task" description="Example of a frame graph using the volumetric lighting task" isMain={true}/>
<Playground engine="webgpu" id="#WLGEJB#7" image="/img/playgroundsAndNMEs/pg-WLGEJB-3.png" title="Volumetric lighting (NRG)" description="Example of a node render graph using the volumetric lighting block" isMain={true}/>

This post-process **doesn't share** the common properties of post-processes!

Inputs:
* **targetTexture**. The target texture to which the volumetric lighting will be applied.
* **sourceSamplingMode**. The sampling mode to use when blending the volumetric lighting texture with **targetTexture**.
* **depthTexture**. The depth texture used for volumetric lighting calculations. It must be the depth (attachment) texture used to generate **targetTexture**.
* **camera**. The camera used for volumetric lighting calculations.
* **lightingVolumeMesh**. The mesh representing the lighting volume. This is the mesh that will be rendered to create the volumetric lighting effect.
* **light**. The directional light used for volumetric lighting.
* **lightingVolumeTexture** (optional). The lighting volume texture (optional). If not provided, a new texture will be created, which the same size, format and type as **targetTexture**. This is the texture that will store the volumetric lighting information, before being blended to **targetTexture**.
<br/>

Properties:
* **phaseG**. The phase G parameter for the volumetric lighting effect (default: 0). This parameter controls the anisotropy of the scattering. A value of 0 means isotropic scattering, while a value of 1 means forward scattering and -1 means backward scattering.
* **extinction**. The extinction coefficient for the volumetric lighting effect (default: (0, 0, 0) - no extinction). This parameter controls how much light is absorbed and scattered as it travels through the medium. Will only have an effect if **enableExtinction** is set to true in the constructor!
* **lightPower**. The light power/color for the volumetric lighting effect (default: (1, 1, 1)). This parameter controls the intensity and color of the light used for volumetric lighting.
<br/>

Outputs:
* **outputTexture**. The output texture of the task. It will be the same as **targetTexture**.
<br/>

The **extinction** property will only work if **enableExtinction** is set to *true* in the constructor when creating the `FrameGraphVolumetricLightingTask` instance. If you don't plan to set extinction to something different than (0, 0, 0), you can disable this to save some performance.

## Rendering tasks

<H3Image title="FrameGraphObjectRendererTask" image="/img/frameGraph/task_objectrenderer.jpg" alt="Object renderer"/>

Task used to render objects to a texture.

[Link to the class](/typedoc/classes/babylon.framegraphobjectrenderertask)

<Playground id="#IG8NRC#88" image="/img/playgroundsAndNMEs/pg-IG8NRC-82.png" title="Object renderer task" description="Example of a frame graph using the object renderer task" isMain={true}/>
<Playground id="#IG8NRC#89" image="/img/playgroundsAndNMEs/pg-IG8NRC-81.png" title="Object renderer task (NRG)" description="Example of a node render graph using the object renderer block" isMain={true}/>

Inputs:
* **targetTexture**. The target texture where the objects will be rendered.
* **depthTexture** (optional). The depth attachment texture where the objects will be rendered.
* **shadowGenerators** (optional). The shadow generators used to render the objects.
* **camera**. Camera used to render the objects.
* **objectList**. The list of objects to render.
<br/>

Properties:
* **depthTest**. If depth testing should be enabled (default is true).
* **depthWrite**. If depth writing should be enabled (default is true).
* **disableShadows**. If shadows should be disabled (default is false).
* **disableImageProcessing**. If image processing should be disabled (default is false). *false* means that the default image processing configuration will be applied (the one from the scene).
* **isMainObjectRenderer**. Sets this property to *true* if this task is the main object renderer of the frame graph. It will help to locate the main object renderer in the frame graph when multiple object renderers are used. This is useful for the inspector to know which object renderer to use for additional rendering features like wireframe rendering or frustum light debugging. It is also used to determine the main camera used by the frame graph: this is the camera used by the main object renderer.
* **renderMeshes**. Defines if meshes should be rendered (default is true).
* **renderParticles**. Defines if particles should be rendered (default is true).
* **renderSprites**. Defines if sprites should be rendered (default is true).
* **forceLayerMaskCheck**. Forces checking the layerMask property even if a custom list of meshes is provided (ie. if renderList is not undefined). Default is true.
* **enableBoundingBoxRendering**. Enables the rendering of bounding boxes for meshes (still subject to `Mesh.showBoundingBox` or `scene.forceShowBoundingBoxes`). Default is true.
* **enableOutlineRendering**. Enables the rendering of outlines/overlays for meshes (still subject to `Mesh.renderOutline` / `Mesh.renderOverlay`). Default is true.
* **resolveMSAAColors**. If true, targetTexture will be resolved at the end of the render pass, if this/these texture(s) is/are MSAA (default: true).
* **resolveMSAADepth**. If true, **depthTexture** will be resolved at the end of the render pass, if this texture is provided and is MSAA (default: false).
* **objectRenderer**. The object renderer used to render the objects.
<br/>

Outputs:
* **outputTexture**. The output texture. This texture will point to the same texture than the **targetTexture** property. Note, however, that the handle itself will be different!
* **outputDepthTexture**. The output depth attachment texture. This texture will point to the same texture than the depthTexture property if it is set. Note, however, that the handle itself will be different!
<br/>

This is the main task used to render objects on a texture. You can consider it as the equivalent of [RenderTargetTexture](/typedoc/classes/babylon.rendertargettexture) when you want to create a render pass programmatically.

The **shadowGenerators** input is optional and can be used if you want to generate shadows at the same time as you render objects. This input expects an array of [FrameGraphShadowGeneratorTask](#framegraphshadowgeneratortask) instances. This way, you can generate shadows from multiple lights at once.

<H3Image title="FrameGraphGeometryRendererTask" image="/img/frameGraph/task_geometryrenderer.jpg" alt="Geometry renderer"/>

Task used to render geometry to a set of textures.

[Link to the class](/typedoc/classes/babylon.framegraphgeometryrenderertask)

<Playground id="#ARI9J5#6" image="/img/playgroundsAndNMEs/pg-ARI9J5-1.png" title="Geometry renderer task" description="Example of a frame graph using the geometry renderer task" isMain={true}/>
<Playground id="#SUEU9U#157" image="/img/playgroundsAndNMEs/pg-SUEU9U-74.png" title="Geometry renderer task (NRG)" description="Example of a node render graph using the geometry renderer block" isMain={true}/>

<br/><br/>

This class is a superset of [FrameGraphObjectRendererTask](#framegraphobjectrenderertask): it can render a scene (with some restrictions, see below) and generate geometry textures.
This means that all inputs, properties, and outputs described above are supported, as well as:<br/>

Properties:
* **size**. The size of the output textures (default is 100% of the back buffer texture size).
* **sizeIsPercentage**. Whether the size is a percentage of the back buffer size (default is true).
* **samples**. The number of samples to use for the output textures (default is 1).
* **reverseCulling**. Whether to reverse culling (default is false).
* **dontRenderWhenMaterialDepthWriteIsDisabled**. Indicates if a mesh shouldn't be rendered when its material has depth write disabled (default is true).
* **disableDepthPrePass**. Indicates whether the depth pre-pass is disabled (default is true). Materials that require depth pre-pass (`Material.needDepthPrePass == true`) don't work with the geometry renderer, that's why this setting is *true* by default. However, if the geometry renderer doesn't generate any geometry textures but only renders to the main target texture, then depth pre-pass can be enabled.
* **textureDescriptions**. The list of texture descriptions used by the geometry renderer task. Only geometry textures described in this array will be generated. See below for more information.
<br/>

Methods:
* `excludeSkinnedMeshFromVelocityTexture(skinnedMesh: AbstractMesh)`. Excludes the given skinned mesh from computing bones velocities. Computing bones velocities can have a cost. The cost can be saved by calling this function and by passing the skinned mesh to ignore.
* `removeExcludedSkinnedMeshFromVelocityTexture(skinnedMesh: AbstractMesh)`. Removes the given skinned mesh from the excluded meshes list.
<br/>

Outputs:
* **geometryViewDepthTexture**. The depth (in view space) output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryNormViewDepthTexture**. The normalized depth (in view space) output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions! The normalization is `(d - near) / (far - near)`, where **d** is the depth value in view space and **near** and **far** are the near and far planes of the camera.
* **geometryScreenDepthTexture**. The depth (in screen space) output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryViewNormalTexture**. The normal (in view space) output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryWorldNormalTexture**. The normal (in world space) output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryLocalPositionTexture**. The position (in local space) output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryWorldPositionTexture**. The position (in world space) output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryAlbedoTexture**. The albedo output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryReflectivityTexture**. The reflectivity output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryVelocityTexture**. The velocity output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
* **geometryLinearVelocityTexture**. The linear velocity output texture. Will point to a valid texture only if that texture has been requested in textureDescriptions!
<br/>

This task is primarily used to generate geometry textures, i.e. textures containing special data such as depths in view/screen space, normals in view/world space, reflectivity, etc. Here is a list of all outputs that this task can generate:
* **geometryViewDepthTexture**: depth in camera view space. This is the Z component of the vertex coordinate in the camera's view space and is a value between **near** and **far**, the camera's near and far clipping planes.
* **geometryNormViewDepthTexture**: normalized depth in camera view space. Identical to the value above, but with values between 0 and 1, calculated using the formula `normViewDepth = (viewDepth - near) / (far - near)`.
* **geometryScreenDepthTexture**: depth in screen space. This is the depth written to the depth buffer (`gl_FragCoord.z`) and is a value between 0 and 1.
* **geometryViewNormalTexture**: normal in camera view space. This is the normal to the vertex in camera view space. The vector is normalized before being written to the texture.
* **geometryWorldNormalTexture**: normal in world space. This is the normal at the vertex in world space. The vector is normalized before being written to the texture. It is also scaled and offset by 0.5 to generate components between 0 and 1.
* **geometryLocalPositionTexture**: position in local space. This is the position of the vertex in the object model space, i.e., before any camera or world transformations.
* **geometryWorldPositionTexture**: position in world space. This is the position of the vertex in world space.
* **geometryAlbedoTexture**: albedo color. This is the albedo/diffuse color of the vertex.
* **geometryReflectivityTexture**: reflectivity color. This is the reflectivity color of the vertex (used by SSR, for example).
* **geometryVelocityTexture**: velocity vector in screen space. See [Motion blur by object](https://john-chapman-graphics.blogspot.com/2013/01/per-object-motion-blur.html) for more details on what a velocity texture is. **geometryVelocityTexture** is a texture constructed with the optimization described in the “Format and precision” section to improve accuracy when using an unsigned byte texture type.
* **geometryLinearVelocityTexture**: linear velocity vector in screen space. It is identical to the one above, but without the optimization, so without the `pow()` call. The coordinates are multiplied by 0.5, so that they are between [-0.5, 0.5] instead of [-1, 1].
<br/>

However, this task can also render a scene, similar to how `FrameGraphObjectRendererTask` does. There are some limitations when geometry textures and the normal texture scene (**outputTexture** property) are generated by `FrameGraphGeometryRendererTask`:
* Sprites, particles, bounding boxes, and outline rendering are not supported by geometry textures, so you must disable these features. If you need to enable one or more of these features for the normal texture scene, you must use a separate `FrameGraphObjectRendererTask` instance to generate the texture instead of using a `FrameGraphGeometryRendererTask` instance to generate everything at once.
* You must set **disableDepthPrePass** to *false* if any of your materials use **needDepthPrePass**, in order to avoid artifacts/errors with geometry textures, but this means you may get artifacts in the normal texture scene. Again, if you need this to work, use a separate `FrameGraphObjectRendererTask` to generate the normal scene texture.
* You must use the same number of MSAA samples for all textures (**targetTexture**, **depthTexture**, and **FrameGraphObjectRendererTask.samples**). Using MSAA textures is more demanding in terms of performance. If you don't need MSAA for geometry textures, you can use the geometry renderer only for geometry textures and use a `FrameGraphObjectRendererTask` instance to generate the normal texture scene.
<br/>

**Important**: If you do not plan to use **outputTexture**, do not set anything in the **targetTexture** input property! If you connect something to **targetTexture**, the texture will be generated, even if it is not used via **outputTexture**.

<H3Image title="FrameGraphShadowGeneratorTask" image="/img/frameGraph/task_shadowgenerator.jpg" alt="Shadow generator"/>

Task used to generate shadows from a list of objects.

[Link to the class](/typedoc/classes/babylon.framegraphshadowgeneratortask)

[Link to the class (CSM)](/typedoc/classes/babylon.framegraphcascadedshadowgeneratortask)

<Playground id="#JWKDME#189" image="/img/playgroundsAndNMEs/pg-JWKDME-175.png" title="Shadow generator task" description="Example of a frame graph using the shadow generator task" isMain={true}/>
<Playground id="#JWKDME#190" image="/img/playgroundsAndNMEs/pg-JWKDME-174.png" title="Shadow generator task (NRG)" description="Example of a node render graph using the shadow generator block" isMain={true}/>
<Playground id="#JWKDME#191" image="/img/playgroundsAndNMEs/pg-JWKDME-176.png" title="Cascaded shadow generator task (NRG)" description="Example of a node render graph using the cascaded shadow generator block" isMain={true}/>

Inputs:
* **objectList**. The object list that generates shadows.
* **light**. The light to generate shadows from.
* **camera**. The camera used to generate the shadows.
<br/>

Inputs (specific to cascaded shadow maps):
* **depthTexture** (optional). The depth texture used by the **autoCalcDepthBounds** feature (optional if **autoCalcDepthBounds** is set to *false*). This texture is used to compute the min/max depth bounds of the scene to setup the cascaded shadow generator. The texture should contain either “view,” “normalized view,” or “screen” depth values - if possible, connect “normalized view,” or “screen” for best performance. **Warning**: Do not set a texture if you are not using the **autoCalcDepthBounds** feature, to avoid generating a depth texture that will not be used.
<br/>

Properties:
* **mapSize**. The size of the shadow map.
* **useFloat32TextureType**. If true, the shadow map will use a 32 bits float texture type (else, 16 bits float is used if supported).
* **useRedTextureFormat**. If true, the shadow map will use a red texture format (else, a RGBA format is used).
* **bias**. The bias to apply to the shadow map.
* **normalBias**. The normal bias to apply to the shadow map.
* **darkness**. The darkness of the shadows.
* **transparencyShadow**. Gets or sets the ability to have transparent shadows.
* **enableSoftTransparentShadow**. Enables or disables shadows with varying strength based on the transparency.
* **useOpacityTextureForTransparentShadow**. If this is true, use the opacity texture's alpha channel for transparent shadows instead of the diffuse one.
* **filter**. The filter to apply to the shadow map.
* **filteringQuality**. The filtering quality to apply to the filter.
* **shadowGenerator** (read only). The shadow generator.
<br/>

Properties (specific to cascaded shadow maps):
* **numCascades**. The number of cascades.
* **debug**. Indicates whether the shadow generator should display the cascades.
* **stabilizeCascades**. Indicates whether the shadow generator should stabilize the cascades.
* **lambda**. Lambda parameter of the shadow generator.
* **cascadeBlendPercentage**. Cascade blend percentage.
* **depthClamp**. Indicates whether the shadow generator should use depth clamping.
* **autoCalcDepthBounds**. Indicates whether the shadow generator should automatically calculate the depth bounds.
* **autoCalcDepthBoundsRefreshRate**. Defines the refresh rate of the min/max computation used when **autoCalcDepthBounds** is set to true. Use 0 to compute just once, 1 to compute on every frame, 2 to compute every two frames and so on...
* **shadowMaxZ**. Maximum shadow Z value. If 0, will use **camera.maxZ**.
<br/>

Outputs:
* **outputTexture**. The shadow map texture.
<br/>

Use this task when you want to generate shadows from a light. The light must be a “shadow light”, i.e. any light except area lights and hemispherical lights.

You may be surprised to see a **camera** input, because the scene is rendered from the point of view of the light to generate the shadow map, not from the point of view of a camera. This camera is necessary to:
* split the camera frustum when using a `FrameGraphCascadedShadowGeneratorTask` block
* calculate the LOD of the meshes. The LOD of the meshes is defined according to the distance from a camera, not from a light.
<br/>

Refer to [Shadows](/features/featuresDeepDive/lights/shadows) for general information about shadows, and [Cascaded Shadow Maps](/features/featuresDeepDive/lights/shadows_csm) for specific information about cascaded shadow maps.

<H3Image title="FrameGraphUtilityLayerRendererTask" image="/img/frameGraph/task_utilitylayerrenderer.jpg" alt="Utility layer renderer"/>

Task used to render an utility layer.

[Link to the class](/typedoc/classes/babylon.framegraphutilitylayerrenderertask)

<Playground id="#SUEU9U#131" image="/img/playgroundsAndNMEs/pg-SUEU9U-85.png" title="Utility layer renderer task" description="Example of a frame graph using the utility layer renderer task" isMain={true}/>
<Playground id="#SUEU9U#132" image="/img/playgroundsAndNMEs/pg-SUEU9U-84.png" title="Utility layer renderer task (NRG)" description="Example of a node render graph using the utility layer renderer block" isMain={true}/>

Inputs:
* **targetTexture**. The target texture of the task.
* **camera**. The camera used to render the utility layer.
<br/>

Properties:
* **layer**. The utility layer renderer.
<br/>

Outputs:
* **outputTexture**. The output texture of the task. This is the same texture as the target texture, but the handles are different!
<br/>

This class is a wrapper around [UtilityLayerRenderer](/typedoc/classes/babylon.utilitylayerrenderer) and allows you to use gizmos with frame graphs: see the PGs above for some examples.

## Texture tasks

### FrameGraphClearTextureTask

Task used to clear a texture.

[Link to the class](/typedoc/classes/babylon.framegraphcleartexturetask)

No specific example: the clear texture task is used in all the PG on this page!

Inputs:
* **targetTexture** (optional). The color texture to clear.
* **depthTexture** (optional). The depth attachment texture to clear.
<br/>

Properties:
* **color**. The color to clear the texture with.
* **clearColor**. If the color should be cleared.
* **convertColorToLinearSpace**. If the color should be converted to linear space (default: false).
* **clearDepth**. If the depth should be cleared.
* **clearStencil**. If the stencil should be cleared.
* **stencilValue**. The value to use to clear the stencil buffer (default: 0).
<br/>

Outputs:
* **outputTexture**. The output texture (same as **targetTexture**, but the handle will be different).
* **outputDepthTexture**. The output depth texture (same as **depthTexture**, but the handle will be different).
<br/>

The inputs **target** and **depth** are optional, but you must provide at least one of them (otherwise there is no reason to use a clear task!).

### FrameGraphCopyToBackbufferColorTask

Task which copies a texture to the backbuffer color texture (the screen).

[Link to the class](/typedoc/classes/babylon.framegraphcopytobackbuffercolortask)

No specific example: the copy to backbuffer color task is used in all the PG on this page!

Inputs:
* **sourceTexture**. The source texture to copy to the backbuffer color texture.
<br/>

### FrameGraphCopyToTextureTask

Task used to copy a texture to another texture.

[Link to the class](/typedoc/classes/babylon.framegraphcopytotexturetask)

Playground: see the PG for the [Geometry renderer task](#framegraphgeometryrenderertask)

Inputs:
* **sourceTexture**. The source texture to copy from.
* **targetTexture**. The target texture to copy to.
<br/>

Properties:
* **viewport** (optional). The viewport to use when doing the copy.If set to *null*, the currently active viewport is used. If *undefined* (default), the viewport is reset to a full screen viewport before performing the copy.
* **lodLevel**. The LOD level to copy from the source texture (default: 0).
<br/>

Outputs:
* **outputTexture**. The output texture (same as **targetTexture**, but the handle may be different).
<br/>

<H3Image title="FrameGraphGenerateMipMapsTask" image="/img/frameGraph/task_generatemipmaps.jpg" alt="Generate mipmaps"/>

Task which generates mipmaps for a texture.

[Link to the class](/typedoc/classes/babylon.framegraphgeneratemipmapstask)

<Playground id="#4QES4Q#4" image="/img/playgroundsAndNMEs/pg-4QES4Q-1.png" title="Generate mipmaps task" description="Example of a frame graph using the generate mipmaps task" isMain={true}/>
<Playground id="#4QES4Q#5" image="/img/playgroundsAndNMEs/pg-4QES4Q-2.png" title="Generate mipmaps task (NRG)" description="Example of a node render graph using the generate mipmaps block" isMain={true}/>

Inputs:
* **targetTexture**. The texture to generate mipmaps for.
<br/>

Outputs:
* **outputTexture**. The output texture (same as **targetTexture**, but the handle may be different).
<br/>

Note that in a frame graph, mipmaps are not generated automatically; you must use a `FrameGraphGenerateMipMapsTask` task to do so.
