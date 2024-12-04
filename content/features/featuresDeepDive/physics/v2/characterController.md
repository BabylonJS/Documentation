---
title: Physics character controller
image: 
description: How to use the character controller
keywords: diving deeper, phyiscs
further-reading:
    - title: Performance Tips
      url: /features/featuresDeepDive/physics/perfTips
video-overview:
video-content:
---

## What is it

A character controller is a specialized component designed to manage the movement and interactions of a character within a game world. Conceptualy, it resides between the game/experiment code and the physics engine.

## Creating a Controller

User can either create and provide a Phsyics shape to the controller or let it create a capsule byt providint its dimensions

```javascript
let h = 1.8;
let r = 0.6;
let displayCapsule = BABYLON.MeshBuilder.CreateCapsule("CharacterDisplay", {height: h, radius: r}, scene);
let characterPosition = new BABYLON.Vector3(3., 0.3, -8.);
let characterController = new BABYLON.PhysicsCharacterController(characterPosition, {capsuleHeight: h, capsuleRadius: r}, scene);
```

## The loop

There are 3 major steps:
- Getting the support: on what surface the character is
- Setting the desired velocity: What the character velocity based on its properties and state
- Tick update on the controller

Then, it's possible to get the character position using `characterController.getPosition()` and set a skinned mesh position for example.

In the following example, velocity is function of the character state. That state can be `START_JUMP`, `IN_AIR` or `ON_GROUND`. These different steps allow to have different behaviors and different movement speeds.
Depending on user needs, it's possible to have speed and velocity control for swimming, for example.

Main loop can summarize with these calls:

```javascript
const support = characterController.checkSupport(dt, down);
const desiredLinearVelocity = getDesiredVelocity(dt, support, characterCurrentOrientation, characterCurrentVelocity);
characterController.setVelocity(desiredLinearVelocity);
characterController.integrate(dt, support, characterGravity);
const newPosition = characterController.getPosition();
```

The test room PG provides an example to compute the desired velocity based on a finite state.

<Playground id="WO0H1U#12" title="Character Controller testing room" description="Character Controller testing room" />
