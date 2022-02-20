---
title: WebXR Session Manager
image: 
description: Learn all about the WebXR session manager in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR
further-reading:
video-overview:
video-content:
---

Babylon's [WebXRSessionManager](/typedoc/classes/babylon.webxrsessionmanager) class is your direct contact to the browser's native XR session. Each XR experience has a corresponding session that holds the entire XR functionality. A session is initialized with a session mode (the default is `vr-immersive` ) and a reference space mode (default is `local-floor` ) that decides how the scene calculates the user's location and what functionality is available.

Usually, the Session Manager will be initialized by the [experience helper](/features/divingDeeper/webXR/webXRExperienceHelpers), but if you don't use the experience helper, you can create a session manger yourself. The session manager, along with the XR camera, are the only requirement on babylon's side to implement an XR experience.

## Basic usage and initialization

To construct a new session manager, initialize it with a babylon scene:

``` javascript
const sessionManager = new WebXRSessionManager(scene);
```

The session manager is now ready and can be initialized to be used with XR.

Before activating the session, you can check if XR is available and the session mode is supported by the browser.

You can do this using the static function `IsSessionSupportedAsync` or the `isSessionSupportedAsync` function of the session manager itself:

``` javascript
// Static:
const supported = await WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
if (supported) {
    // xr available, session supported
}

// or:

const supported = await sessionManager.isSessionSupportedAsync('immersive-vr');
if (supported) {
    // xr available, session supported
}
```

After making sure XR is available and the session is supported, you can initialize the session and prepare it for rendering:

``` javascript
sessionManager.initializeSessionAsync('immersive-vr' /*, xrSessionInit */ );
```

This function will initialize the native session. Without calling this function, no session is available and the XR experience will not work.

Right after you will need to initialize the reference space of this session, which will define the coordinate system the xr experience will use:

``` javascript
const referenceSpace = sessionManager.setReferenceSpaceAsync( /*referenceSpaceType = 'local-floor'*/ );
```

The only thing that is left right now is to prepare the render target and the [XR WebGL Layer](https://developer.mozilla.org/en-US/docs/Web/API/XRWebGLLayer):

``` javascript
const renderTarget = sessionManager.getWebXRRenderTarget( /*outputCanvasOptions: WebXRManagedOutputCanvasOptions*/ );
const xrWebGLLayer = renderTarget.initializeXRLayerAsync(this.sessionManager.session);
```

The session manager is now ready to render the scene using the XR session.

## Start rendering

To start rendering the scene use the `runXRRenderLoop` :

``` javascript
sessionManager.runXRRenderLoop();
```

The scene will now render to the XR Device instead of the browser canvas.

To stop rendering, end the session:

``` javascript
await sessionManager.exitXRAsync();
```

## Reference Space management

### Managing yourself

WebXR coordinate system is based on a reference space object, that defines the user's current transformation in the scene. This object calculates the current HUD and controllers transformation, and is also required for all AR features.

Babylon manages the reference space changes for you when you use the teleportation so you don't have to deal with it yourself. If, however, you wish to access and change the reference space on your own, you have full access to three reference space objects that will help you:

1. `xrSession.referenceSpace` is the current reference space, the one being used to render the scene.
2. `xrSession.baseReferenceSpace` is the initial reference space generated using the `ReferenceSpaceMode` you chose (like `local-floor` ).
3. `xrSession.viewerReferenceSpace` is the initial reference space in the `viewer` reference space mode, compensated with the `defaultHeightCompensation` value.

Using the `getOffsetReferenceSpace` function on the Reference Space object you can change the reference space yourself. Don't forget to update the new reference space in the session manager, otherwise it will not be used in the current scene:

``` javascript
// move the player 2 units (meters) up:

// height change - move the reference space negative 2 units (up two units):
const heightChange = new XRRigidTransform({
    x: 0,
    y: -2,
    z: 0
});
// get a new reference space object using the current reference space
const newReferenceSpace = xrSession.referenceSpace.getOffsetReferenceSpace(heightChange);
// update the session manager to start using the new space:
xrSession.referenceSpace = newReferenceSpace;
```

Read more about [`getOffsetReferenceSpace`](https://www.w3.org/TR/webxr/#dom-xrreferencespace-getoffsetreferencespace).

### Using a new reference space mode

To get a reference space object using a different `XRReferenceSpaceType` , use the `xrSession.setReferenceSpaceTypeAsync` with the requested reference space type. This will reset the viewer and base reference space as well. This function accepts a new reference mode and is promise based:

``` javascript
// Session was created using the `local` reference space mode, let's move to `local-floor` :
const newReferenceSpace = await xrSession.setReferenceSpaceTypeAsync('local-floor');

// The session will take care of updating all reference space objects (base, viewer, and the current one).
```

## Observables available

### onXRFrameObservable

Observers registered here will be triggered on each XR frame rendered. Can be compared to the `beforeRender` of the scene, but executed only when the scene is rendered in XR.

### onXRSessionInit

Will be triggered when the session was initialized, before a frame was rendered and before any transformation was applied.
In XR terms, this is called right after `requestSession` was called and returned with a successful result (a new XRSession).

### onXRSessionEnded

Will be triggered after the XRSession has ended and Babylon finished with clean-ups. It is triggered one frame before the regular scene render function is triggered.

### onXRReferenceSpaceChanged

 Will be triggered every time a new reference space was applied to the current scene. This is a good way of finding our if the user transported to a new location.

## Further functionalities

### Manually start rendering the XR session

When creating the experience yourself and not using the [WebXR Experience helper](/features/divingDeeper/webXR/webXRExperienceHelpers) you will need to tell the session manager to start rendering. To do that, call the `runXRRenderLoop` function.

The `runXRRenderLoop` will update the render function with the required XR rendering mechanism and run the engine's render loop.

Note that the FPS rate will probably change, as most if not all XR devices render in more than 60 FPS.
