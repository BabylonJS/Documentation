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

A constraint represents a *connection* between two bodies. This connection can apply restrictions on the relative movement of the bodies, and allows us to model all sorts of physical connections between bodies such as ropes, doors, character joints, and more.

Because the two bodies are still simulated independently, A constraint (`PhysicsConstraint`) definition includes transforms from the local space of each body to the pivot position/orientation of the constraint on that body. Together these are known as the "constraint space". During simulation, constraints will act on the two bodies to maintain the pivot position/orientation across the two constrained bodies. For example, a ball-and-socket constraint will apply forces to the bodies so that the pivots point positions (defined respectively to each body's local space) will coincide. Likewise, a hinge constraint will also maintain the common rotation axis.

![Constraint Space](/img/how_to/physics/constraintbasics.png)

In rigid body dynamics, each body has 6 degrees of freedom: 3 translational degrees of freedom, and 3 rotational degrees of freedom. A constraint definition includes limitations on one or more of these degrees of freedom for its constrained bodies. Different types of constraints are generally defined by the number and type of these limitations. For example, in a ball-and-socket constraint, the constrained objects have no linear freedom relative to each other in any direction as they are attached together at the point, but are completely free to rotate around the constraint pivot point. In a hinge constraint, the objects no linear freedom and also have restricted relative orientation. In addition, limits can be provided for each degree of freedom. For example, limiting the distance rotation of a hinge constraint allows you for example to create a door that will not rotate beyond a given angle.

![Constraint Linear Limits](/img/how_to/physics/constraintlimitslinear.png)

![Constraint Angular Limits](/img/how_to/physics/constraintlimitsangular.png)

## Constraint Types

Babylon supports several constraint types; the most generic of which is the "6 DoF," which allows control over each degree of freedom individually. In addition to the 6 DoF, Babylon also provides several helper types for common constraints. Many of these constraints are specializations of the 6 DoF, but they don't require you to specify the full constraint space, which can make initialization easier in those cases.

| Enum | Name | Notes |
| --- | --- | --- |
| LOCK | Lock | ![Locked](/img/how_to/physics/locked.jpg) A locked joint attempts to keep the two constraint spaces completely lined up, allowing no relative movement. |
| BALL_AND_SOCKET  | Ball and socket| ![Ball and Socket](/img/how_to/physics/ballnsocket.jpg) A ball and socket joint attempts to line up the pivot *positions* but puts no restrictions on the relative rotation of the two bodies. |
| DISTANCE | Distance | ![Distance](/img/how_to/physics/distance.jpg) A distance joint attempts to keep the positions of the constraint spaces within a specified distance and provides no restriction on relative rotation. |
| HINGE | Hinge | ![Hinge](/img/how_to/physics/hinge.jpg) A hinge will keep the positions of the constraint spaces aligned as well as two of the angular axes, only allowing relative rotation around one axis. |
| PRISMATIC | Prismatic | ![Prismatic](/img/how_to/physics/prismatic.jpg) A prismatic joint allows the constraint spaces to translate along one axis and allows no relative rotation of the two spaces. |
| SLIDER | Slider | ![Slider](/img/how_to/physics/slider.jpg) Similar to the prismatic joint, but also allows the bodies to rotate around the translation axis. |
| SIX_DOF | 6 Degrees Of Freedom | <figure> <img src="/img/features/physics/6DOF.svg" alt="Image representing 6 Degrees of Freedom"/> <figcaption>6 degrees of freedom: three translational and three rotational axes. By GregorDS - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=38429678</figcaption> </figure> The most generic type. Does not provide any restrictions by default, so the limits can be applied as you choose. |

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

If one or both bodies are instanced, you need to specify the instance to which the constraint applies:

```javascript
// This will add a constraint between the instance in index 3 of body A, and the instance in index 2 of body B
bodyA.addConstraint(bodyB, constraint, 3, 2);
// The constraint can also be between two instances in the same body
bodyA.addConstraint(bodyA, constraint, 4, 7); 
```

For the 6DOF (6 Degrees of Freedom) constraint, you should pass an array with entries specifying the translational and rotational axis that have min and max limits:

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
