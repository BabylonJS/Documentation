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

<Playground id="#9K3MRA#1" title="Basic Scene With Teleportation" description="Simple example of a basic scene with teleportation enabled."/>

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

<Playground id="#9K3MRA#2" title="WebXR Color Picker" description="Simple WebXR color picker example."/>

## Other demos

<Playground id="#PPM311#63" title="Goalkeeper Training" description="Goalkeeper Training"/>
<Playground id="#B922X8#19" title="Physics Playground" description="Physics Playground"/>

## Babylon.js scenes with XR support

<Playground id="#JA1ND3#161" title="Mansion" description="Mansion Demo"/>
<Playground id="#TJIGQ1#3" title="Hill Valley" description="Hill Valley"/>
<Playground id="#JA1ND3#164" title="Espilit" description="Espilit"/>