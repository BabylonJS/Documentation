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

# Core concepts

Key concepts of a physics engine include collision shapes, which define the physical shape of an object and determine how it interacts with other objects. Bodies represent physical objects in the simulation, and can have mass, velocity, and other properties. Material properties such as friction, elasticity, and density affect how objects behave when they collide. Other important concepts include constraints, which enforce specific behaviors between objects, and forces, which can be applied to objects to simulate gravity, friction, and other effects.

## Body

A physics body is a virtual object that represents a physical object in a simulation, with properties like mass, position, and velocity.

** center of mass **

## Shape

A physics shape is a virtual representation of the collision geometry of a physics body, used for collision detection and response.

Here are the Shape types support by the V2 Plugin:
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

** pivot/ center **

# Material

A Material holds friction and restitution and is associated with a Physics Shape.
Friction is a measure of the resistance to motion between two objects in contact. It describes how much force is needed to move an object against another surface or how much it will slide along that surface. Friction is often used to model the behavior of objects sliding, rolling, or sticking to each other.

Restitution, also known as elasticity or bounciness, is a measure of how much energy is conserved in a collision between two objects. It describes how much an object will bounce back after a collision, relative to how much it was moving before the collision. Restitution is often used to model the behavior of objects bouncing, colliding, or deforming.

Both friction and restitution can be defined as values between 0 and 1, with higher values indicating greater resistance or energy conservation, respectively.