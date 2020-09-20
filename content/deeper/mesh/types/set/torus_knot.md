# Torus Knot
A torus knot is a continuous shape that twists and turns around the surface of a torus. The number of twists and turns are determined by two windings integers p and q. The simplest knotted knot is with 2 and 3 for p and q. The origin of the created torus knot is at the center of the underlying torus.

## MeshBuilder
Example :
```javascript
const torus = BABYLON.MeshBuilder.CreateTorusKnot("torusKnot", options, scene);
```

option|value|default value
--------|-----|-------------
radius|_(number)_ radius of the torus knot|2
tube|_(number)_ thickness of its tube|0.5
radialSegments|_(number)_ number of radial segments|32
tubularSegments|_(number)_ number of tubular segments|32
p|_(number)_ number of windings|2
q|_(number)_ number of windings|3
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 

### Examples
Simplest https://www.babylonjs-playground.com/#SVU8U9#1
Low p and q https://www.babylonjs-playground.com/#SVU8U9#2
High p and q https://www.babylonjs-playground.com/#SVU8U9#3
Breaking the rules - using high non integer P and q https://www.babylonjs-playground.com/#SVU8U9#4

# Mesh
```javascript
const knot = BABYLON.Mesh.CreateTorusKnot("knot", radius, tube, radialSegments, tubularSegments, p, q, scene);
const knot = BABYLON.Mesh.CreateTorusKnot("knot", radius, tube, radialSegments, tubularSegments, p, q, scene, updatable, sideOrientation); //optional parameters after scene
```

