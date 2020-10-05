# Position, Rotation and Scaling

The 101 course only considers the setting of a mesh's _position_, _rotation_, and _scaling_. [Further Reading](#further-reading) will show you a range of methods to translate and rotate a mesh by a given amount.

Whatever the methods used they require a frame of reference, a means to describe the position, rotation or scaling and something to help visualize the effects of applying these. The visualization will be helped by the **Pilot** a constructed asymmetric shape.

![The Pilot](/img/how_to/Mesh/pilot.jpg)

_The Pilot_

## Frames of Reference

There are two frames of reference that Babylon.js uses, the **world axes** and the **local axes**. The origin of the **world axes** never changes.

In all diagrams and playgrounds X axis is red, Y axis is Green and Z axis is blue. 

When meshes are created their center is placed at the origin of the **world axes** and their position is always placed relative to the **world axes**.

The **local axes** move with the mesh. The origin of **local axes** is always at the created center of the mesh whatever its position. The centers of rotation and enlargement for a mesh are at the origin of the **local axes**, however by using either a TransformNode or a matrix to set a [pivot point](/How_To/Pivots) they can be changed to that point.

## Vectors

All positions, rotations and scaling are given as 3 dimensional vectors using _new BABYLON.Vector3(x, y, z)_ and can be set separately.

## The Pilot

Following its creation the pilot's position is at the world origin with rotation zero for all axes and its scaling is one, both **world axes** and the pilot's **local axes** coincide.

