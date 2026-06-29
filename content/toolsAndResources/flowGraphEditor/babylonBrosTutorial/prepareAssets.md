---
title: Step 0 - Prepare The Assets
image:
description: Prepare the inert Babylon Bros scene with meshes, materials, parked animation groups, sounds, and physics before adding any flow graph logic.
keywords: babylon.js, flow graph editor, tutorial, assets, scene setup, physics, animation groups
further-reading:
    - title: Tutorial - Build Babylon Bros
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial
    - title: Step 1 - Set Up The Editor
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/setup
video-overview:
video-content:
---

## Why The Scene Comes First

This tutorial is about authoring interactions in the editor, not about modeling. So the assets are prepared up front and treated as a fixed starting point. This step explains what the scene already contains so the later flow graph steps make sense, but you do not build it block by block.

You can run the finished scene here:

<Playground id="#P41T6E#2" title="Babylon Bros Scene" description="The inert Babylon Bros scene used as the starting point for the Flow Graph tutorial. All interaction is added later in the editor." category="Flow Graph"/>

## The Scene Is Intentionally Inert

Nothing in the scene moves on its own. Animation groups exist but are parked, sounds are loaded but silent, and physics bodies exist but no input drives them. Every behavior is added later as a flow graph, which is exactly what makes this a good editor tutorial.

## What Is Already Built

- **Hero** - a mesh named `hero` with a Havok physics body, the player you will drive.
- **Terrain** - `ground`, `terrain_step_1`, `terrain_step_2`, all static physics bodies.
- **Coins** - collectible meshes with trigger bodies.
- **Springs** - `spring_1`, `spring_2` pads with parked compress animations.
- **Enemies** - `goomba_1`, `goomba_2`, `flyer_1`, and a spiky hazard, each with parked patrol/hover animations.
- **Question blocks** - `block_1` to `block_3` with parked bump animations.
- **Flag** - the goal, with a parked raise animation.
- **Sounds** - jump, coin, spring, stomp, and win, registered for Audio V2.
- **Physics** - Havok enabled with gravity, so the hero falls and collides.

## Naming Matters

The flow graph references scene objects by name. Mesh pickers, animation-group pickers, and physics body lookups all resolve against the loaded scene, so consistent names like `hero`, `spring_1`, and `block_1` are what make the graph readable in later steps.

## Next

With the scene ready, continue to [Step 1 - Set Up The Editor](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/setup) to load it into the Flow Graph Editor.
