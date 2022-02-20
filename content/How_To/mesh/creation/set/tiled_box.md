---
title: Creating A Tiled Box
image: 
description: Learn how to create a tiled box in Babylon.js.
keywords: diving deeper, meshes, set shapes, standard shapes, box, tiled box
further-reading:
video-overview:
video-content:
---

## Tiled Box
A tiled box is only available with *MeshBuilder*. A tiled box is constructed from six tiled planes  s o that he tile size, pattern and alignment of tiles will be the same for each face. Using the faceUV array each side can have a different texture for its tiles as [explained](/features/divingDeeper/materials/using/texturePerBoxFace) for a standard box.

## MeshBuilder
Usage :
```javascript
const tiledBox = BABYLON.MeshBuilder.CreateTiledBox("tiled box", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|------------
size|_(number)_ size of each box side|1
height|_(number)_ height size, overwrites _size_ option|size
width|_(number)_ width size, overwrites _size_ option|size
depth|_(number)_ depth size,  overwrites _size_ option|size
tileSize|_(number)_ size of each tile side|1
tileHeight|_(number)_ tile height size, overwrites _tileSize_ option|tileSize
tileWidth|_(number)_ tile width size, overwrites _tileSize_ option|tileSize
faceColors|_(Color4[])_ array of 6 _Color4_, one per box face|Color4(1, 1, 1, 1) for each side
faceUV|_(Vector4[])_ array of 6 _Vector4_, one per box face| UVs(0, 0, 1, 1) for each side
pattern|_(number)_ how tiles are reflected or rotatedacross a face|NO_FLIP
alignVertical| _(number)_ positions whole tiles at top, bottom or center of a face|CENTER
alignHorizontal| _(number)_ positions whole tiles at left, right or center of a face|CENTER
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE 

<Playground id="#FAP6ZC#3" title="Create a Tiled Box" description="Simple example of creating a tiled box." image="/img/playgroundsAndNMEs/features/divingDeeperMeshSetShapes3.jpg"/>

The values for the options *pattern* property are the following constants

```javascript
BABYLON.Mesh.NO_FLIP, default
BABYLON.Mesh.FLIP_TILE,
BABYLON.Mesh.ROTATE_TILE,
BABYLON.Mesh.FLIP_ROW,
BABYLON.Mesh.ROTATE_ROW,
BABYLON.Mesh.FLIP_N_ROTATE_TILE,
BABYLON.Mesh.FLIP_N_ROTATE_ROW
```

The TILE ending means that every other tile across and up the plane is flipped or rotated.  
The ROW ending means that the whole of alternate rows are flipped or rotated.

When the width or height of the plane is such that a whole number of tiles does not fit then tiles are 'cut' and part tiles are used to fill the plane. When this happens you can arrange where the part tiles are placed, either at one edge of the plane or uniformly on two opposite edges. You do this by setting *alignVertical* and *alignHorizontal* in the options with where you want whole tiles to be placed. For example setting *alignHorizontal* to *LEFT* means that the leftmost column of tiles will be whole ones and part tiles will be in the rightmost column. The following constants are available for *alignVertical* and *alignHorizontal*

```javascript
BABYLON.Mesh.CENTER, default
BABYLON.Mesh.TOP,
BABYLON.Mesh.BOTTOM
```

```javascript
BABYLON.Mesh.CENTER, default
BABYLON.Mesh.LEFT,
BABYLON.Mesh.RIGHT
```

There are 7 * 3 * 3 = 63 different arrangements for the tiles.

## Examples
We use the following image as the texture in the following examples

![Arrow Pattern](/img/how_to/mesh/tiles6.jpg)  

Different texture each side, tile width 1, tile height 1 
Playground Example -  <Playground id="#FAP6ZC#4" title="Create a Tiled Box With Different Face Textures" description="Simple example of creating a tiled box with different textures on each side." image="/img/playgroundsAndNMEs/features/divingDeeperMeshSetShapes4.jpg"/>


All the 63 arrangements. To see the headings view the full playground.
<Playground id="#FAP6ZC#2" title="Create a Tiled Box With 63 Different Arrangements" description="Simple example of creating a tiled box with 63 different arrangements." image="/img/playgroundsAndNMEs/features/divingDeeperMeshSetShapes4.jpg"/>