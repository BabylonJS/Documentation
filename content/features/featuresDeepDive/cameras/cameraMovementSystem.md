---
title: Camera Movement and Input System
image:
description: How the declarative camera movement and input mapping system on ArcRotateCamera and GeospatialCamera works, and how to customize it.
keywords: diving deeper, cameras, input, camera input, arc rotate, geospatial, input mapper, movement, inertia, framerate independence
further-reading:
  - title: Customizing Camera Inputs (legacy plugin manager)
    url: /features/featuresDeepDive/cameras/customizingCameraInputs
video-overview:
video-content:
---

## Overview

`ArcRotateCamera` and `GeospatialCamera` route every frame's input through a small two-layer system:

1. **`InputMapper`** — a declarative table (the **inputMap**) of rules that translate a physical input event (a pointer button + modifier, a key code, a wheel scroll) into a logical **interaction** (`"pan"`, `"rotate"`, `"zoom"`).
2. **`CameraMovement`** — a per-camera physics layer that accumulates per-frame pixel deltas, applies inertial decay, and produces framerate-independent movement deltas that the camera applies each frame.

Both objects are accessible from the camera:

```javascript
const mapper = camera.movement.input;          // InputMapper instance
const movement = camera.movement;              // CameraMovement instance (subclass per camera)
```

This page covers what each layer does, when to use which API, and the back-compatibility story with legacy flags. For the older plugin-style input manager (`camera.inputs`), see [Customizing Camera Inputs](/features/featuresDeepDive/cameras/customizingCameraInputs).

## Why two layers

The legacy approach had a separate boolean or numeric property for every customization: `useCtrlForPanning`, `panningMouseButton`, `useAltToZoom`, `multiTouchPanAndZoom`, `inertia`, `panningInertia`, `inertialAlphaOffset`, … and each input class had hardcoded button-to-action logic. Adding a new gesture (say, "shift + middle-drag should zoom") meant a new flag, another `if` in every relevant input class, and often cross-input snooping.

Splitting things into a declarative inputMap and a separate physics layer means:

- Each input class becomes a thin translator: it observes the DOM, looks up the matching inputMap entry, and dispatches to the typed handler.
- Customizing a binding is a single `addEntry` / `setInteraction` call, no recompilation needed.
- Inertia and decay live in one place and produce framerate-independent motion regardless of whether the user is at 60Hz, 144Hz, or single-stepping.

## The inputMap

The inputMap is a plain ordered array of entries. Each entry has a `source` (`"pointer" | "wheel" | "touch" | "keyboard"`), an `interaction` string ( `"pan" | "rotate" | "zoom"` for the built-in cameras), optional **conditions** that gate when it matches (button, key, modifiers), and optional **sensitivity** multipliers.

Resolution is **first-match-wins**. The mapper walks the array in order and returns the first entry whose source and conditions match the current input. **Order matters: more specific entries must come before less specific ones.**

### ArcRotateCamera defaults

| Source | Conditions | Interaction |
|---|---|---|
| `pointer` | `button: 0`, `ctrl` | `pan` |
| `pointer` | `button: 0` | `rotate` |
| `pointer` | `button: 2` | `pan` |
| `wheel` | _(any)_ | `zoom` |
| `keyboard` | `key: [187, 107, 189, 109]` (`+ -`) | `zoom` |
| `keyboard` | `ctrl` | `pan` |
| `keyboard` | `alt` | `zoom` |
| `keyboard` | _(any)_ | `rotate` |

### GeospatialCamera defaults

| Source | Conditions | Interaction |
|---|---|---|
| `pointer` | `button: 0` | `pan` (drag globe) |
| `pointer` | `button: 1` | `rotate` (tilt) |
| `pointer` | `button: 2` | `rotate` (tilt) |
| `wheel` | _(any)_ | `zoom` |
| `keyboard` | `key: [187, 107, 189, 109]` (`+ -`) | `zoom` |
| `keyboard` | `ctrl` | `rotate` |
| `keyboard` | `alt` | `rotate` |
| `keyboard` | _(any)_ | `pan` |

## When to use which API

