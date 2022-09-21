---
title: Physics and Solid Particles
image:
description: Learn how to add physics to solid particle systems in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles, physics
further-reading:
video-overview:
video-content:
---

## Particle Intersections

The SPS is physics agnostic. This means you need to implement your own particle behavior if you want to animate them.  
For this, you may need to check if the solid particles intersect or not other ones or other meshes in the scene. Example : you would know if your particles collide against an obstacle and then make them bounce back.  
The SPS provides a simple way to deal with particle intersections. As this feature consumes more memory and CPU, it's disabled by default.  
Enable it explicitly with the parameter `particleIntersection` when creating your SPS :

```javascript
var SPS = new SolidParticleSystem("sps", scene, { particleIntersection: true });
```

Then you can simply call the method `intersectsMesh(<SolidParticle | AbstractMesh>target)` of any solid particle to check if this particle intersects the _target_.  
It just will return true or false if the particle intersects or not the target.

```javascript
// for instance, in your SPS.updateParticle(p) function : particle / particle
if (p.intersectsMesh(otherParticle)) { // change p velocity vector }
```

You can pass the method `intersectsMesh()` either a solid particle object, either a standard BJS mesh. Both work the same.

```javascript
// for instance, in your SPS.updateParticle(p) function : particle / mesh
if (p.intersectsMesh(anyMesh)) { // change p velocity vector }
```

Beware that invisible solid particles can still intersect, exactly like meshes do. So it's up to you to test the particle visibility (`isVisible`), if you want to exclude it from an intersection computation.

If you prefer, you can even use the `AbstractMesh` method `intersectsMesh()` and pass it a solid particle.

```javascript
// for instance, in your SPS.updateParticle(p) function : mesh / particle
if (someMesh.intersectsMesh(p)) { // change p velocity vector }
```

Under the hood, when creating a SPS with `particleIntersection`, a bounding box and a bouding sphere are given to each solid particle.  
For performance reasons, the particle intersections are always computed the fastest way, it is to say with Axis Aligned Bounding Boxes (AABB). [More Details on Intersection Collisions](/divingDeeper/mesh/interactions/mesh_intersect)

If you use the `AbstractMesh` `intersectsMesh()` method, what allows to force OBB computation (precise mode), only the mesh bounding box will be rotated, not the particle one, so the intersection detection will be just a bit better than in AABB mode.  
The precise mode has a CPU significant cost, so it's not recommended to use it with solid particles.

```javascript
// for instance, in your SPS.updateParticle(p) function : precise mode, mesh / particle
if (someMesh.intersectsMesh(p, true)) { // change p velocity vector }
```

Example: <Playground id="#10RCC9" title="Physics and Solid Particles Example 1" description="Simple example of adding physics to solid particles."/>

For a SPS having thousands of particles, computing the bounding box for each particle each frame is still a heavy CPU operation. So, if you need more performance and if you don't mind about the intersection accurary, you may choose to limit the computation to the particle bounding sphere only (a bounding box requires 8 iterations per particle, one for each box vertex) by using the optional boolean parameter `boundingSphereOnly` (default _false_) at SPS creation.

```javascript
var SPS = new SolidParticleSystem("sps", scene, {
    particleIntersection: true,
    boundingSphereOnly: true,
});
```

Example: <Playground id="#2BXZC#2" title="Physics and Solid Particles Example 2" description="Simple example of adding physics to solid particles."/>

As you may know, a mesh -so a solid particle- is inside its bounding box and its bounding box is inside its bounding sphere. So the bounding sphere is bigger than the bounding box, what is bigger than the mesh.  
If your particles look like some some tiny spherical objects and if you use the `boundingSphereOnly` mode, you would probably like to tweak the bounding sphere to make it closer to the embedded particle.  
You can then use the parameter `bSphereRadiusFactor`, a float number that is multiplied by the current bounding sphere radius.  
Imagine that your particle is a spherical shape with a radius of R. Its bounding sphere radius is then by default : R \* sqrt(3). So if you multiply the bounding sphere radius by 1 / sqrt(3), the bounding sphere will get the same radius than the particle one and both will exactly match.

```javascript
var SPS = new SolidParticleSystem("sps", scene, {
    particleIntersection: true,
    boundingSphereOnly: true,
    bSphereRadiusFactor: 1 / Math.sqrt(3),
});
```

Example: <Playground id="#29F0EG#2" title="Physics and Solid Particles Example 3" description="Simple example of adding physics to solid particles."/>

At last, in case you are using the `boundingSphereOnly` mode, just remember that the particle bounding box isn't computed, only its bouding sphere, so don't test the intersection from a **mesh** object :

```javascript
// boundingSphereOnly case :
mesh.intersectsMesh(particle); // won't give the right result
particle.intersectsMesh(mesh); // will give the right bounding sphere intersection
```
