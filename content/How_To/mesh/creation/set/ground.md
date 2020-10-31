# Ground
A ground is a flat horizontal plane parallel to the xz plane which can be subdivided into rectangular regions. The origin of the ground is at the center of the plane. The optional properties for determining the size of the ground are width (x) and height (z) (and yes we all agree that depth would be more descriptive than height!)

# MeshBuilder
Usage :
```javascript
const ground = BABYLON.MeshBuilder.CreateGround("ground", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
width|_(number)_ size of the width|1
height|_(number)_ size of the height|1
updatable|_(boolean)_ true if the mesh is updatable|false
subdivisions|_(number)_ number of square subdivisions|1

## Example
Ground https://www.babylonjs-playground.com/#45R5JK  


# Mesh
Usage
```javascript
const ground = BABYLON.Mesh.CreateGround("ground", width, height, subdivisions, scene);
const ground = BABYLON.Mesh.CreateGround("ground", width, height, subdivisions, scene, updatable); //one optional parameter after scene
```