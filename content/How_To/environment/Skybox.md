---
title: Skyboxes
image: 
description: Learn how to add a skybox to your Babylon.js scene.
keywords: diving deeper, environment, skybox
further-reading:
    - title: Reflections and Refractions
      url: /divingDeeper/materials/using/reflectionTexture
video-overview:
video-content:
---

## How To Use a Skybox
A simulated sky can be added to a scene using a skybox. This is created using a large standard box, special reflective textures and a group of six images, one for each face of the cube.

## Sky Images
Six jpeg images are necessary to create a skybox, all of them should be square and of the same size which is best as a power of 2, eg 1024px x 1024px.
The name for each image should have a common part followed by a position given by _px, _nx, _py, _ny, _pz or _nz corresponding whether 
it is on the positive (p) or negative (n) x, y or z axis.

Example Images:

![Skybox](/img/how_to/skybox.png)

Notice that the images match seamlessly at the edges of the box:

![Seamless Skybox](/img/how_to/skybox1.png)

Skybox images can be found on the web by searching for skybox images. Generally, these are single images in the form of a net of a box and you will 
need to separate them into individual images and save each.

You can also use [library textures in the playground](/toolsAndResources/assetLibraries/availableTextures#cubetextures).

## Skybox Code 
Within the playground you can copy and paste the following into your scene.

```javascript
var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;
```

More generally the images are referenced in the following way

```javascript
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("PATH TO IMAGES FOLDER/COMMON PART OF NAMES", scene);
```

<Playground id="#UU7RQ#1" title="Simple Skybox Example" description="Simple example of how to add a skybox to your scene." image="/img/playgroundsAndNMEs/divingDeeperEnvironmentSkybox1.jpg"/>