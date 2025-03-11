---
title: Smart Filters
image:
description: Smart Filters is a system for building node-based 2D shader effects for scenarios like real-time video filters.
keywords: video, babylon.js, sfe, smart, filter, effect
further-reading:
video-overview:
video-content:
---

Babylon Smart Filters is a node-based graph system for building GPU accelerated 2D effects for scenarios like real-time video filters. We call them smart because this feature includes an optimizer which automatically minimizes the number of draw calls and intermediate textures for you.
s
You can build Smart Filters programmatically:

```javascript
const smartFilter = new SmartFilter("Default");

const pixelateBlock = new PixelateBlock(smartFilter, "Pixelate");

const textureInputBlock = new InputBlock(smartFilter, "Texture", ConnectionPointType.Texture, null);
textureInputBlock.editorData = {
  url: "/assets/logo.png",
  urlTypeHint: "image",
  flipY: true,
  anisotropicFilteringLevel: null,
  forcedExtension: null,
};

const intensityInputBlock = new InputBlock(smartFilter, "Intensity", ConnectionPointType.Float, 0.5);
intensityInputBlock.editorData = {
  animationType: null,
  valueDeltaPerMs: null,
  min: 0.0,
  max: 1.0,
};

textureInputBlock.output.connectTo(pixelateBlock.input);
intensityInputBlock.output.connectTo(pixelateBlock.intensity);
pixelateBlock.output.connectTo(smartFilter.output);
```

Or visually using a new tool, the [Smart Filter Editor](https://sfe.babylonjs.com):
![SFE](/img/how_to/smart-filters/sfe-default.png)

See the following sub topics to learn about how to get started with Smart Filters, how to integrate them into your projects, how to create custom blocks, and more.
