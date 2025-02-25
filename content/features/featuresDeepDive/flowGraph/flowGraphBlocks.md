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

### FlowGraphSceneReadyEventBlock

This block is triggered when the scene is ready. It is used to start the execution of the flow graph.

| data inputs | data outputs | execution inputs | execution outputs                         |
| ----------- | ------------ | ---------------- | ----------------------------------------- |
|             |              |                  | out - triggers when the block initializes |
|             |              |                  | done - triggers when scene is ready       |

```javascript
const sceneReady = new FlowGraphSceneReadyEventBlock();
// notify an execution block that the scene is ready
sceneReady.done.connectTo(executionBlock.in);
```

### FlowGraphSceneTickEventBlock

This block is triggered on each frame of the scene. using the scene.onBeforeRenderObservable observable.

| data inputs | data outputs                                              | execution inputs | execution outputs                                     |
| ----------- | --------------------------------------------------------- | ---------------- | ----------------------------------------------------- |
|             | timeSinceStart - time in seconds since the scene started. |                  | out - triggers when the block initializes             |
|             | deltaTime - time in seconds since the last frame.         |                  | done - triggers each time the scene is being rendered |

```javascript
const sceneTick = new FlowGraphSceneTickEventBlock();
// notify an execution block that a frame is being rendered
sceneTick.done.connectTo(executionBlock.in);
```

### FlowGraphMeshPickEventBlock

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
meshPick.done.connectTo(executionBlock.in);
```

### FlowGraphPointerOverEventBlock

This block is triggered when the pointer is over a mesh.
meshUnderPointer is not necessarily the same as the target mesh, as it can be a mesh that is a descendant of the target mesh.

| data inputs                         | data outputs                                  | execution inputs | execution outputs                         |
| ----------------------------------- | --------------------------------------------- | ---------------- | ----------------------------------------- |
| targetMesh - the mesh to trigger on | pointerId - the pointer that is over          |                  | out - triggers when the block initializes |
|                                     | meshUnderPointer - the mesh under the pointer |                  | done - triggers when the pointer is over  |

```javascript
const pointerOver = new FlowGraphPointerOverEventBlock({ targetMesh: mesh, stopPropagation: true });
// notify an execution block that the pointer is over a mesh
pointerOver.done.connectTo(executionBlock.in);
```

### FlowGraphPointerOutEventBlock

This block is triggered when the pointer is out of a mesh.
meshOutOfPointer is not necessarily the same as the target mesh, as it can be a mesh that is a descendant of the target mesh.

| data inputs                         | data outputs                                   | execution inputs | execution outputs                         |
| ----------------------------------- | ---------------------------------------------- | ---------------- | ----------------------------------------- |
| targetMesh - the mesh to trigger on | pointerId - the pointer that is out            |                  | out - triggers when the block initializes |
|                                     | meshOutOfPointer - the mesh out of the pointer |                  | done - triggers when the pointer is out   |

```javascript
const pointerOut = new FlowGraphPointerOutEventBlock({ targetMesh: mesh, stopPropagation: true });
// notify an execution block that the pointer is out of a mesh
pointerOut.done.connectTo(executionBlock.in);
```

### FlowGraphReceiveCustomEventBlock

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
executionBlock.message.connectTo(receiveCustomEvent.message);
// trigger when the event is received
receiveCustomEvent.done.connectTo(executionBlock.in);
```

## Execution Blocks

Execution blocks are responsible for controlling the flow of execution in the graph. They can be used to create loops, branches, and other control structures. These blocks can be asynchronous.
Think of execution blocks as active actions of more than just values passing. For example, a ForLoop block, SetDelay or even PlayAnimation block.

Execution block (excluding the special type which are event blocks) have an `in` input, which is the input that triggers the execution of the block. This input is usually connected to the `out` or `done` output of another block.

### FlowGraphSendCustomEventBlock

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

### FlowGraphBranchBlock

This block is used to create a branch in the flow graph. It has two execution outputs, `onTrue` and `onFalse`, which are triggered based on the value of the `condition` input.

| data inputs | data outputs | execution inputs | execution outputs                           |
| ----------- | ------------ | ---------------- | ------------------------------------------- |
| condition   |              | in               | onTrue - triggered when condition is truthy |
|             |              |                  | onFalse - triggered when condition is falsy |

```javascript
const branch = new FlowGraphBranchBlock();

branch.condition.connectTo(conditionBlock.value);

branch.onTrue.connectTo(executionBlock1.in);
branch.onFalse.connectTo(executionBlock2.in);
```

### FlowGraphCallCounterBlock

This block is used to count the number of times it has been called. It has a `count` output that returns the current count.
This block can reside between two execution blocks to know how many times the connection between them was triggered due to the synchronous nature of the `out` signal.

| data inputs | data outputs                                | execution inputs           | execution outputs |
| ----------- | ------------------------------------------- | -------------------------- | ----------------- |
|             | count - the number of times it was executed | in                         | out               |
|             |                                             | reset - resets the counter |                   |

```javascript
const executionBlock1 = new SomeBlock();
const executionBlock2 = new SomeBlock();
const callCounter = new FlowGraphCallCounterBlock();

// proxy between the two blocks
executionBlock1.out.connectTo(callCounter.in);
callCounter.out.connectTo(executionBlock2.in);
```

### FlowGraphDoNBlock

This block's `out` signal will be only executed `n` times, unless `reset` is triggered. Every time the `in` is triggered the counter will increase by 1, and execute the `out` signal, until the `maxExecutions` value is reached.

| data inputs   | data outputs       | execution inputs | execution outputs |
| ------------- | ------------------ | ---------------- | ----------------- |
| maxExecutions | executionCount [0] | in               | out               |
|               |                    | reset            |                   |

```javascript
const doN = new FlowGraphDoNBlock();
doN.maxExecutions.setValue(new FlowGraphInteger(5), ctx);
doN.out.connectTo(executionBlock.in);
```
