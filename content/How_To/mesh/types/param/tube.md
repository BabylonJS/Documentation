# Tube
## MeshBuilder
You must set at least the _path_ option.
On update, you must set the _path_ and _instance_ options and you can set the _radius_, _radiusFunction_ or _arc_ options.

Example :
```javascript
// creates a tube
var tube = BABYLON.MeshBuilder.CreateTube("tube", {path: myPath}, scene);

// updates the existing instance of tube : no need for the parameter scene
tube = BABYLON.MeshBuilder.CreateTube("tube", {path: myPath, instance: tube});

```

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3, the path of the tube **REQUIRED** |
radius|_(number)_  the radius of the tube|1
tessellation|_(number)_  the number of radial segments|64
radiusFunction|_( function(i, distance) )_  a function returning a radius value from _(i, distance)_ parameters|null
cap|_(number)_ tube cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
arc|_(number)_ ratio of the tube circumference between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of a tube to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

[A Playground Example of a Tube](https://www.babylonjs-playground.com/#165IV6#68)
[A Playground Update of the Tube](https://www.babylonjs-playground.com/#165IV6#67)

## Mesh
```javascript
var tube = BABYLON.Mesh.CreateTube("tube", [V1, V2, ..., Vn], radius, tesselation, radiusFunction, cap, scene, false, BABYLON.Mesh.DEFAULTSIDE);

```
Parameters are : name, path, radius, tesselation, optional radiusFunction, cap, scene, updatable, sideOrientation.

  * name : string, the name of the tube mesh,
  * path : an array of successive Vector3, at least two Vector3,
  * radius : nuumber, the tube radius, used when _radiusFunction_ parameter set to _null_,
  * tesselation : the number of radial segments,
  * radiusFunction : _optional_, a javascript function returns a radius value. This can be set to _null_,
  * cap : BABYLON.Mesh.NO_CAP, BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL,  
  * updatable : boolean, if the tube should allow updating later,
  * sideOrientation : the wanted side orientation (front, back or double side).

The last two parameters can be omitted if you just need the default behavior :
```javascript
var tube = BABYLON.Mesh.CreateTube("tube", [V1, V2, ..., Vn], radius, tesselation, radiusFunction, cap, scene);
```
While a tube can just be a cylinder it can be far more than that
  
* [Playground Example with a simple cos/sin path](https://www.babylonjs-playground.com/#LG3GS#8)   


Your function must just return a radius value.  
Example :
```javascript
var myFunction = function(i, distance) {
  var radius = 3 * Math.cos(distance / 5);
  return radius;
};
var tube = BABYLON.Mesh.CreateTube("lumps", path, null, 20, myFunction, scene);
```

Here is an example with both an _i_ sinusoidal radius function and _x_ sinusoidal incrementing path :
https://www.babylonjs-playground.com/#LG3GS#9    
Here's another example with a circular path and varying radius : https://www.babylonjs-playground.com/#LG3GS#10  