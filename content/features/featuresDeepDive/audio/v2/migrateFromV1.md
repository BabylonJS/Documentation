---
title: Migrate from Old Audio Engine
image:
description: A guide on best practices to port a scene that uses the old audio engine to the new audio engine v2
keywords: diving deeper, audio, migration
further-reading:
video-overview:
video-content:
---

# Migrate from the old audio engine

Babylon 8.0 brought a new audio engine, which faster, more powerful and easier to use than the old audio engine.

## How to continue using the old audio engine

The old audio engine is not going away! It is turned off by default now, but it can be enabled by setting the [`audioEngine`](/typedoc/interfaces/BABYLON.EngineOptions#audioengine) option to `true` when creating the graphics engine with the [`Engine constructor`](/typedoc/classes/BABYLON.Engine#constructor), for example:

```javascript
const engine = new BABYLON.Engine(canvas, true, { audioEngine: true }, true);
```

## Audio engine objects are created with functions

The old audio engine's `Sound` and `SoundTrack` objects are created using constructors and are dependent on the graphics engine and scene.

The new audio engine is fully decoupled from the graphics engine and scene, and its audio objects are created using async functions instead of constructors. Use the following functions to create new audio engine objects:

- [`CreateAudioEngineAsync`](/typedoc/functions/BABYLON.CreateAudioEngineAsync)
- [`CreateSoundAsync`](/typedoc/functions/BABYLON.CreateSoundAsync)
- [`CreateStreamingSoundAsync`](/typedoc/functions/BABYLON.CreateStreamingSoundAsync)
- [`CreateSoundBufferAsync`](/typedoc/functions/BABYLON.CreateSoundBufferAsync)
- [`CreateAudioBusAsync`](/typedoc/functions/BABYLON.CreateAudioBusAsync)
- [`CreateMainAudioBusAsync`](/typedoc/functions/BABYLON.CreateMainAudioBusAsync)

Or call the equivalent functions on the audio engine directly:

- [`AudioEngineV2.createSoundAsync`](/typedoc/classes/BABYLON.AudioEngineV2#createsoundasync)
- [`AudioEngineV2.createStreamingSoundAsync`](/typedoc/classes/BABYLON.AudioEngineV2#createstreamingsoundasync)
- [`AudioEngineV2.createSoundBufferAsync`](/typedoc/classes/BABYLON.AudioEngineV2#createsoundbufferasync)
- [`AudioEngineV2.createBusAsync`](/typedoc/classes/BABYLON.AudioEngineV2#createbusasync)
- [`AudioEngineV2.createMainBusAsync`](/typedoc/classes/BABYLON.AudioEngineV2#createmainbusasync)

## Sounds and streaming sounds are now separate classes

In the old audio engine, there is one `Sound` class for both static sounds and streaming sounds, and the `streaming` option is used to differentiate them. This is confusing because some sound options only apply to static sounds, and some streaming features do not work well across browsers so they should not be used.

To address these issues, the new audio engine has separate classes for static and streaming sounds, with a clear separate between the available options and features.

See the [sound](../playingSoundsMusic/#playing-a-sound) and [streaming sound](../playingSoundsMusic/#streaming-a-sound) documentation for more information.

## Sound tracks are now called audio buses

In the old audio engine, [`SoundTrack`](/typedoc/classes/BABYLON.SoundTrack) objects are used for audio routing and managing groups of sounds, and they can only route sounds, not other sound tracks. This makes creating extended audio routing chains impossible. Another limitation of sound tracks is they have no stereo or spatial audio features.

In the new audio engine, sound tracks replaced by [audio buses](../playingSoundsMusic/#audio-buses), which implement stereo and spatial audio, and allow their audio output to be routed to other audio bus objects using the [`AudioBus.outBus`](/typedoc/classes/BABYLON.AudioBus#outbus) property.

## Feature requests and bug fixes

To request new features or bug fixes, create a new topic at https://forum.babylonjs.com and tag [`@docEdub`](https://forum.babylonjs.com/u/docedub/summary). Thanks!
