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

<Playground id="#K1Y1Q8" title="Default Atmosphere" description="The default atmosphere with Earth-like scattering parameters." />

<br/>
<br/>
By default, the atmosphere addon uses Earth-like scattering parameters.

## Rayleigh Scattering
Rayleigh scattering can have a strong effect on the overall color of the atmosphere.

<Playground id="#K1Y1Q8#1" title="Green Rayleigh Scattering" description="Create a green sky by increasing Rayleigh scattering in the green channel." />

```
atmosphere.physicalProperties.peakRayleighScattering = new Vector3(0.001 /* r */, 0.034 /* g */, 0.001 /* b */);
```

## Mie Scattering and Absorption
Mie scattering and absorption affect the haziness of the atmosphere.

<Playground id="#K1Y1Q8#2" title="Increased Mie Scattering" description="Increased Mie scattering for a hazier atmosphere." />

```javascript
atmosphere.physicalProperties.mieScatteringScale = 100;
```

## Ozone Absorption
Ozone absorption can also affect the color of the atmosphere.

<Playground id="#K1Y1Q8#3" title="Increased Ozone Absorption" description="Increased Ozone absorption for a deeper blue sky." />

```javascript
atmosphere.physicalProperties.ozoneAbsorptionScale = 5;
```

## Multiple Scattering
Multiple Scattering simulates light within the atmosphere that has scattered more than once. This affects the brightness of the atmosphere but can also affect the overall color, especially depending on the ground albedo.

<Playground id="#K1Y1Q8#4" title="Increased Multiple Scattering" description="Increased multiple scattering and red ground albedo." />

```javascript
atmosphere.multiScatteringIntensity = 4.0;
atmosphere.groundAlbedo = new Color3(1.0, 0.2, 0.2);
```

## Optimization and Quality

By default, the atmosphere uses look up tables (LUTs) for improved efficiency. To fallback to the more expensive but higher quality ray marching, use the following properties.

<Playground id="#K1Y1Q8#5" title="Full Ray Marching" description="The default atmosphere with Earth-like scattering parameters and full ray marching." />

```javascript
atmosphere.isAerialPerspectiveLutEnabled = false;
atmosphere.isSkyViewLutEnabled = false;
```

## Time of Day

The atmosphere can simulate different times of day by changing the direction of the light.

Typically, a -Y light direction can be used to simulate a directly overhead sun, although this depends on what is considered the up vector of the scene.

<Playground id="#K1Y1Q8#7" title="Day-Night Animation" description="Simulating different times of day by animating the sun position." />

```javascript
// Assuming +Y is up
light.direction = new Vector3(0, -1, 0); // Day
light.direction = new Vector3(0, 1, 0); // Night
light.direction = new Vector3(1, 0, 0); // Sunrise/Sunset
```

To simulate night, a minimum multiple scattering intensity can be set. This maintains some ambient light in the atmosphere even when the sun is below the horizon.

```javascript
atmosphere.minimumMultiScatteringIntensity = 0.1;
```

## Illuminating Objects: PBRMaterial Integration

By default, the atmosphere addon integrates with the PBRMaterial. This allows for consistent lighting of objects, taking into account atmospheric effects.

<Playground id="#K1Y1Q8#8" title="PBR Integration" description="A PBR sphere rendered within the atmosphere." />