---
title: Animation Blocks
image:
description: Detailed reference for the Animation family in the Babylon.js Flow Graph Editor.
keywords: babylon.js, flow graph editor, animation blocks, interpolation, play animation
further-reading:
    - title: Block Reference
      url: /toolsAndResources/flowGraphEditor/blockReference
    - title: Validation and Property Editing
      url: /toolsAndResources/flowGraphEditor/validationAndProperties
    - title: Scene Context
      url: /toolsAndResources/flowGraphEditor/gettingStarted
video-overview:
video-content:
---

## Why Animation Blocks Matter

Animation blocks connect authored graph logic to time-based scene change.

They are useful when the graph should start, pause, stop, or interpolate values over time instead of reacting only as discrete steps.

## Core Animation Blocks

### `PlayAnimation`

Use `PlayAnimation` when the graph should start a configured animation group.

This block is most useful when the loaded scene already contains animation groups that can be selected from the property panel.

### `PauseAnimation`

Use `PauseAnimation` when a running animation should be paused without being fully reset.

### `StopAnimation`

Use `StopAnimation` when animation playback should stop entirely.

### `Interpolation`

Use `Interpolation` when the graph should move a value over time rather than jump directly between states.

This block is especially helpful in graphs driven by `SceneTickEvent` or other time-sensitive flows.

## Choosing The Right Block

- Use `PlayAnimation`, `PauseAnimation`, and `StopAnimation` for animation-group control.
- Use `Interpolation` when the graph should shape a value over time.
