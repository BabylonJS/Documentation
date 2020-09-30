# Positioning, Rotating and Scaling 

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



