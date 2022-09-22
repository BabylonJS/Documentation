---
title: Provided Polyhedra
image:
description: Learn the provided polyhedra in Babylon.js.
keywords: diving deeper, meshes, polyhedra shapes
further-reading:
video-overview:
video-content:
---

## Polyhedra Provided by Number

There are fifteen polyhedra that can be created by setting its type number from 0 to 14. These are

| type | name                                 | number of faces |
| ---- | ------------------------------------ | --------------- |
| 0    | Tetrahedron                          | 4               |
| 1    | Octahedron                           | 8               |
| 2    | Dodecahedron                         | 12              |
| 3    | Icosahedron                          | 20              |
| 4    | Rhombicuboctahedron                  | 26              |
| 5    | Triangular Prism                     | 5               |
| 6    | Pentagonal Prism                     | 7               |
| 7    | Hexagonal Prism                      | 8               |
| 8    | Square Pyramid (J1)                  | 5               |
| 9    | Pentagonal Pyramid (J2)              | 6               |
| 10   | Triangular Dipyramid (J12)           | 6               |
| 11   | Pentagonal Dipyramid (J13)           | 10              |
| 12   | Elongated Square Dipyramid (J15)     | 12              |
| 13   | Elongated Pentagonal Dipyramid (J16) | 15              |
| 14   | Elongated Pentagonal Cupola (J20)    | 22              |

## MeshBuilder

usage :

```javascript
const polyhedron = BABYLON.MeshBuilder.CreatePolyhedron("oct", options, scene); //scene is optional and defaults to the current scene
```

| option          | value                                                                                              | default value                    |
| --------------- | -------------------------------------------------------------------------------------------------- | -------------------------------- |
| type            | _(number)_ polyhedron type in the range [0,14]                                                     | 0                                |
| size            | _(number)_ polyhedron size                                                                         | 1                                |
| sizeX           | _(number)_ X polyhedron size, overwrites the _size_ property                                       | 1                                |
| sizeY           | _(number)_ Y polyhedron size, overwrites the _size_ property                                       | 1                                |
| sizeZ           | _(number)_ Z polyhedron size, overwrites the _size_ property                                       | 1                                |
| custom          | _(polygonObjectReference)_ a polyhedron object, overwrites the _type_ property                     | null                             |
| faceColors      | _(Color4[])_ array of _Color4_, one per face                                                       | Color4(1, 1, 1, 1) for each side |
| faceUV          | _(Vector4[])_ array of _Vector4_, one per face                                                     | UVs(0, 0, 1, 1) for each side    |
| flat            | _(boolean)_ if false, a polyhedron has a single global face, _faceUV_ and _faceColors_ are ignored | true                             |
| updatable       | _(boolean)_ true if the mesh is updatable                                                          | false                            |
| sideOrientation | _(number)_ side orientation                                                                        | DEFAULTSIDE                      |

To understand how to set _faceUV_ or _faceColors_, please read about [Face Colors and Textures for a Box](/features/featuresDeepDive/materials/using/texturePerBoxFace) taking into account the right number of faces of your polyhedron, instead of only 6 for a box.

## Examples

The full set of 15: <Playground id="#PBLS4Y" title="Full Set Of 15 Polyhedra" description="Playground example showing all 15 provided polyhedra."/>
Dodecahedron with FaceUVs: <Playground id="#PBLS4Y#1" title="Dodecahedron with FaceUVs" description="Playground example of creating a dodecahedron with faceUVs."/>

## Mesh

usage :

```javascript
const polyhedron = BABYLON.Mesh.CreatePolyhedron("oct", options, scene); //scene is optional and defaults to the current scene
```

This is the same format as that for _MeshBuilder_
