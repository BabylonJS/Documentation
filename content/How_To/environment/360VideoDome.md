---
title: 360 Video Domes
image: 
description: Learn all about Babylon.js 360 video domes.
keywords: diving deeper, environment, 360 video, dome, 360 video dome, video dome
further-reading:
    - title: VideoTexture
      url: /typedoc/classes/VideoTexture
video-overview:
video-content:
---

## How To 360 Video

360 Video is a simplex mix of specific geometry, textures, and material properties; however, rather than put the burden on you to figure out how to connect them, we've created the VideoDome.

Note that the video dome also supports 180 degrees video. Read below for further information.

## VideoDome

VideoDomes rely heavily on the [VideoTexture](/divingDeeper/materials/using/videoTexture) class, check out it's documentation so that some parameters make more sense.
The source video itself should be "Equirectangular", without an equirectangular source the class won't function correctly.

## VideoDome Code

Within the playground you can copy and paste the following into your scene and then adjust the options.

``` javascript
videoDome = new BABYLON.VideoDome("videoDome", url, { < options >
}, scene);
```

All of the settings in the options object are optional, but the object itself is not. Please provide an empty object at minimum.

All the options are based through the corresponding classes, mainly the dome geometry and the VideoTexture:

* resolution = 32: Integer, defines the resolution of the sphere used to host the video. Lower resolutions have more artifacts at extreme fovs
* clickToPlay = false: Add a click to play listener to the video, does not prevent autoplay
* autoPlay = true: Automatically attempt to being playing the video
* loop = true: Automatically loop video on end
* size = 1000: Physical radius to create the dome at, defaults to approximately half the far clip plane
* poster: URL of the image displayed during the video loading or until the user interacts with the video
* useDirectMapping = true: Use a direct mapping technique to render the video. You should leave this value on unless you want to use the `fovMultiplier` property
* halfDomeMode = false: Enable the support for 180 videos instead of 360.

<Playground id="#SQ5UC1#22" title="Playground Example of a VideoDome" description="Simple example of using a videoDome in your scene." image="/img/playgroundsAndNMEs/divingDeeperVideoDome1.jpg"/>

As iOS disable autoplay, you should call video play on user interaction, using `videoDome.videoTexture.video.play();` .

## FOV adjustment

Sometimes 360 Video can feel an uncomfortable distance from the camera, to help with this a material based FOV adjustment is available.
Adjust it between 0.0 and 2.0 with the following code.

``` javascript
videoDome.fovMultiplier = newValue;
```

Please note that `fovMultiplier` only works when using `useDirectMapping = false` creation option.

As a warning, the further the value gets from 1 the more distortion will be visible. Higher resolutions on the video dome help reduce, but not eliminate, this.

<Playground id="#SQ5UC1#0" title="VideoDome with fovMultiplier" description="Simple example of using a videoDome with an fovMultiplier."/>

## Video Types

Several types of 360 video exist today. The most common being Monoscopic Panoramic, Stereoscopic Side by Side panoramic and Top bottom panoramic.

The first one represents a panoramic view which is dedicated to one eye. The second one contains two panoramic views dedicated to each eyes whereas the last one contains both panoramic views respectively on the top and bottom of the video.

In the video Dome you can change adapt to the type of your source video by using :

``` javascript
videoDome.videoMode = BABYLON.VideoDome.MODE_MONOSCOPIC;
// or
videoDome.videoMode = BABYLON.VideoDome.MODE_SIDEBYSIDE;
// or
videoDome.videoMode = BABYLON.VideoDome.MODE_TOPBOTTOM;
```

## 180 Video

Another format of VR-enabled videos are the 180 degrees videos. The front of the user is recorded, but the back is black.

There are two ways to enable the 180 video mode (which we call `half dome mode` ):

* During construction enable the halfDomeMode in the options:

``` javascript
let videoDome = new BABYLON.VideoDome(
    "videoDome",
    ["https://videourl.com/videos/180.mp4"], {
        resolution: 32,
        clickToPlay: true,
        halfDomeMode: true
    },
    scene
);
```

* set `videoDome.halfDome` to true : 

``` javascript
let videoDome = ....
videoDome.halfDome = true;
```