---
title: Flow Graph Blocks
image:
description: A detailed overview of the Flow Graph blocks.
keywords: diving deeper, flow graph, interactive scenes, action editor, getting started, basic concepts
---

# Flow Graph Blocks

The Flow Graph system is built around a set of blocks that represent different actions and events. Each block has its own set of inputs and outputs, allowing users to connect them together to create complex interactions.

## General notes

### Block inputs and outputs

Each block has a set of inputs and outputs. Inputs are used to receive data from other blocks, while outputs are used to send data to other blocks. The inputs and outputs can be connected together to create a flow of data between the blocks.
The inputs and outputs can be of different types, such as numbers, strings, vectors, and more. The type of the input or output is defined when the block is created.
The connections are made using the `connectTo` method, which takes another connection as an argument.
The connections can be made in any order, and the flow of data will be determined by the connections made between the blocks.
Connections are the only way to get data from a block. The block will rarely have a public API that you call into to get data. In the rare cases where this is the case, it will require the context as a variable of the function call.

### Async execution blocks

Some execution blocks are async in their nature. A good example is event blocks or the SetDelay block.
An execution blocks always has the `out` output, which is the synchronous output. This output is triggered when the block is initialized and executed, unless it is async. If it is async, the out will be triggered on the same frame as the initialization of the block. The async trigger is called `done` (unless stated otherwise).
In some cases the output will be called `completed`. The logic here is - `done` is for async executions, `completed` is for the completion of a long synchronous execution (like a for loop).

### Block names

This list will not include the FlowGraph prefix that is used in the code. For example, the FlowGraphConsoleLogBlock will be referred to as ConsoleLogBlock.

## Block Types

The Flow Graph system includes a variety of block types, each designed for specific tasks. Here are some of the most common block types:

- Event blocks - These blocks are triggered by events in the scene, such as a pointer down or a mesh pick. They are the starting point of the graph, and are responsible for triggering the execution of the other blocks.
- Execution blocks - These blocks are responsible for controlling the flow of execution in the graph. They can be used to create loops, branches, and other control structures. These blocks can be asynchronous.
- Data blocks - These blocks are used to perform calculations and manipulate data. They are passive in nature, and can be used to create complex expressions and algorithms. Good examples are Math blocks - add, subtract, multiply, divide, etc.

Let's dive deeper into the different block types.

## Event Blocks

Event blocks are a special kind of execution blocks, as they are the starting point of the graph. They have a "special" execution input that connected to events triggered by the scene.
They are triggered by events in the scene, such as a pointer down or a mesh pick. When an event block is triggered, it sends a signal to the connected blocks, allowing them to execute their actions.
Event blocks are passive in nature, and do not perform any actions on their own

### SceneReadyEventBlock

This block is triggered when the scene is ready. It is used to start the execution of the flow graph.

| data inputs | data outputs | execution inputs | execution outputs                         |
| ----------- | ------------ | ---------------- | ----------------------------------------- |
|             |              |                  | out - triggers when the block initializes |
|             |              |                  | done - triggers when scene is ready       |

```javascript
const sceneReady = new FlowGraphSceneReadyEventBlock();
// notify an execution block that the scene is ready
sceneReady.done.connectTo(nextBlock.in);
```

### SceneTickEventBlock

This block is triggered on each frame of the scene. using the scene.onBeforeRenderObservable observable.

| data inputs | data outputs                                              | execution inputs | execution outputs                                     |
| ----------- | --------------------------------------------------------- | ---------------- | ----------------------------------------------------- |
|             | timeSinceStart - time in seconds since the scene started. |                  | out - triggers when the block initializes             |
|             | deltaTime - time in seconds since the last frame.         |                  | done - triggers each time the scene is being rendered |

```javascript
const sceneTick = new FlowGraphSceneTickEventBlock();
// notify an execution block that a frame is being rendered
sceneTick.done.connectTo(nextBlock.in);
```

### MeshPickEventBlock

This block is triggered when a mesh is picked by the user.

| data inputs                                  | data outputs                           | execution inputs | execution outputs                         |
| -------------------------------------------- | -------------------------------------- | ---------------- | ----------------------------------------- |
| asset - the mesh to listen to                | pickedMesh - the mesh that was picked. |                  | out - triggers when the block initializes |
| pointerType - Up, Down, Move, Pick (default) | pickedPoint - the picked point         |                  | done - triggers when a mesh is picked     |
|                                              | pickOrigin - the pick origin.          |                  |                                           |
|                                              | pointerId - the pointer that picked.   |                  |                                           |

