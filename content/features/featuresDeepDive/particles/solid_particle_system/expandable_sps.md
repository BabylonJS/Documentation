---
title: Expanding Solid Particle Systems
image:
description: Learn how to expand solid particle systems in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles, expandable
further-reading:
video-overview:
video-content:
---

# Expandable Solid Particle System

## Create an expandable SPS

Until now, the SPS that you've created has a fixed number of particles once for all because it's the most performant way to use it.  
In some cases, it may be useful to add or to remove some particles from the SPS after its creation, because they are newly needed or not needed any longer for the rest of the time.  
In this case, you can create an expandable SPS with the optional parameter `expandable: true` (default `false`).

```javascript
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
```

### Adding particles

If you want to add some more particles to the existing ones, then just use again the method `addShape()` as many times as necessary. Then call `buildMesh()` to rebuild the SPS geometry with these newly added particles.

```javascript
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
sps.addShape(model1, 100); // adds 100 particles from model1
sps.buildMesh();

// ... further in the code, when needed
sps.addShape(model2, 100); // adds 100 new particles from model2
sps.addShape(model3, 200); // and 200 particles from model3
sps.buildMesh(); // updates the SPS mesh geometry from the last particle additions
sps.setParticles();
```

Example: <Playground id="#X1T859" title="Adding Particles To A Solid Particle System" description="Simple example of adding particles to a solid particle system."/>
Each mouse click adds 20 new depth sorted particles.

### Removing particles

If you want to remove some particles from the SPS, then use the method `removeParticles(start, end)` where `start` and `end` are the starting and ending indexes of the particles.  
This method returns an array populated with the removed particles.

```javascript
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
sps.addShape(model1, 1000); // adds 1000 particles from model1
sps.buildMesh();

// ... further in the code, when needed
var removed1 = sps.removeParticles(700, 999); // removes the last 300 particles
var removed2 = sps.removeParticles(0, 9); // removes the first 10
sps.buildMesh(); // update the SPS mesh geometry from the last particle additions
sps.setParticles();
```

Example: <Playground id="#0MXVDK" title="Removing Particles From A Solid Particle System" description="Simple example of removing particles from a solid particle system"/>
Each click removes the 2 first and last 100 particles.  
**Important note :** the SPS must contain at least one particle to work, so never empty it completely !

### Storable particles

You may want to create new particles and not to insert them in the SPS on its creation but later. You may also want to keep aside removed particles to put them back in the system later.  
So when creating new particles, you can specify to store them aside from the SPS with the optional parameter `storage: []` of the method `addShape()`.

```javascript
var stock = []; // the array to store the particles
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
sps.addShape(model1, 1); // the SPS needs at least one particle
sps.addShape(model1, 100, { storage: stock }); // stores 100 particles from model1 in the stock array
sps.buildMesh();
```

This SPS contains only one particle. The 100 others are stored in an external array.

If you want now to restore these particles, or some previously removed ones, just use the method `insertParticlesFromArray(array)`.

```javascript
var stock = []; // the array to store the particles in
var sps = new BABYLON.SolidParticleSystem("sps", scene, { expandable: true });
sps.addShape(model1, 1000); // the SPS contains 1000 particles
sps.addShape(model1, 100, { storage: stock }); // 100 others are stored aside
sps.buildMesh();

// ... later in the code
var removed = sps.removeParticles(0, 99); // the 100 first particles are removed and stored in another array
sps.buildMesh();

// ... later again in the code : let's restore the misssing particles
sps.insertParticlesFromArray(removed); // restores the previously removed particles
sps.insertParticlesFromArray(stock); // restores the previously created particles
sps.buildMesh();
sps.setParticles();
```

Each time that you call `insertParticlesFromArray()`, the stored particle objects aren't just referenced in the SPS, they are cloned and the clones are reindexed and given a new identifier.  
This means that you can modify or get rid of the storage array or their contained particle objects with no effect and no risk for the SPS working.  
Example: <Playground id="#HL9PPA" title="Storable Particles Example" description="Simple example of making particles storable."/>
Each click removes 100 particles of a given shape and restore 100 particles of another shape in turn.  
100 particles are stored aside at the SPS creation.

### Notes :

- When you remove particles, the remaining ones are reindexed, meaning that their `particle.idx` value can change. The particle identifier `particle.id` keeps unchanged. If a particle is given a parent and if this parent is removed, then the particle `parent` property value is set to `null`.
- Adding or removing particles will create a new VertexData object, so a new VBO buffer, each time `buildMesh()` is called.  
   This can trigger the Garbage Collector activity at some unwanted moment, so it's not a good idea to add or remove particles each frame.  
   Moreover, using an expandable SPS uses more memory than a fixed one because all the dynamic extensible arrays are saved under the hood along the SPS life.

  In a standard SPS, the particle index `particle.idx` and the particle identifier `particle.id` have the same value.  
  In an expandable SPS (see below), when particles are removed only the particle identifier `particle.id` keeps unchanged whereas the particle index may change.  
  So, when using an expandable SPS, make sure to set a particle parent with the parent identifier and make sure that this parent still exists.

```javascript
if (otherParticle) {
  particle.parentId = otherParticle.id; // not otherParticle.idx
}
```
