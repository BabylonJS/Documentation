---
title: Terrain Material
image:
description: The Babylon.js materials library terrain material displays upto 4 terrain textures.
keywords: library, materials, materials library, terrain, terrain material
further-reading:
video-overview:
video-content:
---

![Terrain Material](/img/extensions/materials/terrain.jpg)

## Playground example

PG: <Playground id="#E6OZX#7" title="Terrain Material" description="Example of terrain material"/>

## Using the terrain material

The terrain material works with at least 4 textures:

- 3 Diffuse textures. (required)
- 3 Bump textures. (not required)
- 1 Mixmap texture: represents the intensity of each diffuse texture according the channels R (red), G (green) and B (blue). (required)

In other words, the Mixmap texture mixes the 3 diffuse textures thanks to the color channels RGB.
A Mixmap texture looks like (result on the screenshot above):
![](/img/extensions/materials/terrainMixMap.png)

The method applied by the terrain material is also called "texture splatting".

```
var terrain = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "heightMap.png", 100, 100, 100, 0, 10, scene, false);

var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", scene);
terrainMaterial.mixTexture = new BABYLON.Texture("mixMap.png", scene);
terrainMaterial.diffuseTexture1 = new BABYLON.Texture("grass.png", scene);
terrainMaterial.diffuseTexture2 = new BABYLON.Texture("rock.png", scene);
terrainMaterial.diffuseTexture3 = new BABYLON.Texture("floor.png", scene);

terrainMaterial.bumpTexture1 = new BABYLON.Texture("grassn.png", scene);
terrainMaterial.bumpTexture2 = new BABYLON.Texture("rockn.png", scene);
terrainMaterial.bumpTexture3 = new BABYLON.Texture("floor_bump.png", scene);

terrain.material = terrainMaterial;
```

That's all.
