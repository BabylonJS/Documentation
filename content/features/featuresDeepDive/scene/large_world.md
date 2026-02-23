---
title: Large World Rendering / Floating Origin
image:
description: Learn how to use Babylon.js's floating origin system to render large worlds without floating point precision issues.
keywords: floating origin, large world, precision, jitter, rendering, physics, havok
further-reading:
video-overview:
video-content:
---

# Large World Rendering / Floating Origin

## The Problem

When working with very large world coordinates, 32-bit floating point numbers lose precision. A float32 value can represent roughly 7 significant decimal digits, which means that at a world position of 1,000,000 units from the origin, the smallest representable step is about 0.06 units. This loss of precision causes visible **jittering** — meshes wobble, shadows flicker, and animations stutter — even though the objects themselves are not moving.

This is a well-known problem in flight simulators, space games, open-world titles, and any application where the camera can be very far from the world origin.

## The Solution: Floating Origin and HighPrecisionMatrices

Babylon.js provides a **floating origin** system that eliminates precision issues by keeping the active camera conceptually at the world origin and offsetting all geometry and shader uniforms by the camera's position. This means that no matter how far you travel from the original world origin, the values sent to the GPU are always small and precise.

The system has two complementary parts:

1. **`useLargeWorldRendering`** — an engine option that sets both `useHighPrecisionMatrices` on the engine and enables `floatingOriginMode` on all scenes
    - `useHighPrecisionMatrices` forces **high precision (64-bit) matrix computations** on the CPU, so intermediate math remains accurate.
    - `floatingOriginMode` **Offsets all matrix uniforms**(`world`, `view`, `viewProjection`, `worldViewProjection`, etc.) to treat camera at world origin and **offsets position-related values** (`eye position`, `clip planes`, etc.) by camera's actual position, all performed at the last mile before passing the values to the shader.
2. **`useFloatingOrigin`** — a scene option that enables `floatingOriginMode`, in the case where not all scenes are large worlds. If only some scenes useFloatingOrigin, you must also instantiate the engine with `useHighPrecisionMatrices` to get full large-world rendering capabilities.



From the perspective of your application code, nothing changes — meshes are still positioned at their world coordinates, the camera moves normally, and all existing APIs work as before. The offsetting happens at the rendering layer, not detectable by the user.

## Examples

<Playground id="#5U0N0Q" title="Large World Rendering Demo" description="Side-by-side comparison of rendering with and without floating origin enabled. Move the camera to see jitter" image="/img/playgroundsAndNMEs/floatingOriginMain.png" />
## Quick Start

The simplest way to enable floating origin is at the engine level:

```javascript
const engine = new BABYLON.Engine(canvas, true, {
    useLargeWorldRendering: true,
});

// All scenes created from this engine will automatically use floating origin
const scene = new BABYLON.Scene(engine);
```

Setting `useLargeWorldRendering: true` does two things:

1. Enables `useHighPrecisionMatrix` — all `Matrix` computations use 64-bit doubles internally.
2. Enables `floatingOriginMode` on every scene created by this engine.

### Per-Scene Control

If you only want floating origin on specific scenes (for example, your main world scene but not a UI scene), you can enable it per-scene instead. In this case, you must also enable high precision matrices on the engine:

```javascript
const engine = new BABYLON.Engine(canvas, true, {
    useHighPrecisionMatrix: true,
});

// Only this scene will use floating origin
const worldScene = new BABYLON.Scene(engine, { useFloatingOrigin: true });

// This scene will NOT use floating origin
const uiScene = new BABYLON.Scene(engine);
```

## API Reference

### Engine Options (`AbstractEngineOptions`)

| Option                   | Type      | Default | Description                                                                                                                              |
| ------------------------ | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `useLargeWorldRendering` | `boolean` | `false` | Enables both high precision matrices and floating origin mode on all scenes.                                                             |
| `useHighPrecisionMatrix` | `boolean` | `false` | Forces 64-bit matrix computations. Required for proper large world rendering. Automatically set when `useLargeWorldRendering` is `true`. |

### Scene Properties

| Property                     | Type                 | Description                                                                                                                             |
| ---------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `scene.floatingOriginMode`   | `boolean` (readonly) | `true` if floating origin is active on this scene.                                                                                      |
| `scene.floatingOriginOffset` | `Vector3` (readonly) | The current offset applied to all rendering. Equal to the active camera's eye position when enabled, or `Vector3.Zero()` when disabled. |

### Scene Options (`ISceneOptions`)

| Option              | Type      | Default | Description                                      |
| ------------------- | --------- | ------- | ------------------------------------------------ |
| `useFloatingOrigin` | `boolean` | `false` | Enables floating origin for this specific scene. |

## How It Works

### Matrix Interception

When floating origin mode is active, Babylon.js monkey-patches `Effect.setMatrix` and `UniformBuffer._updateMatrixForUniform` to intercept every matrix being sent to shaders. Based on the uniform name, the system applies the appropriate offset:

- **`world`** — The world matrix translation is shifted by subtracting the camera position.
- **`view`** — The view matrix translation is zeroed out (since the camera is conceptually at the origin).
- **`worldView`** — Decomposed into world and view, each offset separately, then recomposed.
- **`viewProjection`** — The view is offset and remultiplied with the projection matrix.
- **`worldViewProjection`** — Fully decomposed, offset, and recomposed.

