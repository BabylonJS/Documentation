---
title: Wood Procedural Texture
image: 
description: Check out the free Wood Procedural Texture.
keywords: babylon.js, tools, resources, assets, library, procedural texture, wood
further-reading:
video-overview:
video-content:
---

# Wood Procedural texture

![Wood Procedural texture](/img/extensions/proceduraltextures/woodpt.png)

## Using the Wood procedural texture

Wood procedural texture can be found here: 
- Normal: [Normal](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.woodProceduralTexture.js)
- Minified : [Minified](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.woodProceduralTexture.min.js)

A demo can be found here: <Playground id="#K41IJ" title="Wood Procedural Texture Demo" description="Wood Procedural Texture Demo" image=""/>

This texture has 2 parameters :
- **woodColor** to modify the color of the wood in the texture (BABYLON.Color3/4)
- **ampScale** to change the waves amplitude in the wood (BABYLON.Vector2)


```
	var woodMaterial = new BABYLON.StandardMaterial(name, scene);
    var woodTexture = new BABYLON.WoodProceduralTexture(name + "text", 1024, scene);
    woodTexture.ampScale = 80.0;
    woodMaterial.diffuseTexture = woodTexture;
```