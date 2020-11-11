---
title: Normal Material
image: 
description: The Babylon.js materials library illustrates range of normals across the mesh.
keywords: welcome, babylon.js, library, materials, materials library, normal material
further-reading:
video-overview:
video-content:
---

![Screenshot](/img/extensions/materials/normal.jpg)

## Playgound Example 
    
PG: <Playground id="#22VQKB" title="Normal Material" description="Example of normal material" image=""/>

## Using the normal material

Very simple : 
```
var ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, scene);
var normalMaterial = new BABYLON.NormalMaterial("normal", scene);
ground.material = normalMaterial;
```

## Customize the normal material

You can add a diffuse texture to the normal material, because why not?
Normal colors will be mixed with texture color.

```
normalMaterial.diffuseTexture = new BABYLON.Texture("textures/amiga.jpg", scene);
```

