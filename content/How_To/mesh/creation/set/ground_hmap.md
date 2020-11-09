---
title: Creating Ground From a Height Map
image: 
description: Learn how to create ground from a height map in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, set shapes, standard shapes, ground, height map
further-reading:
video-overview:
video-content:
---

## Ground From a Height Map
When the ground is created using *groundFromHeightMap* the surface of the ground can be perturbed by a grayscale image file called a height map. Lighter areas are displayed higher than darker areas. This is a way of creating hills and valleys on your ground.

## MeshBuilder
Usage:
```javascript
const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", url_to_height_map, options, scene); //scene is optional and defaults to the current scene 
```

option|value|default value
--------|-----|-------------
width|_(number)_ size of the map width|10
height|_(number)_ size of the map height|10
subdivisions|_(number)_ number of map subdivisions|1
minHeight|_(number)_ minimum altitude|0
maxHeight|_(number)_ maximum altitude|1
onReady|_(function)_ a callback js function that is called and passed the just built mesh|(mesh) => {return;}
updatable|_(boolean)_ true if the mesh is updatable|false

### Examples
The following image is used for the height map in the first examples

![height map](/img/how_to/HeightMap/heightMap.png)  
Low subdivisions: <Playground id="#LQ4LI1" title="Create Ground From A HeightMap - Low Subdivisions" description="Simple example of creating ground from a heightmap with low subdivision." image=""/>
High subdivisions: <Playground id="#LQ4LI1#1" title="Create Ground From A HeightMap - High Subdivisions" description="Simple example of creating ground from a heightmap with high subdivision." image=""/>

Flat world: <Playground id="#LQ4LI1#3" title="Create Ground From A HeightMap" description="Simple example of creating ground from a heightmap." image=""/>

## Mesh
Usage :
```javascript
var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", heightMapPath, width, height, subdivisions, minHeight, maxHeight, scene, updatable, onReadyCallback);
```