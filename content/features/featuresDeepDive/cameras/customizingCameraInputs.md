---
title: Customizing Camera Inputs
image:
description: Learn how to customize input controls for Babylon.js cameras.
keywords: diving deeper, cameras, input, camera input
further-reading:
  - title: Looking at Custom Camera Inputs
    url: https://babylonjs.medium.com/looking-at-custom-camera-inputs-becb492f09fc
video-overview:
video-content:
---

## How to Customize Camera Inputs

Every Babylon.js camera will automatically handle inputs for you, once you call the camera's [attachControl](/typedoc/classes/babylon.freecamera#attachcontrol) method. You can revoke the control by using the [detachControl](/typedoc/classes/babylon.freecamera#detachcontrol) method. Most Babylon.js experts use a two-step process to activate and attach a camera:

```javascript
//First, set the scene's activeCamera... to be YOUR camera.
scene.activeCamera = myCamera;
// Then attach the activeCamera to the canvas.
//Parameters: canvas, noPreventDefault
scene.activeCamera.attachControl(canvas, true);
```

A simpler version might look like this:

```javascript
myCamera.attachControl(canvas);
```

By default `noPreventDefault` is set to `false`, meaning that `preventDefault()` is automatically called on all canvas mouse clicks and touch events.

Babylon.js v2.4 introduced a different way to manage camera inputs to provide an approach oriented toward composability of inputs. You can now use an input manager and each input can be seen as a plugin that is specific to this camera family and to a given input type (mouse, keyboard, gamepad, device orientation, etc.).

Using input managers, you can add, remove, enable, or disable any input available for the camera. You can also easily implement custom input mechanisms or override the existing ones.

The input manager is available through the camera's [inputs](/typedoc/classes/babylon.freecamera#inputs) property. For example:

```javascript
var camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene);
var inputManager = camera.inputs;
```

## Configure your inputs

Most inputs provide settings to customize the sensibility and adapt it to your own scene.

Each input provides a short name available on the manager. The goal is to provide a friendly syntax when playing with your inputs.

```javascript
var camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene);
camera.inputs.add(new BABYLON.FreeCameraGamepadInput());
camera.inputs.attached.gamepad.gamepadAngularSensibility = 250;
```

## Adding an existing input

The input managers of `ArcRotateCamera` and `FreeCamera` expose short-hand functions for adding built-in inputs.

```javascript
var camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene);
camera.inputs.addGamepad();
```

If you wish, you can also add an instance of your own input (we will cover how to implement your own input at the end of this article).

```javascript
var camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene);
camera.inputs.add(new BABYLON.FreeCameraGamepadInput());
```

## Enable or disable inputs

When you call `attachControl` on the camera, you are activating all inputs attached to the input manager. In the same way, you could turn off all inputs by calling `detachControl` on the camera.

If you want to disable an input temporarily, you can call `detachControl` directly on the input... like this:

```javascript
var camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene);
camera.inputs.attached.mouse.detachControl();
camera.inputs.addGamepad();
```

You can then call `attachInput` when you want to turn it on again.

```javascript
camera.inputs.attachInput(camera.inputs.attached.mouse);
```

## Removing inputs

Sometimes you want a very specific input mechanism. The best approach in such cases is probably to clear all inputs and add only those you may want in your scene.

```javascript
var camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene);
camera.inputs.clear();
camera.inputs.addMouse();
```

You can also remove a single input from your input manager. You can remove them by instance, or by Type name

```javascript
var camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene);
// remove by instance
camera.inputs.remove(camera.inputs.attached.mouse);
// remove by type
camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
```

## Implementing Your Own Input

Your input method is created as a function object. You must then write code for several methods, with required names, that are called by the input function object. The method names and purpose are:

```javascript
// This function must return the class name of the camera, it could be used for serializing your scene
getClassName();

// This function must return the simple name that will be injected in the input manager as short hand
// for example "mouse" will turn into camera.inputs.attached.mouse
getSimpleName();

//T his function must activate your input event.  Even if your input does not need a DOM element
// element and noPreventDefault must be present and used as parameter names.
// Return void.
attachControl(element, noPreventDefault);

// Detach control must deactivate your input and release all pointers, closures or event listeners
// element must be present as a parameter name.
// Return void.
detachControl(element);

// This optional function will get called for each rendered frame, if you want to synchronize your
// input to rendering, no need to use requestAnimationFrame. It's a good place for applying
// calculations if you have to.
// Return void.
checkInputs();
```

## HammerJS Input

If the builtin touch controls for the ArcRotateCamera are not enough for you, you can implement your own camera input using the well-known touch gestures library HammerJS. https://hammerjs.github.io/

We have an example of how to use HammerJS to simulate something similar to Google Earth controls. We use BabylonJS's ArcRotateCamera for this purpose. The camera is locked on the Y axis and horizontal pan moves the camera along the X axis and the vertical pan moves it along the Z axis. The `alpha` angle of the camera is taken into account when panning. By pinching you can change the `radius` of the camera so you can zoom in and out. You can change the `alpha` angle of the camera by a two finger rotate gesture so basically you can rotate around the cameras target.

Example app:
https://demos.babylonjs.xyz/hammerjs-example/#/

GitHub repo:
https://github.com/RolandCsibrei/babylonjs-hammerjs-arc-rotate-camera

The example contains `utils\ArcRotateCameraHammerJsInput.ts` which implements `ICameraInput<ArcRotateCamera>`. There are multiple parameters for the input and are pretty self explanatory. Please refer to the source code of the input and set the sensitivity and treshold values which fits your needs. First you need to install HammerJS, please refer to https://hammerjs.github.io/getting-started/ and import it

```javascript
import "hammerjs";
```

