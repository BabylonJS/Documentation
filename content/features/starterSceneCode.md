---
title: Starter Scene Code
image: 
description: Describes getting started with the features of Babylon.js and the code for them
keywords: features, getting started, started, getting
further-reading:
video-overview:
video-content:
---

The online Playground allows you to quickly experiment with a 3D scene using Babylon.js. All the code is written inside the **createScene** function which must return a scene. A scene, camera and light must always be present. Displaying the scene is all done by the Playground. No need to load or run the babylon.js Engine as this is all done for you, in the background.


### Playground Example
In this playground a sphere and a ground have been created. Try changing the diameter of the sphere or the width of the ground. After any editing just select the run button &#x25B6; to rebuild the scene.  

<Playground id="#WJXQP0" title="Basic Playground" description="CreateScene Playground." />  

### Description

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
    // Move sphere upward 1/2 its height
    sphere.position.y = 1;
    // Built-in 'ground' shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", 
        {width: 6, height: 6}, 
        scene);
    return scene;
};
```
