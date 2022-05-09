## HOW FLOATING-ORIGIN WORKS

On traditional 3D rendering, objects will pass three stages until they're displayed on screen:

- World matrix: places, scales and rotates the object on the world;
- View matrix: will translate and rotate relative to camera;
- Projection matrix: will project vertices to screen.

This is well known and works perfectly.

Only problem is that our GPU's are still limited to 32 bit floating-point,
so when we have big coordinates -- objects and/or cameras very far from the world's origin,
for example at (10000000, 0, 10000500) -- we will notice jittering because of
32 bits floating-point imprecision because of the big numbers inside matrices.

![Pic01](/img/how_to/floating_origin/pic01.jpg)

But there is a trick which is good to mitigate that problem; it is called floating-origin.

The idea of floating-origin is very simple: we just keep the camera always fixed at world's origin
(0, 0, 0) and move the objects instead.

This does not mean that the camera cannot move, though! It "moves", but not directly. Here is
where lies the trick; instead of changing the real camera position, we use a separate, double precision
floating-point Vector3 which stores the camera position. The real camera position is kept always (0, 0, 0).

We do the same for the object; all of them get a separate, double precision Vector3 to store their coordinates.
We don't set their real position directly; instead, we also set their separate coordinates.

Then, on a loop which happens every frame just before rendering, we subtract the double camera position
from each object's double position, and that difference is copied to that object's real position.

The result is that the camera is indeed kept always at origin, and the objects float around, removing
huge coordinates from the objects that are close to the camera. That is, imprecision only happens very far
from the camera, and as they are very far anyway, we cannot see the jittering. =)

![Pic02](/img/how_to/floating_origin/pic02.jpg)

Let's use an example:

On a solar system, we have an asteroid located at (10000000, 0, 10000000).
Our camera is close to the asteroid, at (10000500, 0, 10000500).

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

## FLOATING-ORIGIN EXAMPLE

You can find a working example here:
https://imerso.github.io/babylon.js/floating_origin

The source-code for the example is here:
https://github.com/imerso/bjs_floating_origin

If you decide to use floating-origin, all your objects will have to use the same trick,
or your game won't work properly. You will need to create one instance of OriginCamera
and at least one instance of Entity.

OriginCamera is a special camera which has a separate position control stored as doublepos (and its target as doubletgt). 
You must stop using position and target from camera, and use their double precision counterparts doublepos and doubletgt.

All objects from scene must then be parented to a Entity instance. Entity also has doublepos property which is double precision coordinate. 
You must use its doublepos to set object position instead of position directly.

So, let's say that we want a sphere with double precision:

```  
let camera = new OriginCamera("camera", new BABYLON.Vector3(10000000, 0, 10000500), this._scene);  
let entSphere = new Entity("entSphere", scene);  
camera.add(entSphere);  
let sphere = BABYLON.CreateSphere("sphere", {diameter:2048});  
sphere.parent = entSphere;  
entSphere.doublepos = new BABYLON.Vector3(10000000, 0, 10000000);  
```  

The OriginCamera extends UniversalCamera, so you can use the same features of that.

Finally, even on huge scenes you commonly will have objects spread into separate regions, so you 
most probably would not need one Entity instance for each object. If you think carefully, you
can have one Entity instance for each region of your scene, a region which does not extend for more
than let's say 10,000 units to avoid imprecision again. Then, you can add many objects that are
always in that region to just one Entity. Doing that, you can even move those objects by using
their positions directly, as you would do normally. And still, no imprecision will be seen anymore.

Check the game.ts file for the sun and planet example, plus asteroids clustering.