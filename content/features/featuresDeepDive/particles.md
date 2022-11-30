---
title: Particles
image: 
description: Dive into the rich and exciting world of particles in Babylon.js.
keywords: diving deeper, particles
further-reading:
video-overview:
video-content:
---

## Particles

Babylon.js supports three types of particles. These are based on sprites, meshes and points.

The particle system uses small 2D sprites which may be animated and always face the camera to simulate effects such as smoke. The clouds of particles produced can be controlled with a wide range of properties. This differs from the other two systems as it has parameters to control its behavior whilst the others have to have behavior coded. From Babylon.js V3.2, where the browser supports WebGL2, GPU particles are available. These make full use of the GPU though there are some restrictions in its use. When WebGL2 is not available the *GPUParticleSystem* will fall back to the *ParticleSystem* automatically.


The solid particle system (SPS) combines one or more base meshes into a single mesh requiring a single draw call per frame. There are many features available that allow you to control the behavior of the individual mesh particles.

A points cloud particle system (PCS) is a single updatable mesh and uses a material property to display its vertices as pixel squares of a size you set. The points cloud system provides some methods to manage the individual particles.

Also, as of version 5.X.Y, a new fluid rendering component has been added to the `Scene` class that allows you to render a particle system (`ParticleSystem`, `GPUParticleSystem` or some custom vertex buffers) as a fluid.
