---
title: Using A Physics Engine
image: 
description: Learn how to use one of the available physics engines in Babylon.js.
keywords: diving deeper, phyiscs
further-reading:
    - title: How To Use Forces
      url: /features/featuresDeepDive/physics/forces
    - title: How to use Joints
      url: /features/featuresDeepDive/physics/joints
    - title: How To Use Pivots and Axes
      url: /features/featuresDeepDive/physics/pivotsAxes
    - title: How To Create Compound Bodies
      url: /features/featuresDeepDive/physics/compoundBodies
    - title: How To Create Soft Bodies
      url: /features/featuresDeepDive/physics/softBodies
    - title: How To Use Advanced Features
      url: /features/featuresDeepDive/physics/advancedPhysicsFeatures
    - title: How To Add Your Own Physics Engine
      url: /features/featuresDeepDive/physics/addPhysicsEngine
video-overview:
video-content:
---

# How to Use a Physics Engine

## Introduction

Babylon.js has a plugin system for physics engines that enables the user to add physics interactions to the scene's objects.
Unlike the internal collision system, a physics engine calculates objects'  body dynamics and emulates "real-life" interactions between them. So if two objects collide, they will "bounce" off one another, just like you would expect from a real-life object.

Babylon.js' plugin system allowed us to use well established physics engines and to integrate them into Babylon.js' render loop. Apart from very advanced usage, there is no need to interact directly with the physics engine. Babylon.js does the work for you.

This tutorial will show the basic usage of the physics system.

## What physics engine are integrated

There are plugins for 4 physics engines:

1. Cannon.js - a wonderful physics engine written entirely in JavaScript
1. Oimo.js - a JS port of the lightweight Oimo physics engine
1. Energy.js - (Not yet publicly available) - a JS port of a C++ physics engine
1. Ammo.js - a JS port of the C++ Bullet physics engine

Each engine has its own features and its own way of calculating the body dynamics. We at Babylon.js tried collecting the common usage of all engines and provide an easy-to-use interface to them.

Once you picked an engine, do not forget to add a reference to the engine code:

1. Cannon: https://cdn.babylonjs.com/cannon.js
1. Oimo: https://cdn.babylonjs.com/Oimo.js
1. Ammo: https://cdn.babylonjs.com/ammo.js or directly from https://github.com/kripken/ammo.js/blob/master/builds/ammo.js

## Basic usage

### Enabling the physics engine

To enable the physics engine, call the scene's `enablePhysics` function:

```javascript
var scene = new BABYLON.Scene(engine);
var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);
```

Both parameters are optional. The default parameters are shown in the example. This is the same as calling:

```javascript
scene.enablePhysics();
```

To use OimoJS simply change the 2nd parameter to `new BABYLON.OimoJSPlugin()`:

```javascript
scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.OimoJSPlugin());
```

Calling this function will create a new BABYLON.PhysicsEngine object that will be in charge of handling the physics interactions.

The physics engine is now enabled and is running during the render loop.

Please note that when using Ammo since version 5.0 you are required to initialize it before creating the ammo plugin:

```javascript
await Ammo();
scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin());
```

for Cannon, you need to set the CANNON attribute in window:

```javascript
import * as cannon from "cannon";

window.CANNON = cannon;
scene.enablePhysics(null, new CannonJSPlugin());
```

### Impostors

To allow interaction between objects, the physics engines use an impostor, which is a simpler representation of a complex object. 
An impostor, as a rule, is a rigid body - meaning it cannot be changed during interaction. A sphere will always have the same radius, a box will always have the same length. If you want to change the object, a new impostor will be created.

Each physics engine has different types of Impostors. The following table shows what each engine supports, and what it uses to simulate the missing impostors

| Impostor Type | Cannon.js | Oimo.js | Energy.js | Ammo.js | Notes   |
|---------------|-----------|---------|-----------|---------|---------|
| Box           | Box       | Box     | Box       | Box     |         |
| Sphere        | Sphere    | Sphere  | Sphere    | Sphere  |         |
| Particle      | Particle  | Sphere  | Unknown   | Sphere  |         |
| Plane         | Plane     | Box     | Plane     | Box     | Simulates an unlimited surface. Like a floor that never ends. Consider using Box |
| Cylinder      | Cylinder  | Cylinder| Cylinder  | Cylinder|         |
| Mesh          | Mesh      | Box     | Mesh      | Mesh    | Use only when necessary - will lower performance. Cannon's mesh impostor only collides against spheres and planes |
| Heightmap     | Heightmap | Box     | Mesh      | Mesh    |         |
| ConvexHull    | N/A       | N/A     | N/A       | Mesh    | Allows physics impostor support for convex mesh hull shapes |

