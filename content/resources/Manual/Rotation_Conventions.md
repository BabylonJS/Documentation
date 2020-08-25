# Rotation Conventions

There are several methods of achieving rotations within BabylonJS all of which use a particular convention.


## Euler Angles

In 3D space Euler angles can produce any possible orientation by providing three angles to rotate about each of three axes in a given order.  

For three axes X, Y and Z there are 12 different permutations for the order of the angles. Since X, Y and Z can be treated as *World* or as *local* axes this means there is a potential of 24 different possibilities. Most, if not all,of these are in use in different systems around the world. So you need to be very careful that you know very clearly the convention that the system you are working in uses.

Mesh.rotation(alpha, beta, gamma) uses the three Euler angles alpha, beta and gamma which are rotations about the X, Y and Z axes respectively. The convention that Babylon.js uses is based on the yaw, pitch and roll convention and so is carried out around X, Y and Z as local axes in the order Y, X, Z.

References to Euler angles within the Babylon.js community can usually be taken to mean the angles to use with the _rotation_ method.

### YXZ *Local Axes* Yaw, Pitch, Roll

![Yaw pitch roll](/img/how_to/Mesh/yawpitchroll.jpg)

A pitch is about X, yaw about Y and roll about Z applied in the order yaw, pitch roll using **local** axes.

Applying independent rotations to a newly created mesh (ie one that has zero rotations) in the order YXZ using local axes

```javascript
mesh.rotate(BABYLON.Axis.Y, yaw, BABYLON.Space.LOCAL);
mesh.rotate(BABYLON.Axis.X, pitch, BABYLON.Space.LOCAL);
mesh.rotate(BABYLON.Axis.Z, roll, BABYLON.Space.LOCAL);
```

produces the same orientation as 

```javascript
mesh.rotation = new BABYLON.Vector3(pitch, yaw, roll);
```

which will produce this orientation whatever the orientation of the mesh prior to its application. The playground below demonstrates this by randomly generating angles and then applying these two methods to two different boxes which remain in alignment.

