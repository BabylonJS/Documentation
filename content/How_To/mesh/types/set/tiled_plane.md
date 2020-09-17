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

* [Playground Example of a DOUBLESIDE Tiled Plane](https://www.babylonjs-playground.com/#Z5JFSM#4)