```javascript
const meshPick = new FlowGraphMeshPickEventBlock({ targetMesh: mesh });
// notify an execution block that a mesh was picked
meshPick.done.connectTo(nextBlock.in);
```

### PointerOverEventBlock

This block is triggered when the pointer is over a mesh.
meshUnderPointer is not necessarily the same as the target mesh, as it can be a mesh that is a descendant of the target mesh.

| data inputs                         | data outputs                                  | execution inputs | execution outputs                         |
| ----------------------------------- | --------------------------------------------- | ---------------- | ----------------------------------------- |
| targetMesh - the mesh to trigger on | pointerId - the pointer that is over          |                  | out - triggers when the block initializes |
|                                     | meshUnderPointer - the mesh under the pointer |                  | done - triggers when the pointer is over  |

```javascript
const pointerOver = new FlowGraphPointerOverEventBlock({ targetMesh: mesh, stopPropagation: true });
// notify an execution block that the pointer is over a mesh
pointerOver.done.connectTo(nextBlock.in);
```

### PointerOutEventBlock

This block is triggered when the pointer is out of a mesh.
meshOutOfPointer is not necessarily the same as the target mesh, as it can be a mesh that is a descendant of the target mesh.

| data inputs                         | data outputs                                   | execution inputs | execution outputs                         |
| ----------------------------------- | ---------------------------------------------- | ---------------- | ----------------------------------------- |
| targetMesh - the mesh to trigger on | pointerId - the pointer that is out            |                  | out - triggers when the block initializes |
|                                     | meshOutOfPointer - the mesh out of the pointer |                  | done - triggers when the pointer is out   |

```javascript
const pointerOut = new FlowGraphPointerOutEventBlock({ targetMesh: mesh, stopPropagation: true });
// notify an execution block that the pointer is out of a mesh
pointerOut.done.connectTo(nextBlock.in);
```

### ReceiveCustomEventBlock

This block is used to receive a custom event that was sent with the corresponding block. It can have custom event data that is passed with the event.
Custom events are coordinated by the graph coordinator, meaning they can be received cross-graphs as well.

| data inputs | data outputs                                | execution inputs | execution outputs                              |
| ----------- | ------------------------------------------- | ---------------- | ---------------------------------------------- |
|             | [key] - name based on the event data passed |                  | out - triggers when the block starts listening |
|             |                                             |                  | done - triggers when the event is received     |

```javascript
const receiveCustomEvent = new FlowGraphReceiveCustomEventBlock({
  eventId: "myEvent",
  eventData: {
    message: {
      type: RichTypeString,
    },
    time: {
      type: RichTypeNumber,
    },
    position: {
      type: RichTypeVector3,
    },
  },
});

// get the value of the message
nextBlock.message.connectTo(receiveCustomEvent.message);
// trigger when the event is received
receiveCustomEvent.done.connectTo(nextBlock.in);
```

## Execution Blocks

Execution blocks are responsible for controlling the flow of execution in the graph. They can be used to create loops, branches, and other control structures. These blocks can be asynchronous.
Think of execution blocks as active actions of more than just values passing. For example, a ForLoop block, SetDelay or even PlayAnimation block.

Execution block (excluding the special type which are event blocks) have an `in` input, which is the input that triggers the execution of the block. This input is usually connected to the `out` or `done` output of another block.

### SendCustomEventBlock

This block is used to send a custom event that can be received with the corresponding block. It can have custom event data that is passed with the event.
Custom events are coordinated by the graph coordinator, meaning they can be triggered cross-graphs as well.

| data inputs                                 | data outputs | execution inputs         | execution outputs                      |
| ------------------------------------------- | ------------ | ------------------------ | -------------------------------------- |
| [key] - name based on the event data passed |              | in - triggers event send | out - triggers when the event triggers |

```javascript
const sendCustomEvent = new FlowGraphSendCustomEventBlock({
  eventId: "myEvent",
  eventData: {
    message: {
      type: RichTypeString,
      value: "default overridable value",
    },
    time: {
      type: RichTypeNumber,
      value: 0,
    },
    position: {
      type: RichTypeVector3,
      value: new Vector3(0, 0, 0),
    },
  },
});

// at a later time, you can set the value or connect it to a different block
// the key "time" comes from the eventData passed
sendCustomEvent.time.setValue(Date.now(), ctx);
```