![Creation of Pilot](/img/how_to/Mesh//pilot1.jpg)

## Position

Position places the pilot with reference to the **world axes** using a vector (x, y, z). The **local axes** move with the pilot.

```javascript
pilot.position = new BABYLON.Vector3(2, 3, 4);
```

or individual components

```javascript
pilot.position.x  =  2;
pilot.position.y  =  3;
pilot.position.z  =  4;
```

The local and world axes remain in the same orientation.

![pilot position](/img/babylon101/pilot1.jpg)

* [Playground Example for Position](https://www.babylonjs-playground.com/#UBWFJT#2)

## Rotation

WARNING: Rotating in 3D space is always tricky. The order in which rotations are applied to a shape changes the final orientation of the shape and you also need to know which frame of reference is being used. There are many varying conventions for applying rotations in 3D modelling. For more details on these conventions in Babylon.js see [Applying Rotations Convention BJS](/resources/rotation_conventions).

In Babylon.js rotations are set using

```javascript
 pilot.rotation = new BABYLON.Vector3(alpha, beta, gamma);
``` 
or

```javascript
pilot.rotation.x  =  alpha; //rotation around x axis
pilot.rotation.y  =  beta;  //rotation around y axis
pilot.rotation.z  =  gamma; //rotation around z axis
```
where alpha, beta, and gamma are angles measured in radians.

PAUSE FOR THOUGHT: Immediately, since three rotations are given about three different axes you need to ask  - "in which order are they applied about which frames of reference and in which direction?"

Either of the following two conventions can be considered as being used by rotation in Babylon.js since both lead to the same outcome.

### Convention 1 - **Local Axes**

For **local axes** using _rotation_ turns the mesh with the center of rotation at the origin of the **local axes** in the axes order y, x, z about the **local axes**. All rotations are anticlockwise when looking in the direction of the positive axis. 

The following sequence of images shows the initial starting position of the pilot followed by a rotation of &pi;/2 about the local y axis, then &pi;/2 about the local x axis and finally a rotation of &pi;/2 about the local z axis.

![Local Rotation](/img/babylon101/pilotL.jpg)

The smaller axes represent the direction of the **world axes**.

### Convention 2 - **World Axes**

Compared to convention 1 the center of rotation does not change but the axes of rotation do.

For **world axes** using _rotation_ turns the mesh with the centre of rotation at the origin of the **local axes** in the axes order z, x, y about axes parallel to the **world axes**. All rotations are anticlockwise when looking in the direction of the positive axis. 

The following sequence of images shows the initial starting position of the pilot followed by a rotation of &pi;/2 about the world z axis, then &pi;/2 about the world x axis and finally a rotation of &pi;/2 about the world y axis.

![World Rotation](/img/babylon101/pilotW.jpg)

* [Playground Example - Rotation](https://www.babylonjs-playground.com/#1ZMJQV#2) 

### Summary

For _rotation_ whichever way you think about it the results are always the same. All the following commands produce the same outcome:

```javascript
pilot.rotation = new BABYLON.Vector3(alpha, beta, gamma);

pilot.rotation.x  =  alpha;
pilot.rotation.y  =  beta;
pilot.rotation.z  =  gamma;

pilot.rotation.z  =  gamma;
pilot.rotation.x  =  alpha;
pilot.rotation.y  =  beta;

pilot.rotation.y  =  beta;
pilot.rotation.z  =  gamma;
pilot.rotation.x  =  alpha;
```

* [Playground Example - Positioned, Scaled, and Rotated Boxes](https://www.babylonjs-playground.com/#CURCZC)

## Sequencing Rotations

The question now is, what to do if you want a sequence of rotations that starts with one about the x axis, then about the y axis then about the z axis?

For **world axes** you use the [rotate method](/features/Position,_Rotation,_Scaling). For rotations about **local axes**, Babylon.js has both the _rotate_ method and _addRotation_ method. 

You can chain a sequence of rotations using the _addRotation_. This method provides for one rotation value about one axis a series of which can be applied from the first to the last as the following example shows.

```javascript 
mesh.addRotation(Math.PI/2, 0, 0).addRotation(0, Math.PI/2, 0).addRotation(0, 0, Math.PI/2);
```

The following sequence of images shows the result of adding the individual rotations one after the other for the above playground, starting with the initial position of the pilot followed by a rotation of &pi;/2 about the local x axis, then &pi;/2 about the local y axis and finally a rotation of &pi;/2 about the local z axis.

![Added Rotations](/img/babylon101/pilotA.jpg)

The smaller axes represent the direction of the **world axes**.

In general _mesh.addRotation(alpha, beta, gamma)_ needs at least two of _alpha, beta, gamma_ to be 0 where _alpha_ is a rotation about the local x axis, _beta_ about the local y axis and _gamma_ about the local z axis.

## RotationQuaternions
An alternative to _rotations are [_rotationQuaternions_](/resources/rotation_conventions#quaternions) though they can be tricky to use but can overcome some gimbal lock problems. Using both on a mesh is not possible see [warning](/resources/rotation_conventions#warning)

## Scaling

Scaling along the x, y, and z **local axes** is set using

```javascript
mesh.scaling = new BABYLON.Vector3(scale_x, scale_y, scale_z);
```
 or individually with

 ```javascript
 mesh.scaling.y = 5;
 ```

 The following image shows a unit cube rotated about the z axis and scaled along the local y axis.

 ![scaled](/img/babylon101/scaling1.jpg)

 There are a variety of ways within Babylon.js to position, rotate and scale a mesh, from simple methods to the use of matrices. All of which depend on you knowing which [frame of reference](/resources/Frame_Of_Reference), either the **world axes** or the **local axes**, is being used. 

Prior to the _MeshBuilder_ method of creating a mesh the only way to produce a cuboid or ellipsoid, for example, was to create a cube and sphere and scale them in one dimension or another. This could produce difficulties with subsequent manipulations of a mesh. Since using _MeshBuilder_ allows you to set different sizes for meshes in the x, y and z directions these difficulties with [scaling](/babylon101/position#scaling) no longer arise. 

There are two types of tactic to position and rotate a mesh; one type is the **set-at** tactic and the other is **move-by**. [Position](/babylon101/position#position) and [rotation](/babylon101/position#rotation) are both of the **set at** type, the values being given set the actual position and rotation of the mesh. On the other hand [addRotation](/babylon101/position#sequencing-rotations) is a **move-by** type since it adds the given rotation around one axis to the current rotation of the mesh. You can read about more **set-at** and **move-by** types below.

## Set-At Methods

In addition to  _position_, which places a mesh according to the **world axes**, and _rotation_ which sets the orientation with [Euler angles](/resources/Rotation_Conventions), the following are available to set a mesh's position and rotation.

### Position using Local Axes

This _setPositionWithLocalVector_ method sets the position with reference to **local space** which is a frame of reference that uses the origin of the **world axes** and axes parallel to those of the mesh's **local axes**. 

```javascript
mesh.setPositionWithLocalVector(new BABYLON.Vector3(x, y, z));
```
* [Playground Example setPositionWithLocalVector](https://www.babylonjs-playground.com/#EYZE4Q#2)

In order to obtain the current position of the object in **local space** use

```javascript
var localPosition = mesh.getPositionExpressedInLocalSpace();
```

### RotationQuaternion

All angles are in radians

A [rotationQuaternion](/resources/Rotation_Conventions#quaternions) sets the orientation of a mesh by a rotation around a given axis. It is a four dimensional vector of the form (x, y, z, w). The most straight forward way to use a rotationQuaternion is as follows

```javascript
var axis = new BABYLON.Vector3(1, 1, 1);
var angle = Math.PI / 8;
var quaternion = new BABYLON.Quaternion.RotationAxis(axis, angle);
mesh.rotationQuaternion = quaternion;
```

The default for rotationQuaternion is _undefined_ . When a _rotationQuaternion_ is set the value of _rotation_ is set to (0, 0, 0).

* [Playground Example rotationQuaternion](https://www.babylonjs-playground.com/#EYZE4Q#3) 

**Note** : 
1. You MUST set and use rotationQuaternion when creating physics objects because physics engines rely only on them.
2. Setting a `rotationQuaternion` overwrites the use of `rotation` see [warning](/resources/Rotation_Conventions#warning)

## Align Axes

When you want to rotate a camera or mesh so that it lines up with a set of given axes you can use the [RotationFromAxis](/How_To/rotate#how-to-generate-a-rotation-from-a-target-system) method to find the needed [Euler angles](/resources/Rotation_Conventions) to use with _rotation_ as follows

```javascript
var orientation = BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3);
mesh.rotation = orientation;
```
where _axis1_, _axis2_ and _axis3_ are three left-handed orthogonal vectors and the mesh will be aligned with   

* _axis1_ as the x axis in its local system
* _axis2_ as the y axis in its local system
* _axis3_ as the z axis in its local system

Using this a plane can be made to follow a curve so it lies parallel or perpendicular to the curve as it does so. In the following example a set of points is used to generate and draw a curve and a [3D path](/How_To/How_to_use_Path3D) is created. Babylon.js provides the way to obtain the normal, tangent and binormal from the _Path3D_ object at each of the points used to generate it. These form a set of orthogonal vectors, and depending on the order they are used, a plane can be made to follow and track the shape of the curve. All six orders are used in the example, the top one [0] has the plane tangential to the curve and the fourth one down [3] is perpendicular to the curve. Others can twist the plane at certain points. 

* [Playground Animation - RotationFromAxis](https://www.babylonjs-playground.com/#1PX9G0)

## Move-By Methods

These methods add the given value (positive or negative) to the current position or orientation of the mesh. In the case of _position_ and _rotation_ and _rotationQuaternion_. This can be done by actually adding values using '+=' or `-=" to individual components or using vector addition. The following animated playgrounds show examples.

* [Playground Animation - Position](https://www.babylonjs-playground.com/#66EBY3)
* [Playground Animation - Rotation](https://www.babylonjs-playground.com/#1ST43U#47)
* [Playground Animation  - Rotation Along Straight Horizontal Path](https://www.babylonjs-playground.com/#92EYG#13)
* [Playground Animation - rotationQuaternion](https://www.babylonjs-playground.com/#1ST43U#44)

For rotating the most straight forward **move-by** method is [addRotation](/babylon101/position#sequencing-rotations) which increments the orientation of a mesh about one of the **local axes**.

* [Playground Animation - addRotation](https://www.babylonjs-playground.com/#EYZE4Q#5)

The following playground shows you how to use _addRotation_ to construct wheels.

* [Playground Example - Wheels](https://www.babylonjs-playground.com/#1PON40#12) Author [Jerome Bousquie](http://jerome.bousquie.fr/BJS/demos/)

The other ways below move by the values given in the parameters.

### Locally Translate

This method moves, or more strictly translates, a mesh using the **local axes**

```javascript
mesh.locallyTranslate(new BABYLON.Vector3(x, y, z));
```
* [Playground Example locallyTranslate](https://www.babylonjs-playground.com/#EYZE4Q#1)
* [Playground Animation locallyTranslate](https://www.babylonjs-playground.com/#EYZE4Q#4)

### Translate

Mathematically a translation is a single vector which gives the direction and distance that an object moves by. The _translate_ method in BABYLON.js requires three parameters direction, distance and space.

The space parameter allows you to state whether _translate_ uses the **world axes** or the **local axes** and takes the values BABYLON.Space.WORLD and BABYLON.Space.LOCAL respectively.

By allowing direction and distance to be given Babylon.js gives you the opportunity to easily move a mesh along one the the axes x, y, or z. This is because Babylon.js supplies three constant unit vectors along each axis; these are BABYLON.Axis.X, BABYLON.Axis.Y and BABYLON.Axis.Z. So moving a distance 2 along the y axis becomes

```javascript
mesh.translate(BABYLON.Axis.Y, 2, BABYLON.Space.WORLD);
```
for the **world axes** and 

```javascript
mesh.translate(BABYLON.Axis.Y, 2, BABYLON.Space.LOCAL);
```
for the **local axes**.

It is also possible to supply other unit vectors and a distance.

```javascript
mesh.translate(new BABYLON.Vector3(-1, 3, -2).normalize(), 10, BABYLON.Space.LOCAL);
```

Alternatively, if you wish just to supply a vector giving the whole of the translation use a unit distance

```javascript
mesh.translate(new BABYLON.Vector3(-1, 3, -2), 1, BABYLON.Space.WORLD);
```

Generally the total distance moved given vector v and distance d as parameters will be |v|d, so using

```javascript
mesh.translate(new BABYLON.Vector3(-6, 3, -2), 5, BABYLON.Space.WORLD);
```

will move the mesh a distance of 35 units in the direction (-6, 3, -2) since |(-6, 3, -2)| = &#x221a;49 = 7 and 7 * 5 = 35

### Rotate
To rotate a mesh an axis, angle and the space are needed. The center of rotation is the origin of the **local axes** and the axis is given as any vector(x, y, z) and passes through the center of rotation.  In other words the mesh spins at its current position. Changing the position of the center of rotation can be done by using a parent or a [pivot](/How_To/Pivot).

The axes BABYLON.Axis.X, BABYLON.Axis.Y and BABYLON.Axis.Z may be used. The frame of reference for the axis can be the **world axes** or the **local axes**.

```javascript
pilot.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD);

pilot.rotate(new BABYLON.Vector3(-1, 3, -10), 7 * Math.PI / 12, BABYLON.Space.LOCAL);
```

**Note:**  `mesh.rotate()` generates a new [quaternion](/resources/Rotation_Conventions#quaternions) and then uses `mesh.rotationQuaternion` while `mesh.rotation` is set to (0, 0, 0).  

* [Playground Animation - Rotate](https://www.babylonjs-playground.com/#66EBY3#3)

## Change of Origin

Should you wish to position, rotate or scale a mesh about a point other than its own _local origin_ then this can be done either using [a parent or a pivot](/How_To/Pivot) or by [coordinate transformation](/How_To/transform_coordinates).

### Parent

Assigning a mesh a [parent](/How_To/parenting) changes the **world space** for its children. Any change in position, orientation or scale of the parent will be applied to its children. Setting the position, rotation or scaling of a child will be done using the **local space** of the parent as the child's **world space**. 


```javascript
childMesh.parent = parentMesh;
```

**Note** : Parent-child hierarchies are evaluated on every frame. So any position, rotation and scaling transformations made to the parent prior to assigning it to children will also be applied to the children when the parent is assigned. It usually makes sense not to rotate or move a child until after you've assigned it to the parent.

### Pivot

Using a [pivot](/how_to/pivots) can be tricky and a number of methods are available. There is one method that makes it possible to change the local origin of a mesh so that positioning, rotation and scaling transformations are based on the pivot as the new origin. This is done using `setPivotMatrix` with the second parameter `false`

```javascript
mesh.setPivotMatrix(BABYLON.Matrix.Translation(x, y, z), false);
```

In the following playground having set the pivot point (shown by the red sphere) to the top, back, right corner (C) of the box then positioning the box places C at that position. (Note the use of the negatives in the translation).

* [Playground Example Change Local Origin to Pivot](https://www.babylonjs-playground.com/#3RTT8P#78)



### Transform Coordinates

This method allows you to [transform coordinates](/How_To/Transform_Coordinates) without assigning a parent or a pivot, though it is often more straight forward to do so. 

The change from a local position to a global position is achieved using

```javascript
mesh.computeWorldMatrix();
var matrix = mesh.getWorldMatrix();
var global_position = BABYLON.Vector3.TransformCoordinates(local_position, matrix);
```


## Next step

Now you know how to create and move objects in a scene, but all your meshes have the same 'skin'. Not for long, if you read our next tutorial about [materials](/babylon101/materials).

# Further Reading

## Features

- [Rotate and Translate Overview](/features/Position,_Rotation,_Scaling)  


