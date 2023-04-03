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

Key concepts of a physics engine include collision shapes, which define the physical shape of an object and determine how it interacts with other objects. Bodies represent physical objects in the simulation, and can have mass, velocity, and other properties. Material properties such as friction, elasticity, and density affect how objects behave when they collide. Other important concepts include constraints, which enforce specific behaviors between objects, and forces, which can be applied to objects to simulate gravity, friction, and other effects.

## Body

A physics body is a virtual object that represents a physical object in a simulation, with properties like mass, position, and velocity. Bodies can be *static* or *dynamic*.

### Static Vs Dynamic

Static bodies are fixed in place while dynamic bodies can move and be affected by forces, collisions, and other physics simulations.
A body with a mass of 0 will be static.

### Creating a body

You can create a body using the `PhysicsBody` constructor. It takes the `TransformNode` associated with that body, a motion type (static vs dynamic), and a scene (which needs to have an active Physics Engine).

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere");
const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, scene);
```

### Setting the mass of a body

A body can have different *mass properties* which affect how it responds to the physics stimuli. These properties are: mass, center of mass, inertia, and inertia orientation. For some Physics Engines, they can automatically determine these properties depending on its shape, and in most cases, the only parameter you will need to change is the mass. 

```javascript
const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, scene);
body.setMassProperties({
  mass: 1,
  centerOfMass: new BABYLON.Vector3(0, 1, 0),
  inertia: new BABYLON.Vector3(1, 1, 1),
  inertiaOrientation: new BABYLON.Quaternion(0, 0, 0, 1)
});
```

## Shape

A physics shape is a virtual representation of the collision geometry of a physics body, used for collision detection and response. If multiple bodies share the same or similar enough geometry, the same shape can be reused for all of them, greatly increasing performance. Every body needs a shape to be affected by physics.

```javascript
const shape = new BABYLON.PhysicsShapeSphere(
  new BABYLON.Vector3(0,0,0), // center of the sphere in local space
  0.5, // radius of the sphere
  scene // containing scene
);
body.shape = shape;
```

The Shape types support by the V2 Plugin are:
| Enum | Description | Image |
| --- | --- | --- |
| SPHERE | Simple sphere | |
| CAPSULE | A cylinder with a half sphere at top and bottom | |
| CYLINDER | Cylinder | |
| BOX | Box | |
| CONVEX_HULL | A convex hull is the smallest convex shape containing points.| |
| CONTAINER | Holder of other shapes | |
| MESH | Mesh used for rendering or a simpler version | |
| HEIGHTFIELD | A height field mesh is a 2D surface with height data. | |

We describe them and their parameters in more detail in the following page: **TODO: Have a separate page for shapes**

## Material

A Material holds friction and restitution and is associated with a Physics Shape.

Friction is a measure of the resistance to motion between two objects in contact. It describes how much force is needed to move an object against another surface or how much it will slide along that surface. Friction is often used to model the behavior of objects sliding, rolling, or sticking to each other.

Restitution, also known as elasticity or bounciness, is a measure of how much energy is conserved in a collision between two objects. It describes how much an object will bounce back after a collision, relative to how much it was moving before the collision. Restitution is often used to model the behavior of objects bouncing, colliding, or deforming.

Both friction and restitution can be defined as values between 0 and 1, with higher values indicating greater resistance or energy conservation, respectively.

```javascript
const shape = new BABYLON.PhysicsShapeSphere(new BABYLON.Vector3(0,0,0), 0.5, scene);
const material = {friction: 0.2, restitution: 0.3};
shape.material = material;
```

## Disposing of your elements

When a Body or Shape is not needed anymore, it is good practice to dispose of it. This ensures that the Physics Engine doesn't waste time processing what it does not need to. You can dispose of them by calling the `dispose` method.

When a node associated to a Body is disposed, the corresponding Body is also disposed. However, *the shape used by the body is not automatically disposed*, as the same shape can be used by multiple bodies. 