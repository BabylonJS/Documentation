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

![Grass Procedural texture](/img/extensions/proceduraltextures/grasspt.PNG)

## Using the Grass procedural texture

Grass procedural texture can be found here:

- Normal: [Normal](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.grassProceduralTexture.js)
- Minified : [Minified](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.grassProceduralTexture.min.js)

A demo can be found here: https://www.babylonjs-playground.com/#KM3TC#1

This texture has 2 parameters :

- **grassColors** is an array of 3 (BABYLON.Color3/4) for the grass. Should be green but you can create red grass if you want to (BABYLON.Color3/4)
- **groundColor** is the base color for the ground (BABYLON.Color3/4)

```javascript
var grassMaterial = new BABYLON.StandardMaterial("grassMat", scene);
var grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 256, scene);
grassMaterial.ambientTexture = grassTexture;
```
