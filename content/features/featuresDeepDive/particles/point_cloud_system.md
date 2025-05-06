---
title: Point Cloud System
image: 
description: Learn all about the point cloud system in Babylon.js.
keywords: diving deeper, point cloud, point cloud system
further-reading:
video-overview:
video-content:
---

# Points Cloud System

A points cloud particle system (PCS) is a single updatable mesh with the `PointsCloud` property of its material set to `true`. The point particles are simply the vertices of the mesh. As a mesh a PCS has most of the properties of a mesh, The exceptions are those related to its material which is already set and cannot be changed and also anything related to its vertex normals and indices as it does not have any set.

<img src="/img/how_to/Particles/points4.jpg"/>

Particles can be added to a PCS with a function or using an existing mesh as a model, where particles are randomly evenly distributed on either the surface of the model or inside the model.

As a particle system the PCS provides some methods to manage the particles, such as setting position, color and updating and recycling
