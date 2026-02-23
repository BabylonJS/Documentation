---
title: GPU Particles
image: 
description: Learn all about GPU particles in Babylon.js.
keywords: diving deeper, particles, particle system, gpu, gpu particles
further-reading:
video-overview:
video-content:
---

# GPU Particles

Starting from Babylon.js v3.2, you can leverage a new WebGL2 feature, the transform feedback buffer, to drastically boost the performance of particles. Whereas regular particles use the CPU for animation and the GPU for rendering, the new WebGL2 API allows Babylon.js to use the GPU for both animation and rendering. With GPU particles, everything is offloaded to the GPU.

Unfortunately, this feature is only available when WebGL2 is available. You can use `BABYLON.GPUParticleSystem.IsSupported` to detect if GPU particles can be used. When they are supported, GPU particles can almost be used like regular particles:

```javascript
var particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity:1000000 }, scene);
```

As the CPU is no longer involved, you can go crazy with active particles (1,000,000 in this example). Also, you can use `particleSystem.activeParticleCount` to define the number of active particles if you want to limit GPU usage.

**Note:** Sub emitters are not supported in GPU particles.

## Random Texture

It is a shame, but there is no good way to get random numbers when running on the GPU. To fill this gap, Babylon.js will create a texture filled with thousands of random values. These values will be read by the particle update shader to animate the particles.
By default, the biggest supported texture size is used (16K). You may want to reduce the size of this texture by initializing the system like this:

```javascript
var particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity:1000000, randomTextureSize: 4096 }, scene);
```

## Fallback

As the `GPUParticleSystem` and the `ParticleSystem` share almost all of their API, it is easy to switch from one to the other when WebGL2 is not supported. Keep in mind that the CPU cannot animate as many particles as the GPU can, so you will probably have to reduce the capacity of your system when not using the `GPUParticleSystem`.

## Stopping a GPU Particle System

When calling `system.stop()` on a `GPUParticleSystem` object, you will force the system to stop generating new particles. But particles will still be rendered even if not visible.

To completely stop a `GPUParticleSystem`, you have to call `dispose()` on it.

## Using custom effects to render the particle system

New since 5.0, you can now use custom effects with GPU particles!

GPU Particles with custom effect: <Playground id="#1ASENS#68" title="GPU Particles With Custom Effect" description="Simple example of a GPU particle system using a custom effect for display."/>

## Unsupported Features

The following features are not supported by GPU particles due to their inner nature:

- ManualEmitCount
- disposeOnStop
- Dual values per gradient (only one value is supported)
- Emit rate gradients are not supported
- Start size gradients are not supported
- Mesh emitter

## Example

GPU Particles: <Playground id="#PU4WYI#4" title="GPU Particles Example" description="Simple example of a GPU particle system."/>
