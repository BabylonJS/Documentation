---
title: Render Scenes To .png Files
image:
description: Learn how to render scenes to .png files.
keywords: diving deeper, scene, render, export, .png, png
further-reading:
video-overview:
video-content:
---

# How to

The `CreateScreenshot` functions can be utilized to render a screenshot of the contents of your scene, allowing you to download or even use it as a texture on the scene itself. The available methods are the following:

## CreateScreenshot

```javascript
scene.onReadyObservable.add(() => {
  BABYLON.Tools.CreateScreenshot(engine, camera, size, successCallback, mimeType, forceDownload, quality, useFill);
});
```

Observe that the screenshot creation is inside the scene's `onReadyObservable`, so it can wait for the meshes to be drawn. Otherwise, they won't appear in the screenshot.

<Playground id="#750168" title="Simple Screenshot Example" description="A simple example of how to use the CreateScreenshot method" />

The size parameter can be one of the following:

- A `{width: number, height: number}` with the width and height of the canvas and created screenshot.
- A `{precision: number}` value that is a multiplier of the current resolution of the canvas.
- A single number indicating both width and height.

The optional `useFill` parameter, when set to true, allows the render canvas to fill the screenshot. Otherwise, the render canvas will be "letterboxed" if its aspect ratio does not match the aspect ratio of the screenshot size.

The success callback is a function that contains the screenshot as a string of base64-encoded characters. This string can be assigned to the src parameter of an `<img>` to display it, or it can be used to create a new Texture in the scene.

<Playground id="#750168#1" title="Use screenshot as texture" description="Example of how to use the CreateScreenshot callback to assign the screenshot data as a texture in the scene" />

More information about the other arguments of the function can be found in its [documentation page](/typedoc/classes/BABYLON.Tools#CreateScreenshot).

This function also has a `CreateScreenshotAsync` version that can be waited for using the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) keyword.

_NOTE: If creating a screenshot with a camera that is NOT the scene's active camera, use `CreateScreenshotUsingRenderTarget` instead._

## CreateScreenshotUsingRenderTarget

As the name suggests, this function renders the screenshotted scene to a [RenderTargetTexture](/features/featuresDeepDive/postProcesses/renderTargetTextureMultiPass). It has a few more [configuration options](/typedoc/classes/BABYLON.Tools#CreateScreenshotUsingRenderTarget):

```javascript
BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, size, successCallback, mimeType, samples, antialiasing, fileName, renderSprites, enableStencilBuffer, useLayerMask, quality, customizeTexture);
```

The `customizeTexture` callback can be used to modify the texture before taking the screenshot. This can be used, for example, to modify its `renderList` property, changing which objects will appear on the screenshot. You can also turn on/off [post processes](/features/featuresDeepDive/postProcesses/usePostProcesses).

<Playground id="#2mvlub#22" title="CreateScreenshotUsingRenderTarget" description="Example of how to modify the renderList and useCameraPostProcesses of a screenshot texture."/>

It also has a `CreateScreenshotUsingRenderTargetAsync` version.
