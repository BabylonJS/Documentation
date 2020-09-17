# Dashed Lines
## MeshBuilder
Creates a contiguous series of dashed line segments from a list of points.
You must set at least the _points_ option.
On update, you must set the _points_ and _instance_ options. Any other option will not be changed.

Example :
```javascript
// creates an instance of dashedlines
var dashedLines = BABYLON.MeshBuilder.CreateDashedLines("dl", {points: myArray}, scene);

// updates the existing instance of dashedLines : no need for the parameter scene here
dashedLines = BABYLON.MeshBuilder.CreateDashedLines("dl", {points: myArray, instance: dashedLines});
```

option|value|default value
--------|-----|-------------
points|_(Vector3[])_  array of Vector3, the path of the line **REQUIRED** |
dashSize|_(number)_  size of the dashes|3
gapSize|_(number)_  size of the gaps|1
dashNb|_(number)_  intended number of dashes|200
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line mesh to be updated|null

[A Playground Example of Dashed Lines](https://www.babylonjs-playground.com/#165IV6#76)
[A Playground Update of Dashed Lines](https://www.babylonjs-playground.com/#165IV6#77)

Dashed lines are colored with a color property

```javascript
lines.color = new BABYLON.Color3(1, 0, 0);
```
* [Playground Example of Colored Dashed Lines](https://www.babylonjs-playground.com/#165IV6#79)

## Mesh
```javascript
var dashedlines = BABYLON.Mesh.CreateDashedLines("dashedLines", [v1, v2, ... vn], dashSize, gapSize, dashNb, scene);
```
Parameters are : name, [array of Vectors3], dashSize, gapSize, dashNumber, scene.    
As for Lines, a line along the vectors3 will be displayed in space. It will try to set _dashNumber_ strokes on this line depending on the length of each segment between two successive vectors3.    
_dashSize_ and _gapSize_ are relative to each other dash and gap sizes within these strokes. 