### BranchBlock

This block is used to create a branch in the flow graph. It has two execution outputs, `onTrue` and `onFalse`, which are triggered based on the value of the `condition` input.

| data inputs | data outputs | execution inputs | execution outputs                           |
| ----------- | ------------ | ---------------- | ------------------------------------------- |
| condition   |              | in               | onTrue - triggered when condition is truthy |
|             |              |                  | onFalse - triggered when condition is falsy |

```javascript
const branch = new FlowGraphBranchBlock();

branch.condition.connectTo(conditionBlock.value);

branch.onTrue.connectTo(nextBlock1.in);
branch.onFalse.connectTo(nextBlock2.in);
```

### CallCounterBlock

This block is used to count the number of times it has been called. It has a `count` output that returns the current count.
This block can reside between two execution blocks to know how many times the connection between them was triggered due to the synchronous nature of the `out` signal.

| data inputs | data outputs                                    | execution inputs           | execution outputs |
| ----------- | ----------------------------------------------- | -------------------------- | ----------------- |
|             | count [0] - the number of times it was executed | in                         | out               |
|             |                                                 | reset - resets the counter |                   |

```javascript
const nextBlock1 = new SomeBlock();
const nextBlock2 = new SomeBlock();
const callCounter = new FlowGraphCallCounterBlock();

// proxy between the two blocks
nextBlock1.out.connectTo(callCounter.in);
callCounter.out.connectTo(nextBlock2.in);
```

### DoNBlock

This block's `out` signal will be only executed `n` times, unless `reset` is triggered. Every time the `in` is triggered the counter will increase by 1, and execute the `out` signal, until the `maxExecutions` value is reached.

| data inputs   | data outputs       | execution inputs | execution outputs |
| ------------- | ------------------ | ---------------- | ----------------- |
| maxExecutions | executionCount [0] | in               | out               |
|               |                    | reset            |                   |

```javascript
const doN = new FlowGraphDoNBlock();
doN.maxExecutions.setValue(new FlowGraphInteger(5), ctx);
doN.out.connectTo(nextBlock.in);
```

### FlipFlopBlock

Think of this block as a switch. It has two execution outputs, `onOn` and `onOff`, which are triggered based on the switch's current state. After every execution, the switch will be flipped. The first will be `onOn`, the second will be `onOff`, and so on.

| data inputs | data outputs                               | execution inputs | execution outputs |
| ----------- | ------------------------------------------ | ---------------- | ----------------- |
|             | value [true] - current value of the switch | in               | onOn              |
|             |                                            |                  | onOff             |

### ForLoopBlock

This block behaves just like a for loop. It has a start and end index, and it iterates them until the end value is reached. Each iteration the `executionFlow` signal will be executed, and the current index will be available on the `index` output.

| data inputs    | data outputs | execution inputs | execution outputs |
| -------------- | ------------ | ---------------- | ----------------- |
| startIndex [0] | index [0]    | in               | executionFlow     |
| endIndex       |              |                  | completed         |
| step [1]       |              |                  |                   |

```javascript
const forLoop = new FlowGraphForLoopBlock();
forLoop.startIndex.setValue(new FlowGraphInteger(0), ctx);
forLoop.endIndex.setValue(new FlowGraphInteger(10), ctx);
forLoop.executionFlow.connectTo(nextBlock.in);
```

This block also has a static member named `MaxLoopIterations` [1000]. This is the max number of iterations per for loop, for performance reasons. If the number of iterations is higher than this value, the loop will stop at this value.
You can set this value to your liking, but be careful with performance.

```javascript
FlowGraphForLoopBlock.MaxLoopIterations = 10000;
```

### MultiGateBlock

This block is used to create a multi-gate in the flow graph. it has a list of execution signals, and each time the `in` signal is triggered, the next signal will be triggered. The first will be `out_0`, the second will be `out_1`, and so on. The order can be sequential or random.

| data inputs | data outputs                        | execution inputs | execution outputs                                                      |
| ----------- | ----------------------------------- | ---------------- | ---------------------------------------------------------------------- |
|             | lastIndex - the last index executed | in               | out_N - outputs according to the number of execution signals requested |
|             |                                     | reset            |                                                                        |

Configuration object:

