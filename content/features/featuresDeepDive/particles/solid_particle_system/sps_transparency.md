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

Applying transparency to a standard mesh leads to well-known issues, not when viewing other opaque or transparent meshes through this transparent mesh, but when viewing parts of this transparent mesh through itself.  
Indeed, when the mesh geometry is passed to the GPU, the GPU draws the mesh in the order the mesh facets are sorted in the `indices` array: first triangle, then the second one, and so on, whatever the camera position.  
The shader only respects the geometry order and this geometry is fixed.

As the SPS is a standard mesh, it has the same issue when dealing with transparent particles (rotate the camera): <Playground id="#EPBTB7#3" title="Understanding SPS Transparency Issues" description="Simple example showing common transparency issues with solid particles."/>

A parameter allows you to sort the internal mesh geometry live according to the current camera position: <Playground id="#EPBTB7#2" title="Sorting Mesh Geometry Based On Camera" description="Simple example of dealing with sorting issues live, based on the camera position."/>

It sorts the SPS particles only, not all the facets, for performance reasons.

To enable it, just create your SPS with the parameter `enableDepthSort` set to `true`. By default, each subsequent call to `setParticles()` will then sort the particles according to the camera's global position.

If, for some reason (an immobile camera and SPS), you want to stop or reactivate sorting on the next calls to `setParticles()`, just set the property `sps.depthSortParticles` to `false` (or `true` to reactivate it).

Note that it is better not to enable both particle depth sorting and [facet depth sorting](/features/featuresDeepDive/mesh/facetData#facet-depth-sort) at the same time, or the sort process will be executed twice with no final benefit.  
So just choose what kind of sorting you need : at particle level (faster) or at facet level (more accurate).

Note also that the particle sort **can't work** with the MultiMaterials.

```javascript
// create a particle depth sort enabled SPS
var sps = new BABYLON.SolidParticleSystem("sps", scene, {
  enableDepthSort: true
});

// then later, only do ...
sps.setParticles(); // and the particles are depth sorted on each call

// We can skip the sorting at any time (or reactivate it): sps and camera not moving anymore
sps.depthSortParticles = false; // true by default when enableDepthSort is set to true
```

**Notes :**

- This feature is CPU intensive, so call `setParticles()` with `depthSortParticles` set to true only when needed.
- This feature requires the SPS to be updatable, so it can't work with an immutable SPS.
- This feature needs to sort all the particles from the pool, so it will lead to weird results if you call `setParticles(start, end)` on only some particles.