Using simple impostors for complex objects will increase performance but decrease the reality of the scene's physics. Consider when complex impostors (like the mesh or the heightmap) is needed, and when the simpler geometries can be used.

### Authoring and loading a mesh with a collider mesh (Currently works with AmmoJS plugin only)

To get reasonably accurate collisions without overloading the physics engine, a collider mesh is recommended. One way to do this is as followed:

#### Authoring
1. Model a mesh as usual (eg. in Blender, Babylon, Maya, etc.)
1. Using impostor primitives (eg. Box or Sphere) create collider meshes outlining the mesh
1. Label the collider meshes so they can be accessed within Babylon by name
1. Ensure that the collider mesh nodes do not have their orientation frozen as this info is needed within Babylon to generate the physics imposters
1. Export to a Babylon supported file format: GLTF, GLB, Babylon, etc.

#### Loading

1. Import mesh file within Babylon
1. Create a new Babylon mesh which will be used as the root of physics mesh, the position of this mesh act as the center of mass for the physics object
1. Iterate over the loaded mesh's children and add the collider meshes (marked by the label during creation) as a child of the root physics mesh, make them non-visible and create physics impostors from each
1. Iterate over the loaded mesh again and add the parent nodes as a child of the root physics mesh
1. Scale the root physics mesh to the desired size (Scaling must be uniform)
1. Create a physics impostor of the root physics mesh of type NoImpostor (The mass of this impostor will override the mass of the child impostors)
1. Position/rotate the root physics mesh to the desired place within the world

#### Examples

- Loading mesh and colliders from file: <Playground id="#66PS52" title="Loading A Mesh And Colliders From A File" description="Simple example of loading a mesh and colliders from a file."/>
- Loading and adding colliders manually in Babylon: <Playground id="#FD65RR" title="Loading And Adding Colliders Manually" description="Simple example of loading meshes but creating colliders manually."/>
- Loading and adding collider with joints and pointer interactions: <Playground id="#DGEP8N" title="Loading And Adding A Collider With Joints And Interactions" description="Simple example of loading and adding a collider with joints and pointer interactions."/>
- Custom engine with [`deterministicLockstep`](/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep): <Playground id="#3ZW889#17" title="Custom Engine With DeterministicLockStep" description="Example of creating a custom engine with determinsticLockStep." image="/img/playgroundsAndNMEs/pg-3ZW889-11.png"/> Takes a few moments to load, use Run, &#x25B7;, to clear any error message.

### Babylon's physics impostor

To enable physics on an object(*) you need to assign it a physics impostor. The signature of the impostor's constructor is (provided with TypeScript type definition):

```javascript
new BABYLON.PhysicsImpostor(object: IPhysicsEnabledObject, type: number, options: PhysicsImpostorParameters, scene:BABYLON.Scene);
```

#### object

You will notice that I keep on writing object and not mesh, and that the first parameter is not a mesh but an interface (IPhysicsEnabledObject). It is possible to assign an impostor to any Babylon object that has at least two parameters:

```javascript
position: BABYLON.Vector3;
rotationQuaternion: BABYLON.Quaternion
```

An AbstractMesh will be the first choice, of course. But a Solid Particle also applies, and so does a light or certain cameras. I will show how to use an impostor on different object types in the advanced tutorial.

#### type

Type can be one of the following:

```javascript
BABYLON.PhysicsImpostor.SphereImpostor;
BABYLON.PhysicsImpostor.BoxImpostor;
BABYLON.PhysicsImpostor.PlaneImpostor;
BABYLON.PhysicsImpostor.MeshImpostor;
BABYLON.PhysicsImpostor.CylinderImpostor;
BABYLON.PhysicsImpostor.ParticleImpostor;
BABYLON.PhysicsImpostor.HeightmapImpostor;
BABYLON.PhysicsImpostor.ConvexHullImpostor;
```

#### options

Options is a JSON. The interface is as follows:

```javascript
    export interface PhysicsImpostorParameters {
        mass: number;
        friction?: number;
        restitution?: number;
        nativeOptions?: any;
        ignoreParent?: boolean;
        disableBidirectionalTransformation?: boolean;
    }
```

