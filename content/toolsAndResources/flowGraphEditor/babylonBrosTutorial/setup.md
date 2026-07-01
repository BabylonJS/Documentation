---
title: Step 1 - Set Up The Editor
image:
description: Load the Babylon Bros scene into the Flow Graph Editor, confirm physics, and create an empty graph ready for logic.
keywords: babylon.js, flow graph editor, tutorial, scene preview, snippet, setup
further-reading:
    - title: Step 0 - Prepare The Assets
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/prepareAssets
    - title: Step 2 - Move The Hero
      url: /toolsAndResources/flowGraphEditor/babylonBrosTutorial/movement
video-overview:
video-content:
---

## Open The Editor

Open the [Flow Graph Editor](https://flowgraph.babylonjs.com). It starts with a default scene and a single empty graph tab, which you will replace with the Babylon Bros scene.

## Load The Scene Snippet

In the Scene Preview panel, enter the scene snippet ID `P41T6E#2` and press `Enter` to load it. The preview switches to the platformer level, and its meshes, animation groups, and sounds become available to scene-aware pickers.

That scene context is shared by every graph and execution context, so you only load it once.

## Confirm The Scene Context

Open the scene context panel and check that the expected names are present: `hero`, `ground`, `spring_1`, `block_1`, the enemies, and the flag. If those resolve, mesh pickers and physics lookups will work in the next steps.

## Start With An Empty Graph

You begin from a blank graph and build it up. Validation will report that the graph has no event yet, which is expected until Step 2 adds the first event block.

Press Start once to confirm the empty graph runs without error, then Stop. You now have a working scene plus an empty graph, ready for logic.

## Next

Continue to [Step 2 - Move The Hero](/toolsAndResources/flowGraphEditor/babylonBrosTutorial/movement) to add the first real interaction.
