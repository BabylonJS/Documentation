---
title: Forces
image: 
description: Learn all about applying physical forces in Babylon.js.
keywords: diving deeper, phyiscs, forces
further-reading:
    - title: How To Use The Physics Engines
      url: /features/featuresDeepDive/physics/usingPhysicsEngine
video-overview:
video-content:
---

## How to use it

Both forces and impulses don't have any effect on bodies whose mass is 0.

```javascript
body.applyForce(
    new BABYLON.Vector3(0, 10, 0), // direction and magnitude of the applied force
    new BABYLON.Vector3(0, 0, 0) // point in WORLD space where the force will be applied    
);

// .... OR .....

body.applyImpulse(
    new BABYLON.Vector3(0, 10, 0), // direction and magnitude of the applied impulse
    new BABYLON.Vector3(0, 0, 0) // point in WORLD space where the impulse will be applied    
);
```

A reminder that, if a body's transform node contains Thin Instances, you can choose which instance to apply the force/impulse by passing `instanceIndex` as a parameter:

```javascript
// Apply a force to the first instance ONLY
body.applyForce(new BABYLON.Vector3(100, 0, 0), new BABYLON.Vector3(0, 0, 0), 0); 
```

If no index is applied, the force/impulse is applied to all instances.

## Difference between a force and an impulse

A force is a continuous effect that is applied to an object over time, which can change the object's velocity or direction of motion. For example, a force could be used to simulate gravity, wind resistance, or a player pushing an object.

An impulse, on the other hand, is a sudden, instantaneous effect that changes the velocity of an object. It is a specific amount of force applied over a very short duration of time, often modeled as a single frame in a game. For example, a collision between two objects might generate an impulse that changes the direction and speed of both objects.

In summary, a force is a *continuous* effect over time, while an impulse is a sudden, *instantaneous* effect that changes the velocity of an object. Click on the sphere in the following examples to experiment with forces and impulses

<Playground id="#R66K4K#1" title="applyForce" description="An example of using applyForce" category="Physics"/>

<Playground id="#Z8HTUN#677" title="applyImpulse" description="An example of using applyImpule" category="Physics"/>



## Physics Helper

The helper assists you with creating some phenomena like radial explosions or vortices.

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
setTimeout(() => gravitationalFieldEvent.disable(), 3000);

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
setTimeout(() => updraftEvent.disable(), 5000);

// or

var vortexEvent = physicsHelper.vortex(
    origin,
    radius,
    strength,
    height
);
// the second `radius` argument can also act as options: `.vortex(origin, { radius: radius, strength: strength, height: height, centripetalForceThreshold: 0.7, centripetalForceMultiplier: 5, centrifugalForceMultiplier: 0.5, updraftForceMultiplier: 0.02 })`
vortexEvent.enable();
setTimeout(() => vortexEvent.disable(), 5000);
```

*For a more detailed explanation, please take a look at the playground example below.*

<Playground id="#E5URLZ#20" title="Physics helpers" description="Show how to use physics helpers and add various effects with forces" isMain={true} category="Physics"/>
