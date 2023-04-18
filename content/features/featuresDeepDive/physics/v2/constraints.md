---
title: Constraints
image: 
description: Learn all about using Constraints with Babylon.js.
keywords: diving deeper, phyiscs, joints
further-reading:
    - title: How To Use The Physics Engines
      url: /features/featuresDeepDive/physics/usingPhysicsEngine
    - title: How to use Forces
      url: /features/featuresDeepDive/physics/forces
    - title: How To Use Pivots and Axes
      url: /features/featuresDeepDive/physics/pivotsAxes
    - title: How To Create Compound Bodies
      url: /features/featuresDeepDive/physics/compoundBodies
    - title: How To Create Soft Bodies
      url: /features/featuresDeepDive/physics/softBodies
    - title: How To Use Advanced Features
      url: /features/featuresDeepDive/physics/advancedPhysicsFeatures
    - title: How To Add Your Own Physics Engine
      url: /features/featuresDeepDive/physics/addPhysicsEngine
video-overview:
video-content:
---

## What is it

A constraint represents a *connection* between two bodies. This connection can have several restrictions on the movement of these bodies, and allows us to simulate ropes, hinges and other joints.

## Constraint Types

| Enum | Name | Notes |
| --- | --- | --- |
| BALL_AND_SOCKET  | Ball and socket| ![Ball and Socket](/img/how_to/physics/ballnsocket.jpg)|
| DISTANCE | Distance | ![Distance](/img/how_to/physics/distance.jpg) |
| HINGE | Hinge | ![Hinge](/img/how_to/physics/hinge.jpg) |
| SLIDER | Slider | ![Slider](/img/how_to/physics/slider.jpg) |
| LOCK | Lock | ![Locked](/img/how_to/physics/locked.jpg) |
| PRISMATIC | Prismatic | ![Prismatic](/img/how_to/physics/prismatic.jpg) |
| 6DOF | 6 Degrees Of Freedom | <figure> <img src="/img/features/physics/6DOF.svg" alt="Image representing 6 Degrees of Freedom"/> <figcaption>6 degrees of freedom: three translational and three rotational axes. By GregorDS - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=38429678</figcaption> </figure> |

## How to use it

```javascript
const bodyA = new BABYLON.PhysicsBody(objectA, BABYLON.PhysicsMotionType.DYNAMIC, scene);
const bodyB = new BABYLON.PhysicsBody(objectB, BABYLON.PhysicsMotionType.DYNAMIC, scene);

const constraint = new BABYLON.DistanceConstraint(
  10, // max distance between the two bodies
  scene
);

bodyA.addConstraint(bodyB, constraint);
```

If one or both bodies are instanced, you can specify the instance to which the constraint applies:

```javascript
// This will add a constraint between the instance in index 3 of body A, and the instance in index 2 of body B
bodyA.addConstraint(bodyB, constraint, 3, 2); 
```

For the 6DOF (6 Degrees of Freedom) constraint, you should specify an array with entries specifying the translational and rotational axis that have min and max limits:

```javascript
// This will constraint the bodies to mantain a distance of at least 1 and at most 2, and to rotate at most 1.58 rad along the perpendicular axis
let constraint = new BABYLON.Physics6DoFConstraint({
    pivotA: new BABYLON.Vector3(0, -0.5, 0),
    pivotB: new BABYLON.Vector3(0, 0.5, 0),
    perpAxisA: new BABYLON.Vector3(1, 0, 0),
    perpAxisB: new BABYLON.Vector3(1, 0, 0),
}, [
    {axis: BABYLON.PhysicsConstraintAxis.LINEAR_DISTANCE, minLimit: 1, maxLimit: 2},
    {axis: BABYLON.PhysicsConstraintAxis.ANGULAR_Y, minLimit: 0, maxLimit: 1.58}
], scene);
```

## Examples

** PG `testConstraintsPG.js` **