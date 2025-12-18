---
title: Atmosphere
image:
description: The atmosphere addon provides a physically based sky and aerial perspective rendering, supporting views from ground to space.
further-reading:
video-overview:
video-content:
---

# Atmosphere

## Introduction

The atmosphere addon provides physically based sky and aerial perspective, supporting views from ground to space.

<Playground id="#K1Y1Q8#40" title="Default Atmosphere" description="The default atmosphere with Earth-like scattering parameters." />

## Scene Setup

### PBRMaterial

For rendering objects within the atmosphere, it is recommended to use [physically based materials (PBR)](/features/featuresDeepDive/materials/using/introToPBR).

<Playground id="#K1Y1Q8#26" title="PBR Integration" description="A PBR sphere rendered within the atmosphere." />

<br/>
<br/>

The atmosphere addon automatically integrates with `PBRMaterial`s, allowing for consistent lighting of objects, taking into account atmospheric effects.

### Directional Light

The sun source for the atmosphere is represented by a `DirectionalLight`.

```javascript
const light = new DirectionalLight("sun", new Vector3(0, -1, 0), scene);
light.intensity = Math.PI; // Set intensity for PBRMaterials
```

To get the correct brightness on `PBRMaterial`s, the light intensity can simply be set to PI. This will cancel out the 1/PI factor from the PBR rendering.

A more physically-based `DirectionalLight` setup is possible by leveraging the [IntensityMode](/features/featuresDeepDive/materials/using/masterPBR#intensitymode) to specify the light in physical units (e.g., lux or nits).

### Rendering Pipeline

To allow for dynamic range and accurate lighting calculations, the `DefaultRenderingPipeline` can be used.

```javascript
const pipeline = new DefaultRenderingPipeline("Default", true /* hdr */, scene);
pipeline.imageProcessingEnabled = true;
pipeline.imageProcessing.toneMappingEnabled = true;
pipeline.imageProcessing.ditheringEnabled = true;
```

Tonemapping can be enabled to better handle the high dynamic range of the atmosphere, and dithering will help reduce color banding in the sky.

## Customizing the Atmosphere

The atmosphere is created by specifying the directional light.

```javascript
const atmosphere = new Atmosphere("atmosphere", scene, [ light ]);
// True if rendering to a linear target (e.g. DefaultRenderingPipeline)
atmosphere.isLinearSpaceComposition = true;
// True if light value in the scene is expected to be linear (e.g. PBRMaterials)
atmosphere.isLinearSpaceLight = true;
```

By default, Earth-like scattering parameters and dimensions will be used. This can be further customized.

### Rayleigh Scattering

Rayleigh scattering can have a strong effect on the overall color of the atmosphere.

<Playground id="#K1Y1Q8#39" title="Green Rayleigh Scattering" description="Create a green sky by increasing Rayleigh scattering in the green channel." />

```
atmosphere.physicalProperties.peakRayleighScattering =
    new Vector3(0.001, 0.034, 0.001); // r, g, b
```

### Mie Scattering and Absorption

Mie scattering and absorption affect the haziness of the atmosphere.

<Playground id="#K1Y1Q8#34" title="Increased Mie Scattering" description="Increased Mie scattering for a hazier atmosphere." />

```javascript
atmosphere.physicalProperties.mieScatteringScale = 100;
```

### Ozone Absorption

Ozone absorption can also affect the color of the atmosphere.

<Playground id="#K1Y1Q8#35" title="Increased Ozone Absorption" description="Increased Ozone absorption for a deeper blue sky." />

```javascript
atmosphere.physicalProperties.ozoneAbsorptionScale = 5;
```

### Multiple Scattering

Multiple Scattering simulates light within the atmosphere that has scattered more than once. This affects the brightness of the atmosphere but can also affect the overall color, especially depending on the ground albedo.

<Playground id="#K1Y1Q8#36" title="Increased Multiple Scattering" description="Increased multiple scattering and red ground albedo." />

```javascript
atmosphere.multiScatteringIntensity = 4.0;
atmosphere.groundAlbedo = new Color3(1.0, 0.2, 0.2);
```

### Optimization and Quality

By default, the atmosphere uses look up tables (LUTs) for improved efficiency. To fall back to the more expensive but higher quality ray marching, use the following properties.

<Playground id="#K1Y1Q8#37" title="Full Ray Marching" description="The default atmosphere with Earth-like scattering parameters and full ray marching." />

```javascript
atmosphere.isAerialPerspectiveLutEnabled = false;
atmosphere.isSkyViewLutEnabled = false;
```

## Time of Day

The atmosphere can simulate different times of day by changing the direction of the light.

Typically, a -Y light direction can be used to simulate a directly overhead sun, although this depends on what is considered the up vector of the scene.

<Playground id="#K1Y1Q8#38" title="Day-Night Animation" description="Simulating different times of day by animating the sun position." />

```javascript
// Assuming +Y is up
light.direction = new Vector3(0, -1, 0); // Day
light.direction = new Vector3(0,  1, 0); // Night
light.direction = new Vector3(1,  0, 0); // Sunrise/Sunset
```

To simulate night, a minimum multiple scattering intensity can be set. This maintains some ambient light in the atmosphere even when the sun is below the horizon.

```javascript
atmosphere.minimumMultiScatteringIntensity = 0.1;
```
