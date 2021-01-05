---
title: Mix Material
image: 
description: The Babylon.js materials library mix map textures.
keywords: welcome, babylon.js, library, materials, materials library, mix materil
further-reading:
video-overview:
video-content:
---

![Mix Material](/img/extensions/materials/mixResult.png)

## Playground example

PG: <Playground id="#1DFTDT" title="Mix Material" description="Example of mix material"/>/)

## Using the mix material

The mix material is based on the terrain material but works with up to 8 diffuse textures. It is composed of:
- 8 Diffuse textures. (at least 4 required)
- 2 Mixmap textures: represents the intensity of each diffuse texture according the channels R (red), G (green), B (blue) and A (alpha). (at least one required)

__Note 1: the alpha channel is inverted in order to help creating the mix map textures. In other words, less you have alpha, more the diffuse texture attached to the alpha channel will be visible.__

__Note 2: the mix material doesn't support bump mapping for instance.__

```
// Create a terrain
var terrain = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "heightMap.png", 100, 100, 100, 0, 10, scene, false);

// Create the mix material
var mix = new BABYLON.MixMaterial("mix", scene);

// Mix texture 1 (RGBA) is required
mix.mixTexture1 = new BABYLON.Texture("/playground/textures/mixMap.png", scene);

// Mix texture 2 (RGBA) is optional
mix.mixTexture2 = new BABYLON.Texture("/playground/textures/mixMap_2.png", scene);

// Diffuse textures (RGBA) attached to the "mixTexture1"
mix.diffuseTexture1 = new BABYLON.Texture("/playground/textures/floor.png", scene);
mix.diffuseTexture2 = new BABYLON.Texture("/playground/textures/rock.png", scene);
mix.diffuseTexture3 = new BABYLON.Texture("/playground/textures/grass.png", scene);
mix.diffuseTexture4 = new BABYLON.Texture("/playground/textures/floor.png", scene);

// Diffuse textures (RGBA) attached to the "mixTexture2"
mix.diffuseTexture5 = new BABYLON.Texture("/playground/textures/leopard_fur.jpg", scene);
mix.diffuseTexture6 = new BABYLON.Texture("/playground/textures/fur.jpg", scene);
mix.diffuseTexture7 = new BABYLON.Texture("/playground/textures/sand.jpg", scene);
mix.diffuseTexture8 = new BABYLON.Texture("/playground/textures/crate.png", scene);

// Apply the material
terrain.material = mix;
```

That's all!

## Result with only the mix texture 1
With ```mix.mixTexture2``` undefined or null, the material will only apply the mix texture 1:

![Mix Texture 1](/img/extensions/materials/mixMap.png)
![Mix Material 1](/img/extensions/materials/terrainMixtexture1.png)

## Result with both mix textures 1 & 2
With ```mix.mixTexture2 = new BABYLON.Texture("/playground/textures/mixMap_2.png", scene)``` the material will continue mixing the mix texture 1 with the mix texture2. Then, you are able to mix up to 8 diffuse textures:

![Mix Texture 2](/img/extensions/materials/mixMap_2.png)
![Mix Material 2](/img/extensions/materials/mixResult.png)
