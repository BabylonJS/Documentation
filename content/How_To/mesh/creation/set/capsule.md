# Capsule
*Requires BJS version 4.2+*
The created capsule has its origin at the center of the capsule. The height minus the sum of the top and bottom radius must be > 0.

# MeshBuilder
Usage :
```javascript
const capsule = BABYLON.MeshBuilder.CreateCapsule("ribbon", options, scene);  //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
orientation?|_(Vector3)_ Direction of the capsule upon inception. | Vector3.Up
subdivisions|_(number)_ Number of sub segments on the tube section of the capsule running parallel to orientation.| 2
tessellation|_(number)_  Number of cylindrical segments on the capsule.|16
height|_(number)_  Height or length of the capsule.|1
radius|_(number)_ Radius of the capsule.|0.25
capSubdivisions|_(number)_ Number of sub segments on the cap sections of the capsule running parallel to orientation.|6
radiusTop?|_(number)_  Overwrite for the top radius.
radiusBottom?|_(number)_  Overwrite for the bottom radius.
topCapSubdivisions?|_(number)_ Overwrite for the top capSubdivisions.
bottomCapSubdivisions?|_(number)_ Overwrite for the bottom capSubdivisions.

## Examples
Default capsule https://www.babylonjs-playground.com/#CL6HZ0  
Different cap subdivisions https://www.babylonjs-playground.com/#CL6HZ0#1  
Forward orientation https://www.babylonjs-playground.com/#CL6HZ0#2  
Different radii https://www.babylonjs-playground.com/#CL6HZ0#3  

# Mesh
```javascript
const capsule = BABYLON.Mesh.CreateCapsule("ribbon", options, scene);  //scene is optional and defaults to the current scene
```
The same form as for *MeshBuilder*