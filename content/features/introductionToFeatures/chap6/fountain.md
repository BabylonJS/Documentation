---
title: Getting Started - Chapter 6 - A Lathe Turned Fountain
image:
description: Learn how to create meshes with the createLathe method.
keywords: getting started, start, chapter 6, lathe, meshes
further-reading:
video-overview:
video-content:
---

# Getting Started - A Lathe Turned Fountain

## A Lathe Turned Fountain

Time to introduce another of the many ways to create a mesh, the _CreateLathe_ method. We start with a profile for the fountain.

![profile](/img/getstarted/profile.png)

The profile is described, in an array, using the x and y components of a 3D vector.

```javascript
const fountainProfile = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(10, 0, 0), new BABYLON.Vector3(10, 4, 0), new BABYLON.Vector3(8, 4, 0), new BABYLON.Vector3(8, 1, 0), new BABYLON.Vector3(1, 2, 0), new BABYLON.Vector3(1, 15, 0), new BABYLON.Vector3(3, 17, 0)];
```

The array is used in shape property of the options parameter in the _CreateLathe_ method.

```javascript
const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", { shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
```

As before the scene parameter is optional. In this case the mesh is set to double sided because the inside is visible because of the slope at the top and the hollow middle.

<Playground id="#TC31NV#3" title="Basic Lathe Fountain" description="Use the createLathe method to create a fountain." image="/img/playgroundsAndNMEs/gettingStartedLathe1.jpg"/>

With appropriate change of scale and positioning this is added to the village.

<Playground id="#KBS9I5#91" title="Add the Fountain" description="Add the fountain into the village." image="/img/playgroundsAndNMEs/gettingStartedLathe2.jpg"/>

A fountain without a spray of water is a little boring so we simulate the spray with particles.
