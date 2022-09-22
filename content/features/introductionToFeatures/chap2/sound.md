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

For continuous sounds we use

```javascript
const sound = new BABYLON.Sound("name", "url to sound file", scene, null, { loop: true, autoplay: true });
```

<Playground id="#SFCC74#3" title="Adding Sound To Your Scene" description="A playground showing how easy it is to add sound to your scene." image="/img/playgroundsAndNMEs/gettingStartedGround.jpg"/>

To play a sound once we use

```javascript
const sound = new BABYLON.Sound("sound", "url to sound file", scene);
//Leave time for the sound file to load before playing it
sound.play();
```

To account for loading time, in the example below _setInterval_ is used to play the sound every 3 seconds

<Playground id="#SFCC74#4" title="Playing Sound Every 3 Seconds" description="Set an interval to play a soundn every 3 seconds." image="/img/playgroundsAndNMEs/gettingStartedGround.jpg"/>

Since you probably prefer listening to your own music as you work and oft repeated sound can get annoying the above playground examples are the only ones in Getting Started that load sounds.

Now back to making our world and the developing our buildings. Buildings come in varied sizes, positions and orientations and this will be true for the world we are creating.
