---
title: Getting Started - Chapter 2 - Sound
image:
description: Continue your Babylon.js learning by adding sound to your scene.
keywords: getting started, start, chapter 2, sound, audio
further-reading:
video-overview:
video-content:
---

# Getting Started - Sound

## Adding Sound

Adding sounds to your world is very easy.

First, create an audio engine and unlock it. Note that we're using `await` to wait for the promises to resolve, so this needs to be done in an `async` function, for example:

```javascript
async function initAudio() {
  const audioEngine = await BABYLON.CreateAudioEngineAsync();
  await audioEngine.unlock();

  // Audio engine is ready to play sounds ...
}
```


For continuously looping background music we use a streaming sound:

```javascript
BABYLON.CreateStreamingSoundAsync("name", "<sound file URL>", { loop: true, autoplay: true }, audioEngine);
```

<Playground id="#SFCC74#773" title="Adding Sound To Your Scene" description="A playground showing how easy it is to add sound to your scene." image="/img/playgroundsAndNMEs/gettingStartedGround.jpg"/>


To play a short sound once we can use a sound that plays from a fully downloaded buffer:

```javascript
const sound = await BABYLON.CreateSoundAsync("sound", "<sound file URL>");
sound.play();
```

In the example below *setInterval* is used to play the sound every 3 seconds

<Playground id="#SFCC74#776" title="Playing Sound Every 3 Seconds" description="Set an interval to play a sound every 3 seconds." image="/img/playgroundsAndNMEs/gettingStartedGround.jpg"/>

Since you probably prefer listening to your own music as you work, and repeated sounds can get annoying, the above playground examples are the only ones in this tutorial that load sounds.

Now back to making our world and the developing our buildings! Buildings come in varied sizes, positions and orientations and this will be true for the world we are creating.
