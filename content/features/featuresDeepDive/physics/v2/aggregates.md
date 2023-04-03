---
title: Aggregates
image: 
description: How to use Physics Aggregate for fast and easy physics scene creation.
keywords: diving deeper, phyiscs
further-reading:
    - title: How To Use Forces
      url: /features/featuresDeepDive/physics/forces
video-overview:
video-content:
---

# Physics Aggregate

## What is an Aggregate

The Physics Aggregate is a compound object that contains a Body, a Shape and a Material. It's a helper that allows creating all the object necessary to physicalize your scene with just one call.
In that sense, it's similar to Physics V1 Impostors, but with more control.
Once created, you can easily get the individual parts and tweak them.

## How to use it

Here is an example

```javascript
const sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
const aggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.ShapeType.SPHERE, { mass: 1 }, scene);
```

This is very similar to the Physics V1 Impostor.
At aggregate creation, a body, a shape and a material are instanciated all at once. This however means you can't reuse shapes for aggregates. This can have effects on performance.

## Tweaking and accessing Body, Shape and Material

You can access the individual physics components by using the accessors:

```javascript
const aggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.ShapeType.SPHERE, { mass: 1 }, scene);
aggregate.body.setMassProperties({mass: 10});
```

## Disposing of an Aggregate

You can dispose of an aggregate by using the `dispose` method. This will dispose of the body and shape that were created by it.