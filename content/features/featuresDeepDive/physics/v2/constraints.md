---
title: Constraints
image: 
description: Learn all about using Constraints in physics V2 with Babylon.js.
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

# Joints

A constraints is a constraint feature between two bodies. This area has the largest differences between the physics engine both in the joints available and the names used. Not all native joints are available in some plugins.

Playgrounds are available to check out the coding. In the playgrounds the physics' engine used can be changed by selecting which ones to comment out.

See [How to Use The Physics' Engines](/features/featuresDeepDive/physics/usingPhysicsEngine) for an overall view of setting up and using the three plugins.

## Physical Constraint Types

| Enum | Name | Notes |
| --- | --- | --- |
| BALL_AND_SOCKET  | Ball and socket| ![Ball and Socket](/img/how_to/physics/ballnsocket.jpg)|
| DISTANCE | Distance | ![Distance](/img/how_to/physics/distance.jpg) |
| HINGE | Hinge | ![Hinge](/img/how_to/physics/hinge.jpg) |
| SLIDER | Slider | ![Slider](/img/how_to/physics/slider.jpg) |
| LOCK | Lock | ![Locked](/img/how_to/physics/locked.jpg) |
| PRISMATIC | Prismatic | ![Prismatic](/img/how_to/physics/prismatic.jpg) |

## API

## Example

** PG `testConstraintsPG.js` **