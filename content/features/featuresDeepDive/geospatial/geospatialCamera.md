---
title: Geospatial Camera
image:
description: Learn how to use the Babylon.js Geospatial Camera to orbit and navigate a spherical planet with map-like interactions.
keywords: geospatial, camera, globe, planet, orbit, pan, zoom, pitch, yaw, radius, flyTo, clipping, limits
further-reading:
video-overview:
video-content:
---

# Geospatial Camera

## Overview

The `GeospatialCamera` is designed for orbiting a spherical planet centered at the world origin. It provides map-like interactions out of the box — drag to pan the globe, scroll to zoom toward the cursor, and right-click/middle-click to tilt. The camera is not tied to Earth specifically; you can supply any planet radius to orbit any spherical body.

The camera uses an **ECEF (Earth-Centered, Earth-Fixed)** coordinate system where the planet center is at the world origin and positions on the surface are expressed as 3D cartesian coordinates.

<Playground id="#7XXRHQ#11" title="Geospatial Camera Demo" description="Basic geospatial camera orbiting a globe with drag, zoom, and tilt interactions." />

## Quick Start

```javascript
const camera = new BABYLON.GeospatialCamera("geoCam", scene, {
    planetRadius: 6371000, // Earth's radius in meters
});
camera.attachControl(canvas);
```

This creates a camera orbiting a sphere of the given radius. By default:

- The camera starts at a distance of `4 × planetRadius` looking down at the surface.
- Mouse, mouse wheel, and keyboard inputs are automatically attached, as well a default 'flight behavior' which allows for 'flying to' a given point along an arc.

## Core Concepts

### Coordinate Model

The geospatial camera describes its orientation using four properties:

| Property | Type      | Description                                                                               |
| -------- | --------- | ----------------------------------------------------------------------------------------- |
| `center` | `Vector3` | The point on the globe the camera is anchored to (in ECEF world coordinates). This will be a point along the lookat vector that is pickable using the provided 'pick predicate' (or any mesh if no pickpredicate is provided)             |
| `radius` | `number`  | The distance from the camera to the center point.                                         |
| `yaw`    | `number`  | Rotation around the geocentric normal (radians). 0 = north, π/2 = east.                   |
| `pitch`  | `number`  | Angle from looking straight at planet center. 0 = looking down, π/2 = looking at horizon. |

All four properties are readable and writable. Setting any of them immediately recomputes the camera's position, look-at direction, and up vector while respecting limits.

```javascript
// Move the camera to look at a specific point on the globe
camera.center = new BABYLON.Vector3(6371000, 0, 0); // point on the surface

// Zoom in
camera.radius = 50000;

// Tilt to look at the horizon
camera.pitch = Math.PI / 4; // 45 degrees

// Rotate to face east
camera.yaw = Math.PI / 2;
```

### How the View Matrix Is Computed

Internally, the camera computes its position and orientation from the four core properties:

1. A **local basis** (east, north, up) is derived at the `center` point from its geocentric normal.
2. The **lookAt direction** is computed from `yaw` and `pitch` using the local basis.
3. The **camera position** is placed at `center - lookAt × radius`.
4. The **up vector** is aligned with the geocentric up, with a fallback to the horizontal direction when looking straight down.

## Input Controls

The camera ships with three input handlers, all attached by default:

### Mouse / Touch (`GeospatialCameraPointersInput`)

| Action               | Mouse                 | Touch               |
| -------------------- | --------------------- | ------------------- |
| **Pan / drag globe** | Left click + drag     | Single finger drag  |
| **Tilt (yaw/pitch)** | Right click + drag    | Two-finger pan      |
| **Zoom**             | Mouse wheel           | Pinch               |
| **Fly to point**     | Double click on globe | Double tap on globe |

Drag behavior keeps the point under the cursor anchored to the globe by constructing a drag plane at the initial pick point's distance from the planet center, then computing frame-to-frame deltas in local (east/north/up) space.

Configurable properties:

```javascript
const pointerInput = camera.inputs.attached["GeospatialCameraPointersInput"];
pointerInput.pitchSensitivity = 1.0; // Pitch rotation sensitivity
pointerInput.yawSensitivity = 1.0; // Yaw rotation sensitivity
pointerInput.pinchToPanMax = 20; // Pixel threshold to distinguish pinch from pan
```

