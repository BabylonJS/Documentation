---
title: Camera Collisions
image: 
description: Dive into understanding camera collisions, mesh collisions, and gravity.
keywords: welcome, babylon.js, diving deeper, cameras, collisions, camera collisions, gravity, mesh collisions
further-reading:
    - title: Cameras Overview
      url: /features/Cameras
video-overview:
video-content:
---

## Cameras, Mesh Collisions and Gravity

Did you ever play a FPS (First Person Shooter) game? In this tutorial, we are going to simulate the same camera movements: the camera is on the floor, in collision with the ground, and potentially in collision with any objects in the scene.

## How can I do this ?

To replicate this movement, we have to do 3 simple steps:

**1 - Define and apply gravity**

The first thing to do is to define our gravity vector, defining the G-force. In a classic world such as Earth, the direction of the force of gravity is down (negative) along the Y axis, but feel free to change it!
```javascript
scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
```
 
Gravity can be applied to any camera that you have defined previously in your code.
```javascript 
camera.applyGravity = true; 
```

**2 - Define an ellipsoid**

The next important step is to define the ellipsoid around our camera. This ellipsoid represents our player’s dimensions: a collision event will be raised when a mesh comes in contact with this ellipsoid, preventing our camera from getting too close to this mesh:

![Ellipsoid](/img/babylon101/ellipsoid.png)

The _ellipsoid_ property on babylon.js cameras is default to size (0.5, 1, 0.5), but changing values will make you taller, bigger, smaller, thinner, it depends upon the adjusted axis. In the example below, we will make our camera's ellipsoid a bit bigger than the default one:

```javascript
//Set the ellipsoid around the camera (e.g. your player's size)
camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
```

Please note that the ellipsoid for the camera is offset to always have the view point on top of the ellipsoid. You can control this behavior by updating the `camera.ellipsoidOffset` property.

The computation will be the following:

*finalPosition = position - vec3(0, ellipsoid.y, 0) + ellipsoidOffset*

**3 - Apply collision**

Once you have those previous settings completed, our final step is to declare that we are interested in sensing collisions in our scene:

```javascript
// Enable Collisions
scene.collisionsEnabled = true;
camera.checkCollisions = true;
```

And declare which meshes could be in collision with our camera:

```javascript
ground.checkCollisions = true;
box.checkCollisions = true;
```

That’s it! Easy!

You can play with the scene used in this tutorial: <Playground id="#4HUQQ" title="Basic Camera Collision Example" description="A simple example of adding an ellipsoid collision buffer around a camera." image="/img/playgroundsAndNMEs/divingDeeperCameraCollisions1.jpg"/>

Now, your camera is going to fall on the y-axis until it collides with the ground. And, your camera will collide with the box when you move it too near to it.

**4 - Object vs. object collision**

You can also do the same thing with a mesh by playing with _mesh.ellipsoid_ property and _mesh.moveWithCollisions(velocity)_ function. This function will try to move the mesh according to given velocity and will check if there is no collision between current mesh and all meshes with checkCollisions activated.

You can also use _mesh.ellipsoidOffset_ to move the ellipsoid on the mesh (By default the ellipsoid is centered on the mesh)

```javascript
var speedCharacter = 8;
var gravity = 0.15;
var character = Your mesh;

character.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
character.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);

var forwards = new BABYLON.Vector3(parseFloat(Math.sin(character.rotation.y)) / speedCharacter, gravity, parseFloat(Math.cos(character.rotation.y)) / speedCharacter);
forwards.negate();
character.moveWithCollisions(forwards);
// or
var backwards = new BABYLON.Vector3(parseFloat(Math.sin(character.rotation.y)) / speedCharacter, -gravity, parseFloat(Math.cos(character.rotation.y)) / speedCharacter);
character.moveWithCollisions(backwards);
```

## ArcRotateCamera
The ArcRotateCamera can also check collisions but instead of sliding along obstacles, this camera won't move when a collision appends.

To activate collisions, just call ```camera.checkCollisions = true```. You can define the collision radius with this code:

```javascript
camera.collisionRadius = new BABYLON.Vector3(0.5, 0.5, 0.5)
```

## Next step
Great, now you can develop a real FPS game! But maybe you would like to know when a mesh is in collision with another mesh? Good, because that is exactly the purpose of our [next tutorial](/babylon101/Intersect_Collisions_-_mesh).