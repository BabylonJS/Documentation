---
title: Troubleshooting Solid Particle System Transparency Issues
image: 
description: Learn some troubleshooting tips for dealing with common SPS transparency issues in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles, visibility
further-reading:
video-overview:
video-content:
---

# Transparency Concerns

As you know, the SPS is a standard mesh.

Applying the transparency to a standard mesh leads to well-known issues, not when visualizing other opaque or transparent meshes through this current transparent mesh, but when visualizing some parts of this transparent mesh through itself.  
Indeed, when passing the mesh geometry to the GPU, this one draws the mesh in the order the mesh facets are sorted in the `indices` array : first triangle, second one then, etc ... whatever the position of the camera.  
The shader only respects the geometry order and this geometry is fixed.

As the SPS is a standard mesh, it has the same issue when dealing with transparent particles (rotate the camera): <Playground id="#EPBTB7#3" title="Understanding SPS Transparency Issues" description="Simple example showing common transparency issues with solid particles." image=""/>

A parameter allows you to sort the internal mesh geometry live according to the current camera position: <Playground id="#EPBTB7#2" title="Sorting Mesh Geometry Based On Camera" description="Simple example of dealing with sorting issues live, based on the camera position." image=""/>

It sorts the SPS particles only, not all the facets, for performance reasons.

To enable it, just create your SPS with the parameter `enableDepthSort` to `true`. By default, each next call to `setParticles()` will then sort the particles according to the camera global position.

If for some reasons (immobile camera and sps), you want to stop (or reactivate) the sort on the next calls to `setParticles()`, just set the property `sps.depthSortParticles` to `false` (or `true` to reactivate it) .

Note well that is better to not enable the particle depth sort and the [facet depth sort](/divingDeeper/mesh/facetData#facet-depth-sort) in the same time, else the sort process wil be executed twice with no final gain.  
So just choose what kind of sorting you need : at particle level (faster) or at facet level (more accurate).

Note also that the particle sort **can't work** with the MultiMaterials.

```javascript
// create a particle depth sort enabled SPS
var sps = new BABYLON.SolidParticleSystem("sps", scene, {
  enableDepthSort: true
});

// then later, only do ...
sps.setParticles(); // and the particle are depth sorted each call

// We can skip the sorting at any time (or reactive it) : sps and camera not moving anymore
sps.depthSortParticles = false; // true by default when enableDepthSort is set to true
```

**Notes :**

- This feature is CPU intensive, so call `setParticles()` with `depthSortParticles` set to true only when needed.
- This feature requires the SPS to be updatable, so it can't work with an immutable SPS.
- This features needs to sort all the particles from the pool, so it won't lead to weird results if you call `setParticles(start, end)` on some particles only.