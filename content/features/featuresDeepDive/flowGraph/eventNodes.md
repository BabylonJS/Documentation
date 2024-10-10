---
title: Available Event Nodes
image:
description: A list of all the Event Nodes available in the Babylon.js Flow Graph
keywords: flow graph, interactivity
further-reading:
video-overview:
video-content:
---

# List

## Scene Events

### Scene Start

A node that is fired when a scene is started.

### Scene Tick

A node that fires every time a frame is executed.

## Mesh Events

### Mesh Pick

A node that is fired every time a specific mesh is picked. The mesh is defined through a variable name, which is passed to the constructor.

```javascript
// we have a flow graph named graph and a context named context
// ...
context.setVariable("meshToPick", mesh);
//...
const meshPick = new BABYLON.FlowGraphMeshPickNode({meshVariableName: "meshToPick"});
// add node to graph
```

## Custom Events

### Receive Custom Event

A node that is activated whenever a custom event is sent.
