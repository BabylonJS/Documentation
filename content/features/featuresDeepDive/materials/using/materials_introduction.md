---
title: Introduction To Materials
image:
description: Jump into the exciting world of learning to use Babylon.js materials.
keywords: diving deeper, materials
further-reading:
video-overview:
video-content:
---

Materials allow you to cover your meshes in color and texture. How a material appears depends on the light or lights used in the scene and how it is set to react.

## Reactions to light

There are four possible ways that a material can react to light.

1. Diffuse - the basic color or texture of the material as viewed under a light;
2. Specular - the highlight given to the material by a light;
3. Emissive - the color or texture of the material as if self lit;
4. Ambient - the color or texture of the material lit by the environmental background lighting.

Diffuse and Specular material require a [light source](/features/featuresDeepDive/lights/lights_introduction) to be created.  
Ambient color requires the ambient color of the scene to be set, giving the environmental background lighting.

```javascript
scene.ambientColor = new BABYLON.Color3(1, 1, 1);
```

## Color

Create a material using

```javascript
const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
```

Set the material color using one, some or all of _diffuseColor_, _specularColor_, _emissiveColor_ and _ambientColor_. Remember that _ambientColor_
will only apply if the scene ambient color has been set.

```javascript
const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

mesh.material = myMaterial;
```

## Diffuse Color Example

To give an idea on how the material diffuse color reacts to the diffuse light color the following playground example shows how different color materials react to white, red, green and blue diffuse spot lights.

<Playground id="#20OAV9#325" title="Material Color Reaction to Light Color" description="Simple example of material color reacting to light color." image="/img/playgroundsAndNMEs/divingDeeperMaterialsIntro1.jpg" isMain={true} category="Materials"/>

This reaction of

- Yellow Material
- Purple Material
- Cyan Material
- White Material

to white, red, green and blue diffuse spot lights can also be seen in the following image.

![ Spot Light](/img/how_to/Materials/spots1.png)

## Ambient Color Example

In the image below all spheres are lit by the same hemispheric light, with _diffuse_ red and _groundColor_ green. The first sphere has no ambient color, the middle has red ambient color defined on its material and the one on the right has material with green ambient color. The scene ambient color, which must be present, is white.

When a scene ambient color component is set to 0, for example red, then whatever the value for red in the material ambient color it will have no effect.

![Ambient](/img/how_to/Materials/ambient1.png)

<Playground id="#20OAV9#14" title="Use of Ambient Color" description="Simple example of using ambient color in your scene materials." image="/img/playgroundsAndNMEs/divingDeeperMaterialsIntro2.jpg"/>

## Transparent Color Example

Transparency is achieved by setting a materials _alpha_ property from 0 (invisible) to 1 (opaque).

```javascript
myMaterial.alpha = 0.5;
```

<Playground id="#20OAV9#16" title="Material Transparency" description="Simple example of using transparency in your scene materials." image="/img/playgroundsAndNMEs/divingDeeperMaterialsIntro3.jpg" isMain={true} category="Materials"/>

## Texture

Textures are formed using a saved image.

Create a material using

```javascript
const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
```

Set the material texture using one, some or all of _diffuseTexture_, _specularTexture_, _emissiveTexture_ and _ambientTexture_.
Notice that _ambientTexture_ is applied without the scene ambient color having been set.

```javascript
const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

myMaterial.diffuseTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
myMaterial.specularTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
myMaterial.emissiveTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
myMaterial.ambientTexture = new BABYLON.Texture("PATH TO IMAGE", scene);

mesh.material = myMaterial;
```

Note: When no normals are specified, Babylon's standard material will compute the normals.

## Texture Example

In this image all spheres are lit by the same hemispheric light, with _diffuse_ red and _groundColor_ green. The first sphere has a diffuse texture, the middle an emissive texture and the one on the right has material with red diffuse color and an ambient texture.

![Texture](/img/how_to/Materials/texture1.png)

<Playground id="#20OAV9#15" title="Material with Diffuse, Emissive, and Ambient Textures" description="Simple example of using diffuse, emissive, and ambient textures in your scene materials." image="/img/playgroundsAndNMEs/divingDeeperMaterialsIntro4.jpg" isMain={true} category="Materials"/>

## Transparent Texture Examples

For colors, the transparency is achieved by setting a materials _alpha_ property from 0 (invisible) to 1 (opaque).

```javascript
myMaterial.alpha = 0.5;
```

<Playground id="#20OAV9#17" title="Transparent Texture Example" description="Simple example of transparent textures in your scene." image="/img/playgroundsAndNMEs/divingDeeperMaterialsIntro5.jpg"/>

In addition, the image used for the texture might already have a transparency setting, such as this picture of a dog from wikimedia commons,
which has a transparent background;

![A dog](/img/how_to/Materials/dog.png)

