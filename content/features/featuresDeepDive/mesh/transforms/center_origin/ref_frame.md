---
title: Introduction To Coordinate Transformation
image:
description: Learn all about coordinate transformation in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, coordinate transform
further-reading:
video-overview:
video-content:
---

## Transformations

## Introduction to Coordinate Transformation

The first step in understanding coordinate transformation Babylon.js is to understand how the data describing a mesh is stored. The positions of each vertex is kept in an array of coordinates in the local space of the mesh. Each transformation applied to the mesh is stored in a matrix called the _World Matrix_. For each rendered frame the current _World Matrix_ is used on the local space vertex data to obtain the world data for the mesh. Except for exceptional circumstance such as _baking a transformation_ or a user updating it, the mesh vertex data remains unchanged.

When you want one mesh, mesh*C, to locate in the frame of reference of another mesh, mesh_P, using coordinate transformation you use the the \_transformCoordinates* function to apply the _World Matrix_ of mesh_P to the required position.

For example take mesh_P to be a box, a cube of size 1. In the local space of the box the center of the top face is at (0, 0.5, 0). Move and rotate this box to a new position. We want mesh_C, a sphere, to be located at the center of the top face of the box at this position. To do this use

```javascript
const matrix = mesh_P.computeWorldMatrix(true); //true forces a recalculation rather than using cache version
const local_position = new BABYLON.Vector3(0, 0.5, ,0); //Required position of C in the local space of P
const global_position = BABYLON.Vector3.TransformCoordinates(local_position, matrix); //Obtain the required position of C in World Space
mesh_C.position = global_position;
```

Position sphere using TransformCoordinates: <Playground id="#TRAIXW" title="Position a Sphere Using Transform Coordinates" description="Simple example of positioning a sphere using transform coordinates."/>

To translate the sphere by the direction vector (1, 1, 1) for example you can add this to the current local position vector

```javascript
const matrix = mesh_P.computeWorldMatrix(true);
const local_position = new BABYLON.Vector3(0, 0.5, 0);
local_position.addInPlace(new BABYLON.Vector3(1, 1, 1));
const global_position = BABYLON.Vector3.TransformCoordinates(local_position, matrix);
mesh_C.position = global_position;
```

Translate sphere using TransformCoordinates: <Playground id="#TRAIXW#1" title="Translate a Sphere Using Transform Coordinates" description="Simple example of translating a sphere using transform coordinates."/>

More extensive examples follow
