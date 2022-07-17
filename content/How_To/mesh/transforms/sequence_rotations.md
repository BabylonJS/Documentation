---
title: Sequencing Rotations
image: 
description: Learn how to sequence rotations in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, sequence rotations
further-reading:
video-overview:
video-content:
---

## Transformations
## Sequencing Rotations
When you use the **rotation** method on a mesh then the rotation is applied in local space first around the y axis, then the x axis and finally about the z axis. How then do you rotate a mesh around a custom sequence of axes? This involves rotation quaternions either implicitly or explicitly.

## Add Rotation
The simplest way is to use the addRotation method, *addRotation(x, y, z)* with two zero parameters, for example both of these sets of code

```javascript
mesh.addRotation(Math.PI / 2, 0, 0);
mesh.addRotation(0, 0, Math.PI / 3);
mesh.addRotation(0, Math.PI / 8, 0);
```

```javascript
mesh.rotation.addRotation(Math.PI / 2, 0, 0).addRotation(0, 0, Math.PI / 3).addRotation(0, Math.PI / 8);
```

will form the current rotation of the mesh further rotate it &pi;/2 about the x axis, then &pi;/3 about the z axis then &pi;/8 about the y axis.

Using non zero x, y and z values with addRotation will add rotations in the order y, x, z.

The internal calculations for addRotations convert the Euler angles to rotation quaternions and back again.

Sequence using addRotation: <Playground id="#HPKH80" title="Sequence Rotations Using addRotation" description="Simple example of sequencing rotations with addRotation."/>

## Rotate
Imagine a disc with an axis through its center. The disc is able to rotate about the axis. The image below shows the disc at several different rotation points around the axis.

![disc rotate](/img/how_to/Mesh/quat1.jpg)

For all rotations of the disc the axis can be tilted as seen in the diagram below.

![disc rotate and axle tilt](/img/how_to/Mesh/quat2.jpg)

Specifying a direction vector for an axis along with an angle is an alternative way of producing a rotation. This is how the *rotate* method is used either in world space or local space. 

```javascript
mesh.rotate(new BABYLON.Vector3(1, 0 -1), Math.PI / 3, BABYLON.Space.WORLD);
```

```javascript
mesh.rotate(new BABYLON.Vector3(1, 0 -1), Math.PI / 3, BABYLON.Space.LOCAL);
```

Three useful vectors are predefined

```javascript
BABYLON.Axis.X;
BABYLON.Axis.Y;
BABYLON.Axis.Z;
```
The *rotate* method is also additive, for example both this set of codes 

```javascript
mesh.rotate(new BABYLON.Vector3(2, -3, 7), Math.PI / 3, BABYLON.Space.LOCAL);  
mesh.rotate(BABYLON.Axis.Y, -Math.PI / 2, BABYLON.Space.WORLD);
mesh.rotate(new BABYLON.Vector3(5.6, 7.8, - 3.4), 1.5 * Math.PI, BABYLON.Space.WORLD);
mesh.rotate(BABYLON.Axis.Z, -Math.PI, BABYLON.Space.LOCAL);
```

will start with the current orientation of the mesh, the add to this a rotation of &pi;/3 about the given local space axis, then add a rotation of -&pi;/2 about the world y axis, the add a rotation of 1.5&pi; about the given world axis and finally add a rotation of -&pi; about the local z axis.

### Examples
Earth rotates on tilted axis: <Playground id="#TLIAXS#" title="Earth Rotating On A Tilted Axis" description="Simple example of the earth rotating on a tilted axis."/>
Using mixed rotate World and Local: <Playground id="#Z3W74Y#1" title="Using Mixed Rotate World and Local" description="Simple example using mixed rotate World and Local."/> 
Two cubes one rotates in World Space other in Local Space: <Playground id="#66EBY3#3" title="2 Cubes Rotating in World and Local Space" description="Simple example of 2 cubes rotating in world and local space."/> 
Purple rotates in World Space, brown Local Space: <Playground id="#LLNE9E#72" title="Purple and Brown rotation in World and Local Space" description="Simple example of 2 colored objects rotating in world and local space."/>

The use of *rotate* sets the orientation of the mesh using a rotation quaternion and subsequently there can then be issues trying to set the orientation of the mesh using *rotation*.

About time to look further at rotation quaternions.
