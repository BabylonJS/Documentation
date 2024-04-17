---
title: Performance Tips
image:
description: A guide on best practices to achieve maximum performance with the Physics V2 API
keywords: diving deeper, physics, performance
further-reading:
video-overview:
video-content:
---

# Performance Tips

## ♻️ Reduce, Reuse, Recycle ♻️

The main point that should be taking advantage of when using the API is to reuse as much objects as possible! For example, if you have a bowling game, instead of disposing and recreating your ball and pins every shot, you could keep the same objects and just reset their positions to the "default" state. By default, when you change the properties of the node associated to a body, there will be no effect. That's because the pre-step of updating the physic body with the values from the transform node is disabled by default, to improve performance. You can solve this by enabling the pre-step for a frame, and then disabling it again next frame:

```javascript
body.disablePreStep = false;
// The position where you want to move the body to
body.transformNode.position.set(1, 2, 3);
scene.onAfterRenderObservable.addOnce(() => {
    // Turn disablePreStep on again for maximum performance
    body.disablePreStep = true;
})
```

Please note that doing so may or may not allow body to get to sleep mode, depending on the Physics Engine.

The reuse part also applies to collision shapes. Since bowling pins have the same shape, you can create only one PhysicsShape for all of them.

## Use simpler shapes

Whenever possible, don't use the entire mesh as a collision shape, especially when it's a very high poly mesh. Try to use [compounds](/features/featuresDeepDive/physics/compounds) or [convex hull shapes](/features/featuresDeepDive/physics/shapes) instead.

## Keep collision observables simple

[Collision observables](/features/featuresDeepDive/physics/collisionEvents) are functions that run every time a body collides with another. Since this can happen as often as every frame, it's important to avoid complex computations, or else the simulation will have to wait for these observables to finish before continuing.

<Playground id="#PX6E6C#25" title="Stress test" description="Instantiate many bodies to test the Physics engine performance" isMain={true} category="Physics"/>

<Playground id="#W3YL7Z#1" title="Convex Hull Vs Mesh Test" description="Compare Convex hull and Mesh shapes"/>
