---
title: 360 Photo Domes
image: 
description: Learn all about Babylon.js 360 photo domes.
keywords: diving deeper, environment, 360 photo, dome, 360 photo dome, photo dome
further-reading:
    - title: Action Manager
      url: https://doc.babylonjs.com/features/divingDeeper/events/actions
video-overview:
video-content:
---

## How To 360 Photo
360 Photo is a simplex mix of specific geometry, textures, and material properties; however, rather than put the burden on you to figure out how to connect them, we've created the PhotoDome.

## PhotoDome
PhotoDome needs a source image that must be "Equirectangular", without an equirectangular source the class won't function correctly.

Example of equirectangular image:
![equirectangular](//playground.babylonjs.com/textures/360photo.jpg)

## PhotoDome Code
Within the playground you can copy and paste the following into your scene and then adjust the options.

```javascript
photoDome = new BABYLON.PhotoDome("testdome", url, {<options>}, scene);
```

All of the settings in the options object are optional, but the object itself is not. Please provide an empty object at minimum.
All the options are based through the corresponding classes, mainly the dome geometry and the Texture:

* resolution = 32: Integer, lower resolutions have more artifacts at extreme fovs
* size = 1000: Physical radius to create the dome at, defaults to approximately half the far clip plane
* useDirectMapping = true: Use a direct mapping technique to render the video. You should leave this value on unless you want to use the `fovMultiplier` property

<Playground id="#14KRGG#3" title="PhotoDome Example" description="Simple example of how to use a PhotoDome in your scene." image="/img/playgroundsAndNMEs/features/divingDeeperPhotoDome1.jpg"/>

## FOV adjustment
Sometimes 360 photo can feel an uncomfortable distance from the camera, to help with this a material based FOV adjustment is available.
Adjust it between 0.0 and 2.0 with the following code.

```javascript
photoDome.fovMultiplier = newValue;
```

Please note that `fovMultiplier` only works when using `useDirectMapping = false` creation option.

As a warning, the further the value gets from 1 the more distortion will be visible. Higher resolutions on the photo dome help reduce, but not eliminate, this.

<Playground id="#14KRGG#4" title="PhotoDome using fovMultiplier" description="Simple example of how to use a PhotoDome with fovMultiplier." image="/img/playgroundsAndNMEs/features/divingDeeperPhotoDome2.jpg"/>

## Image Types
Several types of 360 image exist today. The most common being Monoscopic Panoramic, Stereoscopic Side by Side panoramic and Top bottom panoramic.

The first one represents a panoramic view which is dedicated to one eye. The second one contains two panoramic views dedicated to each eyes whereas the last one contains both panoramic views respectively on the top and bottom of the image.

In the Photo Dome you can change adapt to the type of your image source by using :

```javascript
photoDome.imageMode = BABYLON.PhotoDome.MODE_MONOSCOPIC;
// or
photoDome.imageMode = BABYLON.PhotoDome.MODE_SIDEBYSIDE;
// or
photoDome.imageMode = BABYLON.PhotoDome.MODE_TOPBOTTOM;
```

Examples:

- Side by side: <Playground id="#WP9WDU" title="Steroscopic SidexSide Panoramic" description="Simple example of using a photoDome with a stereoscopic side by side panoramic source." image="/img/playgroundsAndNMEs/features/divingDeeperPhotoDome3.jpg"/>
- Top bottom: <Playground id="#SM3YHE" title="Top Bottom Panoramic" description="Simple example of using a photoDome with a top bottom panoramic source." image="/img/playgroundsAndNMEs/features/divingDeeperPhotoDome2.jpg"/>


## How To 360 Photo with WebVR
You can combine 360 Photo with WebVR. Just add the following code.

```javascript
 var vrHelper = scene.createDefaultVRExperience();
```
It will also create an enterVR button at the bottom right of the screen which will start rendering to the HMD on click.

You can come back to 2D view with adding the following code.

```javascript
scene.actionManager = new BABYLON.ActionManager(scene);

// From 2D view to fullscreen VR
scene.actionManager.registerAction(
new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: 's' //press "s" key
    },
    function () { vrHelper.enterVR(); }
));

// From fullscreenVR to 2D view
scene.actionManager.registerAction(
new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnKeyDownTrigger,
        parameter: 'e' //press "e" key
    },
    function () { vrHelper.exitVR(); document.exitFullscreen();}
));
```