```javascript
{
    /**
     * The number of output flows.
     */
    outputSignalCount: number;
    /**
     * If the block should pick a random output flow from the ones that haven't been executed. Default to false.
     */
    isRandom?: boolean;
    /**
     * If the block should loop back to the first output flow after executing the last one. Default to false.
     */
    isLoop?: boolean;
}
```

```javascript
const multiGate = new FlowGraphMultiGateBlock({
  outputSignalCount: 5, // required
  isLoop: true, // optional
});
multiGate.out_0.connectTo(nextBlock1.in);
multiGate.out_1.connectTo(nextBlock2.in);
multiGate.out_2.connectTo(nextBlock3.in);
// and so on, until out_4
```

Note that the number of output signals is not context-dependent but block-dependent. This means that even if used in two different contexts, the number of outputs and their names will be the same.
You can change the number of execution signals using the `setNumberOfOutputSignals` method.

```javascript
multiGate.setNumberOfOutputSignals(10);
```

This will adjust the output signals, adding or removing them as needed.

### SequenceBlock

This block is used to create a sequence in the flow graph. It has a list of output signals, and each time the `in` signal is triggered, all output signals will be triggered sequentially. The first will be `out_0`, the second will be `out_1`, and so on.

| data inputs | data outputs | execution inputs | execution outputs                                                      |
| ----------- | ------------ | ---------------- | ---------------------------------------------------------------------- |
|             |              | in               | out_N - outputs according to the number of execution signals requested |

Configuration object:

```javascript
{
  /**
   * The number of output flows.
   */
  outputSignalCount: number;
}
```

```javascript
const sequence = new FlowGraphSequenceBlock({
  outputSignalCount: 5, // optional
});
sequence.out_0.connectTo(nextBlock1.in);
sequence.out_1.connectTo(nextBlock2.in);
// and so on, until out_4
```

Note that the number of output signals is not context-dependent but block-dependent. This means that even if used in two different contexts, the number of outputs and their names will be the same.
You can change the number of execution signals using the `setNumberOfOutputSignals` method.

```javascript
sequence.setNumberOfOutputSignals(10);
```

This will adjust the output signals, adding or removing them as needed.

### SetDelayBlock

This block is used to create a delay in the flow graph. It has a `delay` input that specifies the delay time in seconds. The `done` signal will be triggered after the delay time has passed, while the `out` signal will be triggered immediately.
Each delay has its own index, which increments each time a new delay is created. This index can be used to cancel a specific delay, similar to setTimeout/clearTimeout.

<Alert type="info">
  The delay is using Babylon's `AdvancedTimer`, meaning it is using the scene render loop to count time. That means that if the scene doesn't render, the delay will not be triggered!
</Alert>

| data inputs           | data outputs                                       | execution inputs                   | execution outputs                               |
| --------------------- | -------------------------------------------------- | ---------------------------------- | ----------------------------------------------- |
| duration - in seconds | lastDelayIndex - the index of this delay execution | in                                 | out - triggers when the block initializes       |
|                       |                                                    | cancel - cancel all pending delays | done - triggers after the delay time has passed |
|                       |                                                    |                                    | error - triggers when an error has occurred     |

```javascript
const setDelay = new FlowGraphSetDelayBlock();
setDelay.duration.setValue(2.5 /* seconds */, ctx);
setDelay.done.connectTo(nextBlock.in); // will be triggered 2.5 seconds after the in signal
```

This class has a static member called `MaxParallelDelayCount` [100]. This is the max number of delays that can be created by this block at the same time. If this number is reached, the next delay will not be created and the error signal will be triggered.
You can set this value to your liking, but be careful with performance.

```javascript
FlowGraphSetDelayBlock.MaxParallelDelayCount = 200;
```

### CancelDelayBlock

This block is used to cancel a delay that was created by the SetDelayBlock. It has a `delayIndex` input that specifies the index of the delay to cancel.

<Alert type="info">
  Another way of canceling a delay is to use the `cancel` input of the SetDelayBlock. It can be used to cancel all of the pending delays. This block can cancel one specific delay.
</Alert>

| data inputs                                     | data outputs | execution inputs | execution outputs                           |
| ----------------------------------------------- | ------------ | ---------------- | ------------------------------------------- |
| delayIndex - delay index (from the delay block) |              | in               | out                                         |
|                                                 |              |                  | error - triggers when an error has occurred |

```javascript
const delayIndex = delayBlock.lastDelayIndex.getValue(ctx);

const cancelDelay = new FlowGraphCancelDelayBlock();
cancelDelay.delayIndex.setValue(delayIndex, ctx);
cancelDelay.out.connectTo(nextBlock.in);
```

