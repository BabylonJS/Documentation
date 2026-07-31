---
title: The WebXR Camera
image: 
description: Learn all about the WebXR camera in Babylon.js, used for VR and AR sessions.
keywords: VR, diving deeper, WebXR, AR, camera, WebVR
further-reading:
video-overview:
video-content:
---

The WebXR Camera is an extension of the `FreeCamera` that includes an update loop from an XRFrame and the ability to create one or more rig cameras that will be used to render the XR (both VR and AR) session.

If you are not using the [XR Experience helper](/features/featuresDeepDive/webXR/webXRExperienceHelpers), you will need an [XR Session Manager](/features/featuresDeepDive/webXR/webXRSessionManagers) to construct a new WebXR Camera:

``` javascript
const xrCamera = new WebXRCamera("nameOfCamera", scene, xrSessionManager);
```

Notice that, unlike free and target cameras, the constructor does not accept an initial position. There are a few reasons for this, the main one being that the first frame will populate the camera's position with real-world information, which cannot be queried when creating the camera. In the next sections, you will see how to get an initial position from a non-XR camera and how to control the user's position correctly.

## How positioning works

Just like any Babylon camera, the WebXR camera is an object with its own position and rotation that can be updated between frames. The WebXR camera's transformation is the current position of the device rendering the XR session (such as the HUD or the phone rendering the session) relative to the reference space currently used in the [Session Manager](/features/featuresDeepDive/webXR/webXRSessionManagers).

The camera's position will update every frame from the information sent to it by the XRFrame. The XRFrame contains a general position of the device, and, if available, the poses for each screen (or eye) that are used to update the position of the rig cameras (which are the ones actually rendering the scene).

Just like any other camera you can get its direction:

``` javascript
const direction = xrCamera.getDirection(Axis.Z);
```

Or a position in front of the camera at a certain distance:

``` javascript
// get the position 2 meters in front of the camera
const frontPosition = xrCamera.getFrontPosition(2);
```

If the camera's position changes between frames (manually by you, or by the [WebXR teleportation feature](/typedoc/classes/babylon.webxrmotioncontrollerteleportation)), a new reference space is calculated to compensate for the position change. This reference space will then be used to update the camera's position.

The camera's rig system is responsible for rendering. The rig cameras' poses are always calculated based on the poses coming from the XRFrame and **NOT** the WebXR Camera's pose. The main camera's pose is only a reference for the base transformation and does not directly influence the rendered cameras.

## Current user's height

The WebXR camera can provide you with the height of the current user, unrelated to the ground. This is an important piece of information when ground level is not at 0. When ground level is 0, the user height and the camera's `position.y` will be the same.

To query the user's height from the real ground use the `realWorldHeight` of the camera:

```javascript
const userHeight = xrCamera.realWorldHeight;
```

This getter will return the height of the user or 0 if it's not available.

Note that user height depends on the type of reference space you chose for your experience. A `local-floor` reference space will deliver the user's height, but `viewer` (for example) will deliver the height compensation you defined in the [XR Session Manager](/features/featuresDeepDive/webXR/webXRSessionManagers).

## Updating from a Non-VR Camera

When entering XR, you might want to duplicate the non-XR camera's position and use it as the base position of the XR Camera. To do that, you will need to find the absolute transformation of the old camera and apply it to the new one. Babylon allows you to do that with a single function on the XR Camera:

``` javascript
// if scene.activeCamera is still the non-VR camera:
xrCamera.setTransformationFromNonVRCamera();

// Otherwise, provide the non-vr camera to copy the transformation from:

xrCamera.setTransformationFromNonVRCamera(otherCamera);

// If you want XR to also reset the XR Reference space, set the 2nd variable to true:

xrCamera.setTransformationFromNonVRCamera(otherCamera, true);
```

When executing this function, the XR camera will copy the position of the old camera and its rotation around the Y axis. The rest will be provided by the XRFrame. It is important to know that the height provided by the XRFrame (relative to the reference space) will be added to the position as compensation for the position reset. This means that the XR camera's Y position may not be exactly equal to the other camera's Y position.
