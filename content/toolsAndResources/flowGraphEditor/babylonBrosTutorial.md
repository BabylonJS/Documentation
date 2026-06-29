---
title: Tutorial - Build Babylon Bros
image:
description: A complete, step-by-step tutorial that builds the Babylon Bros platformer entirely in the Flow Graph Editor, from scene setup to a published demo.
keywords: babylon.js, flow graph editor, tutorial, platformer, babylon bros, visual scripting, physics
further-reading:
    - title: Example - Babylon Bros Platformer
      url: /toolsAndResources/flowGraphEditor/babylonBrosExample
    - title: Getting Started With The Flow Graph Editor
      url: /toolsAndResources/flowGraphEditor/gettingStarted
video-overview:
video-content:
---

## What You Will Build

This tutorial builds [Babylon Bros](/toolsAndResources/flowGraphEditor/babylonBrosExample), a small physics-driven platformer, entirely in the [Flow Graph Editor](https://flowgraph.babylonjs.com). You start from a finished but inert scene and add every interaction as a flow graph: running, jumping, coin pickups, spring bounces, enemies, and a win condition.

The point of the tutorial is the editor workflow. Each step uses real editor features - the node palette, the scene preview, the property panel, validation, execution contexts, debug mode, and the snippet server.

![The finished Babylon Bros flow graph open in the Flow Graph Editor](/img/tools/flowGraphEditor/tutorial/editorOverview.webp)

## How The Series Works

Each step ends with a saved flow graph snippet that includes everything from the previous steps. You can open any step directly in the editor and continue from there:

| Step | Snippet |
| ---- | ------- |
| Move the hero | `#1CUUOO` |
| Add jumping | `#LI45XB` |
| Collect coins | `#W0H5RG` |
| Spring bounces | `#YCDRLC` |
| Enemies | `#CMWMAN` |
| Win condition (final) | `#HUA46E` |

The scene is loaded from Playground snippet `#P41T6E#2` throughout, so every step shares the same preview scene.

## Steps

- [Step 0 - Prepare The Assets](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/prepareAssets)
- [Step 1 - Set Up The Editor](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/setup)
- [Step 2 - Move The Hero](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/movement)
- [Step 3 - Add Jumping](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/jump)
- [Step 4 - Collect Coins](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/coins)
- [Step 5 - Spring Bounces](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/springs)
- [Step 6 - Enemies](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/enemies)
- [Step 7 - Win Condition](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/win)
- [Step 8 - Save And Publish](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/publish)

## Before You Start

Read [Getting Started](/toolsAndResources/flowGraphEditor/gettingStarted) and build [Your First Runnable Graph](/toolsAndResources/flowGraphEditor/firstGraphExample) first. You will be more comfortable with the palette, the preview, and the run controls before tackling a full game.
