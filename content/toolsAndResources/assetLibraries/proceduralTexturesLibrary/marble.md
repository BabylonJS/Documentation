---
title: Marble Procedural Texture
image: 
description: Check out the free Marble Procedural Texture.
keywords: babylon.js, tools, resources, assets, library, procedural texture, marble
further-reading:
video-overview:
video-content:
---

# Marble Procedural texture

![Marble Procedural texture](/img/extensions/proceduraltextures/marblept.PNG)

## Using the Marble procedural texture

Marble procedural texture can be found here:

- Normal: [Normal](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.marbleProceduralTexture.js)
- Minified : [Minified](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.marbleProceduralTexture.min.js)

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

A demo can be found here:  <Playground id="#HS1SK#4" title="Marble Procedural Texture Demo" description="Marble Procedural Texture Demo"/>

This texture has 4 parameters :
- **numberOfTilesHeight** controls the number of tiles in height (Int)
- **numberOfTilesWidth** controls the number of tiles in width (Int)
- **jointColor** changes the color for the joint between tiles (BABYLON.Color3/4)
- **marbleColor** changes the color for the tile itself (BABYLON.Color3/4)

```javascript
var marbleMaterial = new BABYLON.StandardMaterial("marbleMat", scene);
var marbleTexture = new BABYLON.MarbleProceduralTexture("marbleTex", 512, scene);
marbleTexture.numberOfTilesHeight = 5;
marbleTexture.numberOfTilesWidth = 5;
marbleMaterial.ambientTexture = marbleTexture;
```