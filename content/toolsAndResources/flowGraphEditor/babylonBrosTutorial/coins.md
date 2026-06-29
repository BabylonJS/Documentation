---
title: Step 4 - Collect Coins
image:
description: Add coin collection to Babylon Bros using physics collision events, a score variable, custom events, and sound in the Flow Graph Editor.
keywords: babylon.js, flow graph editor, tutorial, coins, collision, score, custom events, sound
further-reading:
    - title: Step 3 - Add Jumping
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/jump
    - title: Step 5 - Spring Bounces
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/springs
    - title: Data Access Blocks
      url: /toolsAndResources/flowGraphEditor/dataAccessBlocks
---

## Goal

When the hero collects a coin, increase a score, log it, and play a sound. This introduces custom events to decouple "something was collected" from "update score".

Open this step in the editor: [#PJ6NXB](https://flowgraph.babylonjs.com/#PJ6NXB) (scene `P41T6E#2`).

![Coin graph: collision triggers a collect custom event that updates score](/img/tools/flowGraphEditor/tutorial/coins.webp)

Run this step:

<Playground id="#ZI8UZP#0" title="Babylon Bros - Coins" description="Tutorial step: move, jump, and collect coins, powered by flow graph #PJ6NXB." category="Flow Graph"/>

## Blocks Used

- `PhysicsCollisionEvent` (per question block / coin)
- `Branch` with an "active?" variable to make coins one-shot
- `SendCustomEvent` / `ReceiveCustomEvent` (`collect`)
- `GetVariable`, `Add`, `SetVariable` (score)
- `PlaySound`, `ConsoleLog`

## Step By Step

### 1. Central Collect Handler

Add `ReceiveCustomEvent` named `On Collect`. Wire it into `score + 1` (a `GetVariable` + `Add` + `SetVariable`), a `ConsoleLog` for the score, and `PlaySound` for the coin. This is the single place score changes.

### 2. Trigger From Collisions

For each block, add `PhysicsCollisionEvent` on its body, a `Branch` testing an `active` variable so it fires once, set `active` to false, run the bump animation with `PlayAnimation`, then `SendCustomEvent collect`.

### 3. Reuse The Pattern

Build the first block fully, group it (`Ctrl/Cmd+G`), copy/paste, and re-target. Copy preserves config and internal wiring; just point the new collision block at `block_2`, `block_3`.

## Editor Features

- Use [execution contexts](/toolsAndResources/flowGraphEditor/executionContexts) to confirm score is per run.
- Use Find (`Ctrl/Cmd+F`) to jump between block clusters as the graph grows past 100 nodes.

## Test And Save

Run, collect coins, watch the score log. Save; match `#PJ6NXB`. Continue with [Step 5 - Spring Bounces](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/springs).
