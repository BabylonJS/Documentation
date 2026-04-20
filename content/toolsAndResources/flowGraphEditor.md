---
title: Flow Graph Editor
image:
description: Build Babylon.js flow graphs visually with a UI-first editor for interactive scenes.
keywords: babylon.js, tools, resources, flow graph, flow graph editor, visual scripting, no code
further-reading:
    - title: Flow Graph Overview
      url: /features/featuresDeepDive/flowGraph
    - title: Flow Graph Basic Concepts
      url: /features/featuresDeepDive/flowGraph/flowGraphBasicConcepts
video-overview:
video-content:
---

## Build Interactive Scenes Without Writing Flow Graph Code

The Flow Graph Editor is a visual authoring tool for Babylon.js flow graphs. It lets you create interactions, logic, and event-driven behavior by connecting blocks in a node graph instead of writing the graph by hand in code.

This makes the editor a practical companion to the core [Flow Graph documentation](/features/featuresDeepDive/flowGraph):

- Use the feature deep-dive pages to understand the runtime concepts and APIs.
- Use the Flow Graph Editor to assemble, test, and debug those graphs visually.

The editor is designed for rapid iteration. You can load a scene, wire logic together, run it immediately, inspect values, pause on breakpoints, and save the graph for later use.

You can try the hosted build here: [Flow Graph Editor](https://flowgraph.babylonjs.com)

![Babylon.js Flow Graph Editor overview](/img/tools/flowGraphEditor/overview.png)

## What The Editor Covers Today

The current editor focuses on the full authoring loop:

- Creating graphs with execution and data blocks
- Loading a test scene from a Playground snippet or local scene file
- Saving and restoring graphs from files or the Babylon.js snippet server
- Running, pausing, stopping, and resetting graph execution
- Managing multiple execution contexts for the same graph definition
- Visual debugging with execution highlights, flow animation, and breakpoints
- Validating graphs while you edit
- Organizing complex graphs with groups, sticky notes, and search
- Editing block configuration and scene-aware references in a property panel

The feature set is growing quickly, so this section is intentionally structured as a living set of pages rather than a single static article.

## Start Here

- [Getting Started With The Flow Graph Editor](/toolsAndResources/flowGraphEditor/gettingStarted)
- [Example - Your First Runnable Graph](/toolsAndResources/flowGraphEditor/firstGraphExample)
- [Example - Click A Mesh And Log It](/toolsAndResources/flowGraphEditor/meshPickExample)
- [Execution Contexts](/toolsAndResources/flowGraphEditor/executionContexts)
- [Authoring, Validation, and Debugging](/toolsAndResources/flowGraphEditor/authoringAndDebugging)
- [Editor Operations and Shortcuts](/toolsAndResources/flowGraphEditor/editorOperations)
- [Validation and Property Editing](/toolsAndResources/flowGraphEditor/validationAndProperties)
- [Supported Block Families](/toolsAndResources/flowGraphEditor/supportedBlockFamilies)
- [Block Reference](/toolsAndResources/flowGraphEditor/blockReference)
- [Event Blocks](/toolsAndResources/flowGraphEditor/eventBlocks)
- [Animation Blocks](/toolsAndResources/flowGraphEditor/animationBlocks)
- [Physics Blocks](/toolsAndResources/flowGraphEditor/physicsBlocks)
- [Audio Blocks](/toolsAndResources/flowGraphEditor/audioBlocks)
- [Control Flow Blocks](/toolsAndResources/flowGraphEditor/controlFlowBlocks)
- [Data Access Blocks](/toolsAndResources/flowGraphEditor/dataAccessBlocks)
- [Utility Blocks](/toolsAndResources/flowGraphEditor/utilityBlocks)

## Relationship To The Flow Graph System

The editor does not replace the Flow Graph runtime. It is a visual front end for building and inspecting graphs that still run on Babylon.js Flow Graph primitives.

If you are new to flow graphs, read [Flow Graph Basic Concepts](/features/featuresDeepDive/flowGraph/flowGraphBasicConcepts) first. If you already understand the runtime model and want a faster workflow for building interactive logic, continue with the editor pages in this section.

## A Living Documentation Set

New editor features land regularly. This documentation section is organized so it can grow in place as the tool evolves. Expect additional pages over time for topics such as block catalogs, scene integration workflows, graph reuse patterns, and new debugging capabilities.
