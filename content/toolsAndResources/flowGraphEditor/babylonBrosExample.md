---
title: Example - Babylon Bros Platformer
image:
description: A complete, physics-driven flow graph demo that powers a Mario-style platformer in Babylon.js, ready to open and edit in the Flow Graph Editor.
keywords: babylon.js, flow graph editor, example, demo, platformer, physics, coins, springs
further-reading:
    - title: Example - Click A Mesh And Log It
      url: /toolsAndResources/flowGraphEditor/meshPickExample
    - title: Physics Blocks
      url: /toolsAndResources/flowGraphEditor/physicsBlocks
    - title: Control Flow Blocks
      url: /toolsAndResources/flowGraphEditor/controlFlowBlocks
video-overview:
video-content:
---

## A Full Interactive Demo

The previous examples build a single interaction at a time. Babylon Bros is the opposite end of the scale: a complete, physics-driven, flow-graph-powered platformer that ties many of the editor's block families together into one scene.

It is a good demo to study once the basic patterns make sense, because it shows how events, control flow, physics, and data access blocks combine into real gameplay rather than a single console log.

## Run It

You can run the full scene directly in the Playground:

<Playground id="#P41T6E#1" title="Babylon Bros Platformer" description="A physics-driven, Flow-Graph-powered Mario-style platformer. Run with the arrow keys, jump with Space, collect coins, bounce on springs, and reach the flag." category="Flow Graph"/>

Use the arrow keys to run, `Space` to jump, collect coins, bounce on springs, and reach the flag.

## Open The Graph In The Editor

The interaction logic lives in a flow graph stored on the snippet server. You can open it straight in the hosted editor with the snippet preloaded:

[Open Babylon Bros in the Flow Graph Editor](https://flowgraph.babylonjs.com/#EH7L45#2)

The graph is named `Babylon Bros — Interactions`. Loading it in the editor lets you inspect how the gameplay is wired, run it against a preview scene, and experiment with changes before saving a new snippet version.

## What It Demonstrates

Babylon Bros is useful as a reference because it combines several block families that the earlier examples introduce one at a time:

- **Events** drive input and scene reactions, including pointer and pick interactions.
- **Control Flow** sequences gameplay steps, branches on game state, and times repeated actions.
- **Physics** moves the player, handles jumping and bouncing, and reacts to collisions.
- **Data Access** reads and writes the variables that track coins, state, and progress.

## How To Study It

A practical way to learn from this graph is to open it in the editor and work through it incrementally:

1. Use [Find In Graph](/toolsAndResources/flowGraphEditor/editorOperations) to jump to event blocks and trace where each interaction starts.
2. Turn on Debug Mode and run it to watch execution highlight the active path.
3. Inspect variables in the Variables panel to see how coin and state values change.
4. Drop a breakpoint on a key block to pause before a jump or collision response.

From there, try small edits, such as changing jump force or coin behavior, then save your own snippet to compare against the original.
