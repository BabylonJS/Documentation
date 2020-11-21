---
title: Background Material
image:
description: Learn how to add a background material to your Babylon.js scene.
keywords: welcome, babylon.js, diving deeper, environment, background material
further-reading:
video-overview:
video-content:
---

# Background Material

## Introduction

As fully lit materials are not always desired in a scene. We are introducing a new unlit and fast material to help addressing the constraints you may have with standard or PBR materials.

The background material is fully unlit but can still receive shadows or be subject to image processing information. This makes it the best fit to use as a skybox or ground material.

![background](/img/how_to/backgroundMaterial.png)

## Diffuse

The diffuse part is used to simply give a color to the mesh.

```javascript
backgroundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass.jpg", scene);
```

You can see an example of this here: <Playground id="#157MGZ" title="Simple Diffuse Background Material" description="Simple example of how to add an unlit diffuse material to your scene." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat1.jpg"/>

### Shadows

The material is able to receive shadows despite being unlit \o/ This is actually one of its strength making it really attractive for grounds. If you want to dim the amount of shadows, you can use the dedicated properties:

```javascript
backgroundMaterial.shadowLevel = 0.4;
```

You can see an example here: <Playground id="#G3HSAW#3" title="Background Material with Shadows" description="Simple example of a background material receiving shadows." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat2.jpg"/>

Starting from Babylonjs v4.2, there's also a new `shadowOnly` property that only renders shadow, making the material behave like the `ShadowOnlyMaterial` material but without the single light restriction.

When `shadowOnly = true`, you can use `primaryColor` to tint the shadow color and `alpha` to make the shadows more or less strong: <Playground id="#G3HSAW#33" title="Background Material with Tinted Shadows" description="Simple example of a background material receiving tinted shadows." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat3.jpg"/>

### Opacity

As you might want to make a transparent ground, if the diffuse texture contains some transparency information, they will be used by the material.

```javascript
backgroundMaterial.diffuseTexture.hasAlpha = true;
```

You can see an example here: <Playground id="#G3HSAW#4" title="Background Material with Transparnecy" description="Simple example of a background material with transparency." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat4.jpg"/>

### Opacity Fresnel

Also, by default the ground will disappear as your eyes are close to being aligned with it. This prevents a harsh cut navigating in the scene. It is possible to disable it by:

```javascript
backgroundMaterial.opacityFresnel = false;
```

You can see an example here: <Playground id="#G3HSAW#5" title="Removing opacityFresnel" description="Simple example of turning off the opacityFresnel of the background material." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat5.jpg"/>

## Reflection

Unlit materials are a great fit to create skybox. You can, exactly like with the standard material, set your reflection texture:

```javascript
backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
```

You can see an example here:<Playground id="#G3HSAW#6" title="Background Material with Reflection Texture" description="Simple example of a background material with a reflection texture." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat6.jpg"/>

### Mirror

As the reflection can be compared to the standard material, using a mirror works also in the same way.

```javascript
var mirror = new BABYLON.MirrorTexture("mirror", 512, scene);
mirror.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
mirror.renderList.push(sphere);

backgroundMaterial.reflectionTexture = mirror;
```

You can see an example here: <Playground id="#G3HSAW#9" title="Background Material with Mirror Reflection Texture" description="Simple example of a background material with a mirror reflection texture." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat7.jpg"/>

### Reflection Fresnel

As we can both use reflection and diffuse, reflection fresnel can help feeling more immersed in the experience:

```javascript
var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
backgroundMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/backgroundGround.png", scene);
backgroundMaterial.diffuseTexture.hasAlpha = true;
backgroundMaterial.opacityFresnel = false;
backgroundMaterial.shadowLevel = 0.4;

var mirror = new BABYLON.MirrorTexture("mirror", 512, scene);
mirror.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
mirror.renderList.push(sphere);
backgroundMaterial.reflectionTexture = mirror;
backgroundMaterial.reflectionFresnel = true;
backgroundMaterial.reflectionStandardFresnelWeight = 0.8;

ground.material = backgroundMaterial;
```

You can see an example here: <Playground id="#G3HSAW#10" title="Reflection Fresnel Example" description="Simple example of a using reflection fresnel." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat8.jpg"/>

## Misc and Colors

As from time to time all we need is color, you can use the texture as gray scaled information to mix with a color.

```javascript
backgroundMaterial.useRGBColor = false;
backgroundMaterial.primaryColor = BABYLON.Color3.Magenta();
```

You can see an example here: <Playground id="#G3HSAW#11" title="Mix Gray Scale and Color" description="Simple example of a mixing grayscale and color." image="/img/playgroundsAndNMEs/divingDeeperBackgroundMat9.jpg"/>

## Environment

Going further, you can take a look at the [Environment documentation](/start/chap5/sky) where you can find information on how to speed up the setup of your scene with a skybox and a ground.
