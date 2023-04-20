---
title: Collisions
image: 
description: How to access Collision Events
keywords: diving deeper, phyiscs
further-reading:
    - title: How To Use Forces
      url: /features/featuresDeepDive/physics/forces
    - title: Observables and Observers
      url: TODO 
video-overview:
video-content:
---

## What is it?

Collision events are often used in game development to trigger events or reactions based on collisions. For example, a collision between a player character and an enemy could trigger damage to the player, while a collision between a player and a collectible item could trigger a pickup event. The collision event system uses the Observable and Observer system, which is also used in other parts of Babylon.js.

## How to use

To use collision callbacks, first, the body needs to have the callback enabled. This can be achieved with `setCollisionCallbackEnabled`. Then, we need to obtain the collision Observable by calling `getCollisionObservable` on the body. You can have either a body-specific callback or a world-wide callback. The second option requires filtering for the correct body to process, but it is more performant.

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

<Playground id="#7JI3E8#1" title="Collision observers" description="Use collision observer to log an output when bodies are colliding"/>

[The properties of the collision event are described in this page](todo add link to collision api docs).
