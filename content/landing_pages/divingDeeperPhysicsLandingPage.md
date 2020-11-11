---
title: Physics
image: 
description: Learn all about the powerful physics capabilities of Babylon.js.
keywords: diving deeper, phyiscs
further-reading:
video-overview:
video-content:
---

# Support for Physics Engines

Physics engines are third party external programs that can be plugged into Babylon.js. They, depending on their features, emulate "real-life" interactions between objects, which can be meshes, solid particles from the solid particle system or some cameras. One feature of a Physics Engine is the addition of gravity to a scene.

There are plugins for 3 physics engines:

1. Cannon.js - a wonderful physics engine written entirely in JavaScript
2. Oimo.js - a JS port of the lightweight Oimo physics engine
3. Ammo.js - a JS post of the bullet physics engine

All need to be enabled before use.

Interactions between objects are achieved by imposters, simple objects that are attached to any complex objects with a scene. The imposter can be assigned physical attributes such as mass, friction, a coefficient of restitution, impulse, and linear and angular 

Two imposters can be connected using joints such as a hinge or ball and socket.

Ammo also allows the creation of soft bodies.