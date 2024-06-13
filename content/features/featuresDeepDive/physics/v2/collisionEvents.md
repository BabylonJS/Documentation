---
title: Collisions
image:
description: How to access Collision Events
keywords: diving deeper, phyiscs
further-reading:
  - title: How To Use Forces
    url: /features/featuresDeepDive/physics/forces
  - title: Observables and Observers
    url: /features/featuresDeepDive/events/observables
video-overview:
video-content:
---

## What is it?

Collision events are often used in game development to trigger events or reactions based on collisions. For example, a collision between a player character and an enemy could trigger damage to the player, while a collision between a player and a collectible item could trigger a pickup event. Collisions can either cause a physical response (like pushing the player back), or not, in which case they are called trigger collisions. The collision event system uses the Observable and Observer system, which is also used in other parts of Babylon.js.

## How to use

There are three types of **collision** events:

- COLLISION_STARTED
- COLLISION_CONTINUED
- COLLISION_FINISHED

And two types of **trigger** events:

- TRIGGER_ENTERED
- TRIGGER_EXITED

To use collision callbacks, first, the body needs to enable it. This can be achieved with `setCollisionCallbackEnabled`, for the COLLISION_STARTED and COLLISION_CONTINUED events, or with `setCollisionCallbackEnded` for the COLLISION_ENDED event. Then, we need to obtain the collision Observable by calling `getCollisionObservable` or `getCollisionEndedObservable` on the body. You can have either a body-specific callback or a world-wide callback. The second option requires filtering for the correct body to process, but it is more performant.

```javascript
// player is a PhysicsBody
player.setCollisionCallbackEnabled(true);

// You have two options:
// Body-specific callback
const observable = player.getCollisionObservable();
const observer = observable.add((collisionEvent) => {
  // Process collisions for the player
});

// OR

// world callback
const observable = plugin.onCollisionObservable;
const observer = observable.add((collisionEvent) => {
  // Check if the player is involved in the collision
  if (collisionEvent.collider === player || collisionEvent.collidedAgainst === player) {
    // Process collisions for the player
    // ...
  }
});
```

As for triggers, you need to mark the **shape** as a trigger by setting the property `isTrigger` to true, and then by creating a body for that shape. There is no body-specific callback for the triggers, only the world-wide callback.

```javascript
shape.isTrigger = true;

// create a body with that shape
// const body = new BABYLON.PhysicsBody(node, ...);

const observable = plugin.onTriggerCollisionObservable;
const observer = observable.add((collisionEvent) => {
  if (collisionEvent.type === "TRIGGER_ENTERED") {
    // do something when the trigger is entered
  } else {
    // do something when trigger is exited
  }
});
```

## Collision filtering

Collisions between 2 bodies can be ignored by using the filtering mechanism on their respective Physics Shapes.

The property `filterMembershipMask` is a bitmask of categories which this shape is a member of.

The property `filterCollideMask` is a bitmask of arbitrary "categories" to which this shape collides with.

Given two shapes, the engine will check if the collide mask and membership overlap:

`shapeA.filterMembershipMask & shapeB.filterCollideMask`

If this value is zero (i.e. shapeB only collides with categories which shapeA is not a member of) then the shapes will not collide.

Note, the engine will also perform the same test with shapeA and shapeB swapped; the shapes will not collide if either shape has a collideMask which prevents collision with the other shape.

## Examples

- Use collision observer to log an output when bodies are colliding: <Playground id="#7JI3E8#1" title="Collision observers" description="Use collision observer to log an output when bodies are colliding"/>

- Using a trigger volume: <Playground id="#M0C2X5#1" title="Triggers" description="Using a trigger volume" />

- Logging the collision events that happen to a body: <Playground id="#Z8HTUN#613" title="Collision events" description="Logging the collision events that happen to a body"/>

- Collision filtering <Playground id="#H4UR4Z#1" title="Collision filtering" description="Filtering collisions that happen to a body"/>
