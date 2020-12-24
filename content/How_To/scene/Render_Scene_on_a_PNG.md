---
title: Render Scenes To .png Files
image: 
description: Learn how to render scenes to .png files.
keywords: diving deeper, scene, render, export, .png, png
further-reading:
video-overview:
video-content:
---

# How To Render a Scene to a PNG

First you may ask why is it better than "ctrl + prt scr" screenshot or the Snippet app?

1. With a standard ctrl + print screen keypress, you can't create screenshots with higher resolutions than your screen resolution. With BabylonJS screenshot feature, you can. There is no problem with creating a 1920x1080 screenshot on a 800x600 screen (provided the graphics card is powerful enough to compute it). However as you will see in the examples later there is no increase in pixel density.
2. The screenshot is of the rendered canvas only without further manipulation.
3. A sequence of screenshots can be taken that can be turned into an animated gif.

There are two methods available to do this using `BABYLON.Tools` which are `CreateScreenshot` and the more versatile `CreateScreenshotUsingRenderTarget`.

You also need to consider how you will trigger the screenshot. This can be done for example with a timer such as 'window.setTimeout' or by using the [Babylon.js action manager](/divingDeeper/events/actions) for a keyDown or onPointerDown trigger.

A major difference between `CreateScreenshot` and `CreateScreenshotUsingRenderTarget` is when you try to use them directly after creating a mesh or meshes. This is because they work differently.

For example

```javascript
var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
BABYLON.Tools.CreateScreenshot(engine, camera, 400);
```
will produce an image of the box but

```javascript
var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 400);
```
will only produce the scene background. This is because this method is activated before the box is actually rendered on the screen. If you want to use `CreateScreenshotUsingRenderTarget` in this way then you need to ensure the scene is rendered first as in this example.

```javascript
var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
scene.render();
BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 400);
```

However even this will not work if the scene is very complex and has not been rendered in time. It is best to use timing or an action.

## CreateScreenshot
It's done by simply calling this method: `BABYLON.Tools.CreateScreenshot(engine, camera, size)`.
You need to provide your BabylonJS engine, the camera you want to use for the rendering, and a size.

Please note that the engine must be created with `preserveDrawingBuffer` option:
```
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
```

The size parameter is very versatile, it can be a simple number or an object.

### Examples of Results

Starting with a view of the part of the screen showing the canvas there then follows a sequence of images taken using `CreateScreenshot`

![Actual Screen](/img/how_to/scene/shss.png)  
View of Part of Screen Showing Canvas Used

![size = 200](/img/how_to/scene/sh200x200.png)  
`BABYLON.Tools.CreateScreenshot(engine, camera, 200)`

![size = 800](/img/how_to/scene/sh800x800.png)  
`BABYLON.Tools.CreateScreenshot(engine, camera, 800)`

![size = 1600](/img/how_to/scene/sh1600x1600.png)  
`BABYLON.Tools.CreateScreenshot(engine, camera, 1600)`

![size = {width:800, height:400}](/img/how_to/scene/sh800x400.png)  
`BABYLON.Tools.CreateScreenshot(engine, camera, {width:800, height:400})` canvas placed in the middle of image of given size 

Precision can be used as a multiplier of the screen resolution.

![size = {precision: 0.5}](/img/how_to/scene/sh400p05.png)  
`BABYLON.Tools.CreateScreenshot(engine, camera, {precision: 0.5})`

![size = {precision: 2}](/img/how_to/scene/sh400p20.png)  
`BABYLON.Tools.CreateScreenshot(engine, camera, {precision: 2})`


## CreateScreenshotUsingRenderTarget
As for the other method it's done by simply calling this method: `BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, size)`.
You need to provide your BabylonJS engine, the camera you want to use for the rendering, and a size.

Again the size parameter is very versatile and can be a simple number or an object. However you will see differences in the results using the same parameters as before.

*Hint:* When using a camera other than the active camera, only objects located in the viewport of the active camera are visible. As a workaround, all meshes that should be visible can be explicitly set to `alwaysSelectAsActiveMesh = true`. In case of performance issues, the meshes can be set to `alwaysSelectAsActiveMesh = true` shortly before taking the screenshot and then to `alwaysSelectAsActiveMesh = false` again.

