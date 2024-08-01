---
title: Getting Started - Chapter 6 - Particle Spray
image: 
description: Learn how to create a basic particle system.
keywords: getting started, start, chapter 6, particles
further-reading:
video-overview:
video-content:
---

# Getting Started - Working With Code

## Particle Spray
In this case particles are small sprites emitted in a cluster, or cloud,  to simulate used to simulate fire, smoke, water, or even faery dust.

The basis for a cloud of particles is the *ParticleSystem*. With this we specify the number of particles to use 
```javascript
const particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);  //scene is optional
```

Particles are emitted from a specifically defined region. Each particle is given a lifetime and when reached it is reused and re-emitted.

They are given a texture, which obviously governs their appearance,

```javascript
particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
```

The basic emitter region is a box of given dimensions around a specified point;
```javascript 
particleSystem.emitter = new BABYLON.Vector3(0, 10, 0); // the point at the top of the fountain
particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // minimum box dimensions
particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // maximum box dimensions
```

Up to three colors can be given in the form (r, g, b, a) for red, green, blue, and alpha. Alpha goes from 0 for fully transparent up to 1 for fully opaque. The first two are combined or blended to set the color of the particle. The method of blending can be specified. The third has the property *colorDead* and is of use when recycling of the particles is set to off. This third property is not needed for our fountain.
```javascript
particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);

particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
```

The size of a particle and its lifetime are within the range set by minimum and maximum values.
```javascript
particleSystem.minSize = 0.1;
particleSystem.maxSize = 0.5;

particleSystem.minLifeTime = 2;
particleSystem.maxLifeTime = 3.5;
```

We also need to set the number of particles emitted per second. Too fast an emittance rate with a long lifetime can result in gaps in the emission of particles.
```javascript
particleSystem.emitRate = 1500;
```

We also set two possible directions for the particles and affect the speed with which the particle travels by giving a minimum and maximum power value and an update speed.
```javascript
particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

particleSystem.minEmitPower = 1;
particleSystem.maxEmitPower = 3;
particleSystem.updateSpeed = 0.025;
```

Setting a negative value for graving in the y component ensures the particles fall downwards.
```javascript
particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
```

Finally we can start the fountain 
```javascript
particleSystem.start();
```

Here is an example of our fountain:

<Playground id="#TC31NV#4" title="Add the Spray" description="Create a basic particle system as water spray." image="/img/playgroundsAndNMEs/gettingStartedParticleSpray1.jpg"/>

Let's now provide an on-off click event.