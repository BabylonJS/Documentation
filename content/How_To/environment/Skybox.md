---
title: Skyboxes
image: /img/getstarted/skybox_px.jpg
description: Learn how to add a skybox to your Babylon.js scene.
keywords: diving deeper, environment, skybox
further-reading:
    - title: Reflections and Refractions
      url: /divingDeeper/materials/using/reflectionTexture
video-overview:
video-content:
---

## About Skyboxes
A simulated sky can be added to a scene using a "skybox" ([wikipedia](https://en.wikipedia.org/wiki/Skybox_(video_games))). A skybox is a large standard cube surrounding the scene, with a sky image painted on each face. Using a skybox is easier and faster than building a full 3D model of the sky and distant scenery.

## Creating a Cube Texture
Skybox images are usually loaded with [CubeTexture](/typedoc/classes/babylon.cubetexture). Its [constructor](/typedoc/classes/babylon.cubetexture#constructor) takes a base URL and (by default) appends "\_px.jpg", "\_nx.jpg", "\_py.jpg", "\_ny.jpg", "\_pz.jpg" and "\_nz.jpg" to load the +x, -x, +y, -y, +z, and -z facing sides of the cube. (These suffixes may be customized if needed.)

![Diagram of X/Y/Z axes and CubeTexture sides](/img/how_to/Materials/cubetexture1.png)

(Note, despite being a "Texture", CubeTexture can ONLY be used with [reflectionTexture and refractionTexture](/materials/using/reflectionTexture), NOT other Material properties like diffuseTexture. [See below](#makingtheskybox) for how to make this work for a skybox.)

## Making or Finding Skybox Images
These are some example skybox images:

<table><tbody><tr>
<td><img src="/img/getstarted/skybox_px.jpg" width="100" height="100" caption="skybox_px.jpg" alt="some clouds"/></td>
<td><img src="/img/getstarted/skybox_nx.jpg" width="100" height="100" caption="skybox_nx.jpg" alt="more clouds"/></td>
<td><img src="/img/getstarted/skybox_py.jpg" width="100" height="100" caption="skybox_py.jpg" alt="the sun overhead"/></td>
<td><img src="/img/getstarted/skybox_ny.jpg" width="100" height="100" caption="skybox_ny.jpg" alt="solid gray"/></td>
<td><img src="/img/getstarted/skybox_pz.jpg" width="100" height="100" caption="skybox_pz.jpg" alt="more clouds"/></td>
<td><img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" caption="skybox_nz.jpg" alt="more clouds"/></td>
</tr></tbody></table><p/>

Notice that the images match seamlessly at the edges of the box:

<table style={{width: 0}}><tbody><tr>
<td style={{padding: 0}}><img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" caption="skybox_nz.jpg" alt="some clouds"/></td>
<td style={{padding: 0}}><img src="/img/getstarted/skybox_nx.jpg" width="100" height="100" caption="skybox_nx.jpg" alt="adjacent clouds"/></td>
<td style={{padding: 0}}><img src="/img/getstarted/skybox_pz.jpg" width="100" height="100" caption="skybox_pz.jpg" alt="adjacent clouds"/></td>
<td style={{padding: 0}}><img src="/img/getstarted/skybox_px.jpg" width="100" height="100" caption="skybox_px.jpg" alt="adjacent clouds"/></td>
<td style={{padding: 0}}><img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" caption="skybox_nz.jpg" alt="wrapping around to the original clouds"/></td>
</tr></tbody></table><p/>

You can search the web for "skybox images" and find many examples. These are often a single image of an unfolded cube, which you would need to slice into the six separate images for CubeTexture to load. The [cube textures in the playground library](/toolsAndResources/assetLibraries/availableTextures#cubetextures) may also be useful, and they are already in the appropriate format.

## Making the Skybox
Cube textures must be applied using [reflectionTexture](/divingDeeper/materials/using/reflectionTexture) even though skyboxes are not reflection maps. Setting [coordinatesMode](/typedoc/classes/babylon.texture#coordinatesmode) to SKYBOX\_MODE paints the texture directly on the cube rather than simulating reflections.

Within the playground you can copy and paste the following into your scene:

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

More generally, skybox images may be referenced in the following way:

```javascript
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("PATH TO IMAGES FOLDER/COMMON PART OF NAMES", scene);
```

<Playground id="#UU7RQ#1" title="Simple Skybox Example" description="Simple example of how to add a skybox to your scene." image="/img/playgroundsAndNMEs/divingDeeperEnvironmentSkybox1.jpg"/>
