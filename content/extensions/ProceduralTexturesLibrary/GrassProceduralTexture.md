---
title: Grass Procedural Texture
image: 
description: Check out the free Grass Procedural Texture.
keywords: babylon.js, tools, resources, assets, library, procedural texture, grass
further-reading:
video-overview:
video-content:
---

# Grass Procedural texture

![Grass Procedural texture](/img/extensions/proceduraltextures/grasspt.png)

## Using the Grass procedural texture

Grass procedural texture can be found here: 
- Normal: [Normal](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.grassProceduralTexture.js)
- Minified : [Minified](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.grassProceduralTexture.min.js)

A demo can be found here:  https://www.babylonjs-playground.com/#KM3TC#1

This texture has 2 parameters :
- **grassColors** is an array of 3 (BABYLON.Color3/4) for the grass. Should be green but you can create red grass if you want to (BABYLON.Color3/4)
- **groundColor** is the base color for the ground (BABYLON.Color3/4)


```
    var grassMaterial = new BABYLON.StandardMaterial(name + "bawl", scene);
    var grassTexture = new BABYLON.GrassProceduralTexture(name + "textbawl", 256, scene);
    grassMaterial.ambientTexture = grassTexture;
```