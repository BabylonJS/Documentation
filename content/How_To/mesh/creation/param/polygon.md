# Non Regular Polygon
## MeshBuilder
**Please note that CreatePolygon uses Earcut, so, in non playground projects, you will have to add a reference to their [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or download their [npm package](https://github.com/mapbox/earcut#install)**

You must set at least the _shape_ option.

Example :
```javascript
var polygon = BABYLON.MeshBuilder.CreatePolygon("polygon", {shape: myShape, sideOrientation: BABYLON.Mesh.DOUBLESIDE, frontUVs: myFrontUVs, backUVs: myBackUVs}, scene);
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to turn **REQUIRED** |
holes|_(Vector3[])_  array of holes, each hole being an array of successive Vector3 | []
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 

All vectors for shape and holes are Vector3 and should be in the XoZ plane, ie of the form BABYLON.Vector3(x, 0, z) and in counter clockwise order;

[A Playground Example of a Polygon](https://playground.babylonjs.com/#4G18GY#6)

Uses [PolygonMeshBuilder](/How_To/polygonmeshbuilder)

## Mesh
```javascript
var polygon = BABYLON.Mesh.CreatePolygon("polygon", [V1, V2, ..., Vn], scene, [[V1, V2, ..., Vn], [V1, V2, ..., Vn], ....[V1, V2, ..., Vn]], false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, polygon shape as an array of comma-separated vectors,  scene, optional holes as an array of an array of comma-separated vectors, optional updatable and the optional side orientation. The last three parameters can be omitted if you just need the default behavior :

NOTE all vectors are Vector3 and should be in the XoZ plane, ie of the form BABYLON.Vector3(x, 0, z);

```javascript
var polygon = BABYLON.Mesh.CreatePolygon("cylinder", [V1, V2, ..., Vn], scene);
```
Uses [PolygonMeshBuilder](/How_To/polygonmeshbuilder)