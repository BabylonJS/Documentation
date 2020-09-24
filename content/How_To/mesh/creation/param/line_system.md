# Line System
## MeshBuilder 
A system of non-contiguous lines that are independent of each other and may exist in their own space. MeshBuilder only.
You must set at least the _lines_ option.
On update, you must set the _lines_ and _instance_ options. You can also set the _colors_ option if previously set at construction time.  

Example :
```javascript
// creates an instance of a line system
var lineSystem = BABYLON.MeshBuilder.CreateLineSystem("lineSystem", {lines: myArray}, scene);

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

[A Playground Example of a Linesystem](https://www.babylonjs-playground.com/#165IV6#66)
[A Playground Update of the Linesystem](https://www.babylonjs-playground.com/#165IV6#10)

A line system can also be colored with a color property

```javascript
linesystem.color = new BABYLON.Color3(1, 0, 0);
```
* [Playground Example of Colored Line System](https://www.babylonjs-playground.com/#165IV6#80)

## Mesh
