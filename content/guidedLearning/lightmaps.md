---
title: Level prototyping using baked lightmaps
image: 
description: Bake lightmaps and use them for a level test playground
keywords: lightmaps, blender, baking, gltf, beginner, intermediate, introduction
further-reading:
video-overview:
video-content:
---

# Intro

The following steps will guide you through baking lightmaps for your test level with Blender.
Lightmaps can help you make unique levels by tweaking lighting and making it look good independently of the hardware.
This tutorial was made for Blender because it's easily available, but most steps can be adapted to Maya or 3DSMax.

## Modeling
Model the room using cubes.
Remove the roof.
![Modeling](/img/how_to/lightmaps/lm1-0.webp)
Model stairs in less than 40 seconds: https://www.youtube.com/watch?v=J4T256mVkS0

## Material and textures
Create 2 materials: 1 for walls and 1 for the ground.
![Material and textures](/img/how_to/lightmaps/lm2-0.webp)
Select the faces in edit mode, then click the Apply button.
![Material and textures](/img/how_to/lightmaps/lm2-1.webp)

## Lighting
Add sun light.
![Lighting](/img/how_to/lightmaps/lm3-0.webp)
Add an area light that covers the whole scene.
![Lighting](/img/how_to/lightmaps/lm3-1.webp)

## UV set
Select all faces in edit mode. Apply a box UV projection.
![UV set](/img/how_to/lightmaps/lm4-0.webp)
Go to UV edit mode. Scale the UVs up until the pixel density is good.
![UV set](/img/how_to/lightmaps/lm4-1.webp)

## 2nd UV set
Add a new UV set and set it as active.
![2nd UV set](/img/how_to/lightmaps/lm5-0.webp)
Select all faces and Lightmap Pack menu option.
![2nd UV set](/img/how_to/lightmaps/lm5-1.webp)

## Preparing shading
Add 2 UV maps: the first for the default UV set and the second for the lightmap set.
![Preparing shading](/img/how_to/lightmaps/lm6-0.webp)
![Preparing shading](/img/how_to/lightmaps/lm6-1.webp)
Create a new lightmap image with an appropriate size.
![Preparing shading](/img/how_to/lightmaps/lm6-2.webp)

## Baking
With Cycles renderer: Diffuse lighting without color.
![Baking](/img/how_to/lightmaps/lm7-0.webp)
Do not forget to save the baked image as a lightmap.

## Test Playground
Export the scene as a glb and upload it so it's available online.
Make a new Playground and copy-paste the code.
Apply the lightmap to every mesh.
![Result](/img/how_to/lightmaps/lmResult.webp)

<Playground id="#SSD1Q5#1" title="Scene with lightmap" description="Scene with lightmap"/>