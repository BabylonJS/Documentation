---
title: WebXR Session Manager
image:
description: Learn all about the WebXR session manager in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR
further-reading:
video-overview:
video-content:
---

Babylon's [WebXRSessionManager](/typedoc/classes/babylon.webxrsessionmanager) class is your direct link to the browser's native XR session. Each XR experience has a corresponding session that contains all XR functionality. A session is initialized with a session mode (the default is `vr-immersive`) and a reference space mode (default is `local-floor`) that decide how the scene calculates the user's location and what functionality is available.

Usually, the Session Manager will be initialized by the [experience helper](/features/featuresDeepDive/webXR/webXRExperienceHelpers), but if you don't use the experience helper, you can create a session manager yourself. The session manager, along with the XR camera, is the only requirement on Babylon's side for implementing an XR experience.

## Basic usage and initialization

To construct a new session manager, initialize it with a Babylon scene:

```javascript
const sessionManager = new WebXRSessionManager(scene);
```

The session manager is now ready and can be initialized for use with XR.

Before activating the session, you can check if XR is available and the session mode is supported by the browser.

You can do this using the static function `IsSessionSupportedAsync` or the `isSessionSupportedAsync` function of the session manager itself:

```javascript
// Static:
const supported = await WebXRSessionManager.IsSessionSupportedAsync("immersive-vr");
if (supported) {
  // xr available, session supported
}

// or:

const supported = await sessionManager.isSessionSupportedAsync("immersive-vr");
if (supported) {
  // xr available, session supported
}
```

After making sure that XR is available and that the session is supported, you can initialize the session and prepare it for rendering:

```javascript
sessionManager.initializeSessionAsync("immersive-vr" /*, xrSessionInit */);
```

This function will initialize the native session. Without calling this function, no session is available and the XR experience will not work.

### WebGPU-XR capability checks

WebGPU-XR applications should distinguish three independent checks:

```javascript
const webGPUSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
const immersiveXRSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync("immersive-vr");
// Includes XRGPUBinding projection APIs and XRGPUSubImage.getViewDescriptor.
const webGPUXRSupported = BABYLON.WebXRSessionManager.IsWebGPUXRSupported;
```

`IsWebGPUXRSupported` is an experimental static boolean getter. It checks whether the runtime exposes the `XRGPUBinding` projection-layer API, the `XRGPUSubImage` interface, and `XRGPUSubImage.prototype.getViewDescriptor` used by Babylon. It is advisory: session negotiation can still fail for the active device, permissions, or adapter.

A WebGPU engine used here must be created with `{ xrCompatible: true }`, and the WebXR Layers feature must be enabled before session entry. When a WebGPU session request rejects with `NotSupportedError`, Babylon rejects with guidance to choose WebGL before creating the scene. See [WebGPU in WebXR](/features/featuresDeepDive/webXR/webGPUXR).

Right after that, you will need to initialize the reference space of this session, which will define the coordinate system that the XR experience will use:

```javascript
const referenceSpace = sessionManager.setReferenceSpaceTypeAsync(/*referenceSpaceType = 'local-floor'*/);
```

