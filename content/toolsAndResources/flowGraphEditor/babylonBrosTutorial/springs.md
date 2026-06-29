---
title: Step 5 - Spring Bounces
image:
description: Add spring pads to Babylon Bros that launch the hero upward on collision when descending, with a compress animation and sound.
keywords: babylon.js, flow graph editor, tutorial, spring, bounce, velocity, collision, animation
further-reading:
    - title: Step 4 - Collect Coins
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/coins
    - title: Step 6 - Enemies
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/enemies
---

## Goal

Make `spring_1` and `spring_2` launch the hero when he lands on them. Bounce only when the hero is descending, so it feels like a real spring.

Open this step in the editor: [#GE2270](https://flowgraph.babylonjs.com/#GE2270) (scene `P41T6E#1`).

## Blocks Used

- `PhysicsCollisionEvent` (spring body)
- `GetLinearVelocity`, `ExtractVector3`, `LessThan` (descending check)
- `Branch` ("can bounce?")
- `SetLinearVelocity` (launch)
- `PlayAnimation` (compress), `PlaySound` (boing)

## Step By Step

### 1. Detect The Landing

Add `PhysicsCollisionEvent` on `spring_1`. Read the hero velocity, extract `y`, and test `LessThan 0` so it bounces only while descending. Feed into a `Branch`.

### 2. Launch

On `true`, build a launch velocity with `CombineVector3` (keep x, set a strong positive y) and apply it with `SetLinearVelocity`. Trigger the compress `PlayAnimation` and the boing `PlaySound`.

### 3. Duplicate

Group the spring logic and paste it for `spring_2`, re-targeting the collision body and animation. This is the same reuse pattern from the coin step.

## Editor Features

- Lower the time scale to watch the bounce frame by frame.
- Add a `DebugBlock` on the launch velocity to confirm the value flowing through.

## Test And Save

Run and bounce on a spring. Save; match `#GE2270`. Continue with [Step 6 - Enemies](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/enemies).
