---
title: Step 6 - Enemies
image:
description: Add enemy interactions to Babylon Bros - stomp from above to defeat, touch from the side to get hurt - using collision events and custom events.
keywords: babylon.js, flow graph editor, tutorial, enemies, stomp, hurt, collision, custom events
further-reading:
    - title: Step 5 - Spring Bounces
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/springs
    - title: Step 7 - Win Condition
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/win
---

## Goal

Enemies (`goomba_1`, `goomba_2`, `flyer_1`, the spiky hazard) react two ways: a stomp from above defeats them and bounces the hero, while a side touch hurts the hero. This reuses the `collect`/`hurt` custom-event pattern.

Open this step in the editor: [#11YDFB](https://flowgraph.babylonjs.com/#11YDFB) (scene `P41T6E#1`).

## Blocks Used

- `PhysicsCollisionEvent` (per enemy body)
- `GetLinearVelocity`, `ExtractVector3`, `LessThan` (falling onto enemy?)
- `Branch` (stomp vs hurt), `Abs`, `Subtract`
- `SendCustomEvent` / `ReceiveCustomEvent` (`hurt`)
- `PlayAnimation`, `PlaySound`, `SetLinearVelocity`

## Step By Step

### 1. Hurt Handler

Add `ReceiveCustomEvent` `On Hurt` that decreases score, logs it, and plays the hurt sound - the mirror of the coin collect handler.

### 2. Stomp Versus Hurt

For each enemy, add `PhysicsCollisionEvent` and an `active` `Branch`. Check whether the hero is descending and above the enemy: if so, defeat it (deactivate, play its inactive animation, bounce the hero up). Otherwise `SendCustomEvent hurt`.

### 3. Scale It Up

You now have many near-identical clusters. Lean on copy/paste, smart groups, and `Ctrl/Cmd+F` search to manage the canvas. This is where the editor's organization features pay off.

## Editor Features

- Use breakpoints on each `active?` branch to debug stomp detection.
- Use the minimap to navigate; the graph is now large.

## Test And Save

Run and try stomping vs side-hitting enemies. Save; match `#11YDFB`. Continue with [Step 7 - Win Condition](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/win).
