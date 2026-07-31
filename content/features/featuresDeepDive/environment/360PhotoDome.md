---
title: 360 Photo Domes
image:
description: Learn all about Babylon.js 360 photo domes.
keywords: diving deeper, environment, 360 photo, dome, 360 photo dome, photo dome
further-reading:
  - title: Action Manager
    url: https://doc.babylonjs.com/divingDeeper/events/actions
video-overview:
video-content:
---

## How To 360 Photo

360 Photo is a simple mix of specific geometry, textures, and material properties. However, rather than put the burden on you to figure out how to connect them, we've created the PhotoDome.

## PhotoDome

PhotoDome needs a source image that must be "Equirectangular". Without an equirectangular source, the class won't function correctly.

Example of equirectangular image:
![equirectangular](//playground.babylonjs.com/textures/360photo.jpg)

## PhotoDome Code

Within the Playground, you can copy and paste the following into your scene and then adjust the options.

```javascript
photoDome = new BABYLON.PhotoDome("testdome", url, {<options>}, scene);
```

All of the settings in the options object are optional, but the object itself is not. Please provide an empty object at minimum.
All the options are passed through to the corresponding classes, mainly the dome geometry and the Texture:

- resolution = 32: Integer, lower resolutions have more artifacts at extreme FOVs
- size = 1000: Physical radius to create the dome at, defaults to approximately half the far clip plane
- useDirectMapping = true: Use a direct mapping technique to render the video. You should leave this value on unless you want to use the `fovMultiplier` property

<Playground id="#14KRGG#3" title="PhotoDome Example" description="Simple example of how to use a PhotoDome in your scene." image="/img/playgroundsAndNMEs/divingDeeperPhotoDome1.webp"/>

## FOV adjustment

Sometimes a 360 photo can feel uncomfortably distant from the camera. To help with this, a material-based FOV adjustment is available.
Adjust it between 0.0 and 2.0 with the following code.

```javascript
photoDome.fovMultiplier = newValue;
```

Please note that `fovMultiplier` only works when using the `useDirectMapping = false` creation option.

As a warning, the further the value gets from 1, the more distortion will be visible. Higher resolutions on the photo dome help reduce this, but not eliminate it.

<Playground id="#14KRGG#4" title="PhotoDome using fovMultiplier" description="Simple example of how to use a PhotoDome with fovMultiplier." image="/img/playgroundsAndNMEs/divingDeeperPhotoDome2.webp"/>

## Image Types

Several types of 360 images exist today. The most common are Monoscopic Panoramic, Stereoscopic Side-by-Side panoramic, and Top-Bottom panoramic.

The first one represents a panoramic view dedicated to one eye. The second one contains two panoramic views dedicated to each eye, whereas the last one contains both panoramic views on the top and bottom of the image, respectively.

In the PhotoDome, you can adapt it to the type of your source image by using:

```javascript
photoDome.imageMode = BABYLON.PhotoDome.MODE_MONOSCOPIC;
// or
photoDome.imageMode = BABYLON.PhotoDome.MODE_SIDEBYSIDE;
// or
photoDome.imageMode = BABYLON.PhotoDome.MODE_TOPBOTTOM;
```

Examples:

- Side by side: <Playground id="#WP9WDU" title="Steroscopic SidexSide Panoramic" description="Simple example of using a photoDome with a stereoscopic side by side panoramic source." image="/img/playgroundsAndNMEs/divingDeeperPhotoDome3.webp"/>
- Top bottom: <Playground id="#SM3YHE" title="Top Bottom Panoramic" description="Simple example of using a photoDome with a top bottom panoramic source." image="/img/playgroundsAndNMEs/divingDeeperPhotoDome2.webp"/>

## How To 360 Photo with WebVR

You can combine 360 Photo with WebVR. Just add the following code:

```javascript
vrHelper = scene.createDefaultVRExperience();
```

It will also create an enterVR button at the bottom right of the screen that will start rendering to the HMD when clicked.

You can come back to 2D view by adding the following code.

```javascript
scene.actionManager = new BABYLON.ActionManager(scene);

// From 2D view to fullscreen VR
scene.actionManager.registerAction(
  new BABYLON.ExecuteCodeAction(
    {
      trigger: BABYLON.ActionManager.OnKeyDownTrigger,
      parameter: "s", //press "s" key
    },
    function () {
      vrHelper.enterVR();
    },
  ),
);

// From fullscreen VR to 2D view
scene.actionManager.registerAction(
  new BABYLON.ExecuteCodeAction(
    {
      trigger: BABYLON.ActionManager.OnKeyDownTrigger,
      parameter: "e", //press "e" key
    },
    function () {
      vrHelper.exitVR();
      document.exitFullscreen();
    },
  ),
);
```
