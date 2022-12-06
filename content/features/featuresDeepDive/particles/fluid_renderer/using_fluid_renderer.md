---
title: Using the Fluid Renderer
image: 
description: Learn how to use the fluid renderer component to display particle systems as a fluid
keywords: diving deeper, particles, fluid rendering, display
further-reading:
video-overview:
video-content:
---

The fluid renderer has been implemented as a scene component (like the depth renderer, for example), so you can enable it by doing `scene.enableFluidRenderer()` (and do `fluidRenderer = scene.enableFluidRenderer()` to get a pointer to the renderer) and disable it with `scene.disableFluidRenderer()`.

## Main classes

The fluid renderer handles two entities: `FluidRenderingObject` and `FluidRenderingTargetRenderer`:
* `FluidRenderingObject` is an object you want to render as a fluid: either a particle system (`FluidRenderingObjectParticleSystem`) or a raw list of particles (vertex coordinates - `FluidRenderingObjectCustomParticles`).
* `FluidRenderingTargetRenderer` is the class that generates the depth, thickness and diffuse textures and renders the object(s) as a fluid.

You can associate multiple `FluidRenderingObject` with a single `FluidRenderingTargetRenderer` or have multiple instances of `FluidRenderingTargetRenderer` and distribute your fluid objects among these target renderers. For performance reasons, it's better to use a single target renderer for multiple objects rather than creating a new target renderer instance for each object, but if the target renderer settings need to be different depending on the object being rendered, you have no choice but to create additional target renderers.

## Rendering objects as a fluid

For particle systems (`ParticleSystem` and `GPUParticleSystem`), you can enable fluid renderering by doing:

```javascript
const fluidRenderer = scene.enableFluidRenderer();
const renderObject = fluidRenderer.addParticleSystem(particleSystem);

const fluidObject = renderObject.object;
const targetRenderer = renderObject.targetRenderer;
```

Then you can use `fluidObject` and `targetRenderer` to customize the display of the particle system.

To create a fluid object for a list of custom particles, use `fluidRenderer.addCustomParticles()`:
```typescript
public addCustomParticles(
    buffers: { [key: string]: FloatArray },
    numParticles: number,
    generateDiffuseTexture?: boolean,
    targetRenderer?: FluidRenderingTargetRenderer,
    camera?: Camera
): IFluidRenderingRenderObject
```
Note that the `buffers` object must contain at least one **position** buffer! If you choose to generate a diffuse texture, you must also provide a **color** buffer.

## Debugging

The `FluidRendererGUI` class allows you to see the fluid objects and target renderers registered with the fluid renderer and allows you to modify their properties easily:

![Fluid Debugging](/img/features/fluidrenderer/gui_debugging.jpg)

This class is not integrated into Babylon.js because we will update the inspector instead, so in the meantime you can find it [here](/features/featuresDeepDive/particles/fluid_renderer/fluid_gui).