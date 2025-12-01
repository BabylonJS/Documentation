---
title: Physics character controller
image:
description: How to use the character controller
keywords: diving deeper, physics
further-reading:
  - title: Performance Tips
    url: /features/featuresDeepDive/physics/perfTips
video-overview:
video-content:
---

## What is it

A character controller is a specialized component designed to manage the movement and interactions of a character within a game world. Conceptually, it resides between the game/experiment code and the physics engine.

## Creating a Controller

Users can either create and provide a Physics shape to the controller or let it create a capsule by providing its dimensions

```javascript
let h = 1.8;
let r = 0.6;
let displayCapsule = BABYLON.MeshBuilder.CreateCapsule("CharacterDisplay", { height: h, radius: r }, scene);
let characterPosition = new BABYLON.Vector3(3, 0.3, -8);
let characterController = new BABYLON.PhysicsCharacterController(characterPosition, { capsuleHeight: h, capsuleRadius: r }, scene);
```

## moveWithCollisions

`moveWithCollisions` is a sync function that move the character to the targeted position taking care of collision along the way.

<Playground id="WO0H1U#165" title="Character Controller moveWithCollisions" description="Character Controller moveWithCollisions" />

## Kinematic platforms

Physics bodies of `PhysicsMotionType.ANIMATED` can interact with the character. This allows the creation of lift, platforms,...

<Playground id="WO0H1U#166" title="Character Controller animated platform" description="Character Controller animated platform" />

## Observable

Custom collision observable allows to get specific to the character controller collision information.

```javascript
characterController.onTriggerCollisionObservable.add((event)=>{
    console.log(`Character collision : ${event.collider.transformNode.name} at ${event.impulsePosition.toString()} `);
});
```
Here, event type is `ICharacterControllerCollisionEvent` and contains informations about the collider, position and impulse.

<Playground id="WO0H1U#169" title="Character Controller collision observer" description="Character Controller collision observer" />

## The loop

There are 3 major steps:

- Getting the support: on what surface the character is
- Setting the desired velocity: What the character velocity is based on its properties and state
- Tick update on the controller

Then, it's possible to get the character position using `characterController.getPosition()` and set a skinned mesh position, for example.

In the following example, velocity is function of the character state. That state can be `START_JUMP`, `IN_AIR` or `ON_GROUND`. These different steps allow to have different behaviors and different movement speeds.
Depending on user needs, it's possible to have speed and velocity control for swimming, for example.

Main loop can be summarized with these calls:

```javascript
const support = characterController.checkSupport(dt, down);
const desiredLinearVelocity = getDesiredVelocity(dt, support, characterCurrentOrientation, characterCurrentVelocity);
characterController.setVelocity(desiredLinearVelocity);
characterController.integrate(dt, support, characterGravity);
const newPosition = characterController.getPosition();
```

The test room PG provides an example to compute the desired velocity based on a finite state.

<Playground id="WO0H1U#13" title="Character Controller testing room" description="Character Controller testing room" />
