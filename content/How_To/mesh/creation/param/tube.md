---
title: Creating Tubes
image: 
description: Learn how to create tubes in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, parametric shapes, tubes
further-reading:
video-overview:
video-content:
---

## Tube
A tube is much as you would expect it to be, a surface with  hollow length.  
On creation the local origin of a tube is coincident with the world origin. It is not possible to give a position relative to the constructed shape as this depends on the data sets used.

## MeshBuilder
Usage :
```javascript
const options = {
    path: myPath, //vec3 array,
    updatable: true
}

let tube = BABYLON.MeshBuilder.CreateTube("tube", options, scene);  //scene is optional and defaults to the current scene

// Update
options.path[0].x +=6; 
options.instance = tube;
tube = BABYLON.MeshBuilder.CreateTubes("tube", options); //No scene parameter when using instance
```

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3, the path of the tube **REQUIRED** |
radius|_(number)_  the radius of the tube|1
tessellation|_(number)_  the number of radial segments|64
radiusFunction|_( function(index, distance) )_  a function returning a radius value from _(index, distance)_ parameters|null
cap|_(number)_ tube cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
arc|_(number)_ ratio of the tube circumference between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of a tube to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false  

You must set at least the _path_ option.
On update, you must set the _path_ and _instance_ options and you may also set the _radius_, _radiusFunction_ or _arc_ options.

### Examples
non updatable tube: <Playground id="#WW0ALQ" title="Create a Non Updatable Tube" description="Simple example of creating non updatable tubes."/>
updatable tube: <Playground id="#WW0ALQ#1" title="Create an Updatable Tube" description="Simple example of creating an updatable tube."/>
spiral tube: <Playground id="#WW0ALQ#2" title="Create a Spiral Tube" description="Simple example of creating a spiral tube."/>

When using the radiusFunction it must return a number. Its parameter refer to a path index or a distance along the path. 

distance example: <Playground id="#WW0ALQ#3" title="Create a Tube With Radius Function 1" description="Simple example of creating a tube using the radiusFunction distance."/>
index example: <Playground id="#WW0ALQ#4" title="Create a Tube With Radius Function 2" description="Simple example of creating a tube using the radiusFunction index."/>
with circular path and changing radius: <Playground id="#WW0ALQ#5" title="Create a Tube With Radius Function 3" description="Simple example of creating a tube with a circular path and changing radius."/>

## Mesh
usage: 
```javascript
let tube = BABYLON.Mesh.CreateTube("tube", path, radius, tesselation, optional radiusFunction, cap, scene);
let tube = BABYLON.Mesh.CreateTube("tube", path, radius, tesselation, optional radiusFunction, cap, scene, updatable, sideOrientation, instance); //optional parameters after scene
```
