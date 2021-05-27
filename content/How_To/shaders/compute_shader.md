---
title: Compute Shaders
image: 
description: Learn about the compute shaders in Babylon.js.
keywords: babylon.js, advanced, compute shader
further-reading:
    - title: Compute Shader in OpenGL
      url: https://www.khronos.org/opengl/wiki/Compute_Shader
    - title: Compute Shader in DirectX
      url: https://docs.microsoft.com/en-gb/windows/win32/direct3d11/direct3d-11-advanced-stages-compute-shader?redirectedfrom=MSDN
    - title: Example of compute shader optimization
      url: https://on-demand.gputechconf.com/gtc/2010/presentations/S12312-DirectCompute-Pre-Conference-Tutorial.pdf
video-overview:
video-content:
---

Here's what [Wikipedia](https://en.wikipedia.org/wiki/Compute_kernel) has to say about compute shaders:
> In computing, a compute kernel is a routine compiled for high throughput accelerators (such as graphics processing units (GPUs), digital signal processors (DSPs) or field-programmable gate arrays (FPGAs)), separate from but used by a main program (typically running on a central processing unit). They are sometimes called compute shaders, sharing execution units with vertex shaders and pixel shaders on GPUs, but are not limited to execution on one class of device, or graphics APIs.

Note that in Babylon.js this is a [WebGPU](/advanced_topics/webGPU) feature only (starting at v5.0), WebGL does not support compute shaders.

You can query the engine for compute shader support by doing:
```javascript
engine.getCaps().supportComputeShaders
```

## Creating a compute shader
Use the `ComputeShader` class to create a computer shader, much like you would use `ShaderMaterial` to create a material for some custom shader code:
```javascript
const cs1 = new BABYLON.ComputeShader("myCompute", engine, { computeSource: copyTextureComputeShader }, { bindingsMapping:
    {
        "dest": { group: 0, binding: 0 },
        "src": { group: 0, binding: 2 }
    }
});
```
`copyTextureComputeShader` is the shader code and `bindingsMapping` an object that maps an input variable name (from the shader source code) to its binding location: see below for more explanations.

Once you have created the compute shader instance, you can set the input values by using the appropriate methods (see [ComputeShader class](/typedoc/classes/babylon.computeshader)):
```javascript
cs1.setTexture("src", src);
cs1.setStorageTexture("dest", dest);
```

A compute shader can be executed by calling one of the `dispatch()` or `dispatchWhenReady()` methods.

## Types of variables passed to compute shaders
Variables you pass to a compute shader can be of the following types:
* (sampled) **texture**. Use `ComputeShader.setTexture()` to pass a regular texture to the shader.
* **storage texture**. A storage texture is a texture you can write to from your compute shader. It can't be sampled (only fetched), so if you are using such a texture for reading purpose, you must use `textureLoad` and not `textureSampleLevel` in the shader code. In Babylon.js, storage textures are created as regular textures but pass a special flag for the `creationFlag` parameter: `BABYLON.Constants.TEXTURE_CREATIONFLAG_STORAGE`. There are also two helper methods that you can use to create storage textures: `BABYLON.RawTexture.CreateRGBAStorageTexture()` and `BABYLON.RawTexture.CreateRStorageTexture()`. Use `ComputeShader.setStorageTexture()` to pass a storage texture to the shader.
* **uniform buffer**. It's a buffer you can create by instantiating the `UniformBuffer` class and that can be used to pass some constant values to the shader side (values that still can be updated in the course of your program - they are constants inside the shader). Note that you need to first create the layout of this buffer by calling the `addUniform` method **in the order the properties appear in the buffer in the shader code**! The last point is important as the layout you create must match the layout of the buffer as used in the shader code. Once you have created the layout, you can set some values through calls to the `updateXXX()` methods. Once you are ready to update the buffer on the GPU side, call `update()`. Use `ComputeShader.setUniformBuffer()` to pass a uniform buffer to the shader.
* **storage buffer**. This is an arbitrary buffer that you can use to read or write values. Use the `StorageBuffer` class to create such buffers. Use `ComputeShader.setStorageBuffer()` to pass a storage buffer to the shader.

