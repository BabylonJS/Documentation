---
title: Custom Extrusion
image:
description: Learn how custom extrusion works in Babylon.js.
keywords: diving deeper, meshes, parametric shapes, custom extrusion
further-reading:
video-overview:
video-content:
---

## Custom Extruded Shapes

A custom extruded shape replaces the _rotation_ and _scale_ options with _rotationFunction_ or _scaleFunction_. These allow you to vary the rotation and scale of the mesh as it extrudes by defining them in terms of a path index or a distance along the path.

On creation the local origin of a ribbon is coincident with the world origin. It is not possible to give a position relative to the constructed shape as this depends on the data sets used.

## MeshBuilder

Usage :

```javascript
const options = {
  shape: myPoints, //vec3 array with z = 0,
  path: myPath, //vec3 array
  rotationFunction: rotFn,
  scaleFunction: scaleFn,
  updatable: true,
};

let extruded = BABYLON.MeshBuilder.ExtrudeShapeCustom("ext", options, scene); //scene is optional and defaults to the current scene

// Update
options.shape = newShape;
options.path = newPath;
options.instance = extruded;
options.rotationFunction = newRotFn;
options.scaleFunction = newScaleFn;
extruded = BABYLON.MeshBuilder.ExtrudeShapeCustom("ext", options); //No scene parameter when using instance
```

| option           | value                                                                                               | default value     |
| ---------------- | --------------------------------------------------------------------------------------------------- | ----------------- |
| shape            | _(Vector3[])_ array of Vector3, the shape you want to extrude **REQUIRED**                          |                   |
| path             | _(Vector3[])_ array of Vector3, the extrusion axis **REQUIRED**                                     |                   |
| scaleFunction    | _( function(i, distance) )_ a function returning a scale value from _(i, distance)_ parameters      | \{return 1;\}     |
| rotationFunction | _( function(i, distance) )_ a function returning a rotation value from _(i, distance)_ parameters   | \{return 0;\}     |
| closeShape       | _(boolean)_ closes the shape, replaces `ribbonClosePath`                                            | false             |
| closePath        | _(boolean)_ closes the path, replaces `ribbonCloseArray`                                            | false             |
| ribbonClosePath  | _(boolean)_ the underlying ribbon _closePath_ parameter value **depreceated**                       | false             |
| ribbonCloseArray | _(boolean)_ the underlying ribbon _closeArray_ parameter value **depreceated**                      | false             |
| cap              | _(number)_ extrusion cap : NO_CAP, CAP_START, CAP_END, CAP_ALL                                      | NO_CAP            |
| updatable        | _(boolean)_ true if the mesh is updatable                                                           | false             |
| sideOrientation  | _(number)_ side orientation                                                                         | DEFAULTSIDE       |
| frontUVs         | _(Vector4)_ **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option**                      | Vector4(0,0, 1,1) |
| backUVs          | _(Vector4)_ **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option**                      | Vector4(0,0, 1,1) |
| instance         | _(LineMesh)_ an instance of an extruded shape to be updated                                         | null              |
| invertUV         | _(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°) | false             |

You must set at least the _shape_ and _path_ options. On update, you must set the _shape_, _path_ and _instance_ options and you can set the _rotationFunction_ or _scaleFunction_ options.

The _scaleFunction_ and _rotationFunction_ are called on each path point and require two parameters, _index_ and _distance_.

- index refers to the path point position in the path array
- distance is the current point distance from the beginning of the path.

### Examples

<Playground id="#ZMKN5T#111" title="Closed Shape Extrusion" description="Closed shape extrusion."/>

closed shape extrusion

<Playground id="#ZMKN5T#112" title="Updatable Extrusion" description="Updatable extrusion."/>

update of extrusion scaleFunction and rotation Function

 <Playground id="#ZMKN5T#3" title="Offset Using Trigonometry" description="Offset open profile shape path defined by trigonometry."/>

offset open profile shape path defined by trigonometry

<Playground id="#ZMKN5T#4" title="Sine Wave" description="Sine wave by alternately scaling positive/negative."/>

sine wave by alternately scaling positive/negative

<Playground id="#ZMKN5T#5" title="Rotation Evolving With The Distance" description="Rrotation evolving with the distance."/>

scale constant and rotation changing with the distance

<Playground id="#ZMKN5T#6" title="Non-Linear Rotation Function" description="Non-linear rotation function."/>

non-linear rotation function

<Playground id="#RF9W9#20" title="Offset Open Profile Shape" description="Simple example of offset open profile shape."/>

offset open profile shape

<Playground id="#RF9W9#21" title="Open Extrusion path" description="Simple example of open extrusion path."/>

open extrusion path

<Playground id="#RF9W9#43" title="Extrusion With Constant Scale" description="Simple example of extrusion with constant scale 1 and no rotation."/>

Extrusion with constant scale 1 and no rotation

<Playground id="#ZMKN5T#113" title="Custom Extrusion With path closed" description="Simple example of custom extrusion with path closed."/>

`closePath` set to true

<Playground id="#ZMKN5T#114" title="Custom Extrusion With shape closed" description="Simple example of custom extrusion with shape closed."/>

`closeShape` set to true

<Playground id="#ZMKN5T#115" title="Closed Shape and Path" description="Closed shape and path."/>

closeShape and closePath both set to true

<Playground id="#ZMKN5T#116" title="Strange Shapes With Custom Extrusion" description="Generating some strange shapes with custom extrusion."/>

generate strange shapes

## Mesh

Usage:

```javascript
let extrusion = BABYLON.Mesh.ExtrudeShapeCustom("extrusion", shape, path, scaleFunction, rotateFunction, ribbonCloseArray, ribbonClosePath, cap, scene);
let extrusion = BABYLON.Mesh.ExtrudeShapeCustom("extrusion", shape, path, scaleFunction, rotateFunction, ribbonCloseArray, ribbonClosePath, cap, scene, updatable, sideOrientation, instance); //optional parameters after scene

// fixed unit scale and zero rotation
let extrusion = BABYLON.Mesh.ExtrudeShapeCustom(
  "extrusion",
  shape,
  path,
  () => {
    return 1;
  },
  () => {
    return 0;
  },
  ribbonCloseArray,
  ribbonClosePath,
  cap,
  scene,
);
```
