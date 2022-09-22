---
title: Lens Flares
image:
description: Learn how to use lens flares in your Babylon.js scene.
keywords: diving deeper, environment, lens flare
further-reading: ["https://doc.babylonjs.com/typedoc/classes/babylon.lensflaresystem", "https://doc.babylonjs.com/typedoc/classes/babylon.lensflare"]
video-overview:
video-content:
---

## How to use Lens Flares

Babylon.js allows you to simply create lens flares effect:

![Lens flares](/img/features/lensFlare.jpg)

<Playground id="#TQ67L1#5" title="Lens Flares" description="Show how to create a lens flares" />

To do so, you have to first create a LensFlareSystem:

```javascript
var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", myEmitter, scene);
```

The second parameter defines the source (the emitter) of the lens flares (it can be a camera, a light or a mesh).

Then, you can add flares to your system with the following code:

```javascript
var flare00 = new BABYLON.LensFlare(
  0.1, // size
  0, // position
  new BABYLON.Color3(1, 1, 1), // color
  "textures/flare.png", // texture
  lensFlareSystem, // lens flare system
);
var flare01 = new BABYLON.LensFlare(0.075, 0.5, new BABYLON.Color3(0.8, 0.56, 0.72), "textures/flare3.png", lensFlareSystem);
var flare02 = new BABYLON.LensFlare(0.1, -0.15, new BABYLON.Color3(0.71, 0.8, 0.95), "textures/Flare2.png", lensFlareSystem);
var flare03 = new BABYLON.LensFlare(0.15, 0.25, new BABYLON.Color3(0.95, 0.89, 0.71), "textures/flare.png", lensFlareSystem);
```

To create a flare, you must specify the following parameters:

- Size (a floating value between 0 and 1)
- Position (a floating value between -1 and 1). A value of 0 is located on the emitter. A value greater than 0 is beyond the emitter and a value lesser than 0 is behind the emitter
- Color
- Texture

Babylon.js can also detect occlusions for you. A mesh can occlude the lens flares if the following conditions are met:

- has a material
- isVisible === true
- isEnabled() === true
- isBlocker === true
