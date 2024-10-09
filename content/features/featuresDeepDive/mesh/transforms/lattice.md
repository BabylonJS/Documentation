---
title: Lattice
image:
description: Learn all about deforming meshes with lattices in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, deform, deformation, lattice
further-reading:
video-overview:
video-content:
---

## What is a lattice to begin with?

A lattice is like a flexible grid of points used to modify or reshape objects in 3D. Imagine a net wrapped around an object, where you can pull or push the points of the net to change the shape of the object inside.

Instead of adjusting each small part of the object directly, you just move the points of the lattice. The object inside will stretch, bend, or twist based on how you move the lattice, and the changes happen smoothly. This makes it much easier to apply complex transformations to an object without dealing with every little detail.

## Creating a lattice

To create a lattice you simply need to instantiate it:

```
var lattice = new BABYLON.Lattice();
```

By default the lattice is created with the following properties:

- size: (1,1,1)
- position: (0,0,0)
- resolutionX: 3
- resolutionY: 3
- resolutionZ: 3

You can define each properties at construction time:

```
var lattice = new BABYLON.Lattice({ size: new BABYLON.Vector3(2, 2, 2), position: BABYLON.Vector3.Zero()});
```

## Object space

The lattice works in object space meaning that the size you will define for a lattice has to be relatively with the deformed mesh object space.

Said differently, the mesh world matrix is not taken in account as the lattice works at the geometry level (so before the world transfom is applied).

For instance, assuming you have a scene with a sphere created with a diameter of 2, you will have to set the size of the lattice to (2,2,2) in order to fully encompass the sphere, no matter what position, scaling or rotation are set on the sphere.

Same applies to the lattice.position which is also in object space.

Please note that you can call your lattice constructor with the option `autoAdaptToMesh` set to a mesh and the system will automatically compute the correct lattice size:

```
var lattice = new BABYLON.Lattice({
    autoAdaptToMesh: mesh
});

```

## Applying the lattice

To apply the lattice you can either call `deform(vertexData)` or `deformMesh(mesh)`.

Here is an example with a vertex data:

```
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
const positions = sphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);
lattice.deform(positions);
sphere.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true);
sphere.createNormals(true);
```

Please note that it is your responsibility to then update the mesh and rebuild the normals.

This is then equivalent to:

```
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
lattice.deformMesh(sphere);
sphere.createNormals(true);
```

## Updating the lattice
