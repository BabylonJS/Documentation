---
title: Render Scenes To Video.
image:
description: Learn how to render scenes to video files.
keywords: diving deeper, scene, render, video, export
further-reading:
video-overview:
video-content:
---

## Record a Scene to a Video

First, you may ask why is it better than an external video capture tool?

Thanks to the Html5 standard being always in motion, we can now, in modern browsers, directly record a stream generated from a canvas. This ensures that no framerate drop will occur during the recording and it is all happening auto-magically in the browser.

## How to record with the inspector

A new action has been added to the Tools tab of the inspector. You can find a Start Recording Video button in compatible browsers.

![InspectorTools](/img/how_to/scene/inspectorVideoRecorder.png)

This will by default records 7 seconds of video. You can press the button again anytime during the recording session to stop it earlier.

## How to record by code

### Check support

As the browser support is still not wide enough, recording the canvas should always be preceeded by a capability check. You can simply use this code to ensure the correct availability of the required APIs in your browser:

```javascript
if (BABYLON.VideoRecorder.IsSupported(engine)) {
  var recorder = new BABYLON.VideoRecorder(engine);
}
```

### Simple Record

In order to record your currently displayed scene, you can simply use this code:

```javascript
if (BABYLON.VideoRecorder.IsSupported(engine)) {
  var recorder = new BABYLON.VideoRecorder(engine);
  recorder.startRecording();
}
```

You can see a <Playground id="#47H64G" title="Simple Video Recording Example" description="Simple example of recording a video of the current scene."/>

This will by default record 7 seconds of video to a file name "babylonjs.webm".

### Changing default File Name

You can pass the file name to the startRecording API:

```javascript
if (BABYLON.VideoRecorder.IsSupported(engine)) {
  var recorder = new BABYLON.VideoRecorder(engine);
  recorder.startRecording("test.webm");
}
```

You can see a live version here: <Playground id="#47H64G#1" title="Changing The Default Recorded Video Name" description="Simple example showing how to record a video of the current scene and change the default file name."/>

This will by default record 7 seconds of video to a file name "test.webm".

### Changing default Record Time

You can pass the default time in seconds to the startRecording API:

```javascript
if (BABYLON.VideoRecorder.IsSupported(engine)) {
  var recorder = new BABYLON.VideoRecorder(engine);
  recorder.startRecording("test.webm", 2);
}
```

You can see a live demo here: <Playground id="#47H64G#2" title="Chaning Default Record Time" description="Simple example showing how to change the default record time of recorded videos."/>

This will by default record 2 seconds of video to a file name "test.webm".

### Stop video before the Record Time

Once a record is in progress, you can stop it earlier by using the `stopRecording` Api:

```javascript
if (BABYLON.VideoRecorder.IsSupported(engine)) {
  var recorder = new BABYLON.VideoRecorder(engine);
  recorder.startRecording();
  setTimeout(() => {
    recorder.stopRecording();
  }, 500);
}
```

You can see a live version here: <Playground id="#47H64G#3" title="Stopping Video Before Record Time" description="Simple example showing how to stop recording before the allotted time has completed."/>

This will record 500 milliseconds of video to a file name "babylonjs.webm".

### When does the record end

To detect the end of the recording (either reaching the record time or manually stopped), you can use the promise return by the `startRecording` API:

```javascript
if (BABYLON.VideoRecorder.IsSupported(engine)) {
  var recorder = new BABYLON.VideoRecorder(engine);
  recorder.startRecording().then(() => {
    alert("done");
  });
}
```

You can see a live version here: <Playground id="#47H64G#4" title="Detect Recording End" description="Simple example showing how to detect when a recording has ended."/>

This will record 7 seconds of video to a file name "babylonjs.webm" and display the "done" message.

### How to not download automatically the file

Passing the fileName to `null` will prevent the download to happen automatically and as in the previous topic, you can rely on the `startRecording` return promise to deal with the video data on your own:

```javascript
if (BABYLON.VideoRecorder.IsSupported(engine)) {
  var recorder = new BABYLON.VideoRecorder(engine);
  recorder.startRecording(null, 1).then((videoBlob) => {
    // Do Something with the videoBlob.
  });
}
```

You can see a live version here: <Playground id="#47H64G#5" title="Not Downloading The Recorded Video" description="Simple example showing how you can stop an automatic download of the recorded video."/>

This will record 1 second of video to a blob.

## Limitations

Video Recording is based on both MediaRecorder and Canvas.captureStream() APIs which are still not broadly supported. The recording support is then limited by the browser capability to record a canvas.

The second limitations is the file format you can record to seems to be curently limited to webm. You can not directly record to .mp4 or .mov with this method so far.

Let's hope that wider browser and file format support will be added soon.
