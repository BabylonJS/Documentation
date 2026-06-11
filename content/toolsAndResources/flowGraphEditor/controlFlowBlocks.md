---
title: Control Flow Blocks
image:
description: Detailed reference for the Control Flow family in the Babylon.js Flow Graph Editor.
keywords: babylon.js, flow graph editor, control flow, branch, loops, delay, throttle
further-reading:
    - title: Block Reference
      url: /toolsAndResources/flowGraphEditor/blockReference
    - title: Supported Block Families
      url: /toolsAndResources/flowGraphEditor/supportedBlockFamilies
    - title: Authoring, Validation, and Debugging
      url: /toolsAndResources/flowGraphEditor/authoringAndDebugging
video-overview:
video-content:
---

## Why Control Flow Matters

The Control Flow family shapes when and how execution continues through the graph. These blocks are often the difference between a graph that merely reacts and a graph that behaves predictably over time.

## Core Branching And Routing

### `Branch`

Use `Branch` when execution should follow one path for `true` and another for `false`.

Typical uses:

- Gate an action behind a boolean variable
- Choose between success and failure paths
- Route logic based on a runtime check

### `Switch`

Use `Switch` when you need more than two execution outcomes. The block routes execution to a case-specific output based on an input value.

This is useful for state-driven graphs or mode-based logic.

### `MultiGate`

Use `MultiGate` to distribute repeated incoming triggers across multiple outputs instead of choosing between them from data.

This is useful for cycling behaviors or controlled sequencing patterns.

### `Sequence`

Use `Sequence` when one incoming signal should deliberately trigger several outputs in order.

This is useful when a single event should kick off multiple independent actions.

### `FlipFlop`

Use `FlipFlop` when repeated activations should alternate between two outputs.

This is a good fit for toggle-style interactions.

## Loops And Repetition

### `ForLoop`

Use `ForLoop` when you need a numeric iteration over a range. It is helpful when repeating an action a known number of times.

### `WhileLoop`

Use `WhileLoop` when repetition depends on a condition that stays true.

This is powerful, but it should be used carefully because poorly bounded conditions can make graphs harder to reason about.

### `DoN`

Use `DoN` when an action should be allowed only a limited number of times.

This is useful for one-shot or capped interactions.

### `CallCounter`

Use `CallCounter` when you need execution history, such as triggering an action only after a block has been reached several times.

## Time-Based Flow Control

### `SetDelay`

Use `SetDelay` to schedule a continuation after a time interval.

This is useful for deferred actions, cooldown-style waits, and staged interactions.

### `CancelDelay`

Use `CancelDelay` when a pending delayed action should no longer happen.

Together, `SetDelay` and `CancelDelay` let you model timers that can be invalidated by later events.

### `Debounce`

Use `Debounce` when repeated fast triggers should collapse into one effective action after input settles.

This is useful for noisy event sources or rapidly repeated interactions.

### `Throttle`

Use `Throttle` when repeated triggers should still be allowed, but only at a limited rate.

This is useful when the graph should remain responsive without running an expensive action every frame or every input event.

## Coordination Blocks

### `WaitAll`

Use `WaitAll` when multiple required signals must arrive before execution continues.

This is useful for synchronization points in larger graphs.

## Choosing The Right Block

- Use `Branch` for two-way boolean routing.
- Use `Switch` for value-based multi-way routing.
- Use `Sequence` when every output should run in order.
- Use `MultiGate` or `FlipFlop` for repeated trigger distribution.
- Use `ForLoop`, `WhileLoop`, `DoN`, or `CallCounter` for repetition.
- Use `SetDelay`, `CancelDelay`, `Debounce`, or `Throttle` for time-sensitive execution.
- Use `WaitAll` when multiple prerequisites must complete first.
