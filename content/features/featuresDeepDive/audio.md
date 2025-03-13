---
title: Audio
image:
description: Dive into using the Babylon.js sound engine for simple to advanced audio.
keywords: diving deeper, sound, audio, sound engine, audio engine
further-reading:
video-overview:
video-content:
---

The Babylon.js audio engines are based on the [**Web Audio specification**](https://webaudio.github.io/web-audio-api/). They  feature ambient, spatialized and directional sounds, as well as basic audio buses for signal routing and mixing.

There are 2 sound engines in Babylon.js.

- a new `AudioEngineV2` with support for modern JavaScript using the latest features of the WebAudio API.

  > [🚀 You can find the `AudioEngineV2` API documented here](/features/featuresDeepDive/audio/playingSoundsMusic).

- an older `AudioEngine`, which is a pre-8.0 Legacy API that is now deprecated.

  > [⚠️ The documentation for the older `AudioEngine` has been moved to the Legacy section.](/legacy/audio)

**We strongly recommend using the new V2 audio engine instead of the old legacy audio engine. [A migration guide is here](/features/featuresDeepDive/audio/migrate).**