* mass: The only mandatory parameters is mass, which is the object's mass in kg. A `0` as a value will create a static impostor - good for floors.
* friction: is the impostor's friction when colliding against other impostors.
* restitution: is the amount of force the body will "give back" when colliding. A low value will create no bounce, a value of 1 will be a very bouncy interaction.
* nativeOptions: is a JSON with native options of the selected physics plugin. More about it in the advanced tutorial.
* ignoreParent: when using babylon's parenting system, the physics engine will use the compound system. To avoid using the compound system, set this flag to true. More about it in the advanced tutorial.
* disableBidirectionalTransformation: will disable the bidirectional transformation update. Setting this will make sure the physics engine ignores changes made to the mesh's position and rotation (and will increase performance a bit)
* group: set the collision group (ammojs only)
* mask: collision bit mask. Only impostor's group that have at least one bit in the mask will have collisions (ammojs)

### Basic physics scene

I will extend the playground's basic scene to have physics interactions between the sphere and the ground.

I will first have to enable physics:

```javascript
scene.enablePhysics();
```

Afterwards, I can create the impostors.

```javascript
sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
```

Playground example: <Playground id="#BEFOO" title="Basic Physics Scene" description="Simple example of a basic physics scene." isMain={true} category="Physics"/>

### Further functionality of the Impostor class

In the example above, you noticed I kept a reference of the physics impostor attached to the sphere and the ground. This is not mandatory, but it is recommended to keep a reference of this object in order to interact with the physics body.

The physics impostor holds a set of functions that can be executed on the physics engine's body:

#### Bidirectional transformation linking

The physics impostor synchronizes the physics engine's body and the connected object with each frame.
That means that changing the object's position or rotation in Babylon code will also move the impostor. The impostor is also the one updating the object's position after the physics engine is finished calculating the next step.

Playground example (sphere rotation and position) -  <Playground id="#B5BDU" title="Rotating A Sphere's Physics Imposter" description="Simple example of rotating a sphere via its physics imposter."/>
Notice how the sphere rotates (due to the rotate function), but this rotation is not being taken into account by the physics engine.

Playground example (box rotation and position) - <Playground id="#2ADVLV" title="Rotating A Box's Physics Imposter" description="Simple example of rotating a box via its physics imposter."/>
In this case, the rotation does influence the physics engine due to the geometric shape - a box standing on its edge will need to fall to either side, which influences its velocities.

#### Linear velocity

Simply put, the linear velocity is in charge of updating the object's position. A velocity in any axis will cause a movement in its direction.
To get the object's liner velocity (a BABYLON.Vector3):

```javascript
impostor.getLinearVelocity();
```

To set the object's linear velocity use:

```javascript
impostor.setLinearVelocity(new BABYLON.Vector3(0,1,0));
```

Playground example - <Playground id="#BXII" title="Linear Velocity Example" description="Simple example of physics linear velocity."/>

The physics engine is in charge of calculating the body's velocity. Changing it will not make it fixed, but give it a "push". The physics engine will take the velocity into account and will modify it using gravity and collision interactions.

#### Angular velocity

If the linear velocity was changing the position, the angular velocity is changing the rotation.

To get the object's angular velocity (a BABYLON.Quaternion):

```javascript
impostor.getAngularVelocity();
```

To set the object's angular velocity use:
```javascript
impostor.setAngularVelocity(new BABYLON.Quaternion(0,1,0,0));
```

Playground example - <Playground id="#IGM3H" title="Angular Velocity Example" description="Simple example of physics angular velocity."/>

Same as the linear velocity - setting this value will only cause the physics engine to recalculate the body dynamics. The value will not stay fixed.

#### Impulses and forces

Applying a force/impulse on a body will change its velocities (linear and angular) according to the body's properties (mass is taken into account, for example).

