---
title: Level prototyping using baked lightmaps
image: 
description: Bake lightmaps and use it for a level test playground
keywords: lightmaps, blender, baking, gltf, beginner, intermediate, introduction
further-reading:
video-overview:
video-content:
---

# Intro

The following steps will guide you on baking lightmaps for your test level with Blender.
Lightmaps can help you make unique levels by tweaking lighting and making it look good independently of the hardware.
This tutorial has been made for Blender as it's easily available but most steps can be adapted to Maya or 3DSMax.

## Modeling
Model the room using cubes.
Remove the roof.
![Modeling](/img/how_to/lightmaps/lm1-0.jpg)
Model stairs in less than 40seconds: https://www.youtube.com/watch?v=J4T256mVkS0

## Material and textures
Create 2 materials: 1 for walls, 1 for ground.
![Material and textures](/img/how_to/lightmaps/lm2-0.jpg)
Select faces in edit mode, click apply button.
![Material and textures](/img/how_to/lightmaps/lm2-1.jpg)

## Lighting
Add sun light.
![Lighting](/img/how_to/lightmaps/lm3-0.jpg)
Add Area light that covers all scene.
![Lighting](/img/how_to/lightmaps/lm3-1.jpg)

## UV set
Select all faces in edit mode. Apply box UV projection.
![UV set](/img/how_to/lightmaps/lm4-0.jpg)
Go to UV edit mode. Scale UV up until pixel density is good.
![UV set](/img/how_to/lightmaps/lm4-1.jpg)

## 2nd UV set
Add new UV set and set it as active.
![2nd UV set](/img/how_to/lightmaps/lm5-0.jpg)
Select all faces and Lightmap Pack menu option.
![2nd UV set](/img/how_to/lightmaps/lm5-1.jpg)

## Preparing shading
Add 2 UV maps: First for Default UV set. Second for lightmap set.
![Preparing shading](/img/how_to/lightmaps/lm6-0.jpg)
![Preparing shading](/img/how_to/lightmaps/lm6-1.jpg)
Create new Lightmap image with appropriate size.
![Preparing shading](/img/how_to/lightmaps/lm6-2.jpg)

## Baking
With Cycles renderer: Diffuse lighting without color.
![Baking](/img/how_to/lightmaps/lm7-0.jpg)
Do not forget to save baked image Bake as lightmap.

## Test Playground
Export scene as glb and upload it so it's available online.
Make new playgound and copy paste code.
Apply lightmap to every meshes.
![Result](/img/how_to/lightmaps/lmResult.jpg)

<Playground id="#SSD1Q5#1" title="Scene with lightmap" description="Scene with lightmap"/>