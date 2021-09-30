---
title: Geodesic Polyhedra
image: 
description: How to Create Geodesic Polyhedra
keywords: geodesic, polyhedron, polyhedra, dome
further-reading:
  - title: Geodesic and Goldberg Polyhedra Code Design
    url: /guidedLearning/workshop/Geodesic_Code
  - title: Geodesic and Goldberg Polyhedra Mathematics
    url: /guidedLearning/workshop/Geodesic_Math
  - title: Icosphere
    url: /divingDeeper/mesh/creation/polyhedra/icosphere
  - title: Creating Polyhedra
    url: /divingDeeper/mesh/creation/polyhedra/polyhedra_by_numbers
video-overview:
video-content:
---

## Geodesic Polyhedron
Within Babylon.js a geodesic polyhedron (GDP) is formed for an icosahedron base and its vertices mapped onto a sphere. An icosahedron made 20 faces each a primary equilateral triangles. To form a GDP each face is split into further equilateral triangles forming an isometric grid. Before creating the GDP this grid can be rotated by an angle determined by the values of two parameters m and n both integers. When n is 0 no rotation of the grid takes place and the resulting GDP is an icosphere.

On this page we explain how to create a GDP directly. More information about [GDP Mathematics](/guidedLearning/workshop/Geodesic_Math) and [an outline of coding a GDP](/guidedLearning/workshop/Geodesic_Code) are available in the documentation workshop.

The format for creating a GDP very much matches that of ```CreatePolyhedron```. A GDP can only be created with ```MeshBuilder```.

## MeshBuilder

usage :

```javascript
const geodesic = BABYLON.MeshBuilder.CreateGeodesic("geodesic", options, scene); //scene is optional and defaults to the current scene
```

| option          | value                                                                                              | default value                    |
| --------------- | -------------------------------------------------------------------------------------------------- | -------------------------------- |
| m               | _(number)_ an integer > 0                                                                          | 1                                |
| n               | _(number)_ a positive or zero integer <= m                                                         | 0                                |
| size            | _(number)_ polyhedron size                                                                         | 1                                |
| sizeX           | _(number)_ X polyhedron size, overwrites the _size_ property                                       | 1                                |
| sizeY           | _(number)_ Y polyhedron size, overwrites the _size_ property                                       | 1                                |
| sizeZ           | _(number)_ Z polyhedron size, overwrites the _size_ property                                       | 1                                |
| faceColors      | _(Color4[])_ array of _Color4_, one per face                                                       | Color4(1, 1, 1, 1) for each side |
| faceUV          | _(Vector4[])_ array of _Vector4_, one per face                                                     | UVs(0, 0, 1, 1) for each side    |
| flat            | _(boolean)_ if false, a polyhedron has a single global face, _faceUV_ and _faceColors_ are ignored | true                             |
| updatable       | _(boolean)_ true if the mesh is updatable                                                          | false                            |
| sideOrientation | _(number)_ side orientation                                                                        | DEFAULTSIDE                      |

To understand how to set _faceUV_ or _faceColors_, please read about [Face Colors and Textures for a Box](/divingDeeper/materials/using/texturePerBoxFace) taking into account the right number of faces of your polyhedron.

## Examples

PG: <Playground id="#I8IENW" title="Geodesic Polyhedron" description="Vary shape with m and n"/>
