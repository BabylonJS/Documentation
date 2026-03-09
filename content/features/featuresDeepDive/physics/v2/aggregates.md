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

The Physics Aggregate is an object that contains a Body and a Shape. It's a helper that allows creating all the objects necessary to physicalize your scene in just one call. In that sense, it's similar to Physics V1 Impostors, but with more control. Once created, you can easily get the individual parts and tweak them.

## How to use it

```javascript
const sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
const aggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1 }, scene);
```

This is very similar to the Physics V1 Impostor.
At aggregate creation, a body and a shape are instantiated all at once. However, recreating shapes is not the most performant choice. You can alternatively pass the shape instead of the PhysicsShapeType, and the aggregate will reuse that shape:

```javascript
const sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
const sphere2 = sphere.clone("sphere2");

const aggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1 }, scene);
const aggregate2 = new BABYLON.PhysicsAggregate(sphere2, aggregate.shape, { mass: 1 }, scene);
```


<Playground id="#4Y813L#40" title="Reuse shapes with Aggregates" description="Reuse shapes with Aggregates"/>

<Playground id="#Z8HTUN" title="Simple scene with Aggregate" description="Simple falling sphere created with an aggregate"/>

## Tweaking and accessing individual components

You can access the individual physics components by using the accessors:

```javascript
const aggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1 }, scene);
aggregate.body.setMassProperties({mass: 10});
```

## Disposing of an Aggregate

You can dispose of an aggregate by using the `dispose` method. This will dispose of the body and shape that were created by it, in case the shape was created by the aggregate. If the shape was passed as a parameter, then it will not be disposed, as it could still be in use by another body.

