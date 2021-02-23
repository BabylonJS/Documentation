---
title: Creating A Cylinder
image: 
description: Learn how to create a cylinder in Babylon.js.
keywords: diving deeper, meshes, set shapes, standard shapes, cylinder
further-reading:
video-overview:
video-content:
---

## Cylinder or Cone
The created cylinder has its flat sides parallel to the xz plane with its origin at the center of the vertical line of symmetry. If you set _diameterTop_ to zero, you get a cone instead of a cylinder, with different values for _diameterTop_ and _diameterBottom_ you get a truncated cone.
## MeshBuilder
Usage :
```javascript
const cone = BABYLON.MeshBuilder.CreateCylinder("cone", options, scene); //scene is optional and defaults to the current scene
```

option|value|default value
--------|-----|-------------
height|_(number)_ height of the cylinder|2
diameterTop|_(number)_ diameter of the top cap, can be zero to create a cone, overwrites the _diameter_ option|1
diameterBottom|_(number)_ diameter of the bottom cap, can't be zero, overwrites the _diameter_ option|1
diameter|_(number)_ diameter of both caps|1
tessellation|_(number)_ number of radial sides|24
subdivisions|_(number)_ number of rings|1
faceColors|_(Color4[])_ array of 3 _Color4_, 0 : bottom cap, 1 : cylinder tube, 2 : top cap|Color4(1, 1, 1, 1) for each face
faceUV|_(Vector4[])_ array of 3 _Vector4_, 0 : bottom cap, 1 : cylinder tube, 2 : top cap| UVs(0, 0, 1, 1) for each face
arc|_(number)_ ratio of the circumference between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 

### Examples
Cylinder: <Playground id="#QANVC6" title="Create a Cylinder" description="Simple example of creating a cylinder."/>
Cone: <Playground id="#QANVC6#1" title="Create a Cone" description="Simple example of creating a cone."/>
Triangular Prism: <Playground id="#QANVC6#2" title="Create a Triangular Prism" description="Simple example of creating a triangular prism."/>
Arc <Playground id="#QANVC6#3" title="Create an Arc" description="Simple example of creating an arc."/>

![can label and top](/img/how_to/apply-material-to-faces/logo_label.jpg)

Cylinder with faceUVs <Playground id="#QANVC6#4" title="Create a Cylinder With Face UVs" description="Simple example of creating a cylinder with face UVs."/>

## Mesh
Usage :
```javascript
const cylinder = BABYLON.Mesh.CreateCylinder("cylinder", height, diameterTop, diameterBottom, tessellation, subdivisions, scene);
const cylinder = BABYLON.Mesh.CreateCylinder("cylinder", height, diameterTop, diameterBottom, tessellation, subdivisions, scene, updatable, sideOrientation); //optional parameters after scene
```