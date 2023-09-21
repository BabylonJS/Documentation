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

The Flow Graph is a new system which started construction after Babylon 6.0 and is intended to be a new and powerful way of driving interactive experiences in Babylon.js by connecting node primitives, similar of how Node Material (todo: add link) and Node Geometry (todo: add link) work. The basic unit of a Flow Graph is...

This is a basic example of a Flow Graph that logs a message to the console when a mesh is clicked:

...[code example]

Flow Graphs start execution when an **Event Node** is triggered. There are many kinds of Event Nodes, which can be configured accordingly. The other types of nodes are **Execution Nodes**, which are responsible for setting state, control flow, playing animations and sound, etc..., and **Data Nodes**, which perform different operations on data when requested by Execution Nodes. Data is requested through **DataConnections**, while triggering execution occurs through **Signal Connections**. Data Connections are typed, differently from Node Material and Node Geometry, so it's easier to know the expected type of data through code itself. 

Each Flow Graph contains one or more **contexts**, which represent the actual execution state of a graph. Having the capacity of handling multiple contexts allows the same behavior, such as a door opening when a switch is pressed, to be reused across different scene objects. This reuse can be accomplished by setting different **variables** on each context.

Different Flow Graphs can also communicate with each other by sending and receiving **custom events**.

...[code example]

The Flow Graph format allows for parsing and serializing files in the gLTF format by utilizing their Interactivity Extension.

The available nodes and their functions are documented in: ...