To use the new input you add it to your `camera.inputs` after you have create the camera. To avoid one input fighting the other remove the `ArcRotateCameraPointersInput` from `camera.inputs`. After you've created your Input you can set it's parameters. The default ones (please refer to https://github.com/RolandCsibrei/babylonjs-hammerjs-arc-rotate-camera/blob/680cf12155924a818faac5ff9d7f0a0271bb632b/src/utils/ArcRotateCameraHammerJsInput.ts#L21) are good for a general touch screen monitor so you may have to set them according to your needs.

```javascript
// remove mouse input
camera.inputs.removeByType("ArcRotateCameraPointersInput");

// add hammer js input
const hammerJsInput = new ArcRotateCameraHammerJsInput();
// now you can set the parameters you like
// let's double the zoomSensitivity (default is 1)
hammerJsInput.zoomSensitivity = 2;
// add the input to the camera
camera.inputs.add(hammerJsInput);
```

Feel free to use this Input class as a starter for your own HammerJS based input.

## With Javascript

This changes the normal key mappings for moving the camera left, right, forward, and back, and rotating at its current position.

First, remove the default keyboard input.

```javascript
camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
```

Now create the new input method `FreeCameraKeyboardRotateInput`:

```javascript
var FreeCameraKeyboardRotateInput = function () {
  this._keys = [];
  this.keysLeft = [37];
  this.keysRight = [39];
  this.sensibility = 0.01;
};
```

Add get name methods:

```javascript
FreeCameraKeyboardRotateInput.prototype.getClassName = function () {
  return "FreeCameraKeyboardRotateInput";
};
FreeCameraKeyboardRotateInput.prototype.getSimpleName = function () {
  return "keyboardRotate";
};
```

and attach and detach methods:

```javascript
FreeCameraKeyboardRotateInput.prototype.attachControl = function (noPreventDefault) {
  var _this = this;
  var engine = this.camera.getEngine();
  var element = engine.getInputElement();
  if (!this._onKeyDown) {
    element.tabIndex = 1;
    this._onKeyDown = function (evt) {
      if (_this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1) {
        var index = _this._keys.indexOf(evt.keyCode);
        if (index === -1) {
          _this._keys.push(evt.keyCode);
        }
        if (!noPreventDefault) {
          evt.preventDefault();
        }
      }
    };
    this._onKeyUp = function (evt) {
      if (_this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1) {
        var index = _this._keys.indexOf(evt.keyCode);
        if (index >= 0) {
          _this._keys.splice(index, 1);
        }
        if (!noPreventDefault) {
          evt.preventDefault();
        }
      }
    };

    element.addEventListener("keydown", this._onKeyDown, false);
    element.addEventListener("keyup", this._onKeyUp, false);
    BABYLON.Tools.RegisterTopRootEvents(canvas, [{ name: "blur", handler: this._onLostFocus }]);
  }
};

FreeCameraKeyboardRotateInput.prototype.detachControl = function () {
  var engine = this.camera.getEngine();
  var element = engine.getInputElement();
  if (this._onKeyDown) {
    element.removeEventListener("keydown", this._onKeyDown);
    element.removeEventListener("keyup", this._onKeyUp);
    BABYLON.Tools.UnregisterTopRootEvents(canvas, [{ name: "blur", handler: this._onLostFocus }]);
    this._keys = [];
    this._onKeyDown = null;
    this._onKeyUp = null;
  }
};
```

Optionally, add checking inputs:

```javascript
FreeCameraKeyboardRotateInput.prototype.checkInputs = function () {
  if (this._onKeyDown) {
    var camera = this.camera;
    // Keyboard
    for (var index = 0; index < this._keys.length; index++) {
      var keyCode = this._keys[index];
      if (this.keysLeft.indexOf(keyCode) !== -1) {
        camera.cameraRotation.y += this.sensibility;
      } else if (this.keysRight.indexOf(keyCode) !== -1) {
        camera.cameraRotation.y -= this.sensibility;
      }
    }
  }
};
```

Finally, add this new input method to the camera inputs:

```javascript
camera.inputs.add(new FreeCameraKeyboardRotateInput());
```

<Playground id="#KHQBRL" title="Rotate Free Camera Example" description="A simple example of customizing inputs to create a Rotate Free Camera."/>

### With Typescript

Using TypeScript, you could implement the interface `ICameraInput`:

```typescript
interface ICameraInput<TCamera extends BABYLON.Camera> {
  // the input manager will fill the parent camera
  camera: TCamera;

  //this function must return the class name of the camera, it could be used for serializing your scene
  getClassName(): string;

  //this function must return the simple name that will be injected in the input manager as short hand
  //for example "mouse" will turn into camera.inputs.attached.mouse
  getSimpleName(): string;

  //this function must activate your input, event if your input does not need a DOM element
  attachControl: (element: HTMLElement, noPreventDefault?: boolean) => void;

  //detach control must deactivate your input and release all pointers, closures or event listeners
  detachControl: (element: HTMLElement) => void;

  //this optional function will get called for each rendered frame, if you want to synchronize your input to rendering,
  //no need to use requestAnimationFrame. It's a good place for applying calculations if you have to
  checkInputs?: () => void;
}
```

## How to Make a Walk and Look Around Camera

The following example customizes the keyboard and mouse inputs to a universal camera. With this change, using the arrow keys you can walk forwards and backward in the scene and rotate to look left and right. Using the mouse you can look around and above and below.

In the example there are two viewports, the upper one gives a first-person view as you move and look around. The lower one gives a representation of the camera and the collision volume surrounding it.

Remember to click on the scene before using the arrow keys.

<Playground id="#CTCSWQ#945" title="Walk and Look Camera Example" description="A simple example of customizing camera inputs to create a walk and look camera." image="/img/playgroundsAndNMEs/divingDeeperCustomCameraInput1.jpg"/>
