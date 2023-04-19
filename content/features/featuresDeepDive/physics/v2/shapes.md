---
title: Physics V2 Shapes
image: 
description: Describing Shapes
keywords: shape, body, material
further-reading:
video-overview:
video-content:
---

# Shapes

## What are they

Physics Shapes represent the geometry that a body will have when interacting with the world. Depending on the chosen shape, the body will react differently to colliding with other objects. Even if the visual mesh of an object is composed of many triangles, if it has a simple enough physics shape, its collisions can be computed quickly.

In general, the convex hull gives the best performance while also matching the visual geometry as best as possible. However, if you have highly concave meshes, which would be unsuitable for a convex shape, it's still possible to use a container with multiple simpler shapes. 

## Available shapes and parameters

This section demonstrates how to create the available Physics Shapes and their parameters. Note that the shape parameters are determined in a **LOCAL** coordinate system, in other words, they don't depend on the body or mesh's position, rotation or scaling in the world:

```javascript
const shape = new BABYLON.PhysicsShapeSphere(
    new BABYLON.Vector3(0, 0, 0),   // center of the sphere
    1,                              // radius of the sphere
    scene                           // scene of the shape
);
```

![Sphere Shape](/img/features/physics/sphere_shape.png) A sphere is probably the simplest shape that can be simulated. The sphere is described by a single point for the center and a radius.

```javascript
const shape = new BABYLON.PhysicsShapeCylinder(
    new BABYLON.Vector3(0, -0.5, 0),    // starting point of the cylinder segment
    new BABYLON.Vector3(0,  0.5, 0),    // ending point of the cylinder segment
    1,                                  // radius of the cylinder
    scene                               // scene of the shape
);
```

![Cylinder Shape](/img/features/physics/cylinder_shape.png) A cylinder shape is described by two points and a radius. It's a great choice for barrels, wheels, and glasses.

```javascript
const shape = new BABYLON.PhysicsShapeCapsule(
    new BABYLON.Vector3(0, -0.5, 0),    // starting point of the capsule segment
    new BABYLON.Vector3(0,  0.5, 0),    // ending point of the capsule segment
    1,                                  // radius of the capsule
    scene                               // scene of the shape
);
```

![Capsule Shape](/img/features/physics/capsule_shape.png) Capsules are similar to cylinders, but have two half-spheres on each end. These are a great choice for character limbs (sometimes called ragdolls.)

```javascript
const shape = new BABYLON.PhysicsShapeBox(
    new BABYLON.Vector3(0, 0, 0),        // center of the box
    new BABYLON.Quaternion(0, 0, 0, 1),  // rotation of the box
    new BABYLON.Vector3(1, 1, 1),        // dimensions of the box
    scene                                // scene of the shape
);
```

A box is exactly how it sounds - a box. It has a size, a center, and an orientation. This is a great choice for boxes, books, walls or anything that needs to be flat.

```javascript
const shape = new BABYLON.PhysicsShapeConvexHull(
    mesh,   // mesh from which to produce the convex hull
    scene   // scene of the shape
);
```

A convex hull is the most versatile of the physics shapes. A convex object is one where you can draw a line between any two vertices without leaving the shape. While most real-world objects are not convex, for the purposes of physics simulation, this is a great approximation for most objects. The input mesh can be concave - the physics engine will calculate the convex part of the geometry.

```javascript
const shape = new BABYLON.PhysicsShapeMesh(
    mesh,   // mesh from which to calculate the collisions
    scene   // scene of the shape
);
```

A mesh shape is simply a collection of triangles. All the triangles in the input mesh will become triangles in the physics engine. This is a great choice for your static bodies, as generally, those static bodies represent highly concave objects, so this will give the closest match to your render geometry. Be aware that when two complex mesh shapes collide with each other, it might require the physics engine to calculate collisions between a huge triangles, which can slow down the simulation.


```javascript
const shape = new BABYLON.PhysicsShapeContainer(
    scene   // scene of the shape
)
```

A container shape doesn't have any geometry by itself, however, it does allow any other shape to be added as a child, with an additional transform. If none of the other shape types are suitable to match your render geometry, you can use a container and add a number of simpler shapes to approximate your visual mesh.

[The Container has its own page](/features/featuresDeepDive/physics/compounds) for more information.
