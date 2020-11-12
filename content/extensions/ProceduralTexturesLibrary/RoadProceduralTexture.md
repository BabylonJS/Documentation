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

![Road Procedural texture](/img/extensions/proceduraltextures/roadpt.png)

## Using the Road procedural texture

Road procedural texture can be found here: 
- Normal: [Normal](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.roadProceduralTexture.js)
- Minified : [Minified](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/proceduralTexturesLibrary/babylon.roadProceduralTexture.min.js) 

A demo can be found here: <Playground id="#FBW4N#0" title="Road Procedural Texture Demo" description="Road Procedural Texture Demo" image=""/>

This texture has 1 parameter :
- **roadColor** is the color for the road (BABYLON.Color3/4)


```
    var roadmaterial = new BABYLON.StandardMaterial("road", scene);
    var roadmaterialpt = new BABYLON.RoadProceduralTexture("customtext", 512, scene);
    roadmaterial.diffuseTexture = roadmaterialpt;
```