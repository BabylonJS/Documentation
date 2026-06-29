---
title: Step 7 - Win Condition
image:
description: Finish Babylon Bros by reaching the flag - raise it, play victory music, and lock the game as done using a custom event in the Flow Graph Editor.
keywords: babylon.js, flow graph editor, tutorial, win, flag, victory, game state
further-reading:
    - title: Step 6 - Enemies
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/enemies
    - title: Step 8 - Save And Publish
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/publish
---

## Goal

Reaching the flag wins the game: raise the flag, play victory music, and set a `gameDone` flag so input stops mattering.

Open this step in the editor: [#YAJ8CD](https://flowgraph.babylonjs.com/#YAJ8CD) (scene `P41T6E#1`). This is the complete graph.

## Blocks Used

- `PhysicsCollisionEvent` (flag)
- `ReceiveCustomEvent` / `SendCustomEvent` (`win`)
- `SetVariable` (`gameDone = true`)
- `PlayAnimation` (raise flag), `PlaySound` (win), `ConsoleLog`

## Step By Step

### 1. Detect The Flag

Add `PhysicsCollisionEvent` on the flag, sending a `win` custom event.

### 2. Win Handler

Add `ReceiveCustomEvent On Win`: set `gameDone` to true, log the win, run the flag raise `PlayAnimation`, and play victory music.

### 3. Respect Game State

Gate the movement and jump branches behind `gameDone` so input is ignored after winning. A single `GetVariable` + `Branch` at the top of those chains is enough.

## Editor Features

- Use the Variables panel to watch `gameDone` flip on win.
- Run one final manual validation pass before publishing.

## Test And Save

Run and reach the flag. Save; this is `#YAJ8CD`. Finish with [Step 8 - Save And Publish](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/publish).