The InputMapper exposes a small surface of mutation methods. Picking the right one keeps your code intent clear and avoids accidentally clobbering other entries.

| You want to… | Use | Why |
|---|---|---|
| Add a brand-new input combo (e.g. ctrl+drag on a camera that doesn't already have one) | `addEntry` | Inserts at the correct position by specificity so the new entry wins where it should. |
| Swap which interaction an _existing_ entry produces (e.g. flip the existing ctrl+drag entry from pan to rotate) | `setInteraction` | Mutates the matched entry's `interaction` in place. Doesn't add or remove entries. |
| Bulk-swap interactions on every entry that matches some conditions (e.g. all keys currently bound to pan should become rotate) | `setInteractions` (plural) | Updates every matching entry; returns the count. |
| Tweak a property on an existing entry (e.g. change wheel-zoom sensitivity) | `getEntry` then mutate | Returns a reference to the live entry. |
| Get every entry matching a description | `getEntries` | Useful for bulk sensitivity tuning or auditing. |
| Restore the default mappings after experimenting | `resetInputMap` | Calls the factory the camera registered at construction time. |

The first row is the most common gotcha. `setInteraction` mutates the entry that `resolveInteraction` would have returned — if you ask it to swap an input combo that isn't already a distinct entry in the map, it will mutate the catch-all entry that absorbed it, which usually breaks unmodified gestures.

### Example: `setInteraction` (swap an existing binding)

ArcRotateCamera already has both `{ button: 0, modifiers: { ctrl: true }, interaction: "pan" }` and `{ button: 0, interaction: "rotate" }` in its default map. You can flip them so plain left-drag pans and ctrl+left-drag rotates:

```javascript
const input = camera.movement.input;

// Make plain left-drag pan instead of rotate
input.setInteraction("pointer", { button: 0 }, "pan");

// Make ctrl+left-drag rotate instead of pan
input.setInteraction("pointer", { button: 0, modifiers: { ctrl: true } }, "rotate");
```

Live playground: <Playground id="#A1CDLY#0" title="ArcRotate setInteraction — swap left-drag and ctrl+left-drag" />

### Example: `addEntry` (introduce a new binding)

GeospatialCamera does **not** have a ctrl-modified pointer entry by default. Calling `setInteraction("pointer", { button: 0, modifiers: { ctrl: true } }, "rotate")` would resolve the catch-all `{ button: 0, interaction: "pan" }` entry and silently flip _it_ to rotate, breaking unmodified left-drag.

Use `addEntry` instead — it inserts the new entry at the correct position based on specificity, so it wins for ctrl-modified left-drag without intercepting plain left-drag:

```javascript
camera.movement.input.addEntry({
    source: "pointer",
    button: 0,
    modifiers: { ctrl: true },
    interaction: "rotate",
});
```

Live playground: <Playground id="#P0JBTE#0" title="Geospatial addEntry — add ctrl+left-drag rotate" />

### Example: `getEntry` (tweak sensitivity)

`getEntry` returns a reference to the live entry, so any property you mutate sticks:

```javascript
// Half-speed wheel zoom
const wheelZoom = camera.movement.input.getEntry("wheel", "zoom");
if (wheelZoom) {
    wheelZoom.sensitivity = 0.5;
}

// Asymmetric pointer rotate (twice as sensitive horizontally)
const pointerRotate = camera.movement.input.getEntry("pointer", "rotate");
if (pointerRotate) {
    pointerRotate.sensitivityX = 1 / 500;
    pointerRotate.sensitivityY = 1 / 1000;
}
```

The pointer entries support per-axis `sensitivityX` / `sensitivityY` overrides that fall back to the base `sensitivity` if unset.

Live playground: <Playground id="#ZQJ202#0" title="ArcRotate getEntry — tune sensitivity" />

### Example: `resetInputMap` (restore defaults)

Useful when an editor or settings panel wants a "Restore defaults" affordance:

```javascript
camera.movement.input.resetInputMap();
```

This calls the same factory the camera used at construction time, so you get back exactly the table at the top of this page.

### Direct array manipulation

The inputMap is a plain `public` array. For advanced cases you can read or mutate it directly — push, splice, replace it entirely. `addEntry` is just sugar for "insert at the right specificity bucket"; if you need different ordering, splice manually. `resetInputMap` always reverts to the default factory regardless of how you mutated it.

## Conditions: matching modifiers, buttons, and keys

A condition object specifies which input states should match the entry. **Omitted fields are wildcards** — they don't constrain matching.

```javascript
{ source: "pointer", button: 0, interaction: "pan" }
// Matches: any left-click with or without modifiers.

{ source: "pointer", button: 0, modifiers: { ctrl: true }, interaction: "pan" }
// Matches: left-click with ctrl pressed. Other modifiers are wildcards
// (alt and shift may be either pressed or not).

{ source: "pointer", button: 0, modifiers: { ctrl: true, alt: false }, interaction: "pan" }
// Matches: left-click with ctrl pressed AND alt NOT pressed. Shift is a wildcard.
```

Modifier matching is per-key, not all-or-nothing. An entry that only specifies `ctrl: true` doesn't care about alt or shift. To require a modifier _not_ be pressed, set it explicitly to `false`.

The `key` field on keyboard entries can be a single key code or an array. Useful for binding a group of related keys to the same interaction:

```javascript
{ source: "keyboard", key: [187, 107, 189, 109], interaction: "zoom" }
// Bind +, numpad+, -, numpad- all to zoom.
```

## Movement system

`camera.movement` (instance of `ArcRotateCameraMovement` or `GeospatialCameraMovement`) owns the physics layer. The contract per frame is:

1. Input classes resolve their events through the inputMap and call into typed handlers (`handlers.pan`, `handlers.rotate`, `handlers.zoom`).
2. Those handlers add per-frame pixel deltas to the accumulators (`panAccumulatedPixels`, `rotationAccumulatedPixels`, `zoomAccumulatedPixels`).
3. The camera's `_checkInputs` calls `computeCurrentFrameDeltas()` which applies inertia and produces `panDeltaCurrentFrame` / `rotationDeltaCurrentFrame` / `zoomDeltaCurrentFrame`.
4. The camera applies those deltas to its own state (alpha/beta/radius for arc-rotate, position/orientation for geospatial).

You usually don't touch this layer directly — you tune it through the configuration properties below.

### Speed properties

How much movement (radians, world-units) one pixel of accumulated input should produce:

| Property | Default | Effect |
|---|---|---|
| `speed` | `1` | Master multiplier on all movement (pan, rotate, zoom). |
| `panSpeed` | `1` | Coordinate-units of pan per pixel. |
| `rotationXSpeed` | `1` (arc) / `π/500` (geo) | Radians of rotation per pixel along X (alpha / yaw). |
| `rotationYSpeed` | `1` (arc) / `π/500` (geo) | Radians of rotation per pixel along Y (beta / pitch). |
| `zoomSpeed` | `1` (arc) / `2` (geo) | Coordinate-units of zoom per pixel. |

These all multiply each per-frame velocity. Increasing one of them makes that axis feel "faster" without changing how long the inertial glide tail lasts.

### Inertia properties

Per-frame velocity-decay factors (`0` = instant stop, `0.9` = legacy-style smooth glide, `1` = never decays):

| Property | Default | Notes |
|---|---|---|
| `panInertia` | `0.9` (arc) / `0` (geo) | Decay applied to pan velocity each frame. |
| `rotationInertia` | `0.9` (arc) / `0` (geo) | Decay applied to rotation velocity each frame. |
| `zoomInertia` | `0.9` | Decay applied to zoom velocity each frame. |

On `ArcRotateCamera`, `rotationInertia` and `zoomInertia` are kept in sync with the legacy `camera.inertia` accessor. `panInertia` mirrors `camera.panningInertia`, which itself defaults to `camera.inertia`. If you want to drive the inertias independently (e.g. tight-feeling rotation but a long zoom glide), assign to `camera.movement.zoomInertia` inside `scene.onBeforeRenderObservable` so your value isn't overwritten by the legacy sync.

### Framerate independence

The new system is calibrated so the same accumulated input produces the same total camera motion regardless of the actual frame rate. The math:

- A single per-frame `*= inertia` decay (legacy behavior) is replaced by `Math.pow(inertia, dt / referenceFrameDuration)`, where `referenceFrameDuration = 1000 / referenceFrameRate`.
- Each per-frame input contribution is scaled by an inputScale factor that keeps the steady-state of a held drag identical to the legacy 60fps total at any actual framerate.

`referenceFrameRate` defaults to `60` so that `inertia: 0.9` at 60fps reproduces legacy feel exactly. You only need to change it if your app was tuned at a non-60Hz refresh rate under the legacy framerate-dependent math and you want to preserve that exact decay characteristic at the new reference rate:

```javascript
camera.movement.referenceFrameRate = 144;   // legacy decay calibrated to 144Hz
```

For most apps the default is correct.

For custom code that needs to use the same framerate-independent decay (e.g. your own decaying accumulator coupled to the camera), use the helpers:

```javascript
const decay = camera.movement.getFrameIndependentDecay(0.9);     // pow(0.9, dt/refFrameDuration)
const inputScale = camera.movement.getFrameIndependentInputScale(0.9);  // (1 - decay) / (1 - 0.9)
```

## Backward compatibility

Existing apps don't need to change. Default end-user behavior — orbit, pan, zoom — is unchanged.

The legacy boolean / numeric flags continue to work and are bridged to the inputMap automatically:

- `camera.useCtrlForPanning = false` removes the ctrl-modified pointer pan entry.
- `camera.panningMouseButton = 1` rebinds the right-button pan entry to the middle button.
- `camera.useAltToZoom = false` removes the alt-modified keyboard zoom entry.
- `camera.inertia = 0.5` flows through to `camera.movement.rotationInertia` and `camera.movement.zoomInertia`.
- `camera.panningInertia` flows through to `camera.movement.panInertia`.
- `camera.inertialAlphaOffset`, `camera.inertialBetaOffset`, `camera.inertialRadiusOffset`, `camera.inertialPanningX`, `camera.inertialPanningY` are still read and written. Direct writes to these properties still cause the camera to move with inertia.

The deprecated `useMovementSystem` accessor remains as a no-op getter/setter so any code that still toggles it compiles.

If you mix legacy flag changes and direct inputMap edits, the legacy flag setters re-sync the inputMap each time they are written. If you intend to fully customize via the inputMap, make your inputMap edits _after_ any legacy flag assignments, or just stop touching the legacy flags entirely.

## Custom interactions and handlers

The interaction strings (`"pan"`, `"rotate"`, `"zoom"`) are typed against each camera subclass's `Handlers` shape (`ArcRotateHandlers`, `GeospatialHandlers`). To customize what an interaction _does_ rather than what triggers it, override the relevant function on `camera.movement.input.handlers` instead of editing the inputMap. For example, to make rotate also play a sound:

```javascript
const originalRotate = camera.movement.input.handlers.rotate;
camera.movement.input.handlers.rotate = function (x, y) {
    playClickSound();
    originalRotate(x, y);
};
```

The handler signature differs per camera (arc-rotate's `pan` takes `(deltaX, deltaY)`; geospatial's `pan` is an object with `start`/`update`/`stop` lifecycle methods). Check the type of the `handlers` field on `camera.movement.input` for the exact shape on the camera you're using.

## Notes

- `FreeCamera`, `FollowCamera`, `FlyCamera`, VR / touch-joystick input sources still use the older plugin-style `camera.inputs` system documented in [Customizing Camera Inputs](/features/featuresDeepDive/cameras/customizingCameraInputs). Migration to the new system for those cameras will land in subsequent PRs.
- Touch input on `ArcRotateCamera` and `GeospatialCamera` (single-touch drag, multi-touch pan + pinch) routes through the same inputMap as pointer input. Multi-touch entries use the `"touch"` source with an optional `touchCount` condition.
- Gamepad input on `ArcRotateCamera` feeds the same accumulators as pointer input, so it benefits from the same inertia and framerate-independence work.
