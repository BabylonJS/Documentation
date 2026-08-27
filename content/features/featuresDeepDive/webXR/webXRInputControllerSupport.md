---
title: WebXR Controllers Support
image:
description: Learn about the robust library of WebXR controllers and input supported in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR, input, controller, tracked sources, haptics
further-reading:
video-overview:
video-content:
---

One of the major differences between WebVR and WebXR is support for different types of controllers. While WebVR supported the non-standard extended gamepad API and a few selected controllers, WebXR already supports many different input types, including touch screens, motion controllers, and hands.

## Some terms and classes to clear things up

An XR controller comprises many components that we at Babylon.js sometimes name differently. It is also important to know the terms themselves so you can use what you actually need. I recommend reading the [XR Input section](https://www.w3.org/TR/webxr/#input) of the WebXR proposal draft.

An XR Session controls the input source of the current session. Every new input source connected to this session will be registered in the `inputSources` array of the native XR Session and will also trigger the `inputsourceschange` event with the new input source.

An input source has one of three target ray modes - `tracked-pointer` for gamepad-like controllers, `screen` for touchscreen-oriented inputs, and `gaze` for gaze-based inputs (input sources like Google Cardboard that have no proper way for user input).

Babylon's [WebXRInput](/typedoc/classes/babylon.webxrinput) class is responsible for coordinating the addition and removal of input sources. It creates **WebXR Input Sources** classes and disposes of them automatically for you.

Babylon's [WebXRInputSource](/typedoc/classes/babylon.webxrinputsource) class is the container for all user-input-related objects. It is created automatically by the WebXRInput class for every controller. It is in charge of attaching the motion controller, which, in turn, is responsible for attaching the components and loading the model.

An input source has two important [reference spaces](https://www.w3.org/TR/webxr/#xrspace):

1. The `targetRay`, which represents the pointer's position and direction. Think - the edge of your finger.
2. The `gripSpace`, which is the base of a handheld device connected to this input source. Think - the base of your hand. The `gripSpace` is optional and is only available when a motion controller is connected.

Although sometimes the same, the grip and target ray spaces can have different transformations.

A controller has an attached **motion controller** if the input source is a gamepad-like device (the Oculus Touch or Windows motion controllers are good examples). In turn, each controller has different **components** (buttons, triggers, thumbpads, touchpads), which have their state updated on each frame.

Note that input sources with [`targetRayMode`](https://www.w3.org/TR/webxr/#dom-xrinputsource-targetraymode) of [`"screen"`](https://www.w3.org/TR/webxr/#dom-xrtargetraymode-screen) are constantly created and removed when touch starts and ends. This is called [transient input](https://www.w3.org/TR/webxr/#transient-input).

## WebXRInput

The [WebXRInput](/typedoc/classes/babylon.webxrinput) class has little to no public members, so you typically won't interact with it. An instance is usually created by the WebXRDefaultExperience. It has two observables that can be helpful:

### onControllerAddedObservable

This observable will be triggered when a new input source is detected and its corresponding [WebXRInputSource](/typedoc/classes/babylon.webxrinputsource) is created.

### onControllerRemovedObservable

This one will be triggered when a controller leaves the experience, right before its [WebXRInputSource](/typedoc/classes/babylon.webxrinputsource) instance is disposed.

## WebXRInputSource

[WebXRInputSource](/typedoc/classes/babylon.webxrinputsource), created by the [WebXRInput](/typedoc/classes/babylon.webxrinput), represents an input source (controller). It has a few important members.

## Mixing hands and controllers

Starting with Babylon 6.42.0, it is possible to mix different types of controllers, as long as the underlying system supports it. For example, you could support both a hand and a controller at the same time.
To try that, just enter any XR demo with your controllers and put one of them down, or enter with both hands and pick up one controller.

### Public methods

#### getWorldPointerRayToRef

As mentioned before, an input source has two reference spaces: `grip` and `target` (which we call `pointer`). Each of those spaces is represented by a mesh, positioned using the orientation and position provided by the XRFrame (and the XRSession). If you want to query the current transform of the user's hand or the direction the user is pointing, you can use the `getWorldPointerRayToRef` method:

```javascript
// Get the pointer direction ray.
const pointerRay = new BABYLON.Ray();
xrInputSource.getWorldPointerRayToRef(pointerRay);

// Try to get the grip direction ray. If that's not available,
// the pointer direction ray will be given.
const gripRay = new BABYLON.Ray();
xrInputSource.getWorldPointerRayToRef(gripRay, /* gripIfAvailable = */ true);
```

In most scenarios, you will need the pointer (not the grip) direction ray.

### Observables

#### onMotionControllerInitObservable

This will be triggered when a motion controller, if available, is initialized and its profile is loaded.

#### onMeshLoadedObservable

This is a helper observable. It is the same as `xrController.motionController.onModelLoadedObservable`. Because `motionController` is created asynchronously, using this one may require less code:

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

## Tracked sources

The experimental tracked-sources feature exposes hands and controllers that the XR runtime continues to track even when they are not active input sources. The native `XRSession.inputSources` collection contains sources currently participating in input, while `XRSession.trackedSources` can retain pose-capable sources that are not currently active. See the [WebXR specification](https://immersive-web.github.io/webxr/) for the native API.

<Alert severity="warning" title="Experimental browser support">
Tracked sources are currently known to be supported primarily in Meta Quest Browser 34.1+ and require compatible XR hardware. Enable the feature as optional and check whether it attached before relying on it.
</Alert>

Babylon's `WebXRFeatureName.TRACKED_SOURCES` has the value `"xr-tracked-sources"`. This is a Babylon feature-manager name; the feature requests the distinct native WebXR session feature descriptor `"tracked-sources"`.

For ES modules, import the feature module so it registers with the features manager:

```typescript
import "@babylonjs/core/XR/features/WebXRTrackedSources.js";
```

Then enable the latest feature version. There are no feature-specific options; the final `false` requests `"tracked-sources"` as an optional rather than required native session feature:

```typescript
const trackedSourcesFeature = xr.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.TRACKED_SOURCES, "latest", undefined, true, false);

xr.baseExperience.onStateChangedObservable.add((state) => {
  if (state === BABYLON.WebXRState.IN_XR && !trackedSourcesFeature.attached) {
    console.warn("Tracked sources are unavailable in this XR runtime.");
  }
});
```

Applications using the side-effect-free `.pure` module must instead call the exported, idempotent `RegisterWebXRTrackedSources()` function before enabling the feature.

The feature provides:

```typescript
readonly trackedSources: ReadonlyArray<XRInputSource>;
readonly onTrackedSourceAddedObservable: Observable<XRInputSource>;
readonly onTrackedSourceRemovedObservable: Observable<XRInputSource>;
```

Each `trackedSources` access returns a copied, read-only view of the current native collection. The array is a snapshot, but each entry is the original native `XRInputSource`; add and remove notifications preserve that same object identity.

Enabling this feature does not add tracked-only sources to `XRSession.inputSources`, `WebXRInput.controllers`, or Babylon's normal controller/model pipeline. Use the observables when you need to manage tracked-only state yourself:

```typescript
trackedSourcesFeature.onTrackedSourceAddedObservable.add((source) => {
  console.log("Tracked source added:", source);
});

trackedSourcesFeature.onTrackedSourceRemovedObservable.add((source) => {
  console.log("Tracked source removed:", source);
});
```

On attachment, existing native tracked sources are reported as additions. Babylon reconciles later changes by native object identity. Detaching the feature, ending or changing the XR session, and disposing the feature remove listeners and clear the current collection; removals are reported for retained sources during cleanup.

<Playground id="#JRBQVL#0" title="WebXR tracked sources" description="Compare active XR input sources with sources still tracked by the runtime."/>

## Motion controllers

In most cases, when starting a VR session, the user will have handheld devices, called motion controllers here. A motion controller will be automatically loaded if available. A motion controller has a profile containing its different components and their positions in the buttons and axes array, but Babylon.js takes care of this for you, so you don't have to know this to interact with the motion controller. You can see the different profiles in the [WebXR Input Profiles repository](https://github.com/immersive-web/webxr-input-profiles).

### Controller haptics

The [WebXR Gamepads Module](https://www.w3.org/TR/webxr-gamepads-module-1/) exposes a gamepad for an XR input source. Babylon WebXR motion controllers use it to support both the standard advanced [Gamepad haptics API](https://w3c.github.io/gamepad/) and the legacy `pulse()` API. This Babylon API belongs to WebXR motion-controller classes; it does not extend Babylon's general gamepad system and requires no WebXR feature-manager registration.

<Alert severity="warning" title="Experimental browser and hardware support">
Advanced controller haptics are experimental. Available actuators and effects vary by browser, XR runtime, controller firmware, and streaming layer. Query every actuator's advertised effects and handle operation errors instead of relying on a browser or controller model alone.
</Alert>

The actuator shape and motion-controller methods are:

```typescript
export interface IWebXRControllerHapticActuator {
  readonly effects?: ReadonlyArray<GamepadHapticEffectType>;
  playEffect?: GamepadHapticActuator["playEffect"];
  reset?: GamepadHapticActuator["reset"];
}

getHapticEffects(hapticActuatorIndex: number = 0): ReadonlyArray<GamepadHapticEffectType>;

playHapticEffectAsync(
  effectType: GamepadHapticEffectType,
  parameters?: GamepadEffectParameters,
  hapticActuatorIndex: number = 0,
): Promise<GamepadHapticsResult>;

resetHapticActuatorAsync(hapticActuatorIndex: number = 0): Promise<GamepadHapticsResult>;

pulse(value: number, duration: number, hapticActuatorIndex: number = 0): Promise<boolean>;
```

Advanced haptics primarily use the standard `gamepad.vibrationActuator` at index `0`. If it is absent, Babylon falls back to `gamepad.hapticActuators[0]`; higher indices use the corresponding legacy array entry. If a `vibrationActuator` exists but lacks an advanced capability, Babylon reports that error rather than switching to the legacy actuator. Babylon retains `hapticActuators` for backward-compatible `pulse()` behavior, and `pulse()` continues to use that legacy array directly. It resolves `false` if the indexed legacy actuator is unavailable, while a native `pulse()` rejection still propagates.

Always query an actuator's advertised effects before playback. An empty array means effect discovery is unavailable or no effects were advertised; do not assume that every actuator supports every effect:

```typescript
const effects = motionController.getHapticEffects();

try {
  if (effects.includes("dual-rumble")) {
    await motionController.playHapticEffectAsync("dual-rumble", {
      duration: 200,
      strongMagnitude: 0.7,
      weakMagnitude: 0.4,
    });
  }
} catch (error) {
  console.warn("Controller haptics are unavailable:", error);
}
```

The standard `GamepadEffectParameters` type supports `duration` and `startDelay` in milliseconds. A `"dual-rumble"` effect uses `strongMagnitude` and `weakMagnitude`; a `"trigger-rumble"` effect uses `leftTrigger` and `rightTrigger`. Magnitudes range from `0` to `1`. Babylon forwards these typed parameters to the native actuator without adding defaults or range validation.

Advanced methods fail deterministically for negative, fractional, or unavailable actuator indices. Playback also rejects when effect discovery, the requested effect, or `playEffect` is unsupported; reset rejects when the actuator has no `reset` method. Native `"complete"` or `"preempted"` results and native promise rejections propagate to the caller.

The corresponding errors identify the actuator and failure: an invalid index throws `RangeError: Haptic actuator index <index> is out of range.`; unsupported playback reports missing effect discovery, an unsupported effect, or missing advanced playback; unsupported reset reports `Haptic actuator <index> does not support reset.`

Keep haptic effects short and initiate them in response to an intentional interaction rather than vibrating automatically or for a prolonged period.

<Playground id="#ULVR1X#0" title="WebXR advanced controller haptics" description="Query supported effects, play short controller haptics, and reset an actuator."/>

### Controller components

Each motion controller has different components, which are described in its profile. Available component types:

- Button
- Trigger
- Squeeze
- Thumbstick
- Touchpad

It also has a **unique** component ID, which corresponds to the actual component. For example, the **A button** on the Oculus Touch has the **type** `button` and the **ID** `a-button`.

#### Getting available components

To get a list of the available components, use the `getComponentIds` function. This will return an array of strings containing the IDs of the different components in this motion controller:

```javascript
const ids = motionController.getComponentIds();
// ids = ["a-button", "b-button", "xr-standard-trigger", .....]
```

You can also get all of the available components using the `components` public member of the Motion Controller class. It is a map of all `WebXRControllerComponent` elements in this motion controller.

#### Get components

To get a component, you need to know either its ID or its type. When more than one component of that type exists, the ID is better. The IDs can be found in the profile.

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

To get all components of a specific type:

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

A component is updated on each frame with values provided by the gamepad object of the session's input source. Each button has 2 states - `touched` and `pressed`, and a value from 0 to 1 (0 being not pressed at all, 1 being fully pressed). Some components can only have the values 0 and 1 (like the button component).

Some types of components also have axes values (like a thumbstick or touchpad). The axes have values from -1 to 1.
1 in the X-axis means right, and 1 in the Y-Axis means down (towards the user).

To know what the components support:

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

The component can also return changes compared to the last frame. The changes object is populated only when changes exist; otherwise, the map will be empty:

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

Here is a simple example of controller input.  
When using Oculus Quest 2 controllers, component IDs and controller buttons are mapped as follows.

On Oculus Quest 2 controllers:

![Quest 2 controller mappings](/img/how_to/xr/xr-quest2-controllers_ids_mapping.webp)

On the Playground sample:

![ids mappings](/img/how_to/xr/xr-quest2-ids-mapping-playground.webp)

The simple example changes the scaling of each 3D object when each button is pressed.

```javascript
const xr_ids = motionController.getComponentIds();
let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
triggerComponent.onButtonStateChangedObservable.add(() => {
  if (triggerComponent.pressed) {
    Box_Right_Trigger.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
  } else {
    Box_Right_Trigger.scaling = new BABYLON.Vector3(1, 1, 1);
  }
});
```

Playground for a simple VR controllers input: <Playground id="#28EKWI#37" title="WebXR_motion controller input" description="Simple code for motion controller input on WebXR."/>

### How to get a model

#### The input-profile online repository

As part of the (successful!) effort to standardize WebXR, the [WebXR Input Profiles](https://github.com/immersive-web/webxr-input-profiles) GitHub repository provides an online repository that holds models and visual reference definitions for most, if not all, motion controllers available today.

The repository provides a useful tool as [WebXR Input Profile Viewer](https://immersive-web.github.io/webxr-input-profiles/packages/viewer/dist/index.html). You can easily check each id, state, button, and axis of XR controllers.

Babylon.js natively supports this repository and currently uses it as the default model delivery method for XR controllers.

There is little to no action required on your end—this is automated as long as you do not change the configuration.

#### Babylon local controller definitions

Before the input-profile repository was published, Babylon supported different types of controllers - Oculus Touch (1 and 2), Vive, Windows Motion Controllers, and more. Since we still wanted to offer local support for those devices, we decided not only to rely on the online profile repository, but also to deliver Babylon-based controller classes for those that were already developed.

Babylon offers local definitions for the following:

- Windows Motion Controllers
- Oculus Touch 1 and 2
- Vive
- Generic-Button controller

To use them, import them into your project, while remembering to prioritize them or disable the online repository:

```javascript
// import the ones you want to use
import { WebXRMicrosoftMixedRealityController } from "@babylonjs/core/XR/motionController/webXRMicrosoftMixedRealityController";

// prioritize the local classes (but use online if controller not found)
WebXRMotionControllerManager.PrioritizeOnlineRepository = false;
// or disable the online repository
WebXRMotionControllerManager.UseOnlineRepository = false;

// now, if loading a microsoft motion controller it will use the local class
```
