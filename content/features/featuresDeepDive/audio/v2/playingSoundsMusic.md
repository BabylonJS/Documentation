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

Before any sounds can be played, the audio engine must be created and initialized with the [`CreateAudioEngineAsync`](/typedoc/functions/BABYLON.CreateAudioEngineAsync) function. The options for creating an audio engine are listed in the [`IWebAudioEngineOptions`](/typedoc/interfaces/BABYLON.IWebAudioEngineOptions) interface documentation.

The [`CreateAudioEngineAsync`](/typedoc/functions/BABYLON.CreateAudioEngineAsync) function is asynchronous, which means it returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that will resolve when the audio engine is ready.

**You must wait for the [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to resolve before use**, which can be done with the [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) keyword. The following code snippet shows how to do this:

```javascript
async function initAudio() {
  const audioEngine = await BABYLON.CreateAudioEngineAsync();
  await audioEngine.unlock();

  // Audio engine is ready to play sounds ...
}
```

Note that the example code snippet also waits for the audio engine to be "unlocked" because browsers prevent audio from playing a user interaction occurs. See [Browser autoplay considerations](#browser-autoplay-considerations) for more information.

## Playing a sound

The simplest way to play a sound is to create it with the [`CreateSoundAsync`](/typedoc/functions/BABYLON.CreateSoundAsync) function, and call the sound's [`play()`](/typedoc/classes/BABYLON.AbstractSound#play) function after the audio engine is unlocked:

```javascript
async function initAudio() {
  const audioEngine = await BABYLON.CreateAudioEngineAsync();
  const gunshot = await BABYLON.CreateSoundAsync("gunshot", "sounds/gunshot.wav");

  await audioEngine.unlock();

  // Audio engine is ready to play sounds ...
  gunshot.play()
}
```

See this playground for a full example: <Playground id="#VP1B9P" title="Play a sound" description="A simple example of playing a sound."/>

## Streaming sounds

In addition to the `CreateSoundAsync` function, there is also [`CreateStreamingSoundAsync`](/typedoc/functions/BABYLON.CreateStreamingSoundAsync) which plays sounds using the browser's [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) feature.

The advantage of streaming sounds is they only store part of the sound file in memory while playing instead of downloading the entire sound into an audio buffer beforehand. As a result, streaming sounds save a significant amount of memory when playing long sound files, and are useful for background music and extended narration.

The disadvantages for [`streaming sounds`](/typedoc/classes/BABYLON.StreamingSound) are they have fewer playback options than [`non-streaming static sounds`](/typedoc/classes/BABYLON.StaticSound). For example, streaming sounds can not be played for durations shorter than the sound file, they do not have the `loopStart` and `loopEnd` options, and initial playback may be delayed while the initial playback buffer is being downloaded, although this can be mitigated using the [`preloadCount` option](/typedoc/interfaces/BABYLON.IStreamingSoundOptions#preloadcount) or [`StreamingSound.preloadCount`](/typedoc/classes/BABYLON.StreamingSound#preloadcount) property.

TODO: Add streaming sound code snippet and playground example.

### Looping playback

Sounds stop playing automatically when playback reaches the end of the sound file. To make sounds continue playing from the beginning again instead of stopping at the end, set the sound to loop using one of the following methods:

1. Set the [`loop`](/typedoc/interfaces/BABYLON.IStaticSoundOptions#loop) option to `true` when creating the sound.
1. Set the sound's [`loop`](/typedoc/classes/BABYLON.AbstractSound#loop) property to `true` after creating the sound, but before calling the `play()` function.
1. Call the sound's [`play`](/typedoc/classes/BABYLON.AbstractSound#play) function with the [`loop`](/typedoc/interfaces/BABYLON.IAbstractSoundPlayOptions#loop) option set to `true`.

<br/>

For example, all three of the following code snippets loop the sound forever:

```javascript
const bounce = await BABYLON.CreateSoundAsync("bounce", "sounds/bounce.wav", { loop: true });

bounce.play();
```

```javascript
const bounce = await BABYLON.CreateSoundAsync("bounce", "sounds/bounce.wav");

bounce.loop = true;
bounce.play();
```

```javascript
const bounce = await BABYLON.CreateSoundAsync("bounce", "sounds/bounce.wav");

bounce.play({ loop: true });
```

TODO: Add static sound loop example.

## Playback instances

## Using browser-specific audio codecs

## Browser autoplay considerations

## TODO: Finish this page
