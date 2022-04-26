---
title: Cloud Procedural Texture
image: 
description: Check out the free Cloud Procedural Texture.
keywords: babylon.js, tools, resources, assets, library, procedural texture, cloud
further-reading:
video-overview:
video-content:
---

# Cloud Procedural texture

![Cloud Procedural texture](/img/features/extensions/proceduraltextures/cloudpt.png)

## Using the cloud procedural texture

Cloud procedural texture can be found here: 
- Normal: [Normal](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.cloudProceduralTexture.js)
- Minified : [Minified](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.cloudProceduralTexture.min.js)

A demo can be found here:  <Playground id="#NQDNM#0" title="Cloud Procedural Texture Demo" description="Cloud Procedural Texture Demo"/>

This texture has 2 parameters :
- **skyColor** : the color for the sky (BABYLON.Color3/4)
- **cloudColor** : the color for the cloud (BABYLON.Color3/4)

Sample to create a cloudy sky

```
var boxCloud = BABYLON.Mesh.CreateSphere("boxCloud", 100, 1000, scene);
boxCloud.position = new BABYLON.Vector3(0, 0, 12);
var cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
var cloudProcText = new BABYLON.CloudProceduralTexture("cloud", 1024, scene);
cloudMaterial.emissiveTexture = cloudProcText;
cloudMaterial.backFaceCulling = false;
cloudMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
boxCloud.material = cloudMaterial;