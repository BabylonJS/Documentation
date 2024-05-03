---
title: Camera Introduction
image:
description: Introduction to the different camera types in Babylon.js.
keywords: diving deeper, cameras, intro
further-reading:
  - title: Cameras Overview
    url: /features/featuresDeepDive/cameras
  - title: Cameras - Is what you see, what you get?
    url: https://babylonjs.medium.com/cameras-is-what-you-see-what-you-get-c2c4d6a28207
video-overview:
video-content:
---

## Cameras

Of the many cameras available in Babylon.js, the two most used are probably the [Universal Camera](/typedoc/classes/babylon.universalcamera), used for "first-person" movement, [ArcRotateCamera](/typedoc/classes/babylon.arcrotatecamera), an orbital camera, and [WebXRCamera](/typedoc/classes/babylon.webxrcamera), used for modern virtual reality experiences.

To allow user input, a camera must be attached to the canvas using:

```javascript
camera.attachControl(canvas, true);
```

The second parameter is optional and defaults to `false`, which prevents default actions on a canvas event. Set to `true` to allow canvas default actions.

### Notes

1. A [Gamepad](/features/featuresDeepDive/input/gamepads) may be used as a controller.
2. For touch control, either [PEP](https://github.com/jquery/PEP) or [hand.js](https://github.com/Deltakosh/handjs) is needed.

## Universal Camera

This was introduced with version 2.3 of Babylon.js and is controlled by the keyboard, mouse, touch, or [gamepad](/features/featuresDeepDive/input/gamepads) depending on the input device used, with no need for the controller to be specified. This extends and replaces the [Free Camera](/typedoc/classes/babylon.freecamera), the [Touch Camera](/typedoc/classes/babylon.touchcamera) and the [Gamepad Camera](/typedoc/classes/babylon.gamepadcamera), which are all still available.

The Universal Camera is now the default camera used by Babylon.js, and it’s your best choice if you’d like to have an FPS-like control in your scene. All demos on [babylonjs.com](https://www.babylonjs.com/) utilize the Universal Camera. Plug an Xbox controller into your PC and you'll be able to use it to navigate most of the demos.

The default actions are:

1. Keyboard - The left and right arrow keys move the camera left and right, and the up and down arrow keys move it forwards and backward;

2. Mouse - Rotates the camera about the axes with the camera as origin;

3. Touch - Swipe left and right to move the camera left and right, and swipe up and down to move it forward and backward;

4. [gamepad](/features/featuresDeepDive/input/gamepads) - corresponds to device.

Optional actions are:

1. MouseWheel - The scroll wheel on a mouse or scroll actions on a touchpad. <Playground id="#DWPQ9R#1" title="Adding Scroll Wheel to Universal Camera" description="A simple example of adding scroll wheel functionality to the universal camera." image="/img/playgroundsAndNMEs/divingDeeperCamerasIntro1.jpg"/>

### Note

Using keys in the Playground requires you to click inside the rendering area to give it the focus.

### Constructing a Universal Camera

```javascript
// Parameters : name, position, scene
const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);

// Targets the camera to a particular position. In this case the scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// Attach the camera to the canvas
camera.attachControl(canvas, true);
```

<Playground id="#DWPQ9R#1" title="Universal Camera Example" description="A simple example of how to construct a universal camera." image="/img/playgroundsAndNMEs/divingDeeperCamerasIntro2.jpg" isMain={true} category="Cameras"/>

## Arc Rotate Camera

This camera always points towards a given target position and can be rotated around that target with the target as the center of rotation. It can be controlled with cursors and mouse, or with touch events.

Think of this camera as one orbiting its target position, or more imaginatively as a satellite orbiting the earth. Its position relative to the target ("Earth") can be set by three parameters:

- [alpha](/typedoc/classes/babylon.arcrotatecamera#alpha) (the longitudinal rotation, in radians),
- [beta](/typedoc/classes/babylon.arcrotatecamera#beta) (the latitudinal rotation, in radians), and
- [radius](/typedoc/classes/babylon.arcrotatecamera#radius) (the distance from the target).

Here is an illustration:

![arc rotate camera](/img/how_to/camalphabeta.jpg)

Setting `beta` to 0 or PI can, for technical reasons, cause problems, so in this situation, `beta` is offset by 0.1 radians (about 0.6 degrees).

`beta` increases in a clockwise direction, while `alpha` increases counter-clockwise.

The position of the camera can also be set from a vector, which will override any current value for `alpha`, `beta` and `radius`. This can be much easier than calculating the required angles.

Whether using the keyboard, mouse, or touch swipes, left/right directions change `alpha`, and up/down directions change `beta`.

The following optional `ArcRotateCamera` properties can also be handy:

- **zoomToMouseLocation** - if set to `true` will cause mouse wheel to zoom in or out centered on
  current mouse location instead of a fixed camera.target location. This makes it easy to explore
  all corners of a large scene. Setting this means that the mouse wheel input controller will be
  changing the camera.target position during mouse wheel zooming. When this is `true` the zoom
  operation using the mouse wheel is doing both zooming and a small amount of panning at the same
  time.

- **wheelDeltaPercentage** - if set to non-zero value will cause the zooming amount to be set to a
  percentage of the camera radius. This means the zoom slows down as you get closer to the target
  object which is nice because it means you can be more precise about camera placement while you
  explore your object up close.

Here's a Playground that shows how the camera moves, including what happens when the upVector (direction that camera treats as "up") is changed:

  <Playground id="#GB1AW7#21" title="ArcRotateCamera Rotation Example" description="A demo showing how the camera moves with changes to alpha, beta, and the camera's upVector" image="/img/playgroundsAndNMEs/pg-GB1AW7-21.jpg" isMain={true} category="Cameras"/>

### Constructing an Arc Rotate Camera

```javascript
// Parameters: name, alpha, beta, radius, target position, scene
const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

// Positions the camera overwriting alpha, beta, radius
camera.setPosition(new BABYLON.Vector3(0, 0, 20));

// This attaches the camera to the canvas
camera.attachControl(canvas, true);
```

<Playground id="#SRZRWV#839" title="arcRotate Camera Example" description="A simple example of how to construct an arcRotate camera." image="/img/playgroundsAndNMEs/divingDeeperCamerasIntro2.jpg" isMain={true} category="Cameras"/>

By default, panning with an `ArcRotateCamera` is also possible by using <kbd>Ctrl</kbd> + <kbd>left mouse button</kbd>. You can use <kbd>right mouse button</kbd> instead by setting `useCtrlForPanning` to `false` in the `attachControl` call :

```javascript
camera.attachControl(canvas, noPreventDefault, useCtrlForPanning);
```

If required, you can also totally deactivate panning by setting :

```javascript
camera.panningSensibility = 0;
```

Here's a demo demonstrating some of these things, along with other features of the ArcRotateCamera:

<Playground id="#3B5W22#29" title="ArcRotateCamera Offset Demo" description="A demonstration of setting targetScreenOffset" image="/img/playgroundsAndNMEs/divingDeeperCamerasIntro6.jpg" isMain={true} category="Cameras"/>

## FollowCamera

The [FollowCamera](/typedoc/classes/babylon.followcamera) does what it says on the tin. Give it a mesh as a target, and from whatever position it is currently at it will move to a goal position from which to view the target. When the target moves, so will the Follow Camera.

The initial position of the Follow Camera is set when it is created then the goal position is set with three parameters:

1. [radius](/typedoc/classes/babylon.followcamera#radius): the distance from the target

2. [heightOffset](/typedoc/classes/babylon.followcamera#heightOffset): the height above the target;

3. [rotationOffset](/typedoc/classes/babylon.followcamera#rotationOffset): the goal angle in degrees around the target in the x y plane.

The speed with which the camera moves to a goal position is set through its acceleration ([cameraAcceleration](/typedoc/classes/babylon.followcamera#cameraacceleration)) up to a maximum speed ([maxCameraSpeed](/typedoc/classes/babylon.followcamera#maxcameraspeed)).

### Constructing a Follow Camera

```javascript
// Parameters: name, position, scene
const camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

// The goal distance of camera from target
camera.radius = 30;

// The goal height of camera above local origin (centre) of target
camera.heightOffset = 10;

// The goal rotation of camera around local origin (centre) of target in x y plane
camera.rotationOffset = 0;

// Acceleration of camera in moving from current to goal position
camera.cameraAcceleration = 0.005;

// The speed at which acceleration is halted
camera.maxCameraSpeed = 10;

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// NOTE:: SET CAMERA TARGET AFTER THE TARGET'S CREATION AND NOTE CHANGE FROM BABYLONJS V 2.5
// targetMesh created here.
camera.target = targetMesh; // version 2.4 and earlier
camera.lockedTarget = targetMesh; //version 2.5 onwards
```

<Playground id="#SRZRWV#6" title="Follow Camera Example" description="A simple example of how to construct a follow camera." image="/img/playgroundsAndNMEs/divingDeeperCamerasIntro3.jpg" isMain={true} category="Cameras"/>

## AnaglyphCameras

The [AnaglyphUniversalCamera](/typedoc/classes/babylon.anaglyphuniversalcamera) and [AnaglyphArcRotateCamera](/typedoc/classes/babylon.anaglypharcrotatecamera) extend the use of the Universal and Arc Rotate Cameras for use with red and cyan 3D glasses. They use post-processing filtering techniques.

### Constructing an Anaglyph Universal Camera

```javascript
// Parameters : name, position, eyeSpace, scene
const camera = new BABYLON.AnaglyphUniversalCamera("af_cam", new BABYLON.Vector3(0, 1, -15), 0.033, scene);
```

### Constructing an Anaglyph ArcRotateCamera

```javascript
// Parameters : name, alpha, beta, radius, target, eyeSpace, scene
const camera = new BABYLON.AnaglyphArcRotateCamera("aar_cam", -Math.PI / 2, Math.PI / 4, 20, BABYLON.Vector3.Zero(), 0.033, scene);
```

The `eyeSpace` parameter sets the amount of shift between the left-eye view and the right-eye view. Once you are wearing your 3D glasses, you might want to experiment with this float value.

You can learn all about anaglyphs by visiting a [Wikipedia page that explains it thoroughly](https://en.wikipedia.org/wiki/Anaglyph_3D).

## Device Orientation Camera

The [DeviceOrientationCamera](/typedoc/classes/babylon.deviceorientationcamera) is specifically designed to react to device orientation events such as a modern mobile device being tilted forward, back, left, or right.

### Constructing a Device Orientation Camera

```javascript
// Parameters : name, position, scene
const camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);

// Targets the camera to a particular position
camera.setTarget(new BABYLON.Vector3(0, 0, -10));

// Sets the sensitivity of the camera to movement and rotation
camera.angularSensibility = 10;
camera.moveSensibility = 10;

// Attach the camera to the canvas
camera.attachControl(canvas, true);
```

<Playground id="#SRZRWV#3" title="Device Orientation Camera Example" description="A simple example of how to construct a Device Orientation camera." image="/img/playgroundsAndNMEs/divingDeeperCamerasIntro4.jpg" isMain={true} category="Cameras"/>

## Virtual Joysticks Camera

The [VirtualJoysticksCamera](/typedoc/classes/babylon.virtualjoystickscamera) is specifically designed to react to Virtual Joystick events. Virtual Joysticks are on-screen 2D graphics that are used to control the camera or other scene items.

### Video

<Youtube id="53Piiy71lB0"/>

![Screenshot of the Virtual Joysticks Camera in action on Espilit](https://david.blob.core.windows.net/babylonjs/VJCBabylon.jpg)

### Complete sample

Here is a complete sample that loads the Espilit demo and switches the default camera to a virtual joysticks camera:

```javascript
document.addEventListener("DOMContentLoaded", startGame, false);
function startGame() {
  if (BABYLON.Engine.isSupported()) {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    BABYLON.SceneLoader.Load("Espilit/", "Espilit.babylon", engine, function (newScene) {

      const VJC = new BABYLON.VirtualJoysticksCamera("VJC", newScene.activeCamera.position, newScene);
      VJC.rotation = newScene.activeCamera.rotation;
      VJC.checkCollisions = newScene.activeCamera.checkCollisions;
      VJC.applyGravity = newScene.activeCamera.applyGravity;

      // Wait for textures and shaders to be ready
      newScene.executeWhenReady(function () {
        newScene.activeCamera = VJC;
        // Attach camera to canvas inputs
        newScene.activeCamera.attachControl(canvas);
        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
          newScene.render();
        }),
      }),
    }, function (progress) {
    // To do: give progress feedback to user.
    }),
  }
}
```

If you switch back to another camera, don’t forget to call `dispose()` first. The `VirtualJoysticks` are creating a 2D canvas on top of the 3D WebGL canvas to draw the joysticks with cyan and yellow circles. If you forget to call `dispose()`, the 2D canvas will remain and will continue to handle touch events.

## VR Device Orientation Cameras

The [VRDeviceOrientationFreeCamera](/typedoc/classes/babylon.vrdeviceorientationfreecamera), [VRDeviceOrientationArcRotateCamera](/typedoc/classes/babylon.vrdeviceorientationarcrotatecamera), and [VRDeviceOrientationGamepadCamera](/typedoc/classes/babylon.vrdeviceorientationgamepadcamera) are a newer set of cameras that extend the cameras above to handle device orientation from a VR device.

Example (requires a VR device):

<Playground id="#SRZRWV#4" title="VR Device Orientation Camera Example" description="A simple example of how to construct a VR Device Orientation camera." image="/img/playgroundsAndNMEs/divingDeeperCamerasIntro5.jpg"/>

## Constructing a VR Device Orientation Free Camera

```javascript
// Parameters: name, position, scene, compensateDistortion, vrCameraMetrics
const camera = new BABYLON.VRDeviceOrientationFreeCamera("Camera", new BABYLON.Vector3(-6.7, 1.2, -1.3), scene);
```

### Constructing a VR Device Orientation Arc Rotate Camera

```javascript
// Parameters: name, alpha, beta, radius, target, scene, compensateDistortion, vrCameraMetrics
const camera = new BABYLON.VRDeviceOrientationArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 25, new BABYLON.Vector3(0, 0, 0), scene);
```

### Constructing a VR Device Orientation Gamepad Camera

```javascript
// Parameters: name, position, scene, compensateDistortion, vrCameraMetrics
const camera = new BABYLON.VRDeviceOrientationGamepadCamera("Camera", new BABYLON.Vector3(-10, 5, 14));
```

## WebVR Free Camera

**NOTE:** WebVR is deprecated! Please use WebXR instead

[WebVRFreeCamera](/typedoc/classes/babylon.webvrfreecamera) is the legacy virtual reality camera, now intended for use with older VR device browsers that don't support the WebXR standard.

```javascript
// Parameters : name, position, scene, webVROptions
const camera = new BABYLON.WebVRFreeCamera("WVR", new BABYLON.Vector3(0, 1, -15), scene);
```

This camera deserves its own page: [Using the WebVR Camera](/features/featuresDeepDive/cameras/webVRCamera).

## FlyCamera

[FlyCamera](/typedoc/classes/babylon.flycamera) imitates free movement in 3D space, think "a ghost in space." It comes with an option to gradually correct Roll, and also an option to mimic banked-turns.

Its defaults are:

1. Keyboard - The <kbd>A</kbd> and <kbd>D</kbd> keys move the camera left and right. The <kbd>W</kbd> and <kbd>S</kbd> keys move it forward and backward. The <kbd>E</kbd> and <kbd>Q</kbd> keys move it up and down.

2. Mouse - Rotates the camera about the Pitch and Yaw (X, Y) axes with the camera as the origin. Holding the <kbd>right mouse button</kbd> rotates the camera about the Roll (Z) axis with the camera as the origin.

### Constructing a Fly Camera

```javascript
// Parameters: name, position, scene
const camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), scene);

// Airplane like rotation, with faster roll correction and banked-turns.
// Default is 100. A higher number means slower correction.
camera.rollCorrect = 10;
// Default is false.
camera.bankedTurn = true;
// Defaults to 90° in radians in how far banking will roll the camera.
camera.bankedTurnLimit = Math.PI / 2;
// How much of the Yawing (turning) will affect the Rolling (banked-turn.)
// Less than 1 will reduce the Rolling, and more than 1 will increase it.
camera.bankedTurnMultiplier = 1;

// This attaches the camera to the canvas
camera.attachControl(canvas, true);
```

## Clipping Planes and Infinite Perspective

Cameras in Babylon.js have [clipping planes](/features/featuresDeepDive/scene/clipPlanes) that specify a visual range in the scene that will be rendered. Anything outside of that range will not be rendered. For example, setting the camera's far clipping plane to 100 like this:

```javascript
camera.maxZ = 100;
```

will not render anything past 100 units from the camera. The same is true of the near clipping plane as well. For example, setting the near clipping plane to 10 like this:

```javascript
camera.minZ = 10;
```

will not render anything closer than 10 units from the camera.

In some cases, you may not want to clip the rendering of your scene. You may want your scene to effectively render out to infinity. This can be done by setting the far clipping plane to 0 like this:

```javascript
camera.maxZ = 0;
```

Just a friendly warning, setting the far clipping plane to infinity can reduce depth precision, so use this carefully!

## Customizing inputs

The cameras rely upon user inputs to move the camera. If you are happy with the camera presets Babylon.js is giving you, just stick with it.

If you want to change user inputs based upon user preferences, customize one of the existing presets, or use custom input mechanisms. Those cameras have an input manager that is designed for those advanced scenarios. Read [customizing camera inputs](/features/featuresDeepDive/cameras/customizingCameraInputs) to learn more about tweaking inputs on your cameras.

## Correcting perspective projection

If you are doing applications like architectural rendering, you may encounter the need to compensate for perspective tilting of vertical lines.
Let's consider this case : you are rendering a tall building from a human eye point of view. Naturally, vertical lines will converge towards a vanishing point, like on [this playground](https://playground.babylonjs.com/#L20FJ4#15) : ![Screenshot of the tilted vertical lines](/img/how_to/tilted-vertical.jpg).

While this is realistic, it may be visually unappealing. If the angle between those lines stays quite low, it may be interesting to consider correcting the perspective correction, using `camera.applyVerticalCorrection()`. This method will automatically compute the vertical correction to apply regarding the current camera pitch angle : ![Screenshot of the corrected vertical lines](/img/how_to/corrected-vertical.jpg).

And if you want further control other the camera projection plane tilting, you can mess with the `camera.projectionPlaneTilt` property.
See [this forum post](https://forum.babylonjs.com/t/add-vertical-shift-to-3ds-max-exporter-babylon-cameras/17480/16) for more information.
