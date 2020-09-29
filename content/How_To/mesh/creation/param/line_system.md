# Line System
MeshBuilder only. A system of non-contiguous lines that are independent of each other and may exist in their own space. You must set at least the _lines_ option. On update, you must set the _lines_ and _instance_ options. You can also update the _colors_ option if previously set at construction time.

## MeshBuilder 
Usage :
```javascript
// creates an instance of a line system
let lineSystem = BABYLON.MeshBuilder.CreateLineSystem("lineSystem", {lines: myArray}, scene);

// updates the existing instance of lineSystem : no need for the parameter scene here
lineSystem = BABYLON.MeshBuilder.CreateLineSystem("lineSystem", {lines: myArray, instance: lineSystem});
```

option|value|default value
--------|-----|-------------
lines|_(Vector3[])_  array of lines, each line being an array of successive Vector3 **REQUIRED**
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line system mesh to be updated|null
colors|_(Color4[])_ array of Color4, each point color|null
useVertexAlpha|_(boolean)_ false if the alpha blending is not required (faster)|true

Example of a Linesystem  https://www.babylonjs-playground.com/#Y7CS4N
Update of the Linesystem https://www.babylonjs-playground.com/#Y7CS4N#1

Unlike a mesh Lines are colored after creation with a color property rather than a material.
```javascript
linesystem.color = new BABYLON.Color3(1, 0, 0);
```
Colored Line System https://www.babylonjs-playground.com/#Y7CS4N#2

You can produce multi-colored lines by setting the colors for each point of each line before creation

https://www.babylonjs-playground.com/#Y7CS4N#3



