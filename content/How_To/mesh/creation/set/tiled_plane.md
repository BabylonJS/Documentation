# Tiled Plane
A tiled plane is only available with MeshBuilder. The tile size, pattern and alignment of tiles can be set. 

## MeshBuilder
Usage :
```javascript
const tiledPlane = BABYLON.MeshBuilder.CreateTiledPlane("plane", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
size|_(number)_ side size of the plane|1
width|_(number)_ size of the width|size
height|_(number)_ size of the height|size
tileSize|_(number)_ size of each tile side|1
tileHeight|_(number)_ tile height size, overwrites _tileSize_ option|tileSize
tileWidth|_(number)_ tile width size, overwrites _tileSize_ option|tileSize
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1)
pattern|_(number)_ how tiles are reflected or rotated|NO_FLIP
alignVertical| _(number)_ positions whole tiles at top, bottom or center of a face|CENTER
alignHorizontal| _(number)_ positions whole tiles at left, right or center of a face|CENTER
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE   

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

Using the *frontUVs* and *backUVs* properties in the options the front and back of the plane can use different parts of an image for the front and back of the plane.


```javascript
const f = new BABYLON.Vector4(0.5,0, 1, 1); // front image = half the whole image along the width 
const b = new BABYLON.Vector4(0,0, 0.5, 1); // back image = second half along the width

const options = {
    frontUVs: f,
	backUVs: b,
	sideOrientation: BABYLON.Mesh.DOUBLESIDE
}
``` 

## Examples

The following image is used to show the results before and after flipping alternate tiles

![Single Tile Pattern](/img/how_to/mesh/lavatile.jpg) 

Before tiles flipped  https://www.babylonjs-playground.com/#XR696D  
After tiles flipped https://www.babylonjs-playground.com/#XR696D#1

**Alternating Patterns**

This image  
![Two Tile Pattern](/img/how_to/mesh/tiles2.jpg)  
is used to show different alternating patterns using tiles of width 2 and height 1 by flipping either every other row or tile

row flipped https://www.babylonjs-playground.com/#XR696D#3  
tile filed https://www.babylonjs-playground.com/#XR696D#4) 

and also how tiling can be different front and back.

https://www.babylonjs-playground.com/#XR696D#2


The final example use the same image to show all 63 permutations. To see heading view the full playground.
https://www.babylonjs-playground.com/#XR696D#5