---
title: Lathe
image: 
description: Learn how to use the lathe operation in Babylon.js.
keywords: diving deeper, meshes, parametric shapes, lathe
further-reading:
video-overview:
video-content:
---

## Lathe
A lathed shape is created by defining a shape profile using Vector3 coordinates in the xy plane. The shape profile is rotated around the y axis to form the lathed shape. It is recommended that all x values are positive. You must set at least the _shape_ option.

On creation, the local origin of a lathed shape is coincident with the world origin. It is not possible to give a position relative to the constructed shape, as this depends on the data sets used.

There is no _instance_ option for lathed shapes.

## MeshBuilder
Usage :
```javascript
const lathe = BABYLON.MeshBuilder.CreateLathe("lathe", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to turn **REQUIRED** |
radius|_(number)_  the radius value of the lathe|1
tessellation|_(number)_  the number of iterations around the lathe|64
arc|_(number)_ ratio of the circumference between 0 and 1|1
cap|_(number)_ tube cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
closed|_(boolean)_ to open/close the lathe circumference, should be set to `false` when used with `arc`|true
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

The radius value is a multiplier for the x values in the profile shape Vector3s.

### Examples
Lathed shape: <Playground id="#PQ0GIE" title="Lathed Shape Example" description="Simple example of a lathed shape."/>
Hexagonal nut: <Playground id="#PQ0GIE#1" title="Lathed Hexagonal Nut" description="Simple example of a lathed hexagonal nut."/>  
Arc: <Playground id="#PQ0GIE#2" title="Lathed Arc" description="Simple example of a lathed arc."/>


## Mesh
Usage:
```javascript
let lathe = BABYLON.Mesh.CreateLathe("lathe", shape, radius, tessellation, scene);
let lathe = BABYLON.Mesh.CreateLathe("lathe", shape, radius, tessellation, scene, updatable, sideOrientation); //optional parameters after scene
```
Note the limited parameters for this method.