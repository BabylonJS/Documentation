---
title: Physics
image:
description: Learn all about the powerful physics capabilities of Babylon.js.
keywords: diving deeper, physics
further-reading:
video-overview:
video-content:
---

# Support for Physics Engines

Physics engines are third-party external programs that can be plugged into Babylon.js. Depending on their features, they emulate "real-life" interactions between objects, which can be meshes, solid particles from the solid particle system, or some cameras. One feature of a physics engine is the addition of gravity to a scene.

There are 2 physics architectures in Babylon.js.

- a Version 2 (V2 for short) with support for modern Physics Engines.

  > [🚀 You can find the V2 API documented here.](/features/featuresDeepDive/physics/usingPhysicsEngine)  

- Version 1 (V1 for short), which is a pre-6.0 Legacy API.

  > [⚠️ The documentation for V1 has been moved to the Legacy section.](/legacy/physics)

#### We strongly recommend using V2 over V1. [A migration guide is here](/features/featuresDeepDive/physics/migrate).

## Physics V2

There are plugins for 1 physics engine:

1. Havok - a powerful engine used in AAA games.

It needs to be enabled before use.

This architecture allows finer-grained control over your physics scene by distinguishing between collision shapes and physical bodies.
A typical use case is to have one collision shape used by numerous bodies.
This allows a lower memory footprint and more efficient memory addressing.
A special effort has been put into better performance for a huge number of bodies. This is also the case for the collision callback mechanism.

A broad overview of the Physics V2 advancements is available on this [Medium article](https://medium.com/@babylonjs/physics-v2-overview-ed36039ce1e7).

## Physics V1

There are plugins for 3 physics engines:

1. Cannon.js - a wonderful physics engine written entirely in JavaScript.
2. Oimo.js - a JS port of the lightweight Oimo physics engine.
3. Ammo.js - a JS port of the bullet physics engine.

All need to be enabled before use.

Interactions between objects are achieved by impostors, simple objects that are attached to complex objects in a scene. The impostor can be assigned physical attributes such as mass, friction, a coefficient of restitution, impulse, and linear and angular velocity.

Two imposters can be connected using joints such as a hinge or ball and socket.

Ammo also allows the creation of soft bodies.
