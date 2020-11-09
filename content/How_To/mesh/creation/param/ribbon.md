---
title: Creating Ribbons
image: 
description: Learn how to create ribbons in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, parametric shapes, ribbons
further-reading:
video-overview:
video-content:
---

## Ribbon
The ribbon is a very versatile shape. Picture a ribbon in the real world with parallel wires running down its length. You can turn such a ribbon into a wide variety of shapes. Joining one long edge to its opposite you could form a tube and bend that into different shapes. This and more is possible with a Babylon.js ribbon. Instead of parallel wires a Babylon.js ribbon is formed from paths defined by an array of vector3s and how you define the paths determines the final shape. 

On creation the local origin of a ribbon is coincident with the world origin. It is not possible to give a position relative to the constructed shape as this depends on the data sets used.

## MeshBuilder
Usage :
```javascript
const options = {
    pathArray: myPaths, //[vector3 array, vector3 array, vector3 array......]
    updatable: true
}

let ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", options, scene); //scene is optional and defaults to the current scene

options.pathArray: myNewPaths; //The length must equal the length of myPaths and myNewPaths[i].length === myPaths[i] for all i
options.instance = true;

// updates the existing instance of ribbon : no need for the parameter scene
ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: myNewPath, instance: ribbon});
```

option|value|default value
--------|-----|-------------
pathArray|_(Vector3[][])_  array of array of Vector3, the array of paths **REQUIRED**
closeArray|_(boolean)_  to force the ribbon to join its last and first paths|false
closePath|_(boolean)_  to force each ribbon path to join its last and first points|false
offset|_(number)_  used if the pathArray has one path only|half the path length
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of a ribbon to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

### Examples

Update of a ribbon: <Playground id="#F6JW5W#5" title="Updating a Ribbon" description="Simple example of updating a ribbon." image=""/>

double sided ribbon not updatable: <Playground id="#F6JW5W#6" title="Create a Non Updatable Double Sided Ribbon" description="Simple example of creating a non updatable double sided ribbon." image=""/>
double sided ribbon not updatable path lines in red: <Playground id="#F6JW5W#7" title="Create a Non Updatable Double Sided Ribbon With Red Path Lines" description="Simple example of creating a non updatable double sided ribbon with red path lines." image=""/>  
open ribbon: <Playground id="#F6JW5W#8" title="Create An Open Ribbon" description="Simple example of creating an open ribbon." image=""/>
with closePath true: <Playground id="#F6JW5W#9" title="Create a Ribbon with closePath = True" description="Simple example of creating a ribbon with closePath set to true." image=""/> 
with closeArray true: <Playground id="#F6JW5W#10 " title="Create a Ribbon with closeArray = True" description="Simple example of creating a ribbon with closeArray set to true." image=""/> 


## Mesh
Usage: 
```javascript
const ribbon = BABYLON.Mesh.CreateRibbon("ribbon", pathArray, closeArray, closePath, offset, scene);
const ribbon = BABYLON.Mesh.CreateRibbon("ribbon", pathArray, closeArray, closePath, offset, scene, updatable, sideOrientation, instance); //optional parameters after scene
```

More about ribbons on the next page