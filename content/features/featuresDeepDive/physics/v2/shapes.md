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

Physics Shapes represent the form that a body will have when interacting with the world. Depending on the chosen shape, the body will react differently to colliding with other objects. Even if a mesh is composed of many triangles, if it has a simple enough shape, its collisions can be computed cheaply. However, it won't respond as realistically as if using a shape that conforms closely to the mesh.

## Available shapes and parameters

This section demonstrates how to create the available Physics Shapes and their parameters. Note that the shape parameters are determined in a **LOCAL** coordinate system, in other words, they don't depend on the body or mesh's position, rotation or scaling in the world:

```javascript
const shape = new BABYLON.PhysicsShapeSphere(
    new BABYLON.Vector3(0, 0, 0),   // center of the sphere
    1,                              // radius of the sphere
    scene                           // scene of the shape
);
```

![Sphere Shape](/img/features/physics/sphere_shape.png);

```javascript
const shape = new BABYLON.PhysicsShapeCapsule(
    new BABYLON.Vector3(0, -0.5, 0),    // starting point of the capsule segment
    new BABYLON.Vector3(0,  0.5, 0),    // ending point of the capsule segment
    1,                                  // radius of the capsule
    scene                               // scene of the shape
);
```

![Capsule Shape](/img/features/physics/capsule_shape.png);

```javascript
const shape = new BABYLON.PhysicsShapeCylinder(
    new BABYLON.Vector3(0, -0.5, 0),    // starting point of the cylinder segment
    new BABYLON.Vector3(0,  0.5, 0),    // ending point of the cylinder segment
    1,                                  // radius of the cylinder
    scene                               // scene of the shape
);
```

![Cylinder Shape](/img/features/physics/cylinder_shape.png);

```javascript
const shape = new BABYLON.PhysicsShapeBox(
    new BABYLON.Vector3(0, 0, 0),        // center of the box
    new BABYLON.Quaternion(0, 0, 0, 1),  // rotation of the box
    new BABYLON.Vector3(1, 1, 1),        // dimensions of the box
    scene                                // scene of the shape
);
```

```javascript
const shape = new BABYLON.PhysicsShapeConvexHull(
    mesh,   // mesh from which to produce the convex hull
    scene   // scene of the shape
);
```

```javascript
const shape = new BABYLON.PhysicsShapeMesh(
    mesh,   // mesh from which to produce the convex hull
    scene   // scene of the shape
);
```

```javascript
const shape = new BABYLON.PhysicsShapeContainer(
    scene   // scene of the shape
)
```

[The Container has its own page.](/features/featuresDeepDive/physics/compounds)
