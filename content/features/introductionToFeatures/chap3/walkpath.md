---
title: Getting Started - Chapter 3 - A Walk Around The Village
image:
description: Learn to move an animating object through your scene.
keywords: getting started, start, chapter 3, animation, animation basics, character animation, model loading, parenting
further-reading:
video-overview:
video-content:
---


# Getting Started - Working With Code

## A Walk Around The Village

There is a useful property of a mesh, *movePOV* which allows us to move a mesh relative to its point of view. Generally a newly created mesh will be considered as facing the negative z direction and this is the direction of its point of view. To move a mesh forward 6 units in the direction of its point of view you use

```javascript
mesh.movePOV(0, 0, 6)
```
The parameters are, in order, distance to move to the right, up and forward, generally these are the negative x axis, the positive y axis and the negative z axis in the mesh's local space.

In Babylon.js you can write code that will be executed before the rendering of the next frame using

```javascript
scene.onBeforeRenderObservable.add(() => {
    //code to execute
});
```

In this way properties of objects can be changed render frame by render frame.

Let us take the simple case of a sphere moving around the edges of a triangle. We want the sphere to appear to slide along one side, turn to slide along the next and then turn and slide along the last side and then repeat.

This is also an opportunity to introduce two types of mesh you can create, a sphere and a series of lines. Take a sphere sliding around an isosceles right angled triangle as an example.

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.25});

//end points for the line sequence in an array
//y component can be non zero
const points = [];
points.push(new BABYLON.Vector3(2, 0, 2));
points.push(new BABYLON.Vector3(2, 0, -2));
points.push(new BABYLON.Vector3(-2, 0, -2));
points.push(points[0]); //close the triangle;

BABYLON.MeshBuilder.CreateLines("triangle", {points: points})
```

Also you can see an other method, *rotate*, of rotating. This method rotates the mesh about the given axis by the given angle in radians. It adds to the current rotation.
```javascript
mesh.rotate(axis, angle, BABYLON.Space.LOCAL);
```

To produce the animation before each render frame the sphere will move a distance of 0.05. When the distance it has travelled is greater than 4 the sphere will make a turn, greater than 8 it will turn again and when greater than the perimeter it will reset and start again.

We set up a track array of objects with the properties turn and distance. After travelling the given total distance the sphere will rotate by the given turn value.

```javascript
const slide = function (turn, dist) { //after covering dist apply turn
    this.turn = turn;
    this.dist = dist;
}
const track = [];
track.push(new slide(Math.PI / 2, 4));  //first side length 4
track.push(new slide(3 * Math.PI / 4, 8)); //at finish of second side distance covered is 4 + 4
track.push(new slide(3 * Math.PI / 4, 8 + 4 * Math.sqrt(2))); //all three sides cover the distance 4 + 4 + 4 * sqrt(2)
```

Whenever the required distance is reached a turn is made and the array index pointer, p, is increased by 1. The modulo operator *%* is used to reset the pointer to zero at the end of the array.

```javascript
if (distance > track[p].dist) {        
    sphere.rotate(BABYLON.Axis.Y, track[p].turn, BABYLON.Space.LOCAL);
    p +=1;
    p %= track.length;
}
```

To prevent floating point errors accumulating, whenever the index pointer is reset to 0 the position and rotation of the sphere is also reset

```javascript
if (p === 0) {
    distance = 0;
    sphere.position = new BABYLON.Vector3(2, 0, 2); //reset to initial conditions
    sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation 
}
```

<Playground id="#N9IZ8M#1" title="Animating To a Path" description="Simple example of animating an object along a path." image="/img/playgroundsAndNMEs/gettingStartedVillageWalk1.jpg"/>

A little trickier and using a bit of trial and error for the turns and distance we can achieve a more complicated walk for the character around the village. One reason for using degrees and converting them to radians for the *rotate* method is that it is easier to adjust by adding one or two degrees.

Since the character, dude, imported from the *.babylon* file has had its rotation set using a *rotationQuaternion* rather than rotation we use the rotate method to reset the characters orientation.

```javascript
dude.position = new BABYLON.Vector3(-6, 0, 0);
dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
const startRotation = dude.rotationQuaternion.clone(); //use clone so that variables are independent not linked copies
```

```javascript
if (p === 0) {
    distance = 0;
    dude.position = new BABYLON.Vector3(-6, 0, 0);
    dude.rotationQuaternion = startRotation.clone();
}
```

<Playground id="#KBS9I5#81" title="Character Walking Through Town" description="Animate a character walking through the village." image="/img/playgroundsAndNMEs/gettingStartedVillageWalk2.jpg"/>

We now have two things moving around the village a car and a character. How can we avoid them colliding?