---
title: Crowd Navigation System
image:
description: This system allows you to create primitive AI crowd agents that follow a path along a specific mesh.
keywords: extensions, babylon.js, crowd
further-reading:
video-overview:
video-content:
---

![Generated Navmesh ](/img/extensions/navigation/NavMeshGeneration.webp)

A Navigation Mesh (or navmesh for short) is a surface topology describing the space where an agent can go based on constraints.
Based on parameters such as agent radius, climbing capability, and height, navmesh generation computes a topology from source meshes (the world geometry).
Then, this topology can be displayed for debugging (the blue mesh in the screenshot above) to validate the parameters.

A demo can be found at: <Playground id="#HFY257#4" title="Crowd Navigation Demo" description="Simple example showcasing the crowd agent and nav mesh systems."/>
