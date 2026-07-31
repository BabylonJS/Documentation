---
title: Solid Particle System
image: 
description: Learn all about the solid particle system in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles
further-reading:
video-overview:
video-content:
---

# Solid Particle System

The solid particle system (SPS) creates a cloud of particles from one or more base meshes. The resulting system is itself a single mesh that requires a single draw call per frame and has the same properties as any mesh. However, you have to implement the behavior of individual particles yourself through the features and properties provided.

![SPS](/img/features/particle1.webp)

Individual particles are pickable with a pointer, and there are methods to check whether two particles are intersecting. Another feature, digest mesh, takes an existing mesh and turns its triangular facets into particles, allowing a mesh to be 'blown apart', for example.