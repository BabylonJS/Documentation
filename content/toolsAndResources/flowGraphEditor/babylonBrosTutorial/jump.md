---
title: Step 3 - Add Jumping
image:
description: Add a grounded jump to Babylon Bros using a key event, a ground check branch, an upward impulse, and a sound in the Flow Graph Editor.
keywords: babylon.js, flow graph editor, tutorial, jump, impulse, branch, ground check, sound
further-reading:
    - title: Step 2 - Move The Hero
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/movement
    - title: Step 4 - Collect Coins
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/coins
    - title: Physics Blocks
      url: /toolsAndResources/flowGraphEditor/physicsBlocks
---

## Goal

Make the hero jump on `Space`, but only when grounded, and play a sound. This adds your first conditional branch.

Open this step in the editor: [#RZIR69](https://flowgraph.babylonjs.com/#RZIR69) (scene `P41T6E#2`).

![Jump graph: Space event, ground-check branch, impulse and sound](/img/tools/flowGraphEditor/tutorial/jump.webp)

## Blocks Used

- `KeyDownEvent` (Space)
- `GetLinearVelocity`, `ExtractVector3`, `Abs`, `LessThan` (ground check)
- `Branch` (Control Flow)
- `ApplyImpulse` (Physics)
- `PlaySound` (Audio)

## Step By Step

### 1. Listen For Space

Add `KeyDownEvent` configured for `Space`. Label it "On Space".

### 2. Check Grounded

Read the hero velocity with `GetLinearVelocity`, `ExtractVector3` to get `y`, take `Abs`, then `LessThan` a small threshold. A near-zero vertical speed approximates "on the ground". Feed the result into a `Branch` ("Can jump?").

### 3. Jump And Play Sound

On the `true` path, add `ApplyImpulse` on the `hero` body with an upward vector, then `PlaySound` selecting the jump sound. Use `Sequence` if you want the impulse and sound to fire together cleanly.

## Editor Features To Use

- Set a breakpoint (`F9`) on the `Branch` and run: you can pause and confirm the ground check value before the jump fires.
- Use Debug Mode to confirm only the `true` path lights up when grounded.

## Test And Save

Run, then jump with `Space` while moving. Save the graph; it should match `#RZIR69`. Continue with [Step 4 - Collect Coins](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/coins).
