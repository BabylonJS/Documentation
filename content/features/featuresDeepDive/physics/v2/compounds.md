---
title: Physics Compounds
image:
description: Learn how to use compounds to model complex objects with simple primitives.
keywords: diving deeper, physics
further-reading:
  - title: How To Use Forces
    url: /features/featuresDeepDive/physics/forces
video-overview:
video-content:
---

## What is it

The Compound is a special type of shape that acts as a "container" for other shapes. It allows you to model complex objects by using simple primitives, achieving a better approximation than using only one simple geometric shape.

## How to use

Imagine you have a mesh that represents a character. Character meshes are usually pretty complex, so we want to avoid using them directly for collision. We can approximate the shape of the character with a sphere representing the head and a box representing the rest of the body. We will create two meshes to represent these shapes, parent them to the character mesh, create two child physics shapes, and parent them to a `PhysicsShapeContainer`:

```javascript
const myMesh = BABYLON.ImportMeshAsync(...);

const headNode = new BABYLON.TransformNode("headNode");
headNode.position.y = 3;
headNode.parent = myMesh;
const bodyNode = new BABYLON.TransformNode("bodyNode");
bodyNode.parent = myMesh;

const boxShape = new BABYLON.PhysicsShapeBox(new BABYLON.Vector3(0, 0, 0), new BABYLON.Quaternion(0, 0, 0, 1), new BABYLON.Vector3(1, 2, 1), scene);
const sphereShape = new BABYLON.PhysicsShapeSphere(new BABYLON.Vector3(0, 0, 0), 1, scene);

const parentShape = new BABYLON.PhysicsShapeContainer(scene);

parentShape.addChildFromParent(myMesh, boxShape, bodyNode);
parentShape.addChildFromParent(myMesh, sphereShape, headNode);

const body = new BABYLON.PhysicsBody(myMesh, scene);
body.shape = parentShape;
```

The following Playground shows a simple example of creating a container body to approximate a mesh:
<Playground id="3H3DLR" title="Simple Physics Container example" description="Simple Physics Container example" />

The following Playground shows a comparison of using Container, Convex Hull and Mesh shapes on different meshes:
<Playground id="LKPBW5" title="Comparison of using Container, Convex Hull and Mesh shapes on different meshes" description="Comparison of using Container, Convex Hull and Mesh shapes on different meshes" />
