---
title: Managing A Point Cloud System
image: 
description: Learn all point cloud system management in Babylon.js.
keywords: diving deeper, point cloud, point cloud system, management
further-reading:
video-overview:
video-content:
---

# PCS Management

As you can see above the `setParticles()` function is used in theBabylon.js render loop to provide behavior to the PCS.

Available custom functions of PCS are:

| Function                  | Usage                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| initParticles()           | sets the initial particle properties.                                                                               |
| updateParticle(particle)  | sets the particle properties. This function is called per particle by `PCS.setParticles()`                          |
| recycleParticle(particle) | re-sets the particle properties. This function is called conditionally per particle by `PCS.updateParticles()`      |
| beforeUpdateParticles()   | lets you do things within the call to `PCS.setParticles()` just before iterating over all the particles.            |
| afterUpdateParticles()    | lets you do things within the call to `PCS.setParticles()` just after the iteration over all the particles is done. |

The pseudo-code for `setParticles` is

```javascript
function setParticles() {
    beforeUpdateParticles();
    for (let p = 0; p < nbParticles; p++) {
        updateParticles(particles[p]);
    }
    afterUpdateParticles();
}
```

The particle properties that can be set are :

Available properties of PCS are

| Property                | Usage                                                                                                          | Default |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | ------- |
| particles               | An array containing all the particles. You iterate over this array in `initParticles()` function for instance. |         |
| nbParticles             | The number of particles in the PCS.                                                                            |         |
| counter                 | A counter for your own usage                                                                                   | 0       |
| computeParticleRotation | Allows ( default) or prevents `setParticle` computing particle.rotation                                        | true    |
| computeParticleTexture  | Allows ( default) or prevents `setParticle` computing particle.uvs                                             | true    |
| computeParticleColor    | Allows ( default) or prevents `setParticle` computing particle.color                                           | true    |
| computeBoundingBox      | Allows or prevents (default) `setParticle` computing the PCS mesh bounding box                                 | false   |

The particle properties of color, uvs and rotation are set either during the addition phase or by using `initParticles` and then `setParticles`. Updating particle properties requires the use of `updateParticle` which is called by `setParticles`. Setting the **_compute_** properties to false prevents `setParticles()` from updating the value of the relevant particle property when it is called. Setting one or more of these to false can increase fps, especially with repeated call to `setParticles` within the render loop.

If you don't need your PCS any longer, you can dispose it to free the memory

```javascript
PCS.dispose();
PCS = null; // tells the garbage collector the reference can be also cleaned up
```

## Start and End Indexes for setParticles()

For performance reasons you may not want to compute the properties of all the particles each frame. There are three optional parameters for `setParticles()` that you can use to choose a range of particles to compute or not : `start`, `end`, `update`

| Parameter | Definition                                                                            | Default         |
| --------- | ------------------------------------------------------------------------------------- | --------------- |
| start     | _(number)_ the index from where to start to iterate in the `particles` array          | 0               |
| stop      | _(number)_ the index (included) where to stop to iterate in the<br/>`particles` array | nbParticles - 1 |
| update    | _(boolean)_ to force the PCS mesh vertex buffer to be updated                         | true            |

If you pass a `end` value greater than `nbParticles` - 1, the iteration will stop at `nbParticles` - 1 to prevent you from trying to access to undefined elements.

Example 1 : to only update 10000 particles mesh every three frames

-   frame 1 : `setParticles(0, 3300, false)` computes everything for particles from 0 to 3300 and doesn't update the mesh.
-   frame 2 : `setParticles(3301, 6600, false)` computes everything for particles from 3301 to 6600 and doesn't update the mesh.
-   frame 3 : `setParticles(6601, 9999, true)` computes everything for particles from 6601 to 9999 and finally updates the mesh.

In this playground change _invSpeed_ (line 29) to change speed.

-   <Playground id="#UI95UC#25" title="Start And End For Animation Speed" description="Simple example of setting a start and end to a system's animation speed."/>

Example 2 : you could keep, say, the first 5000 particles as unused ones and compute the particle behavior only for the last 5000 in your global pool - `setParticles(5000, 9999, true)` computes everything for particles from 5000 to 9999 and updates the mesh.

-   <Playground id="#UI95UC#26" title="Start And End For Part Animation" description="Simple example of setting a start and end to a part's animation"/>


## Hints and Tips

A PCS can iterate over a very large number of particles during a call to `updateParticle` and it would be nice to avoid any apparent pauses in scene generation. The JavaScript Garbage Collector can start its cleaning in the middle of what you want to be a very smooth animation and produce lags. One possibility of lessening these is avoid creating new objects in the loops that execute often, where particles are created or updated.

For example, consider a PCS with, say, 30000 particles where you change their velocities

```javascript
pcs.updateParticle = function (particle) {
    var accel = new BABYLON.Vector3(0, 0.5, 0);
    particle.velocity = particle.velocity.add(accel);
    // ...
};
```

will create two new `Vector3` objects each call, or 60 000 new objects over the course of the update.

Instead, make your update loops reuse variables that are declared outside the loop, and don't call any methods inside the loop that create new objects, for example

```javascript
var accel = new BABYLON.Vector3(0, 0.5, 0);
pcs.updateParticle = function (particle) {
    particle.velocity.addInPlace(accel);
    // ...
};
```

A PCS also has a `vars` property, which is an object that you can use to store any variables you want to reuse. Any variables you store there will share the PCS lifecycle, and get cleaned up when you dispose it:

```javascript
pcs.vars.tempVector = new BABYLON.Vector3(0, 0, 0);
// ...
pcs.dispose(); // cleans explicitly all your PCS.vars !
```