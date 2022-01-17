---
title: WebGPU Internals - Overview
image: 
description: Learn how the WebGPU engine has been implemented in Babylon.js
keywords: babylon.js, WebGPU, engine, implementation
further-reading:
video-overview:
video-content:
---

Babylon.js has an abstraction layer that helps implement new types of engines. There are currently 4 types of engines: Null, Native, WebGPU and Engine (which implements WebGL as well as additional components like audio).

The first 3 extends `Engine` and `Engine` extends `ThinEngine`, which is a low level (graphic only) API for engines. Note that it is one of the mid-term goal to have all the engines extends directly `ThinEngine` (or a specific "thin" version) instead of `Engine` to better encapsulate the implementations.

Here's a chart with the main files/classes used to implement the **WebGPU** engine:

![WebGPU chart](/img/extensions/webgpu/classesChart.png!1366)

## Core classes
These are the core classes used in the WebGPU implementation.

### WebGPUEngine
This class is the main entry point for the WebGPU implementation. It extends `Engine` and implements all the API needed by the higher layers to work with WebGPU. Some parts of the implementation are dispatched in the `WebGPU/Extensions/` files in much the same way it is done for WebGL (in `Engines/Extensions/` for WebGL).
* we currently use the same GLSL shaders in **WebGPU** that we use in **WebGL**. Those shaders are converted to **SpirV** thanks to **GLSLlang** and **SpirV** is converted to **WGSL** by a port of `Tint` to **WASM** (**TintWASM**).
* we are using 3 command encoders: *upload*, *renderTarget* and *render*. *upload* is used when we need to upload data into textures, *renderTarget* is used to render into render targets and *render* is used for the main render pass (when rendering into the swap chain texture). They are pushed into the queue in this order: *upload* -> *render target* -> *render*. Note that the compute shader passes are also using the *renderTarget* encoder. Also, when generating the mipmaps of a render target we use the *renderTarget* encoder and not *upload* so that the mips generation is done after the rendering into the render target and not before (the commands of the *upload* encoder are pushed into the queue before the commands of the *renderTarget* encoder)
* the GPU timing (that can be seen in the *Inspector* under **Statistics / GPU Frame time**) is done using timestamp queries, but for the time being Chrome does not allow those queries by default: Chrome must be started with the `--disable-dawn-features=disallow_unsafe_apis` flag to make it work
* `_ubInvertY` and `_ubDontInvertY` are the two uniform buffers used to implement the rendering without the CSS `yScale(-1)` trick (and thus saving a copy at the end of each frame): see [this comment](https://github.com/BabylonJS/Babylon.js/pull/11616#issue-1077008145) for more information.
* when binding a `RenderTargetWrapper` (by a call to `bindFramebuffer()`), we don't create the render pass right away (this render pass is created in `_startRenderTargetRenderPass()`). It is because we will likely process a `clear()` call a short time after: we will create the render pass at that time, using the clear values passed to `clear()` to create the render pass. Doing so avoid creating a render pass when `bindFramebuffer()` is called, then closing it and recreating a new one when `clear()` is called (because the clearing is done at the same time the render pass is created by a `beginRenderPass` API call).

### WebGPUBufferManager
This class handles everything related to GPU buffers (creation, deletion, reading, writing).
* reading half float data is very slow because a conversion from half float to float must be done in the js code! To speed things up, a compute shader could be used instead
* if the row byte size is not aligned (meaning, not divisible by 256), there's an additional copying process in js to build the final buffer, making the whole process slow. A compute shader would help here too.
* when `releaseBuffer()` is called the buffer passed in is not released right away, because the buffer(s) used during the queue processing (meaning, when calling `device.queue.submit()`) must be valid. Instead, the buffer is pushed in a list that will be cleaned by a call to `destroyDeferredBuffers()` (**WebGPUEngine** calls this method at the end of a frame, after `device.queue.submit()` has been called).

### WebGPUTextureHelper
This class handles everything related to GPU textures (creation, deletion, reading, writing, generating mipmaps, etc).
* as for the GPU buffers, we use a deferred list to release the textures and wait to release them after the queue has been submitted.
* when creating a texture, we always set the `RenderAttachment | CopyDst` flags because we don't know in advance if `copyExternalImageToTexture()` will be used to update the texture (see the `updateTexture()` method) and this function requires that these flags be set
* the mipmap generation is done by issueing n render passes (*6 for a cube texture). It would probably be faster to use some optimized compute shaders instead. Also, see [Lower perf when generating mipmaps compared to webgl](https://bugs.chromium.org/p/dawn/issues/detail?id=587) for some discussions about mipmap generation perf

### WebGPUSnapshotRendering
This class implements the snapshot rendering optimization: see [Snapshot Rendering](/advanced_topics/webGPU/webGPUOptimization/webGPUSnapshotRendering) for more information about this optim.

It is creating a bundle for each of the render texture (either a render target texture or the swap chain texture) at recording time and replay this bundle for all subsequent frames.

Note that it is creating a bundle list instead of a single bundle because a number of APIs are not supported inside bundles (like `setViewport`, `setScissorRect`, etc): `WebGPUBundleList` is the class that manages a list of bundles interleaved with those API calls.

### WebGPUTintWASM
This class is a thin wrapper around the **TintWASM** bundle and is used to convert **SpirV** to **WGSL**.

### WebGPUOcclusionQuery
This class implements occlusion queries in WebGPU. It is a straightforward implementation which is using the `WebGPUQuerySet` helper class for the actual query stuff.

### WebGPUTimestampQuery
This class implements the GPU timing of a frame by writing a timestamp right at the beginning of the *upload* command encoder and as the last command of the *render* command encoder and by substracting the time measure of the two timestamps. 

As explained above, it currently only works in Chrome if it is launched with the `--disable-dawn-features=disallow_unsafe_apis` flag.


## Classes used for caching
To avoid recreating some objects each time they are needed and to save performance, a number of caches are used by the WebGPU implementation.

### WebGPUCacheBindGroup
This class implements a cache of GPU bind groups. See [Cache Bind Groups](/advanced_topics/webGPU/webGPUInternals/webGPUCacheBindGroup) for detailed explanations about the implementation.

### WebGPUCacheRenderPipeline
This class implements a cache of GPU render pipelines. See [Cache Render Pipelines](/advanced_topics/webGPU/webGPUInternals/webGPUCacheRenderPipeline) for detailed explanations about the implementation.

### WebGPUCacheSampler
This class implements a cache of GPU samplers. The cache is a simple map:
```typescript
export class WebGPUCacheSampler {

    private _samplers: { [hash: number]: GPUSampler } = {};
    ...
}
```
The hash value is computed from the sampler properties (sampling mode, comparison function, wrapping modes, etc).


## Specialization of low level classes
WebGPU has its own implementations for some of the low level classes used by the Babylon.js framework.

### WebGPURenderTargetWrapper
Specialization of `RenderTargetWrapper`. In WebGPU, we simply need an additional `_defaultAttachments: number[]` property which holds the attachment list at creation time (when `WebGPUEngine.createMultipleRenderTarget` has been called). It is the list which will be used if no explicit attachment list has been provided (by a call to `WebGPUEngine.bindAttachments`) when starting a new render target pass.

### WebGPUHardwareTexture
It is the specialization of `HardwareTextureWrapper` for WebGPU. This is the object held by `InternalTexture` in the `_hardwareTexture` property.

Note that this class holds some caches to improve performances:
* when generating mipmaps: `_mipmapGenRenderPassDescr` and `_mipmapGenBindGroup` properties
* when calling `WebGPUTextureHelper.invertYPreMultiplyAlpha`: `_copyInvertYTempTexture`, `_copyInvertYRenderPassDescr`, `_copyInvertYBindGroup` and `_copyInvertYBindGroupWithOfst` properties

Those properties hold pre-built WebGPU objects so that we don't have to recreate them each time the corresponding processing is called (mipmap generation / calls to `invertYPreMultiplyAlpha`) - we create them the first time the processing is called.

### WebGPUDepthCullingState
This is a specialization of `DepthCullingState`. This class overrides all the setter methods to call the corresponding `WebGPUCacheRenderPipeline` methods so that the depth/culling cache states are always up to date.

### WebGPUStencilStateComposer
This is a specialization of `StencilStateComposer`. As for `WebGPUDepthCullingState`, this class overrides all the setter methods to call the corresponding `WebGPUCacheRenderPipeline` methods so that the stencil cache states are always up to date.


## Shader/Pipeline classes
These are classes that deal with shaders and shader contexts. Note that **Pipeline** in this context has nothing to do with the WebGPU pipeline concept from the spec! Here it means the shader context.

### WebGPUShaderProcessor, WebGPUShaderProcessorGLSL, WebGPUShaderProcessorWGSL
`WebGPUShaderProcessor` is the base class used by both `WebGPUShaderProcessorGLSL` and `WebGPUShaderProcessorWGSL` and is used by the system to parse a shader: written in GLSL for `WebGPUShaderProcessorGLSL` and in WGSL for `WebGPUShaderProcessorWGSL`.

The main task of these classes is to collect the list of buffers, uniforms, attributes, textures and samplers and create the related WebGPU objects, like the bind group layout entries and the bind group entries. Those objects are stored in a `WebGPUShaderProcessingContext` instance. The shader code is also modified so that it complies with the syntax expected by **glsllang**.

These classes also create a description of a special uniform buffer called the **left over buffer** which contains all the uniform variables declared with the `uniform VarType VarName;` syntax in the shader (or `uniform VarName : VarType;` for WGSL shaders - see [Writing shaders in WGSL](/advanced_topics/webGPU/webGPUWGSL#special-syntax-used-in-wgsl-code)). Indeed, you can't declare uniforms outside of a uniform buffer in WebGPU, so the system creates one for you under the hood and handles it transparently.

To avoid an additional *copy texture with Y inversion* at the end of a frame, these classes inject some special code in all shaders. The parameters that are used by this code (`yFactor` and `textureOutputHeight`) are passed through a specific uniform buffer and is called **Internals** in the shader code. See [this comment](https://github.com/BabylonJS/Babylon.js/pull/11616#issue-1077008145) for more information.

### WebGPUShaderProcessingContext
This class holds all the data extracted/created when the shaders are parsed by `WebGPUShaderProcessorXXX`.

Note that we are using the `_SimplifiedKnownUBOs` definition of the known UBOs and not `_KnownUBOs` to save some `GPURenderPassEncoder.setBindGroup` calls: with `_SimplifiedKnownUBOs` we only use two bind groups, so issue only two calls. There's an optimization that could be made in the future where we would not issue the call for the scene UBO (the bind group 0) if the scene UBO is the same and its content did not change since the last call. However, the expected mode to use WebGPU in is the [non compatibility mode](/advanced_topics/webGPU/webGPUOptimization/webGPUNonCompatibilityMode) and in this mode the number of `setBindGroup` calls is not so relevant as we do them only one time at bundle creation time.

### WebGPUPipelineContext
This class is the main class used by the `Effect` class and gathers all the data related to the shaders the effect is built upon. The main properties are:
* **shaderProcessingContext**. The instance of `WebGPUShaderProcessingContext` used to parse the shaders
* **bindGroupLayouts**. The `GPUBindGroupLayout` object as built by the `WebGPUCacheRenderPipeline` class
* **stages**. The GPU vertex and fragment stage objects
* **uniformBuffer**. The left over `UniformBuffer` instance

Once again, `Pipeline` in `WebGPUPipelineContext` is not related to the WebGPU `Pipeline` concept and you should understand it more like `WebGPUShaderContext` (or `WebGPUEffectContext`).

### WebGPUComputePipelineContext
This class is the mirror of `WebGPUPipelineContext` but for compute shaders instead of the regular vertex/fragment shaders. It is used by the `ComputeEffect` class and gathers all the data related to the compute shader the effect is built upon (which are limited to the compute stage object (`GPUProgrammableStage`) and the compute pipeline object (`GPUComputePipeline`)).

## Context classes
Context classes are classes that bring some data from user land to the core and which are used at rendering time.

`WebGPUMaterialContext` and `WebGPUDrawContext` are passed to the core by the `Engine.enableEffect` call through the `DrawWrapper` parameter. The two classes primary goal is to keep track of the data used to create the bind groups (samplers, textures, uniform/storage buffers).

`WebGPUComputeContext` is directly passed to the `Engine.computeDispatch` method.

### WebGPUMaterialContext
This class keeps track of the list of textures and samplers used by a material.

Textures can either be internal or external textures. Internal textures are regular standard textures (`InternalTexture` class) whereas external textures (`ExternalTexture` class) are new in WebGPU and (for the time being) are only used for video textures. Due to how external textures are handled by WebGPU, no bind group cache can be used for them (because an external texture is only valid for the current frame, you must retrieve a new texture (and then recreate new bind groups) each frame by calling `device.importExternalTexture`): see the `WebGPUMaterialContext.forceBindGroupCreation` getter.

Also, we must know if there's at least one **32 bits float** texture (see `WebGPUMaterialContext.hasFloatTextures`) because for the time being WebGPU does not support filtering 32 bits float textures, meaning we must set some special values when creating the bind group layout entry for this texture: the sampler associated to the texture (if any) must be set to **non-filtering** and the sample type of the texture to **unfilterable-float**. See `WebGPUCacheRenderPipeline._createPipelineLayoutWithTextureStage`.

### WebGPUDrawContext
This class keeps track of the list of uniform/storage buffers used by a shader. The material uniform buffer could have been stored on `WebGPUMaterialContext` but to simplify the implementation we did not split the list, all buffers are handled by `WebGPUDrawContext`.

The class also holds two caches:
* **fastBundle**. It is the bundle used in the [non compatibility mode](/advanced_topics/webGPU/webGPUOptimization/webGPUNonCompatibilityMode)
* **bindGroups**. It is the cache of the bind groups. It is reused for the next draw if `WebGPUDrawContext.isDirty==false` (and `WebGPUMaterialContext.isDirty==false`). See [WebGPUCacheBindGroup](#optimization)

Lastly, the class manages a GPU buffer (`WebGPUDrawContext.indirectDrawBuffer`) that stores the parameters used in a (indirect) draw call when using instances in the non compatibility mode. Indeed, when in that mode, the draw call is embedded inside the bundle and if the number of instances to draw changes from one frame to another we would need to recreate the bundle to update the instance count parameter. As creating a bundle incurs some performance penalty, instead of doing a regular draw in the bundlle we issue an indirect draw call and we update the instance count in the GPU buffer.

#### Note on the WebGPUMaterialContext.updateId property
Modifying a texture in a material does work for all meshes that are using this material because when you update a texture property, all submeshes using this material are flagged as "texture dirty". That means that when `Material.isReadyForSubMesh` is run we will execute the code that calls `subMesh.setEffect(effect, defines, this._materialContext)` which resets the context (see the code of `DrawWrapper.setEffect`). So the bind groups will be regenerated with the new texture.

However, if we are not using a `Material` but directly updating a texture using `effect.setTexture(...)` (as the depth peeling renderer is doing to update `oitDepthSampler` and `oitFrontColorSampler` for eg), it won't work anymore as the context is not reset: nothing will trigger the recreation of the bind groups. We could call `_markAllSubMeshesAsTexturesDirty()` by hand on all submeshes but it's not performant because `Material.isReadyForSubMesh` will be called whereas we only want to bind some textures and don't need this method to be called. Also, it's a manual call so could be forgotten...

To fix the problem, we have added a `WebGPUMaterialContext.updateId` property which is updated each time a sampler/texture is changed in the material context. `WebGPUDrawContext` has also been updated with a `WebGPUDrawContext.materialContextUpdateId` property which corresponds to the associated `WebGPUMaterialContext.updateId` value when the bind groups have been generated (that you can find in `WebGPUMaterialContext.bindGroups`). When retrieving the bind groups from the `WebGPUMaterialContext.bindGroups` cache, if the two `updateId` values are different it means the material context has changed since the last time we generated the bind groups, so we must recreate them again.

### WebGPUComputeContext
This class is more ore less the mirror of `WebGPUDrawContext` but for compute shaders. Its task is to create the bind groups based on the resources used by the shader. The bind groups are cached until at least one resource is updated: it's the responsibility of the [ComputeShader](/typedoc/classes/babylon.computeshader) class to dirtify the bind groups when a resource changes.

## Helper classes
There are a number of helper classes used in the WebGPU implementation. The main ones are listed below.

### WebGPUBundleList
This class is used to manage a list of bundles. More precisely, it handles a list of items. One item can either be a:
* list of bundles
* viewport setting
* scissor rect setting
* stencil reference setting
* blend color setting
* begin occlusion query
* end occlusion query

That's because a bundle itself can't contain a number of API calls like **setViewport**, **setScissorRect**, **setStencilReference**, etc: see the `GPURenderBundleEncoder` class in `LibDeclarations/webgpu.d.ts`.

To make things clearer, the APIs we must create a separate item for are the APIs that are supported by `GPURenderPassEncoder` but not by `GPURenderBundleEncoder`:
* setViewport
* setScissorRect
* setStencilReference
* setBlendConstant
* beginOcclusionQuery
* endOcclusionQuery

When recording the API calls during a frame (as used by the snapshot rendering for eg), we add as much bundles as possible in a *list of bundles* item, but when we must handle an API call that is not supported by the bundle encoder interface we must create a new item based on the API call we must issue and add it to the list of items. At the end of the frame, the bundles/API calls are sent to the GPU by calling `WebGPUBundleList.run()`.

### WebGPUClearQuad
This class handles clearing a rectangular area in a texture. It is used when `WebGPUEngine.clear()` is called and a non fullscreen scissor rect is in effect.

It has its own render pipeline cache instance to avoid interfering with the main render pipeline cache. Indeed, `WebGPUClearQuad` needs to disable the depth test and set the stencil read mask to **0xFF**. If we would set those states on the main render pipeline cache instead, it would/could incurr a change of these states (generally the depth test is enabled) and so force to start the cache traversal with a lower index state than if we use a separate cache instance (see how the render pipeline cache works [Cache Render Pipeline](/advanced_topics/webGPU/webGPUInternals/webGPUCacheRenderPipeline)). Not sure it is a big performance boost (as `WebGPUClearQuad.clear()` is called very infrequently) however, but it's done nonetheless...

### WebGPURenderPassWrapper
This class is a very small wrapper around the main objects used by a GPU render pass: the render pass descriptor, the render pass itself, the color/depth descriptors, the output textures and the depth texture format. There is one instance for the main pass and another for the render target pass and allows to factorize some methods common to main/render target passes (like `_setColorFormat` and `_setDepthTextureFormat`).

### WebGPUQuerySet
This is the class that implements GPU query sets and is used by both `WebGPUOcclusionQuery` and `WebGPUTimestampQuery`. See [Queries](https://www.w3.org/TR/webgpu/#queries) in the WebGPU spec.
