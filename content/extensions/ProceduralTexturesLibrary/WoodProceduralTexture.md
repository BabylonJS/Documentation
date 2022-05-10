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

![Wood Procedural texture](/img/extensions/proceduraltextures/woodpt.PNG)

## Using the Wood procedural texture

Wood procedural texture can be found here: 
- Normal: [Normal](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.woodProceduralTexture.js)
- Minified : [Minified](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.woodProceduralTexture.min.js)

A demo can be found here: <Playground id="#K41IJ" title="Wood Procedural Texture Demo" description="Wood Procedural Texture Demo"/>

This texture has 2 parameters :
- **woodColor** to modify the color of the wood in the texture (BABYLON.Color3/4)
- **ampScale** to change the waves amplitude in the wood (BABYLON.Vector2)

```javascript
var woodMaterial = new BABYLON.StandardMaterial("woodMat", scene);
var woodTexture = new BABYLON.WoodProceduralTexture("woodTex", 1024, scene);
woodTexture.ampScale = 80.0;
woodMaterial.diffuseTexture = woodTexture;
```