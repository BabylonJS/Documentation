---
title: Pivots
image:
description: Learn about pivots in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, pivots
further-reading:
  - title: How To Rotate Around an Axis about a Point
    url: /features/featuresDeepDive/mesh/transforms/parent_pivot/pivot
video-overview:
video-content:
---

## A Pivot

A pivot in Babylon.js is an alternative method to using a [parent](/features/featuresDeepDive/mesh/transforms/parent_pivot/parent) to set the center of transformation for a mesh, that is the point used as the center of rotation or the center of enlargement. Using _setPivotPoint_ produces different behavior than setting a pivot point in tools such as 3DS Max and Maya and a parent should be used instead to produce a closer match to the behavior of these applications.

On this page the demonstration mesh is a cube with side length 1. When a mesh is created the pivot (red sphere) is always at the _local origin_ (yellow sphere); the _local origin_ and _created origin_ are at the world space origin of (0, 0, 0). When the pivot and _local origin_ are coincident they are shown as a red and yellow striped sphere, as in Fig 1.

![Initial Creation of The Box](/img/how_to/pivots/pivot1.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 1 Cube with side length 2

To rotate or scale a mesh about a pivot point you apply the rotation or scaling vectors to the mesh. This is different to using a parent to rotate or scale a mesh.

The most straightforward way to set a pivot is to do it directly with the [_setPivotPoint_](/features/featuresDeepDive/mesh/transforms/parent_pivot/pivots#how-to-set-and-get-a-pivot-point) method. A pivot can also be set with a [translation matrix](/features/featuresDeepDive/mesh/transforms/parent_pivot/pivots#how-to-set-the-pivot-matrix).

## Set and Get a Pivot Point Directly

There are three useful functions to aid setting and getting a pivot point. These are

```javascript
mesh.setPivotPoint(Vector3);
mesh.getPivotPoint(); // returns Vector3
mesh.getAbsolutePivotPoint(); // returns Vector3
```

### Set Pivot Point

Using _setPivotPoint_ you simply pass a Vector3 object that is the **relative position** of the pivot to the _local origin_ of the mesh. To set a pivot at (x, y, z) relative to the _local origin_ of a mesh requires

```javascript
mesh.setPivotPoint(new BABYLON.Vector3(x, y, z));
```

For the cube of side 2 to set the pivot at the front, left, bottom corner use

```javascript
box.setPivotPoint(new BABYLON.Vector3(-1, -1, -1));
```

![Set pivot](/img/how_to/pivots/pivot9.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 2 Cube with side length 2 pivot at (-1, -1, -1)

<Playground id="#T6IN6X" title="Set Pivot Point Exp. 1" description="Setting a pivot point at front, left, bottom corner of a cube."/>
<Playground id="#T6IN6X#1" title="Set Pivot Point Exp. 2" description="Setting a pivot point at front, left, bottom corner of a displaced cube."/>

### Set Pivot Point To A World Space Position

To set the pivot at a point given in **world space** it is necessary to find the relative position of this point to the mesh _local origin_. When there is a mesh at position (xc, yc, zc) you want to set a pivot at world space point (xp, yp, zp) then the relative position is (xp - xc, yp - yc, zp - z) and use

```javascript
mesh.setPivotPoint(BABYLON.Vector3(xp - xc, yp - yc, zp - z));
```

To set the pivot of the cube at world space point (1, 1, 1)

```javascript
const pivotAt = new BABYLON.Vector3(1, 1, 1);
const relativePosition = pivotAt.subtract(box.position);
box.setPivotPoint(relativePosition);
```

<Playground id="#T6IN6X#3" title="Set Pivot Point" description="Setting a pivot point in world space."/>

### Set Pivoted Mesh To A World Space Position

After a rotation or a scaling of a mesh with a pivot set the world space position of the mesh will not be the same as its position stored in _mesh.position_.

The blue sphere is at (5, 0, 0). When the yellow sphere(_local origin_) and the blue sphere coincide then a yellow and blue sphere is shown.

![positioned mesh](/img/how_to/pivots/pivot10.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 3 Pivoted Cube at (5, 0, 0)

![positioned and rotated mesh](/img/how_to/pivots/pivot11.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 4 Pivoted Cube Rotated

In Fig 3 and Fig 4 the value for `box.position` will be (5, 0, 0).  
However in Fig 4 the actual world space position of the _local origin_ is (-5.41421365737915, 0, -1). You can obtain the world space position using `box.getAbsolutePosition()`.

In a similar way the _local origin_ of a pivoted mesh will be displaced after scaling.

The simplest way to position a pivoted mesh in world space following rotation or scaling is to use the difference between `mesh.position` and `mesh.getAbsolutePosition`. For example to position a pivoted mesh at (x, y, z) in world space use

```javascript
mesh.position = new BABYLON.Vector3(x, y, z);
mesh.position = mesh.position.add(mesh.position.subtract(mesh.getAbsolutePosition()));
```

<Playground id="#T6IN6X#4" title="Set Pivot Mesh Position" description="Setting the position of a pivot mesh in world space."/>

### Get Pivot Point

After using `setPivotPoint` then `getPivotPoint` will give you the relative position of the pivot point to the _local origin_ and `getAbsolutePivotPoint` its position in world space.

## How To Set the Pivot using a Matrix

This is achieved using

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(Vector3));
```

To set a pivot at the point (x, y, z) with a translation matrix using

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z));
```

Note the change of sign.

<Playground id="#T6IN6X#5" title="Set Pivot Point by Matrix" description="Setting a pivot point at front, left, bottom corner of a displaced cube."/>

### Breaking Change

From Babylon.js v3.2 this method produces the same results as using `setPivotPoint`.

Before v3.2 this would result in the mesh being moved and the local origin of the mesh being reset to the pivot point. Should you want to maintain the older behaviour of moving the mesh a second parameter, `false` is needed

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z), false);
```

**STRESSED NOTE** For those of you who wrote code using a pivot for versions of Babylon.js before v3.2 and who want to update the version of Babylon.js to a current one should change each occurrence, in their project code, of

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z));
```

to

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z), false);
```

### How To Set Pivot Position to World Space Coordinates

When there is a mesh at position (xc, yc, zc) you want to set a pivot at (xp, yp, zp) then you need to use (xc - xp, yc - yp, zc - zp) as the translation.

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(xc - xp, yc - yp, zc - zp));
```

To set the pivot of the cube at world space point (1, 1, 1)

```javascript
const pivotAt = new BABYLON.Vector3(1, 1, 1);
const translation = box.position.subtract(pivotAt);
box.setPivotMatrix(BABYLON.Matrix.Translation(translation.x, translation.y, translation.z));
```

<Playground id="#T6IN6X#6" title="Set Pivot Point by Matrix" description="Setting a pivot point in world space."/>
