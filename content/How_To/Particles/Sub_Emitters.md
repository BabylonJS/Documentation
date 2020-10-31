# Sub Emitters

Starting from Babylon.js v3.2, you can create sub emitters which let you spawn a new particle from an existing particle. Each one of these spawned sub particle systems is totally independent from the parent.

**Note:** Sub emitters are NOT supported in GPU particles.

# How To Use Sub Emitters

The list of sub particle systems to be used as sub emitters is kept in an array and assigned top the new property `subEmitters` of the appropriate system. 

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

Specifying an array of arrays of sub emitters will choose a random array and all the sub emitters in the chose array will be attached to the spawned particle.
```javascript
particleSystem.subEmitters = [[subEmitter],[subEmitter, subEmitter2, subEmitter3], [subEmitter4]];
```

# END sub emitter type
When a particle dies one of the particle systems in the array is selected at random as the one to be spawned. It is then cloned and rendered. Any element of the array can itself have `subEmitters` and hence a chain of sub emitters can be formed. In this case the property `manualEmitCount` could be used to avoid an infinite loop of creating and spawning new systems.

# ATTACHED sub emitter type
When a particle is spawned this emitter will be cloned and attached to the new particle. This can be used to create a trailing particle effect on new particles.

To support attached sub emitter's to have their orientation accounted for when emitting particles, their emitter must be a mesh type:
```javascript
subEmitter.particleSystem.emitter = new BABYLON.Mesh("", scene);
```

# Active Sub Systems
Each particle system with that has sub emitters also has a property `activeSubSystems` which is an array containing all currently active sub particle systems.

You can stop the root `ParticleSystem` and all `activeSubSystems` by calling the stop function on the root system:

```javascript
particleSystem.stop(); 
```

When you want to stop the root system without affecting the `activeSubSystems`, you pass false to the Stop function:

```javascript
particleSystem.stop(false);
```

# Demos

* [Sub Emitters](https://www.babylonjs-playground.com/#T0L01N#47)
* [On death only - Sub Emitters](https://www.babylonjs-playground.com/#9NHBCC#1)
* [Complete example (hit Space to launch a barrel)](https://playground.babylonjs.com/#7HH1UH)

# Further Reading

# Basic - L1

[Particles Overview](/features/Particles)  

[Particles 101](/babylon101/particles)

[How to Create Animated Particles](/how_to/Animate)  

[Solid Particle System](/How_To/Solid_Particles)

# Intermediate - L2
[How to Customize the Particle System](/how_to/Customise)

