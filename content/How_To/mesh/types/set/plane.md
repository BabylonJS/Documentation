# Plane
## MeshBuilder
A flat surface parallel to XoY plane.

Example :
```javascript
var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 5, size:5, tileSize:1}, scene);
```

option|value|default value
--------|-----|-------------
size|_(number)_ side size of the plane|1
width|_(number)_ size of the width|size
height|_(number)_ size of the height|size
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
sourcePlane|_(Plane)_ source plane (math) the mesh will be transformed to|null
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 

* [Playground Example of a DOUBLESIDE Plane](https://www.babylonjs-playground.com/#LXZPJK#1)

## Mesh
```javascript
var plane = BABYLON.Mesh.CreatePlane("plane", 10.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, size, and scene to attach the mesh, updatable? (if the mesh must be modified later) and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var plane = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);
```