---
title: WebGPU Internals - Overview
image: 
description: Learn how the WebGPU engine has been implemented in Babylon.js
keywords: babylon.js, WebGPU, engine, implementation
further-reading:
video-overview:
video-content:
---

Babylon.js has an abstraction layer that helps implement new types of engines. There are currently four types of engines: Null, Native, WebGPU, and Engine, which implements WebGL as well as additional components like audio.

The first three extend `Engine`, and `Engine` extends `ThinEngine`, which is a low-level, graphics-only API for engines. Note that one of the mid-term goals is to have all engines extend `ThinEngine`, or a specific "thin" version, directly instead of `Engine` to better encapsulate the implementations.

Here's a chart with the main files/classes used to implement the **WebGPU** engine:

![WebGPU chart](/img/extensions/webgpu/classesChart.webp!1366)

## Core classes
These are the core classes used in the WebGPU implementation.

### WebGPUEngine
This class is the main entry point for the WebGPU implementation. It extends `Engine` and implements all the APIs needed by the higher layers to work with WebGPU. Some parts of the implementation are dispatched into the `WebGPU/Extensions/` files, in much the same way as for WebGL in `Engines/Extensions/`.
* We currently use the same [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) shaders in **WebGPU** that we use in **WebGL**. Those shaders are converted to **SpirV** with **GLSLang**, and **SpirV** is converted to **WGSL** by a port of `Tint` to **WASM**, called **TintWASM**.
* We use two command encoders: *upload* and *render*. *upload* is used when we need to upload data into textures, and *render* is used to render into render targets and for the main render pass, when rendering into the swap chain texture. They are pushed into the queue in this order: *upload* -> *render*. Note that if a compute shader must be executed, the current render pass of the *render* command encoder is closed, the compute shader is executed, and the render pass is reopened. The same process happens when generating mipmaps for a render target, because this requires a new render pass, and two render passes cannot be opened at the same time on a given command encoder.
* GPU timing, which can be seen in the *Inspector* under **Statistics / GPU Frame time**, is done using timestamp queries. For the time being, Chrome does not allow those queries by default, so Chrome must be started with the `--enable-dawn-features=allow_unsafe_apis` flag to make it work.
* `_ubInvertY` and `_ubDontInvertY` are the two uniform buffers used to implement rendering without the CSS `yScale(-1)` trick, thus saving a copy at the end of each frame. See [this comment](https://github.com/BabylonJS/Babylon.js/pull/11616#issue-1077008145) for more information.
* When binding a `RenderTargetWrapper` through a call to `bindFramebuffer()`, we do not create the render pass right away. That render pass is created in `_startRenderTargetRenderPass()`. This is because we will likely process a `clear()` call shortly afterward, and we create the render pass at that time using the clear values passed to `clear()`. Doing so avoids creating a render pass when `bindFramebuffer()` is called, then closing it and recreating a new one when `clear()` is called, because clearing is done at the same time the render pass is created by a `beginRenderPass` API call.

### WebGPUBufferManager
This class handles everything related to GPU buffers (creation, deletion, reading, writing).
* Reading half-float data is very slow because a conversion from half float to float must be done in JavaScript code. To speed things up, a compute shader could be used instead.
* If the row byte size is not aligned, meaning it is not divisible by 256, there is an additional copying process in JavaScript to build the final buffer, which makes the whole process slow. A compute shader would help here too.
* When `releaseBuffer()` is called, the passed buffer is not released right away because the buffers used during queue processing, meaning when calling `device.queue.submit()`, must remain valid. Instead, the buffer is pushed into a list that is cleaned by a call to `destroyDeferredBuffers()`. **WebGPUEngine** calls this method at the end of a frame, after `device.queue.submit()` has been called.

### WebGPUTextureHelper
This class handles everything related to GPU textures (creation, deletion, reading, writing, generating mipmaps, etc).
* As with GPU buffers, we use a deferred list to release textures and wait to release them until after the queue has been submitted.
* When creating a texture, we always set the `RenderAttachment | CopyDst` flags because we do not know in advance whether `copyExternalImageToTexture()` will be used to update the texture, see the `updateTexture()` method, and this function requires those flags to be set.
* Mipmap generation is done by issuing `n` render passes, `*6` for a cube texture. It would probably be faster to use optimized compute shaders instead. Also, see [Lower perf when generating mipmaps compared to webgl](https://bugs.chromium.org/p/dawn/issues/detail?id=587) for discussions about mipmap-generation performance.

### WebGPUSnapshotRendering
This class implements the snapshot rendering optimization. See [Snapshot Rendering](/setup/support/webGPU/webGPUOptimization/webGPUSnapshotRendering) for more information about this optimization.

It creates a bundle for each render texture, either a render target texture or the swap chain texture, at recording time and replays that bundle for all subsequent frames.

Note that it is creating a bundle list instead of a single bundle because a number of APIs are not supported inside bundles (like `setViewport`, `setScissorRect`, etc): `WebGPUBundleList` is the class that manages a list of bundles interleaved with those API calls.

### WebGPUTintWASM
This class is a thin wrapper around the **TintWASM** bundle and is used to convert **SpirV** to **WGSL**.

### WebGPUOcclusionQuery
This class implements occlusion queries in WebGPU. It is a straightforward implementation that uses the `WebGPUQuerySet` helper class for the actual query handling.

### WebGPUTimestampQuery
This class implements GPU timing for a frame by writing a timestamp at the beginning of the *upload* command encoder and another as the last command of the *render* command encoder, then subtracting the time measured by the two timestamps. 

As explained above, it currently only works in Chrome if it is launched with the `--enable-dawn-features=allow_unsafe_apis` flag.


## Classes used for caching
To avoid recreating some objects each time they are needed and to save performance, a number of caches are used by the WebGPU implementation.

### WebGPUCacheBindGroup
This class implements a cache of GPU bind groups. See [Cache Bind Groups](/setup/support/webGPU/webGPUInternals/webGPUCacheBindGroup) for detailed explanations about the implementation.

### WebGPUCacheRenderPipeline
This class implements a cache of GPU render pipelines. See [Cache Render Pipelines](/setup/support/webGPU/webGPUInternals/webGPUCacheRenderPipeline) for detailed explanations about the implementation.

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
Specialization of `RenderTargetWrapper`. In WebGPU, we simply need an additional `_defaultAttachments: number[]` property that holds the attachment list at creation time, when `WebGPUEngine.createMultipleRenderTarget` has been called. This is the list that is used if no explicit attachment list has been provided, through a call to `WebGPUEngine.bindAttachments`, when starting a new render target pass.

### WebGPUHardwareTexture
It is the specialization of `HardwareTextureWrapper` for WebGPU. This is the object held by `InternalTexture` in the `_hardwareTexture` property.

Note that this class holds some caches to improve performance:
* when generating mipmaps: `_mipmapGenRenderPassDescr` and `_mipmapGenBindGroup` properties
* when calling `WebGPUTextureHelper.invertYPreMultiplyAlpha`: `_copyInvertYTempTexture`, `_copyInvertYRenderPassDescr`, `_copyInvertYBindGroup` and `_copyInvertYBindGroupWithOfst` properties

These properties hold pre-built WebGPU objects so that we do not have to recreate them each time the corresponding processing is called, meaning mipmap generation or calls to `invertYPreMultiplyAlpha`. We create them the first time the processing is called.

### WebGPUDepthCullingState
This is a specialization of `DepthCullingState`. This class overrides all the setter methods to call the corresponding `WebGPUCacheRenderPipeline` methods so that the depth/culling cache states are always up to date.

### WebGPUStencilStateComposer
This is a specialization of `StencilStateComposer`. As for `WebGPUDepthCullingState`, this class overrides all the setter methods to call the corresponding `WebGPUCacheRenderPipeline` methods so that the stencil cache states are always up to date.


## Shader/Pipeline classes
These are classes that deal with shaders and shader contexts. Note that **Pipeline** in this context has nothing to do with the WebGPU pipeline concept from the spec! Here it means the shader context.

### WebGPUShaderProcessor, WebGPUShaderProcessorGLSL, WebGPUShaderProcessorWGSL
`WebGPUShaderProcessor` is the base class used by both `WebGPUShaderProcessorGLSL` and `WebGPUShaderProcessorWGSL` and is used by the system to parse a shader: written in [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) for `WebGPUShaderProcessorGLSL` and in WGSL for `WebGPUShaderProcessorWGSL`.

The main task of these classes is to collect the list of buffers, uniforms, attributes, textures and samplers and create the related WebGPU objects, like the bind group layout entries and the bind group entries. Those objects are stored in a `WebGPUShaderProcessingContext` instance. The shader code is also modified so that it complies with the syntax expected by **glsllang**.

These classes also create a description of a special uniform buffer called the **leftover buffer**, which contains all the uniform variables declared with the `uniform VarType VarName;` syntax in the shader, or `uniform VarName : VarType;` for WGSL shaders. See [Writing shaders in WGSL](/setup/support/webGPU/webGPUWGSL#special-syntax-used-in-wgsl-code). Indeed, you cannot declare uniforms outside of a uniform buffer in WebGPU, so the system creates one for you under the hood and handles it transparently.

To avoid an additional *copy texture with Y inversion* at the end of a frame, these classes inject some special code into all shaders. The parameters used by this code, `yFactor` and `textureOutputHeight`, are passed through a specific uniform buffer called **Internals** in the shader code. See [this comment](https://github.com/BabylonJS/Babylon.js/pull/11616#issue-1077008145) for more information.

### WebGPUShaderProcessingContext
This class holds all the data extracted/created when the shaders are parsed by `WebGPUShaderProcessorXXX`.

Note that we use the `_SimplifiedKnownUBOs` definition of the known UBOs instead of `_KnownUBOs` to save some `GPURenderPassEncoder.setBindGroup` calls. With `_SimplifiedKnownUBOs`, we use only two bind groups, so we issue only two calls. There is an optimization that could be made in the future where we would not issue the call for the scene UBO, bind group 0, if the scene UBO is the same and its content has not changed since the last call. However, the expected way to use WebGPU is in [non compatibility mode](/setup/support/webGPU/webGPUOptimization/webGPUNonCompatibilityMode), and in this mode the number of `setBindGroup` calls is less relevant because we make them only once at bundle-creation time.

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

Also, we must know if there's at least one **32 bits float** texture (see `WebGPUMaterialContext.hasFloatTextures`) because filtering of 32-bits float textures is only supported by an extension (which may not be active), meaning we must set some special values when creating the bind group layout entry for this texture: the sampler associated to the texture (if any) must be set to **non-filtering** and the sample type of the texture to **unfilterable-float**. There's the same problem with depth textures, where "float" filtering is not supported either. See `WebGPUCacheRenderPipeline._createPipelineLayoutWithTextureStage`.

### WebGPUDrawContext
This class keeps track of the list of uniform/storage buffers used by a shader. The material uniform buffer could have been stored on `WebGPUMaterialContext` but to simplify the implementation we did not split the list, all buffers are handled by `WebGPUDrawContext`.

The class also holds two caches:
* **fastBundle**. It is the bundle used in the [non compatibility mode](/setup/support/webGPU/webGPUOptimization/webGPUNonCompatibilityMode)
* **bindGroups**. It is the cache of the bind groups. It is reused for the next draw if `WebGPUDrawContext.isDirty==false` (and `WebGPUMaterialContext.isDirty==false`). See [WebGPUCacheBindGroup](#optimization)

Lastly, the class manages a GPU buffer, `WebGPUDrawContext.indirectDrawBuffer`, that stores the parameters used in an indirect draw call when using instances in non compatibility mode. In that mode, the draw call is embedded inside the bundle, and if the number of instances to draw changes from one frame to another, we would need to recreate the bundle to update the instance-count parameter. Because creating a bundle incurs a performance penalty, we issue an indirect draw call in the bundle and update the instance count in the GPU buffer instead of doing a regular draw.

#### Note on the WebGPUMaterialContext.updateId property
Modifying a texture in a material works for all meshes using that material because when you update a texture property, all submeshes using that material are flagged as "texture dirty". That means that when `Material.isReadyForSubMesh` runs, we execute the code that calls `subMesh.setEffect(effect, defines, this._materialContext)`, which resets the context. See the code of `DrawWrapper.setEffect`. The bind groups are then regenerated with the new texture.

However, if we are not using a `Material` but are directly updating a texture with `effect.setTexture(...)`, as the depth peeling renderer does to update `oitDepthSampler` and `oitFrontColorSampler`, it no longer works because the context is not reset. Nothing triggers the recreation of the bind groups. We could call `_markAllSubMeshesAsTexturesDirty()` manually on all submeshes, but that is not performant because `Material.isReadyForSubMesh` would be called even though we only want to bind some textures and do not need this method to run. Also, because it is a manual call, it could be forgotten.

To fix the problem, we added a `WebGPUMaterialContext.updateId` property that is updated each time a sampler or texture changes in the material context. `WebGPUDrawContext` also has a `WebGPUDrawContext.materialContextUpdateId` property, which corresponds to the associated `WebGPUMaterialContext.updateId` value when the bind groups were generated. You can find those bind groups in `WebGPUMaterialContext.bindGroups`. When retrieving the bind groups from that cache, if the two `updateId` values are different, it means the material context has changed since the last time we generated the bind groups, so we must recreate them.

### WebGPUComputeContext
This class is more or less the mirror of `WebGPUDrawContext`, but for compute shaders. Its task is to create bind groups based on the resources used by the shader. The bind groups are cached until at least one resource is updated. It is the responsibility of the [ComputeShader](/typedoc/classes/babylon.computeshader) class to mark the bind groups as dirty when a resource changes.

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

That is because a bundle itself cannot contain a number of API calls like **setViewport**, **setScissorRect**, and **setStencilReference**. See the `GPURenderBundleEncoder` class in `LibDeclarations/webgpu.d.ts`.

To make things clearer, the APIs we must create a separate item for are the APIs that are supported by `GPURenderPassEncoder` but not by `GPURenderBundleEncoder`:
* setViewport
* setScissorRect
* setStencilReference
* setBlendConstant
* beginOcclusionQuery
* endOcclusionQuery

When recording API calls during a frame, as used by snapshot rendering for example, we add as many bundles as possible to a *list of bundles* item. But when we must handle an API call that is not supported by the bundle-encoder interface, we create a new item based on the API call we must issue and add it to the list of items. At the end of the frame, the bundles and API calls are sent to the GPU by calling `WebGPUBundleList.run()`.

### WebGPUClearQuad
This class handles clearing a rectangular area in a texture. It is used when `WebGPUEngine.clear()` is called and a non-fullscreen scissor rect is in effect.

It has its own render-pipeline cache instance to avoid interfering with the main render-pipeline cache. `WebGPUClearQuad` needs to disable the depth test and set the stencil read mask to **0xFF**. If we set those states on the main render-pipeline cache instead, it could change those states, the depth test is generally enabled, and force the cache traversal to start from a lower index state than if we used a separate cache instance. See [Cache Render Pipeline](/setup/support/webGPU/webGPUInternals/webGPUCacheRenderPipeline) for how the render-pipeline cache works. It is not clear that this provides a big performance boost, because `WebGPUClearQuad.clear()` is called very infrequently, but it is done nonetheless.

### IWebGPURenderPassWrapper
This interface is a very small wrapper around the main objects used by a GPU render pass: the render pass descriptor, the color and depth descriptors, the output textures, and the depth texture format. There is one instance for the main pass and another for the render-target pass, which allows some methods common to both passes, such as `_setColorFormat` and `_setDepthTextureFormat`, to be factored out.

### WebGPUQuerySet
This is the class that implements GPU query sets and is used by both `WebGPUOcclusionQuery` and `WebGPUTimestampQuery`. See [Queries](https://www.w3.org/TR/webgpu/#queries) in the WebGPU spec.
