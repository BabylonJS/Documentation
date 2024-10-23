---
title: Available Execution Nodes
image:
description: A list of all the Execution Nodes available in the Babylon.js Flow Graph
keywords: flow graph, interactivity
further-reading:
video-overview:
video-content:
---

# Execution Nodes

## Animation

### Play Animation

A block that plays an [animation](features/featuresDeepDive/animation/animation_introduction) supplied to it.

```javascript
const block = new BABYLON.FlowGraphPlayAnimationBlock();

block.target.setValue(...); // sets the target of the animation
block.animation.setValue(...); // sets the animation to play
block.speed.setValue(...); // sets the speed of the animation
block.loop.setValue(...); // sets if the animation should loop or not
block.from.setValue(...); // sets the starting frame of the animation
block.to.setValue(...); // sets the ending frame of the animation

block.runningAnimatable.connectTo(...) // the Animatable produced by running the animation

block.onDone.connectTo(...) // this output flow executes as soon as the animation is played
block.onAnimationEnd.connectTo(...) // this output flow executes only once the animation stops playing
```

### Stop Animation

A block that stops an animation.

```javascript
const block = new BABYLON.FlowGraphStopAnimationBlock();

block.animationToStop.setValue(...) // the ANIMATABLE to stop running
```

### Pause Animation

A block that pauses an animation.

```javascript
const block = new BABYLON.FlowGraphPauseAnimationBlock();

block.animationToPause.setValue(...) // the ANIMATABLE to pause
```

## Control Flow

### Branch

A block that executes one of two output flows depending on a condition.

```javascript
const block = new BABYLON.FlowGraphBranchBlock();

block.condition.setValue(...) // the condition to check
block.onTrue.connectTo(...) // the flow to execute if the condition is true
block.onFalse.connectTo(...) // the flow to execute if the condition is false
```

### Counter

A block that counts the number of times that it has been called.

```javascript
const block = new BABYLON.FlowGraphCounterBlock();

block.reset.connectTo(...)  // input flow that resets the counter when activated
block.count.connectTo(...) // the count
```

### DoN

A block that executes an output flow maximum a set number of times

```javascript
const block = new BABYLON.FlowGraphDoNBlock();

block.reset.connectTo(...)  // input flow that resets the times already executed when activated
block.maxNumberOfExecutions.setValue(5...) // will execute the output flow a maximum of 5 times
block.currentCount.connectTo(...) // the current count of executions of the block.
```

### Flip Flop

A block that flips betweent two flows.

### ForLoop

A block that executes a flow in a loop.

```javascript
const forLoop = new BABYLON.FlowGraphForLoopBlock();

forLoop.startIndex.setValue(1...) // the start index of the loop
forLoop.endIndex.setValue(3...) // the end index of the loop
forLoop.step.setValue(2...) // the increment of the index of the loop

forLoop.index.connectTo(...) // the current index of the loop
forLoop.onLoop.connectTo(...) // the body of the loop
forLoop.onDone.connectTo(...) // the flow to execute when the loop is done running
```

### MultiGate

A block that executes one of N outputs sequentially or randomly.

### Switch

A block that executes one of N outputs based on a selection.

### Throttle

A block that throttles the execution of an output signal.

### Timer

A block that activates an output once a timer has ran out.

### WaitAll

A block that executes an output once all the inputs have been activated.

### While Loop

A block that executes an output while a condition is true.

## Others

### Custom Function

A block that executes a custom function.

### Log

A block that logs a message on the console.

### Send Custom Event

A block that sends a custom events (see Event Nodes).

### Set Property

A block that sets a property on a target object.

### Set Variable

A block that sets a variable on the graph.