### Mouse Wheel (`GeospatialCameraMouseWheelInput`)

Handles scroll wheel zoom. By default, zooms toward the point on the globe under the cursor. Falls back to zooming along the look-at vector when the cursor is off the globe.

### Keyboard (`GeospatialCameraKeyboardInput`)

| Keys                            | Action                    |
| ------------------------------- | ------------------------- |
| Arrow keys                      | Pan the globe             |
| Ctrl + Arrow keys               | Tilt (yaw/pitch rotation) |
| `+` / `-` (or numpad `+` / `-`) | Zoom in / out             |

Configurable properties:

```javascript
const keyboardInput = camera.inputs.attached["GeospatialCameraKeyboardInput"];
keyboardInput.panSensitivity = 1.0;
keyboardInput.rotationSensitivity = 1.0;
keyboardInput.zoomSensitivity = 1.0;
```

## Movement Pipeline

User input flows through a layered pipeline: **input sensitivity** (per-device scaling) → **velocity & inertia** (frame-rate-independent smoothing) → **speed × multiplier** (conversion to world-space movement). All configurable values are listed below.

| Property | Location | Default | Description | When to modify |
| --- | --- | --- | --- | --- |
| **Input Sensitivity** | | | | |
| `pitchSensitivity` | Pointer input | `1.0` | Scales pointer Y delta for pitch | Mouse/touch tilt feels too fast or slow |
| `yawSensitivity` | Pointer input | `1.0` | Scales pointer X delta for yaw | Mouse/touch yaw feels too fast or slow |
| `pinchToPanMax` | Pointer input | `20` | Pixel threshold: pinch vs pan | Touch gestures are being confused |
| `rotationSensitivity` | Keyboard input | `1.0` | Pixel delta per key for rotation | Keyboard tilt feels too fast or slow |
| `panSensitivity` | Keyboard input | `1.0` | Pixel offset per key for panning | Keyboard pan feels too fast or slow |
| `zoomSensitivity` | Keyboard input | `1.0` | Scroll delta per key for zoom | Keyboard zoom feels too fast or slow |
| **Speed** | | | | |
| `zoomSpeed` | `movement` | `2` | Base zoom rate (all devices) | All zoom feels too fast or slow |
| `panSpeed` | `movement` | `1` | Base pan rate (all devices) | All panning feels too fast or slow |
| `rotationXSpeed` | `movement` | `π/500` | Radians of pitch per velocity unit | All pitch rotation feels too fast or slow |
| `rotationYSpeed` | `movement` | `π/500` | Radians of yaw per velocity unit | All yaw rotation feels too fast or slow |
| **Multipliers** | | | | |
| `_zoomSpeedMultiplier` | `movement` | Auto | Applied to zoom each frame. Override per-frame to implement custom zoom behavior (e.g. radius-based speed, altitude curves) | You want full control over how zoom scales with context |
| `_panSpeedMultiplier` | `movement` | Auto | Applied to pan each frame. Override per-frame to implement custom pan behavior (e.g. latitude dampening, terrain-aware speed) | You want full control over how pan scales with context |
| **Inertia** | | | | |
| `zoomInertia` | `movement` | `0.9` | Zoom velocity decay (`0` = instant stop, `0.95` = long glide) | Zoom coasting feels too long or abrupt |
| `panInertia` | `movement` | `0` | Pan velocity decay | You want the globe to drift after drag |
| `rotationInertia` | `movement` | `0` | Rotation velocity decay | You want tilt to coast after releasing |

```javascript
// Per-device: make mouse tilt twice as fast
camera.inputs.attached["GeospatialCameraPointersInput"].pitchSensitivity = 2.0;

// Global: make all zoom faster, add pan glide
camera.movement.zoomSpeed = 4;
camera.movement.panInertia = 0.9;
```

### Zoom-to-Cursor

By default, zooming moves the camera toward the point on the globe under the cursor rather than along the look-at vector. This can be toggled:

```javascript
camera.movement.zoomToCursor = false; // Zoom along look-at vector instead
```

### Pick Predicate

