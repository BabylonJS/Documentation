---
title: Video As A Texture
image: 
description: Learn about how to use video as a texture in Babylon.js.
keywords: welcome, babylon.js, diving deeper, materials, video texture
further-reading:
video-overview:
video-content:
---

If you want to display a video in your scene, the Babylon engine has a special texture for that. This special texture works similar to other textures, with the exception of a few parameters. These parameters include video urls (an url array), the size of the video texture (here is 256), the scene, and a final optional boolean that indicates if you want to use [mipmap](https://en.wikipedia.org/wiki/Mipmap) or not.

Here is an example from our Flat2009 Demo: <Playground id="#ZMCFYA#2" title="Video Texture Example" description="Simple example of using video as a texture in your scene." image="/img/playgroundsAndNMEs/divingDeeperVideoTexture1.jpg"/>

This plays a video on the demo's ZTV screen (ecran = screen).

```javascript
ecran.material.diffuseTexture = new BABYLON.VideoTexture("video", "textures/babylonjs.mp4", scene, true);
```

The [_VideoTexture_ object](https://doc.babylonjs.com/api/classes/babylon.videotexture) accepts an array of videos (to take into account various codecs). The first video in the array that can be loaded... is the one used as content source. Currently, HTML5 supports .mp4, .webm, and .ogv video formats.

The internal [video DOM object](https://www.w3.org/wiki/HTML/Elements/video) is accessible via the VideoTexture.video property... which allows you to control some characteristics and monitor the status of the video (things such as play, pause, loop, autoplay, etc). See the link above for the full story.

![video](/img/how_to/Advanced%20Texturing/3.png)

Even though we are working with advanced texturing techniques, _VideoTexture_ works in conjunction with a StandardMaterial. Simply put, it needs to have some light. As a handy alternative or video illumination assistant, you may want to set an _emissiveColor_ on the base material of the mesh.

```javascript
ecran.material.emissiveColor = new BABYLON.Color3(1,1,1);
```

Mobile devices do not auto-play videos. A user interaction (such as a tap) is required to start the video. Until the user taps, the video texture will be black. A simple way of starting the video is this:

```javascript
scene.onPointerDown = function () { 
  videoTexture.video.play();
}
```

This will start the video on the first tap in the scene. A demo can be found here: <Playground id="#CHQ4T#1" title="Tap To Play Video Texture" description="Simple example of tapping to start playing a video texture." image="/img/playgroundsAndNMEs/divingDeeperVideoTexture2.jpg"/>

In case you wish to display a texture during the load time, you can provide in the ```poster``` property of the settings the URL of an image displayed during loading or until the user interacts with the video.

An event is also available to detect if you are in browser preventing autoplay by policy:

```javascript
texture.onUserActionRequestedObservable.add(() => {
  scene.onPointerDown = function () { 
    videoTexture.video.play();
  }
});
```

Starting with v2.6, we introduced the support for WebRTC. So now you can create a specific VideoTexture which will be connected to your default WebCam:

```javascript
BABYLON.VideoTexture.CreateFromWebCam(scene, function(videoTexture) {
}, { maxWidth: 256, maxHeight: 256 });
```

The third parameter is optional and can be used to define minWidth, maxWidth, minHeight and maxHeight. These values will be used to constraint the camera resolution.