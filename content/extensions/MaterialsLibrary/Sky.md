---
title: Sky Material
image: 
description: The Babylon.js materials library sky material allows the creation of dynamic and texture free effects for skyboxes.
keywords: welcome, babylon.js, library, materials, materials library, sky, sky material
further-reading:
video-overview:
video-content:
---

![Sky Material](/img/extensions/materials/sky.png)

## Introduction

The sky material allows to create dynamic and texture free effects for skyboxes.

This work is based on ["A Practical Analytic Model for Daylight"](http://www.cs.utah.edu/~shirley/papers/sunsky/sunsky.pdf).
First implemented by [Simon Wallner](http://www.simonwallner.at/projects/atmospheric-scattering),
improved by [Martin Upitis](http://blenderartists.org/forum/showthread.php?245954-preethams-sky-impementation-HDR)
and finally implmented in Three.js by [zz85](http://twitter.com/blurspline)

The challenge for skyboxes is to reproduce and configure the sky taking care of the atmosphere state.
In other words, for example, determine how the light (from sun) is scattered by particles.

## Playground example

PG: <Playground id="#E6OZX#221" title="Sky Material" description="Sky material animation" image=""/>

Just press the following keys:
* 1: Set Day
* 2: Set Evening
* 3: Increase Luminance
* 4: Decrease Luminance
* 5: Increase Turbidity
* 6: Decrease Turbidity
* 7: Move horizon to -50
* 8: Restore horizon to 0

## How to use?

Simply create a skybox and assign a new instance of the Sky Material:
```
var skyMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
skyMaterial.backFaceCulling = false;

var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
skybox.material = skyMaterial;
```

That's all!

## Configuring the Sky Material

The aspect of the sky can be customized, including the day/night time. The properties are:

```
skyMaterial.turbidity = 1; // Represents the amount (scattering) of haze as opposed to molecules in atmosphere
```

![skyTurbidity](/img/extensions/materials/skyTurbidity.png)


```
skyMaterial.luminance = 1; // Controls the overall luminance of sky in interval ]0, 1,190[
```

![skyLuminance](/img/extensions/materials/skyLuminance.png)


```
// Control the planet's orientation over the sun
skyMaterial.inclination = 0.5; // The solar inclination, related to the solar azimuth in interval [0, 1]
skyMaterial.azimuth = 0.25; // The solar azimuth in interval [0, 1]
```

Otherwise, if you want to configure the sun position with a BABYLON.Vector3, you can set:

```
// Manually set the sun position
skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
skyMaterial.sunPosition = new BABYLON.Vector3(0, 100, 0);
```

![skyAzimuthInclination](/img/extensions/materials/skyAzimuthInclination.png)


```
skyMaterial.rayleigh = 2; // Represents the sky appearance (globally)
```

![skyRayleigh](/img/extensions/materials/skyRayleigh.png)


```
// Mie scattering (from [Gustav Mie](https://en.wikipedia.org/wiki/Gustav_Mie))
// Related to the haze particles in atmosphere

// The amount of haze particles following the Mie scattering theory
skyMaterial.mieDirectionalG = 0.8;

skyMaterial.mieCoefficient = 0.005; // The mieCoefficient in interval [0, 0.1], affects the property skyMaterial.mieDirectionalG
```

![skyMie](/img/extensions/materials/skyMie.png)

## Keeping the horizon relative to the camera elevation
In some cases, you would like to keep the horizon's "position" relative to the camera's position (typically a game where you can flight very high).
To do that, the material exposes a vector (`.cameraOffset`) that you can customize.

Typically:
```
// Set the horizon elevation relative to the camera position
skyMaterial.cameraOffset.y = scene.activeCamera.globalPosition.y;
```

**Note**: this will not modify the sun position as it considered enought far, even when camera is really high.

## Using the sky material to create a reflection texture

As a common technique, it would be useful to use the sky material result to reflect the environment. For example, using a PBR material.

The technique consists on creating a reflection probe (which is a cube texture) and render the sky mesh with the sky material assigned to it. As an example  PG: <Playground id="#4R1H1U" title="Sky Material" description="Example of sky material reflecting the environment" image=""/>
