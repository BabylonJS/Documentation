---
title: Road Procedural Texture
image: 
description: Check out the free Road Procedural Texture.
keywords: babylon.js, tools, resources, assets, library, procedural texture, road
further-reading:
video-overview:
video-content:
---

# Road Procedural texture

![Road Procedural texture](/img/extensions/proceduraltextures/roadpt.PNG)

## Using the Road procedural texture

Road procedural texture can be found here:

- Normal: [Normal](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.roadProceduralTexture.js)
- Minified: [Minified](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.roadProceduralTexture.min.js)

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

A demo can be found here: <Playground id="#FBW4N#0" title="Road Procedural Texture Demo" description="Road Procedural Texture Demo"/>

This texture has 1 parameter :
- **roadColor** is the color for the road (BABYLON.Color3/4)

```javascript
var roadmaterial = new BABYLON.StandardMaterial("roadMat", scene);
var roadmaterialpt = new BABYLON.RoadProceduralTexture("roadTex", 512, scene);
roadmaterial.diffuseTexture = roadmaterialpt;
```