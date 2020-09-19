# Tiled Plane
## MeshBuilder
A [tiled plane](/how_to/tiled) is only available with MeshBuilder. The tile size, pattern and alignment of tiles can be set. 

Example :
```javascript
var tiledPlane = BABYLON.MeshBuilder.CreateTiledPlane("plane", {width: 5}, scene);
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

![Front and Back](/img/how_to/mesh/tiles2.jpg)

```javascript
var f = new BABYLON.Vector4(0.5,0, 1, 1); // front image = half the whole image along the width 
var b = new BABYLON.Vector4(0,0, 0.5, 1); // back image = second half along the width

var options = {
    frontUVs: f,
	backUVs: b,
	sideOrientation: BABYLON.Mesh.DOUBLESIDE
}
``` 

https://www.babylonjs-playground.com/#XR696D#2 front and back

## Examples

![Single Tile Pattern](/img/how_to/mesh/lavatile.jpg)  
tile width : 1, tile height : 1  
* [Playground Example - Basic](https://www.babylonjs-playground.com/#XR696D)
* [Playground Example - Flip Tiles](https://www.babylonjs-playground.com/#XR696D#1)

**Alternating Patterns**

![Two Tile Pattern](/img/how_to/mesh/tiles4.jpg)  
tile width : 2, tile height : 1  
* [Playground Example - Alternating Pattern 1](https://www.babylonjs-playground.com/#XR696D#3 ) flip row
* [Playground Example - Alternating Pattern 2](https://www.babylonjs-playground.com/#XR696D#4) flip tile


https://www.babylonjs-playground.com/#XR696D#5 all perms