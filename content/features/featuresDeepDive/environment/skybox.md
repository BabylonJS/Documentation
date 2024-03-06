---
title: Skyboxes
image: /img/getstarted/skybox_px.jpg
description: Learn how to add a skybox to your Babylon.js scene.
keywords: diving deeper, environment, skybox
further-reading:
  - title: Reflections and Refractions
    url: /features/featuresDeepDive/materials/using/reflectionTexture
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

Note, despite being a "Texture", CubeTexture can ONLY be used with [reflectionTexture and refractionTexture](/features/featuresDeepDive/materials/using/reflectionTexture), NOT other Material properties like diffuseTexture. [See below](#makingtheskybox) for the appropriate settings for a skybox.

## Making or Finding Skybox Images

This is an example set of skybox images:

| <img src="/img/getstarted/skybox_px.jpg" width="100" height="100" alt="some clouds"/> | <img src="/img/getstarted/skybox_nx.jpg" width="100" height="100" alt="more clouds"/> | <img src="/img/getstarted/skybox_py.jpg" width="100" height="100" alt="the sun overhead"/> | <img src="/img/getstarted/skybox_ny.jpg" width="100" height="100" alt="solid gray"/> | <img src="/img/getstarted/skybox_pz.jpg" width="100" height="100" alt="more clouds"/> | <img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" alt="more clouds"/> |
| :-----------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
|                                     skybox_px.jpg                                     |                                     skybox_nx.jpg                                     |                                       skybox_py.jpg                                        |                                    skybox_ny.jpg                                     |                                     skybox_pz.jpg                                     |                                     skybox_nz.jpg                                     |

<br/>

Notice that the images match seamlessly at the edges of the box:

<table><tbody>
<tr>
  <th style={{padding: 10}}><img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" alt="some clouds"/></th>
  <th style={{padding: 10}}><img src="/img/getstarted/skybox_nx.jpg" width="100" height="100" alt="adjacent clouds"/></th>
  <th style={{padding: 10}}><img src="/img/getstarted/skybox_pz.jpg" width="100" height="100" alt="adjacent clouds"/></th>
  <th style={{padding: 10}}><img src="/img/getstarted/skybox_px.jpg" width="100" height="100" alt="adjacent clouds"/></th>
  <th style={{padding: 10}}><img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" alt="wrapping around to the original clouds"/></th>
</tr>
<tr>
  <td>_nz</td>
  <td>_nx</td>
  <td>_pz</td>
  <td>_px</td>
  <td>_nz (again)</td>
</tr>
</tbody></table>
<p></p>

You can search the web for "skybox images" to find many examples. These are often a single image of an unfolded cube, which you would need to slice into the six separate images for CubeTexture to load. The [cube textures in the playground library](/toolsAndResources/assetLibraries/availableTextures#cubetextures) may also be useful, and they are already in the appropriate format.

## Making the Skybox

Cube textures must be applied using [reflectionTexture](/features/featuresDeepDive/materials/using/reflectionTexture) even though skyboxes are not actually reflections; set [coordinatesMode](/typedoc/classes/babylon.texture#coordinatesmode) to SKYBOX_MODE to paint the texture directly on the cube rather than simulating reflection.

There are two ways to proceed. Let's start with a manual creation to understand how things work under the hood and then we will be able to use an automatic one.

### Manual creation

First, create our box, nothing new, just take notice of the disabled [backface culling](https://en.wikipedia.org/wiki/Back-face_culling):

```javascript
const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100.0 }, scene);
const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.disableLighting = true;
skybox.material = skyboxMaterial;
```

Next, we set the `infiniteDistance` property. This makes the skybox follow our camera's position.

```javascript
skybox.infiniteDistance = true;
```

Now we must remove all light reflections on our box (the sun doesn't reflect on the sky!):

```javascript
skyboxMaterial.disableLighting = true;
```

Next, we apply our special sky texture to it. This texture must have been prepared to be a skybox, in a dedicated directory, named “skybox” in our example:

```javascript
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
```

(More about reflectionTextures can be found in our [Unleash the Standard Material](https://www.eternalcoding.com/babylon-js-unleash-the-standardmaterial-for-your-babylon-js-game/) tutorial.)

In that `/skybox` directory, we must find 6 sky textures, one for each face of our box. Each image must be named per the corresponding face: “skybox_nx.jpg” (left), “skybox_ny.jpg” (down), “skybox_nz.jpg” (back), “skybox_px.jpg” (right), “skybox_py.jpg” (up), “skybox_pz.jpg” (front). The "\_nx.jpg" is added to your path.

Skybox textures need not be textures of sky alone. You can search the Internet for skyboxes and find buildings, hills, mountains, trees, lakes, planets, stars, you name it (all can be used nicely) as part of skybox textures, but some require a payment.

You can also use dds files to specify your skybox. These special files can contain all information required to setup a cube texture:

```javascript
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/assets/textures/SpecularHDR.dds", scene);
```

Final note, if you want your skybox to render behind everything else, set the skybox's `renderingGroupId` to `0`, and every other renderable object's `renderingGroupId` greater than zero, for example:

```javascript
skybox.renderingGroupId = 0;

// Some other mesh
myMesh.renderingGroupId = 1;
```

More info about rendering groups and rendering order can be found [here](/features/featuresDeepDive/materials/advanced/transparent_rendering).

<Playground id="#UU7RQ#1" title="Simple Skybox Example" description="Simple example of how to add a skybox to your scene." image="/img/playgroundsAndNMEs/divingDeeperEnvironmentSkybox1.jpg"/>

### Automatic creation

Now that we understand how a skybox can be created let's move to a simpler way:

```javascript
envTexture = new BABYLON.CubeTexture("/assets/textures/SpecularHDR.dds", scene);
scene.createDefaultSkybox(envTexture, true, 1000);
```

<Playground id="#BH23ZD#1" title="Playground Example Skybox Helper" description="Simple example of using the Skybox Helper." image="/img/playgroundsAndNMEs/divingDeeperEnvironmentIntro1.jpg" isMain={true} category="Environment"/>

Check out [scene helpers](/features/featuresDeepDive/scene/fastBuildWorld#environmental-helper) for more information on this and other helpers.

## Ground Projection

Introduced in version 6.27.0 you can now "fake" a ground from within your skybox. This can help a lot "grounding" your models without requiring extra meshes or textures. It ensures a smooth transition from the "ground" to the environment. As it might be hard to understand, here is a playground highlighting the same scene with and without ground projection.

<Playground id="#25JK74#0" title="Ground Projection Playground" description="Simple example of using Ground Projection." image="/img/playgroundsAndNMEs/divingDeeperSkyboxGroundProjection.jpg" category="Environment"/>

Enabling ground projection requires a few steps similar to creating a skybox.

First, create a box right below your object. **The bottom face position needs to be coplanar with the "fake ground" to support shadows and ensure they do not suffer from any distortions.**

```javascript
const size = 1000;
const skydome = BABYLON.MeshBuilder.CreateBox("sky", { size, sideOrientation: BABYLON.Mesh.BACKSIDE }, scene);
skydome.position.y = size / 2;
skydome.receiveShadows = true;
```

You can notice the side orientation is flipped to see the faces from within the box. This prevents the need to alter the backFaceCulling setup.

Next, lets create a [BackgroundMaterial](/features/featuresDeepDive/environment/backgroundMaterial) to support ground projection.

```javascript
const sky = new BABYLON.BackgroundMaterial("skyMaterial", scene);
sky.enableGroundProjection = true;
sky.projectedGroundRadius = 20;
sky.projectedGroundHeight = 3;
skydome.material = sky;
```

The `projectedGroundRadius` and `projectedGroundHeight` are respectively simulating the radius of the disc representing the ground and how high it should be within the skybox. The size of the box you picked in the first step should at least be equal or bigger to the selected radius.

Next, we apply our special sky texture to it. This texture must have been prepared to be a skybox, in a dedicated directory, named “skybox” in our example:

```javascript
sky.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
```
