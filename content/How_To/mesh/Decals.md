---
title: Decals
image: 
description: Learn how use decals in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, decals
further-reading:
    - title: Basic Shapes
      url: /divingDeeper/mesh/creation/set
video-overview:
video-content:
---

## How to Use Decals

These are usually used to add details on meshes (bullets hole, local details, etc...), a decal is a mesh produced from a subset of a previous one with a small offset in order to appear on top of it.

Creation Example :
```javascript
var decal = BABYLON.MeshBuilder.CreateDecal("decal", mesh,  {position: myPos}, scene);
```
Don't forget the _mesh_ parameter; this is the mesh to which the decal is applied.

Properties, all optional :

property|value|default value
--------|-----|-------------
position|_(Vector3)_ position of the decal (World coordinates) | (0, 0, 0)
normal|_(Vector3)_  the normal of the mesh where the decal is applied onto (World coordinates)|Vector3.Up
size|_(Vector3)_  the x, y, z sizes of the decal|(1, 1, 1)
angle|_(number)_ the angle to rotate the decal|0

<Playground id="#1BAPRM#73" title="Simple Example of Decals" description="Simple example of pasting decals in a Babylon.js scene." image=""/> click on the cat.