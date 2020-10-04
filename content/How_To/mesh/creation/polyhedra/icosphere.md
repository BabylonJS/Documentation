# Icosphere
This a sphere based upon an icosahedron with 20 triangular faces which can be subdivided into smaller triangles.

## MeshBuilder
Usage:
```javascript
const icosphere = BABYLON.MeshBuilder.CreateIcoSphere("icosphere", options, scene);
```

options|value|default value
--------|-----|-------------
radius|_(number)_ radius | 1
radiusX|_(number)_  the X radius, overwrites the radius value|radius
radiusY|_(Vector3)_  the Y radius, overwrites the radius value|radius
radiusZ|_(number)_ the Z radius, overwrites the radius value|radius
subdivisions|_(number)_ the number of subdivisions|4
flat|_(boolean)_ if true, the mesh faces have their own normals|true
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

##Examples 
Icosphere https://www.babylonjs-playground.com/#HC5FA8
Smoothed Icossphere https://www.babylonjs-playground.com/#HC5FA8#2
Less subdivisions and changed radii https://www.babylonjs-playground.com/#HC5FA8#3
Icosphere with animation over subdivisions https://www.babylonjs-playground.com/#E3TVT#1

## Mesh
Usage:
```javascript
const icosphere = BABYLON.Mesh.CreateIcoSphere("icosphere", options, scene);
```
This is the same format as that for *MeshBuilder*