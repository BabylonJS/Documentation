---
title: WebGL2 Support
image:
description: Dive into understanding the full scope of support for WebGL2 in Babylon.js.
keywords: babylon.js, advanced, WebGL2, WebGL, support
further-reading:
video-overview:
video-content:
---

## Introduction

Starting with v3.0, Babylon.js supports rendering using WebGL1 and WebGL2 contexts.
The support is transparent for developers. By default the engine tries to get a WebGL2 context. If none is available then a WebGL1 one is retrieved.

You can test which version of WebGL is enabled with: `engine.webGLVersion` property.

## Shaders

When WebGL2 is enabled, the shaders are automatically converted to GLSL v3.0. Babylon.js will then automatically take advantage of extended instruction/uniform counts.

If you are using custom shaders, the best idea would be to provide GLSL v2.0 shaders. This way your code will work on both contexts.
You can obviously provide only v3.0 shaders but in this case your code will only work when WebGL2 is enabled.

## Supported features

You can find here the list of supported features and the backward compatibility options (when available)

| Feature                      | Description                                                                                                                                                                                                                                        | WebGL1 compatibility                                                                                          | Demo                                                                                                             | More info                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Depth Frag                   | Used to compute logarithmic depth buffer                                                                                                                                                                                                           | Yes through an [extension](https://www.khronos.org/registry/webgl/extensions/EXT_frag_depth/)                 | <Playground id="#1180R5#15" title="Depth Frag" description="Depth Frag"/>                               | [Documentation](/features/featuresDeepDive/materials/advanced/logarithmicDepthBuffer) |
| Multisample render targets   | Rendertarget textures can be multisampled to get antialiasing effect                                                                                                                                                                               | No. Has no effect on WebGL1 context                                                                           | <Playground id="#12MKMN" title="Multisample Render Targets" description="Multisample render targets."/> | [See below](/setup/support/webGL2#multisample-render-targets)          |
| Standard derivatives         | Standard derivatites are used in Babylon.js to help compute realtime bump                                                                                                                                                                          | Yes through an [extension](https://www.khronos.org/registry/webgl/extensions/OES_standard_derivatives)        | [Demo](https://www.babylonjs.com/Demos/Bump/)                                                                    | [Documentation](/features/featuresDeepDive/materials/using/moreMaterials)             |
| Texture LOD                  | Used by PRBMaterial to simulate microsurface                                                                                                                                                                                                       | Yes through an [extension](https://www.khronos.org/registry/OpenGL/extensions/EXT/EXT_shader_texture_lod.txt) | [Demo](/features/featuresDeepDive/materials/using/HDREnvironment)                                                             | [Documentation](/features/featuresDeepDive/materials/using/introToPBR)                |
| Vertex array objects (VAO)   | A Vertex Array Object (or VAO) is an object that describes how the vertex attributes are stored in a Vertex Buffer Object (or VBO)                                                                                                                 | Yes through an [extension](https://www.khronos.org/registry/webgl/extensions/OES_vertex_array_object/)        | N/A. Every rendering is done with VAO by default                                                                 | [See below](/setup/support/webGL2#vertex-array-objects)                |
| Uniform buffer objects (UBO) | An uniform buffer object (or UBO) let you specify a group of uniforms from a buffer                                                                                                                                                                | No. Uniforms are handled independently on WebGL1 context                                                      | N/A. Materials supporting UBO automatically uses them                                                            | [See below](/setup/support/webGL2#uniform-buffer-objects)              |
| Multiple Render Target (MRT) | Several Render Targets can be rendered in the same draw call.                                                                                                                                                                                      | Yes through an [extension](https://www.khronos.org/registry/webgl/extensions/WEBGL_draw_buffers)              | <Playground id="#NZ6P07" title="Multiple Render Target" description="Multiple Render Target"/>          | [See below](/setup/support/webGL2#multiple-render-target)              |
| Occlusion Queries            | Occlusion queries detect whether a Mesh is visible in the current scene or not                                                                                                                                                                     | Yes through an [extension](https://www.khronos.org/opengl/wiki/Query_Object#Occlusion_queries)                | <Playground id="#QDAZ80#3" title="Occlusion Queries" description="Occlusion Queries"/>                  | [See below](/setup/support/webGL2#occlusion-queries)                   |
| 3D Textures                  | 3D textures are textures with a 3rd dimension. You can see them as multiple 2D textures where every texture is a slice in the 3d texture.                                                                                                          | No. Cannot be created in WebGL1                                                                               | This feature will automatically be used when possible.                                                           | [See below](/setup/support/webGL2#3d-textures)                         |
| 2D Array Textures            | 2D array textures are very similar to 3D textures but are designed for constructing a texture atlas instead of a volumetric texture.                                                                                                               | No. Cannot be created in WebGL1                                                                               | <Playground id="#XEVUD9" title="2D Array Textures" description="2D Array Textures"/>                    | [See below](/setup/support/webGL2#2d-array-textures)                   |
| Power of two textures        | In the past, to achieve the best performance and higher quality texture rendering, images with dimensions that are a power of two were required. With support for WebGL2 this is no longer the case, any sized texture will be rendered optimally. | Yes, however Babylon will resize textures to be a power of two causing a hit to performance                   | N/A. This is done by default                                                                                     | [See below](/setup/support/webGL2#power-of-two-textures)               |
| Transform feedback buffer    | Transform feedback buffer can be used to update vertex buffers from GPU. Babylon.js uses it to implement GPU particles                                                                                                                             | No. Not supported on WebGL1                                                                                   | <Playground id="#PU4WYI" title="Power Of Two Textures" description="Power Of Two Textures"/>            | [See particles documentation](/features/featuresDeepDive/particles/particle_system/particle_system_intro#gpu-particles)       |
| Shadow Samplers              | Shadow samplers are used to enable PCF depth comparison on the hardware. Babylon.js uses it to implement PCF and PCSS shadows.                                                                                                                     | No. Not supported on WebGL1 (shadows fall back to poisson sampling)                                           | <Playground id="#ZT8BKT#57" title="Shadow Samplers" description="Shadow Samplers"/>                      | [See shadows documentation](/features/featuresDeepDive/lights/shadows)                         |
| More precise shadows         | Shadow maps can now use 32 bits depth buffers improving by a large scale the precision of the shadows.                                                                                                                                             | No. Not supported on WebGL1 (shadows precision will fall back to 16 bits)                                     | <Playground id="" title="#ZT8BKT#57More Precise Shadows" description="More Precise Shadows"/>            | [See shadows documentation](/features/featuresDeepDive/lights/shadows)                         |

## Multisample render targets

By default render targets (like mirrors for instance) are created without support for multisampling. To turn it on, just define a value for `renderTarget.samples` > 1.
On WebGL1 context, this will do nothing. On WebGL2 context, this will enable multisampling (more samples imply better antialiasing but a slower rendering).

Here is an example of a mirror (512x512) with and without multisampling:

| No MSAA (1 sample)                 | MSAA (8 samples)                 |
| ---------------------------------- | -------------------------------- |
| ![Title](/img/features/nomsaa.jpg) | ![Title](/img/features/msaa.jpg) |

## Vertex array objects

When possible (either on WebGL2 context or when extension is available on WebGL1 context), Babylon.js will use VAO to control rendering. VAO are a kind of geometry objects. Instead of sending all attributes and buffers used by a mesh (one for position, one for normal, one for indices, one for texture coordinates, etc..), you can build a VAO which will keep track of all attributes / buffers used.

At rendering time, you just have to define one VAO instead of multiple VBO (vertex buffer object).

You can find more details on [Tojicode's blog](http://blog.tojicode.com/2012/10/oesvertexarrayobject-extension.html).

## Uniform buffer objets

On WebGL1 context all uniforms are sent to GPU independently. This means that if your shader uses 16 matrices, you will call WebGL API 16 times to update all matrices before using your shader.

On WebGL2 context, you can use a UBO to set the values in a typed array all inside JavaScript. This means that it's much faster. When all the values are set you can then send them to the GPU with only one call.

You can find more details on [WebGL 2 specification](https://www.khronos.org/registry/webgl/specs/latest/2.0/#3.7.16)

## Multiple Render Target

On former WebGL1, one draw call meant 1 target texture. Now you can bind several target textures to a shader and specify inside the fragment shader the colors you want to put on each texture. Essentially it saves you a lot of CPU time and you can achieve advanced effects like [Deferred Shading](https://fr.wikipedia.org/wiki/Deferred_Shading).

In Babylon.js, our first use of this technique is to render a geometry buffer of the scene.

## Occlusion queries

Occlusion queries detect whether a Mesh is visible in the current scene or not, and based on that the Mesh get drawn or not. Occlusion queries is useful when you have an expensive object on the scene and you want to make sure that it will get drawn if it is visible to the camera and it is not behind any opaque object. BabylonJs provides an implementation for Occlusion queries using property occlusionType in AbstractMesh Class

[Babylon.js Occlusion Queries Feature](/features/featuresDeepDive/occlusionQueries)

[WebGL 2 Occlusion Queries](https://www.khronos.org/opengl/wiki/Query_Object#Occlusion_queries)

## 3D textures

3D textures are mostly used for volumetric effects like color grading, fire, smoke, etc. WebGL 2 support for 3D textures is as good as that for 2D textures.

So far Babylon.js will use them for color grading texture: <Playground id="#17VHYI#2" title="3D Textures Example" description="Simple example of using 3D textures."/>

## 2D array textures

2D array textures allow you to pass a texture atlas to a custom shader. This could be used whenever you have multiple, distinct, 2D textures that you want to blend or switch between inside your shader. For example tiles, terrain splatting or frames of an animation. Using array textures ensures that distinct layers are sampled _as if_ they were separate textures, so there will be no bleeding between different sections of the atlas.

Usage is very similar to 3D textures: create a `RawTexture2DArray`, use `setTexture` on the shader material, and use a sampler of type `sampler2DArray`. Sample using `texture(yourSampler, vec3(u,v,layerIndex))` where `layerIndex` is a 0-based index into the array.

More information is available on the [Khronos wiki](https://khronos.org/opengl/wiki/Array_Texture).

<Playground id="#XEVUD9" title="2D Array Textures Example" description="2D Array Textures Example"/>

## Power of two textures

On WebGL1 context, all textures are resized to a power of two to produce the best quality. This resize may impact performance.

On WebGL2 context, no resize is required and any size texture will be rendered with the best quality.

You can find more details on [WebGL 2 specification](https://www.khronos.org/registry/webgl/specs/latest/2.0/#4.1.3)
