---
title: Frame Graph
image:
description: Learn all about the Babylon.js Frame Graph system.
keywords: diving deeper, frame graph, rendering, node editor
---

## The Babylon.js Frame Graph System

The [Frame Graph](/features/featuresDeepDive/frameGraph/frameGraphBasicConcepts) system is a powerful tool for creating and configuring the different rendering passes used during the course of a frame.

It is a modular system, which allows you to create autonomous and efficient rendering modules, which improves extensibility thanks to decoupled and composable modules.

Frame graphs simplify and optimize resource management: by reusing textures, you can potentially save tons of GPU memory, depending on the complexity of your graph!

Frame graphs also allow you to do things that were not previously possible with our fixed rendering loop.

Thanks to the new visual editor [Node Render Graph Editor](https://nrge.babylonjs.com/) (NRGE), it is very easy for anyone to visually create the layout of a frame, without any programming!