### SwitchBlock

This block is used to create a switch in the flow graph. It has a list of output signals, and a `case` input that specifies which output signal to trigger. It behaves the same as a switch block in programming languages, and also has a `default` output signal.
The list of cases can be of a number type (integer or number). The list of cases needs to be provided beforehand as part of the block's construction.

| data inputs | data outputs | execution inputs | execution outputs                           |
| ----------- | ------------ | ---------------- | ------------------------------------------- |
|             |              | in               | out_N - outputs according to cases provided |
|             |              |                  | default - triggered when no case matches    |

```javascript
const switchBlock = new FlowGraphSwitchBlock({
  cases: [0, 1, 2, 3, 4],
});
switchBlock.case.connectTo(caseBlock.value);
switchBlock.out_0.connectTo(nextBlock1.in);
switchBlock.out_1.connectTo(nextBlock2.in);
switchBlock.out_2.connectTo(nextBlock3.in);
switchBlock.out_3.connectTo(nextBlock4.in);
switchBlock.out_4.connectTo(nextBlock5.in);
```

You can add and remove cases using the `addCase` and `removeCase` methods.

```javascript
switchBlock.addCase(5); // adds `out_5`
switchBlock.removeCase(0); // removes `out_0`
```

### ThrottleBlock

A block that throttles the execution of its output flow. The `out` signal will be executed only once every `duration` seconds, regardless of how many times the `in` signal is triggered. It will also be triggered the first time the `in` signal is triggered.

| data inputs           | data outputs                                                  | execution inputs | execution outputs |
| --------------------- | ------------------------------------------------------------- | ---------------- | ----------------- |
| duration - in seconds | lastRemainingTime - time left for next out on last in trigger | in               | out               |

```javascript
const throttle = new FlowGraphThrottleBlock();
throttle.duration.setValue(2.5 /* seconds */, ctx);
throttle.out.connectTo(nextBlock.in);
```

### WaitAllBlock

This block is used to wait for all of its input signals to be triggered before executing its output signal. It has a `in_` inputs, based on the number of input signals. The `completed` signal will be executed when all of the input signals are triggered. Otherwise the `out` signal will be executed.

| data inputs | data outputs                                             | execution inputs | execution outputs |
| ----------- | -------------------------------------------------------- | ---------------- | ----------------- |
|             | remainingInputs - the number of inputs not yet triggered | in_N             | out               |
|             |                                                          | reset            | completed         |

```javascript
const waitAll = new FlowGraphWaitAllBlock({
  inputSignalCount: 5,
});
```

### WhileLoopBlock

This block behaves just like a while loop. It has a `condition` input that specifies the condition to evaluate. Each time the `in` signal is triggered, the condition will be evaluated. If it is true, the `executionFlow` signal will be executed, and the `condition` will be evaluated again. If it is false, the `completed` signal will be executed.

| data inputs | data outputs | execution inputs | execution outputs                                |
| ----------- | ------------ | ---------------- | ------------------------------------------------ |
| condition   |              | in               | executionFlow - triggered when condition is true |
|             |              |                  | completed - triggered when condition is false    |

```javascript
const whileLoop = new FlowGraphWhileLoopBlock();
whileLoop.condition.connectTo(conditionBlock.value);
whileLoop.executionFlow.connectTo(nextBlock.in);
whileLoop.completed.connectTo(nextBlock2.in);
```

This block has a static member called `MaxLoopCount` [1000]. This is the max number of iterations per while loop, for performance reasons. If the number of iterations is higher than this value, the loop will stop at this value.
You can set this value to your liking, but be careful with performance.

```javascript
FlowGraphWhileLoopBlock.MaxLoopCount = 10000;
```

### ConsoleLogBlock

This block is used to log a message to the console. It has a `message` input that specifies the message to log.

| data inputs                              | data outputs | execution inputs | execution outputs |
| ---------------------------------------- | ------------ | ---------------- | ----------------- |
| message - the message to log             |              | in               | out               |
| logType ["log"] - "log", "warn", "error" |              |                  |                   |

```javascript
const consoleLog = new FlowGraphConsoleLogBlock();
consoleLog.message.setValue("Hello, world!", ctx);
consoleLog.out.connectTo(nextBlock.in);
```

### PlayAnimationBlock

This block takes an animation or animation group and plays them. If an animation is provided, it is also required to provide the target `object` on which the animation will run.

