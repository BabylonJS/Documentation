---
title: Fire Procedural Texture
image: 
description: Check out the free Fire Procedural Texture.
keywords: babylon.js, tools, resources, assets, library, procedural texture, fire
further-reading:
video-overview:
video-content:
---

# Fire Procedural texture

![Fire Procedural texture](/img/extensions/proceduraltextures/firept.PNG)

## Using the Fire procedural texture

Fire procedural texture can be found here: 
- Normal: [Normal](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.fireProceduralTexture.js)
- Minified : [Minified](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.fireProceduralTexture.min.js)

A demo can be found here:  <Playground id="#KM3TC" title="Fire Procedural Texture" description="Fire Procedural Texture"/>

This texture has 4 parameters :
- **time** can be set manually(float) if autoGenerateTime(boolean) is set to false. It is used inside the fire shader to animate it
- **speed** controls the velocity (speed and direction) of the flames (BABYLON.Vector2)
- **fireColors** is an array of 6 (BABYLON.Color3/4) defining the different color of the fire. You can define them manually of use presets available as static properties of the class (PurpleFireColors, GreenFireColors, RedFireColors, BlueFireColors)

```javascript
var fireMaterial = new BABYLON.StandardMaterial("fireMat", scene);
var fireTexture = new BABYLON.FireProceduralTexture("fireTex", 256, scene);
fireMaterial.diffuseTexture = fireTexture;
fireMaterial.opacityTexture = fireTexture;
```
