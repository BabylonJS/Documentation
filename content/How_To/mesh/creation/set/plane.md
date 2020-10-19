# Plane
The created plane is a flat surface parallel to the xy plane with its origin at the center of the plane.

## MeshBuilder
Usage :
```javascript
const plane = BABYLON.MeshBuilder.CreatePlane("plane", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
size|_(number)_ side size of the plane|1
width|_(number)_ size of the width|size
height|_(number)_ size of the height|size
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
sourcePlane|_(Plane)_ source plane (math) the mesh will be transformed to|null
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 

### Examples
single sided https://www.babylonjs-playground.com/#Q9VZS9#4  
double sided https://www.babylonjs-playground.com/#Q9VZS9#2  

Using this image  
![Two Tile Pattern](/img/how_to/mesh/tiles2.jpg)  
to texture the front and back  
front and back https://www.babylonjs-playground.com/#Q9VZS9#3

We can also create a plane from an abstract math plane  
https://www.babylonjs-playground.com/#Q9VZS9#1

## Mesh
Usage :
```javascript
const plane = BABYLON.Mesh.CreatePlane("plane", size, scene);
const plane = BABYLON.Mesh.CreatePlane("plane", size, scene, updatable, sideOrientation); //optional parameters after scene
```

It is only possible to create a square with this method, for a rectangle you need to use scaling.