---
title: Fire Material
image:
description: The Babylon.js materials library fire effects.
keywords: library, materials, materials library, fire, fire material
further-reading:
video-overview:
video-content:
---

![Fire material](/img/extensions/materials/fire.png)

## Using the fire material

Fire material can be found here: [https://cdn.babylonjs.com/materialsLibrary/babylon.fireMaterial.js](https://cdn.babylonjs.com/materialsLibrary/babylon.fireMaterial.js)

> ⚠️ WARNING: The CDN should not be used in production environments. Please use self-hosting for production.

A demo can be found here: PG: <Playground id="#NES8QN" title="Fire Material" description="Example of fire material"/>

The fire material works with 3 textures:

- The diffuse texture (fire texture)
- The distortion texture (to create perturbations on diffuse texture)
- The opacity texture (black and white)

**Note:** _The fire material doesn't work with lighting. So, shadow maps are also disabled._

```javascript
var fireMaterial = new BABYLON.FireMaterial("fireMaterial", scene);
fireMaterial.diffuseTexture = new BABYLON.Texture("diffuse.png", scene);
fireMaterial.distortionTexture = new BABYLON.Texture("distortion.png", scene);
fireMaterial.opacityTexture = new BABYLON.Texture("opacity.png", scene);

var plane = BABYLON.Mesh.CreatePlane("fireplane", 1.0, scene);
plane.material = fireMaterial;
```

The speed of fire flames can be customized like:

```javascript
fireMaterial.speed = 5.0; // Default is 1.0
```
