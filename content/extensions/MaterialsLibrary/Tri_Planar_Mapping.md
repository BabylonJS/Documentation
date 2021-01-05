---
title: Tri-Planar Mapping Material
image: 
description: The Babylon.js materials library tri-planar mapping material provides an elegant technique to give realistic textures from any angle or on any complex shape.
keywords: welcome, babylon.js, library, materials, materials library, tri-planar, tri-planar material
further-reading:
video-overview:
video-content:
---

![Tri-Planar Mapping Material](/img/extensions/materials/triPlanar.jpg)

# Playground Example

PG: <Playground id="#E6OZX#9" title="Tri-Panar Material" description="Example of tri-planar material"/>

Press "1" to activate the Tri-Planar material (by default)
Press "2" to active the default material

# What are you talking about??
In the case of very large scenes, you are likely to use terrains generated using procedural methods.
In this case, you'll have to compute the vertices positions, normals and UVs (and so on).
One of the most tricky tasks should be to generate the UV coordinates properly without taking care of the possible abrupt changes of the terrains.

For example, an abrupt change can cause this kind of glitches:

![Tri-Planar Mapping Material Problem](/img/extensions/materials/triPlanarProblem.jpg)

That should look like:

![Tri-Planar Mapping Material Resolved](/img/extensions/materials/triPlanarResolved.jpg)

The tri-planar mapping material tends to resolve this kind of problem, but above all, allows to completely eliminate the UV calculations: no UV needed.

# Using the tri-planar mapping material

The tri-planar material works with at least 3 textures: each texture represents how it is applied on each axis (X, Y and Z).

Of course, each axis can share the same texture. Example:

```javascript
var triPlanarMaterial = new BABYLON.TriPlanarMaterial("triplanar", scene);

// The 3 diffuse textures must be set, even if they share the same texture reference
triPlanarMaterial.diffuseTextureX = new BABYLON.Texture("rock.png", scene);
triPlanarMaterial.diffuseTextureY = new BABYLON.Texture("grass.png", scene);
triPlanarMaterial.diffuseTextureZ = triPlanarMaterial.diffuseTextureX;
```

You can also customize the tile size by setting the .tileSize property:

```javascript
triPlanarMaterial.tileSize = 1.5;
```

For more quality, the tri-planar material also supports normal mapping. Just set the normal textures:

```javascript
var triPlanarMaterial = new BABYLON.TriPlanarMaterial("triplanar", scene);
// ...

// In the case of normal maps, it is not necessary to set the 3 textures
triPlanarMaterial.normalTextureX = new BABYLON.Texture("textures/rockn.png", scene);
triPlanarMaterial.normalTextureY = new BABYLON.Texture("textures/grassn.png", scene);
triPlanarMaterial.normalTextureZ = triPlanarMaterial.normalTextureX;
```


To go further in the theory, you can read this [great article](http://gamedevelopment.tutsplus.com/articles/use-tri-planar-texture-mapping-for-better-terrain--gamedev-13821) about tri-planar mapping.

