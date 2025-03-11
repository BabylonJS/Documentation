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

## Using browser-specific audio codecs

## TODO: Finish this page
