---
title: Creating A Box
image:
description: Learn how to create a box in Babylon.js.
keywords: diving deeper, meshes, set shapes, standard shapes, box
further-reading:
video-overview:
video-content:
---

## Box Mesh

The created box has its origin at the center of the box, its width (x), height (y) and depth (z) are as given.

## MeshBuilder.

Usage :

```javascript
const box = BABYLON.MeshBuilder.CreateBox("box", options, scene); //scene is optional and defaults to the current scene
```

| options property | value                                                                                                   | default value                    |
| ---------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------- |
| size             | _(number)_ size of each box side                                                                        | 1                                |
| height           | _(number)_ height size, overwrites _size_ option                                                        | size                             |
| width            | _(number)_ width size, overwrites _size_ option                                                         | size                             |
| depth            | _(number)_ depth size, overwrites _size_ option                                                         | size                             |
| faceColors       | _(Color4[])_ array of 6 _Color4_, one per box face                                                      | Color4(1, 1, 1, 1) for each side |
| faceUV           | _(Vector4[])_ array of 6 _Vector4_, one per box face                                                    | UVs(0, 0, 1, 1) for each side    |
| wrap             | _(boolean)_ ( BJS 4.0 or >) when true all vertical sides (0, 1, 2, 3) will apply image textures upright | false                            |
| topBaseAt        | _(number)_ (BJS 4.0 or >) base of top touches side given 0, 1, 2, 3                                     | 1                                |
| bottomBaseAt     | _(number)_ (BJS 4.0 or >) base of bottom touches side given 0, 1, 2, 3                                  | 0                                |
| updatable        | _(boolean)_ true if the mesh is updatable                                                               | false                            |
| sideOrientation  | _(number)_ side orientation                                                                             | DEFAULTSIDE                      |
| frontUVs         | _(Vector4)_ **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set**                                   | Vector4(0,0, 1,1)                |
| backUVs          | _(Vector4)_ **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set**                                   | Vector4(0,0, 1,1)                |

### Examples

Cuboid: <Playground id="#6XIT28#4" title="Create a Cuboid" description="Simple example of creating a cuboid." image="/img/playgroundsAndNMEs/divingDeeperMeshSetShapes1.jpg"/>
Face numbers, face 0 is on the positive z axis: <Playground id="#6XIT28#5" title="Create a Box With Face Numbers" description="Simple example of creating a box with face numbers." image="/img/playgroundsAndNMEs/divingDeeperMeshSetShapes2.jpg"/>

## Mesh.

Usage

```javascript
const box = BABYLON.Mesh.CreateBox("box", size, scene);
const box = BABYLON.Mesh.CreateBox("box", size, scene, updatable, sideOrientation); //optional parameters after scene
```

It is only possible to create a cube with this method, for a cuboid you need to use scaling.
