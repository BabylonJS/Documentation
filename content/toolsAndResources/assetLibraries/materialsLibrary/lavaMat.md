---
title: Lava Material
image: 
description: The Babylon.js materials library lava effect.
keywords: library, materials, materials library, lava, lava material
further-reading:
video-overview:
video-content:
---

![Screenshot](/img/extensions/materials/lava.webp)

PG: <Playground id="#1BLVWO#25" title="Lava Material" description="An example of lava material"/>

The Lava material can be found here: [https://cdn.babylonjs.com/materialsLibrary/babylon.lavaMaterial.js](https://cdn.babylonjs.com/materialsLibrary/babylon.lavaMaterial.js)

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

## Using the lava material

The lava material needs at least a noise texture and a diffuse texture to render properly.
Just create a new instance of the material and assign the two textures:

```
var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 512, height: 512, subdivisions: 32 }, scene);

var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);
lavaMaterial.noiseTexture = new BABYLON.Texture("cloud.png", scene); // Set the bump texture
lavaMaterial.diffuseTexture = new BABYLON.Texture("lavatile.jpg", scene); // Set the diffuse texture

ground.material = lavaMaterial;
```

The diffuse texture provides the color of your lava, while the noise texture represents the lava deformation.
Notice that this material updates the position of each vertex on your object. If there are not enough vertices,
some artifacts may appear.

## Lights
By default, the material is affected by lights. If you wish, you can disable this by using the unlit property.
```
material.unlit = true;
```

PG: <Playground id="#1BLVWO#22" title="Lava Material" description="Lava with unlit material"/>

## Customize the lava material

You can customize two properties of the material:

```
lavaMaterial.speed = 2.0; // Default 1. Represents speed of perturbations of the lava
lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0); // Default to (0,0,0) black. Represents the color of the fog displayed on the lava ground.
```
