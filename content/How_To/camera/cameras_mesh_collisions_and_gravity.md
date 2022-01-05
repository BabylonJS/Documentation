---
title: Camera Collisions
image:
description: Dive into understanding camera collisions, mesh collisions, and gravity.
keywords: diving deeper, cameras, collisions, camera collisions, gravity, mesh collisions
further-reading:
  - title: Cameras Overview
    url: /divingDeeper/cameras
video-overview:
video-content:
---

## Cameras, Mesh Collisions, and Gravity

Did you ever play an FPS (First-Person Shooter) game? In this tutorial, we are going to simulate the same camera movements: the camera is on the floor, in collision with the ground, and potentially in collision with any objects in the scene.

## How can I do this ?

To replicate this movement, we have to do 3 simple steps:

### 1. Define and apply gravity

The first thing to do is to define our gravity vector, defining the G-force.

Babylon.js [Scenes](/typedoc/classes/babylon.scene) have a [gravity](/typedoc/classes/babylon.scene#gravity) property that can be applied to any camera you've previously defined in your code. This will move the camera along the direction and speed specified (a [Vector3](/typedoc/classes/babylon.vector3) object) unless the camera's ellipsoid (see #2 below) is colliding with another mesh in that direction (such as your ground mesh) with [checkCollisions](/typedoc/classes/babylon.mesh#checkcollisions) set to `true`.

```javascript
scene.gravity = new BABYLON.Vector3(0, -0.15, 0);
```

To apply the scene's gravity to your camera, set the [applyGravity](/typedoc/classes/babylon.freecamera#applygravity) property to `true`:

```javascript
camera.applyGravity = true;
```

In the real world, gravity is a _force_ (ok, sort of) that is exerted downward -- _i.e._, in a negative direction along the Y-axis. On Earth, this force is roughly 9.81m/s². Falling bodies _accelerate_ as they fall, so it takes 1 second to fully reach this velocity, then the velocity reaches 19.62m/s after 2 seconds, 29.43m/s after 3 seconds, etc. In an atmosphere, wind drag eventually matches this force and velocity ceases to increase ("terminal velocity").

Babylon.js follows a much simpler gravitational model, however -- `scene.gravity` represents a _constant velocity_, not a force of acceleration, and it is measured in _units/frame_ rather than _meters/second_. As each frame is rendered, the cameras you apply this gravity to will _move_ by the vector's value along each axis (usually `x` and `z` are set to 0, but you can have "gravity" in any direction!), until a collision is detected.

While Babylon.js units have no direct physical equivalent, with the default camera field of view, an approximation of 1 unit = 1 meter is a fairly standard assumption. So, if you want to approximate nominal Earth gravity, you'll need to make some assumptions about the number of frames being rendered per second, and compute a suitable vector:

```javascript
const assumedFramesPerSecond = 60;
const earthGravity = -9.81;
scene.gravity = new BABYLON.Vector3(0, earthGravity / assumedFramesPerSecond, 0);
```

Since this is computed once per frame, the camera isn't actually "moving," it is making tiny "hops" along the direction of the gravity vector. This may be important if you are relying on collision detection to determine if the camera (or, rather, a mesh attached to it for that purpose) has "entered" or "exited" some other mesh (for example, a plane under your "ground" layer to sense a falling character and reset the game play). Depending on your chosen gravity, the starting elevation, and the position and height of the "trigger" mesh, the camera may jump _right through_ the trigger mesh without ever "intersecting" it. Be sure to check the math to ensure that at least one multiple of `scene.gravity` added to the starting elevation will intersect your trigger mesh.

If you need a more accurate representation of gravitational (or other) forces, you can use the physics engines [integrated with Babylon](/divingDeeper/physics/usingPhysicsEngine), or [add your own](/divingDeeper/physics/addPhysicsEngine).

#### A Warning
Adding both physics impostors and setting collision enabled to the same object might lead to unexpected behavior.

### 2. Define an ellipsoid

The next important step is to define the ellipsoid around our camera. This ellipsoid represents our player’s dimensions: a collision event will be raised when a mesh comes in contact with this ellipsoid, preventing our camera from getting too close to this mesh:

![Ellipsoid](/img/babylon101/ellipsoid.png)

The [ellipsoid](/typedoc/classes/babylon.freecamera#ellipsoid) property on Babylon.js cameras is default to size (0.5, 1, 0.5). Changing these values will make you taller, bigger, smaller, thinner, depending on the adjusted axis. In the example below, we will make our camera's ellipsoid a bit wider and deeper than the default one:

```javascript
//Set the ellipsoid around the camera (e.g. your player's size)
camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
```

Please note that the ellipsoid for the camera is offset to always have the viewpoint on top of the ellipsoid. You can control this behavior by updating the [ellipsoidOffset](/typedoc/classes/babylon.freecamera#ellipsoidoffset) property.

The computation will be the following:

`finalPosition = position - vec3(0, ellipsoid.y, 0) + ellipsoidOffset`

### 3. Apply collision

Our final step is to declare that we are interested in sensing collisions in our scene:

```javascript
// Enable Collisions
scene.collisionsEnabled = true;
camera.checkCollisions = true;
```

And to declare which meshes could be in collision with our camera:

```javascript
ground.checkCollisions = true;
box.checkCollisions = true;
```

That’s it! Easy!

You can play with the scene used in this tutorial: <Playground id="#4HUQQ#1713" title="Basic Camera Collision Example" description="A simple example of adding an ellipsoid collision buffer around a camera."/>

Now, your camera is going to fall on the y-axis until it collides with the ground. And, your camera will collide with the box when you move it too close to it.

### 4. Object vs. object collision

You can do the same thing with a mesh by playing with the [ellipsoid](/typedoc/classes/babylon.mesh#ellipsoid) property and the [moveWithCollisions(velocity)](/typedoc/classes/babylon.mesh#movewithcollisions) function. This function will attempt to move the mesh according to a given velocity when it finds no collisions between the current mesh and any meshes with [checkCollisions](/typedoc/classes/babylon.mesh#checkcollisions) activated.

You can also use a mesh's [ellipsoidOffset](/typedoc/classes/babylon.mesh#ellipsoidoffset) to move the ellipsoid on the mesh (by default, the ellipsoid is centered on the mesh).

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

The `ArcRotateCamera` can also check collisions, but instead of sliding along obstacles, this camera won't move when a collision happens.

To activate collisions, just set `camera.checkCollisions` to `true`. You can also define the collision radius:

```javascript
camera.collisionRadius = new BABYLON.Vector3(0.5, 0.5, 0.5);
```

## Other types of collisions

Great, now you can develop a real FPS game! But maybe you would like to know when a mesh is in collision with another mesh? If that interests you, you can head on over here: [Mesh Collisions](/divingDeeper/mesh/interactions/mesh_intersect).
