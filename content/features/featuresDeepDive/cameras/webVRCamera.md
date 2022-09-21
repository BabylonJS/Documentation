---
title: WebVR Camera (Deprecated)
image:
description: Learn how to create a VR scene with the WebVR Camera.
keywords: diving deeper, WebVR, WebVR Camera, vr
further-reading:
video-overview:
video-content:
---

## WebVR vs WebXR

While the WebVR camera will continue to be supported, **it is strongly recommended that new projects use the [WebXR camera](/divingDeeper/webXR/webXRCamera)**. For more information, check out our [introduction to WebXR](/divingDeeper/webXR/introToWebXR).

## Introduction

Since v2.5, Babylon.js supports WebVR using the `WebVRFreeCamera` camera.

As of Babylon v3.0, we fully support the WebVR 1.1 specifications (https://w3c.github.io/webvr/), which is supported by the latest version of Microsoft Edge, Chrome, and Firefox.

The WebVR camera is Babylon's simple interface to interaction with Windows Mixed Reality, HTC Vive, Oculus Rift, Google Daydream, and Samsung GearVR.

Babylon.js also supports the VR devices' controllers - The Windows Mixed Reality controllers, HTC Vive's controllers, the Oculus Touch, GearVR controller, and Daydream controller - using the gamepad extension. Further details below.

To quickly get started creating a WebVR scene, the [WebVR Experience Helper](/divingDeeper/cameras/webVRHelper) class can be used to automatically setup the WebVR camera and enable other features such as teleportation out of the box.

## Browser support

### WebVR

WebVR 1.1 is enabled in specific versions of Microsoft Edge, Chrome, and Firefox. To get constant status updates, please visit WebVR Rocks at https://webvr.rocks/ . We support any browser that implements WebVR 1.1.

### WebVR controllers

The WebVR controllers are offered in browsers that support the WebVR gamepad extensions - https://w3c.github.io/gamepad/extensions.html .

## The WebVRFreeCamera class

### Getting started

The `WebVRFreeCamera` is initialized the same as a standard free camera:

```javascript
var camera = new BABYLON.WebVRFreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
```

This will initialize a new WebVR camera and will enable WebVR in the engine.

Just like any other camera, to get the camera working correctly with user input and interactions, we will need to attach the camera (and the VR device) to the canvas and the scene. To do that we use the same method we know from the free camera:

```javascript
camera.attachControl(canvas, true);
```

Most browsers only support attaching the VR device to the scene during user interaction (a mouse click, for example). To get that working correctly, a simple solution would be:

```javascript
scene.onPointerDown = function () {
  scene.onPointerDown = undefined;
  camera.attachControl(canvas, true);
};
```

What it does is attach control once the user clicks on the canvas, and disables the `onPointerDown` callback.

This can be done with an HTML or a Canvas2D button as well, and using vanilla JavaScript event listeners. Any intentional user interaction is allowed. A mouse-move event will not trigger it. A simple example would be:

```javascript
// after creating a button with vrButton as ID:
let button = document.getElementById("vrButton");

function attachWebVR() {
  camera.attachControl(canvas, true);
  window.removeEventListener("click", attachWebVR, false);
}

button.addEventListener("click", attachWebVR, false);
```

Don't forget to remove the event listener, otherwise any click on the button will trigger the attach function. It won't attach again, but it will result in unnecessary function calls.

You should now be able to see your scene in the WebVR device. If not, go to troubleshooting!

### Extra WebVR transformation (Pose data)

The WebVR camera is an extended `FreeCamera`. Apart from all of the abilities a standard `FreeCamera` has, the WebVR camera has 2 major extensions - an extra position and an extra rotation, which are the pose data broadcasted by the VR device connected to the browser. This means the camera has actually two transformations - one is controlled by you, and the other by the device. They are accumulated - position is being added and rotation multiplied - in order to combine the developer's input and the VR device's pose data.

To understand that think of your head and your body. Without moving your body, your head can move in all directions, and rotate in all directions. The WebVR device is your head. Your body is the regular position and `rotationQuaternion` we all know and love. If you rotate your body, the head rotates with it. But if you move the head, the body stays in the same position.

This is exactly how you should see the WebVR extra transformation - your head position is set by the VR device (and cannot be interfered with). Your body (or position in the world) is fully controlled by you.

This allows you to use the same code you use for a game based on the FreeCamera with the WebVR camera. the only difference is that the user will have the ability to rotate the camera locally using the VR device and not the mouse.

This also allows the WebVR to be controlled by the same input devices that control the FreeCamera - keyboard, mouse (with rotation exception), Xbox controller and so on.

### Resetting the device's rotation

The device's "front" position is set by the device itself (it is set during the device's setup and has not a lot to do with WebVR directly). The developer, however, has the ability to change the "front" rotation with a simple function call:

