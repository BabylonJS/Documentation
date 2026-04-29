---
title: Flow Graph
image:
description: Learn all about the Babylon.js Flow Graph system.
keywords: diving deeper, flow graph, interactive scenes, action editor
---

## The Babylon.js Flow Graph System

The [Flow Graph](/features/featuresDeepDive/flowGraph/flowGraphBasicConcepts) system is a powerful tool for creating interactive scenes in Babylon.js. It allows developers to create complex interactions and behaviors without writing extensive code, making it accessible to both programmers and non-programmers alike.
The Flow Graph system is designed to be intuitive and user-friendly, with a visual interface that allows users to create and manipulate blocks representing different actions and events. This makes it easy to create complex interactions by simply connecting blocks together.
The Flow Graph system is particularly useful for creating interactive experiences in games, simulations, and other applications where user interaction is a key component. It allows developers to create dynamic and responsive environments that can adapt to user input in real-time.

A flow graph becomes much easier to author when it has a corresponding visual editor. Babylon.js now includes a dedicated [Flow Graph Editor](/toolsAndResources/flowGraphEditor) that lets you create, test, validate, and debug graphs visually.

Under the hood, the flow graph is being used when glTF with interactivity is loaded. The glTF interactivity graph is converted to a Babylon flow graph, which is then executed when the user interacts with the scene.

If you want to understand the runtime model, continue with the sections below. If you want to build graphs through a visual tool, start with the [Flow Graph Editor documentation](/toolsAndResources/flowGraphEditor).
