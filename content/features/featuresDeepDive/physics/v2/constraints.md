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

# What is it

A constraint represents a relationship between two bodies. 

# Constraint Types

| Enum | Name | Notes |
| --- | --- | --- |
| BALL_AND_SOCKET  | Ball and socket| ![Ball and Socket](/img/how_to/physics/ballnsocket.jpg)|
| DISTANCE | Distance | ![Distance](/img/how_to/physics/distance.jpg) |
| HINGE | Hinge | ![Hinge](/img/how_to/physics/hinge.jpg) |
| SLIDER | Slider | ![Slider](/img/how_to/physics/slider.jpg) |
| LOCK | Lock | ![Locked](/img/how_to/physics/locked.jpg) |
| PRISMATIC | Prismatic | ![Prismatic](/img/how_to/physics/prismatic.jpg) |

# How to use it

```javascript
const bodyA = new BABYLON.PhysicsBody(objectA, BABYLON.PhysicsMotionType.DYNAMIC, scene);
const bodyB = new BABYLON.PhysicsBody(objectB, BABYLON.PhysicsMotionType.DYNAMIC, scene);

const constraint = new BABYLON.DistanceConstraint(
  10, // max distance between the two bodies
  scene
);

bodyA.addConstraint(bodyB, constraint);
```

# Examples

** PG `testConstraintsPG.js` **