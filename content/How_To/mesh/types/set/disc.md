# Disc or Regular Polygon
## MeshBuilder
You can create any kind of regular polygon with _CreateDisc()_, the number of sides is dependent on the value given to _tessellation_. The larger this value the closer to an actual disc. Using the arc option you can create a sector.

Example :
```javascript
var disc = BABYLON.MeshBuilder.CreateDisc("disc", {tessellation: 3}, scene); // makes a triangle
```

option|value|default value
--------|-----|-------------
radius|_(number)_ the radius of the disc or polygon|0.5
tessellation|_(number)_ the number of disc/polygon sides|64
arc|_(number)_ ratio of the circumference between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

* [Playground Example of a Sector of Dodecagon](https://www.babylonjs-playground.com/#DJF437)

## Mesh
```javascript
var disc = BABYLON.Mesh.CreateDisc("disc", 5, 30, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```
Parameters are: name, radius, tessellation, scene, updatable and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var disc = BABYLON.Mesh.CreateDisc("disc", 5, 30, scene);
```
With the  _tessellation_ value, you can get a regular polygon :  
3 gives a triangle,  
4 a square,  
5 a pentagon,  
6 a hexagon, 7 a heptagon, 8 an octogon, and so on.