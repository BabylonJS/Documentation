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

![Marble Procedural texture](/img/features/extensions/proceduraltextures/marblept.png)

## Using the Marble procedural texture

Marble procedural texture can be found here: 
- Normal: [Normal](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.marbleProceduralTexture.js)
- Minified : [Minified](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.marbleProceduralTexture.min.js)

A demo can be found here:  <Playground id="#HS1SK#4" title="Marble Procedural Texture Demo" description="Marble Procedural Texture Demo"/>

This texture has 4 parameters :
- **numberOfTilesHeight** controls the number of tiles in height (Int)
- **numberOfTilesWidth** controls the number of tiles in width (Int)
- **jointColor** changes the color for the joint between tiles (BABYLON.Color3/4)
- **marbleColor** changes the color for the tile itself (BABYLON.Color3/4)


```
	var marbleMaterial = new BABYLON.StandardMaterial("torus", scene);
    var marbleTexture = new BABYLON.MarbleProceduralTexture("marble", 512, scene);
    marbleTexture.numberOfTilesHeight = 5;
    marbleTexture.numberOfTilesWidth = 5;
    marbleMaterial.ambientTexture = marbleTexture;
```
