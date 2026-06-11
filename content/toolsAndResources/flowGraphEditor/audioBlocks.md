---
title: Audio Blocks
image:
description: Detailed reference for the Audio families in the Babylon.js Flow Graph Editor.
keywords: babylon.js, flow graph editor, audio blocks, sound, audio v2
further-reading:
    - title: Block Reference
      url: /toolsAndResources/flowGraphEditor/blockReference
    - title: Supported Block Families
      url: /toolsAndResources/flowGraphEditor/supportedBlockFamilies
    - title: Authoring, Validation, and Debugging
      url: /toolsAndResources/flowGraphEditor/authoringAndDebugging
video-overview:
video-content:
---

## Why Audio Blocks Matter

The Audio families let graph logic coordinate with Babylon.js Audio V2 playback.

These blocks are useful when interaction logic should start, stop, pause, or inspect sounds as part of a larger scene behavior.

## Audio Actions

### `PlaySound`

Use `PlaySound` to start an Audio V2 sound with playback options such as volume, offset, and looping.

### `StopSound`

Use `StopSound` when a sound should be halted immediately.

### `PauseSound`

Use `PauseSound` when the graph should pause a playing sound or resume one that is already paused.

### `SetSoundVolume`

Use `SetSoundVolume` when interaction logic should change a sound's volume dynamically.

## Audio Events

### `SoundEndedEvent`

Use `SoundEndedEvent` when graph logic should react to playback completion.

## Audio Data

### `GetSoundVolume`

Reads the sound's current volume.

### `IsSoundPlaying`

Reports whether the sound is currently playing or starting.

## Practical Notes

- These blocks target Audio V2 objects.
- They are most useful when the loaded scene already contains or creates the relevant sound references.
- Audio control often pairs well with pointer, pick, and custom event workflows.