The movement system raycasts against the scene to determine zoom targets and drag planes. You can filter which meshes are picked:

```javascript
camera.movement.pickPredicate = (mesh) => mesh.name === "globe";
```

This can also be set in the constructor options:

```javascript
const camera = new BABYLON.GeospatialCamera("geoCam", scene, {
    planetRadius: 6371000,
    pickPredicate: (mesh) => mesh.name === "globe",
});
```

## Limits (`GeospatialLimits`)

The camera enforces configurable limits to constrain navigation:

```javascript
const limits = camera.limits;

// Distance limits
limits.radiusMin = 100; // Minimum distance from center (prevents going below surface)
limits.radiusMax = 50000000; // Maximum distance from center

// Pitch limits (radians)
limits.pitchMin = 0.001; // Minimum pitch (nearly straight down)
limits.pitchMax = Math.PI / 2 - 0.01; // Maximum pitch (nearly at horizon)

// Yaw limits (radians) — default is unconstrained
limits.yawMin = -Infinity;
limits.yawMax = Infinity;
```

### Pitch Dampening at High Altitude

The camera can automatically restrict pitch as you zoom out, forcing the view to look straight down when far from the surface. This prevents disorienting tilted views at high altitudes:

```javascript
// Pitch is fully allowed below 2× planet radius,
// fully disabled (forced to pitchMin) above 4× planet radius,
// and interpolated between.
limits.pitchDisabledRadiusScale = new BABYLON.Vector2(2, 4);

// Disable this behavior:
limits.pitchDisabledRadiusScale = undefined;
```

### Planet Radius

The planet radius is accessible and can be updated:

```javascript
limits.planetRadius = 6371000; // Earth radius in meters
```

## Animated Flights (`flyToAsync`)

The camera supports smooth animated transitions between viewpoints:

```javascript
// Fly to a new location with specific yaw, pitch, radius, and center
await camera.flyToAsync(
    Math.PI / 4, // target yaw (radians)
    Math.PI / 6, // target pitch (radians)
    100000, // target radius
    new BABYLON.Vector3(6371000, 0, 0), // target center (ECEF)
    2000, // flight duration in ms
    new BABYLON.CubicEase(), // optional easing function
    0.3 // optional center hop scale (parabolic arc height)
);
```

Any parameter can be `undefined` to keep the current value:

```javascript
// Fly to a different center without changing yaw, pitch, or radius
await camera.flyToAsync(undefined, undefined, undefined, newCenter, 1500);
```

### Fly to a Point

A convenience method moves the camera toward a specific world-space point:

```javascript
// Fly 50% of the way toward the clicked point
await camera.flyToPointAsync(pickedPoint, 0.5, 1000);
```

### Updating a Flight In-Progress

You can redirect an active flight animation without restarting it:

```javascript
camera.updateFlyToDestination(newYaw, newPitch, newRadius, newCenter);
```

This updates the target properties and uses the remaining duration from the original `flyToAsync` call.

### Center Hop (Arc Animation)

When providing a `centerHopScale` to `flyToAsync`, the center animation follows a parabolic arc that peaks at the midpoint of the flight. The hop height is proportional to the distance between the start and end centers, scaled by the provided value. This creates a visually appealing "bounce" effect for long-distance flights.

### Double-Click / Double-Tap to Zoom

By default, double-clicking or double-tapping on the globe triggers a `flyToPointAsync` that flies 50% closer to the clicked point.

## Collision Detection

The camera supports basic collision checking:

```javascript
camera.checkCollisions = true;

// Optionally apply a custom per-frame collision offset
camera.perFrameCollisionOffset = new BABYLON.Vector3(0, 10, 0);
```

When enabled, the camera uses the scene's collision coordinator to detect intersections and adjusts the camera position to avoid passing through geometry.

## Geospatial Clipping Behavior

The `GeospatialClippingBehavior` automatically adjusts near and far clip planes based on the camera's altitude above the planet surface. This optimizes depth buffer precision — near objects remain sharp when close to the surface, while distant objects (up to the horizon) remain visible when zoomed out.

```javascript
const clippingBehavior = new BABYLON.GeospatialClippingBehavior();
camera.addBehavior(clippingBehavior);
```