* [Playground Example - YXZ yaw, pitch, roll](https://www.babylonjs-playground.com/#1ST43U#50)

### ZXY *World Axes*

The YXZ convention with local axes has produced a particular orientation and it turns out that taking the same angles (alpha = pitch, beta = yaw and gamma = roll) and applying them in the order ZXY using **world** axes will produce exactly the same orientation.

Applying independent rotations to a newly created mesh (ie one that has zero rotations) in the order ZXY

```javascript
mesh.rotate(BABYLON.Axis.Z, gamma, BABYLON.Space.WORLD);
mesh.rotate(BABYLON.Axis.X, alpha, BABYLON.Space.WORLD);
mesh.rotate(BABYLON.Axis.Y, beta, BABYLON.Space.WORLD);
```

produces the same orientation as 

```javascript
mesh.rotation = new BABYLON.Vector(alpha, beta, gamma);
```

which will produce this orientation whatever the orientation of the mesh prior to its application. The playground below demonstrates this by randomly generating angles and then applying these two methods to two different boxes which remain in alignment.

* [Playground Example - ZXY](https://www.babylonjs-playground.com/#1ST43U#52)


## Quaternions

Imagine a disc with an axle through its center. The disc is able to rotate about the axle. The diagram below shows the disc at several different rotation points around the axle.

![disc rotate](/img/how_to/Mesh/quat1.jpg)

For all rotations of the disc the axle can be tilted as seen in the diagram below.

![disc rotate and axle tilt](/img/how_to/Mesh/quat2.jpg)

Together a rotation of the disc and a tilt of the axle can produce all possible 3D orientations of the disc. The tilt, or direction, of the axle can be given by a vector along the axle. This means that another way of giving the orientation of a mesh is with a vector (axle direction) and a rotation (of the disc).

So one way of producing any possible orientation is to use four values, three for the axis and one for the angle of rotation. Such a four dimensional vector is a rotational quaternion.

In Babylon.js this is obtained by using

```javascript
mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(axis, angle);
```

where axis is a Vector3 and the angle is the rotation in radians. 

### Historical Warning 
When using BabylonJS versions &lt; 4.00 you cannot use both a **rotation** and a **rotationQuaternion** on a mesh. When a **rotationQuaternion** is applied to a mesh this overwrites the current and subsequent use of **rotation** producing the wrong orientation. Should you want to use **rotation** after a **rotationQuaternion** has been applied, for example on an imported mesh, then the **rotationQuaternion** has to be set to _null_. 

From version 4 onwards, in limited situations, the setting of **rotationQuaternion** to _null_ is done automatically on whenever **rotation** is set directly. When using, for example, physics, the NullEngine or even `rotation.set(0.23, 0.17, 1.84)` you find rotation errors it is worth setting **rotationQuaternion** to _null_ before updating **rotation**.


## Euler Angles to Quaternions

### YXZ *Local Axes* Yaw, Pitch, Roll

![Yaw pitch roll](/img/how_to/Mesh/yawpitchroll.jpg)

As a reminder this convention is directly used in the _rotation_ method in Babylon.js in the form

```javascript
mesh.rotation = new BABYLON.Vector3(pitch, yaw, roll);
```

In this convention to take the three angles, yaw, pitch and roll and rotate rotate yaw about Y, then pitch about X and roll about Z using the **local** axes.

```javascript
mesh.rotate(BABYLON.Axis.Y, yaw, BABYLON.Space.LOCAL);
mesh.rotate(BABYLON.Axis.X, pitch, BABYLON.Space.LOCAL);
mesh.rotate(BABYLON.Axis.Z, roll, BABYLON.Space.LOCAL);
```

which with quaternions is the same as using _RotationYawPitchRoll_

```javascript
var yprQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw, pitch, roll);
``` 
Applying the above  _rotate_ sequence to a newly created mesh (ie one that has zero rotations) in the order YXZ in **local** space and applying _RotationAlphaBetaGamma_ to a mesh, with any orientation, using the same angles will produce the same orientation. The playground below demonstrates this by randomly generating angles and then applying these two methods to two different boxes which remain in alignment.

* [Playground Example - Yaw Pitch Roll to Quaternion](https://www.babylonjs-playground.com/#1ST43U#54)

### ZXZ *World Axes* A Standard Convention 

A standard Euler angle convention is to take three given angles alpha, beta and gamma and rotate alpha about Z, then beta about X, then gamma about Z using the **world** axes. In Babylon.js this can be achieved by using _rotate_

```javascript
mesh.rotate(BABYLON.Axis.Z, alpha, BABYLON.Space.WORLD);
mesh.rotate(BABYLON.Axis.X, beta, BABYLON.Space.WORLD);
mesh.rotate(BABYLON.Axis.Z, gamma, BABYLON.Space.WORLD);
```

which with quaternions is the same as using  _RotationAlphaBetaGamma_

```javascript
var abcQuaternion = BABYLON.Quaternion.RotationAlphaBetaGamma(alpha, beta, gamma);
```

Applying the above  _rotate_ sequence to a newly created mesh (ie one that has zero rotations) in the order ZXZ in **world** space and applying _RotationAlphaBetaGamma_ to a mesh, with any orientation, using the same angles will produce the same orientation. The playground below demonstrates this by randomly generating angles and then applying these two methods to two different boxes which remain in alignment.

* [Playground Example ZXZ to Quaternion](https://www.babylonjs-playground.com/#1ST43U#53)


## Quaternions to Euler Angles

The Euler angles that can be used in mesh.rotation can be found from any rotation quaternion by the following method

```javascript
var euler = quaternion.toEulerAngles();
```

To illustrate this the following playground generates three random angles, puts the axes XYZ into a random order 
and selects at random either to use world or local for all axes. This data is then used to randomise the orientation 
of a just created box using the _rotate_ method. The _rotate_ method achieves the rotation by generating and using a _rotationQuaternion_  on the box. The _rotationQuaternion_ generated is used to produce the Euler angles to rotate another box, box1, using box1.rotation to obtain the same orientation as the first box.

* [Playground Example Random Orientation to Euler Angles for mesh.rotation](https://www.babylonjs-playground.com/#1ST43U#7)