`camera.resetToCurrentRotation()`.

This will set the current Y-axis (and Y-axis direction only!!) to be the current front rotation of the user.

### Low level fun

- If you want to use the `vrDevice` directly, it is exposed using `camera._vrDevice`, a public hidden member in the camera.
- If you want to use the raw pose data (righthanded data!), it is exposed at `camera.rawPose`. The `rawPose` has the following interface (a dream for physics lovers!):

```javascript
export interface DevicePose {
    readonly position?: Float32Array;
    readonly linearVelocity?: Float32Array;
    readonly linearAcceleration?: Float32Array;

    readonly orientation?: Float32Array;
    readonly angularVelocity?: Float32Array;
    readonly angularAcceleration?: Float32Array;
}
```

Note: Raw pose values are not modified based on the `webVRCamera`'s rotation or position. To reference modified position and rotation in Babylon space, use the `devicePosition` and `deviceRotationQuaternion` fields.

```javascript
webVRCamera.devicePosition;
webVRCamera.deviceRotationQuaternion;
webVRCamera.leftController.devicePosition;
webVRCamera.leftController.deviceRotationQuaternion;
```

## The Gamepad Extensions support (WebVR controllers)

Each VR device currently available (Windows Mixed Reality, Oculus Rift, Vive, Daydream, and GearVR) has controllers that complement its usage. Windows Mixed Reality controllers, Vive controllers, Oculus Touch controllers, Daydream Controller, and GearVR Controller are supported by using the gamepad extensions.

### Init controllers

During the WebVRFreeCamera initialization, it will attempt to attach the controllers and detect them if found. If found, the controllers will be located at `camera.controllers` which is an array that will either have a length of 2 or 0 (GearVR and Daydream support only 1 controller). If the controllers are attached and were not detected, you could also try to manually call `camera.initControllers()` at a future time.

To fire a callback when the controllers are found you can use the optional `camera.onControllersAttached` callback:

```javascript
onControllersAttached = function (controllers) {
  console.log(controllers.length === 2); // outputs true;
};
```

Initializing the controllers using the camera will also attach them to the camera. This will allow moving the controllers with the WebVR camera as the user moves them.

### Using the controllers

There are a few high-level implementations that are automatically assigned to a WebVR controller:

`WindowsMotionController` for the Windows Mixed Reality controllers.

`OculusTouchController` for the Oculus Touch.

`ViveController` for the Vive controllers.

`GearVRController` for the Samsung Gear VR controller.

`DaydreamController` for the Google Daydream controller.

each extends the `WebVRController` class, which extends the `PoseEnabledController`.

To make a long story short, each controller has the same set of functions, the only difference being the button mappings. The device type can be retrieved using `controller.controllerType`, which has the following values:

```typescript
enum PoseEnabledControllerType {
  VIVE,
  OCULUS,
  WINDOWS,
  GEAR_VR,
  DAYDREAM,
  GENERIC,
}
```

This enum will be extended as needed.

### Controller button mapping

A controller button has the following set of data:

