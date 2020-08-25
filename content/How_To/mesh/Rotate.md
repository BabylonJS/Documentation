# How To Use Translations and Rotations

All [positioning, rotating and scaling](/features/Position,_Rotation,_Scaling) take place within a frame of reference determined by the [world matrix](/resources/Frame_Of_Reference). 

## Frames of Reference 

In Babylon.js two frames of reference are used **world space** using **world axes** and **local space** using **local axes**. [Position](/babylon101/position#position) uses the **world space**  and [addRotation](#add-rotations) uses the **local space**. 

Unlike [rotation](/babylon101/position#rotation) which determines the order of rotations and sets the mesh at the given angles [rotate](#rotate) allows you to set the order of rotations, adds the angle to the current rotation and the frame of reference to use.

Unlike [position](/babylon101/position#position) which sets the mesh to the values give [translate](#translate) moves the mesh in the given direction by the distance give and frame of reference used.

For _translate_ and _rotate_ the space used is handled by the `BABYLON.Space.WORLD` and `BABYLON.Space.LOCAL` constants respectively. 

Unless [reset](/features/Position,_Rotation,_Scaling#change-of-origin), the center of transformation is at the local origin of the mesh at the time of its creation.

## The Pilot

![The Pilot](/img/how_to/Mesh/pilot.jpg)
The Pilot

This asymmetric mesh will be used in the playgrounds to illustrate translations and rotations along with local and world axes, both of which have a red X axis, a green Y axis and a blue Z axis. The local axes are smaller.

## Rotate

The general form for _rotate_ is

```javascript
mesh.rotate(axis, angle, frame of reference)
```
where axis is a vector giving the axis of rotation, angle is in radians and frame of reference is either `BABYLON.Space.WORLD` or `BABYLON.Space.LOCAL`

The constants `BABYLON.Axis.X`, `BABYLON.Axis.Y` and BABYLON.Axis.Z` may be used as an axis.

For example

```javascript
mesh.rotate(BABYLON.Axis.X, Math.PI/4, BABYLON.Space.WORLD);
mesh.rotate(BABYLON.Axis.Y, 3 * Math.PI/2, BABYLON.Space.WORLD);
mesh.rotate(BABYLON.Axis.Z, 0.025, BABYLON.Space.WORLD);
mesh.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.LOCAL);
mesh.rotate(BABYLON.Axis.Y, 0.01, BABYLON.Space.LOCAL);
mesh.rotate(BABYLON.Axis.Z, 1.45, BABYLON.Space.LOCAL);
```

In the following playground shows a rotation of &pi;/4 first about the Y world axis then about the X world axis. You can have a go at changing WORLD to LOCAL for one or both and changing the order of X and Y to see what happens.

* [Playground Animation - Rotate about Two Axes](https://www.babylonjs-playground.com/#Z3W74Y#1)

You do not have to use the X, Y and Z axes. Any vector will determine an axis.

One way to determine an axis is to choose where on a sphere the axis would pass through. The corrdinates of that point will give the axis vector. 

For example the Earth tilts about 23 degrees from the vertical which gives a point on the surface with coordinates (sin(23 * &pi;/180), cos(23 * &pi;/180), 0). To rotate about this angle use

```javascript
earth.rotate(new BABYLON.Vector3(Math.sin(23 * Math.PI/180), Math.cos(23 * Math.PI/180), 0), angle, BABYLON.Space.WORLD);
```

* [Playground Animation - Earth Rotate](https://www.babylonjs-playground.com/#TLIAXS)

The following playground shows the difference between using rotate with **world space** and **local space**. An axis is defined as (2, 0.2, 0) in yellow in world space and white in local space. To see the affect two pilots are first rotated about the Y axis so that their local axes are no longer in alignment. The purple one is rotated about the given axis in **world space** and the orange one in **local space**.

[Playgound Animation - World and Local Different](https://www.babylonjs-playground.com/#LLNE9E#1)

**Note:**  `mesh.rotate()` generates a new [quaternion](/resources/Rotation_Conventions#quaternions) and then uses `mesh.rotationQuaternion` while `mesh.rotation` is set to (0, 0, 0).  

## Translate

If the mesh has not been rotated then using translate in the **world space** or the **local space** makes no difference. Once rotated the local axes will also be rotated and their direction will be used in **local space**.

To translate a mesh a vector, distance and space need to be specified. The vector is the direction of translation, the distance * vector length gives how far to move in the given direction.  
Use mesh.translate(vector, distance, space) to move the mesh in either the world or local space.  
It is often useful for the vector to be a unit vector so the distance moved is precisely the distance given.

```javascript
//BABYLON.Axis.Y is already a unit vector. 
//As world space is specified the mesh will move a distance of 2 from its current position in the direction (0, 1, 0).
mesh.translate(BABYLON.Axis.Y, 2, BABYLON.Space.WORLD);

//Given vector has length sqrt(14). 
//As local space is specified the mesh will move a distance sqrt(14)*3 from its current position in direction (-1, 3, -2)
mesh.translate(new BABYLON.Vector3(-1, 3, -2), 3, BABYLON.Space.LOCAL);

//Since the vector is normalized and local space is specified 
//the mesh will move a distance 6 from its current position in direction (3, 5, -2)
var direction = new BABYLON.Vector3(3, 5, -2);
direction.normalize(); // direction now a unit vector
pilot.translate(direction, 6, BABYLON.Space.LOCAL);
```

* [Playground Animation - Translate No Rotation](https://www.babylonjs-playground.com/#1ZMJQV#39)
* [Playground Animation - Translate After Rotation](https://www.babylonjs-playground.com/#1ZMJQV#40)
* [Playground Example - Translate-Rotate and Rotate-Translate](https://www.babylonjs-playground.com/#1ZMJQV#41)


## Add Rotations

[Rotation](/babylon101/position#rotation) imposes the rotation order YXZ in **local space** using [Euler angles](/resources/Rotation_Conventions). This constraint can quickly make it complicated to calculate the required Euler angles to achieve a given final mesh orientation. This is especially so since rotations aren't commutative operations. This means that rotating a mesh first around X, then around Z will lead to a different orientation than rotating it first around Z and then around X with the same values.  

As an example if you create a mesh and rotate it &pi;/3 about the X axis, then rotate it &pi;/4 about the local Y axis the Euler angles needed to use with _rotation_ are  
x: 0.6590580358264089, y: 1.1071487177940904, z: 0.8860771237926136

Checking the console in the following playground will give you these value. The leftmost mesh is the start position, the middle after using rotation with Euler Angles x: &pi;/3, y: &pi;/4, z: 0 and the right most after applying the rotations in order &pi;/3 about the X axis, about the local Y axis.


* [Playground Example - Rotation and addRotation](https://www.babylonjs-playground.com/#HPKH80)

This playground uses a method from [101 addRotation](/babylon101/position#sequencing-rotations) to add a rotation to any current rotation.

The general form is 

```javascript
mesh.addRotation(alpha, beta, gamma)`.  
```

This adds the rotation given by the Euler angles x: alpha, Y: beta, z: gamma in the order YXZ around the **local axes** to any existing rotation. However since it is much easier to think in terms of one angle around one axis in order two of the angles should be set to 0.

The intended use is that starting from an unrotated mesh or one that has been rotated with Euler angles or by a quaternion _addRotation_ can be applied as many times as you want. When you call it, it will accumulate the passed rotation values onto the mesh.  
This means you can decompose your whole rotation in several steps to be done in your own order, not necesseraly the imposed YXZ one, to achieve your final wanted orientation.   

```javascript
mesh.rotation.x = Math.PI / 4;        // initial rotation around x
mesh.addRotation(0, Math.PI / 3, 0);  // the mesh is first rotated around X, then only around Y for PI/3
```

```javascript
// you can even link all the rotation steps
// here X first, then Z, finally Y
mesh.addRotation(Math.PI / 2, 0, 0).addRotation(0, 0, Math.PI / 4).addRotation(0, Math.PI / 6, 0);
```

**Note:** The use of _addRotation_ with ONLY _rotation_ does not set the mesh's _rotationQuaternion_ value which stays as undefined and it is the Euler angles for _rotation_ that are updated. When _rotate_ is used or the _rotationQuaternion_ set directly then _addRotation_ will accumlate on the _rotationQuaternion_ value.


## How To Generate a Rotation from a Target System 

### Using Euler Angles
Given a quaternion it is possible to find the [Euler angles](/resources/Rotation_Conventions). Sometimes however all you might know is a set of axes you want to align to. There is a feature of Babylon.js that allows you to [align axes](/features/Position,_Rotation,_Scaling#align-axes) by finding the particular rotation you need. 

The way to compute an Euler rotation from a set of axes is to use _RotationFromAxis_.

```javascript
var orientation = BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3);
mesh.rotation = orientation;
```

In the following playgrounds the stationary purple plane and red, green and blue axes show how the view changes as the camera moves. The red and green spheres are fixed relative to these axes. The 2D plane with an arrow drawn on it has a length the same as the distance between the red and green spheres. 

In the initialising playground the arrow plane is also stationary.

* [Playground Example - Initialising](https://www.babylonjs-playground.com/#VYM1E#32)

The requirement is for the arrow plane to rotate such that 

* one of its orthogonal axes that lies on the plane is along the line joining the two spheres;
* the axis normal to the plane is along the line joining the middle of the arrow to the camera 

keeping its third axis, which lies on the plane, perpendicular to the camera lens.

In this way the camera always faces the arrow plane as can be seen in the next playground.

* [Playground Example - Aligning Axes](https://www.babylonjs-playground.com/#VYM1E#32) 

This is achieved by forming axis 1 to join the spheres

```javascript
axis1 = (sphere1.position).subtract(sphere2.position);
axis3 = BABYLON.Vector3.Cross(camera.position, axis1);
axis2 = BABYLON.Vector3.Cross(axis3, axis1);  
``` 
axis 3 to be perpendicular axis 1 and to the axis through the camera position and axis 2 from the camera to the arrow plane.

The mesh is rotated to face the camera using

```javascript
mesh.rotation = BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3);
```

The `toRef()` method is also available.

```javascript
BABYLON.Vector3.RotationFromAxisToRef(axis1, axis2, axis3, mesh.rotation);
```

### Using Quaternions 
If you prefer using quaternions instead of Euler angles, then `RotationQuaternionFromAxis()` computes the required rotation value (Quaternion) to assign to the mesh property `.rotationQuaternion` in order to rotate it along the passed axes.

The `toRef()` method is also available.
 
`Quaternion.RotationQuaternionFromAxis()`  
`Quaternion.RotationQuaternionFromAxisToRef()`  

# Further Reading
 
## Basic - L1  
[Positions, rotations, scaling 101](/babylon101/Position)  
 
## More Advanced - L3

[How To Use Translations and Rotations](/How_To/Rotate)  
[How To Set and Use a Pivot](/How_To/Pivots)  
[How To Rotate Around an Axis About a Point](/How_To/Pivot)  
[How To Use Path3D](/How_To/How_to_use_Path3D)  
[How To Use a Parent](/How_To/Parenting)  
[How To Transform Coordinates](/How_To/Transform_Coordinates)  
[Euler Angles and Quaternions](/resources/Rotation_Conventions)  
[Aligning Rotation to Target](/How_To/rotate#how-to-generate-a-rotation-from-a-target-system)  
[Frame of Reference](/resources/Frame_Of_Reference)  
[Baking Transformations](/resources/Baking_Transformations)  
[In-Browser Mesh Simplification (Auto-LOD)](/How_To/In-Browser_Mesh_Simplification)  

## Gamelet

[A Simple Car Following a Path](/samples/Car_Path)  
[Making A Simple Driven Car using Translate and Rotate](/samples/Car_Driven)


