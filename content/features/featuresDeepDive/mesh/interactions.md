---
title: Interactions
image: 
description: Learn how interactions work in Babylon.js.
keywords: diving deeper, meshes, interactions
further-reading:
video-overview:
video-content:
---

## Interactions
Possibly the most important interactions are user interactions, such as picking a mesh in the scene. These can be achieved with scene observables.

You also often need to find whether two meshes are intersecting, or determine the position of a mesh relative to another mesh, a camera, or a point in space. In Babylon.js, these can be achieved using *intersectsMesh* for two meshes, and *Ray* and *intersect* for ray casting.