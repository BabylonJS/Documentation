---
title: Playing Sounds and Music
image:
description: Dive into everything you could want to know about using the Babylon.js sound engine for simple to advanced audio.
keywords: diving deeper, sound, audio, sound engine, audio engine
further-reading:
  - title: Sound
    url: /typedoc/classes/BABYLON.StaticSound
  - title: Streaming Sound
    url: /typedoc/classes/BABYLON.StreamingSound
  - title: Audio Buses
    url: /typedoc/classes/BABYLON.AbstractAudioBus
video-overview:
video-content:
---

<br/>

The Babylon.js audio engine is based on the [Web Audio specification](https://webaudio.github.io/web-audio-api/). It features ambient, spatialized and directional sounds, and audio buses for signal routing and mixing.

The audio engine is simple and powerful, and its API is similar to the Babylon.js graphics APIs, which makes it easy to learn if you are already familiar with Babylon.js framework.

The sound formats supported by the audio engine are dictated by the browser. All browsers support the .mp3 and .wav formats, and most browsers support .ogg, .m4a, and .mp4. Other formats like .aac and .webm are browser-specific. When creating sounds, you can specify an array of sound file URLs to choose from and the first format recognized by the browser will be used. See [Using browser-specific audio codecs](#using-browser-specific-audio-codecs).

## Creating an audio engine

Before any sounds can be played, the audio engine must be created and initialized with the [`CreateAudioEngineAsync`](/typedoc/functions/BABYLON.CreateAudioEngineAsync) function. The available options for creating an audio engine are listed in the [`IWebAudioEngineOptions`](/typedoc/interfaces/BABYLON.IWebAudioEngineOptions) interface documentation.

The [`CreateAudioEngineAsync`](/typedoc/functions/BABYLON.CreateAudioEngineAsync) function is asynchronous, which means it returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that will resolve when the audio engine is ready.

**You must wait for the [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to resolve before use**, which can be done with the [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) keyword. The following code snippet shows how to do this:

```javascript
(async () => {
    const audioEngine = await BABYLON.CreateAudioEngineAsync();

    // Create sounds here, but don't call `play()` on them, yet ...

    // Wait until audio engine is ready to play sounds.
    await audioEngine.unlockAsync();

    // Start sound playback ...
})();
```

Note that the example code snippet creates an async function and calls it immediately, and that it uses `await` to wait for the audio engine to be "unlocked" since browsers prevent audio from playing until a user interaction occurs. See [Browser autoplay considerations](#browser-autoplay-considerations) for more information.

## Playing a sound

The simplest way to play a sound is to create it with the [`CreateSoundAsync`](/typedoc/functions/BABYLON.CreateSoundAsync) function, and call the sound's [`play()`](/typedoc/classes/BABYLON.AbstractSound#play) function after the audio engine is unlocked:

```javascript
const audioEngine = await BABYLON.CreateAudioEngineAsync();

const gunshot = await BABYLON.CreateSoundAsync("gunshot",
    "sounds/gunshot.wav"
);

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

gunshot.play()
```

<Playground id="#1BZK59#10" title="Playing a sound" description="A simple example of playing a sound."/>

<br/>
<br/>

## Streaming a sound

To stream sounds, use the [`CreateStreamingSoundAsync`](/typedoc/functions/BABYLON.CreateStreamingSoundAsync) function, which plays sounds using the browser's [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) feature.

Streaming sounds keep only a small chunk of the sound file in memory while playing instead of downloading the entire sound into an audio buffer beforehand. As a result, streaming sounds save a significant amount of memory when playing long sound files, and are useful for background music and extended narrations.

The main disadvantage of [`streaming sounds`](/typedoc/classes/BABYLON.StreamingSound) is they have fewer playback options than [`non-streaming static sounds`](/typedoc/classes/BABYLON.StaticSound). For example, streaming sounds can not be played for durations shorter than the sound file, they do not have the `loopStart` and `loopEnd` options, and initial playback may be delayed while the playback buffer is being filled (note that this can be avoided using the [`preloadCount` option](/typedoc/interfaces/BABYLON.IStreamingSoundOptions#preloadcount)).

Here is an example of playing a streaming sound:

```javascript
const narration = await BABYLON.CreateStreamingSoundAsync("narration",
    "https://assets.babylonjs.com/sound/testing/60-count.mp3"
);

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

narration.play()
```

<Playground id="#1BZK59#11" title="Streaming a sound" description="A simple example of playing a streaming sound."/>

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

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

sound.play(); // Instance #1.

setTimeout(() => {
    sound.playbackRate = 2;
    sound.play(); // Instance #2.
    sound.pitch = 100;
    sound.play(); // Instance #3.
}, 4000);
```

<Playground id="#1BZK59#12" title="Sound instances" description="An example of limiting the number of sound playback instances."/>

<br/>
<br/>

## Looping playback

Sounds stop playing automatically when playback reaches the end of the sound file. To make sounds restart from the beginning when they reach the end, set the sound's `loop` setting using any of the following methods:

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

<Playground id="#1BZK59#13" title="Looping playback" description="An example of looping sound playback three different ways."/>

<br/>
<br/>

## Volume

The sound, bus and audio engine `volume` setting adjusts sound loudness, with `0` to `1` being the normal range from silent to 100%. Values above `1` boost the sound's signal proportionately.

Volume options and properties are available on [sounds](/typedoc/classes/BABYLON.AbstractSound#volume) and [buses](/typedoc/classes/BABYLON.AbstractAudioBus#volume) which affect all sounds using the bus, and on the [audio engine](/typedoc/classes/BABYLON.AudioEngineV2#volume) which affects all sounds and buses associated with that audio engine.

```javascript
const audioEngine = await BABYLON.CreateAudioEngineAsync();
audioEngine.volume = 0.5;

const gunshot = await BABYLON.CreateSoundAsync("gunshot",
    "sounds/gunshot.wav"
);

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

gunshot.volume = 0.75;
gunshot.play()
```

## Stereo pan

The sound and bus `stereo.pan` setting moves a sound between the left and right speakers. The `stereo` property is available on [`sounds`](/typedoc/classes/BABYLON.AbstractSound#stereo) and [`buses`](/typedoc/classes/BABYLON.AudioBus#stereo), but not [`main buses`](/typedoc/classes/BABYLON.MainAudioBus). Values can range from `-1` to `1`. A value of negative one moves sound output to the left speaker, and a value of positive one moves sound output to the right speaker.

To create a sound with the `stereo.pan` option set, use the [`stereoPan`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#stereopan) option.

The following example plays a sound effect in the left speaker using the `stereo.pan` property:

```javascript
const audioEngine = await BABYLON.CreateAudioEngineAsync();
audioEngine.volume = 0.5;

const gunshot = await BABYLON.CreateSoundAsync("gunshot",
    "sounds/gunshot.wav",
    { stereoEnabled: true }
);

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

gunshot.stereo.pan = -1;
gunshot.play()
```

Note that this example creates the sound with the [`stereoEnabled`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#stereoenabled) option set to `true`. This is done because the underlying `stereo` property is not enabled by default, so a small delay occurs when enabling it for the first time. Setting the [`stereoEnabled`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#stereoenabled) option to `true` avoids this delay, as does setting the [`stereoPan`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#stereopan) option when the sound is created instead of using the [`stereo`](/typedoc/classes/BABYLON.AbstractSound#stereo) property later. Subsequent changes to the stereo settings are instantaneous after the [`stereo`](/typedoc/classes/BABYLON.AbstractSound#stereo) property has been enabled.

## Spatial audio

"Spatial audio" refers to sounds placed in a three dimensional space. It requires a "listener" to hear the audio, and a "source" to emit the audio. Listeners and sources both have a 3D position and direction, and sources have additional settings for specifying how the sound should propogate in the 3D space.

There is one spatial audio listener per audio engine. It can be accessed through the audio engine's [`listener`](/typedoc/classes/BABYLON.AudioEngineV2#listener) property.

Sounds and buses expose their spatial settings through their [`spatial`](/typedoc/classes/BABYLON.AbstractSound#spatial) property. See the [`AbstractSpatialAudio`](/typedoc/classes/BABYLON.AbstractSpatialAudio) documentation for details on the available spatial audio settings for sound sources.

### Attaching meshes

The easiest way to control the position and direction of a spatial sound source or listener is to attach it to a mesh or other graphics object. This can be done with the [`spatial.attach`](/typedoc/classes/BABYLON.AbstractSpatialAudio#attach) function, like in the following example:

```javascript
const bounce = await BABYLON.CreateSoundAsync("bounce",
    "sounds/bounce.wav",
    { spatialEnabled: true }
);

bounce.spatial.attach(mesh);

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

bounce.play({ loop: true });
```

Note that this example creates the sound with the [`spatialEnabled`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#spatialenabled) option set to `true`. This is done because the underlying `spatial` property is not enabled by default, so a small delay occurs when enabling it for the first time. Setting the [`spatialEnabled`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#spatialenabled) option to `true` avoids this delay, as does setting any of the spatial audio options when the sound is created.

<Playground id="#1BZK59#14" title="Attaching meshes" description="An example of attaching a spatial sound source to a mesh."/>

<br/>
<br/>

To experiment with the available [spatial sound source settings](/typedoc/classes/BABYLON.AbstractSpatialAudio), a spatial audio visualizer playground is provided:

<Playground id="#A9NDNJ" title="Spatial audio visualizer" description="A spatial audio settings visualizer."/>

<br/>
<br/>

## Audio buses

Audio buses combine the audio output of multiple sound sources into a single audio output. They make it possible to group sound output together, which makes it easier to manage large audio routing graphs and can be used to reduce the amount of CPU used for effects like [spatial audio](#spatial-audio).

Sounds and buses send their audio output to the bus specified by the [`outBus`](/typedoc/classes/BABYLON.AbstractSound#outbus) property, which can be set to a [`MainAudioBus`](/typedoc/classes/BABYLON.MainAudioBus) or a full-featured [`AudioBus`](/typedoc/classes/BABYLON.AudioBus).

### Main audio buses

A [`MainAudioBus`](/typedoc/classes/BABYLON.MainAudioBus) is the last bus that audio passes through before reaching the speakers. It always sends its output to the speakers. It can not send its output to another bus like [intermediate audio buses](#intermediate-audio-buses) can.

A default [`MainAudioBus`](/typedoc/classes/BABYLON.MainAudioBus) is created automatically by the audio engine, and all sounds and [intermediate audio buses](#intermediate-audio-buses) have their [`outBus`](/typedoc/classes/BABYLON.AbstractSound#outbus) property set to it by default.

Main buses are simpler than normal buses. They can not be used as [spatial audio](#spatial-audio) sources and they do not support [stereo pan](#stereo-pan). These features are only supported by sounds and [intermediate audio buses](#intermediate-audio-buses).

### Intermediate audio buses

Sounds send their audio output to a main bus by default, but the [`outBus`](/typedoc/classes/BABYLON.AbstractSound#outbus) can be changed to an intermediate [`AudioBus`](/typedoc/classes/BABYLON.AudioBus) instead if needed. This allows multiple sounds to be sent to a single [`AudioBus`](/typedoc/classes/BABYLON.AudioBus) that supports [stereo pan](#stereo-pan) and can be used as a [spatial audio](#spatial-audio) source.

Intermediate [`AudioBus`](/typedoc/classes/BABYLON.AudioBus) output can be sent to other intermediate audio buses as long as no cyclic audio routing loops are created. An error will be thrown if a cyclic routing loop is detected when setting the [`AudioBus.outBus`](/typedoc/classes/BABYLON.AudioBus#outbus) property.

Note that intermediate audio buses can not be the last bus in the audio routing graph. Only a [`MainAudioBus`](/typedoc/classes/BABYLON.MainAudioBus) can send audio to the speakers.

Here is a simple example of using an intermediate [`AudioBus`](/typedoc/classes/BABYLON.AudioBus):

```javascript
const bus = await BABYLON.CreateAudioBusAsync("bus",
    { spatialEnabled: true }
);

bus.spatial.attach(mesh);

const bounce = await BABYLON.CreateSoundAsync("bounce",
    "sounds/bounce.wav",
);

bounce.outBus = bus;

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

bounce.play({ loop: true });
```

<Playground id="#1BZK59#16" title="Audio buses" description="An example of chaining audio buses."/>

<br/>
<br/>

## Analyzer

The sound and bus `analyzer` property provides realtime analysis of the audio output's frequencies. The [`analyzer.getFloatFrequencyData()`](/typedoc/classes/BABYLON.AbstractAudioAnalyzer#getFloatFrequencyData) and [`analyzer.getByteFrequencyData()`](/typedoc/classes/BABYLON.AbstractAudioAnalyzer#getByteFrequencyData) functions return an array of volumes, in decibels, corresponding to the frequencies analyzed. Calling these functions quickly and repeatedly over time is useful for frequency-based visualizations, like in the following example:

```javascript
const bounce = await BABYLON.CreateSoundAsync("bounce",
    "sounds/bounce.wav",
    { analyzerEnabled: true }
);

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

bounce.play({ loop: true });

// Get the audio analyzer frequency data on every frame.
scene.onBeforeRenderObservable.add(() => {
    const frequencies = bounce.analyzer.getByteFrequencyData();
    for (let i = 0; i < 16; i++) {
        columns[i].value = frequencies[i] / 255;
    }
});
```

Note that this example creates the sound with the [`analyzerEnabled`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#analyzerenabled) option set to `true`. This is done because the underlying `analyzer` property is not enabled by default, so a small delay occurs when enabling it for the first time. Setting the [`analyzerEnabled`](/typedoc/interfaces/BABYLON.IAbstractSoundOptions#analyzerenabled) option to `true` avoids this delay, as does setting any of the analyzer options when the sound is created.

Here is an example playground that uses the analyzer to animate frequency-based shader.

<Playground id="#1BZK59#17" title="Audio analyzer" description="An example of using the audio analyzer."/>

<br/>
<br/>

## Sound buffers

When sound is created with the [`CreateSoundAsync`](/typedoc/functions/BABYLON.CreateSoundAsync) function using a URL for the `source` parameter, the sound is downloaded and decoded into an in-memory data structure called a [sound buffer](/typedoc/classes/BABYLON.StaticSoundBuffer) which can be reused when creating other sounds referencing the same `source` URL. This lets you avoid downloading and decoding the same audio data multiple times.

Here is an example of reusing a sound buffer with the [`StaticSound.buffer`](/typedoc/classes/BABYLON.StaticSound#buffer) property:

```javascript
const bounce1 = await BABYLON.CreateSoundAsync("bounce1",
    "sounds/bounce.wav"
);

const bounce2 = await BABYLON.CreateSoundAsync("bounce2",
    bounce1.buffer,
    { playbackRate: 2 }
);

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

bounce1.play();
bounce2.play();
```

Note that the first sound uses a URL for its `source` parameter, and the second sound uses the first sound's [`buffer`](/typedoc/classes/BABYLON.StaticSound#buffer) for its `source` parameter.

Sound buffers can also be created using the [`CreateSoundBufferAsync`](/typedoc/functions/BABYLON.CreateSoundBufferAsync) function, like in this example:

```javascript
const soundBuffer = await BABYLON.CreateSoundBufferAsync(
    "sounds/bounce.wav"
);

const bounce1 = await BABYLON.CreateSoundAsync("bounce1",
    soundBuffer
);

const bounce2 = await BABYLON.CreateSoundAsync("bounce2",
    soundBuffer
    { playbackRate: 2 }
);

// Wait until audio engine is ready to play sounds.
await audioEngine.unlockAsync();

bounce1.play();
bounce2.play();
```

## Using browser-specific audio codecs

Some sound file types like **.ac3** and **.ogg** are not recognized by all browsers. The **.ac3** format for example, is recognized by Apple's Safari browser and is the most efficient on Apple platforms, but it is not recognized by other browsers. Conversely, the **.ogg** format is also efficient but it is not recognized by Safari. Other formats like **.mp3** and **.wav** are lower quality or less efficient but are recognized by all browsers.

To address these differences you can limit the formats used to **.mp3** and **.wav** to maximize compatibility at the expense of quality and efficiency, or you can use an array of sound file URLs when creating sounds and sound buffers to maximize efficiency while retaining quality. The first file in the URL array that is recognized by the browser will be used. This allows you to specify different file formats for different platforms.

For example, if the following array of URLs is used for the [`CreateSoundAsync`](/typedoc/functions/BABYLON.CreateSoundAsync) `source` paramter, Safari will see the **.ac3** file first and use it, but other browsers will ignore the **.ac3** file and skip to the **.ogg** file, instead. If a browser does not support **.ac3** or **.ogg**, then it will fall through to the **.mp3** file that is last in the array.

```javascript
const sound = BABYLON.CreateSoundAsync("sound", [
    "https://assets.babylonjs.com/sound/testing/ac3.ac3",
    "https://assets.babylonjs.com/sound/testing/ogg.ogg",
    "https://assets.babylonjs.com/sound/testing/mp3.mp3",
]);
```

If needed, this behavior can be disabled by setting the [`skipCodecCheck`](/typedoc/interfaces/BABYLON.IStaticSoundOptions#skipcodeccheck) option to `false` when creating a sound or sound buffer.

## Browser autoplay considerations

When working with audio in the browser, [autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) must be considered. Autoplay is generally disabled by default in most browsers and as a result, the Babylon audio engine can not play sounds until a user interaction has occurred on the page.

By default, the Babylon audio engine shows an unmute button in the top left corner of the render area that when pressed, unlocks the audio engine and lets sounds play. This button can be disabled when creating the audio engine by setting the [`disableDefaultUI`](/typedoc/interfaces/BABYLON.IWebAudioEngineOptions#disabledefaultui) options to `false`.

The audio engine also adds a `click` handler to the entire document by default, which unlocks the audio engine on any user interaction, not just the unmute button. This can be disabled by setting the [`resumeOnInteraction`](/typedoc/interfaces/BABYLON.IWebAudioEngineOptions#resumeOnInteraction) option to `false`.

In some rare cases, the browser automatically locks the audio engine after it has been unlocked, like when VisionOS enters WebXR immersive mode. By default, the audio engine will attempt to unlock the audio engine automatically when this occurs. This should work in all cases, but it can be disabled by setting the [`resumeOnPause`](/typedoc/interfaces/BABYLON.IWebAudioEngineOptions#resumeonpause) option to `false` if needed.

### Playing sounds after the audio engine is unlocked

If a sound has its [`play`](/typedoc/classes/BABYLON.AbstractSound#play) function called while the audio engine is locked, the sound will not play. If a sound is set to loop and its `autoplay` setting is turned on or its [`play`](/typedoc/classes/BABYLON.AbstractSound#play) function is called while the audio engine is locked, then the sound will start playing automatically when the audio engine is unlocked. If the sound is not set to loop, and its [`play`](/typedoc/classes/BABYLON.AbstractSound#play) function is called while the audio engine is locked, then it will **not** be automatically started when the audio engine is unlocked, even if its `autoplay` setting is turned on.

### Unmute button

The Bablyon audio engine's unmute button unlocks the audio engine. It is shown automatically when the audio engine is locked, but it can be disabled when creating the audio engine by setting the [`disableDefaultUI`](/typedoc/interfaces/BABYLON.IWebAudioEngineOptions#disabledefaultui) options to `false`.

The unmute button's CSS styling can be modified using the `#babylonUnmuteButton` id, like the following example that moves the button to the bottom left and makes it twice as big:

```javascript
const audioEngine = await BABYLON.CreateAudioEngineAsync();

const unmuteButtonStyle = document.createElement("style");

unmuteButtonStyle.appendChild(
    document.createTextNode(`
        #babylonUnmuteButton {
            top: unset;
            bottom: 35px;
            margin-left: 50px;
            transform: scale(2);
        }
        #babylonUnmuteButton:hover {
            transform: scale(2.5);
        }
    `)
);

document.head.appendChild(unmuteButtonStyle);
```

<Playground id="#1BZK59#18" title="Unmute styling" description="An example of customizing the unmute button's CSS styling."/>

## Feature requests and bug fixes

To request new features or bug fixes, create a new topic at https://forum.babylonjs.com and tag [`@docEdub`](https://forum.babylonjs.com/u/docedub/summary). Thanks!
