---
title: Creating A Torus Knot
image: 
description: Learn how to create a torus knot in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, set shapes, standard shapes, torus knot
further-reading:
video-overview:
video-content:
---

## Torus Knot
A torus knot is a continuous shape that twists and turns around the surface of a torus. The number of twists and turns are determined by two windings integers p and q. The simplest knotted knot is with 2 and 3 for p and q. The origin of the created torus knot is at the center of the underlying torus.

## MeshBuilder
Example :
```javascript
const torus = BABYLON.MeshBuilder.CreateTorusKnot("torusKnot", options, scene);
```

option|value|default value
--------|-----|-------------
radius|_(number)_ radius of the torus knot|2
tube|_(number)_ thickness of its tube|0.5
radialSegments|_(number)_ number of radial segments|32
tubularSegments|_(number)_ number of tubular segments|32
p|_(number)_ number of windings|2
q|_(number)_ number of windings|3
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 

### Examples
Simplest: <Playground id="#SVU8U9#1" title="Create a Simple Torus Knot" description="Simple example of creating a simple torus knot." image=""/> 
Low p and q: <Playground id="#SVU8U9#2" title="Create a Torus Knot With Low P And Q" description="Simple example of creating a simple torus knot with low P And Q." image=""/>
High p and q: <Playground id="#SVU8U9#3" title="Create a Torus Knot With High P And Q" description="Simple example of creating a simple torus knot with high P And Q." image=""/>
Breaking the rules - using high non integer P and q: <Playground id="#SVU8U9#4" title="Create a Torus Knot With High non integer P And Q" description="Simple example of creating a simple torus knot with high non integer P And Q." image=""/>

## Mesh
```javascript
const knot = BABYLON.Mesh.CreateTorusKnot("knot", radius, tube, radialSegments, tubularSegments, p, q, scene);
const knot = BABYLON.Mesh.CreateTorusKnot("knot", radius, tube, radialSegments, tubularSegments, p, q, scene, updatable, sideOrientation); //optional parameters after scene
```

