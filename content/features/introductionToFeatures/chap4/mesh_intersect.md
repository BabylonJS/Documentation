---
title: Getting Started - Chapter 4 - Avoiding a Car Crash
image:
description: Learn how to avoid collisions between your characters and cars in the village.
keywords: getting started, start, chapter 4, collisions
further-reading:
video-overview:
video-content:
---

# Getting Started - Avoiding a Car Crash

## Avoiding a Car Crash

The simplest way of seeing if two meshes are in contact is to use the _intersectsMesh_ method, as in

```javascript
mesh1.intersectMesh(mesh2);
```

which will be true if a box bounding mesh1 would overlap with a box bounding mesh2. Each mesh has a built-in bounding box which lies close to the surface of the mesh that is used in checking the intersection of the meshes.

![dudebox](/img/getstarted/dudebox.png) ![carbox](/img/getstarted/carbox.png)

Since the character's walk and the car's journey are not phased together there will be a time when they are in the same place. However it is not possible to predict when the character, taking its long walk around the village, and the car, on its short journey, might intersect. In order to demonstrate the _intersectsMesh_ method we will make the character walk backwards and forwards across the stopping place of the car.

In our case we want the character to stop moving if the car is in a "hit" zone and the character is not. It would, after all, be dangerous for the character to stop if they are both in the danger zone. In our case because of the way the _Dude_ is constructed we need to use one of its children to check intersection. Basically _Dude_ is just a holder node for the head, torso, legs and arms and the box bounding it is too small to be effective in this case..

<Playground id="#KBS9I5#83" title="Basic Collision Detection" description="Detect when a car collides with a box and stop the character's animation." image="/img/playgroundsAndNMEs/gettingStartedCollisions1.jpg"/>

Now make the hit box invisible.

<Playground id="#KBS9I5#84" title="Basic Collision Detection Invisible Box" description="Detect when a car collides with an invisible box and stop the character's animation." image="/img/playgroundsAndNMEs/gettingStartedCollisions2.jpg"/>

This repeated animation looks a bit out off place. Even if we revert back to the character walking around the village the repetition of the car not only looks a bit silly it is also annoying. Let's improve the environment a little so that the car can appear to be driving through the village. We will place the village in a valley with distant hills created from a height map and put a road in for the car to travel along. While we are doing that let's add a sky and some distant trees.