Cannon supports both force and impulse (different aspects of the same concept, [read about the difference here](http://www.differencebetween.com/difference-between-impulse-and-vs-force/)).
Oimo only supports impulses. Applying a force will fallback to impulse.

To apply an impulse, use the applyImpulse function of the impostor:

```javascript
impostor.applyImpulse(new BABYLON.Vector3(10, 10, 0), sphere.getAbsolutePosition());
```

The first variable is the direction and amount of impulse to apply. The second is where on the body itself the force will be applied. Using this in a game of pool - you can hit the ball at various contact point locations and the interaction will vary.

Playground example - <Playground id="#26LQEZ" title="Impulse Example" description="Simple example of adding physics impulses."/>
Playground example with a different position of the impulse, giving the ball a "spin" - <Playground id="#26LQEZ#1" title="Different Impulse Positions" description="Simple example of spinning a ball with different impulse positions."/>

#### Radial explosion impulse/force & gravitational fields

You have the ability to create radial explosions & gravitational forces. 

The forces are never applied to impostors that have mass equal 0 (the ground for example).

```javascript
var physicsHelper = new BABYLON.PhysicsHelper(scene);

var origin = BABYLON.Vector3(0, 0, 0);
var radius = 10;
var strength = 20;
var falloff = BABYLON.PhysicsRadialImpulseFalloff.Linear; // or BABYLON.PhysicsRadialImpulseFalloff.Constant

var explosionEvent = physicsHelper.applyRadialExplosionImpulse( // or .applyRadialExplosionForce
    origin,
    radius,
    strength,
    falloff
);
// the second `radius` argument can also act as options: `.applyRadialExplosionImpulse(origin, { radius: radius, strength: strength, falloff: falloff })`

// or

var gravitationalFieldEvent = physicsHelper.gravitationalField(
    origin,
    radius,
    strength,
    falloff
);
// the second `radius` argument can also act as options: `.gravitationalField(origin, { radius: radius, strength: strength, falloff: falloff })`
gravitationalFieldEvent.enable(); // need to call, if you want to activate the gravitational field.
setTimeout(function (gravitationalFieldEvent) { gravitationalFieldEvent.disable(); }, 3000, gravitationalFieldEvent);

// or

var updraftEvent = physicsHelper.updraft(
    origin,
    radius,
    strength,
    height,
    BABYLON.PhysicsUpdraftMode.Center // or BABYLON.PhysicsUpdraftMode.Perpendicular
);
// the second `radius` argument can also act as options: `.updraft(origin, { radius: radius, strength: strength, height: height, updraftMode: PhysicsUpdraftMode.Center })`
updraftEvent.enable();
setTimeout(function (updraftEvent) { updraftEvent.disable(); }, 5000, updraftEvent);

// or

var vortexEvent = physicsHelper.vortex(
    origin,
    radius,
    strength,
    height
);
// the second `radius` argument can also act as options: `.vortex(origin, { radius: radius, strength: strength, height: height, centripetalForceThreshold: 0.7, centripetalForceMultiplier: 5, centrifugalForceMultiplier: 0.5, updraftForceMultiplier: 0.02 })`
vortexEvent.enable();
setTimeout(function (vortexEvent) { vortexEvent.disable(); }, 5000, vortexEvent);
```

In case you want to do some debug, like visually show the sphere and/or rays, you can do that by calling `event.getData()` *(note that if you do that, you will need to manually call `event.dispose()` to dispose the unused meshes, after you are done debugging)*. The `event.getData()` will return back the `sphere` mesh variable, which you can then use, to apply a semi-transparent material, so you can visualize it. The `explosionEvent.getData()` will also return back the `rays` rays variable, in case you want them for debugging purposes.

*For a more detailed explanation, please take a look at the playground example below.*

Playground example - <Playground id="#UZHINX" title="Radial Explosion" description="Simple example of a radial explosion."/>

#### Collision callbacks

You can add a callback function that will be called when an impostor collides with another impostor. 
This is how to change the color of an object if it collides against the ground.

```javascript
sphereImpostor.registerOnPhysicsCollide(groundImpostor, function(main, collided) {
    main.object.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
});
```

Note that in this case, I assumed the impostor's body is a mesh with a material.

Playground example - <Playground id="#1NASOD" title="Collision Callback Example" description="Simple example of leveraging collision callbacks."/>

Notice that the callback will be executed each and every time both impostors collide, but will stop when they are touching (when the sphere no longer bounces).

### Physics Joints

#### What are joints

To connect two impostors together, you can now use joints.
Think of the joint as a limitation (or constraint) of either rotation or position (or both) between two impostors.
Each engine supports different types of joints (which usually have different names as well):

| Joint Type | Cannon.js | Oimo.js | Energy.js | Notes   |
|---------------|-----------|---------|-----------|---------|
| Distance  | Distance | Distance | ---   |  A fixed distance between two impostors |
| Hinge | Hinge | Hinge | Hinge | A joint allowing rotation on a single axis (much like your knee) |
| Hinge2| ----  | Wheel  | Hinge2   | A joint allowing rotation on a single axis in two different points |
| Ball And Socket | Point To Point | Ball | Ball And Socket | A joint allowing one of the objects to rotate around a specific socket (like your hip) |
| Slider | ---- | Slider | Slider | A joint allowing changing the position along a single axis |

Cannon also has a special Spring joint that will simulate a spring connected between two impostors.

#### Adding a new joint

To add a new joint the impostor has two help classes:

```javascript
impostor.addJoint(otherImpostor, joint);
//or
impostor.createJoint(otherImpostor, jointType, jointData);
```

Joint types can be selected from the following enum:

```javascript
BABYLON.PhysicsJoint.DistanceJoint;
BABYLON.PhysicsJoint.HingeJoint;
BABYLON.PhysicsJoint.BallAndSocketJoint;
BABYLON.PhysicsJoint.WheelJoint;
BABYLON.PhysicsJoint.SliderJoint;
BABYLON.PhysicsJoint.Hinge2Joint = BABYLON.PhysicsJoint.WheelJoint;
BABYLON.PhysicsJoint.PointToPointJoint = BABYLON.PhysicsJoint.BallAndSocketJoint;
BABYLON.PhysicsJoint.SpringJoint;
```

Babylon has 3 help-classes to add joints:

`BABYLON.DistanceJoint` , `BABYLON.HingeJoint`, `BABYLON.Hinge2Joint`.

DistanceJoint playground - <Playground id="#26QVLZ#197" title="Adding A DistanceJoint" description="Simple example of adding a DistanceJoint."/>
SpringJoint example - <Playground id="#1BHF6C#68" title="Adding A SpringJoint" description="Simple example of adding a SpringJoint"/>

#### Setting the joint data

The physics joint data interface looks like this:

```javascript
interface PhysicsJointData {
    mainPivot?: Vector3;
    connectedPivot?: Vector3;
    mainAxis?: Vector3,
    connectedAxis?: Vector3,
    collision?: boolean
    nativeParams?: any; //Native Oimo/Cannon data
}
```

* **mainPivot**: is the point on the main mesh (the mesh creating the joint) to which the constraint will be connected. Demo: <Playground id="#BGUY#3" title="Main Pivot Example" description="Simple example of using the main pivot."/>
* **connectedPivot**: is the point on the connected mesh (the mesh creating the joint) to which the constraint will be connected.
* **mainAxis**: the axis on the main object on which the constraint will work. <Playground id="#BGUY#51" title="Main Axis Example" description="Simple example of the axis on the main object on which constraints will work."/>
* **connectedAxis**: the axis on the connected object on which the constraint will work.
* **collision**: should the two connected objects also collide with each other. The objects are sometimes forced to be close by and this can prevent constant collisions between them.
* **nativParams**: further parameters that will be delivered to the constraint without a filter. Those are native parameters of the specific physics engine you chose.

You can read further about joint data in this blog article : [WebGL physics-based car using Babylon.js and Oimo.js](https://blog.raananweber.com/2016/09/06/webgl-car-physics-using-babylon-js-and-oimo-js/).

### Interaction with the physics engine

Using `scene.getPhysicsEngine()`, you can get access to functions that will influence the engine directly.

#### Setting the time step

The physics engine assumes a certain frame-rate to be taken into account when calculating the interactions.
The time between each step can be changed to "accelerate" or "slow down" the physics interaction.
Here is the same scene with different time steps - accelerating and slowing down:

- Default time step: <Playground id="#2B84TV" title="Default Time Step Example" description="Simple example of the default time step."/>
- Slowing down: <Playground id="#2B84TV#1" title="Slowing Down Time" description="Simple example of slowing down physics time."/>
- Speeding up: <Playground id="#2B84TV#2" title="Speeding Up Time" description="Simple example of speeding up physics time."/>

#### Setting the scene's gravity

You can change the scene's gravity using the physics engine's `setGravity(vector3)` function.
This can be done in real time, even after setting the gravity:

Playground demo (click to toggle positive/negative gravity) - <Playground id="#A2WGF" title="Playing With Gravity" description="Simple example of manipulating the gravity of a physics engine."/>

#### See it all working together

Marble Tower Playground - <Playground id="#3I55DK#0" title="Marble Tower Demo" description="Fun example showcasing what you can do with physics in your scene."/>