This block is also used to play interpolation animations. An object can have only one single interpolation animation running on it. A new interpolation will cancel the previous one.

Only one of the inputs - `animation` or `animationGroup` - is required.

<Alert type="info">
  The output of this block is always an animation group. Even when providing an animation object, it will be added to a group holding this animation only.
</Alert>

<Alert type="info">
  Babylon's animation system is using frames and not time. The `from` and `to` values are the frame numbers, and not the time in seconds.
</Alert>

| data inputs                                  | data outputs                                                     | execution inputs | execution outputs                           |
| -------------------------------------------- | ---------------------------------------------------------------- | ---------------- | ------------------------------------------- |
| speed [1] - speed factor                     | currentAnimationGroup - the animation group that is being played | in               | out                                         |
| loop [false]                                 | currentFrame - the current playing animation frame               |                  | error - triggers when an error has occurred |
| from [0] - the first frame to play           | currentTime - the current playing animation time                 |                  | done - animation is done playing            |
| to [1] - the last frame to play              |                                                                  |                  | animationLoop - when the animation loops    |
| animationGroup - the animation group to play |                                                                  |                  | animationEnd - when an animation ends       |
| animation - the animation to play            |                                                                  |                  | animationGroupLoop - when the AG loops      |
| object - the object to play the animation on |                                                                  |                  | error - when something went wrong           |

```javascript
// option 1 - use animation
const someAnimation = new Animation("someAnimation", "position.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
const playAnimation = new FlowGraphPlayAnimationBlock();
playAnimation.animation.setValue(someAnimation, ctx);
playAnimation.object.setValue(mesh, ctx);
playAnimation.done.connectTo(nextBlock.in);

// option 2 - use animation group
const someAnimationGroup = new AnimationGroup("someAnimationGroup");
const playAnimationGroup = new FlowGraphPlayAnimationBlock();
playAnimationGroup.animationGroup.setValue(someAnimationGroup, ctx);
playAnimationGroup.done.connectTo(nextBlock.in);
```

### StopAnimationBlock

This block takes an animation group and stops them.

| data inputs                                  | data outputs | execution inputs | execution outputs                           |
| -------------------------------------------- | ------------ | ---------------- | ------------------------------------------- |
| animationGroup - the animation group to stop |              | in               | out - when no stopAtFrame provided          |
| stopAtFrame - optional frame to stop at      |              |                  | error - triggers when an error has occurred |
|                                              |              |                  | done - when stopAtFrame provided            |

```javascript
const stopAnimation = new FlowGraphStopAnimationBlock();
stopAnimation.animationGroup.setValue(playAnimationGroup.currentAnimationGroup.getValue(ctx), ctx);
```

### SetPropertyBlock

This block takes an object and a property name, and sets the value of that property. It is used to set a property on an object.

See GetPropertyBlock for the getter block.

<Alert type="info">
  The property name can be a nested property, like `position.x` or `scaling.y`.
</Alert>

| data inputs                                                      | data outputs | execution inputs | execution outputs                    |
| ---------------------------------------------------------------- | ------------ | ---------------- | ------------------------------------ |
| object                                                           |              | in               | out - when the value was set         |
| propertyName                                                     |              |                  | error - when an exception was thrown |
| value                                                            |              |                  |                                      |
| customSetFunction - a function that can be used to set the value |              |                  |                                      |

### SetVariableBlock

This block takes a variable name and a value, and sets the value of that variable. It is used to set a variable in the context.

| data inputs | data outputs | execution inputs | execution outputs |
| ----------- | ------------ | ---------------- | ----------------- |
| value       |              | in               | out               |

Configuration object:

```javascript
{
  /**
   * The name of the variable to set.
   */
  variable: string;
}
```

```javascript
const setVariable = new FlowGraphSetVariableBlock({
  variable: "myVariable",
});
setVariable.value.setValue(5, ctx);
```

## Data Blocks

Data blocks are used to perform calculations and manipulate data. They are passive in nature, and can be used to create complex expressions and algorithms. Good examples are Math blocks - add, subtract, multiply, divide, etc.
These blocks have no execution inputs or outputs.

### Utility blocks

Utility blocks are helpful when manipulating different types of data.

#### InterpolationBlock

This block takes an object and interpolates one of its properties from one value to another over time. It is used to create smooth transitions between two values.
Its output is an animation that can then be used with the PlayAnimationBlock. Connecting the animation output to a play animation input will generate the interpolation and start playing it.

