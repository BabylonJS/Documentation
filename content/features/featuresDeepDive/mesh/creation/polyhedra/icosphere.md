---
title: Icospheres
image:
description: Learn how to create icospheres in Babylon.js.
keywords: diving deeper, meshes, polyhedra shapes, icosphere
further-reading:
video-overview:
video-content:
---

## Icosphere

This a sphere based upon an icosahedron with 20 triangular faces which can be subdivided into smaller triangles.

## MeshBuilder

Usage:

```javascript
const icosphere = BABYLON.MeshBuilder.CreateIcoSphere("icosphere", options, scene);
```

| options         | value                                                      | default value |
| --------------- | ---------------------------------------------------------- | ------------- |
| radius          | _(number)_ radius                                          | 1             |
| radiusX         | _(number)_ the X radius, overwrites the radius value       | radius        |
| radiusY         | _(Vector3)_ the Y radius, overwrites the radius value      | radius        |
| radiusZ         | _(number)_ the Z radius, overwrites the radius value       | radius        |
| subdivisions    | _(number)_ the number of subdivisions                      | 4             |
| flat            | _(boolean)_ if true, the mesh faces have their own normals | true          |
| updatable       | _(boolean)_ true if the mesh is updatable                  | false         |
| sideOrientation | _(number)_ side orientation                                | DEFAULTSIDE   |

##Examples
Icosphere: <Playground id="#HC5FA8" title="Creating An Icosphere" description="Simple example of creating an icosphere."/>  
Smoothed Icossphere: <Playground id="#HC5FA8#2" title="Creating A Smoothed Icosphere" description="Simple example of creating a smoothed icosphere."/>
Less subdivisions and changed radii: <Playground id="#HC5FA8#3" title="Icosphere With Less Subdivisions" description="Simple example of creating an icosphere with less subdivisions and changed radii."/>
Icosphere with animation over subdivisions: <Playground id="#E3TVT#1" title="Icosphere With Animation Over Subdivisions" description="Simple example of creating an icosphere with animation over subdivisions."/>

## Mesh

Usage:

```javascript
const icosphere = BABYLON.Mesh.CreateIcoSphere("icosphere", options, scene);
```

This is the same format as that for _MeshBuilder_
