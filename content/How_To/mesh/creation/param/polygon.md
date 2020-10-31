# Non Regular Polygon
A polygon of any type, regular or irregular, convex or concave, is created in the horizontal xz plane. Since it can be concave it requires a procedure to fill the polygon with triangles and an Earcut method is needed. Whilst an Earcut script is pre-loaded in the Playground you will have to add a reference to such a script in your own projects. One is available at [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or via a [npm package](https://github.com/mapbox/earcut#install).

On creation the local origin of the polygon is coincident with the world origin. It is not possible to give a position relative to the polygon as this depends on the data sets used.

*CreatePolygon* calls [PolygonMeshBuilder](/How_To/polygonmeshbuilder). There is no *instance* option. You must set at least the _shape_ option. 

# MeshBuilder
Usage :
```javascript
const polygon = BABYLON.MeshBuilder.CreatePolygon("polygon", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to build **REQUIRED** |
holes|_(Vector3[][])_  array of holes, each hole being an array of successive Vector3 | []
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 

All vectors for shape and holes are Vector3 and should be in the xz plane, ie of the form BABYLON.Vector3(x, 0, z) and in **counter clockwise** order. You just list all the vertices of the polygon and *CreatePolygon* closes the shape.

## Example
polygon with holes https://www.babylonjs-playground.com/#ZD60FU


# Mesh
```javascript
let polygon = BABYLON.Mesh.CreatePolygon("polygon", shape, scene);
let polygon = BABYLON.Mesh.CreatePolygon("polygon", shape, scene, holes, updatable, sideOrientation); //optional parameters after scene
```
