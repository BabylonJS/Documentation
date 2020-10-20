# Lines
Lines are created as a contiguous series of attached line segments from a list of points. You must set at least the _points_ option. On update, you must set the _points_ and _instance_ options. You can also update the _colors_ option if previously set at construction time.

## MeshBuilder
Usage:
```javascript
const options = {
    points: myPoints, //vec3 array,
    updatable: true
}

let lines = BABYLON.MeshBuilder.CreateLines("lines", options, scene);  //scene is optional and defaults to the current scene

// Update
options.points[0].x +=6; 
options.instance = lines;
lines = BABYLON.MeshBuilder.CreateLines("lines", options); //No scene parameter when using instance
```

option|value|default value
--------|-----|-------------
points|_(Vector3[])_  array of Vector3, the path of the line **REQUIRED**
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line mesh to be updated|null
colors|_(Color4[])_ array of Color4, each point color|null
useVertexAlpha|_(boolean)_ false if the alpha blending is not required (faster)|true

Unlike a mesh Lines are colored after creation with a color property rather than a material.
```javascript
lines.color = new BABYLON.Color3(1, 0, 0);
```

### Examples
non updatable lines  https://www.babylonjs-playground.com/#MZ7QRG#6  
non updatable closed lines https://www.babylonjs-playground.com/#MZ7QRG#8  
updatable example https://www.babylonjs-playground.com/#MZ7QRG#9  
updatable spriral https://www.babylonjs-playground.com/#MZ7QRG#10  

multi colored lines have to be set on creation https://www.babylonjs-playground.com/#MZ7QRG#11

## Mesh
usage:
```javascript
let lines = BABYLON.Mesh.CreateLines("lines", points, scene);
let lines = BABYLON.Mesh.CreateLines("lines", points, scene, updatable, instance);
```  