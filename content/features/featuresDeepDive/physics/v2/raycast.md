---
title: Raycast
image: 
description: How to use Physics for fast raycasting ?
keywords: diving deeper, phyiscs, raycast
further-reading:
    - title: How To Use Forces
      url: /features/featuresDeepDive/physics/forces
video-overview:
video-content:
---

## What is Raycast

In a collision detection scenario, a raycast can be used to determine whether a line of sight exists between two objects or whether a collision is imminent. By casting a ray from one object to another, the physics engine can determine whether the ray intersects with any other objects in its path, allowing the game to determine whether the two objects can "see" each other or whether a collision has occurred.

## Usage

Here is an example of raycast

```javascript
var raycastResult = new BABYLON.PhysicsRaycastResult();
var start = new BABYLON.Vector3(1, 20, 2);
var end = new BABYLON.Vector3(1, -20, 2);
physicsEngine.raycastToRef(start, end, raycastResult);
if (raycastResult.hasHit) {
    console.log("Collision at ", raycastResult.hitPointWorld);
}
```

Important thing to note here is the `raycastResult` that can (and should!) be reused between calls. This is the major difference with Physics V1 raycasting.

The result object has some information about the properties of the intersection, such as the intersection point, and the Physics Body that was hit.

<Playground id="#I6AR8X" title="RayPicking Vs Raycast" description="Compare Raypicking with raycast feature of the Physics Engine" isMain={true} category="Physics"/>
