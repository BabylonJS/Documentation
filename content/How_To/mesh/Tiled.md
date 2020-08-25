# Tiled Plane

Each tile on the plane uses the same texture source and has the same tile width and tile height.

![Tiled Plane](/img/how_to/mesh/tiles1.jpg)

With careful selection of the tile size and texture image a variety of patterns can be formed with the tiles.

A tiled plane is created using a variety of [options](/how_to/set_shapes#tiled-plane) with

```javascript
var tiledPlane = BABYLON.CreateTiledPlane("tiled_plane", options, scene);
```

Tiles can be flipped (reflected in vertical axis), rotated 180<sup>o</sup> or both by setting **pattern** in the options with the following constants

```javascript
BABYLON.Mesh.NO_FLIP, default
BABYLON.Mesh.FLIP_TILE,
BABYLON.Mesh.ROTATE_TILE,
BABYLON.Mesh.FLIP_ROW,
BABYLON.Mesh.ROTATE_ROW,
BABYLON.Mesh.FLIP_N_ROTATE_TILE,
BABYLON.Mesh.FLIP_N_ROTATE_ROW
```

The TILE ending means that each tile across and up the plane are flipped or rotated alternatively. The ROW ending means that the whole of alternate rows are flipped or rotated.

When the width or height of the plane is such that a whole number of tiles does not fit then tiles are 'cut' and part tiles are used to fill the plane. When this happens you can arrange where the part tiles are placed, either at one edge of the plane or uniformly on two opposite edges. You do this by setting **alignVertical** and **alignHorizontal** in the options with where you want whole tiles to be placed. For example setting **alignHorizontal** to **LEFT** means that the leftmost column of tiles will be whole ones and part tiles will be in the rightmost column. The following constants are available for

_**alignVertical**_

```javascript
BABYLON.Mesh.CENTER, default
BABYLON.Mesh.TOP,
BABYLON.Mesh.BOTTOM
```

_**alignHorizontal**_
```javascript
BABYLON.Mesh.CENTER, default
BABYLON.Mesh.LEFT,
BABYLON.Mesh.RIGHT
```

So there are 7 * 3 * 3 = 63 different arrangements for the tiles. To see the headings for the 63 arrangements view the full playground.  
* [Playground Example - All 63 Arrangements](https://www.babylonjs-playground.com/#Z5JFSM#5)

Using the **frontUVs** and **backUVs** in the options the front and back of the plane can use different parts of an image for the front and back of the plane.

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
* [Playground Example - Tiles Front and Back](https://www.babylonjs-playground.com/#Z5JFSM#4)

## Examples

**Patterns**

![Single Tile Pattern](/img/how_to/mesh/tiles5.jpg)  
tile width : 1, tile height : 1  
* [Playground Example - Basic](https://www.babylonjs-playground.com/#Z5JFSM#9)
* [Playground Example - Flip Tiles](https://www.babylonjs-playground.com/#Z5JFSM#10)

**Alternating Patterns**

![Two Tile Pattern](/img/how_to/mesh/tiles4.jpg)  
tile width : 2, tile height : 1  
* [Playground Example - Alternating Pattern 1](https://www.babylonjs-playground.com/#Z5JFSM#7)
* [Playground Example - Alternating Pattern 2](https://www.babylonjs-playground.com/#Z5JFSM#8)

**Brick Pattern**

![Brick Pattern](/img/how_to/mesh/tiles3.jpg)  
tile width : 3, tile height : 1  
* [Playground Example - Brick Pattern](https://www.babylonjs-playground.com/#Z5JFSM#6)


# Tiled Box

A tiled box is constructed from six tiled planes and so all sides are created from the same size tiles and with the same patterns. Using the faceUV array each side can have a different texture for its tiles as [explained](/how_to/createbox_per_face_textures_and_colors) for a standard box.

The tiled box [options](/how_to/set_shapes#tiled-box) include all the pattern and alignment options for a tiled plane, however frontUVS and backUVs are not available for a tiled box.

It is created using

```javascript
var tiledBox = BABYLON.CreateTiledBox("tiled_box", options, scene);
```

## Examples

![Arrow Pattern](/img/how_to/mesh/tiles6.jpg)  
tile width : 1, tile height : 1 
* [Playground Example - Different Texture Each Side](https://www.babylonjs-playground.com/#Z5JFSM#13)

Note that the the tile pattern is arranged so that all vertical sides have the same pattern and at the edge where the front and top side meets the alignment matches.   
* [Playground Example - Brick Box](https://www.babylonjs-playground.com/#Z5JFSM#12)

To see the headings for the 63 arrangements view the full playground.
* [Playground Example - All 63 Arrangements for a Tiled Box](https://www.babylonjs-playground.com/#Z5JFSM#3)

# Further Reading

## How To Make the Most of Options

[Side Orientation](/babylon101/Discover_Basic_Elements#side-orientation)  
[Updatable](/How_To/Updating_Vertices)  
[Face UV and Face Colors](/How_To/CreateBox_Per_Face_Textures_And_Colors)  
[Front and Back UV](/How_To/FrontandBackUV)

## Basic - L1

[Mesh Overview](/features/Shapes)  
[Set Shapes 101](/babylon101/Discover_Basic_Elements)  
[Parametric Shapes 101](/babylon101/Parametric_Shapes)  
[Set Shapes](/How_To/Set_Shapes)  
[Parametric Shapes](/How_To/Parametric_Shapes)  
[Polyhedra Shapes](/How_To/Polyhedra_Shapes)  