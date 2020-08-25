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

You can see a [live version here](https://www.babylonjs-playground.com/#157MGZ)

### Shadows
The material is able to receive shadows despite being unlit \o/ This is actually one of its strength making it really attractive for grounds. If you want to dim the amount of shadows, you can use the dedicated properties:

```javascript
backgroundMaterial.shadowLevel = 0.4;
```

You can see a [live version here](https://www.babylonjs-playground.com/#G3HSAW#3)

Starting from Babylonjs v4.2, there's also a new `shadowOnly` property that only renders shadow, making the material behave like the `ShadowOnlyMaterial` material but without the single light restriction.

When `shadowOnly = true`, you can use `primaryColor` to tint the shadow color and `alpha` to make the shadows more or less strong: [live version here](https://www.babylonjs-playground.com/#G3HSAW#33)

### Opacity
As you might want to make a transparent ground, if the diffuse texture contains some transparency information, they will be used by the material.

```javascript
backgroundMaterial.diffuseTexture.hasAlpha = true;
```

You can see a [live version here](https://www.babylonjs-playground.com/#G3HSAW#4)

### Opacity Fresnel
Also, by default the ground will disappear as your eyes are close to be aligned with it. This prevents a harsh cut navigating in the scene. It is possible to disable it by:

```javascript
backgroundMaterial.opacityFresnel = false;
```

You can see a [live version here](https://www.babylonjs-playground.com/#G3HSAW#5)

## Reflection
Unlit materials are a great fit to create skybox. You can, exactly like with the standard material, set your reflection texture:

```javascript
backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
```

You can see a [live version here](https://www.babylonjs-playground.com/#G3HSAW#6)

### Mirror
As the reflection can be compared to the standard material, using a mirror works also in the same way.

```javascript
var mirror = new BABYLON.MirrorTexture("mirror", 512, scene);
mirror.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
mirror.renderList.push(sphere);

backgroundMaterial.reflectionTexture = mirror;
```

You can see a [live version here](https://www.babylonjs-playground.com/#G3HSAW#9)

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

You can see a [live version here](https://www.babylonjs-playground.com/#G3HSAW#10)

## Misc and Colors
As from time to time all we need is color, you can use the texture as gray scaled information to mix with a color.

```javascript
backgroundMaterial.useRGBColor = false;
backgroundMaterial.primaryColor = BABYLON.Color3.Magenta();
```

You can see a [live version here](https://www.babylonjs-playground.com/#G3HSAW#11)

## Environment
Going further, you can take a look at the [Environment documentation](/babylon101/environment#skybox-and-ground) where you can find information on how to speed up the setup of your scene with a skybox and a ground.