In this case we set the _hasAlpha_ property of the **texture** to true.

```javascript
myMaterial.diffuseTexture.hasAlpha = true;
```

<Playground id="#YDO1F#18" title="Transparent Background Example" description="Simple example of a transparent background in your scene." image="/img/playgroundsAndNMEs/divingDeeperMaterialsIntro6.jpg"/>

For the back faces of the cube to be visible through the transparent areas of the front faces we have to deal with back-face culling.

## Texture Packer

Some complex scenes will require a large amount of textures for just one material. In this case it can be convenient to package the textures. The advantage of using the texture packer has to be weighed against limitations such as fixed size scaling.

[More on creating a texture package](/features/featuresDeepDive/materials/advanced/texturePackage)

## Back-Face Culling

This is a method for efficiently drawing the 2D rendering of the 3D model. Usually there is no need to draw the back face of a cube, or other object,
as it will be hidden by the front face. In Babylon.js the default setting is, as you might expect, set to true. In most cases, this is helpful in maintaining the highest possible performance.

Looking at the images below, when the material property _backFaceCulling_ is true you can see that the transparent areas around the
dog are still transparent, you can see the background through them. However, you cannot see the images on the back faces as they have been culled (or removed).
When _backFaceCulling_ is false the back faces are not removed during rendering, so they can be seen through the transparent areas of the front faces.

| Back Face Culling True                      | Back Face Culling False                      |
| ------------------------------------------- | -------------------------------------------- |
| ![BFC True](/img/how_to/Materials/bfc2.png) | ![BFC False](/img/how_to/Materials/bfc1.png) |

<Playground id="#YDO1F#20" title="Backface Culling Example" description="Simple example of using backface culling." image="/img/playgroundsAndNMEs/divingDeeperMaterialsIntro7.jpg"/>

## WireFrame

Every material has the capacity to display as a wireframe by setting the wireframe accessor of the material to true.

```javascript
materialSphere1.wireframe = true;
```

The output of enabling wireframe mode on the material is to display the wireframe using a line renderer, while still displaying the specific properties defined by the material including color, specularity, and alpha. Note that wireframe mode ignores the value for _backFaceCulling_ on the material because there is no backface any longer. Instead, lines are rendered on mesh edges and the concept of "back face" is no longer applicable. 

![wireframe mode on a sphere](/img/how_to/Materials/04-3.png)

<Playground id="#T8KESP" title="Wireframe Example" description="Simple example enabling wireframe on a material." image="/img/playgroundsAndNMEs/wireframeMode.jpg"/>

This will work with any material available in Babylon.js such as _StandardMaterial_, _PBRMaterial_, and even _NodeMaterial_. This is because the accessor is inherited from the _Material_ class, enabling every material in the engine to take advantage of it. Controlling the appearance of the wireframe is done through the material's parameters. 

![Making the wireframe red and emissive](/img/how_to/Materials/wireframe_red.jpg)
<Playground id="#T8KESP#1" title="Styling a wireframe" description="Styling the wireframe to be red." image="/img/playgroundsAndNMEs/wireframe_red.jpg"/>

However, the thickness of the line is predetermined by the line renderer in screen space which renders the line at the same thickness regardless of the distance from the line to the camera. This means that the wireframe will dynamically update the thickness so that it won't cease to render if the camera gets too far away.

### Rendering WireFrame Over Material
If it is necessary to render a wireframe over an existing material, the way to achieve this is by cloning the mesh and assigning a material to it that has _wireframe_ enabled. Since the wireframe renders in screen space, depth sorting is not an issue and the wireframe will always render on top of the visible parts of the mesh. The wireframe can be occluded by other meshes in the scene, but will not be occluded by an identical mesh that shares the same world position as the wireframe mesh.

This enables scenarios where blending materials and wireframes is necessary. In the example below, two _NodeMaterials_ are used to create the layer effect blending between wireframe over a solid color to the material's base color. The gradient for the interpolation is based on the distance from a pixel to the world origin and the same value is passed to both the _NodeMaterial_ for the mesh and the _NodeMaterial_ for the wireframe. In the case of the wireframe, this gradient is setting the alpha value of the material rather than interpolating between two different colors, which makes the wireframe appear to blend into the original material base color. This is the power of leveraging _NodeMaterial_ to drive the look of the wireframe of a mesh.

![Blending wireframe with material color](/img/how_to/Materials/wireframe_blending.jpg)

<Playground id="#PKJCS5" title="Blending wireframe" description="Using node material to blend wireframe" image="/img/playgroundsAndNMEs/wireframe_blend.jpg"/>

## Local File Access

An important thing to remember, is that for security reasons, web browsers don't allow local files to be accessed for web pages. This includes any texture files you are using. You can use a local server or an image hosting service that is CORS enabled.
