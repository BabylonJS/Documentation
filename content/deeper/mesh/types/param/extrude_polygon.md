# Extruded Non Regular Polygon

**Please note that ExtrudePolygon uses Earcut, so, in non playground projects, you will have to add a reference to their [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or download their [npm package](https://github.com/mapbox/earcut#install)**

You must set at least the _shape_ and _depth_ options.

Example :
```javascript
var polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", {shape: myShape, depth: 2, faceUV: myUVs}, scene);
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to turn **REQUIRED** |
depth|_(number)_  the depth of the extrusion **REQUIRED** |
faceColors|_(Color4[])_ array of 3 _Color4_, one per box face|Color4(1, 1, 1, 1) for each side
faceUV|_(Vector4[])_ array of 3 _Vector4_, one per box face| UVs(0, 0, 1, 1) for each side
wrap|_(boolean)_ maps texture to sides with faceUV[1] when false texture mapped to each individual side, when true wrapped over all sides |false
holes|_(Vector3[])_  array of holes, each hole being an array of successive Vector3 | [] 
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

All vectors for shape and holes are Vector3 and should be in the XoZ plane, ie of the form BABYLON.Vector3(x, 0, z) and in counter clockwise order;

* [Playground Example of Extruded Polygon](https://playground.babylonjs.com/#4G18GY#7)
* [Playground Example of Extruded Polygons using faceUV one with wrap one without](https://www.babylonjs-playground.com/#D3943E#1)

Uses [PolygonMeshBuilder](/How_To/polygonmeshbuilder)

## Mesh
```javascript
var polygon = BABYLON.Mesh.ExtrudePolygon("polygon", [V1, V2, ..., Vn], 2, scene, [[V1, V2, ..., Vn], [V1, V2, ..., Vn], ....[V1, V2, ..., Vn]], false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, polygon shape as an array of comma-separated vectors, depth, scene, optional holes as an array of an array of comma-separated vectors, optional updatable and the optional side orientation. The last three parameters can be omitted if you just need the default behavior :

NOTE all vectors are Vector3 and should be in the XoZ plane, ie of the form BABYLON.Vector3(x, 0, z) and in counter clockwise order;

```javascript
var polygon = BABYLON.Mesh.CreatePolygon("polygon", [V1, V2, ..., Vn], 2, scene);
```