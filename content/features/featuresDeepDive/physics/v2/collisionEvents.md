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

# What is it?

Collision events are often used in game development to trigger events or reactions based on collisions. For example, a collision between a player character and an enemy could trigger damage to the player, while a collision between a player and a collectible item could trigger a pickup event. The collision event system uses the Observable and Observer system, which is also used in other parts of Babylon.js

# How to use

To use collision callbacks, first, the body needs to have the callback enabled. This can be achieved with `setCollisionCallbackEnabled`. Then, we need to obtain the collision Observable by calling `getCollisionObservable` on the body. This Observable is however **NOT** body-specific, meaning that it is fired by **ALL** collision events triggered by enabled bodies. The reason for not having a body specific callback is related to performance, as doing this by default is very taxing on the plugin side.  