---
title: Irregular Polygon Extrusion
image: 
description: Learn how extrude irregular polygons in Babylon.js.
keywords: diving deeper, meshes, parametric shapes, irregular extrusion
further-reading:
video-overview:
video-content:
---

## Extruded Non Regular Polygon
*ExtrudePolygon* adds a *depth* option to *CreatePolygon*. The extrusion is carried out down the vertical y axis from the polygon shape in the horizontal xz plane. Like *CreatePolygon* it requires an Earcut script. Since it can be concave it requires a procedure to fill the polygon with triangles and an Earcut method is used. Whilst an Earcut script is pre-loaded in the Playground you will have to add a reference to such a script in your own projects. One is available at [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or via a [npm package](https://github.com/mapbox/earcut#install).

On creation the local origin of the extruded polygon is coincident with the world origin. It is not possible to give a position relative to the extruded polygon as this depends on the data sets used.

*ExtrudePolygon* calls [PolygonMeshBuilder](/divingDeeper/mesh/creation/param/polyMeshBuilder). There is no *instance* option. You must set at least the _shape_ and _depth_ options. 

## MeshBuilder
Usage :
```javascript
const extrudedPolygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to turn **REQUIRED** |
depth|_(number)_  the depth of the extrusion **REQUIRED** |
faceColors|_(Color4[])_ array of 3 _Color4_, one per box face|Color4(1, 1, 1, 1) for each side
faceUV|_(Vector4[])_ array of 3 _Vector4_, one per box face| UVs(0, 0, 1, 1) for each side
wrap|_(boolean)_ maps texture to sides with faceUV[1] when false texture mapped to each individual side, when true wrapped over all sides |false
holes|_(Vector3[][])_  array of holes, each hole being an array of successive Vector3 | [] 
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

All vectors for shape and holes are Vector3 and should be in the xz plane, ie of the form BABYLON.Vector3(x, 0, z) and in **counter clockwise** order;

## Examples
Extruded Polygon: <Playground id="#KIEYA6" title="Extruding Irregular Polygons" description="Simple example of extruding irregular polygons."/>
Extruded Polygons using faceUV, one with wrap, one without: <Playground id="#KIEYA6#1" title="Extruding Irregular Polygons Advanced" description="Simple example of extruding irregular polygons."/>


## Mesh
```javascript
let polygon = BABYLON.Mesh.CreatePolygon("polygon", shape, depth, scene);
let polygon = BABYLON.Mesh.CreatePolygon("polygon", shape, depth, scene, holes, updatable, sideOrientation); //optional parameters after scene
```