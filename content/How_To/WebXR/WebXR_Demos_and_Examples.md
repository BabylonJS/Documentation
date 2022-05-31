---
title: WebXR Demos and Examples
image: 
description: Check out a series of WebXR demos and examples in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR, demo, example
further-reading:
video-overview:
video-content:
---

## Basic scene

This is a step-by-step guide on how to add XR features to a basic scene

## Basic Scene with XR Support

Here we just add an environment, a sphere, and XR support

``` javascript
const xrHelper = await scene.createDefaultXRExperienceAsync();
```

<Playground id="#9K3MRA" title="Basic Scene With WebXR Support" description="Simple example of a basic scene with WebXR support."/>

### Adding teleportation

To get teleportation enabled, we want to provide the experience helper with an array of floor meshes:

``` javascript
const xrHelper = await scene.createDefaultXRExperienceAsync({
    // define floor meshes
    floorMeshes: [environment.ground]
});
```

<Playground id="#9K3MRA#1" title="Basic Scene With Teleportation" description="Simple example of a basic scene with teleportation enabled." isMain={true} category="VR/AR"/>

### Adding a color picker to the basic scene

Add a color picker (from our GUI library) and use it to change the sphere's color.

Notice that no changes were made in the XR code, and that the scene works perfectly well outside VR as well.

``` javascript
// GUI
var plane = BABYLON.Mesh.CreatePlane("plane", 1);
plane.position = new BABYLON.Vector3(1.4, 1.5, 0.4)
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
var panel = new BABYLON.GUI.StackPanel();
advancedTexture.addControl(panel);
var header = new BABYLON.GUI.TextBlock();
header.text = "Color GUI";
header.height = "100px";
header.color = "white";
header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
header.fontSize = "120"
panel.addControl(header);
var picker = new BABYLON.GUI.ColorPicker();
picker.value = sphere.material.diffuseColor;
picker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
picker.height = "350px";
picker.width = "350px";
picker.onValueChangedObservable.add(function(value) {
    sphere.material.diffuseColor.copyFrom(value);
});
panel.addControl(picker);
```

<Playground id="#9K3MRA#2" title="WebXR Color Picker" description="Simple WebXR color picker example." isMain={true} category="VR/AR"/>

## Other demos

VR devices are required.  

<Playground id="#F41V6N#139" title="A cylinder object is child of a controller" description="A cylinder object is child of a controller" isMain={true} category="VR/AR"/>  

<Playground id="#1FTUSC#29" title="Simply grabbing objects by controllers" description="Simply grabbing objects by controllers" isMain={true} category="VR/AR"/>  

<Playground id="#PPM311#63" title="Goalkeeper Training" description="Goalkeeper Training" isMain={true} category="VR/AR"/>
<Playground id="#B922X8#19" title="Physics Playground" description="Physics Playground" isMain={true} category="VR/AR"/>

## Babylon.js scenes with XR support

<Playground id="#JA1ND3#161" title="Mansion" description="Mansion Demo"/>
<Playground id="#TJIGQ1#3" title="Hill Valley" description="Hill Valley"/>
<Playground id="#JA1ND3#164" title="Espilit" description="Espilit"/>

## WebXR with Vite
Step-by-step project setup using Vite and Babylon.js ES6 modules for
WebXR development.

### Install Vite
```bash
## Setup vite
npm create vite@latest
##> Project name: babylon-webxr-test
##> Select a framework: vanilla
##> Select a variant: vanilla-ts
```

### Install @babylonjs ES6 packages
```bash
npm install @babylonjs/core@^5.0.0-beta.8
npm install @babylonjs/loaders@^5.0.0-beta.8
```

### Enable HTTPS dev server
HTTPS is required by most VR devices. Create or modify `vite.config.ts`:
```javascript
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3443,
    https: true,
    // Uncomment to allow access from network
    // (or use `npm run dev -- -- host=0.0.0.0`)
    //host: '0.0.0.0',
  },
})
```

### Setup a basic WebXR scene
Modify `main.ts`:
```javascript
import './style.css'

import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
import { Color3 } from '@babylonjs/core/Maths/math.color.js'
import { Engine } from '@babylonjs/core/Engines/engine.js'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper.js'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.js'
import { Scene } from '@babylonjs/core/scene.js'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js'
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience.js'

// Required for EnvironmentHelper
import '@babylonjs/core/Materials/Textures/Loaders'

// Enable GLTF/GLB loader for loading controller models from WebXR Input registry
import '@babylonjs/loaders/glTF'

// Without this next import, an error message like this occurs loading controller models:
//  Build of NodeMaterial failed" error when loading controller model
//  Uncaught (in promise) Build of NodeMaterial failed: input rgba from block
//  FragmentOutput[FragmentOutputBlock] is not connected and is not optional.
import '@babylonjs/core/Materials/Node/Blocks'

// Create a canvas element for rendering
const app = document.querySelector<HTMLDivElement>('#app')
const canvas = document.createElement('canvas')
app?.appendChild(canvas)

// Create engine and a scene
const babylonEngine = new Engine(canvas, true)
const scene = new Scene(babylonEngine)

// Add a basic light
new HemisphericLight('light1', new Vector3(0, 2, 0), scene)

// Create a default environment (skybox, ground mesh, etc)
const envHelper = new EnvironmentHelper({
  skyboxSize: 30,
  groundColor: new Color3(0.5, 0.5, 0.5),
}, scene)

// Add a camera for the non-VR view in browser
const camera = new ArcRotateCamera("Camera", -(Math.PI / 4) * 3, Math.PI / 4, 10, new Vector3(0, 0, 0), scene);
camera.attachControl(true)

// Add a sphere to have something to look at
const sphereD = 1.0
const sphere = MeshBuilder.CreateSphere('xSphere', { segments: 16, diameter: sphereD }, scene)
sphere.position.x = 0
sphere.position.y = sphereD * 2
sphere.position.z = 0
const rMat = new StandardMaterial("matR", scene)
rMat.diffuseColor = new Color3(1.0, 0, 0)
sphere.material = rMat

// Setup default WebXR experience
// Use the enviroment floor to enable teleportation
WebXRDefaultExperience.CreateAsync(scene, {
  floorMeshes: [envHelper?.ground as Mesh],
  optionalFeatures: true,
})

// Run render loop
babylonEngine.runRenderLoop(() => {
  scene.render()
})
```

Corresponding git repo: [kaliatech/babylon-docs-vite-webxr](https://github.com/kaliatech/babylon-docs-vite-webxr)

### Run server and verify
Start vite dev server and make it accessible from the network:
```bash
npm run dev -- --host 0.0.0.0
```

Browsing to `https://<your-server-ip>:3443` on a desktop machine should show the basic scene. If
the [WebXR API Emulator](https://github.com/MozillaReality/WebXR-emulator-extension) is enabled, you
should also see Babylon.js's default VR headset mode icon

If viewing from within a headset, the controller models should correspond to what is available in the global 
registry for your device.

To check TypeScript types and build:
```bash
npm run build
```
Using the setup above, vite reports a vendor.js size of ~2.4MB (520k gzipped) as of babylon-5.0.0-beta.8.

