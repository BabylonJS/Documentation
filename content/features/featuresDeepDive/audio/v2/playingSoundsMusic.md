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

The Babylon.js audio engine is based on the [Web Audio specification](https://webaudio.github.io/web-audio-api/). It features ambient, spatialized and directional sounds, as well as basic audio buses for signal routing and mixing.

The audio engine is simple and powerful, and its API is similar to the Babylon.js graphics APIs, which makes it easier to learn for users already familiar with the rest of the Babylon.js framework.

The sound formats supported by the audio engine are dictated by the browser. All browsers support the .mp3 and .wav formats, and most browsers support .ogg, .m4a, and .mp4. Other formats like .aac and .webm are browser-specific. When creating sounds, you can specify an array of sound file URLs to choose from and the first format recognized by the browser will be used. See [Using browser-specific audio codecs](#using-browser-specific-audio-codecs).

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

## Streaming a sound

To stream sounds use the [`CreateStreamingSoundAsync`](/typedoc/functions/BABYLON.CreateStreamingSoundAsync) function which plays sounds using the browser's [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) feature.

The advantage of streaming sounds is they keep a small chunk of the sound file in memory while playing instead of downloading the entire sound into an audio buffer beforehand. As a result, streaming sounds save a significant amount of memory when playing long sound files, and are useful for background music and extended narration.

The disadvantages of [`streaming sounds`](/typedoc/classes/BABYLON.StreamingSound) are they have fewer playback options than [`non-streaming static sounds`](/typedoc/classes/BABYLON.StaticSound). For example, streaming sounds can not be played for durations shorter than the sound file, they do not have the `loopStart` and `loopEnd` options, and initial playback may be delayed while the initial playback buffer is being downloaded (although this can be avoided using the [`preloadCount` option](/typedoc/interfaces/BABYLON.IStreamingSoundOptions#preloadcount)).

TODO: Add streaming sound code snippet and playground example.

## Sound instances

When a sound's `play` function is called, it creates a sound "instance" to perform the audio playback using the sound's current settings. Calling `play` multiple times causes multiple instances to be created, allowing individual sounds to be played simultaneously and overlapped.

You can limit the number of instances that get created by setting a sound's [`maxInstances`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#maxinstances) option or [`maxInstances`](/typedoc/classes/BABYLON.AbstractSound#maxinstances) property. When `maxInstances` is exceeded, old instances are stopped and deactivated until the number of active instances is reduced to the given maximum. For example, if `maxInstances` is set to `2`, calling `play` 3 times in a row will cause the 1st instance to be stopped automatically so the 3rd instance can play without the `maxInstances` setting being exceeded.

Some sound functions and properties affect all of the currently playing instances, like the [`stop`](/typedoc/classes/BABYLON.AbstractSound#stop) function and the [`volume`](/typedoc/classes/BABYLON.AbstractSound#volume) property.

The [`currentTime`](/typedoc/classes/BABYLON.AbstractSound#currenttime) property, however, affects only the most recently started playback instance. Other properties only affect new playback instances created by the sound's `play` function after the properties have been set. For example, changing a sound's `loop` property from `false` to `true` will not make any of the currently playing instances start looping. Only new playback instances will take the updated `loop` property's value.

Here's an example of playing a sound 3 times with the [`maxInstances`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#maxinstances) option set to 2. Notice that the first playback instance is stopped when the third instance plays. Also notice that the changes to the [`playbackRate`](/typedoc/interfaces/BABYLON.IStaticSoundOptions#playbackrate) property only affect new instances, with no effect on currently playing instances.

```javascript
const sound = await BABYLON.CreateSoundAsync("sound", "sounds/alarm-1.mp3", { maxInstances: 2 });

sound.play(); // Instance #1.

setTimeout(() => {
    sound.playbackRate = 2;
    sound.play(); // Instance #2.
    sound.pitch = 100;
    sound.play(); // Instance #3.
}, 4000);
```

See this playground for a full example: <Playground id="#VP1B9P#7" title="Sound instances" description="An example of limiting the number of sound playback instances."/>

## Looping playback

Sounds stop playing automatically when playback reaches the end of the sound file. To make sounds continue playing from the beginning again instead of stopping at the end, set the sound to loop using one of the following methods:

1. Set the [`loop`](/typedoc/interfaces/BABYLON.IStaticSoundOptions#loop) option to `true` when creating the sound.
1. Set the sound's [`loop`](/typedoc/classes/BABYLON.AbstractSound#loop) property to `true` after creating the sound, but before calling the `play()` function.
1. Call the sound's [`play`](/typedoc/classes/BABYLON.AbstractSound#play) function with the [`loop`](/typedoc/interfaces/BABYLON.IAbstractSoundPlayOptions#loop) option set to `true`.

<br/>

For example, all three of the following code snippets loop the sound repeatedly:

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

TODO: Add static sound loop playground.

## Volume

The volume can be set using the `volume` property available for [sounds](/typedoc/classes/BABYLON.AbstractSound#volume) and [buses](http://localhost:3000/typedoc/classes/BABYLON.AbstractAudioBus#volume) which affects all sounds using  the bus, and there is also the [audio engine master volume](/typedoc/classes/BABYLON.AudioEngineV2#volume) which affects all sounds created using the audio engine.

## Stereo panning

TODO: Document the `stereo` subproperty on sounds and buses.

## Spatialization

TODO: Document the `spatial` subproperty on sounds and buses.

TODO: Document the `listener` subproperty on the audio engine.

## Audio buses

TODO: Document `AudioBus` and `MainAudioBus` classes.
- Talk about the audio engine's default main bus.
- Talk about the sound and audio bus `outBus` property.

## Analyzer

TODO: Document the `analyzer` subproperty on sounds and buses.

## Sound buffers

TODO: Document reusing sound buffers across multiple sounds.
- Talk about CPU and memory savings from sharing buffers.

## Using browser-specific audio codecs

TODO: Document using URLs in string arrays when creating sounds.

## Browser autoplay considerations

TODO: Document browser autoplay restrictions and how that affects the audio engine.
- Talk about how sound `autoplay` and `loop` options affect playback when the audio context is unlocked.
