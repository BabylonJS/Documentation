---
title: Getting Started - Chapter 5 - Skies Above
image: 
description: Learn to add a skybox to your scene.
keywords: getting started, start, chapter 5, environment, skybox
further-reading:
    - title: Skyboxes
      url: /features/featuresDeepDive/environment/skybox
video-overview:
video-content:
---

# Getting Started - Skies Above

We can simulate the appearance of a sky by applying six suitable images to the insides of a large [skybox](/features/featuresDeepDive/environment/skybox) cube. (Images are a lot easier and faster to render than 3D objects, and just as good for far-distant scenery.)

Skybox images are usually loaded with [CubeTexture](/typedoc/classes/babylon.cubetexture). CubeTexture's constructor takes a base URL and (by default) appends "\_px.jpg", "\_nx.jpg", "\_py.jpg", "\_ny.jpg", "\_pz.jpg", and "\_nz.jpg" to load the +x, -x, +y, -y, +z, and -z facing sides of the cube.

|<img src="/img/getstarted/skybox_px.jpg" width="100" height="100" alt="some clouds"/>|<img src="/img/getstarted/skybox_nx.jpg" width="100" height="100" alt="more clouds"/>|<img src="/img/getstarted/skybox_py.jpg" width="100" height="100" alt="the sun overhead"/>|<img src="/img/getstarted/skybox_ny.jpg" width="100" height="100" alt="solid gray"/>|<img src="/img/getstarted/skybox_pz.jpg" width="100" height="100" alt="more clouds"/>|<img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" alt="more clouds"/>|
|:---:|:---:|:---:|:---:|:---:|:---:|
|skybox\_px.jpg|skybox\_nx.jpg|skybox\_py.jpg|skybox\_ny.jpg|skybox\_pz.jpg|skybox\_nz.jpg|
<br/>

Cube textures must be applied using [reflectionTexture](/features/featuresDeepDive/materials/using/reflectionTexture) even though the skybox is not a reflection map. Setting [coordinatesMode](/typedoc/classes/babylon.texture#coordinatesmode) to SKYBOX\_MODE paints the texture directly on the cube rather than simulating reflections.

```javascript
const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, scene);
const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;
```

We also restrict the camera so that it cannot move below ground level.

```javascript
camera.upperBetaLimit = Math.PI / 2.2;
```

<Playground id="#KBS9I5#88" title="Adding a Skybox" description="Add a skybox to your scene." image="/img/playgroundsAndNMEs/gettingStartedSkyBox.jpg"/><br/>
<br/>

After making a sky, the next environmental improvement is to [grow some trees](/features/introductionToFeatures/chap5/trees).
