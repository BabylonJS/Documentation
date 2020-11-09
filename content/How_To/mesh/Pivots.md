---
title: Pivots
image: 
description: Learn about pivots in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, mesh transformation, transformation, pivots
further-reading:
    - title: How To Rotate Around an Axis about a Point
      url: /How_To/Pivot
video-overview:
video-content:
---

## A Pivot

The latest pivot in Babylon (v3.2+) is a pre-transformation pivot and behaves differently than in tools like 3DS Max and Maya as the object's position will move if scale is applied prior to setting the pivot. To get pivot behavior that matches these tools it is recommended to set the object as a child of another transform node that will act as the pivot see: https://www.babylonjs-playground.com/#GH4N1R#1

A pivot can be set with a [translation matrix](/how_to/pivots#how-to-set-the-pivot-matrix) or directly with the [_setPivotPoint_](/how_to/pivots#how-to-set-and-get-a-pivot-point) method.

A pivot in Babylon.js is the center of transformation for a mesh, that is the point used as the center of rotation or the center of enlargement. When a mesh is created the pivot (red sphere) is always at the local origin (yellow sphere) and the local origin always at the world origin, as in Fig 1. When the pivot and local origin are coincident they are shown as a red and yellow striped sphere.

![Initial Creation of The Box](/img/how_to/pivots/pivot1.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 1

When positioning a mesh it is the local origin that is placed at the given position, for example

```javascript
box.position.x = 2;
```
moves the box as in Fig 2

![Box Repositioned](/img/how_to/pivots/pivot2.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 2.

Now, mathematically, it is always more straight forward to rotate or enlarge about the local origin and any code to that does rotation and enlargement uses that principle.

When you want the pivot to be at a corner as in Fig 3 the way this is done is to translate the box corner to the local origin resulting as in Fig 4.

![Corner Pivot](/img/how_to/pivots/pivot3.png)       ![Box Translate](/img/how_to/pivots/pivot4.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 3.   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 4.

Since it is the box that is translated the values used in the translation will be negative with regard to position. For example given a cube with sides of length 2 to set the pivot at position (-1, -1, -1) requires a translation of (1, 1, 1).

Prior to Babylon.js v3.2 setting a pivot meant that the mesh was translated as in Fig 4 and the local origin of the mesh was reset to the pivot point. This meant that after setting a pivot when you reset the the position of the mesh it was the pivot that was placed at this position. Compare Fig 2 with Fig 5 which shows the result of setting a pivot with the move mesh method followed by

```javascript
box.position.x = 2;
```

![Box Repositioned after pivot added < 3.2](/img/how_to/pivots/pivot5.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 5.

From Babylon.js v3.2 there is a breaking change and setting the pivot no longer produces a change in position of the mesh unless the mesh has been scaled. 

![Box Repositioned after pivot added from 3.2](/img/how_to/pivots/pivot6.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 6.

Fig 6 shows result of using setting a pivot with this method followed by

```javascript
box.position.x = 2;
```
Compare this with Fig 5.

So there are two ways of setting a pivot, one that does not alter the position of the mesh (_set pivot only_) and one that does alter the mesh position (_set pivot with move_). The _set pivot only_ method is much more straightforward and all playground examples on this page use this method. The [_setPivotPoint_](/how_to/pivots#how-to-set-and-get-a-pivot-point) function, describe later, uses _set pivot only_. 

In fact unless you have an older project coded for versions before 3.2 or want to [change the local origin to that of the pivot](/features/Position,_Rotation,_Scaling#pivot) do not use the _set pivot with move_ method. It is usually better to _set pivot only_ and then move the mesh as normal with _mesh.position_ or _mesh.translate_ When you do have an older project there is a simple way to update your project code to work with version 3.2 or later as described in the `Breaking Change` section below.

 
## Breaking Change

You set a pivot at the point (x, y, z) with a translation matrix that using 

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z));
```
Before v3.2 this would result in the mesh being moved and the local origin of the mesh being reset to the pivot point.

From v3.2 this results in the pivot point being set without the mesh being moved and the current local origin of the mesh is kept. Should you want to maintain the older behaviour of moving the mesh a second parameter, `false` is needed

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z), false);
```

**STRESSED NOTE** For those of you who wrote code using a pivot for versions of Babylon.js before v3.2 and who want to update the version of Babylon.js to a current one should change each occurrence, in their project code,  of 

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z));
```
to
```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z), false);
```

## How To Set the Pivot Matrix

To set a pivot at (x, y, z) relative to the local origin of a mesh requires the applied translation to be (-x, -y, -z).

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(-x, -y, -z));
```
 * <Playground id="#3RTT8P" title="Set Pivot Matrix" description="Simple example of setting a pivot matrix." image=""/>


## How To Set Pivot Position to World Space Coordinates

When there is a mesh at position (xc, yc, zc) you want to set a pivot at (xp, yp, zp) then you need to use (xc - xp, yc - yp, zc - zp) as the translation.

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(xc - xp, yc - yp, zc - zp));
```

* <Playground id="#3RTT8P#2" title="Set Pivot With World Coordinates" description="Simple example of setting a pivot with world coordinates." image=""/>

## How To Reset the Pivot

Simply recalculate the translation of the pivot to the local origin of the mesh as above.

The following sequence of playgrounds goes from setting the first pivot position to scaling about the second pivot position

* <Playground id="#3RTT8P#3" title="Set First Pivot" description="Simple example of setting a first pivot." image=""/>
* <Playground id="#3RTT8P#11" title="Set Second Pivot" description="Simple example of setting a second pivot." image=""/>
* <Playground id="#3RTT8P#12" title="Scaling From Second Pivot" description="Simple example of scaling from a second pivot." image=""/>

**NOTE:** When a mesh has been rotated before resetting the pivot on resetting the pivot the mesh will move since the current rotation will be applied to the new pivot point.

The following sequence of playgrounds shows setting the first pivot, rotating around the pivot then resetting the pivot.

* <Playground id="#3RTT8P#3" title="Set First Pivot" description="Simple example of setting a first pivot." image=""/>
* <Playground id="#3RTT8P#6" title="Rotate About First Pivot" description="Simple example of rotating about a first pivot." image=""/>
* <Playground id="#3RTT8P#7" title="Set Second Pivot" description="Simple example of setting a second pivot." image=""/>

## How To Set and Get a Pivot Point

There are three useful functions to aid setting and getting a pivot point. These are

```javascript
mesh.setPivotPoint(Vector3);
mesh.getPivotPoint(); // returns Vector3
mesh.getAbsolutePivotPoint(); // returns Vector3
```
### Set Pivot Point

Using _setPivotPoint_ you simply pass a Vector3 object that is the relative position of the pivot to the local origin of the mesh. To set a pivot at (x, y, z) relative to the local origin of a mesh requires

```javascript
mesh.setPivotPoint(new BABYLON.Vector3(x, y, z));
```

* <Playground id="#3RTT8P#8" title="Set Pivot Point" description="Simple example of setting a pivot point." image=""/>

When there is a mesh at position (xc, yc, zc) you want to set a pivot at (xp, yp, zp) then the relative position is (xp - xc, yp - yc, zp - z) and use

```javascript
mesh.setPivotPoint(BABYLON.Vector3(xp - xc, yp - yc, zp - z));
```
* <Playground id="#3RTT8P#9" title="Set Pivot Point" description="Simple example of setting a pivot point." image=""/>

The following sequence of playgrounds goes from setting the first pivot point to scaling about the second pivot point

* <Playground id="#3RTT8P#10" title="Set First Pivot Point" description="Simple example of setting a first pivot point." image=""/>
* <Playground id="#3RTT8P#14" title="Set Second Pivot Point" description="Simple example of setting a second pivot point." image=""/>
* <Playground id="#3RTT8P#15" title="Scaling From Second Pivot Point" description="Simple example of scaling from a second pivot point." image=""/>

It is possible to reset the pivot point and maintain the position and rotation of the mesh.  

To do this the current rotation of the mesh has to be stored and then the mesh's rotation set to (0, 0, 0) before the pivot point is reset. The current rotation is then re-applied to the mesh.

The following sequence of playgrounds shows setting the first pivot point, rotating the pivot then resetting the pivot point and re-applying the rotation.

* <Playground id="#3RTT8P#10" title="Set First Pivot Point" description="Simple example of setting a first pivot point." image=""/>
* <Playground id="#3RTT8P#16" title="Rotate About First Pivot Point" description="Simple example of rotating about a first pivot point." image=""/>
* <Playground id="#3RTT8P#17" title="Set Second Pivot Point and Rotate" description="Simple example of setting a second pivot point and rotating." image=""/>

### Get Pivot Point 

When using `getPivotPoint` or `getAbsolutePivotPoint` the results obtained depend on whether you are using a _set pivot only_ method, that is `setPivotMatrix(translation)` or `setPivotPoint` or the _set pivot with move_ method, that is `setPivotMatrix(translation)`.

In both of the following cases the box has then been rotated through 90 degrees, positioned at (6, 1, 2) and the pivot has been set to world position (5, 0, 1) which is (-1, -1, -1) relative to the current position of the local origin of the box.  

**Set Pivot Only Method**

![Pivoted Box](/img/how_to/pivots/pivot7.png)

| Getter |&nbsp;Results&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Explanation |
|--------|--------------|----------|
| box.position| (6, 1, 2) | Position as set |
| box.getAbsolutePosition() | (6, 1, 0) | Position of box (yellow sphere) as seen, in world coordinates |
| box.getPivotPoint() | (-1, -1, -1) | Position of pivot (red sphere) relative to local origin of box, as set |
| box.getAbsolutePivotPoint() | (5, 0, 1)| Position of pivot as seen, in world coordinates |

**Set Pivot Only Method**

![Pivoted Box](/img/how_to/pivots/pivot8.png)

| Getter |&nbsp;Results&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Explanation |
|--------|--------------|----------|
| box.position| (6, 1, 2) | Position as set |
| box.getAbsolutePosition() | (7, 2, 1) | World coordinate position of the created origin of box (green sphere)|
| box.getPivotPoint() | (-1, -1, -1) | Position of pivot (red/yellow sphere) relative to the created origin of box |
| box.getAbsolutePivotPoint() | (6, 1, 2)| Position of pivot which is the same as the position of the box due to the change in the box's local origin  |

This table alone shows one good reason not to use the _set pivot with move_ method unless for amending old projects.