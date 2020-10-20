# Extruded Shape
An extruded shape is created by defining a shape profile using vector3 coordinates in the xy plane and providing a path along which the profile will be extruded. You must set at least the _shape_ and _path_ options. On update, you must set the _shape_, _path_ and _instance_ options and you can set the _scale_ and _rotation_ options.

On creation the local origin of an extrusion is coincident with the world origin. It is not possible to give a position relative to the constructed shape as this depends on the data sets used.

The profile shape's local origin is (0, 0, 0) relative to its defining coordinates and it is the local origin that runs along the path during the extrusion.

When you need the appearance of a solid shape then there is an option to cap the ends. The caps are drawn by creating triangles from the Barycenter of the shape profile to the profile vertices, so that there are profile shapes that cause caps to not correctly fit the profile shape. In this case you can used CreatePolygon for the caps, however you do need to position and rotate these caps in addition to creating them.

When you need sharp mitred corners there is a utility function available [Extruded Shape with Mitred Corners](toolsAndResources/utilities/Mitred)

## MeshBuilder
Usage :
```javascript
const options = {
    shape: myPoints, //vec3 array with z = 0,
    path: myPath, //vec3 array
    updatable: true
}

let extruded = BABYLON.MeshBuilder.ExtrudeShape("ext", options, scene);  //scene is optional and defaults to the current scene

// Update
options.shape = newShape;
options.path = newPath;
options.instance = extruded;
extruded = BABYLON.MeshBuilder.ExtrudeShape("ext", options); //No scene parameter when using instance
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to extrude **REQUIRED** |
path|_(Vector3[])_  array of Vector3, the extrusion axis **REQUIRED** |
scale|_(number)_  the value to scale the shape|1
rotation|_(number)_  the value to rotate the shape each step along the path|0
cap|_(number)_ extrusion cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of an extruded shape to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

### Examples
non updatable extrusion https://www.babylonjs-playground.com/#MR8LEL#2  
update of extrusion including, shape, path, scale and rotation https://www.babylonjs-playground.com/#MR8LEL#3  
extrusion with open shape https://www.babylonjs-playground.com/#MR8LEL#4  

spiral extrusion with straight path and rotation set https://www.babylonjs-playground.com/#MR8LEL#5  

capped extrusion https://www.babylonjs-playground.com/#MR8LEL#6  
profile that does not cap correctly https://www.babylonjs-playground.com/#MR8LEL#7


## Mesh
Usage:
```javascript
let extrusion = BABYLON.Mesh.ExtrudeShape(name, shape, path, scale, rotation, cap, scene);
let extrusion = BABYLON.Mesh.ExtrudeShape(name, shape, path, scale, rotation, cap, scene, updatable, sideOrientation, instance); //optional parameters after scene
```
