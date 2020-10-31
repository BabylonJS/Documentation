# Sphere
The created sphere has its origin at the center of the sphere. By using different values for _diameterX_, _diameterY_ and diameterZ_ lead you create an ellipsoid.
# MeshBuilder
Example :
```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
segments|_(number)_ number of horizontal segments|32
diameter|_(number)_ diameter of the sphere|1
diameterX|_(number)_ diameter on X axis, overwrites _diameter_ option|diameter
diameterY|_(number)_ diameter on Y axis, overwrites _diameter_ option|diameter
diameterZ|_(number)_ diameter on Z axis, overwrites _diameter_ option|diameter
arc|_(number)_ ratio of the circumference (latitude) between 0 and 1|1
slice|_(number)_ ratio of the height (longitude) between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0, 0, 1,1)
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0, 0, 1,1) 

## Examples 
https://www.babylonjs-playground.com/#WIR77Z sphere

https://www.babylonjs-playground.com/#WIR77Z#1 ellipsoid

https://www.babylonjs-playground.com/#WIR77#2 arc

https://www.babylonjs-playground.com/#WIR77Z#3 arc and slice

# Mesh
Usage :
```javascript
const sphere = BABYLON.Mesh.CreateSphere("sphere", segments, diameter, scene);
const sphere = BABYLON.Mesh.CreateSphere("sphere", segments, diameter, scene, updatable, sideOrientation); //optional parameters after scene
```

It is only possible to create a sphere with this method, for an ellipsoid you need to use scaling.

