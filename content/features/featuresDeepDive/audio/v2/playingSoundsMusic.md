---
title: Audio
image:
description: Dive into everything you could want to know about using the Babylon.js sound engine for simple to advanced audio.
keywords: diving deeper, sound, audio, sound engine, audio engine
further-reading:
  - title: Sound
    url: /typedoc/classes/BABYLON.StaticSound
  - title: Audio Buses
    url: /typedoc/classes/BABYLON.AudioBus
video-overview:
video-content:
---

The Babylon.js audio engine is based on the [**Web Audio specification**](https://webaudio.github.io/web-audio-api/). It features ambient, spatialized and directional sounds, as well as basic audio buses for signal routing and mixing.

The audio engine is simple and powerful, and its API is similar to the Babylon.js graphics APIs, which makes it easier to learn for users already familiar with the rest of the Babylon.js framework.

The sound formats supported by the audio engine are dictated by the browser. All browsers support the **.mp3** and **.wav** formats, and most browsers support **.ogg**, **.m4a**, and **.mp4**. Other formats like **.aac** and **.webm** are browser-specific. When creating sounds, you can specify an array of sound file URLs to choose from and the first format recognized by the browser will be used. See [Using browser-specific audio codecs](#using-browser-specific-audio-codecs).

## Creating an audio engine

The audio engine is created with the [`CreateAudioEngineAsync`](/typedoc/functions/BABYLON.CreateAudioEngineAsync) function. The options for creating an audio engine are listed in the [`IWebAudioEngineOptions`](http://localhost:3000/typedoc/interfaces/BABYLON.IWebAudioEngineOptions) interface documentation.

The [`CreateAudioEngineAsync`](/typedoc/functions/BABYLON.CreateAudioEngineAsync) functions is asynchronous, which means it returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that will resolve when the audio engine is ready.

**You must wait for the [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to resolve before use**, which can be done with the [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) keyword. The following code snippet shows how to do this:

```javascript
async function initAudio() {
  const audioEngine = await BABYLON.CreateAudioEngineAsync();
  await audioEngine.unlock();

  // Audio engine is ready to play sounds ...
}
```

Note that the example code snippet also waits for the audio engine to be "unlocked" because browsers prevent audio from sounding until the user interacts with the web page. See [Browser autoplay considerations](#browser-autoplay-considerations) for more information.

## Playing sounds

## Using browser-specific audio codecs

## Browser autoplay considerations

## TODO: Finish this page
