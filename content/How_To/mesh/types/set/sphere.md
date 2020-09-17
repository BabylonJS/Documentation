# Sphere
## MeshBuilder
Different values for _diameterX_, _diameterY_ and diameterZ_ lead to an ellipsoid.
Example :
```javascript
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, diameterX: 3}, scene);
```

option|value|default value
--------|-----|-------------
segments|_(number)_ number of horizontal segments|32
diameter|_(number)_ diameter of the sphere|1
diameterX|_(number)_ diameter on X axis, overwrites _diameter_ option|diameter
diameterY|_(number)_ diameter on Y axis, overwrites _diameter_ option|diameter
diameterZ|_(number)_ diameter on Z axis, overwrites _diameter_ option|diameter
arc|_(number)_ ratio of the circumference (latitude) between 0 and 1|1
slice|_(number)_ ratio of the height (longitude) between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0, 0, 1,1)
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0, 0, 1,1) 

* [Playground Example of a Sphere](https://www.babylonjs-playground.com/#K6M44R#2)

## Mesh
```javascript
var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene, false,  BABYLON.Mesh.DEFAULTSIDE);
```
Parameters are: name, number of segments (highly detailed or not), size, scene to attach the mesh, updatable? (if the mesh must be modified later) and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);
```
Beware to adapt the number of segments to the size of your mesh ;)