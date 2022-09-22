---
title: Rotation Quaternions
image:
description: Learn about rotation quaternions in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, quaternion, rotation, rotation quaternion
further-reading:
video-overview:
video-content:
---

## Transformations

## Rotation Quaternions

A quaternion is a four dimensional vector (x, y, z, w) and to be a rotation quaternion it has to be a unit vector, i.e. x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> + w<sup>2</sup> = 1

We have already used rotate which sets the rotation quaternion of a mesh.

You can check this in the console

```javascript
mesh.rotate(new BABYLON.Vector3(1, 0 - 1), Math.PI / 3, BABYLON.Space.WORLD);
console.log(mesh.rotationQuaternion.x);
console.log(mesh.rotationQuaternion.y);
console.log(mesh.rotationQuaternion.z);
console.log(mesh.rotationQuaternion.w);
```

The same as the _rotation_ property the _rotationQuaternion_ property sets the orientation of the mesh with the local origin as the center of rotation.

Besides _rotate_ you can also obtain a rotation quaternion directly by using, for example

```javascript
mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0, -1), Math.PI / 3);
```

The parameters for the _RotationAxis_ method are axis direction and angle. The axis direction vector should be expressed in the world space.

Any rotation quaternion can be converted to Euler angles to use with _mesh.rotation_

```javascript
const euler = rotation_quaternion.toEulerAngles();
```

Showing that converted Euler angles to and from rotation quaternion align. <Playground id="#DN4IPH" title="Converting Euler to Quaternion Alignment" description="Simple example showing that converted Euler angles to and from rotation quaternion align."/>

You can also change the orientation of a mesh using a number of different conventions.

## Warning

You cannot use a _rotationQuaternion_ followed by a _rotation_ on the same mesh. Once a _rotationQuaternion_ is applied any subsequent use of _rotation_ will produce the wrong orientation, unless the _rotationQuaternion_ is first set to null. Please be aware this often applies when importing models as many of these models already have a _rotationQuaternion_ set.

From version 4.0 onwards, the setting of rotationQuaternion to null is done automatically when and only when _rotation_ is set directly with a vector, for example

```javascript
mesh.rotation = new BABYLON.Vector3(0, 0, 0);
```

Whenever you find rotation errors it is worth setting _rotationQuaternion_ to null before updating _rotation_.
