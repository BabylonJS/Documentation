---
title: Migrate from Physics V1
image:
description: A guide on best practices to port a Physics V1 scene to V2
keywords: diving deeper, physics, migration
further-reading:
video-overview:
video-content:
---

# Migrate from Physics V1

Babylon 6.0 brought a new physics architecture, which aims to provide closer functionality to what most of the existing physic engines provide. However, it also includes some extra classes to make this migration easier. Here we show two ways of migrating your existing V1 scene to V2:

## Option 1: Using Aggregates

[Aggregates](/features/featuresDeepDive/physics/aggregates) work very similarly to the V1 Physics Impostors, creating all necessary objects automatically based on the parameters. So, if you have this code in V1:

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
const impostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0.2, restitution: 0.3 }, scene);
```

You will just need to change it to:

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
const aggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, friction: 0.2, restitution: 0.3 }, scene);
```

Note we switched the constructor from `PhysicsImpostor` to `PhysicsAggregate`, and the second parameter (the type of the physical shape) from `BABYLON.PhysicsImpostor.SphereImpostor` to `BABYLON.PhysicsShapeType.SPHERE`. [Here are the available types of shapes](/features/featuresDeepDive/physics/rigidBodies#shape).

## Option 2: No Aggregates

One of the most important new features in the new architecture is the ability to fine-tune the collision shapes and reuse them, improving memory usage and customizability. So it is also possible to separately create bodies and shapes:

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
const impostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0.2, restitution: 0.3 }, scene);
```

Would become:

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
const sphereShape = new BABYLON.PhysicsShapeSphere(new BABYLON.Vector3(0, 0, 0), 1, scene);
const sphereBody = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, scene);
sphereShape.material = { friction: 0.2, restitution: 0.3 };
sphereBody.shape = sphereShape;
sphereBody.setMassProperties({ mass: 1 });
```

The advantage of this approach is that, if you have another mesh you want to use with the same collider shape and material, you can reuse the shape:

```javascript
const complexModel = await BABYLON.SceneLoader.ImportMeshAsync(...);
const body = new BABYLON.PhysicsBody(complexModel, BABYLON.PhysicsMotionType.DYNAMIC, scene);
body.shape = sphereShape;
body.setMassProperties({mass: complexModelMass});
```

<Playground id="#Q6TJRN#2" title="Shapes test" description="Use all available shapes with or without aggregates."/>
