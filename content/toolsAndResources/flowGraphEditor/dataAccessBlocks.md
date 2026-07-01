---
title: Data Access Blocks
image:
description: Detailed reference for the Data Access family in the Babylon.js Flow Graph Editor.
keywords: babylon.js, flow graph editor, data access, variables, properties, assets, constants
further-reading:
    - title: Block Reference
      url: /toolsAndResources/flowGraphEditor/blockReference
    - title: Validation and Property Editing
      url: /toolsAndResources/flowGraphEditor/validationAndProperties
    - title: Supported Block Families
      url: /toolsAndResources/flowGraphEditor/supportedBlockFamilies
video-overview:
video-content:
---

## Why Data Access Matters

The Data Access family is where the graph touches actual state: constants, variables, object properties, scene assets, collections, and structured payloads.

If Control Flow tells the graph when to act, Data Access often determines what it acts on.

## Constants And Variables

### `Constant`

Use `Constant` when the graph needs a fixed value.

This block is especially useful in early prototypes because it gives you a direct way to provide strings, numbers, vectors, colors, or matrices without introducing more graph complexity.

### `GetVariable`

Use `GetVariable` to read a graph variable.

This is useful when a value has already been computed or stored elsewhere in the graph and needs to be reused.

### `SetVariable`

Use `SetVariable` to write a graph variable.

This block is often the simplest way to introduce persistent graph state. In multi-variable mode, it can expose additional configurable inputs through its specialized property editor.

## Object Property Access

### `GetProperty`

Use `GetProperty` to read a property from a target object.

This is useful when the graph needs scene-derived values such as values from meshes, materials, or other referenced objects.

### `SetProperty`

Use `SetProperty` to write a property on a target object.

This is one of the most important blocks for scene interactivity because it bridges the graph to visible scene changes.

## Scene Assets And Structured Data

### `GetAsset`

Use `GetAsset` when you want to pick a named asset from the loaded scene. The specialized property editor makes this much easier than entering identifiers manually.

### `JsonPointerParser`

Use `JsonPointerParser` when you need to extract a value from structured data using a JSON pointer path.

This is useful for event payloads or data-driven graphs that consume structured inputs.

## Indexed And Case-Based Data Access

### `ArrayIndex`

Use `ArrayIndex` to retrieve a value from a collection by index.

### `IndexOf`

Use `IndexOf` to locate an item's position within a collection.

### `DataSwitch`

Use `DataSwitch` when you want to select among multiple data inputs based on a case value rather than route execution flow.

This makes it a data-oriented complement to the execution-oriented `Switch` block.

## Choosing The Right Block

- Use `Constant` to seed values quickly.
- Use `GetVariable` and `SetVariable` for graph state.
- Use `GetProperty` and `SetProperty` to interact with object state.
- Use `GetAsset` when the value should come from the currently loaded scene.
- Use `JsonPointerParser` for structured payloads.
- Use `ArrayIndex`, `IndexOf`, and `DataSwitch` for collections and data selection logic.