## Shader language and input bindings
The compute shader must be written in [WGSL](https://gpuweb.github.io/gpuweb/wgsl/), which is the shader language used by [WebGPU](/advanced_topics/webGPU).

As GLSL shaders, WGSL shaders can be stored in the `StoresShader` and you can pass the name of the key used to store the shader in this object to the `ComputeShader` constructor. You can also directly pass the shader code to the constructor (as done in the example above).

Browsers do not currently support reflection for WGSL shaders, meaning we are not able to automatically retrieve the binding and group values of the input variables, as seen here:
```wgsl
[[group(0), binding(0)]] var dest : [[access(write)]] texture_storage_2d<rgba8unorm>;
[[group(0), binding(1)]] var samplerSrc : sampler;
[[group(0), binding(2)]] var src : texture_2d<f32>;
```
That's why you need to provide those bindings yourself when creating a new `ComputeShader` instance:
```javascript
const cs1 = new BABYLON.ComputeShader("myCompute", engine, { computeSource: copyTextureComputeShader }, { bindingsMapping:
    {
        "dest": { group: 0, binding: 0 },
        "src": { group: 0, binding: 2 }
    }
});
```
Note that for a (sampled) texture variable as `src` in the example above:
* you must define a corresponding sampler (`samplerSrc` in the example above) with a binding value equal to the binding value of the texture minus 1. In Babylon.js we don't have a separate sampler object from the texture itself that you could bind separately, so when you bind a texture to your shader we automatically bind a sampler object to the binding just before.
* you must not add this sampler in the `bindingsMapping`

## Examples

### Simple compute shaders

<Playground id="#3URR7V#95" title="Simple compute shaders" description="A simple example of creating various compute shaders"/>

This PG creates 3 compute shaders:
* the first one is loading a texture and copying it into another texture by means of a compute shader. This texture is then applied on the ground. **Warning**: it is for demonstration purpose only, don't use this compute shader in real code, a simple copy buffer would be enough to achieve the same thing!
* the second one is clearing a texture with a constant value and applying it to the sphere. Once again, **don't use it in real code**! Note that we don't use `addUniform` to create the layout of the uniform buffer: when there's a single property in a uniform buffer, calling `updateXXX()` to set the value of the property will also create the layout.
* the third one is computing the multiplication of two matrices. It uses 3 storage buffers, 2 for the two input matrices and one for the result. The result buffer is then read and dumped to the console log. It is a direct port of [Get started with GPU Compute on the Web](https://developers.google.com/web/updates/2019/08/get-started-with-gpu-compute-on-the-web).

### Image Blur

<Playground id="#3URR7V#93" title="Blur compute shader" description="This example shows how to blur an image using a WebGPU compute shader"/>

This is a direct port of the WebGPU sample [imageBlur](http://austin-eng.com/webgpu-samples/samples/imageBlur).

Note that in the sample we are calling `dispatchWhenReady()` for the first compute shader to be sure the compute effect is ready before going on, but for the next shaders we simply call `dispatch()` because as they are using the same shader code we are sure the effect will be ready (as it is the same one).

### Compute Boids

<Playground id="#3URR7V#92" title="Boids compute shader" description="A GPU compute particle simulation that mimics the flocking behavior of birds"/>

This is a direct port of the WebGPU sample [computeBoids](http://austin-eng.com/webgpu-samples/samples/computeBoids).

It is a compute shader that updates two ping-pong buffers which store particle data. The data is used to draw instanced particles.

Note that it is using the (new in 5.0) `Mesh.forcedInstanceCount` property to set an instance count for a mesh that has no instances (`InstancedMesh`) but that we would like to render multiple times because we provide the appropriate vertex buffers manually.

As the storage buffers we use to compute the particle positions and velocities will be used as (instanced) vertex buffers, we must flag them as `BUFFER_CREATIONFLAG_VERTEX` at creation time (see the `new BABYLON.StorageBuffer(...)` calls in the code).

### Hydraulic erosion

<Playground id="#C90R62" title="Hydraulic erosion" description="Simulate erosion to make terrains look more natural"/>

This is a port of the great project [Hydraulic-Erosion](https://github.com/SebLague/Hydraulic-Erosion): all credits to sebastlague@gmail.com!

The generation of the terrain and the simulation of the erosion is done by using two different compute shaders.

Note that this sample also works in WebGL2 where compute shaders are not available but you should be careful when setting the parameters: don't raise too much **Iterations**, **Radius**, **Max lifetime**, **Resolution** else you may stuck your browser as now the terrain generation and erosion processes are handled on the CPU side!

### Slime simulation

<Playground id="#GXJ3FZ#35" title="Slime simulation" description="Simulate organic-like agents"/>

This is a port of the great project [Slime-Simulation](https://github.com/SebLague/Slime-Simulation): all credits to sebastlague@gmail.com!

The implentation in WGSL is a little less pretty than the HLSL one because at the time of this writing WebGPU does not support read/write textures, so we had to use a storage buffer for the `TrailMap` texture. That means we need some copy buffer to texture and texture to buffer functions and we have to do 4 reads from `TrailMap` instead of a single one when we need to get a `vec4` (see the code), which is likely less performant than its HLSL counterpart.