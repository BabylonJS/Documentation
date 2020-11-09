---
title: Creating Dashed Lines
image: 
description: Learn how to create dashed lines in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, parametric shapes, dashed lines
further-reading:
video-overview:
video-content:
---

## Dashed Lines
Creates a contiguous series of dashed line segments from a list of points. You must set at least the _points_ option. On update, you must set the _points_ and _instance_ options properties and you should not change . Any other option will not be changed.
## MeshBuilder
Usage:
```javascript
const options = {
    points: myPoints, //vec3 array,
    updatable: true
}

let dashedlines = BABYLON.MeshBuilder.CreateDashedLines("dashedlines", options, scene);  //scene is optional and defaults to the current scene

// Update
options.points[0].x +=6; 
options.instance = lines;
lines = BABYLON.MeshBuilder.CreateDashedLines("dashedlines", options); //No scene parameter when using instance
```

option|value|default value
--------|-----|-------------
points|_(Vector3[])_  array of Vector3, the path of the line **REQUIRED** |
dashSize|_(number)_  size of the dashes|3
gapSize|_(number)_  size of the gaps|1
dashNb|_(number)_  intended number of dashes|200
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line mesh to be updated|null

The actual length of the dashes and gaps is determined by how many are set by the *dashNb* and then the ratio, of *dashSize* and * gapSize* rather than the actual size 
All of the following will produce equal sized dashes and gaps.
```javascript
dashSize = 1;
gapSize = 1;

dashSize = 1000;
gapSize = 1000;

dashSize = 876;
gapSize = dashSize;
```
### Examples
non updatable default dashed lines: <Playground id="#TYF5GH#1" title="Create Non Updatable Default Dashed Lines" description="Simple example of creating non updatable default dashed lines." image=""/> 
non updatable dashed lines set options: <Playground id="#TYF5GH#2" title="Create Non Updatable Dashed Lines With Options" description="Simple example of creating non updatable dashed lines with options." image=""/>
non updatable 'closed' dashed lines: <Playground id="#TYF5GH#3" title="Create Non Updatable Closed Dashed Lines" description="Simple example of creating non updatable closed dashed lines." image=""/>
updatable example: <Playground id="#TYF5GH#4" title="Create Updatable Closed Dashed Lines" description="Simple example of creating updatable closed dashed lines." image=""/>

Dashed lines are colored with a color property rather than a material.

```javascript
dashedlines.color = new BABYLON.Color3(1, 0, 0);
```

Colored Dashed Lines: <Playground id="#TYF5GH#5" title="Create Colored Dashed Lines" description="Simple example of creating colored dashed lines." image=""/>

## Mesh
Usage:
```javascript
const dashedlines = BABYLON.Mesh.CreateDashedLines("dashedLines", vector3 array, dashSize, gapSize, dashNb, scene);
const dashedlines = BABYLON.Mesh.CreateDashedLines("dashedLines", vector3 array, dashSize, gapSize, dashNb, scene, updatable, instance); //optional parameters after scene
```