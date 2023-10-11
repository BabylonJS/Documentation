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

![Cloud Procedural texture](/img/extensions/proceduraltextures/cloudpt.PNG)

## Using the cloud procedural texture

Cloud procedural texture can be found here: 
- Normal: [Normal](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.cloudProceduralTexture.js)
- Minified: [Minified](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylon.cloudProceduralTexture.min.js)

> ⚠️ WARNING: The CDN should not be used in production environments. Please use self-hosting for production.

A demo can be found here: <Playground id="#NQDNM#0" title="Cloud Procedural Texture Demo" description="Cloud Procedural Texture Demo"/>

This texture has 2 parameters :
- **skyColor** : the color for the sky (BABYLON.Color3/4)
- **cloudColor** : the color for the cloud (BABYLON.Color3/4)

Sample to create a cloudy sky

```javascript
var cloud = BABYLON.MeshBuilder.CreateSphere("cloud", { segments: 100, diameter: 1000 }, scene);
var cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
var cloudProcTexture = new BABYLON.CloudProceduralTexture("cloudTex", 1024, scene);
cloudMaterial.emissiveTexture = cloudProcTexture;
cloudMaterial.backFaceCulling = false;
cloudMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
cloud.material = cloudMaterial;
cloud.position = new BABYLON.Vector3(0, 0, 12);
```