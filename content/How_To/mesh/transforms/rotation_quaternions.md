# Transformation Chapter Page 4
## Rotation Quaternions
A quaternion is a four dimensional vector (x, y, z, w) and to be a rotation quaternion it has to be a unit vector, i.e. x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> + w<sup>2</sup> = 1

We have already used rotate which sets the rotation quaternion of a mesh.

You can check this in the console

```javascript
mesh.rotate(new BABYLON.Vector3(1, 0 -1), Math.PI / 3, BABYLON.Space.WORLD);
console.log(mesh.rotationQuaternion.x);
console.log(mesh.rotationQuaternion.y);
console.log(mesh.rotationQuaternion.z);
console.log(mesh.rotationQuaternion.w);
```
The same as the *rotation* property the *rotationQuaternion* property sets the orientation of the mesh with the local origin as the center of rotation.

Besides *rotate* you can also obtain a rotation quaternion directly by using, for example

```javascript
mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0 -1), Math.PI / 3);
```
The parameters for the *RotationAxis* method are axis direction and angle. The axis direction vector should be expressed in the world space.

## Warning
You cannot use a *rotationQuaternion* followed by a *rotation* on the same mesh. Once a *rotationQuaternion* is applied any subsequent use of *rotation* will produce the wrong orientation, unless the *rotationQuaternion* is first set to null. Please be aware this often applies when importing models as many of these models already have a *rotationQuaternion* set. 

From version 4.0 onwards, the setting of rotationQuaternion to null is done automatically when and only when *rotation* is set directly with a vector, for example 
```javascript
mesh.rotation = new BABYLON.Vector3(0, 0, 0)
```

Whenever you find rotation errors it is worth setting *rotationQuaternion* to null before updating *rotation*.

