---
title: Troubleshooting Solid Particle System Visibility Issues
image: 
description: Learn some troubleshooting tips for dealing with common SPS visibility issues in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles, visibility
further-reading:
video-overview:
video-content:
---

# SPS Visibility

To render the meshes on the screen, BJS uses their bounding box (BBox): if the BBox is in the frustum, then the mesh is selected to be rendered on the screen. This method is really performant as it avoids to make the GPU compute things that wouldn't be visible. The BBox of each mesh is recomputed when its World Matrix is updated. This is called **frustum culling**. In the following example image, the green and orange objects are frustum culled.

![Frustum culling](/img/how_to/Particles/frustum-culling.png)

When you create an SPS, unless you use the `positionFunction` at creation time, all its particles are set by default at the position (0, 0, 0). So the bounding box size of the SPS mesh is initially the size of its biggest particle. In the following example image, the size of the entire SPS is taken as just the size of the first red object.

![SPS and bounding box size](/img/how_to/Particles/frustum-culling-2.png)

If you animate your particles without updating the SPS mesh World Matrix, its BBox may keep far more little than the current space occupied by the moving particles. So, if this little BBox gets out of the screen (cam rotation for instance), the whole SPS can then disappear at once! In the following example, once the first red object's bounding box is out of the frustum, the entire SPS mesh will be culled, even through there are still two objects visible by the camera.

![SPS and culling](/img/how_to/Particles/frustum-culling-3.png)

In order to manage the SPS visibility, you have some ways: the methods `SPS.refreshVisibleSize()` or `SPS.setVisibilityBox(size)` and the properties `SPS.isAlwaysVisible`, `SPS.computeBoundingBox`, `SPS.isVisibilityBoxLocked`, and `SPS.autoUpdateSubMeshes`.

- `SPS.refreshVisibleSize()`: updates the SPS mesh BBox size on demand. This is an intensive computation, so it's better not to use it in the render loop each frame. You could call it once the mesh has reached its maximum size for instance. This the method to use if you have an SPS located its in own space somewhere in your scene, like a particle explosion, a fountain, etc. Remember when using this method that it iterates over each mesh vertices. So if your mesh has 20K vertices what is usual with an SPS, it needs 20K iterations.

- `SPS.isAlwaysVisible` (default _false_): if _true_, forces the SPS mesh to be computed by the GPU even if its BBox is not visible. This property is to use when the player evolves inside the SPS (maze, asteroid field) or if the SPS is always bigger than the visible part on the screen. Note that setting it to _true_ doesn't recompute the BBox size, so if you need for some reason (pickability, collisions, etc) to update the BBox, you have to call also at least once `SPS.refreshVisibleSize()`.

- `SPS.computeBoundingBox` (default _false_): if set to true, the next calls to `setParticles()` will compute the mesh bounding box within the same loop as the particle computations.
  The reason `refreshVisibleSize()` and `SPS.computeBoundingBox` exist together is that `refreshVisibleSize()` can be called at any time and doesn't require to call `setParticles()` whereas `SPS.computeBoundingBox` is taken in account for the BBox computation only from a call of `setParticles()`.  
  Note that `SPS.computeBoundingBox` can be set to _true_ or _false_ at any time and will affect only the next calls of `setParticles()`.

- `SPS.setVisibilityBox(size)`: sets a fixed size to the SPS Mesh BBox whatever its own real size. This may be useful when you know in advance the limits that the visible particles won't overrange. Note that setting a value doesn't prevent any further BBox recomputation.

- `SPS.isVisibilityBoxLocked` (default _false_): if _true_, the SPS mesh BBox won't be computed any longer until it is reset to _false_.

- `SPS.autoUpdateSubMeshes` (default _false_): When an SPS contains multiple materials, it creates a SubMesh for each material. When `autoUpdateSubMeshes` is set to _true_, these SubMeshes will be recomputed, along with their bounding boxes, on the next call to `setParticles`.

So what method to use? It depends on your needs.  
If your SPS is ever everywhere around the camera environment like an asteroid field, you may use `SPS.isAlwaysVisible`.  
If you need a variable visibility or the pickability, you'll need to set at least once the bounding box.  
So if your SPS stays within some fixed bounds that you don't know the values, you may use `SPS.refreshVisibleSize()` at least once when the SPS has reached these limits and then lock the visibility box.  
If the SPS keeps within some known limits, then it is better to use `SPS.setVisibilityBox(size)` with the right value and then to lock the visibility box.  
At last, if you still need pickability or variable visibility, and don't know how your SPS will evolve, then you might set `SPS.computeBoundingBox` to true, and `SPS.autoUpdateSubMeshes` if the SPS has multiple materials.

## Particle In Frustum

When the SPS is enabled to manage particle intersections, each particle is given a bounding box and a bounding sphere.  
You can then check whether a particle intersects the camera frustum with the method `particle.isInFrustum(frustumPlanes, [cullingStrategy])` like you would do with meshes.

```javascript
scene.updateTransformMatrix(); // force the plane computation once
var frustumPlanes = scene.frustumPlanes;
// then in some loop ...
if (!particle.isInFrustum(frustumePlanes)) {
  p.alive = false;
}
```

Contrary to the meshes, you can't use `.isInFrustum()` to cull particles that wouldn't be rendered, because all the particles are always rendered, meaning passed to the GPU (even the invisible ones). You can only use this test to customize the process applied to the particles.  
Example: You would want to not compute the particles outside the frustum to gain some performance.  
The test done by `isInFrustum()` has also its own CPU cost, so it's probably not a good idea to run it on thousand particles each frame.  
Actually, it's up to you to choose if the test is worth it for your own need.  
Let's imagine a case where each particle computation is really intensive (example : when using `computeParticleVertex`). In this case, the frustum test could be faster than the particle computation, so it would be interesting to use it to disable the particle computation for particles outside the frustum.  
In this following example, the computation charge is directly related to the number of vertices and shouldn't change whatever the camera direction. But, as we disable the particles outside the frustum, if you rotate the camera to isolate one or two worms in the camera field, you can check the performance gain  
<Playground id="#BKX11Q#2" title="Dealing With Solid Particle Visbility Issues" description="Simple example of how to manage common visibility issues in Solid Particle Systems."/>
Note: the default culling strategy used in the particle frustum test is the fastest (`BoundingSphereOnly`).  
You can change it at will for each particle by using the same values than the static properties `CULLINGSTRATEGY_XXX` ones of the `AbstractMesh` class.
