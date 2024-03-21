---
title: Global Illumination with Reflective Shadow Maps
image:
description: Learn how to utilize Babylon.js to render scenes with global illumination
keywords: diving deeper, lights, lighting, light scattering, gi, global illumination, rsm
further-reading:
video-overview:
video-content:
---
|<p align="center">Without GI</p>|<p align="center">With GI</p>|
|----------|-------|
|![Without GI](/img/features/rsmgi/intro2_nogi.jpg)|![With GI](/img/features/rsmgi/intro2_gi.jpg)|
|![Without GI](/img/features/rsmgi/intro_nogi.jpg)|![With GI](/img/features/rsmgi/intro_gi.jpg)|

## Introduction

From [Wikipedia](https://en.wikipedia.org/wiki/Global_illumination):

```md
Global illumination (GI), or indirect illumination, is a group of algorithms used in 3D computer graphics that are meant to add more realistic lighting to 3D scenes. Such algorithms take into account not only the light that comes directly from a light source (direct illumination), but also subsequent cases in which light rays from the same source are reflected by other surfaces in the scene, whether reflective or not (indirect illumination).

Theoretically, reflections, refractions, and shadows are all examples of global illumination, because when simulating them, one object affects the rendering of another (as opposed to an object being affected only by a direct source of light). In practice, however, only the simulation of diffuse inter-reflection or caustics is called global illumination.
```

The algorithm implemented in Babylon (since version 7) is based on **Reflective Shadow Maps** (RSM).
This algorithm can't compete with other GI algorithms (such as those used in Unreal Engine or other game engines) as a complete GI solution, but it can be effective, depending on your scene and the quality you want to achieve. There are also a number of parameters that will help you adjust the final result to work on a wider range of devices.

One of the main uses we foresee is in the context of e-commerce, to better anchor models in the environment. See, for example:

|<p align="center">Without GI</p>|<p align="center">With GI</p>|
|----------|-------|
|![Without GI](/img/features/rsmgi/shoe_nogi.jpg)|![With GI](/img/features/rsmgi/shoe_gi.jpg)|

The differences are subtle, just look at the shoe support and the backdrop (click to enlarge).

## Reflective Shadow Maps (RSM)

### Historical background

Reflective Shadow Maps is a technique first described [in this article](http://www.klayge.org/material/3_12/GI/rsm.pdf).
This is a fairly old article, but many newer GI algorithms use the RSM method as one of the first steps in a more advanced algorithm.

For example, the Light Propagation Volumes algorithm, first used in [CryEngine 3](https://advances.realtimerendering.com/s2009/Light_Propagation_Volumes.pdf) and also used in [Unreal Engine 4](https://docs.unrealengine.com/4.27/en-US/BuildingWorlds/LightingAndShadows/LightPropagationVolumes/), uses RSM as the first step in the GI pipeline.

[Uncharted 4](https://advances.realtimerendering.com/s2016/) (scroll down to **"Temporal Antialiasing in Uncharted 4"**, slide 71 in the PPT file) also uses RSM to manage the light projected by the spotlight in certain parts of the game (albeit with Temporal Anti Aliasing, to spread the calculation over several frames):

![Uncharted 4 spotlight](/img/features/rsmgi/uncharted4_rsm.jpg)

Notice the red light bleeding to the ceiling and statue.

### How it works

RSM works by rendering the scene from the point of view of light - exactly as we do to generate the depth texture for shadow mapping - but in addition to the depth texture (in fact, we generate a position texture instead of a depth texture, to save a few calculations later on), we also generate a normal and a flux (albedo) texture. Each texel in the flux texture is used as a Virtual Point Light (VPL) that illuminates every point in the scene. The position texture is used to reconstruct a 3D space point from each texel, and the normal is needed to calculate the GI light contribution.

| Position texture | Normal texture | Flux texture |
|------------------|----------------|--------------|
|![Position texture](/img/features/rsmgi/rsm_position.jpg)|![Normal texture](/img/features/rsmgi/rsm_normal.jpg)|![Flux texture](/img/features/rsmgi/rsm_flux.jpg)|

(the flux texture appears as an ellipse because the light used in the scene is a spotlight)

As you can see, RSM itself is simply a means of generating light-specific textures. These textures can then be used in a GI calculation or for any other purpose. This is why it is implemented as a specific class in Babylon.js ([BABYLON.ReflectiveShadowMap](/typedoc/classes/babylon.reflectiveshadowmap)), which can be used on its own.

## Using RSM for Global Illumination

### GI algorithm

Once the RSM textures have been generated, we can use them to calculate the GI contribution according to the formula described in the article referenced in the **Historical context** section.

During final rendering, when we calculate the color of a pixel, we gather the light from all the VPLs to generate the final color.

Depending on the size of the RSM texture, this can represent a lot of calculations, which is why we generally limit ourselves to the VPLs located inside a circle centered on the pixel we're shading, after projecting this pixel inside the RSM texture (the circle is defined by its *radius* in the RSM texture). The reasoning is as follows: pixels in the RSM texture close to the (projected) pixel we're shading are also close in 3D world space. This isn't always true, but it's a pretty good approximation.

We could, however, still have many VPLs inside this circle, so another parameter of the algorithm is the *number of samples* we want to take inside this circle. The VPLs will be chosen randomly within the circle (see article for details), up to the number of samples chosen.

### Improving result

As we only take a limited number of samples to calculate the GI contribution to a pixel, artifacts will be clearly visible (the images below only show the GI contribution):

|||
|-|-|
|![Shoe](/img/features/rsmgi/shoe_noblur.jpg)|![Cornell](/img/features/rsmgi/cornell_noblur.jpg)|

That's why we've set up a blur pass to deal with these artifacts:

|||
|-|-|
|![Shoe](/img/features/rsmgi/shoe_blur.jpg)|![Cornell](/img/features/rsmgi/cornell_blur.jpg)|

There are a number of parameters linked to the blur pass, which we'll describe later in the appropriate section.

### Implementation classes

The [BABYLON.GIRSMManager](/typedoc/classes/babylon.girsmmanager) class is responsible for implementing this GI algorithm in Babylon.js. The [BABYLON.GIRSM](/typedoc/classes/babylon.girsm) class is used to store global illumination parameters for a reflective shadow map (such as the *radius* or *number of samples* described above). Instances of this class are used by the `GIRSMManager` class to generate global illumination for a scene.

You can create an instance of the `ReflectiveShadowMap` class in this way, to wrap an existing light:
```javascript
const rsm = new BABYLON.ReflectiveShadowMap(scene, light, { width: 512, height: 512 });
rsm.addMesh(); // no specific mesh transmitted to addMesh, so all meshes in the scene are added and will be rendered in the RSM
```

Our implementation supports GI for directional and spot lights. You can also enable GI for multiple lights, but be aware of the impact on performance! If you know that only a subset of meshes will be impacted by a light, you should call `BABYLON.ReflectiveShadowMap.addMesh` with that subset, to improve performance.

Once you have an instance of `ReflectiveShadowMap`, you can add it to the GI manager:
```javascript
const outputDimensions = {
    width: engine.getRenderWidth(true),
    height: engine.getRenderHeight(true),
};

const defaultGITextureRatio = 2;

const giTextureDimensions = {
    width: Math.floor(engine.getRenderWidth(true) / defaultGITextureRatio),
    height: Math.floor(engine.getRenderHeight(true) / defaultGITextureRatio),
};

const giRSMMgr = new BABYLON.GIRSMManager(scene, outputDimensions, giTextureDimensions, 2048);

giRSMMgr.addGIRSM(giRSMs);
giRSMMgr.addMaterial(); // no specific material transmitted to addMaterial, so all materials in the scene will be configured to render with GI
```

GI rendering is configured at material level, with the `BABYLON.GIRSMManager.addMaterial` call. If you don't want all the materials in the scene to be configured to use GI, you need to pass this function an array with the materials you want.

From here, you can modify the RSM parameters and/or the GI manager parameters, which we'll describe in the next section.

## Parameter description

This section describes the parameters you can use to adapt the GI contribution to your needs (in terms of quality and performance).

## Shortcomings

The biggest flaw of this algorithm is that it doesn't manage occlusion, so even if a VPL shouldn't illuminate a given pixel because there's a solid object in between, the pixel will still be illuminated. It's called a "light leak" and there's nothing you can do about it. That's the price to pay for such a simple algorithm.

Another problem is computation time, which you can mitigate by modifying the many parameters described in the previous sections.

Furthermore, as described in the introduction, the algorithm is best suited to small scenes, so it probably won't work if you want to use it in a large level within your game.