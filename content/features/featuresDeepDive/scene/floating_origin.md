---
title: Floating Origin (Huge Scenes Support)
image: 
description: Learn how to manage huge scenes using floating-origin trick
keywords: diving deeper, huge spaces, floating-origin
further-reading:
  - title: Original floating-origin research page
    url: https://www.researchgate.net/publication/331628217_Using_a_Floating_Origin_to_Improve_Fidelity_and_Performance_of_Large_Distributed_Virtual_Worlds
video-overview:
video-content:
---

## How floating-origin works

On traditional 3D rendering, objects will pass three stages until they're displayed on screen:

- World matrix: places, scales and rotates the object on the world;
- View matrix: will translate and rotate relative to camera;
- Projection matrix: will project vertices to screen.


This is well known and works perfectly.

Only problem is that our GPU's are still limited to 32 bits floating-point,
so when we have big coordinates -- objects and/or cameras very far from the world's origin,
for example at (10000000, 0, 10000000) -- we will notice jittering because the big numbers inside matrices will cause 32 bits floating-point imprecision on the GPU.

![Pic01](/img/how_to/floating_origin/pic01.jpg)

But there is a trick which is good to mitigate that problem: floating-origin, first described by Chris Thorne [^1].

The idea of floating-origin is very simple: we just keep the camera always fixed at world's origin
(0, 0, 0) and move the objects instead.

This does not mean that the camera cannot move, though! It "moves", but not directly. Here is
where lies the trick: instead of changing the real camera position, we use a separate, double precision [^*]
Vector3 which stores the camera position. The real camera position is kept always at origin (0, 0, 0).

We do the same for the objects: all of them get a separate, double precision Vector3 to store their coordinates. We don't set their real position directly; instead, we also set their separate coordinates.

Then, on a loop which happens every frame just before rendering, we subtract the double camera position from each object's double position, and that difference is copied to that object's real position.

The result is that the camera is indeed kept always at origin, and the objects float around, removing
huge coordinates from the objects that are close to the camera. That is, imprecision only happens very far
from the camera, and as they are very far anyway, we cannot see the jittering. =)

![Pic02](/img/how_to/floating_origin/pic02.jpg)

Let's use an example:

On a solar system, we have an asteroid located at (10000000, 0, 10000000).
Our camera is close to the asteroid, at (10000000, 0, 10000500).

Normally, that would certainly cause jittering, because both objects are very far from the world's origin. But with
our trick, the jittering does not happen -- remember, we subtract camera double position from the object double position
and then set the object real position at that offset, keeping the camera always at (0, 0, 0):

Object Position: (10000000, 0, 10000000)  
Camera Position: (10000000, 0, 10000500)  
Offset: (0, 0, -500)

The offset is small enough to be absolutely precise even with only 32 bits floating-point. The GPU is very happy with that
and we don't see any jittering.

We just need to set the object at (0, 0, -500) and it will have the same visual effect as if we used their real coordinates,
but with no jittering.

## Floating-origin examples

You can find a working playground example with OriginCamera and Entity classes here:  

<Playground id="#LHI514#3" title="Floating-Origin" description="A simple example of huge scene far from world's origin using floating-origin trick." image="/img/playgroundsAndNMEs/divingDeeperFloatingOrigin.jpg"/>


If you decide to use floating-origin, all your objects will have to use the same trick,
or your game won't work properly. You will need to create one instance of OriginCamera
and at least one instance of Entity.

OriginCamera is a special camera which has a separate position control stored as doublepos (and its target as doubletgt). 
You must stop using position and target from camera, and use their double precision counterparts doublepos and doubletgt.

All objects from scene must then be parented to a Entity instance. Entity also has doublepos property which is double precision coordinate. 
You must use its doublepos to set object position instead of position directly.

So, let's say that we want a sphere with double precision:

```javascript
// Create the OriginCamera
let camera = new OriginCamera("camera", new BABYLON.Vector3(10000000, 0, 10000500), scene);
camera.doubletgt = new BABYLON.Vector3(10000000, 0, 10000000);
camera.touchAngularSensibility = 10000;
camera.inertia = 0;
camera.speed = 1;
camera.keysUp.push(87);    		// W
camera.keysDown.push(83)   		// D
camera.keysLeft.push(65);  		// A
camera.keysRight.push(68); 		// S
camera.keysUpward.push(69);		// E
camera.keysDownward.push(81);     // Q
camera.minZ = 0.5;
camera.maxZ = 50000000;
camera.fov = 1;
camera.attachControl(canvas, true);

// Create an Entity for the sphere
let entSphere = new Entity("entSphere", scene);
camera.add(entSphere);

// Create the sphere and parent it to its Entity
let sphere = BABYLON.CreateSphere("sphere", {diameter:256});
sphere.parent = entSphere;

// Position the Entity
entSphere.doublepos = new BABYLON.Vector3(10000000, 0, 10000000);
```  

The OriginCamera extends UniversalCamera, so you can use the same features of that.

Finally, even on huge scenes you commonly will have objects spread into separate regions, so you 
most probably would not need one Entity instance for each object. If you think carefully, you
can have one Entity instance for each region of your scene, a region which does not extend for more
than let's say 10,000 units to avoid imprecision again. Then, you can add many objects that are
always in that region to just one Entity. Doing that, you can even move those objects by using
their positions directly, as you would do normally. And still, no imprecision will be seen anymore.

[^1]: Chris Thorne, 2005. Using a Floating Origin to Improve Fidelity and Performance of Large Distributed Virtual Worlds
[^*]: The original article by Chris Thorne uses single-precision floats.

