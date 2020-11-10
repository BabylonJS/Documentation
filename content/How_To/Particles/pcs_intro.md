---
title: The Point Cloud Particle System
image: 
description: Dive into the point cloud particle system in Babylon.js.
keywords: diving deeper, point cloud, point cloud system, particle
further-reading:
video-overview:
video-content:
---

# Points Cloud Particle System (PCS)

A PCS is a single updatable mesh with the the `PointsCloud` property of its material set to `true`. The point particles are simply the vertices of the mesh. As a mesh a PCS has most of the properties of a mesh, The exceptions are those related to its material which is already set and cannot be changed and also anything related to its vertex normals and indices as it does not have any set.

As a particle system the PCS provides some methods to manage the particles. However it is behavior agnostic. This means it has no emitter, no particle physics, no particle recycler. You have to implement your own behavior.

Particles can be added to a PCS with a function or using an existing mesh as a model, where particles are randomly evenly distributed on either the surface of the model or inside the model.

The expected usage is:

-   First, create your PCS with `new PointsCloudSystem()`.
-   Then, add particles in the PCS, using one of `addPoints(number, function)`, `addSurfacePoints(mesh, number, method)` or `addVolumePoints(mesh, number, method)`.
-   Redo the additions as many times as needed. Each addition creates a new group of particles identified by `particle.groupID`.
-   When done, build the PCS mesh with `buildMeshAsync()`.
-   Changes to particle properties can be achieved with the `initParticles()` or `updateParticle(particle)` methods and a call to `setParticles`.
-   Particle animation can be accomplished by defining their individual behavior in `updateParticle(particle)` and calling `setParticles()` within the render loop.

## Limitations

The way the PCS is created using vertex points with a pre-applied material with `PointsCloud` set to true means that:

1. Particles cannot be destroyed and particles off screen are still enabled;
2. Transparency does not work on individual particles.
