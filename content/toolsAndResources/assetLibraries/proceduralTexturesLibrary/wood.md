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

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

A demo can be found here: <Playground id="#K41IJ#3" title="Wood Procedural Texture Demo" description="Wood Procedural Texture Demo"/>

This texture has 2 parameters :
- **woodColor** to modify the color of the wood in the texture (BABYLON.Color3/4)
- **ampScale** to change the waves amplitude in the wood (BABYLON.Vector2)

```javascript
var woodMaterial = new BABYLON.StandardMaterial("woodMat", scene);
var woodTexture = new BABYLON.WoodProceduralTexture("woodTex", 1024, scene);
woodTexture.ampScale = 80.0;
woodMaterial.diffuseTexture = woodTexture;
```