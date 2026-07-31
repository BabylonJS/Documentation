---
title: WebXR Layers
image:
description: WebXR Layers implementation in Babylon.js
keywords: babylon.js, diving deeper, WebXR, VR, AR, layers, fullscreen, antialias
further-reading:
video-overview:
video-content:
---

# WebXR Layers

WebXR Layers supports composition layers as part of the WebXR specs. This feature first needs to be enabled by the browser vendor you support in order to work correctly.

You can read the [WebXR Layers specs](https://www.w3.org/TR/webxrlayers-1/) if you want to understand the feature in full.

More and more layers will be added to Babylon's WebXR layers API (no pun intended).

## Babylon.js WebXR layers support

Babylon continuously adds new features to the API layers between the engine and the native WebXR layers API. At present, it mainly supports the projection layer, but further layers will be added gradually.

Be sure that the browser you are using supports layers. Otherwise, the session will either not start or not work as you expect.

## Enabling the WebXR layers module

To enable WebXR layers, you need to use the WebXR features manager. If you used the default experience helper, you can get the features manager that was created as part of the process. This will enable WebXR layers and automatically create the initial projection layer that is added when the module is created:

```javascript
const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
featuresManager.enableFeature(WebXRFeatureName.LAYERS, "stable" /* or latest */, {});
```

### Enabling multiview

WebXR layers can be used to enable multiview rendering of your scene. Multiview allows your scene to be rendered using a single render call, instead of rendering two cameras one after the other. This can, under certain conditions, improve your scene rendering time.

Multiview is not a magic solution—it will not automatically fix all rendering issues in your scene. It is an improvement that might make things a little smoother.

A "side effect" of enabling multiview is enabling antialiasing in WebXR (when using an extension version that supports it). One extension that supports it is `OCULUS_multiview`, available in the Oculus Browser.

To enable multiview:

```javascript
const featuresManager = xr.baseExperience.featuresManager; // or any other way to get a features manager
featuresManager.enableFeature(WebXRFeatureName.LAYERS, "stable" /* or latest */, {
  preferMultiviewOnInit: true,
});
```

If your browser supports multiview, it will be enabled. Otherwise, it will silently fall back to non-multiview rendering.

## Use cases for layers

### Fullscreen 2D GUI support

Using a quad layer, we are able to display an Advanced Dynamic Texture in fullscreen mode. This allows you to use the same GUI for your desktop application and still show it in XR.

Note that the GUI cannot be interacted with when in XR—it behaves like a HUD and can be used to display information.

Here is an example of a scene running in multiview and showing the current world scale as on-screen UI:

<Playground id="#JA1ND3#941" title="WebXR 2D GUI example" description="WebXR Fullscreen 2D GUI Support" image=""/>
