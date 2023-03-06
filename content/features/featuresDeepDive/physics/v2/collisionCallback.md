---
title: Collision callback
image: 
description: How to use Physics Collision callback for fast and easy physics scene creation.
keywords: diving deeper, phyiscs
further-reading:
    - title: How To Use Forces
      url: /features/featuresDeepDive/physics/forces
video-overview:
video-content:
---

# What is a callback ?

Collision callbacks are often used in game development to trigger events or reactions based on collisions. For example, a collision between a player character and an enemy could trigger damage to the player, while a collision between a player and a collectible item could trigger a pickup event.

# World Callback and Body Callback

Callbacks can be attached to two different objects: The body or the world.
As the name implies, Body Callback will be fored only when there is a collision with that specific Body. World callback are fired when there is a collision for any Body having Collision flag enabled.

# Performance consideration

Body callback are filtered. When the Physics plugin list all the collision in a frame, only those concerned by the Bodies are fired.
This extra filtering/testing is not cheap. If you want to trigger a callback for many Bodies, it will quickly become a bottle neck.
Body callback is an easy mecanism for simpler scene. For complex and heavy physicalized scene, it's important to use World Callback and do the filtering/checking on the user side.

### Enabling Collision callback for a Body

** API call example **

** PG **

### Enabling World Collision and doing the filtering

** Use meta datas added to the body **

** PG **