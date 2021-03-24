---
title: WebXR Controllers Support
image:
description: Learn about the robust library of WebXR controllers and input supported in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR, input, controller
further-reading:
video-overview:
video-content:
---

One of the major differences between WebVR and WebXR was the support for different types of controllers. While WebVR supported the non-standard extended gamepad API and a few selected controllers, WebXR already supports a lot of different types of inputs, including touch screens, motion controllers, and hands.

## Some terms and classes to clear things up

An XR controller comprises a lot of components that we at Babylon.js sometimes name differently. It is also important to know the terms themselves to be able to use what you actually need. I would recommend reading the [XR Input section](https://www.w3.org/TR/webxr/#input) of the WebXR proposal draft.

An XR Session controls the input source of the current session. Every new input source connected to this session will be registered in the `inputSources` array of the native XR Session and will also trigger the `inputsourceschange` event with the new input source.

An Input source has one of three target Ray modes - `tracked-pointer` for gamepad-like controllers, `screen` for touch-screen oriented inputs, and `gaze` for gaze-based inputs (input sources like google cardboard that has no proper way for user input).

The [WebXRInput](/typedoc/classes/babylon.webxrinput) class is responsible of coordinating the addition and removal of input sources. It creates **WebXR Input Sources** classes and disposes of them automatically for you.

Babylon's [WebXR Input Source](/typedoc/classes/babylon.webxrinputsource) class is the container for all user-input related objects. It is created automatically for you by the WebXR Input class for every controller.it is in charge of attaching the motion controller, which, in turn, is in charge of attaching the components and load the model.

An input source has two important reference spaces:

1. The `targetRay`, which represents the pointer's position and direction. Think - the edge of your finger.
2. The `gripSpace`, which is the base of a handheld device connected to this input source. Think - the base of your hand. The `gripSpace` is optional and is only available when a motion controller is connected.

Although sometimes the same, the grip and target ray space can have different transformations.

A controller has an attached **motion controller** if the input source is a gamepad-like device (the Oculus Touch or the windows motion controllers are a good example for that). In turn, each controller has different **components** (buttons, triggers, thumbpads, touchpads), which have their state updated on each frame.

Note that input sources like of type `screen` are constantly created and removed when touch starts and end. This is called a transient input in the documentation.

## WebXRInput

The WebXR Input, initialized usually by the WebXR Experience Helper has little to no public members and is, in general, a standalone class that you won't interact with. However, it does have two observables that can be helpful for your experience:

### onControllerAddedObservable

This observable will be triggered when a new input source was detected and its corresponding WebXRInputSource class was created.

### onControllerRemovedObservable

Will be triggered when a controller left the experience, right before it is disposed.

## WebXRInputSource

The input source, created by the WebXR input, is your central container for a single input source (or controller). It has a few important members that will allow you to controller your input source.

## Public members

As mentioned before the Input source has two reference spaces - `grip` and `target` , which we call `pointer` . Both of those spaces are represented by a mesh, positioned in the orientation and position that is provided by the XRFrame (and the XR session). Which means that if you want to query the current transformation of the user's hand or the direction the user is pointing at.

To do that you can use the `getWorldPointerRayToRef` function:

```javascript
const resultRay = new BABYLON.Ray();

// get the pointer direction
xrInputSource.getWorldPointerRayToRef(resultRay);
// get the grip direction, if available. If not, the pointer:
xrInputSource.getWorldPointerRayToRef(resultRay, true);
```

Usually, you would need to pointer direction ray.

### Input source observables

#### onMotionControllerInitObservable

This will be triggered when a motion controller, if available was initialized and its profile loaded.

#### onMeshLoadedObservable

This is a helper observable and is the same as `xrController.motionController.onModelLoadedObservable` . But since the motion controller is created async, using the `motionController` observable will only be available after `onMotionControllerInitObservable` was triggered:

```javascript
// async, async, async
xrInput.onControllerAddedObservable.add((inputSource) => {
  inputSource.onMotionControllerInitObservable.add((motionController) => {
    motionController.onMeshLoadedObservable.add((model) => {});
  });
});

// a little cleaner
xrInput.onControllerAddedObservable.add((inputSource) => {
  inputSource.onModelLoadedObservable.add((model) => {});
});
```

#### onDisposeObservable

Will be triggered right at the end of the `dispose()` function of the input source.

## Motion controllers

In most cases when starting a VR session, the user will have handheld devices, called here motion controllers. A motion controller will be automatically loaded, if available. A motion controller has a profile, containing its different components and their positions in the buttons and axes array, but Babylon.js takes care of this for you so you don't have to know this to interact with the motion controller. You can see the different profiles in the [WebXR Input Profiles repository](https://github.com/immersive-web/webxr-input-profiles)

### Controller components

Each motion controller has different components, that are described in its profile. Each component has one of the types:

- Button
- Trigger
- Squeeze
- Thumbstick
- Touchpad

It also has a **unique** component id, which correlates to the actual component. For example, the **A button** on the Oculus Touch has the **type** `button` , and the **id** `a-button` .

#### Get the components available

To get a list of the components available, use the `getComponentIds` function. This will return an array of strings containing the IDs of the different components in this motion controller:

```javascript
const ids = motionController.getComponentIds();
// ids = ["a-button", "b-button", "xr-standard-trigger", .....]
```

You can also get all of the available components using the `components` public member of the Motion Controller class. It is a map of all `WebXRControllerComponent` elements in this motion controller.

#### Get components

To get a component you need to either know its ID or type. When more than one of that type exists, the id would be better. The IDs can be found in the profile.

To get a component according to its ID:

```javascript
const triggerComponent = motionController.getComponent("xr-standard-trigger");
if (triggerComponent) {
  // found, do something with it.
}
```

To get a component of a specific type:

```javascript
const squeezeComponent = motionController.getComponentOfType("squeeze");

// get the first registered button component
const buttonComponent = motionController.getComponentOfType("button");
```

to get all components of a specific type:

```javascript
// get all button components
const buttonComponents = motionController.getAllComponentsOfType("button");
if (buttonComponents.length) {
  // some were found
}
```

#### The main component

Each controller has a main component, defined by the vendor. In most cases it is the trigger component type that is the main component. To get the main component (as defined in the profile):

```javascript
const mainComponent = motionController.getMainComponent();
// mainComponent always exists!
```

#### Events and changes of a controller component

A component is updated on each frame with values provided by the gamepad object of the session's input source. Each button has 2 states - `touched` and `pressed` , and a value from 0 to 1 (0 being not pressed at all, 1 being fully pressed). Some components can only have the values 0 and 1 (like the button component).

Some types of components also have axes values (like a thumbstick or touchpad). The axes have values from -1 to 1.
1 in the X-axis means right, and 1 in the Y-Axis means down (towards the user).

To know what the components supports:

```javascript
if (component.isButton()) {
  // we have a value
}
if (component.isAxes()) {
  // we have axes data
}
```

To get the component values at the current frame:

```javascript
let value = component.value;
if (value > 0.8) {
  // do something nice with this value
}
if (component.pressed) {
  // the component is pressed, meaning value === 1
}

if (component.touched) {
  // fingers are on the component, might be half-pressed or moved
}
```

To access the axes data:

```javascript
let axes = component.axes;
if (axes.x > 0.8) {
  // do something nice with the x-axis value
}
```

The component can also return the changes compared to the last frame. Changes are only populated when they exist, otherwise the changes map will be empty:

```javascript
// maybe nothing happened between this and last frame
if (!component.hasChanges) {
    return;
}
let changes = component.changes;
if (changes.pressed) {
    // pressed state changed
    const isPressedNow = changes.pressed.current;
    const wasPressedInLastFrame = changes.pressed.previous;
}
if (changes.value) {
    // value changed! let's get the delta
    const delta - changes.value.current - changes.value.previous;
}
```

The components have two observables that can be used to fetch changes (and avoid checking value changes on each frame):

```javascript
component.onButtonStateChangedObservable.add((component) => {
  // something changed, check the changes object
});

component.onAxisValueChangedObservable.add((values) => {
  console.log(values.x, values.y);
});
```

### How to get a model

#### The input-profile online repository

As part of the (successful!) attempt at forcing standards to WebXR, the guys at the [WebXR Input Profiles](https://github.com/immersive-web/webxr-input-profiles) github repository created an online repository that holds models and definition of visual reference definitions for most (if not all) motion controllers available today.

Babylon.js natively supports this repository and currently uses it as the default model delivery method for XR controllers.

There is little to no action required on your end - this is automated when not changing the configuration.

#### Babylon local controller definitions

Before the input-profile repository was published, Babylon had support for different types of controllers - Occulus Touch (1 and 2), Vive, Windows Motion Controllers and more. Since we still wanted to offer local support for those devices, we have decided to not only relay on the online profile repository, but to also deliver babylon-based controller classes for those that are already developed.

Babylon offers local definitions for the following:

- Windows Motion Controllers
- Oculus Touch 1 and 2
- Vive
- Generic-Button controller

To use them, import them to your project, while not forgetting to prioritize them or disable the online repository:

```javascript
// import the ones you want to use
import { WebXRMicrosoftMixedRealityController } from "@babylonjs/core/XR/motionController/webXRMicrosoftMixedRealityController";

// prioritize the local classes (but use online if controller not found)
WebXRMotionControllerManager.PrioritizeOnlineRepository = false;
// or disable the online repository
WebXRMotionControllerManager.UseOnlineRepository = false;

// now, if loading a microsoft motion controller it will use the local class
```
