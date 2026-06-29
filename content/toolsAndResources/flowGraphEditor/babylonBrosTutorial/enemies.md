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

Open this step in the editor: [#XR3NO0](https://flowgraph.babylonjs.com/#XR3NO0) (scene `P41T6E#2`).

![Enemy graph: stomp-versus-hurt branches and a hurt custom event](/img/tools/flowGraphEditor/tutorial/enemies.webp)

Run this step:

<Playground id="#BGZZ3S#0" title="Babylon Bros - Enemies" description="Tutorial step: stomp enemies or take damage, powered by flow graph #XR3NO0." category="Flow Graph"/>

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

Run and try stomping vs side-hitting enemies. Save; match `#XR3NO0`. Continue with [Step 7 - Win Condition](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/win).
