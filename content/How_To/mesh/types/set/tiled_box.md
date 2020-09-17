# Tiled Box
## MeshBuilder
A [tiled box](/how_to/tiled#tiled-box) is only available with MeshBuilder. The tile size, pattern and alignment of tiles will be the same for each face.  
Example :
```javascript
var tiledBox = BABYLON.MeshBuilder.CreateTiledBox("box", {size:5, tileSize:1}, scene);
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
pattern|_(number)_ how tiles are reflected or rotated on a face|NO_FLIP
alignVertical| _(number)_ positions whole tiles at top, bottom or center of a face|CENTER
alignHorizontal| _(number)_ positions whole tiles at left, right or center of a face|CENTER
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE 

* [Playground Example of a Tiled Box](https://www.babylonjs-playground.com/#Z5JFSM#1)