# Ground From a Height Map
When the ground is created using *groundFromHeightMap* the surface of the ground can be perturbed by a grayscale image file called a height map. Lighter areas are displayed higher than darker areas. This is a way of creating hills and valleys on your ground.

## MeshBuilder
Usage:
```javascript
const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", url_to_height_map, options, scene); //scene is optional and defaults to the current scene 
```

option|value|default value
--------|-----|-------------
width|_(number)_ size of the map width|10
height|_(number)_ size of the map height|10
subdivisions|_(number)_ number of map subdivisions|1
minHeight|_(number)_ minimum altitude|0
maxHeight|_(number)_ maximum altitude|1
onReady|_(function)_ a callback js function that is called and passed the just built mesh|(mesh) => {return;}
updatable|_(boolean)_ true if the mesh is updatable|false

### Examples
The following image is used for the height map in the first examples

![height map](/img/how_to/HeightMap/heightMap.png)  
Low subdivisions https://www.babylonjs-playground.com/#LQ4LI1  
High subdivisions https://www.babylonjs-playground.com/#LQ4LI1#1

Flat world https://www.babylonjs-playground.com/#LQ4LI1#3

## Mesh
Usage :
```javascript
var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", heightMapPath, width, height, subdivisions, minHeight, maxHeight, scene, updatable, onReadyCallback);
```