The only thing left now is to prepare the render target and layer. WebGL engines use an [XR WebGL Layer](https://developer.mozilla.org/en-US/docs/Web/API/XRWebGLLayer), while WebGPU engines require the WebXR Layers feature and an `XRProjectionLayer`:

```javascript
const renderTarget = sessionManager.getWebXRRenderTarget(/*outputCanvasOptions: WebXRManagedOutputCanvasOptions*/);
const xrWebGLLayer = renderTarget.initializeXRLayerAsync(this.sessionManager.session);
```

The session manager is now ready to render the scene using the XR session.

## Start rendering

To start rendering the scene, use `runXRRenderLoop`:

```javascript
sessionManager.runXRRenderLoop();
```

The scene will now render to the XR Device instead of the browser canvas.

To stop rendering, end the session:

```javascript
await sessionManager.exitXRAsync();
```

## Reference Space management

### Managing yourself

The WebXR coordinate system is based on a reference space object that defines the user's current transformation in the scene. This object calculates the current HUD and controller transforms and is also required for all AR features.

Babylon manages reference space changes for you when you use teleportation, so you don't have to deal with them yourself. If, however, you want to access and change the reference space on your own, you have full access to three reference space objects that will help you:

1. `xrSession.referenceSpace` is the current reference space, the one being used to render the scene.
2. `xrSession.baseReferenceSpace` is the initial reference space generated using the `ReferenceSpaceMode` you chose (like `local-floor`).
3. `xrSession.viewerReferenceSpace` is the initial reference space in the `viewer` reference space mode, compensated with the `defaultHeightCompensation` value.

Using the `getOffsetReferenceSpace` function on the Reference Space object, you can change the reference space yourself. Don't forget to update the session manager with the new reference space; otherwise, it will not be used in the current scene:

```javascript
// move the player 2 units (meters) up:

// height change - move the reference space negative 2 units (up two units):
const heightChange = new XRRigidTransform({
  x: 0,
  y: -2,
  z: 0,
});
// get a new reference space object using the current reference space
const newReferenceSpace = xrSession.referenceSpace.getOffsetReferenceSpace(heightChange);
// update the session manager to start using the new space:
xrSession.referenceSpace = newReferenceSpace;
```

Read more about [`getOffsetReferenceSpace`](https://www.w3.org/TR/webxr/#dom-xrreferencespace-getoffsetreferencespace).

### Using a new reference space mode

To get a reference space object using a different `XRReferenceSpaceType`, use `xrSession.setReferenceSpaceTypeAsync` with the requested reference space type. This will reset the viewer and base reference space as well. This function accepts a new reference mode and is promise-based:

```javascript
// Session was created using the `local` reference space mode, let's move to `local-floor` :
const newReferenceSpace = await xrSession.setReferenceSpaceTypeAsync("local-floor");

// The session will take care of updating all reference space objects (base, viewer, and the current one).
```

## Observables available

### onXRFrameObservable

Observers registered here will be triggered on each rendered XR frame. It can be compared to the scene's `beforeRender`, but it is executed only when the scene is rendered in XR.

### onXRSessionInit

Will be triggered when the session is initialized, before a frame is rendered and before any transformation is applied.
In XR terms, this is called right after `requestSession` was called and returned with a successful result (a new XRSession).

### onXRSessionEnded

Will be triggered after the XRSession has ended and Babylon has finished cleaning up. It is triggered one frame before the regular scene render function is triggered.

### onXRReferenceSpaceChanged

Will be triggered every time a new reference space is applied to the current scene. This is a good way to find out whether the user teleported to a new location.

## Further functionalities

### Manually start rendering the XR session

When creating the experience yourself and not using the [WebXR Experience helper](/features/featuresDeepDive/webXR/webXRExperienceHelpers), you will need to tell the session manager to start rendering. To do that, call the `runXRRenderLoop` function.

The `runXRRenderLoop` will update the render function with the required XR rendering mechanism and run the engine's render loop.

Note that the FPS rate will probably change, as most if not all XR devices render in more than 60 FPS.

### World scale

If your scene is not set in meters, or you want to change the player's size in your scene, you can use the world scaling factor in the session manager.

To do that, change `worldScaleFactor`:

```javascript
xeSessionManager.worldScalingFactor = 2;
```

This will make the world two times bigger than it is.

So, if, for example, your scene is in feet instead of meters, you can set the world scale to:

```javascript
xeSessionManager.worldScalingFactor = 3.2808;
```

The value can be changed on each frame, meaning you can also animate it. If you want to know when the world scale has changed you can use the observable:

```javascript
xrSessionManager.onWorldScaleFactorChangedObservable.add((payload) => {
  // old value:
  payload.previousScaleFactor;
  // new value
  payload.newScalefactor;
});
```
