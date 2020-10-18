# Solid Particles System

The solid particle system (SPS) creates a cloud of particles from one or more base meshes. The resulting system is itself a single mesh requiring a single draw call per frame and has the same properties as any mesh. However you have to implement the behaviour of individual particles yourself, through the features and properties made available.

![SPS](/img/features/particle1.png)

Individual particles are pickable with a pointer and there are methods to check if two particles are intersecting. Another feature, digest mesh, is to take an existing mesh and turn its triangular facets into particles, allowing a mesh to be 'blown apart' for example.