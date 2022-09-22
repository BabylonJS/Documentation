---
title: Creating A Sphere
image:
description: Learn how to create a sphere in Babylon.js.
keywords: diving deeper, meshes, set shapes, standard shapes, sphere
further-reading:
video-overview:
video-content:
---

## Sphere

The created sphere has its origin at the center of the sphere. By using different values for _diameterX_, _diameterY_ and diameterZ\_ lead you create an ellipsoid.

## MeshBuilder

Example :

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", options, scene); //scene is optional and defaults to the current scene
```

| option          | value                                                                 | default value      |
| --------------- | --------------------------------------------------------------------- | ------------------ |
| segments        | _(number)_ number of horizontal segments                              | 32                 |
| diameter        | _(number)_ diameter of the sphere                                     | 1                  |
| diameterX       | _(number)_ diameter on X axis, overwrites _diameter_ option           | diameter           |
| diameterY       | _(number)_ diameter on Y axis, overwrites _diameter_ option           | diameter           |
| diameterZ       | _(number)_ diameter on Z axis, overwrites _diameter_ option           | diameter           |
| arc             | _(number)_ ratio of the circumference (latitude) between 0 and 1      | 1                  |
| slice           | _(number)_ ratio of the height (longitude) between 0 and 1            | 1                  |
| updatable       | _(boolean)_ true if the mesh is updatable                             | false              |
| sideOrientation | _(number)_ side orientation                                           | DEFAULTSIDE        |
| frontUVs        | _(Vector4)_ **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0, 0, 1,1) |
| backUVs         | _(Vector4)_ **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0, 0, 1,1) |

### Examples

<Playground id="#WIR77Z" title="Create a Sphere" description="Simple example of creating a sphere." image="/img/playgroundsAndNMEs/divingDeeperMeshSetShapes6.jpg" isMain={true} category="Mesh"/>

<Playground id="#WIR77Z#1" title="Create a Ellipsoid" description="Simple example of creating a ellipsoid." image="/img/playgroundsAndNMEs/divingDeeperMeshSetShapes7.jpg"/>

<Playground id="#WIR77Z#2" title="Create an Arc" description="Simple example of creating an arc." image="/img/playgroundsAndNMEs/divingDeeperMeshSetShapes8.jpg"/>

<Playground id="#WIR77Z#3" title="Create an Arc and Slice" description="Simple example of creating an arc and slice." image="/img/playgroundsAndNMEs/divingDeeperMeshSetShapes9.jpg"/>

## Mesh

Usage :

```javascript
const sphere = BABYLON.Mesh.CreateSphere("sphere", segments, diameter, scene);
const sphere = BABYLON.Mesh.CreateSphere("sphere", segments, diameter, scene, updatable, sideOrientation); //optional parameters after scene
```

It is only possible to create a sphere with this method, for an ellipsoid you need to use scaling.
