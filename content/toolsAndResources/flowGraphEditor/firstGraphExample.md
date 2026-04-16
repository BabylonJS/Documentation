---
title: Example - Your First Runnable Graph
image:
description: Build a first runnable graph in the Babylon.js Flow Graph Editor using the default scene and a minimal set of blocks.
keywords: babylon.js, flow graph editor, example, first graph, tutorial
further-reading:
    - title: Flow Graph Editor Overview
      url: /toolsAndResources/flowGraphEditor
    - title: Getting Started With The Flow Graph Editor
      url: /toolsAndResources/flowGraphEditor/gettingStarted
    - title: Block Reference
      url: /toolsAndResources/flowGraphEditor/blockReference
video-overview:
video-content:
---

## A Minimal First Graph

This example walks through a tiny graph that runs on the editor's default scene and proves out the full loop:

1. Add an event block.
2. Add a data block.
3. Add an execution block.
4. Connect them.
5. Run the graph and inspect the result.

You can try it in the live editor here: [Flow Graph Editor](https://flow-graph-editor-degbgccwdjdmbdc4.z01.azurefd.net)

## Goal

The goal is simple: when the scene becomes ready, the graph logs a message.

This is intentionally small, but it exercises the editor in a realistic way and gives you a reliable baseline before you move on to pick events, scene properties, or custom event flows.

![First runnable flow graph example with Scene Ready Event, Constant, and Console Log blocks](/img/tools/flowGraphEditor/firstRunnableGraph.png)

## Blocks Used

- `SceneReadyEvent`
- `Constant`
- `ConsoleLog`

You can find these blocks in the following families:

- `SceneReadyEvent` in Events
- `Constant` in Data Access
- `ConsoleLog` in Utility

## Step By Step

### 1. Start With The Default Scene

Open the editor without loading any external content. The default scene gives you a safe environment for first experiments.

### 2. Add `SceneReadyEvent`

From the Events family, add `SceneReadyEvent` to the canvas.

This block is your execution entry point. It fires once the scene is ready to be used.

### 3. Add `Constant`

From Data Access, add a `Constant` block.

In the property panel:

- Set the constant type to `String`.
- Enter a short message such as `Test`.

### 4. Add `ConsoleLog`

From Utility, add `ConsoleLog`.

This block is useful for first experiments because it gives immediate confirmation that the graph executed as expected.

### 5. Connect The Graph

Make two connections:

- Connect the execution output `done` of `SceneReadyEvent` to the execution input of `ConsoleLog`.
- Connect the output `value` of `Constant` to the value input `message` of `ConsoleLog`.

At that point, the graph has both the control flow and the data it needs.

### 6. Run The Graph

Press Start.

When the graph runs, the event should fire and the message should be logged.

If you want to confirm execution visually:

- Turn on Debug Mode.
- Run the graph again.
- Watch the active blocks highlight as the graph executes.

## What You Learn From This Example

Even this tiny graph teaches the core authoring pattern:

- Events start execution.
- Data blocks provide values.
- Execution blocks perform actions.
- The graph can be inspected visually and iterated quickly.

That pattern scales directly into larger scenes and more complex interactions.

## Good Next Steps

After this example, natural follow-ups are:

1. Replace `SceneReadyEvent` with a pointer or pick event.
2. Replace `ConsoleLog` with a property-changing or animation-driving block.
3. Add validation, naming, and notes so the graph is easier to maintain.

For deeper reference, continue with [Editor Operations and Shortcuts](/toolsAndResources/flowGraphEditor/editorOperations), [Validation and Property Editing](/toolsAndResources/flowGraphEditor/validationAndProperties), and [Block Reference](/toolsAndResources/flowGraphEditor/blockReference).

If you want the next practical step, continue with [Example - Click A Mesh And Log It](/toolsAndResources/flowGraphEditor/meshPickExample).
