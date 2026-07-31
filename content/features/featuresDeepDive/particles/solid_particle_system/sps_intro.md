---
title: An Introduction To The Solid Particle System
image: 
description: Learn the basics of the solid particle system in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles
further-reading:
video-overview:
video-content:
---

# An Introduction to the Solid Particle System

The Solid Particle System, SPS, is a single updatable mesh rendered with one draw call. It is built by combining multiple copies of one or more model meshes which become the particles of the system. Once the SPS is built, it has the same properties as any other Babylon.js mesh - no more, no less. It can be scaled, rotated, translated, lit, textured, etc.

As a system of particles, it provides some methods to manage the particles. However, unlike the standard particle system, it provides no built-in behaviors. It has no emitters, no particle physics, no particle recycler, and no particle movement. You have to implement your own behaviors. 

Once you have one or more mesh models as a basis for the particles, follow these steps:

- First, create your SPS with `new SolidParticleSystem(name, scene)`;
- then, add a number of particles to the SPS from a mesh model with `addShape(model, number)`;
- redo this as many times as needed with any model;
- When done, build the SPS mesh with `buildMesh()`.

Your SPS is then ready to manage its particles by:

- initializing their positions, colors, etc. with `initParticles()`;
- updating the SPS and drawing it with `setParticles()`.

When you want to animate the particles by changing their properties over time, you need to:
- define their individual behavior with `updateParticle(particle)`;
- call `setParticles()` within the render loop.

Let's create an example:

```javascript
const SPS = new SolidParticleSystem("SPS", scene); // scene is required
const sphere = BABYLON.MeshBuilder.CreateSphere("s", {});
const poly = BABYLON.MeshBuilder.CreatePolyhedron("p", { type: 2 }, scene);
SPS.addShape(sphere, 20); // 20 spheres
SPS.addShape(poly, 120); // 120 polyhedrons
SPS.addShape(sphere, 80); // 80 other spheres
sphere.dispose(); //free memory
poly.dispose(); //free memory

const mesh = SPS.buildMesh(); // finally builds and displays the SPS mesh
```
At this stage, all the particles are displayed at the origin. To separate them, we need to initialize some properties. You can access the individual particles through the *particles array*, whose length is given by *nbParticles*.

We set up a function to initialize the particles:

```javascript
// initiate particles function
SPS.initParticles = () => {
    for (let p = 0; p < SPS.nbParticles; p++) {
        const particle = SPS.particles[p];
        //Place particles at random positions with a cube
      	particle.position.x = BABYLON.Scalar.RandomRange(-50, 50);
        particle.position.y = BABYLON.Scalar.RandomRange(-50, 50);
        particle.position.z = BABYLON.Scalar.RandomRange(-50, 50);
    }
};
```

Then call it to initialize the particles, followed by *setParticles* to actually reconfigure the SPS mesh geometry and vertex data

```javascript
//Update SPS mesh
SPS.initParticles();
SPS.setParticles();
```

A basic SPS: <Playground id="#GLZ1PX#1" title="A Basic Solid Particle System" description="Simple example of a basic solid particle system."/>
Colored Green: <Playground id="#GLZ1PX#2" title="Green Colored Solid Particle System" description="Simple example of a green colored solid particle system."/>
With Texture: <Playground id="#GLZ1PX#3" title="Solid Particle System With Textures" description="Simple example of a solid particle system with textures."/>

In addition to position, you can also set properties such as color or UV values. More on managing particles later in this section.

Color individual particles: <Playground id="#GLZ1PX#4" title="Individually Colored Solid Particles" description="Simple example of individually colored solid particles."/>
Texture individual particles: <Playground id="#GLZ1PX#5" title="Individually Textured Solid Particles" description="Simple example of individually textured solid particles"/>

While it can be useful to have an SPS that will not change, for example to represent an asteroid field or city buildings:

![Immutable](/img/how_to/Particles/sps1.webp)  

there is much more you can do with an SPS.
