---
title: Playground Template JavaScript
image: 
description: A simple playground template
keywords: templates, template, playground
further-reading: 
  - title: Setup with NPM
    url: /divingDeeper/developWithBjs/npmSupport
  - title: Setup with Tree Shaking
    url: /divingDeeper/developWithBjs/treeShaking
video-overview:
video-content:
---

## Create a Scene

The playground allows you to quickly experiment with a 3D scene using Babylon.js. Displaying the scene via the Babylon.js engine is all done by the playground app.

<Playground id="#WJXQP0" title="Basic Playground" description="CreateScene Playground Template." />

### Decription

```javascript
const createScene = function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);

    // Creates and positions a free camera
    const camera = new BABYLON.FreeCamera("camera1", 
        new BABYLON.Vector3(0, 5, -10), 
        scene);

    // Targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // Creates a light, aiming 0,1,0
    const light = new BABYLON.HemisphericLight("light", 
        new BABYLON.Vector3(0, 1, 0), 
        scene);

    // Dim the light a small amount 0 - 1
    light.intensity = 0.7;

    // Built-in 'sphere' shape.
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 
        {diameter: 2, segments: 32}, 
        scene);

    // Move phere upward 1/2 its height
    sphere.position.y = 1;

    // Built-in 'ground' shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", 
        {width: 6, height: 6}, 
        scene);

    return scene;
};
```
