# Particles

Babylon.js supports three types of particles. These are based on sprites, meshes and points.

The particle system uses small 2D sprites which may be animated and always face the camera to simulate effects such as smoke or abstract visual forms such as glitter and faery dust. The clouds of particles produced can be controlled with a wide range of properties including size, life time and emission rates, region and power. Gravity can also be added to the particles. 

![Particles](/img/features/particle0.png)


From Babylon.js V3.2, where the browser supports WebGL2, GPU particles are available. These make full use of the GPU though there are some restrictions in its use. When WebGL2 is not available the `GPUParticleSystem` will fall back to the `ParticleSystem` automatically.

The solid particle system (SPS) creates a cloud of particles from one or more base meshes. The resulting system is itself a single mesh requiring a single draw call per frame and has the same properties as any mesh. However you have to implement the behaviour of individual particles yourself, through the features and properties made available.

![SPS](/img/features/particle1.png)

Individual particles are pickable with a pointer and there are methods to check if two particles are intersecting. Another feature, digest mesh, is to take an existing mesh and turn its triangular facets into particles, allowing a mesh to be 'blown apart' for example.


A points cloud particle system (PCS)  is a single updatable mesh with the the `PointsCloud` property of its material set to `true`. The point particles are simply the vertices of the mesh. As a mesh a PCS has most of the properties of a mesh, The exceptions are those related to its material which is already set and cannot be changed and also anything related to its vertex normals and indices as it does not have any set.

<img src = "/img/how_to/particles/points4.jpg" width = "40%">
  
Particles can be added to a PCS with a function or using an existing mesh as a model, where particles are randomly evenly distributed on either the surface of the model or inside the model.

As a particle system the PCS provides some methods to manage the particles, such as setting position, color and updating and recycling 