The interpolation builds keyframes based on the configuration values provided. a keyframe has duration and value. So if the keyFrameCount is 1 (default), 1 set of value/duration will be generated - `duration_0`, `value_0`.

The target on which the interpolation is running will be set by the play animation block and not this one! This way you can reuse the same block on different objects.

<Alert type="info">
  Slerp will be used if the animation type is Quaternion
</Alert>

<Alert type="info">
  We are using "duration" instead of "frames" because we are controlling the speed of the animation and define it to run at 60 FPS (arbitrary value). That means that 60 frames will be 1 second, even if the screen is running at a different FPS.
</Alert>

| data inputs                                                            | data outputs |
| ---------------------------------------------------------------------- | ------------ |
| initialValue - optional initial value                                  | animation    |
| endValue - optional, the value to get to (will be assigned to value_0) |              |
| easingFunction - optional easing function                              |              |
| propertyName - the property to animate                                 |              |

Configuration object:

```javascript
{
    /**
     * The number of keyframes to interpolate between.
     * Will default to 1 if not provided (i.e. from currentValue to a provided value in the time provided)
     */
    keyFramesCount?: number;

    /**
     * The duration of the interpolation.
     */
    duration?: number;

    /**
     * The name of the property that will be interpolated.
     * Can be an array, but must be of the same type (i.e. position and scaling, or `position.x` and `position.y`)
     */
    propertyName?: string | string[];

    /**
     * The type of the animation to create.
     * Default is ANIMATIONTYPE_FLOAT
     * This cannot be changed after construction, so make sure to pass the right value.
     */
    animationType?: number | FlowGraphTypes;
}
```

```javascript
// example of 1 keyframe:
const interpolation = new FlowGraphInterpolationBlock({
  animationType: Constants.ANIMATIONTYPE_VECTOR3,
  duration: 1,
  propertyName: "position",
});
interpolation.endValue.setValue(new Vector3(1, 2, 3), ctx);
const playAimation = new FlowGraphPlayAnimationBlock();
playAnimation.animation.setValue(interpolation.animation, ctx);

// example of 2 keyframes:
const interpolation = new FlowGraphInterpolationBlock({
  animationType: Constants.ANIMATIONTYPE_VECTOR3,
  propertyName: "position",
  keyFramesCount: 2,
});
// generate a 2 seconds animation, with 1 second to each keyframe
interpolation.duration_0.setValue(1, ctx);
interpolation.value_0.setValue(new Vector3(1, 2, 3), ctx);
interpolation.duration_1.setValue(2, ctx);
interpolation.value_1.setValue(new Vector3(4, 5, 6), ctx);
```

#### BezierCurveEasingBlock

This block generates a bezier curve easing function. It has 4 inputs that specify the control points of the bezier curve.

