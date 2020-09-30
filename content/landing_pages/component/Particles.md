# Particles

Babylon.js supports two types of particles. These are sprites using the `ParticleSystem` and meshes using the `Solid Particle System`

## Particle System

![Particles](/img/features/particle0.png)

The particle system uses small 2D sprites, including animated sprites, which always face the camera to simulate effects such as smoke or abstract visual forms such as glitter and faery dust. The clouds of particles produced can be controlled with a wide range of properties including size, life time and emission rates, region and power. Gravity can also be added to the particles. In addition further customization is possible using shader effects and user functions.

Normally when particle 'dies' it is recycled as a particle. Starting from Babylon.js v3.2, you can create sub emitter which lets you spawn a new particle system when a particle dies. Each one of these spawned sub particle systems is totally independent from the parent.

From Babylon.js V3.2, where the browser supports WebGL2, GPU particles are available making full use of the GPU rather than handling some parts of the particle system with the CPU. The `GPUParticleSystem` and the `ParticleSystem` are very similar to use though there are some minor differences and due to the nature of WebGL2 there are a few facilities, such as sub emitters, that are not available. Where used when WebGL2 is not available the `GPUParticleSystem` will fall back to the `ParticleSystem` automatically.

## Solid Particle System

![SPS](/img/features/particle1.png)

The solid particle system (SPS) creates a cloud of particles from one or more base meshes. The resulting system is itself a single mesh requiring a single draw call per frame and has the same properties as any mesh which include positioning, rotatind, texturing etc.. However you have to implement the behaviour of individual particles yourself. There are many features of the SPS that help you to do this based on the index number of the particle. You can affect the position, rotation, quaternion, velocity, color, scaling, pivot, uvs, visibility and life of each particle and parent it to another particle.

There are a number of features available to increase the frame rate, including disabling properties if not required and, if appropriate, using `freeWorldMatrix` and `freezeNormals`. If after initialisation the particles will not change in any way then there are further techniques such as making its updatable property false. Even when particles are not updatable the mesh making up the SPS can still be moved, rotated and scaled. If you want to maintain the flexability of the SPS you can restrict the update to a limited range of particles.

Individual particles are pickable with a pointer and there are methods to check if two particles are intersecting.

Normally the particles and the triangular facets that make them up are rendered in index order and this can cause issues with transparent particles. It is possible to force a depth order sort but this will affect the frame rate so should only be used when really needed.

Yet another feature, digest mesh, is to take an existing mesh and turn its triangular facets into particles, allowing a mesh to be 'blown apart' for example.

## Points Cloud Particle System

<img src = "/img/how_to/particles/points4.jpg" width = "40%">

A points cloud particle system (PCS)  is a single updatable mesh with the the `PointsCloud` property of its material set to `true`. The point particles are simply the vertices of the mesh. As a mesh a PCS has most of the properties of a mesh, The exceptions are those related to its material which is already set and cannot be changed and also anything related to its vertex normals and indices as it does not have any set.  

Particles can be added to a PCS with a function or using an existing mesh as a model, where particles are randomly evenly distributed on either the surface of the model or inside the model.

As a particle system the PCS provides some methods to manage the particles. However it is behavior agnostic. This means it has no emitter, no particle physics, no particle recycler. You have to implement your own behavior. You can create your own behaviors through particle properties such as position and color and methods that allow you to update and recycle the particles. 

There are limitations as particles cannot be destroyed or made invisible.

# Further Reading

## Basic - L1

[Particles Overview](/features/Particles)  

[Particles 101](/babylon101/particles)

[How to Create Animated Particles](/how_to/Animate)  
[How to Use Sub Emitters](/how_to/Sub_Emitters)

[Solid Particle System](/How_To/Solid_Particles)  
[Points Cloud Particle System](/How_To/point_Cloud_Particles)

## Intermediate - L2
[How to Customize the Particle System](/how_to/Customise)
