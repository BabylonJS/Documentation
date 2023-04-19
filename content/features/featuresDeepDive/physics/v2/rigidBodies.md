---
title: Physics V2 core concepts
image: 
description: All the concepts and objects designed for Physics V2 plugins
keywords: shape, body, material
further-reading:
    - title: How To Use Forces
      url: /features/featuresDeepDive/physics/forces
video-overview:
video-content:
---

## Core concepts

Key concepts of a physics engine include Collision Shapes, which define the physical shape of an object and determine how it collides with other objects, and Physic Bodies, which represent physical objects in the simulation, and can have mass, velocity, and other properties. Material properties such as friction, elasticity, and density affect how objects behave when they collide. Other important concepts include Physics Constraints, which enforce specific behaviors between objects, and Forces, which can be applied to objects to simulate gravity, friction, and other effects.

## Body

A physics body is a virtual object that represents a physical object in a simulation, with properties like mass, position, and velocity. Bodies can be *static* or *dynamic*.

### Static Vs Dynamic

Static bodies are fixed in place while dynamic bodies can move and be affected by forces, collisions, and other physics simulations.
A body with a mass of 0 will be static.

### Sleep mode

When creating a body, you can specify it to start in *sleep mode*. Bodies in this mode will have their physics calculations skipped until they collide with another body or a force is applied to them, improving performance at the start. However, *sleep mode is not an absolute guarantee*. Other factors may cause the body to wake up from this mode, so avoid having behavior that depends on it, and use it only as an aid to performance. It is also not possible to put a body back to sleep after it is awake.

### Creating a body

You can create a body using the `PhysicsBody` constructor. It takes the `TransformNode` associated with that body, a motion type (static vs dynamic), a boolean representing if the body will start in sleep mode or not, and a scene (which needs to have an active Physics Engine).

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere");
const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
```

### Setting the mass of a body

A body can have different *mass properties* which affect how it responds to the physics stimuli. These properties are: mass, center of mass, inertia, and inertia orientation. Some physics engines, such as XXX, can automatically determine these properties depending on its shape, so in most cases the only parameter you will need to change is the mass.

```javascript
// Setting only the basic mass properties
const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
body.setMassProperties({
  mass: 1,
});
```

```javascript
// Setting the full mass properties. ONLY DO THIS IF YOU KNOW WHAT YOU'RE DOING!
const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
body.setMassProperties({
  mass: 1,
  centerOfMass: new BABYLON.Vector3(0, 1, 0),
  inertia: new BABYLON.Vector3(1, 1, 1),
  inertiaOrientation: new BABYLON.Quaternion(0, 0, 0, 1)
});
```

### Instanced bodies

For meshes composed of [thin instances](/features/featuresDeepDive/mesh/copies/thinInstances), the body created by the engine is composed of multiple internal body instances. This allows faster rendering along with the physics simulation. All instances must have the same shape, but they can have their own individual mass, have forces and constraints individually applied to them, etc. Methods that can be applied at instance level have an optional `instanceIndex` parameter that receives the index of the instance where the method will be applied to. If no `instanceIndex` is provided, the method will be applied to all instances. An example is here:

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere");

// This generates 3 thin instances based on the sphere mesh
sphere.thinInstanceAddSelf();
sphere.thinInstanceAddSelf();
sphere.thinInstanceAddSelf();

const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, scene);

// Apply a vertical force on all the 3 spheres
body.applyForce(new BABYLON.Vector3(0, 100, 0), new BABYLON.Vector3(0, 0, 0));

// Apply a horizontal force to the first sphere ONLY
body.applyForce(new BABYLON.Vector3(100, 0, 0), new BABYLON.Vector3(0, 0, 0), 0); 
```

#### Limitations

There are a few limitations when using instanced bodies in this way. Currently, it is not supported to have different scales on each thin instance's matrix. It is also not supported to have transformations at the mesh level, i.e, the instanced mesh's position, rotation and scale values have to be the default.

## Shape

A physics shape is a virtual representation of the collision geometry of a physics body, used for collision detection and response. If multiple bodies share the same or similar enough geometry, the same shape can be reused for all of them, greatly increasing performance. A body needs a shape to be able to collide with other objects.

```javascript
const shape = new BABYLON.PhysicsShapeSphere(
  new BABYLON.Vector3(0,0,0), // center of the sphere in local space
  0.5, // radius of the sphere
  scene // containing scene
);
body.shape = shape;
body2.shape = shape;
body3.shape = shape;
// ...
```

The Shape types supported by the V2 Plugin are:

| Enum | Description | Image | XXX plugin support |
| --- | --- | --- | --- |
| SPHERE | Simple sphere | ![Sphere Shape](/img/features/physics/sphere_shape_viewer.png) | ✅ |
| CAPSULE | A cylinder with a half sphere at top and bottom | ![capsule Shape](/img/features/physics/capsule_shape_viewer.png) | ✅ |
| CYLINDER | Cylinder | ![cylinder Shape](/img/features/physics/cylinder_shape_viewer.png) | ✅ |
| BOX | Box | ![box Shape](/img/features/physics/cube_shape_viewer.png) | ✅ |
| CONVEX_HULL | A convex hull is the smallest convex shape containing points.| ![convex_hull Shape](/img/features/physics/convex_hull_shape_viewer.png) | ✅ |
| MESH | Mesh used for rendering or a simpler version | ![mesh Shape](/img/features/physics/mesh_shape_viewer.png) | ✅ |
| CONTAINER | Holder of other shapes | ![container Shape](/img/features/physics/compound_shape_viewer.png) | ✅ |
| HEIGHTFIELD | A height field mesh is a 2D surface with height data. | | 🟥 |

[This page contains more detail about shapes and their parameters.](/features/featuresDeepDive/physics/shapes)

## Material

A Material holds friction and restitution and is associated with a Physics Shape.

Friction is a measure of the resistance to motion between two objects in contact. It describes how much force is needed to move an object against another surface or how much it will slide along that surface. Friction is often used to model the behavior of objects sliding, rolling, or sticking to each other.

Restitution, also known as elasticity or bounciness, is a measure of how much energy is conserved in a collision between two objects. It describes how much an object will bounce back after a collision, relative to how much it was moving before the collision. Restitution is often used to model the behavior of objects bouncing, colliding, or deforming.

Both friction and restitution are non-negative values, usually between 0 and 1, with higher values indicating greater resistance or energy conservation, respectively.

```javascript
const shape = new BABYLON.PhysicsShapeSphere(new BABYLON.Vector3(0,0,0), 0.5, scene);
const material = {friction: 0.2, restitution: 0.3};
shape.material = material;
```

## Disposing of your elements

When a Body or Shape is not needed anymore, it is good practice to dispose of it. This ensures that the Physics Engine doesn't waste time processing what it doesn't need to. You can dispose of them by calling the `dispose` method.

When a node associated to a Body is disposed, the corresponding Body is also disposed. However, *the shape used by the body is not automatically disposed*, as the same shape can be used by multiple bodies.

```javascript
const shape = new BABYLON.PhysicsShapeSphere(
  new BABYLON.Vector3(0,0,0), // center of the sphere in local space
  0.5, // radius of the sphere
  scene // containing scene
);
body.shape = shape;
body2.shape = shape;
body3.shape = shape;

// ...

// When disposing of the scene:
body.dispose();
body2.dispose();
body3.dispose();

// Don't forget to also dispose of the shape when it's not needed anymore!
shape.dispose();
```
