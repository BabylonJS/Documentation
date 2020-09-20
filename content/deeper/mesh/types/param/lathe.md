# Lathe
## MeshBuilder
Mesh Builder Only. You must set at least the _shape_ option.

Example :
```javascript
var lathe = BABYLON.MeshBuilder.CreateLathe("lathe", {shape: myShape}, scene);
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to turn **REQUIRED** |
radius|_(number)_  the value to radius of the lathe|1
tessellation|_(number)_  the number of iteration around the lathe|64
arc|_(number)_ ratio of the circumference between 0 and 1|1
cap|_(number)_ tube cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
closed|_(boolean)_ to open/close the lathe circumference, should be set to `false` when used with `arc`|true
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

* [Playground Example of a Lathe](https://www.babylonjs-playground.com/#165IV6#72)
* [Playground Update of the Lathe](https://www.babylonjs-playground.com/#165IV6#73)