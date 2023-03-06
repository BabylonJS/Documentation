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

Physics Aggregate is a compound object that contains a Body, a Shape and a Material. It's a helper that allows with just one call to create all the object necessary to physicalize your scene.
In that sense, it's working like Physics V1 impostor but with more control.
Once created, you can easily get the individual parts and tweak them.

## How to use it

Here is an example

```
var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
var aggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.ShapeType.SPHERE, { mass: 1 }, scene);
```

This will look very similar to the V1 impostor.
The shape types correspond to the shapes found and concepts page.
At aggregate creation, a body, a shape and a material are instanciated all at once.

## Tweaking and accessing Body, Shape and Material

