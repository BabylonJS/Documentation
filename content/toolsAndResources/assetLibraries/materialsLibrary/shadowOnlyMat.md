---
title: ShadowOnly Material
image: 
description: The Babylon.js materials library ShadowOnlyMaterial displays only shadows casted by a light on a receiving object.
keywords: library, materials, materials library, shadows, shadow material
further-reading:
video-overview:
video-content:
---

## General

![Screenshot](/img/extensions/materials/shadowOnly.jpg)

The goal of the ShadowOnlyMaterial is to display only shadows casted by a light on a receiving object. It is mostly useful when you want to display shadow on a transparent canvas (on top of your existing DOM).

ShadowOnly material can be found here: [https://cdn.babylonjs.com/materialsLibrary/babylon.shadowOnlyMaterial.js](https://cdn.babylonjs.com/materialsLibrary/babylon.shadowOnlyMaterial.js)

> ⚠️ WARNING: The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to developers who are learning how to use the platform and for running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN.

A demo can be found here: PG: <Playground id="#1KF7V1" title="Shadow Only Material" description="Example of shadow only material"/>

## Using the ShadowOnly material

ShadowOnly material is dead simple to use. Just apply it as material to any mesh where you want to display only shadow:

```
var ground = BABYLON.Mesh.CreatePlane('ground', 1000, scene)
ground.rotation.x = Math.PI / 2
ground.material = new BABYLON.ShadowOnlyMaterial('shadowOnly', scene)
ground.receiveShadows = true
```

By default the shadow color is black but you can force an artificial color with `material.shadowColor = BABYLON.Color3.Red()`.

Demo here:  PG: <Playground id="#1KF7V1#19" title="Shadow Only Material" description="Example of shadow only material color"/>

**Limitation:** Please note that only the first light that can reach the mesh will be used. 
So if you have multiple lights in your scene you may end up using `light.includedOnlyMeshes` or `light.excludedMeshes` or `light.includeOnlyWithLayerMask` or `light.excludeWithLayerMask`.
You can also force the material to pick a specific light with `material.activeLight = light`.


