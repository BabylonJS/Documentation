# Custom Extruded Shapes
A custom extruded shape replaces the _rotation_ and _scale_ options with _rotationFunction_ or _scaleFunction_. These allow you to vary the rotation and scale of the mesh as it extrudes by defining them in terms of a path index or a distance along the path. Since the custom extrusion is based on the Babylon.js ribbon there are two options, *ribbonClosePath* which closes the profile shape and *ribbonCloseArray*, which closes the extrusion path array.

On creation the local origin of a ribbon is coincident with the world origin. It is not possible to give a position relative to the constructed shape as this depends on the data sets used.


## MeshBuilder
Usage :
```javascript
const options = {
    shape: myPoints, //vec3 array with z = 0,
    path: myPath, //vec3 array
    rotationFunction: rotFn,
    scaleFunction: scaleFn,
    updatable: true
}

let extruded = BABYLON.MeshBuilder.ExtrudeShapeCustom("ext", options, scene);  //scene is optional and defaults to the current scene

// Update
options.shape = newShape;
options.path = newPath;
options.instance = extruded;
options.rotationFunction = newRotFn;
options.scaleFunction = newScaleFn;
extruded = BABYLON.MeshBuilder.ExtrudeShapeCustom("ext", options); //No scene parameter when using instance
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to extrude **REQUIRED**|
path|_(Vector3[])_  array of Vector3, the extrusion axis **REQUIRED** |
scaleFunction|_( function(i, distance) )_  a function returning a scale value from _(i, distance)_ parameters|{return 1;}
rotationFunction|_( function(i, distance) )_  a function returning a rotation value from _(i, distance)_ parameters|{return 0;}
ribbonClosePath|_(boolean)_ the underlying ribbon _closePath_ parameter value|false
ribbonCloseArray|_(boolean)_ the underlying ribbon _closeArray_ parameter value|false
cap|_(number)_ extrusion cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of an extruded shape to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

  
You must set at least the _shape_ and _path_ options. On update, you must set the _shape_, _path_ and _instance_ options and you can set the _rotationFunction_ or _scaleFunction_ options.

 The _scaleFunction_  and _rotationFunction_ are called on each path point and require two parameters, _index_ and _distance_.  

* index refers to the path point position in the path array 
* distance is the current point distance from the beginning of the path. 


### Examples
non updatable extrusion https://www.babylonjs-playground.com/#ZMKN5T#1  
update of extrusion scaleFunction and rotation Function https://www.babylonjs-playground.com/#ZMKN5T#2  
offset open profile shape path defined by trigonometry  https://www.babylonjs-playground.com/#ZMKN5T#3  
sine wave by alternately scaling positive/negative https://www.babylonjs-playground.com/#ZMKN5T#4  
example of constant scale and rotation evolving with the distance https://www.babylonjs-playground.com/#ZMKN5T#5  
non-linear rotation function https://www.babylonjs-playground.com/#ZMKN5T#6   

offset open profile shape : https://www.babylonjs-playground.com/#RF9W9#20    
open extrusion path : https://www.babylonjs-playground.com/#RF9W9#21   
Extrusion with constant scale 1 and no rotation : https://www.babylonjs-playground.com/#RF9W9#43  
 _ribbonCloseArray_ to true :https://www.babylonjs-playground.com/#RF9W9#44  
 _ribbonClosePath_ to true instead : https://www.babylonjs-playground.com/#RF9W9#45  
Both true : https://www.babylonjs-playground.com/#RF9W9#46  
  
generate strange shapes : https://www.babylonjs-playground.com/#RF9W9#47 

## Mesh
Usage: 
```javascript
let extrusion = BABYLON.Mesh.ExtrudeShapeCustom("extrusion", shape, path, scaleFunction, rotateFunction, ribbonCloseArray, ribbonClosePath, cap, scene);
let extrusion = BABYLON.Mesh.ExtrudeShapeCustom("extrusion", shape, path, scaleFunction, rotateFunction, ribbonCloseArray, ribbonClosePath, cap, scene, updatable, sideOrientation, instance); //optional parameters after scene

// fixed unit scale and zero rotation
let extrusion = BABYLON.Mesh.ExtrudeShapeCustom("extrusion", shape, path, () => {return 1}, () => {return 0}, ribbonCloseArray, ribbonClosePath, cap, scene);
```
