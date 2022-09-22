---
title: Video As A Texture
image:
description: Learn about how to use video as a texture in Babylon.js.
keywords: diving deeper, materials, video texture
further-reading:
    - title: VideoTexture
      url: /typedoc/classes/VideoTexture
video-overview:
video-content:
---

If you want to display a video in your scene, the Babylon engine has a special texture for that. This special texture works similar to other textures, with the exception of a few parameters. These parameters include video urls (an url array), the size of the video texture (here is 256), the scene, and a final optional boolean that indicates if you want to use [mipmap](https://en.wikipedia.org/wiki/Mipmap) or not.

Here is an example from our Flat2009 Demo: <Playground id="#ZMCFYA#83" title="Video Texture Example" description="Simple example of using video as a texture in your scene." image="/img/playgroundsAndNMEs/divingDeeperVideoTexture1.jpg"/>

This plays a video on the demo's ZTV screen (ecran = screen).

```javascript
ecran.material.diffuseTexture = new BABYLON.VideoTexture("video", "textures/babylonjs.mp4", scene, true);
```

The [_VideoTexture_ object](/typedoc/classes/babylon.videotexture) accepts an array of videos (to take into account various codecs). The first video in the array that can be loaded... is the one used as content source. Currently, HTML5 supports .mp4, .webm, and .ogv video formats.

The internal [video DOM object](https://www.w3.org/wiki/HTML/Elements/video) is accessible via the VideoTexture.video property, which allows you to control some characteristics and monitor the status of the video. e.g.  play, pause, loop, autoplay. See the link above for the full story.

![video](/img/how_to/Advanced%20Texturing/3.png)

Even though we are working with advanced texturing techniques, _VideoTexture_ works in conjunction with a StandardMaterial. Simply put, it needs to have some light. As a handy alternative or video illumination assistant, you may want to set an _emissiveColor_ on the base material of the mesh.

```javascript
ecran.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
```

## Auto Play

Modern browsers have strict policies for autoplaying video. Without user interaction, most browsers will autoplay only if the audio is muted. When VideoTexture setting `autoPlay` is true (the default), Babylon.js will automatically mute the audio if the first attempt to autoplay fails. To play video with audio, a user interaction (such as a tap) is often required. To manually start a video texture playback, code like this can be used:

```javascript
scene.onPointerDown = function () {
    videoTexture.video.play();
    scene.onPointerDown = null;
};
```

This will start the video on the first tap in the scene. A demo can be found here: <Playground id="#1BYH8W#4" title="Tap To Play Video Texture" description="Simple example of tapping to start playing a video texture." image="/img/playgroundsAndNMEs/divingDeeperVideoTexture2.jpg"/>

An event is also available to detect if you are in browser preventing autoplay by policy:

```javascript
texture.onUserActionRequestedObservable.add(() => {
    scene.onPointerDown = function () {
        videoTexture.video.play();
    };
});
```

In case you wish to display a texture during the load time, you can provide in the `poster` property of the settings the URL of an image displayed during loading or until the user interacts with the video.

## Web RTC

Starting with v2.6, we introduced the support for WebRTC. So now you can create a specific VideoTexture which will be connected to your default WebCam:

```javascript
BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {}, { maxWidth: 256, maxHeight: 256 });
```

The third parameter is optional and can be used to define minWidth, maxWidth, minHeight and maxHeight. These values will be used to constraint the camera resolution.


## Disposal

VideoTexture creates and uses an HTML video element internally.  When VideoTexture.dispose is called, texture resources are disposed as expected. However, the underlying video element is not removed. Causing complete release of all underlying video resources is not standardized across browsers, but code like this can be used:

```javascript
// Store reference to the underlying HTML5 video element
const videoEl = videoDome.videoTexture.video 

// Dispose texture
videoTexture.dispose();

// Remove any <source> elements, etc.
while (videoEl.firstChild) {
    videoEl.removeChild(videoEl.lastChild);
}

// Set a blank src
videoEl.src = ''

// Prevent non-important errors in some browsers
videoEl.removeAttribute('src')

// Get certain browsers to let go
videoEl.load()

videoEl.remove()
```

This is only important to users that need to load/dispose multiple VideoTextures over time.

