---
title: Sub Emitters
image: 
description: Learn about sub emitters in Babylon.js.
keywords: diving deeper, particles, particle system, sub emitters
further-reading:
    - title: Particles Overview
      url: /features/featuresDeepDive/particles/particle_system
    - title: Particles 101
      url: /features/featuresDeepDive/particles
    - title: How to Create Animated Particles
      url: /features/featuresDeepDive/particles/particle_system/animation
    - title: Solid Particle System
      url: /features/featuresDeepDive/particles/solid_particle_system
    - title: How to Customize the Particle System
      url: /features/featuresDeepDive/particles/particle_system/customizingParticles
video-overview:
video-content:
---

# Sub Emitters

Starting from Babylon.js v3.2, you can create sub emitters, which let you spawn a new particle from an existing particle. Each one of these spawned sub particle systems is totally independent from the parent.

**Note:** Sub emitters are not supported in GPU particles.

## How To Use Sub Emitters

The list of sub particle systems to be used as sub emitters is kept in an array and assigned to the `subEmitters` property of the appropriate system.

```javascript
// Create sub emitter
var subEmitter = new BABYLON.SubEmitter(subParticleSystem);
// Have the sub emitter spawn the particle system when the particle dies
subEmitter.type = BABYLON.SubEmitterType.END;
// Set the +Y direction of the sub emitter equal to the direction the particle is/was heading
subEmitter.inheritDirection = true;
// How much of the existing particles speed should be added to the emitter particles
subEmitter.inheritedVelocityAmount = 1;

particleSystem.subEmitters = [subEmitter];
```

Specifying an array of arrays of sub emitters will choose a random array, and all the sub emitters in the chosen array will be attached to the spawned particle.

```javascript
particleSystem.subEmitters = [[subEmitter],[subEmitter, subEmitter2, subEmitter3], [subEmitter4]];
```

## END Sub Emitter Type

When a particle dies, one of the particle systems in the array is selected at random as the one to be spawned. It is then cloned and rendered. Any element of the array can itself have `subEmitters`, and hence a chain of sub emitters can be formed. In this case, the property `manualEmitCount` could be used to avoid an infinite loop of creating and spawning new systems.

## ATTACHED Sub Emitter Type

When a particle is spawned, this emitter will be cloned and attached to the new particle. This can be used to create a trailing particle effect on new particles.

To support attached sub emitters having their orientation accounted for when emitting particles, their emitter must be a mesh type:

```javascript
subEmitter.particleSystem.emitter = new BABYLON.Mesh("", scene);
```

## Active Sub Systems

Each particle system that has sub emitters also has a property `activeSubSystems`, which is an array containing all currently active sub particle systems.

You can stop the root `ParticleSystem` and all `activeSubSystems` by calling the `stop` function on the root system:

```javascript
particleSystem.stop(); 
```

When you want to stop the root system without affecting the `activeSubSystems`, you pass `false` to the `stop` function:

```javascript
particleSystem.stop(false);
```

## Demos

<Playground id="#T0L01N#47" title="Sub Emitters" description="Simple example of sub emitters."/>
<Playground id="#9NHBCC#1" title="Sub Emitters On Death Only" description="Simple example of sub emitters on death only."/>
<Playground id="#7HH1UH#6" title="Complete Example (Hit Space To Launch a Barrel)" description="Complete sub emitter example."/>
