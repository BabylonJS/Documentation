---
title: Creating A Torus
image: 
description: Learn how to create a torus in Babylon.js.
keywords: diving deeper, meshes, set shapes, standard shapes, torus
further-reading:
video-overview:
video-content:
---

## Torus
The created torus (doughnut shape) has its origin at the center of the torus. You can control its diameter and the thickness of its circular body.

## MeshBuilder
Example :
```javascript
const torus = BABYLON.MeshBuilder.CreateTorus("torus", options, scene);
```

option|value|default value
--------|-----|-------------
diameter|_(number)_ diameter of the torus|1
thickness|_(number)_ thickness of its tube|0.5
tessellation|_(number)_ number of segments along the circle|16
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 

### Examples
Thick: <Playground id="#IJGMXZ#1" title="Create a Thick Torus" description="Simple example of creating a thick torus."/>
Thin: <Playground id="#IJGMXZ#2" title="Create a Thin Torus" description="Simple example of creating a thin torus."/>

## Mesh
## Usage
```javascript
const torus = BABYLON.Mesh.CreateTorus("torus", {diameter, thickness, tessellation, updatable, sideOrientation}, scene);
```