This also works with **Node Material** custom blocks, where uniform names are prefixed with `u_` (e.g., `u_World`, `u_ViewProjection`).

### Additional Offsets

Beyond matrices, the system also offsets:

- **Eye position** (`vEyePosition`) — Shifted so lighting and reflections compute correctly relative to the offset geometry.
- **Clip planes** — Adjusted using the formula `d' = d + normal · offset` so clipping works at the correct world-space boundaries.

### What Is Handled Automatically

The following Babylon.js subsystems are floating-origin-aware and require no additional work:

- Standard and PBR materials
- Node Materials
- Shadow generators (including cascaded shadow maps)
- Particles (GPU and CPU)
- Sprites
- Lights (point, spot, area, clustered)
- Bounding box and edge renderers
- Background and sky materials
- Water material
- Atmosphere addon
- Utility layers (gizmos, overlays, etc.)

### **A note about Custom shaders.** 
If you have custom shaders that use position-based uniforms, ensure they use standard uniform names (`world`, `view`, `viewProjection`, `worldViewProjection`) so the floating origin system can intercept and offset them automatically. For Node Materials, block uniforms prefixed with `u_` are handled automatically.

## Physics: Havok Multi-Region Support

### The Physics Precision Problem

The floating origin system keeps rendering precise by offsetting values before they reach the GPU. However, the **Havok physics engine** also uses 32-bit floats internally. If physics bodies are positioned at large world coordinates, the same precision loss occurs in the physics simulation — bodies jitter, collisions become unreliable, and constraints break down.

### Multi-Region Worlds

To solve this, the Havok plugin implements a **multi-region** architecture. Instead of simulating all bodies in a single physics world, bodies are distributed across multiple Havok world instances, each with its own **fixed floating origin**. Bodies within a region are simulated using coordinates relative to that region's origin, keeping all values small and precise.

This happens automatically when `floatingOriginMode` is enabled on the scene. You don't need to manually manage regions — the plugin handles creation, assignment, and cleanup.

### How It Works

1. **Region creation**: When a physics body is created, the plugin checks if an existing world region contains its world position (within the configured radius). If not, a new region is created centered at that position.

2. **Body simulation**: Each body stores its transform relative to its region's floating origin. From the body's perspective, it is always near the origin of its local physics world.

3. **Region migration**: During each physics step, bodies that have moved outside their current region's boundary (with a 20% hysteresis margin to prevent oscillation) are automatically migrated to the correct region. Linear and angular velocity are preserved across the transition.

4. **Velocity-based look-ahead**: When a body leaves its region, the plugin projects its position forward by one second of travel to find the best target region. This prevents creating unnecessary intermediate regions for fast-moving bodies heading toward existing regions.

5. **Garbage collection**: Empty non-default regions are automatically cleaned up when all their bodies have migrated elsewhere.

6. **Per-region gravity**: Each world region can have its own gravity vector, enabling scenarios like planetary bodies with different gravitational fields.

### Configuration

The Havok plugin accepts an optional `floatingOriginWorldRadius` parameter:

```javascript
const havokInstance = await HavokPhysics();
const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance, {
    floatingOriginWorldRadius: 100000, // default: 100,000 units
});

scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin);
```

| Parameter                   | Type     | Default  | Description                                                                                                                                                                                   |
| --------------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `floatingOriginWorldRadius` | `number` | `100000` | The radius of each physics world region. Bodies within this distance of a region's origin are simulated in that region. Bodies outside all existing regions trigger creation of a new region. |

Choose a radius that balances precision with the number of regions:

- **Larger radius** = fewer regions, but bodies farther from region origins may still lose some precision.
- **Smaller radius** = more regions and better precision, but more overhead from region management and body migration.

For most applications, the default of 100,000 units provides a good balance.

### Per-Region Gravity

You can set gravity for a specific world region by passing a world position to `setGravity`:

```javascript
// Set gravity for the region containing this position
havokPlugin.setGravity(new BABYLON.Vector3(0, -1.62, 0), new BABYLON.Vector3(500000, 0, 0));

// Get gravity for a specific region
const gravity = havokPlugin.getGravity(new BABYLON.Vector3(500000, 0, 0));
```

When called without a position, `setGravity` and `getGravity` operate on all regions or return the default gravity.








## Physics Examples

<Playground id="#9NRVWK" title="Havok+FloatingOrigin Stacked Boxes" description="Side-by-side view of havok physics far from world origin, with floatingorigin mode enabled/disabled" image="/img/playgroundsAndNMEs/havokFloatingOriginStacked.png"/>

<Playground id="#24ZAQP" title="Havok+FloatingOrigin BoomBox" description="Side by side of havok physics with floating origin enabled / disabled" image="/img/playgroundsAndNMEs/havokBoombox.png" />

<Playground id="#7N17MT#26" title="Havok Multi-Region with Dynamic Re-Regioning" description="Demonstrates multi-region physics with dynamic re-regioning. Use 'Launch Ball' to test physics drift collision across regions, and 'Move Box' to test teleporting bodies between regions." image="/img/playgroundsAndNMEs/havokFloatingOrigin.png" />