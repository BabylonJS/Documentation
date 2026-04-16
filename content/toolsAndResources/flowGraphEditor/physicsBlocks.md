---
title: Physics Blocks
image:
description: Detailed reference for the Physics families in the Babylon.js Flow Graph Editor.
keywords: babylon.js, flow graph editor, physics blocks, collision, impulse, velocity
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

## Why Physics Blocks Matter

The Physics families let graphs respond to simulation events and directly change body state.

These blocks are most useful when the preview scene has Physics V2 enabled and physics bodies are already attached to relevant meshes.

## Physics Events

### `PhysicsCollisionEvent`

Use `PhysicsCollisionEvent` when graph logic should react to collisions.

This block can expose collision-related data such as the other body, contact information, impulse, and penetration details.

## Physics Actions

### `ApplyForce`

Use `ApplyForce` for sustained force-like effects, especially when driven repeatedly over time.

### `ApplyImpulse`

Use `ApplyImpulse` for instant velocity changes.

### `SetLinearVelocity`

Use `SetLinearVelocity` when you want direct control over movement speed and direction.

### `SetAngularVelocity`

Use `SetAngularVelocity` when you want direct rotational motion control.

### `SetPhysicsMotionType`

Use `SetPhysicsMotionType` when the body's motion mode itself should change.

## Physics Data

### `GetLinearVelocity`

Reads the current linear velocity.

### `GetAngularVelocity`

Reads the current angular velocity.

### `GetPhysicsMassProperties`

Reads mass, center of mass, and inertia information.

## Practical Notes

- Physics blocks depend on a physics-enabled scene.
- They are best tested against a preview scene that already contains physics bodies.
- When debugging these graphs, combine runtime stepping with visible scene motion so you can distinguish graph issues from simulation issues.
