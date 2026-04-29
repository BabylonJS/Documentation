---
title: Execution Contexts
image:
description: Learn how multiple execution contexts work in the Babylon.js Flow Graph Editor.
keywords: babylon.js, flow graph editor, execution contexts, variables, debugging, multiple contexts
further-reading:
    - title: Getting Started With The Flow Graph Editor
      url: /toolsAndResources/flowGraphEditor/gettingStarted
    - title: Authoring, Validation, and Debugging
      url: /toolsAndResources/flowGraphEditor/authoringAndDebugging
    - title: Validation and Property Editing
      url: /toolsAndResources/flowGraphEditor/validationAndProperties
video-overview:
video-content:
---

## What An Execution Context Is

An execution context is one independent run of the same flow graph.

That means a single graph definition can be executed more than once, with each execution context keeping its own variable state. This is useful when the same behavior should be reused across multiple entities or multiple logical runs without duplicating the graph itself.

If your goal is to keep several separate graph definitions open in the same editor session, that is a different feature. See [Multiple Graphs In One Editor](/toolsAndResources/flowGraphEditor/multipleGraphs).

Examples include:

- The same interaction logic applied to several meshes
- The same animation trigger graph with different per-instance state
- Several independent runs of the same gameplay behavior in one scene

## Scene Context Versus Execution Contexts

It is important to separate two ideas that sound similar:

- The **scene context** is the loaded preview scene and its available meshes, lights, cameras, materials, animation groups, and other scene objects.
- An **execution context** is one runtime instance of the graph, including its own variables and runtime state.

In the current implementation, execution contexts do **not** provide separate scene-asset bindings. They share the scene context for now, while keeping separate variable state.

So the mental model is:

- One loaded scene context for asset lookup and scene-aware pickers
- Many graph tabs for separate graph definitions
- Many execution contexts for independent graph state

## Toolbar Controls

Execution contexts are managed from the toolbar.

The editor exposes a `Ctx` dropdown plus three controls:

| Control | Purpose |
| ------- | ------- |
| `Ctx` dropdown | Select the active execution context |
| `+` | Create a new execution context |
| `−` | Remove the selected execution context |
| `✎` | Rename the selected execution context |

By default, the graph starts with one context, typically named `Context 0`.

### Selecting A Context

The selected context becomes the active runtime view for the editor.

That means the selected context controls what you inspect in places such as:

- Debug highlighting
- Breakpoints and stepping
- Variable values shown in the Variables panel

### Creating A Context

Use `+` to create a new execution context.

Each newly created context starts as a separate runtime instance of the same graph logic. It does not clone the graph; it adds another execution container for the existing graph.

### Removing A Context

Use `−` to remove the selected context.

The editor keeps at least one context available, so removal is disabled when only one context remains.

### Renaming A Context

Use `✎` to rename the selected context.

Renaming is especially useful once a graph has more than a couple of contexts and generic names like `Context 0` or `Context 1` stop being meaningful.

## Variables Are Per Context

The most important practical effect of execution contexts is that user variables are stored per context.

This means:

- Two contexts can run the same graph with different variable values.
- Switching contexts changes which variable values you see in the Variables panel.
- Adding or inspecting a variable happens against the currently selected context.

This is the core reason execution contexts matter: they let one graph definition behave independently in several runtime instances.

## Debugging The Selected Context

Debugging tools in the editor follow the currently selected execution context.

When you switch contexts, the editor's debugging view follows that context's runtime state. In practice, this means that highlights, breakpoint inspection, and variable observation should be interpreted as belonging to the active context, not to the graph globally.

This is especially important when the same graph is running more than once at the same time.

## Serialization And Round-Tripping

Execution contexts are not editor-only state.

The current implementation preserves:

- Context names
- Per-context variable values

when the graph is serialized and later restored.

That means saving and loading a graph does not collapse everything back into one anonymous runtime instance.

## Current Limitation

The current feature is about **multiple execution contexts**, not full per-context asset binding.

At this stage, all contexts still share the same scene context for asset resolution. So while contexts can hold different variable state, they do not yet provide separate per-context mesh sets, animation groups, or other scene-asset bindings.

That distinction matters for documentation because it prevents overpromising what the feature currently does.

## When To Use Execution Contexts

Execution contexts are a good fit when:

- You want to reuse one graph definition without copying it
- The important difference between instances is variable state rather than graph topology
- You need to inspect or debug one runtime instance at a time

They are not yet the right abstraction if your primary need is separate per-context asset assignment.
