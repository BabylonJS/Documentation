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

Open this step in the editor: [#HUA46E](https://flowgraph.babylonjs.com/#HUA46E) (scene `P41T6E#2`). This is the complete graph.

![The complete Babylon Bros graph with the win handler in place](/img/tools/flowGraphEditor/tutorial/win.webp)

Run this step:

<Playground id="#609FGO#0" title="Babylon Bros - Win" description="Tutorial step: the complete game with the win condition, powered by flow graph #HUA46E." category="Flow Graph"/>

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

Only run the movement and jump branches when `gameDone` is false, so input is ignored after winning. A single `GetVariable` + `Branch` at the top of those chains is enough.

## Editor Features

- Use the Variables panel to watch `gameDone` turn true on win.
- Run one final manual validation pass before publishing.

## Test And Save

Run and reach the flag. Save; this is `#HUA46E`. Finish with [Step 8 - Save And Publish](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/publish).
