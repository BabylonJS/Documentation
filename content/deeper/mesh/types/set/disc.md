# Disc or Regular Polygon
The created disc is a flat surface parallel to the xy plane with its origin at the center of the disc. Disc is a little bit of a misnomer since you can use it to create any kind of regular polygon. The number of sides is dependent on the value given to _tessellation_. The larger this value the closer to an actual disc. Using the arc option you can create a sector.

## MeshBuilder
Usage :
```javascript
const disc = BABYLON.MeshBuilder.CreateDisc("disc", options, scene); //scene is optional and defaults to the current scene 
```

option|value|default value
--------|-----|-------------
radius|_(number)_ the radius of the disc or polygon|0.5
tessellation|_(number)_ the number of disc/polygon sides|64
arc|_(number)_ ratio of the circumference between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE


### Examples
Disc https://www.babylonjs-playground.com/#MVSQWZ#1  
Triangle https://www.babylonjs-playground.com/#MVSQWZ#2  
sector https://www.babylonjs-playground.com/#MVSQWZ#3

## Mesh
Usage :
```javascript
const disc = BABYLON.Mesh.CreateDisc("disc", radius, tessellation, scene);
const disc = BABYLON.Mesh.CreateDisc("disc", radius, tessellation, scene, updatable, sideOrientation); //optional parameters after scene
```
.