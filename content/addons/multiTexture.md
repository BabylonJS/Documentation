---
title: MultiTexture
image:
description: The MultiTexture addon composites multiple texture layers into a single texture that can be updated at runtime.
further-reading:
video-overview:
video-content:
---

_This feature is a work in progress._

# MultiTexture

## Introduction

The MultiTexture addon composites multiple texture layers into a single texture. Each layer can be an image URL or a data URL, and layers can be replaced at runtime, making it easy to build dynamic materials such as colorizable surfaces.

## Installation

The MultiTexture addon is available as an ES6 NPM package:

```shell
npm install @babylonjs/addons --save
```

and as a UMD NPM package:

```shell
npm install babylonjs-addons --save
```

When using the ES6 package, import the `MultiTexture` class directly from its subpath:

```javascript
import { MultiTexture } from "@babylonjs/addons/multiTexture";
```

## Scene Setup

### PBRMaterial

MultiTexture instances can be assigned to any material texture slot, such as `albedoTexture` on a [physically based material (PBR)](/features/featuresDeepDive/materials/using/introToPBR).

```javascript
const material = new PBRMaterial("mat", scene);
material.metallic = 0;
material.roughness = 1;
```

### Creating the MultiTexture

Create the MultiTexture by passing a list of layers and the desired dimensions of the composited texture.

```javascript
const multiTexture = new MultiTexture("myTex", [baseColor, checkers1, checkers2], scene, {
    width: 1024,
    height: 1024,
});

material.albedoTexture = multiTexture;
```

Layers are composited in order, so the first layer is rendered at the bottom and the last layer at the top.

## Updating Layers

A layer can be replaced at runtime with `updateLayerAsync`, passing the layer index and the new image source.

<Playground id="#PETUJT#3" title="MultiTexture Layer Update" description="A GUI color picker generates a new solid color image and updates the base layer of the MultiTexture." />

```javascript
await multiTexture.updateLayerAsync(0, newColorImage);
```

The playground above uses a GUI color picker to generate a new solid color image, updating the base layer whenever the color changes:

```javascript
colorPicker.onValueChangedObservable.add(async (res) => {
    const newColor = makeSolidPng(res.r * 255, res.g * 255, res.b * 255, 255, 128);
    await multiTexture.updateLayerAsync(0, newColor);
});
```
