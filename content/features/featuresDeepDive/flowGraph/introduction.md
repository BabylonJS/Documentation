---
title: Introduction to the Flow Graph
image:
description: Discover the new system to drive interactive experiences in Babylon.js
keywords: flow graph, interactivity
further-reading:
video-overview:
video-content:
---

# Introduction to the Flow Graph

The Flow Graph is a new system currently in development, intended to be a new and powerful way of driving interactive experiences in Babylon.js by connecting node primitives, similar of how [Node Material](/features/featuresDeepDive/materials/node_material/nodeMaterial) and [Node Geometry](/features/featuresDeepDive/mesh/nodeGeometry) work. To create a Flow Graph, first you should create a Flow Graph Coordinator, which is responsible for grouping and communication between graphs.

This is a basic example of a Flow Graph that logs a message to the console when a mesh is clicked:

```javascript
var coord = new BABYLON.FlowGraphCoordinator({scene});

var graph = coord.createGraph();

var ctx = graph.createContext();

var sceneReady = new BABYLON.FlowGraphSceneReadyEventBlock();
graph.addEventBlock(sceneReady);

var log = new BABYLON.FlowGraphLogBlock();
sceneReady.onDone.connectTo(log.onStart);
log.message.setValue("Hello, world!", ctx);

coord.start();
```

Flow Graphs start execution when an **Event Node** is triggered. The other types of nodes are the **Execution Nodes**, which are responsible for setting state, control flow, playing animations and sound, and **Data Nodes**, which perform operations on data when requested by Execution Nodes. Nodes are connected through each other through **Signal Connections**, which activate the execution of each node in the chain, and **Data Connections**, through which data is requested and updated. Data Connections are typed at Typescript level, differently from Node Material and Node Geometry, so it's easier to know the expected type of data through its own code.

Each Flow Graph contains one or more **contexts**, which represent the actual execution state of a graph. Having the capacity of handling multiple contexts allows the same behavior, such as a door opening when a switch is pressed, to be reused across different scene objects. This reuse can be accomplished by setting different **variables** on each context. When a graph is started, all of its contexts are started. Here, the previous example has been modified with two contexts:

```javascript
var coord = new BABYLON.FlowGraphCoordinator({scene});

var graph = coord.createGraph();

var ctx = graph.createContext();
var ctx2 = graph.createContext();

var sceneReady = new BABYLON.FlowGraphSceneReadyEventBlock();
graph.addEventBlock(sceneReady);

var log = new BABYLON.FlowGraphLogBlock();
sceneReady.onDone.connectTo(log.onStart);
log.message.setValue("Hello, world!", ctx);
log.message.setValue("I'm a different context!", ctx2);

coord.start();
```

Different Flow Graphs can also communicate with each other by sending and receiving **custom events**. For example, the previous example has been modified again to use a custom event sent between two different graphs.

```javascript
var coord = new BABYLON.FlowGraphCoordinator({scene});

var sendGraph = coord.createGraph();
var sendGraphCtx = sendGraph.createContext();

var sceneReady = new BABYLON.FlowGraphSceneReadyEventBlock();
sendGraph.addEventBlock(sceneReady);

var sendEvent = new BABYLON.FlowGraphSendCustomEventBlock();
sendEvent.eventId.setValue("customEvent", sendGraphCtx);
sendEvent.eventData.setValue("Custom event data", sendGraphCtx);
sceneReady.onDone.connectTo(sendEvent.onStart);

var receiveGraph = coord.createGraph();
var receiveGraphCtx = receiveGraph.createContext();

var receiveEvent = new BABYLON.FlowGraphReceiveCustomEventBlock({eventId: "customEvent"});
receiveGraph.addEventBlock(receiveEvent);

var log = new BABYLON.FlowGraphLogBlock();
receiveEvent.onDone.connectTo(log.onStart);
receiveEvent.eventData.connectTo(log.message);

coord.start();
```

The Flow Graph format will allow for parsing and serializing files in the gLTF format by utilizing their Interactivity Extension.
