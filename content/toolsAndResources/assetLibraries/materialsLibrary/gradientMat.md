---
title: Gradient material
image: 
description: The Babylon.js materials library gradient material creates a smooth gradient with two colors.
keywords: library, materials, materials library, gradient, gradient material
further-reading:
video-overview:
video-content:
---

![Screenshot](/img/extensions/materials/gradient.jpg)

You can get the gradient material:

* Using npm with npm install --save babylonjs babylonjs-materials
* With a direct reference to: https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

## Using the gradient material

The material creates a smooth gradient with two colors:

```
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { segments: 32, diameter: 2 }, scene);

var gradientMaterial = new BABYLON.GradientMaterial("grad", scene);
gradientMaterial.topColor = BABYLON.Color3.Red(); // Set the gradient top color
gradientMaterial.bottomColor = BABYLON.Color3.Blue(); // Set the gradient bottom color
gradientMaterial.offset = 0.25;

sphere.material = gradientMaterial;
```

The gradient material can be configured with:
* `topColor` and `bottomColor` are the two colors used in this gradient material
* `offset` is a number used to offset the color on the Y axis
* `scale` is a number used to scale the color on the Y axis
* `smoothness` is a number (between 0 and 10) which can be used to define the speed of the color change along Y axis (1 by default)

## Playground example

You can find a live example here:  PG: <Playground id="#2IFRKC#63" title="Gradient Material" description="Example of gradient material"/>
