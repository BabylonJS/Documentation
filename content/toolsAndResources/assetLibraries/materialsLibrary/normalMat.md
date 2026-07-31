---
title: Normal Material
image: 
description: The Babylon.js materials library illustrates the range of normals across the mesh.
keywords: library, materials, materials library, normal material
further-reading:
video-overview:
video-content:
---

![Screenshot](/img/extensions/materials/normal.webp)

## Playground Example 
    
PG: <Playground id="#22VQKB" title="Normal Material" description="Example of normal material"/>

## Using the normal material

It's very simple:
```
var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 512, height: 512, subdivisions: 32 }, scene);
var normalMaterial = new BABYLON.NormalMaterial("normal", scene);
ground.material = normalMaterial;
```

## Customize the normal material

You can also add a diffuse texture to the normal material.
The normal colors will be mixed with the texture color.

```
normalMaterial.diffuseTexture = new BABYLON.Texture("textures/amiga.jpg", scene);
```
