---
title: Utility Blocks
image:
description: Detailed reference for the Utility family in the Babylon.js Flow Graph Editor.
keywords: babylon.js, flow graph editor, utility blocks, debug, console log, context, easing
further-reading:
    - title: Block Reference
      url: /toolsAndResources/flowGraphEditor/blockReference
    - title: Validation and Property Editing
      url: /toolsAndResources/flowGraphEditor/validationAndProperties
    - title: Editor Operations and Shortcuts
      url: /toolsAndResources/flowGraphEditor/editorOperations
video-overview:
video-content:
---

## Why Utility Blocks Matter

Utility blocks do not belong to a single runtime domain. Instead, they make graphs easier to inspect, shape, prototype, and connect to surrounding systems.

In practice, these are often the blocks that make authoring comfortable rather than merely possible.

## Logging And Inspection

### `ConsoleLog`

Use `ConsoleLog` when you want immediate visibility into what the graph is doing.

This is one of the best first-pass debugging tools because it requires almost no setup and pairs well with event blocks, constants, variables, or scene-derived values.

### `DebugBlock`

Use `DebugBlock` when you want to inspect a data stream in-place without changing its value.

This is especially useful in the middle of a longer chain where you want to see what value is actually flowing through the graph.

## Easing And Value Shaping

### `Easing`

Use `Easing` when a graph needs a standard easing transform instead of a strictly linear value progression.

### `BezierCurveEasing`

Use `BezierCurveEasing` when you want more custom control over the easing curve.

These blocks are especially helpful when graphs drive motion, animation blending, or timed transitions.

## Context And Integration

### `Context`

Use `Context` when the graph needs access to contextual data exposed by the flow-graph runtime.

This block helps bridge authored graph logic to the environment in which the graph executes.

### `FunctionReference`

Use `FunctionReference` when graph logic needs to hold or expose a function reference as data.

### `CodeExecution`

Use `CodeExecution` when the graph needs to bridge into a code-driven execution path.

This is an advanced integration tool and is most useful when a purely visual graph needs to cooperate with surrounding application logic.

## Choosing The Right Utility Block

- Use `ConsoleLog` for immediate, low-friction diagnostics.
- Use `DebugBlock` for in-graph value inspection.
- Use `Easing` or `BezierCurveEasing` when values should change more naturally over time.
- Use `Context`, `FunctionReference`, and `CodeExecution` when integrating graph logic with runtime context or external logic.
