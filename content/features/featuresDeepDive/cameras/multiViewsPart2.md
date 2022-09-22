---
title: MultiViews Part 2
image:
description: Continue learning how to leverage multi-views in Babylon.js.
keywords: diving deeper, multiview
further-reading:
video-overview:
video-content:
---

## How to use Multi-Views

Babylon.js can render multiple views of the same scene.

## Active cameras

A scene has an [activeCamera](/typedoc/classes/babylon.scene#activecamera) property to define the point of view. But you can define many active cameras using code like this:

```javascript
scene.activeCameras.push(camera);
scene.activeCameras.push(camera2);
```

## Viewports

If you want to use many cameras, you will need to specify a viewport for each camera:

```javascript
camera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1.0);
camera2.viewport = new BABYLON.Viewport(0, 0, 0.5, 1.0);
```

A viewport is defined by the following constructor:

```javascript
BABYLON.Viewport = function (x, y, width, height);
```

where x, y, are the lower lefthand corner of the viewport followed by its width and height. Values for x, y, width, and height are numbers between 0 and 1 representing the fraction of the screen width and height, respectively.

<Playground id="#4JXV32" title="Viewport Example" description="A simple example of constructing a viewport." image="/img/playgroundsAndNMEs/divingDeeperMultiviews3.jpg"/>
