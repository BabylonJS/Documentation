---
title: Goldberg Polyhedra
image: 
description: How to Create Goldberg Polyhedra
keywords: goldberg, polyhedron, polyhedra, dome
further-reading:
  - title: Geodesic and Goldberg Polyhedra Code Design
    url: /guidedLearning/workshop/Geodesic_Code
  - title: Geodesic and Goldberg Polyhedra Mathematics
    url: /guidedLearning/workshop/Geodesic_Math
  - title: Icosphere
    url: /divingDeeper/mesh/creation/polyhedra/icosphere
video-overview:
video-content:
---

## Goldberg Polyhedron
Within Babylon.js a Goldberg polyhedron (GBP) is formed for an icosahedron based geodesic polyhedron and its vertices mapped onto a sphere. The two parameters m and n used in forming the geodesic base also determine the arrangement of faces for the GBP.

On this page we explain how to create a GBP directly. More information about [GBP Mathematics](/guidedLearning/workshop/Geodesic_Math) and [an outline of coding a GBP](/guidedLearning/workshop/Geodesic_Code) are available in the documentation workshop.

A GBP consists of 12 pentagonal faces and a number of hexagonal faces determined by m and n. The options for a GBP are fewer than those for ```CreateGeodesic``` or ```CreatePolyhedron```. However additional properties and methods, to those of a standard mesh, are available for a Goldberg mesh. These allow individual, or groups of pentagonal and hexagonal faces to be colored, textured or built upon giving a heagon-grid planet shaped world.

## MeshBuilder

usage :

```javascript
const geodesic = BABYLON.MeshBuilder.CreateGeodesic("geodesic", options, scene); //scene is optional and defaults to the current scene
```

| option          | value                                                                                              | default value                    |
| --------------- | -------------------------------------------------------------------------------------------------- | -------------------------------- |
| m               | _(number)_ an integer > 0                                                                          | 1                                |
| n               | _(number)_ a positive or zero integer <= n                                                         | 0                                |
| size            | _(number)_ polyhedron size                                                                         | 1                                |
| sizeX           | _(number)_ X polyhedron size, overwrites the _size_ property                                       | 1                                |
| sizeY           | _(number)_ Y polyhedron size, overwrites the _size_ property                                       | 1                                |
| sizeZ           | _(number)_ Z polyhedron size, overwrites the _size_ property                                       | 1                                |
| faceColors      | _(Color4[])_ array of _Color4_, one per face                                                       | Color4(1, 1, 1, 1) for each side |
| faceUV          | _(Vector4[])_ array of _Vector4_, one per face                                                     | UVs(0, 0, 1, 1) for each side    |
| flat            | _(boolean)_ if false, a polyhedron has a single global face, _faceUV_ and _faceColors_ are ignored | true                             |
| updatable       | _(boolean)_ true if the mesh is updatable                                                          | false                            |
| sideOrientation | _(number)_ side orientation                                                                        | DEFAULTSIDE                      |

To understand how to set _faceUV_ or _faceColors_, please read about [Face Colors and Textures for a Box](/divingDeeper/materials/using/texturePerBoxFace) taking into account the right number of faces of your polyhedron, instead of only 6 for a box.

## Examples

To be COMPLETED

The full set of 15: <Playground id="#PBLS4Y " title="Full Set Of 15 Polyhedra" description="Playground example showing all 15 provided polyhedra."/>
Dodecahedron with FaceUVs: <Playground id="#PBLS4Y#1 " title="Dodecahedron with FaceUVs" description="Playground example of creating a dodecahedron with faceUVs."/>

## Mesh

usage :

```javascript
const polyhedron = BABYLON.Mesh.CreateGeodesic("oct", options, scene); //scene is optional and defaults to the current scene
```

This is the same format as that for _MeshBuilder_


![Dual](/img/snippets/geo31.png)  
The red grid is the dual of the green grid and vice-versa.