---
title: Physics compounds
image: 
description: How to use compounds to model complex objects with simple primitives
keywords: diving deeper, phyiscs
further-reading:
    - title: How To Use Forces
      url: /features/featuresDeepDive/physics/forces
video-overview:
video-content:
---

## What is it

The Compound is a special type of shape that acts as a "container" to other shapes. It allows modeling complex objects by using simple primitives, acheiving a better aproximation than using only one simple geometric shape.

## How to use

Imagine you have a mesh that represents a character. Character meshes are usually pretty complex, so we want to avoid using it directly for collision. So we'll aproximate the shape of the character with a sphere representing the head, and a box representing the rest of the body. We'll create two meshes to represent these shapes, parent them to the mesh, create two child PhysicShapes and parent them to a PhysicsShapeContainer:

```javascript
const myMesh = BABYLON.SceneLoader.ImportMeshAsync(...);

const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
sphere.position.y = 3;
sphere.parent = myMesh;
const box = BABYLON.MeshBuilder.CreateBox("box", { height: 2, width: 1, depth: 1 });
box.parent = myMesh;

const boxShape = new BABYLON.PhysicsShapeBox(new BABYLON.Vector3(0, 0, 0), new BABYLON.Quaternion(0, 0, 0, 1), new BABYLON.Vector3(1, 2, 1), scene);
const sphereShape = new BABYLON.PhysicsShapeSphere(new BABYLON.Vector3(0, 0, 0), 1, scene);

const parentShape = new BABYLON.PhysicsShapeContainer(scene);

parentShape.addChild(boxShape, box);
parentShape.addChild(sphereShape, sphere);

const body = new BABYLON.PhysicsBody(myMesh, scene);
body.shape = parentShape;
```
