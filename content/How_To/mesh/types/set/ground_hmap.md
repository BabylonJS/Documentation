# Ground From a Height Map
## MeshBuilder
Example :
```javascript
var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", url, {width: 6, subdivisions: 4}, scene);
```
Don't forget the _url_ parameter, which is the link to the heightmap file, a greyscale file where lighter areas will be displayed higher than darker areas.

option|value|default value
--------|-----|-------------
width|_(number)_ size of the map width|10
height|_(number)_ size of the map height|10
subdivisions|_(number)_ number of map subdivisions|1
minHeight|_(number)_ minimum altitude|0
maxHeigth|_(number)_ maximum altitude|1
onReady|_(function)_ a callback js function that is called and passed the just built mesh|(mesh) => {return;}
updatable|_(boolean)_ true if the mesh is updatable|false

* [Playground Example Ground From Height Map](https://www.babylonjs-playground.com/#MJ6YSM#1)

## Mesh
```javascript
var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "heightmap.jpg", 200, 200, 250, 0, 10, scene, false, successCallback);
```
Parameters are: name, heightmapPath, width, depth, subdivs, minheight, maxheight, scene, updatable, successCallback

HeightMap grounds are easy, but we decided to create a separate tutorial so we could say more about this important Babylon.js feature. Please see our [HeightMap Tutorial](/babylon101/Height_Map) to learn all about heightMap grounds.