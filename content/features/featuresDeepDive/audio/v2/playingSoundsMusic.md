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

Before any sounds can be played, the audio engine must be created and initialized with the [`CreateAudioEngineAsync`](/typedoc/functions/BABYLON.CreateAudioEngineAsync) function. The available options for creating an audio engine are listed in the [`IWebAudioEngineOptions`](/typedoc/interfaces/BABYLON.IWebAudioEngineOptions) interface documentation.

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
    const gunshot = await BABYLON.CreateSoundAsync("gunshot",
        "sounds/gunshot.wav"
    );

    await audioEngine.unlock();

    // Audio engine is ready to play sounds ...
    gunshot.play()
}
```

<Playground id="#VP1B9P" title="Playing a sound" description="A simple example of playing a sound."/>

<br/>
<br/>

## Streaming a sound

To stream sounds, use the [`CreateStreamingSoundAsync`](/typedoc/functions/BABYLON.CreateStreamingSoundAsync) function, which plays sounds using the browser's [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) feature.

Streaming sounds keep only a small chunk of the sound file in memory while playing instead of downloading the entire sound into an audio buffer beforehand. As a result, streaming sounds save a significant amount of memory when playing long sound files, and are useful for background music and extended narrations.

The main disadvantage of [`streaming sounds`](/typedoc/classes/BABYLON.StreamingSound) is they have fewer playback options than [`non-streaming static sounds`](/typedoc/classes/BABYLON.StaticSound). For example, streaming sounds can not be played for durations shorter than the sound file, they do not have the `loopStart` and `loopEnd` options, and initial playback may be delayed while the playback buffer is being filled (note that this can be avoided using the [`preloadCount` option](/typedoc/interfaces/BABYLON.IStreamingSoundOptions#preloadcount)).

Here is an example of playing a streaming sound:

```javascript
async function initAudio() {
    const audioEngine = await BABYLON.CreateAudioEngineAsync();
    const narration = await BABYLON.CreateStreamingSoundAsync("narration",
        "https://assets.babylonjs.com/sound/testing/60-count.mp3"
    );

    await audioEngine.unlock();

    // Audio engine is ready to play sounds ...
    narration.play()
}
```

<Playground id="#VP1B9P#10" title="Streaming a sound" description="A simple example of playing a streaming sound."/>

<br/>
<br/>

## Sound instances

When a sound's `play` function is called, it creates a sound "instance" to perform the audio playback using the sound's current settings. Calling `play` multiple times causes multiple instances to be created, allowing individual sounds to be played simultaneously and overlapped.

You can limit the number of instances that get created using a sound's `maxInstances` setting. When the [`maxInstances` option](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#maxinstances) or [property](/typedoc/classes/BABYLON.AbstractSound#maxinstances) is exceeded, old instances are stopped and deactivated until the number of active instances is reduced to the given maximum. For example, if `maxInstances` is set to `2`, calling `play` three times in a row makes the first instance stop automatically so the third instance can play without the `maxInstances` setting being exceeded.

Some sound functions and settings affect all of the currently playing instances, like the [`stop`](/typedoc/classes/BABYLON.AbstractSound#stop) function and the [`volume`](/typedoc/classes/BABYLON.AbstractSound#volume) property. However, **the [`currentTime`](/typedoc/classes/BABYLON.AbstractSound#currenttime) property only affects the newest playback instance**. Other properties only affect new playback instances created by the sound's `play` function after the properties have been set. For example, changing a sound's `loop` property from `false` to `true` will not make any of the currently playing instances start looping. Only new playback instances will take the updated `loop` property's value.

Here's an example of playing a sound 3 times with the [`maxInstances`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#maxinstances) option set to 2. Notice that the first playback instance is stopped when the third instance plays. Also notice that the changes to the [`playbackRate`](/typedoc/interfaces/BABYLON.IStaticSoundOptions#playbackrate) and [`pitch`](/typedoc/interfaces/BABYLON.IStaticSoundOptions#pitch) properties have no effect on currently playing instances. Only new instances are affected when those properties are changed.

```javascript
const sound = await BABYLON.CreateSoundAsync("sound",
    "https://assets.babylonjs.com/sound/alarm-1.mp3",
    { maxInstances: 2 }
);

sound.play(); // Instance #1.

setTimeout(() => {
    sound.playbackRate = 2;
    sound.play(); // Instance #2.
    sound.pitch = 100;
    sound.play(); // Instance #3.
}, 4000);
```

<Playground id="#VP1B9P#8" title="Sound instances" description="An example of limiting the number of sound playback instances."/>

<br/>
<br/>

## Looping playback

Sounds stop playing automatically when playback reaches the end of the sound file. To make sounds restart from the beginning when they reach the end, set the sound's `loop` setting any of the following ways:

1. Set the [`loop`](/typedoc/interfaces/BABYLON.IStaticSoundOptions#loop) option to `true` when creating the sound.
1. Set the sound's [`loop`](/typedoc/classes/BABYLON.AbstractSound#loop) property to `true` after creating the sound, but before calling the `play()` function.
1. Call the sound's [`play`](/typedoc/classes/BABYLON.AbstractSound#play) function with the [`loop`](/typedoc/interfaces/BABYLON.IAbstractSoundPlayOptions#loop) option set to `true`.

<br/>

For example, the following code snippets all loop the sound indefinitely:

```javascript
const bounce = await BABYLON.CreateSoundAsync("bounce",
    "sounds/bounce.wav",
    { loop: true }
);

bounce.play();
```

```javascript
const bounce = await BABYLON.CreateSoundAsync("bounce",
    "sounds/bounce.wav"
);

bounce.loop = true;
bounce.play();
```

```javascript
const bounce = await BABYLON.CreateSoundAsync("bounce",
    "sounds/bounce.wav"
);

bounce.play({ loop: true });
```

<Playground id="#VP1B9P#12" title="Looping playback" description="An example of looping sound playback three different ways."/>

<br/>
<br/>

## Volume

The sound, bus and audio engine `volume` setting adjusts sound loudness, with `0` to `1` being the normal range of silent to 100% and values above `1` boosting the sound's signal proportionately. Volume options and properties are available on [sounds](/typedoc/classes/BABYLON.AbstractSound#volume) and [buses](http://localhost:3000/typedoc/classes/BABYLON.AbstractAudioBus#volume) which affect all sounds using the bus, and on the [audio engine](/typedoc/classes/BABYLON.AudioEngineV2#volume) which affects all sounds and buses associated with that audio engine.

```javascript
async function initAudio() {
    const audioEngine = await BABYLON.CreateAudioEngineAsync();
    audioEngine.volume = 0.5;

    const gunshot = await BABYLON.CreateSoundAsync("gunshot",
        "sounds/gunshot.wav"
    );

    await audioEngine.unlock();

    // Audio engine is ready to play sounds ...

    gunshot.volume = 0.75;
    gunshot.play()
}
```

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
