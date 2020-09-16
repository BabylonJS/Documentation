# Box Mesh
## MeshBuilder.
Example :
```javascript
var box = BABYLON.MeshBuilder.CreateBox("box", option, scene);
```

option property|value|default value
--------|-----|------------
size|_(number)_ size of each box side|1
height|_(number)_ height size, overwrites _size_ option|size
width|_(number)_ width size, overwrites _size_ option|size
depth|_(number)_ depth size,  overwrites _size_ option|size
faceColors|_(Color4[])_ array of 6 _Color4_, one per box face|Color4(1, 1, 1, 1) for each side
faceUV|_(Vector4[])_ array of 6 _Vector4_, one per box face| UVs(0, 0, 1, 1) for each side
wrap|_(boolean)_ ( BJS 4.0 or >) when true all vertical sides (0, 1, 2, 3) will apply image textures upright | false
topBaseAt|_(number)_ (BJS 4.0 or >) base of top touches side given 0, 1, 2, 3| 1
bottomBaseAt|_(number)_ (BJS 4.0 or >) base of bottom touches side given 0, 1, 2, 3| 0
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 

* [Cuboid](https://www.babylonjs-playground.com/#6XIT28) 
* [Face Numbers](https://www.babylonjs-playground.com/#6XIT28#1)

## Mesh.
Example
```javascript
var box = BABYLON.Mesh.CreateBox("box", size, scene, updatable, sideOrientation);
```
It is only possible to create a cube with this method, for a cuboid you need to use scaling.

