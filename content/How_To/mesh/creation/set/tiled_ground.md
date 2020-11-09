---
title: Creating A Tiled Ground
image: 
description: Learn how to create a tiled ground in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, set shapes, standard shapes, tiled ground
further-reading:
video-overview:
video-content:
---

## Tiled Ground
A tiled ground is created differently to a ground mesh. It still lies in the xz plane. The bottom left corner of of the tiled ground is given by the values for xmin and zmin and the top right corner by xmax and zmax. The tiled ground is be subdivided into tile regions: across into w tiles and up into h tiles. In the same way every tile can be further subdivided into w by h sections. The creation of a tiled ground relies on the use of *MultiMaterials*.

## MeshBuilder
Usage:
```javascript
var tiledGround = BABYLON.MeshBuilder.CreateTiledGround("tiled ground", options, scene);
```

option|value|default value
--------|-----|-------------
xmin|_(number)_ map min x coordinate value|-1
zmin|_(number)_ map min z coordinate value|-1
xmax|_(number)_ map max x coordinate value|1
zmin|_(number)_ map max z coordinate value|1
subdivisions|_object_ _( {w: number, h: number} )_ number of subdivisions (tiles) on the height and the width of the map|{w: 6, h: 6}
precision|_( {w: number, h: number} )_ number of subdivisions on the height and the width of each tile|{w: 2, h: 2}
updatable|_(boolean)_ true if the mesh is updatable|false

### Steps to Create Tiling

* Create Tiled Ground
* Create materials needed for each tile
* Create multi material and push each material onto its subMaterials array
* Set the multi material as the material for the Tiled Ground
* Set the subMeshes property of the Tiled Ground to an empty array
* Create and set values for these variables
```javascript
    const verticesCount = tiledGround.getTotalVertices();
    const tileIndicesLength = tiledGround.getIndices().length / (subdivisions.w * subdivisions.h);
```
* Fill the subMeshes array of the Tiled Ground using
```javascript
    let base = 0;
    for (let row = 0; row < grid.h; row++) {
        for (let col = 0; col < grid.w; col++) {
            tiledGround.subMeshes.push(new BABYLON.SubMesh(
                row % 2 ^ col % 2, 
                0, verticesCount, 
                base , 
                tileIndicesLength, 
                tiledGround));
            base += tileIndicesLength;
        }
    }
```

### Examples

Chess Board: <Playground id="#8VDULN" title="Create a Chess Board" description="Simple example of creating a chess board." image=""/>

Using these two materials

![grass](/img/how_to/Materials/grass.png) ![rock](/img/how_to/Materials/rock.png)  

<Playground id="#8VDULN#1" title="Create a Chess Board With Grass And Rock" description="Simple example of creating a chess board with grass and rock textures." image=""/>

Forming a large scale map using open source map tiles: <Playground id="#1XBLWB#6" title="Create a Large Scale Map" description="Simple example of creating a large scale map using open source map tiles." image=""/>

## Mesh
Usage :
```javascript
const tiledGround = BABYLON.Mesh.CreateTiledGround("Tiled Ground", xmin, zmin, xmax, zmax, subdivisions, precision, scene);
const tiledGround = BABYLON.Mesh.CreateTiledGround("Tiled Ground", xmin, zmin, xmax, zmax, subdivisions, precision, scene, updatable); //one optional parameter after scene
```