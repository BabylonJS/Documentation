---
title: Example - Click A Mesh And Log It
image:
description: Build a simple interactive graph that reacts when a mesh is picked in the Babylon.js Flow Graph Editor.
keywords: babylon.js, flow graph editor, mesh pick, pointer interaction, example
further-reading:
    - title: Example - Your First Runnable Graph
      url: /toolsAndResources/flowGraphEditor/firstGraphExample
    - title: Validation and Property Editing
      url: /toolsAndResources/flowGraphEditor/validationAndProperties
    - title: Event Blocks
      url: /toolsAndResources/flowGraphEditor/eventBlocks
video-overview:
video-content:
---

## A First Scene Interaction

This example builds on the basic startup example and moves into actual scene interaction.

The goal is simple:

- Start the graph.
- Click a specific mesh in the preview scene.
- Log a message when that mesh is picked.

You can try it in the hosted editor here: [Flow Graph Editor](https://flow-graph-editor-degbgccwdjdmbdc4.z01.azurefd.net)

## Blocks Used

- `MeshPickEvent`
- `Constant`
- `ConsoleLog`

This is a small graph, but it introduces one of the most important editor ideas: some blocks become much more useful once they are wired to scene context and configured through the property panel.

## Step By Step

### 1. Keep The Default Scene

Open the editor and leave the default scene in place.

The default scene already contains a few meshes, which is enough to test pick-based interactions immediately.

![Flow Graph Editor scene context](/img/tools/flowGraphEditor/sceneContext.png)

### 2. Add `MeshPickEvent`

From the Events family, drag `MeshPickEvent` onto the canvas.

This block fires when a mesh is picked in the preview scene.

### 3. Configure The Target Mesh

Select the `MeshPickEvent` block and use the property panel to configure its target mesh.

In the `Target Mesh` section, choose one of the default scene meshes such as `box`.

![Flow Graph Editor property panel for Mesh Pick Event](/img/tools/flowGraphEditor/propertyPanel.png)

### 4. Add `Constant`

From Data Access, add a `Constant` block.

Set its type to `String` and give it a value such as `Box clicked`.

### 5. Add `ConsoleLog`

From Utility, add a `ConsoleLog` block.

This gives you an easy way to verify that the pick event fired.

### 6. Connect The Graph

Create these connections:

- Execution output of `MeshPickEvent` to execution input of `ConsoleLog`
- Output of `Constant` to the value input of `ConsoleLog`

### 7. Run And Test

Press Start, then click the configured mesh in the preview scene.

If the graph is configured correctly, the message is logged when that mesh is picked.

## What This Example Teaches

This example introduces a few practical editor concepts at once:

- Event blocks can react to scene interaction instead of only scene startup.
- The scene context panel matters because it provides the assets and object names that scene-aware blocks can use.
- The property panel is often where a generic block becomes a meaningful scene-specific block.

## Good Next Steps

After this example, natural follow-ups are:

1. Swap `ConsoleLog` for `SetProperty` to make the interaction visibly change the scene.
2. Try a pointer event instead of a pick event.
3. Use Debug Mode to watch the graph fire when the click happens.