<Alert type="info">
  A nice way to compute the control points is using this website - [cubic-bezier generator](https://cubic-bezier.com/)
</Alert>

| data inputs                                                 | data outputs   |
| ----------------------------------------------------------- | -------------- |
| controlPoint1 - x,y coordinates of the first control point  | easingFunction |
| controlPoint2 - x,y coordinates of the second control point |                |

#### ArrayIndexBlock

This block takes an array and an index, and returns the value at that index. It is used to access elements in an array.

| data inputs | data outputs |
| ----------- | ------------ |
| array       | index        |
|             | value        |

```javascript
const meshes = [mesh1, mesh2, mesh3];
const arrayIndex = new FlowGraphArrayIndexBlock();
arrayIndex.array.setValue(meshes, ctx);
arrayIndex.index.setValue(1, ctx);
```

#### IndexOfBlock

This block takes an array and a value, and returns the index of that value in the array. It is used to find the index of an element in an array.

| data inputs | data outputs |
| ----------- | ------------ |
| array       | index        |
| object      |              |

#### ContextBlock

This block exposes data from the context.

| data inputs | data outputs                                           |
| ----------- | ------------------------------------------------------ |
|             | userVariables - user defined variables in this context |
|             | executionId - current execution id                     |

#### FunctionReferenceBlock

This block takes a function and returns a reference to that function. It is used to create a reference to a function that can be called later.
It is used wherever a custom function can be provided (like interpolation or animation)

<Alert type="info">
  The function will not be called until it is executed by an execution block. This just create a bound function reference.
</Alert>

| data inputs                                               | data outputs |
| --------------------------------------------------------- | ------------ |
| functionName                                              | output       |
| object - the object to get the function from              |              |
| context [null] - the context to use for the function call |              |

```javascript
const functionContainer = {
  myFunction: (ctx) => {
    console.log("Hello, world!");
  },
};
const functionReference = new FlowGraphFunctionReferenceBlock();
functionReference.functionName.setValue("myFunction", ctx);
functionReference.object.setValue(functionContainer, ctx);
functionReference.output.connectTo(nextBlock.in);
```

#### CodeExecutionBlock

This block takes a formatted function and executes it on the provided input value. It is used to execute custom code on a value.

The function's type is this:

```typescript
type CodeExecutionFunction = (value: any, context: FlowGraphContext) => any;
```

| data inputs                                 | data outputs |
| ------------------------------------------- | ------------ |
| executionFunction - the function to execute | result       |
| value - the value to run the function on    |              |

```javascript
function changeColor(value, ctx) {
  value.r = 1 - value.r;
  value.g = 1 - value.g;
  value.b = 1 - value.b;
  return value;
}
const codeExecution = new FlowGraphCodeExecutionBlock();
codeExecution.executionFunction.setValue(changeColor, ctx);
codeExecution.value.setValue(new Color3(1, 0, 0), ctx);
codeExecution.result.connectTo(someOtherBlock.color);
```

#### GetAssetBlock

This block takes an asset index and returns the asset. It is used to get an asset from the scene.

<Alert type="info">
  The asset comes from the context's `assetsContext`, which is the scene per default (but can be any asset container)
</Alert>

Assets types are:

- Animation
- AnimationGroup
- Mesh
- Material
- Camera
- Light

| data inputs | data outputs |
| ----------- | ------------ |
| index       | value        |
| type        |              |

Configuration for this block:

```javascript
{
    /**
     * The type of the asset that will be retrieved.
     */
    type: FlowGraphAssetType;
    /**
     * The index of the asset in the corresponding array in the assets context.
     * If not provided you can still change it using the input connection.
     */
    index?: number | FlowGraphInteger;

    /**
     * If set to true, instead of the index in the array it will search for the unique id of the asset.
     * The value of index will be used as the unique id.
     */
    useIndexAsUniqueId?: boolean;
}
```

#### GetPropertyBlock

This block takes an object and a property name, and returns the value of that property. It is used to get a property from an object.

<Alert type="info">
  The property name can be a nested property, like `position.x` or `scaling.y`.
</Alert>

| data inputs                                                      | data outputs                                              |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| object                                                           | value                                                     |
| propertyName                                                     | isValid - is the value valid (i.e. is the property there) |
| customGetFunction - a function that can be used to get the value |                                                           |

Configuration object:

```javascript
{
    /**
     * The name of the property that will be set
     */
    propertyName?: string;

    /**
     * The target asset from which the property will be retrieved
     */
    object?: AssetType<O>;

    /**
     * If true, the block will reset the output to the default value when the target asset is undefined.
     */
    resetToDefaultWhenUndefined?: boolean;
}
```

```javascript
const getProperty = new FlowGraphGetPropertyBlock();
getProperty.object.setValue(mesh, ctx);
getProperty.propertyName.setValue("position.x", ctx);
// now connect .value with any input somewhere else
```

#### GetVariableBlock

This block takes a variable name and returns the value of that variable. It is used to get a variable from the context.

<Alert type="warn">
  The variable is fixed when constructing the block and cannot be changed!
</Alert>

| data inputs | data outputs |
| ----------- | ------------ |
|             | value        |

Configuration object:

```javascript
{
    /**
     * The name of the variable to get.
     */
    variable: string;

    /**
     * The initial value of the variable.
     */
    initialValue?: T;
}
```

```javascript
const getVariable = new FlowGraphGetVariableBlock({
  variable: "myVariable",
  initialValue: 0,
});
```

### Type conversion blocks

There are blocks to convert from type to type. The following types are implemented:

Float, int, boolean

There are blocks to convert from one type to another. The naming convention is
`FlowGraphTypeToTypeBlock`, where `Type` is the type to convert from and `Type` is the type to convert to, i.e. there is a block called FlowGraphFloatToIntBlock to convert from float to int.

### Math blocks

These are blocks that perform mathematical operations. They are passive in nature, and can be used to create complex expressions and algorithms.

The list is extensive, and I recommend you to view the list in the API documentation.
