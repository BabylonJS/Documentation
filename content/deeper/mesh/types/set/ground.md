# Ground
## MeshBuilder
A flat horizontal surface parallel to the plane XoZ subdivided into sections.
Example :
```javascript
var ground = BABYLON.MeshBuilder.CreateGround("gd", {width: 6, subdivisions: 4}, scene);
```

option|value|default value
--------|-----|-------------
width|_(number)_ size of the width|1
height|_(number)_ size of the height|1
updatable|_(boolean)_ true if the mesh is updatable|false
subdivisions|_(number)_ number of square subdivisions|1

* [Playground Example of Ground](https://www.babylonjs-playground.com/#MJ6YSM)

## Mesh
```javascript
var ground = BABYLON.Mesh.CreateGround("ground", 6, 6, 2, scene);
```

Parameters are: name, width, depth, subdivs, scene

Our *Playground Demo Scene 01* uses a CreateGround constructor... so you can see one in action by using the link below:

https://www.babylonjs-playground.com/#TAZ2CB