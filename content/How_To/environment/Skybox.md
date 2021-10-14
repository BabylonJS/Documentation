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

A simulated sky can be added to a scene using a "skybox" ([wikipedia](<https://en.wikipedia.org/wiki/Skybox_(video_games)>)). A skybox is a large standard cube surrounding the scene, with a sky image painted on each face. (Images are a lot easier and faster to render than 3D objects, and just as good for far-distant scenery.)

In Babylon.js, skyboxes typically use [CubeTexture](/typedoc/classes/babylon.cubetexture) as a [pseudo-reflection texture](#making-the-skybox) on a large cube.

## Creating a CubeTexture

The [CubeTexture constructor](/typedoc/classes/babylon.cubetexture#constructor) takes a base URL and (by default) appends "\_px.jpg", "\_nx.jpg", "\_py.jpg", "\_ny.jpg", "\_pz.jpg" and "\_nz.jpg" to load the +x, -x, +y, -y, +z, and -z facing sides of the cube. (These suffixes may be customized if needed.)

CubeTexture images need to be .jpg format (unless the suffixes are customized) and square. For efficiency, use a power of 2 size, like 1024x1024.

![Diagram of X/Y/Z axes and CubeTexture sides](/img/how_to/Materials/cubetexture1.png)

Note, despite being a "Texture", CubeTexture can ONLY be used with [reflectionTexture and refractionTexture](/divingDeeper/materials/using/reflectionTexture), NOT other Material properties like diffuseTexture. [See below](#makingtheskybox) for the appropriate settings for a skybox.

## Making or Finding Skybox Images

This is an example set of skybox images:

| <img src="/img/getstarted/skybox_px.jpg" width="100" height="100" alt="some clouds"/> | <img src="/img/getstarted/skybox_nx.jpg" width="100" height="100" alt="more clouds"/> | <img src="/img/getstarted/skybox_py.jpg" width="100" height="100" alt="the sun overhead"/> | <img src="/img/getstarted/skybox_ny.jpg" width="100" height="100" alt="solid gray"/> | <img src="/img/getstarted/skybox_pz.jpg" width="100" height="100" alt="more clouds"/> | <img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" alt="more clouds"/> |
| :-----------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
|                                     skybox_px.jpg                                     |                                     skybox_nx.jpg                                     |                                       skybox_py.jpg                                        |                                    skybox_ny.jpg                                     |                                     skybox_pz.jpg                                     |                                     skybox_nz.jpg                                     |

<br/>

Notice that the images match seamlessly at the edges of the box:

<!-- use HTML to get padding-free table -->
<table style={{width: 0}}><tbody>
<tr>
  <th style={{padding: 0}}><img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" alt="some clouds"/></th>
  <th style={{padding: 0}}><img src="/img/getstarted/skybox_nx.jpg" width="100" height="100" alt="adjacent clouds"/></th>
  <th style={{padding: 0}}><img src="/img/getstarted/skybox_pz.jpg" width="100" height="100" alt="adjacent clouds"/></th>
  <th style={{padding: 0}}><img src="/img/getstarted/skybox_px.jpg" width="100" height="100" alt="adjacent clouds"/></th>
  <th style={{padding: 0}}><img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" alt="wrapping around to the original clouds"/></th>
</tr>
<tr>
  <td>_nz</td>
  <td>_nx</td>
  <td>_pz</td>
  <td>_px</td>
  <td>_nz (again)</td>
</tr>
</tbody></table><p/>

You can search the web for "skybox images" to find many examples. These are often a single image of an unfolded cube, which you would need to slice into the six separate images for CubeTexture to load. The [cube textures in the playground library](/toolsAndResources/assetLibraries/availableTextures#cubetextures) may also be useful, and they are already in the appropriate format.

## Making the Skybox

Cube textures must be applied using [reflectionTexture](/divingDeeper/materials/using/reflectionTexture) even though skyboxes are not actually reflections; set [coordinatesMode](/typedoc/classes/babylon.texture#coordinatesmode) to SKYBOX_MODE to paint the texture directly on the cube rather than simulating reflection.

Within the playground you can copy and paste the following into your scene:

```javascript
var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;
```

To use your own skybox images, make them web-accessible (a localhost server is okay), and change the `BABYLON.CubeTexture` call:

```javascript
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("URL TO IMAGE DIRECTORY/COMMON PART OF IMAGE FILENAMES", scene);
```

<Playground id="#UU7RQ#1" title="Simple Skybox Example" description="Simple example of how to add a skybox to your scene." image="/img/playgroundsAndNMEs/divingDeeperEnvironmentSkybox1.jpg"/>