```typescript
interface ExtendedGamepadButton extends GamepadButton {
  readonly pressed: boolean;
  readonly touched: boolean;
  readonly value: number;
}
```

These values will be sent to the observers of any specific button when either one of them was changed.

The controllers also have Axes-data, which can be compared to the stick value of an Xbox controller. They consist of a 2D vector (with x and y values). Stick values (SHOULD BE) are between -1, -1 and 1, 1, with 0,0 being the default value.

- Not all buttons of each controller support all 3 values, but all 3 will always be provided. For example, the Vive's trigger doesn't support "touched", which will always be false, but will send the value data when pressed (a percentage of the press from 0 to 1).
- Having a value does not automatically mean that "pressed" is set to true. The oculus controllers, for example, will only set the trigger's "pressed" to true when the value exceeds 0.15 (15% pressed).
- The controllers have a "hand" assigned to them, which is a string, either "left" or "right". This can be found at controller.hand .

#### Abstract mapping

The following observables exist on all types of WebVR controllers, in case you wish to develop an abstract solution to all VR devices and not focus on a specific device:

1. `onTriggerStateChangedObservable` is the main trigger observable
2. `onMainButtonStateChangedObservable` the main button observable
3. `onSecondaryButtonStateChangedObservable` - you get the point...
4. `onPadStateChangedObservable` - stick-button observable (NOT the Stick Values)
5. `onPadValuesChangedObservable` - stick values changed observable

To use any of them, simple register a new function with the desired observable.
For example, to monitor the trigger and observe pad value changes:

```javascript
controller.onPadValuesChangedObservable.add(function (stateObject) {
  console.log(stateObject); // {x: 0.1, y: -0.3}
});
controller.onTriggerStateChangedObservable.add(function (stateObject) {
  let value = stateObject.value;
  console.log(value);
});
```

#### Windows Mixed Reality Controller mapping

The Windows Mixed Reality controller supports:

1. Thumbstick axis - axis values. Mapped to `onPadValuesChangedObservable`.
2. Thumbstick press - pressed. Mapped to `onPadStateChangedObservable`.
3. Touchpad axis - axis values. Mapped to `onTouchpadValuesChangedObservable` and `onTrackpadValuesChangedObservable` (aliases).
4. Touchpad press - pressed and touch. Mapped to `onTouchpadButtonStateChangedObservable` and `onTrackpadChangedObservable` (aliases).
5. Trigger - pressed and value. Mapped to `onTriggerStateChangedObservable`
6. Grip button - pressed. Mapped to `onMainButtonStateChangedObservable` and `onGripButtonStateChangedObservable` (aliases)
7. Menu button - pressed. Mapped to `onSecondaryButtonStateChangedObservable` and `onMenuButtonStateChangedObservable` (aliases).

#### Vive Controller mapping

The Vive supports:

1. Touchpad - pressed, touch and axis values. Mapped to `onPadStateChangedObservable`
2. Trigger - pressed and value. Mapped to `onTriggerStateChangedObservable`
3. Left AND right buttons together (!) - touched, pressed. Mapped to `onMainButtonStateChangedObservable`, `onRightButtonStateChangedObservable` and `onLeftButtonStateChangedObservable` (aliases to the same observable object!);
4. Menu button - touched, pressed. Mapped to `onSecondaryButtonStateChangedObservable` and `onMenuButtonStateChangedObservable` (aliases).

#### Oculus Touch mapping

The Oculus Touch supports 6 buttons:

1. Thumbstick - touch, press, value = pressed (0,1). Mapped to `onPadStateChangedObservable`.
2. Index trigger - touch (?), press (only when value > 0.1). Mapped to `onTriggerStateChangedObservable`.
3. Secondary trigger (same). Mapped to `onSecondaryTriggerStateChangedObservable`.
4. A (right) X (left) - touch, pressed = value. Mapped to `onMainButtonStateChangedObservable`, `onAButtonStateChangedObservable` on the right hand and `onXButtonStateChangedObservable` on the left hand.
5. B / Y - touch, pressed = value. Mapped to `onSecondaryButtonStateChangedObservable`, `onBButtonStateChangedObservable` on the right hand and `onYButtonStateChangedObservable` on the left hand.
6. thumb rest. Mapped to `onThumbRestChangedObservable` .

