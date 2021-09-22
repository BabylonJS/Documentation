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
Within Babylon.js a Goldberg polyhedron (GBP) is formed a a dual of an icosahedron based geodesic polyhedron and its vertices mapped onto a sphere. The two parameters m and n used in forming the geodesic base also determine the arrangement of faces for the GBP.

![Dual](/img/snippets/geo31.png)  
Fig 1 - The red grid is the dual of the green grid and vice-versa.

On this page we explain how to create a GBP directly. More information about [GBP Mathematics](/guidedLearning/workshop/Geodesic_Math) and [an outline of coding a GBP](/guidedLearning/workshop/Geodesic_Code) are available in the documentation workshop.

A GBP can only be created using ```MeshBuilder```

A GBP consists of 12 pentagonal faces and a number of hexagonal faces determined by m and n. The options for a GBP are fewer than those for ```CreateGeodesic``` or for ```CreatePolyhedron```. However additional properties and methods, to those of a standard mesh, are available for a Goldberg mesh. These allow individual, or groups of pentagonal and hexagonal faces to be colored, textured or built upon giving a hexagon-grid planet shaped world.

The world consists of 12 poles, the pentagonal faces plus a number of hexagonal faces. Around each of the poles there is a group of hexagonal faces that are closer to one pole than the others. These are the unshared faces of the world. Depending on the value of the second parameter, **n**, there may be zero or more faces that are equidistant from two or even three poles. These are the shared faces.

![Faces](/img/snippets/geo32.png)  
Fig 2 - Poles are black, unshared faces are colored and shared faces are white.

The faces are stored in the following order
* the poles 0 to 11
* the unshared faces for pole 0, then for pole 1, pole 2 etc
* the shared faces come at the end

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
| updatable       | _(boolean)_ true if the mesh is updatable                                                          | false                            |
| sideOrientation | _(number)_ side orientation                                                                        | DEFAULTSIDE                      |


## Additional Properties and Methods
### Properties

All the additional properties are read only.

| Property        | Value                                  |
| ------------------- | --------------------------------------------------------------------------- |
| nbFaces             | _(number)_ Total number of faces in the GBP                                 |
| nbFacesAtPole       | _(number)_ The pole plus the closest hexagons                               |
| nbUnsharedFaces     | _(number)_ Total number of hexagonal faces closest to the poles             |
| nbSharedFaces       | _(number)_ Total number of faces equidistant to two poles                   |
| adjacentFaces       | _(number[][])_ Array of the faces adjacent to a particular face             |
| faceCenters         | _(Vector3[])_ Array of centers of each face                                 |
| faceZaxis           | _(Vector3[])_ Array of normals of each face                                 |
| faceXaxis           | _(Vector3[])_ Array of vectors perpendicular to normal for each face        |
| faceYaxis           | _(Vector3[])_ Array of vectors perpendicular to normal for each face        |

The vectors faceCenters[face], and faceZaxis[face], faceXaxis[face] and faceYaxis[face] can be used as a frame of reference to place meshes on the given face.

### Methods

#### Colors
Groups of faces can be colored using

```javascript
goldbergMesh.setFaceColors(colorArray)  //resets face colors whether the mesh is updatable or not
//or
goldbergMesh.updataFaceColors(colorArray)  //resets face colors only when the mesh is updatable
```

where ```colorArray``` is an array of elements of the form [start face, end face, Color4]

For example
```javascript
const colorArray = [
    [18, 18, new BABYLON.Color4(1, 0, 0, 1)], // color face 18 red
    [26, 37, new BABYLON.Color4(0, 1, 0, 1)] //color faces 26 to 37 inclusive green
]
```

#### Textures
Groups of faces can have their texture changed by using

```javascript
goldbergMesh.setFaceUVs(uvArray)  //resets face UVs whether the mesh is updatable or not
//or
goldbergMesh.updataFaceUVs(uvArray)  //resets face UVs only when the mesh is updatable
```

where ```uvArray``` is an array of elements of the form [start face, end face, center, radius, angle]

center is a Vector2 with 0 &le; x, &le; 1 and 0 &le; y &le; 1 giving the relative center of a pentagon/hexagon, within a image,  of given radius and set at the given angle. The image used should be square to prevent distortion of the texture.

For example
```javascript
const uvArray = [
    [18, 18, new BABYLON.Vector2(0.25, 0.75), 0.25, 0], // updates the uvs for face 18 to match the vertices of the green hexagon in Fig 3
    [26, 37, new BABYLON.Vector2(0.625, 0.37), 0.37, Math.PI / 2] //updates the uvs for faces 26 to 37 to match the vertices of the red hexagon in Fig 3
]
```
For the poles pentagons are used to match the uvs.

![Face Texture](/img/snippets/geo33.png)  
Fig 3 - Areas of Image to Use as Face Textures

#### Placing Meshes



## Importing An Exported Goldberg Mesh

## Examples

To be COMPLETED

