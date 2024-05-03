---
title: Particle System Intro
image:
description: Scratch the surface of how particles and particle systems work in Babylon.js.
keywords: diving deeper, particles, particle system
further-reading:
video-overview:
video-content:
---

## An Introduction to the Particle System

The creation of a particle system requires a name and a capacity, which is the max number of particles alive at the same time in the system. The system is designed to produce particles that emit at a given rate, move and last for a set lifetime before they are re-cycled and re-emitted.

```javascript
const myParticleSystem = new BABYLON.ParticleSystem("particles", capacity, scene); //scene is optional and defaults to the current scene
```

### Texture
Before the particles in the system can be seen, they need to be assigned a texture. This same texture will be used for every particle in the system. By default, the entire texture will be mapped to each particle, though there are some advanced techniques which allow us to use only a portion of the texture for the particle. These techniques can be found in the [Animating Particles](/features/featuresDeepDive/particles/particle_system/animation) section which details how your texture can be used as a sprite sheet. 

### Emitter
We also need to tell the particle system a location from which the particles will emit. This is called the emitter and it can be represented by a mesh, an abstract mesh, or even a simple Vector3 position in your scene. The emitter itself is just the base position for emission and in the case of a mesh or an abstract mesh we use the mesh position to determine where particles will emit. Coupled with the emitter is the [Emitter Shape](/features/featuresDeepDive/particles/particle_system/shape_emitters) that determines the region from which particles can emit. We could use a [Box Emitter Shape](/features/featuresDeepDive/particles/particle_system/shape_emitters#box-emitter) with an abstract mesh assigned as the particle system emitter to give us particles that emit from a random point within a box located at the position of the abstract mesh. This is a good way to animate an emitter as the abstract mesh could be the target of a Babylon animation. On each animation frame the emitter location will be updated and new particles will emit within the emitter shape located at the new position of the abstract mesh.

### Example
The following code samples show the bare minimum needed to create a particle system.

```javascript
myParticleSystem.particleTexture = new BABYLON.Texture("path to texture");

myParticleSystem.emitter = mesh; // a mesh or abstract mesh in the scene
// or
myParticleSystem.emitter = point; //a Vector3

myParticleSystem.start(); //Starts the emission of particles
```

To stop the emission use

```javascript
myParticleSystem.stop();
```

While this stops the emission of new particles the ones already emitted will continue to exist up to their time limit. To stop and clear particles at the same time use

```javascript
myParticleSystem.stop();
myParticleSystem.reset(); //Reset to empty system
```

Minimal particle system <Playground id="#0K3AQ2#3" title="Minimal Particle System" description="Simple example of creating a minimal particle system." isMain={true} category="Particles"/>

You can do this all in one line using the _ParticleHelper_ to create a default configured particle system.

Default particle system using the helper: <Playground id="#0K3AQ2#4" title="Default Particle System Using The Helper" description="Simple example of using the particle helper to create the default particle system."/>

Emit particles from a box position: <Playground id="#0K3AQ2#5" title="Emit Particles From a Box Position" description="Simple example showing how to set a particle emission point to a box's position." isMain={true} category="Particles"/>

By fixing the size of the emission region you can constrain the emission region. The values used will depend on the size of the emitted particles and the size of the region. The center of an emitted particle could be inside a box, say close to the edge, yet the particle could be big enough for its perimeter to be outside the box.

Emit particles from wholly inside the box: <Playground id="#0K3AQ2#7" title="Emit Particles From Completely Inside a Box" description="Simple example showing how to make particles emit from completely inside of a box."/>

When you want the particle system to start after 3 seconds for example you use one of the following

```javascript
myParticleSystem.start(3000); //time in milliseconds

myParticleSystem.startDelay = 3000;
```

Delayed start particle system: <Playground id="#0K3AQ2#8" title="Particle System With a Delayed Start" description="Simple example showing how to create a particle system and delay its start."/>

To run the particle system for a limited time you use

```javascript
myParticleSystem.targetStopDuration = 5;
```

The target duration before the system stops is dependent of the how fast the particles system updates the particles frames. The faster the update speed the shorter time before the system stops. You set the update speed using

```javascript
myParticleSystem.updateSpeed = 0.01;
```

Once stopped you can dispose of the particle system. Very useful if you want to create a one shot particle system with a specific targetStopDuration.

```javascript
myParticleSystem.disposeOnStop = true;
```

## Pre-warming

Starting with Babylon.js v3.3, you can now specify a pre-warming period to make sure your system is in a correct state before rendering.

To do so, you need to setup two properties:

- `system.preWarmCycles`: Gets or sets a value indicating how many cycles (or frames) must be executed before first rendering (this value has to be set before starting the system). Default is 0 (ie. no pre-warming)
- `system.preWarmStepOffset`: Gets or sets a value indicating the time step multiplier to use in pre-warm mode (default is 1)

So if you set your system like this:

```
system.preWarmCycles = 100;
system.preWarmStepOffset = 5;
system.start();
```

It will execute the particle animation loop 100 times with a time step set to 5 times faster than real time. The more cycles you want, the slower the system will be to start. So it could be interesting to increase the time step to have fewer cycles to run. But keep in mind that a too big time step will introduce issues if the lifetime of a particle is smaller than the time step.

Here is an example of pre-warming: <Playground id="#MX2Z99#8" title="Particle Pre-Warming Example" description="Simple example of pre warming particles."/>

## Particle Texture

To apply a texture to the particles, such as  
![Flare](/img/how_to/Particles/Flare.png)

set the `particleTexture`

```javascript
myParticleSystem.particleTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
```

You can also apply a mask to a texture to filter some colors, or filter a part of the alpha channel.

```javascript
myParticleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
```

This example produces the following  
![TextureMask](/img/how_to/Particles/12-1.png)

To use multiple textures in the scene use multiple particle systems all of which can use the same emitter object.

## Noise texture

Starting with Babylon.js v3.3, you can now use noise texture to "perturbate" the position of particles. The noise texture is technically used to apply change to the direction of the particles:

```
var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
noiseTexture.animationSpeedFactor = 5;
noiseTexture.persistence = 2;
noiseTexture.brightness = 0.5;
noiseTexture.octaves = 2;

particleSystem.noiseTexture = noiseTexture;
particleSystem.noiseStrength = new BABYLON.Vector3(100, 100, 100);
```

Alongside setting the noiseTexture you can also control the strength applied on each axis with _particleSystem.noiseStrength_.

Adjustable noise: <Playground id="#R1JWLA#3" title="Changing Particle Direction With Noise" description="Simple example of changing particle direction based on a noise texture."/>

## Local space

If the emitter is a mesh and you set `particleSystem.isLocal = true` then all particles will be generated into the mesh local space (so rotation or transforming the mesh will transform the entire particle system).

Demo: <Playground id="#LNRAI3" title="Particles In Local Space" description="Simple example showing how to make particles emit in local space."/>

## World offset

Starting with Babylon.js v4.0, you can set up a world offset to your particles with:

```javascript
particleSystem.worldOffset = new BABYLON.Vector3(100, 20, -453);
```

This command will shift the particles using the offset (Mostly used when you need to keep the camera at the center of the world to increase precision and then move the world instead).

So far we have barely touched the surface of the particle system. There is a wide range of properties to find out about to further tune the particle system.