#### Gear VR Controller mapping

The Gear VR controller supports:

1. Trackpad - pressed, touch, and axis values. Mapped to `onPadValuesChangedObservable` and `onTrackpadChangedObservable`
2. Trigger - pressed and values. Mapped to `onTriggerStateChangedObservable`

#### Google Daydream Controller mapping\*

The Google Daydream controller supports:

1. Touchpad - pressed, touch and axis values. Mapped to `onPadValuesChangedObservable` and `onTriggerStateChangedObservable`

note: The Daydream controller home and app buttons are not mapped in WebVR.

### Attaching to a mesh

Instead of forcing you to use the controller meshes (which will prevent you from implementing a single app for many types of devices), we have decided to allow you to attach the controller to a mesh. This will make the controller the mesh's "parent" (but not using the parenting system! As a controller is not a node). The controller's actions (rotation and position changes) will reflect directly to the mesh.

To attach the controller to a mesh:

```javascript
controller.attachToMesh(mesh);
```

Note that this will create a new quaternion to the mesh .

The default controller mesh can be hidden with the following code.

```javascript
scene.createDefaultVRExperience({ controllerMeshes: true });
```

### Low level

### Controllers without WebVR camera

The controllers can also be initialized without using a WebVR camera, which means - you can use them to control your regular WebGL game or 3D application.

To do that, simply initialize the Gamepads Class:

```javascript
new BABYLON.Gamepads((gp) => {
  if (gp.type === BABYLON.Gamepad.POSE_ENABLED) {
    // Do something with the controller!
  }
});
```

Note that the position will be relative to the initial VR Device that is related to those controllers.

### Pose data

Just like the WebVR camera, the controllers export their (right-handed!) raw pose data. The data is updated each frame at `controller.rawPose`.

## Notes

- The WebVR camera supports both left-handed systems and right-handed systems.
- To further read about WebVR try https://mozvr.com/ .

## Examples

<Playground id="G46RP6#2" title="VR Helmet Example" description="A simple example of how to leverage the WebVRFreeCamera."/>
<Playground id="#5MV04" title="Basic VR Scene" description="A simple example of a basic VR scene."/>

Enjoy!

## Troubleshooting

- My WebVR camera is not working!!

  Seems like a very common problem - a WebVRFreeCamera class is initialized, but you can't see a thing in the device.

  1. Check the console - Are you seeing any errors? COuld it be that WebVR is not supported on your browser?
  2. In your console, type `navigator.getVRDevices().then((vrs) => {console.log(vrs.length)})`. If you got 0 or an error, the device is not properly connected.
  3. If you are using Oculus Rift, did you enable "unknown sources" in the Oculus Rift settings?
  4. Try following the instructions in https://mozvr.com/ . Does the camera work there?

- The camera's rotation is changing, but I can't see anything in my display

  This error occurs when you didn't attach a control to the VR device.

  1. Make sure that `attachControl` is called inside a user-interaction callback. Chrome will not allow broadcasting to the VR device without user consent.

- My (Vive) controllers are not detected!! HELP!!!!

  Ah, I know this problem.

  1. Try pressing the left and right buttons of the Vive controller, or the pad button of the Oculus Touch. This should turn them on and make them visible.
  2. Make sure you called `camera.initControllers()` !
  3. open your console, search for errors.
  4. type `navigator.getGamepads()` in your console. Is the list empty? are there controllers in the list? what controllers?
  5. make sure the gamepad extensions is enabled in your browser! Check https://mozvr.com/ for installation instructions.

- Gear VR or Daydream controller models are not showing

  These are 3 DoF devices (no position). The model's positions aren't yet determined, but you have the rays from controller orientation and functional trigger buttons.