The behavior calculates:

- **Near plane**: `altitude × 0.001` (minimum of 1 unit)
- **Far plane**: Horizon distance + 10% of planet radius, using the formula `√(2Rh + h²)` where `R` is the planet radius and `h` is altitude

## Architecture Summary

The geospatial camera is composed of several classes that work together:

| Class                                 | Responsibility                                                                                                                                      |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`GeospatialCamera`**                | Core camera. Manages yaw/pitch/radius/center, computes view matrix, applies inputs each frame, handles flyTo animations.                            |
| **`GeospatialCameraMovement`**        | Extends `CameraMovement`. Globe drag-plane raycasting, latitude-based pan dampening, altitude-aware zoom scaling, zoom-to-cursor picking.           |
| **`CameraMovement`**                  | Base movement class. Converts pixel deltas into frame-rate-independent movement deltas with configurable speed, inertia, and per-frame multipliers. |
| **`GeospatialLimits`**                | Enforces radius, pitch, and yaw constraints. Provides altitude-based pitch dampening.                                                               |
| **`GeospatialCameraInputsManager`**   | Input manager that wires up pointer, mouse wheel, and keyboard inputs.                                                                              |
| **`GeospatialCameraPointersInput`**   | Mouse/touch input: drag globe, tilt, pinch-to-zoom, double-tap to fly.                                                                              |
| **`GeospatialCameraMouseWheelInput`** | Mouse wheel zoom input.                                                                                                                             |
| **`GeospatialCameraKeyboardInput`**   | Arrow keys for pan/rotate, +/- for zoom.                                                                                                            |
| **`GeospatialClippingBehavior`**      | Behavior that auto-adjusts near/far clip planes based on altitude for optimal depth precision.                                                      |
| **`InterpolatingBehavior`**           | Behavior that powers `flyToAsync` animations. Automatically interrupted by user input.                                                              |

## API Reference

### Constructor

```typescript
new GeospatialCamera(name: string, scene: Scene, options: GeospatialCameraOptions)
```

#### `GeospatialCameraOptions`

| Property        | Type            | Required | Description                                                                         |
| --------------- | --------------- | -------- | ----------------------------------------------------------------------------------- |
| `planetRadius`  | `number`        | Yes      | Radius of the planet being orbited.                                                 |
| `pickPredicate` | `MeshPredicate` | No       | Predicate for raycasting. Can be updated later via `camera.movement.pickPredicate`. |

### Properties

| Property                  | Type                       | Description                                               |
| ------------------------- | -------------------------- | --------------------------------------------------------- |
| `center`                  | `Vector3`                  | The anchor point on the globe (get/set).                  |
| `yaw`                     | `number`                   | Rotation around geocentric normal in radians (get/set).   |
| `pitch`                   | `number`                   | Angle from looking at planet center in radians (get/set). |
| `radius`                  | `number`                   | Distance from camera to center (get/set).                 |
| `limits`                  | `GeospatialLimits`         | The limits object (readonly).                             |
| `movement`                | `GeospatialCameraMovement` | The movement controller (readonly).                       |
| `checkCollisions`         | `boolean`                  | Enable/disable collision detection. Default `false`.      |
| `perFrameCollisionOffset` | `Vector3`                  | Custom collision offset applied each frame.               |

### Methods

| Method                                                                                  | Description                                                     |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `flyToAsync(yaw?, pitch?, radius?, center?, durationMs?, easingFn?, centerHopScale?)`   | Animate camera to target properties. Returns a `Promise<void>`. |
| `flyToPointAsync(destination, distanceScale?, durationMs?, easingFn?, centerHopScale?)` | Fly toward a world-space point by a fraction of the distance.   |
| `updateFlyToDestination(yaw?, pitch?, radius?, center?)`                                | Redirect an in-progress flight animation.                       |
| `zoomToPoint(targetPoint, distance)`                                                    | Zoom toward a specific point by a given distance.               |
| `zoomAlongLookAt(distance)`                                                             | Zoom along the look-at vector by a given distance.              |
| `attachControl(noPreventDefault?)`                                                      | Attach all input handlers.                                      |
| `detachControl()`                                                                       | Detach all input handlers.                                      |
