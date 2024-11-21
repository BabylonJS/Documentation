---
title: Edge Detection
image: 
description: Check out the edge detection post process in your Babylon.js scenes.
keywords: babylon.js, tools, resources, assets, post process, edge detection, outline, toon
further-reading:
video-overview:
video-content:
---


## Using the Edge detection post-process

With this Edge Detection post-process, you can create full-scene outlines in a style suited for comics or games, which cannot be achieved with renderOutline, edgeRendering, or HighlightLayer.

If you’re aiming for that look, this tutorial is for you.

![Screenshot](/img/resources/edgeDetectionPP/EDPP.png)

## How to use ?

To use it, attach the post-process to your main camera to enable the effect.

```javascript
// Creates the post process
var edgeDetectionPostProcess = new BABYLON.EdgeDetectionPostProcess("EdgeDetection", camera);
```
<Playground id="#HBSUDW" title="Edge Detection Post Process Demo" description="Edge Detection Post Process Demo"/>

## Going further

You can adjust the thickness of the outlines like so:

```javascript
// Creates the post process with custom width, intensity, color
edgeDetectionPostProcess.edgeWidth = 1; // default is 1.0 
edgeDetectionPostProcess.edgeIntensity = 1;
edgeDetectionPostProcess.edgeColor = BABYLON.Color3.Red();
```

<Playground id="#HBSUDW#1" title="Edge Detection Post Process Render Mode Demo" description="Edge Detection Post Process Render Mode Demo"/>

Additionally, you can change the render mode

```javascript
// General :0, Normal: 1, Depth: 2, Only Outline: 3 
edgeDetectionPostProcess.renderMode = 3; // default is 1 
```

Here is a full demo where you can control all properties of the EdgeDetection PostProcess."
Futhermore, you can check the cel materials with outline.

![Screenshot](/img/resources/edgeDetectionPP/EDPP2.png)

<Playground id="#T6IKWW" title="Edge Detection Post Process Full Demo" description="Edge Detection Post Process Full  Demo"/>

The available parameters are:

- edgeWidth: Controls the thickness of the edge lines. Higher values create thicker outlines. Default is 1.0.
- edgeIntensity: Adjusts the intensity or brightness of the outline effect. Higher values make edges appear more prominent. Default is 1.0.
- edgeColor: Defines the color of the outline using BABYLON.Color3 format, allowing for customization of edge hue. Default is BABYLON.Color3.Black().
- renderMode: Sets the rendering mode for the post-process effect:
    0: General (combined view with edge effect and scene),
    1: Normal (shows the scene with edge overlay),
    2: Depth (emphasizes depth for 3D effect),
    3: Only Outline (displays only the edges, hiding other details).

For optimal results, adjust edgeWidth and edgeIntensity in combination. 
Modifying only one may make it difficult to achieve the desired effect, as these parameters work best when balanced to create clear and precise outlines.