### Examples of Results

Starting with a view of the part of the screen showing the canvas there then follows a sequence of images taken using `CreateScreenshotUsingRenderTarget`

![Actual Screen](/img/how_to/scene/shss.png)  
View of Part of Screen Showing Canvas Used

![size = 200](/img/how_to/scene/rt200x200.png)  
`BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 200)`

![size = 800](/img/how_to/scene/rt800x800.png)  
`BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 800)`

![size = 1600](/img/how_to/scene/rt1600x1600.png)  
`BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 1600)`

![size = {width:800, height:400}](/img/how_to/scene/rt800x400.png)  
`BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {width:800, height:400})` canvas imaged sized as given.

Precision can be used as a multiplier of the screen resolution.

![size = {precision: 0.5}](/img/how_to/scene/rt400p05.png)  
`BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {precision: 0.5})`

![size = {precision: 2}](/img/how_to/scene/rt400p20.png)  
`BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {precision: 2})`

### Alternative Camera

The `CreateScreenshotUsingRenderTarget` has an extra facility, the camera used does not have to be the active camera.

While the active camera is showing the scene as in the above examples you can use this

```javascript
var camera2 = new BABYLON.FreeCamera("camera2", new BABYLON.Vector3(0, 200, 0), scene);
camera2.setTarget(BABYLON.Vector3.Zero());
    
BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera2, 400)
```
to produce

![secondcamera](/img/how_to/scene/fc.png) 

## Pixel Density

The following image of the canvas on screen and the resulting screenshot using 'precision: 8' show that although the image is 8 times larger the pixel density stays the same.

![Screen Canvas](/img/how_to/scene/sbss.png)

![Enlarged Image](/img/how_to/scene/sbp80.png)


## Gif Creation

In order to create an animated Gif, you will usually need a set of static images to stick together.

Either of the following set of codes produces a series of images that you can turn into an animated gif:

```javascript
var imgNm = 0;
scene.registerAfterRender(function(){
    box.rotation.y += 2 * Math.PI / 90;
    if(imgNm++ < 90) {
        BABYLON.Tools.CreateScreenshot(engine, camera, 200);
    }
})
```

```javascript
var imgNm = 0;
scene.registerAfterRender(function(){
    box.rotation.y += 2 * Math.PI / 90;
    if(imgNm++ < 90) {
        BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 200);
    }
})
```

Here is the result after stitching in your favorite external tool:

![Gif](/img/how_to/scene/ssanim.gif)

## Callback Function

There is a further parameter that can be added to both methods of obtaining screenshots. This is a callback function added after the size parameter. The methods become `BABYLON.Tools.CreateScreenshot(engine, camera, size, onSuccessCallback)`  and  `BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, size, onSuccessCallback)`.

This callback is a function that takes the image data provided by the method and instead of opening or saving the image allows you to manipulate it instead.

For example when you have rendered this scene

![Box and sky](/img/how_to/scene/bx1.png)

by triggering either of these

```javascript
BABYLON.Tools.CreateScreenshot(engine, camera, 200, function(data) {
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture(data, scene);
    box.material = mat;
})

BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 200, function(data) {
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = new BABYLON.Texture(data, scene);
    box.material = mat;
})
```
you obtain

![Box with sky texture and sky](/img/how_to/scene/bx2.png)

## Specific resolution with CreateScreenshot

You may end up having to use `BABYLON.Tools.CreateScreenshot` because you may need to capture advanced effets (that are not captured by the RTT version), In this case, if you want to get a specific resolution you can use the following code (please note the direct use of the `ScreenshotTools` class):

Example:
```
var currentCanvasSizeWidth = canvas.style.width;
var currentCanvasSizeHeight = canvas.style.height;
activeCanvas.style.width = renderWidth + "px";
activeCanvas.style.height = renderHeight + "px";
engine.resize(true);
BABYLON.ScreenshotTools.CreateScreenshotWithResizeAsync(engine, scene.activeCamera, renderWidth, renderHeight).then(() => {
    canvas.style.width = currentCanvasSizeWidth;
    canvas.style.height = currentCanvasSizeHeight;
    engine.resize(true);                        
});
```
