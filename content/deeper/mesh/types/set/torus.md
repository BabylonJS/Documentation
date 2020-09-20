# Torus
## MeshBuilder
Example :
```javascript
var torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.2}, scene);
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

* [Playground Example Using Thickness to Create a Hoop and a Donut](https://www.babylonjs-playground.com/#A7SVB6)

## Mesh
```javascript
var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```
Parameters are: name, diameter, thickness, tessellation (highly detailed or not), scene, updatable and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene);