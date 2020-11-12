---
title: Optimizing Solid Particle Systems
image: 
description: Learn best practices for optimizing solid particle systems in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles
further-reading:
video-overview:
video-content:
---

# Optimize a Solid Particle System
Previously we saw how to use a SPS to optimize a scene containing multiple copies of a model mesh provided the model properties remained fixed. Now we will look at ways of optimizing when the particles are animated.

1. Only update some particles on each render frame;
2. Use the SPS *vars* property to re-use variables and limit garbage collection.

## Restrict the Number of Particles Updated

For any solid particle animation *setParticles()* is called on every render frame. When you have a large big SPS with dozens of thousands particles to improve performance you can restrict the number of particles to update each frame. There are three parameters you can use with *setParticles* to enable you to do this. They are

| parameter | definition                                                                        | default value   |
| --------- | --------------------------------------------------------------------------------- | --------------- |
| start     | _(number)_ the index from where to start to iterate in the `particles` array      | 0               |
| stop      | _(number)_ the index (included) where to stop to iterate in the `particles` array | nbParticles - 1 |
| update    | _(boolean)_ to force the SPS mesh vertex buffer to be updated                     | true            |

If you pass a *stop** value greater than *nbParticles - 1*, the iteration will stop anyway at *nbParticles - 1* to prevent access to undefined elements.

Example 1 : you may want to update your 10K particle mesh only every three frames

- frame 1 : `setParticles(0, 3300, false)` computes everything for particles from 0 to 3300 and doesn't update the mesh.
- frame 2 : `setParticles(3301, 6600, false)` computes everything for particles from 3301 to 6600 and doesn't update the mesh.
- frame 3 : `setParticles(6601, 9999, true)` computes everything for particles from 6601 to 9999 and finally updates the mesh.

10,000 boxes updated per bunch of 3500 here: <Playground id="#2V1C4Z#12" title="10,000 Boxes Updated Per Bunch of 3500" description="Example of optimizing a scene to render 10,000 boxes updated per bunch of 3500." image=""/>

Example 2 : you could keep, say, the first 5000 particles as unused ones and compute the particle behavior only for the last 5000 lasts in your global pool.

### Limit Garbage Collection

In Javascript, the Garbage Collector is usually your friend : it takes care about cleaning up all the not any longer needed variables you could have declared and thus it sets the memory free.  
However, it can sometimes become an awkward friend because it can start its cleaning just while you are displaying a very smooth animation, so it takes the CPU for itself and leaves to you only those nice lags on the screen.  
In order to avoid unpredictable GC pauses, it's best to avoid allocating new objects in loops that execute often, where particles are created or updated.  
For example, *updateParticle()* is often called each frame for each particle or each particle vertex. Now imagine that you have a SPS with 30 000 particles. Suppose you write code like this to add a particle acceleration :

```javascript
SPS.updateParticle = function(particle) {
  const accel = new BABYLON.Vector3(0, 0.5, 0);
  particle.velocity = particle.velocity.add(accel);
  // ...
};
```

Code like the above would create two new `Vector3` objects each call, or 60 000 new objects over the course of the update. And although modern JS engines are quite good at cleaning up short-lived objects, it's best not to unnecessarily strain the GC this way.  
Instead, make your update loops reuse variables that were declared outside the loop, and don't call any methods inside the loop that create new objects:

```javascript
let accel = new BABYLON.Vector3(0, 0.5, 0);
SPS.updateParticle = function(particle) {
  particle.velocity.addInPlace(accel);
  // ...
};
```

SPS also has a *vars* property, which is an object that you can use to store any variables you want to reuse. Any variables you store there will share the SPS' lifecycle, and get cleaned up when you dispose it:

```javascript
SPS.vars.tempVector = new BABYLON.Vector3(0, 0, 0);
// ...
SPS.dispose(); // cleans explicitly all your SPS.vars !
```

A good JS practice for the compiler is to **never** change the variable type once it has been set :

```javascript
SPS.vars.myFloat = 0.01; // just keep setting float values to myFloat afterwards
SPS.vars.myInt = 5; // just keep setting integer values to myInt afterwards
SPS.vars.myString = "foo"; // just keep setting string values to myString afterwards
```

Here is an implementation of a simple particle IA called "flocking" what a behavior of association, then cohesion and separation. This example uses *SPS.vars* to allocate the memory used for results only once instead of in-function temporary variables.  
 <Playground id="#2FPT1A#35" title="Solid Particle System Optimization" description="Simple example of a flocking behavior in an optimized solid particle system." image=""/>