# Ribbon
## MeshBuilder
You must set at least the _pathArray_ option.
On update, you must set the _pathArray_ and _instance_ options.

Example :
```javascript
// creates an instance
var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: myPaths}, scene);

// updates the existing instance of ribbon : no need for the parameter scene
ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: myPaths, instance: ribbon});
```

option|value|default value
--------|-----|-------------
pathArray|_(Vector3[][])_  array of array of Vector3, the array of paths **REQUIRED**
closeArray|_(boolean)_  to force the ribbon to join its last and first paths|false
closePath|_(boolean)_  to force each ribbon path to join its last and first points|false
offset|_(number)_  used if the pathArray has one path only|half the path length
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of a ribbon to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

[A Playground Example of a Ribbon](https://www.babylonjs-playground.com/#165IV6#65)
[A Playground Update of the Ribbon](https://www.babylonjs-playground.com/#165IV6#13)

## Mesh
 
For details on what it is and how it is constructed you might want to read the [Ribbon Tutorial](/How_To/Ribbon_Tutorial)

```javascript
var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", [path1, path2, ..., pathn], false, false, 0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, pathArray, closeArray, closePath, offset, scene, updatable? (if the mesh must be modified later)  and the optional side orientation (see below).


  * name : a string, the name you want to give to your shape,
  * pathArray : an array populated with paths. Paths are also arrays, populated with series of successive _Vector3_. You need at least one path to construct a ribbon and each path must contain at least four _Vector3_,
  * closeArray : boolean, if true an extra set of triangles is constructed between the last path and the first path of _pathArray_,
  * closePath : boolean, if true the last point of each path of _pathArray_ is joined to the first point of this path,
  * offset : integer (default half the _path_ size) mandatory only if the _pathArray_ contents only one path. The ribbon will be constructed joining each i-th point of the single path to the i+offset-th point. It is ignored if _pathArray_ has more than one path,
  * scene : the current scene object,
  * updatable : boolean, if the ribbon should allow updating later,
  * sideOrientation : the wanted side-orientation (BABYLON.Mesh.FRONTSIDE / BACKSIDE / DOUBLESIDE / DEFAULT).

The last two parameters can be omitted if you just need the default behavior :
```javascript
var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", [path1, path2, ..., pathn], false, false, 0, scene);
```