---
title: Device Source Manager
image:
description: Learn about managing input devices with the Device Source Manager.
keywords: diving deeper, input, manage, device manager
further-reading:
video-overview:
video-content:
---

## Introduction

The [DeviceSourceManager](/typedoc/classes/babylon.devicesourcemanager) is a class that will manage the connections for various user input devices and provide methods of querying those devices for their current state.  
This class supports several methods of input:

- **Keyboard** _(DeviceType: BABYLON.DeviceType.Keyboard, Inputs: number)_
- **Mouse** _(DeviceType: BABYLON.DeviceType.Mouse, Inputs: BABYLON.PointerInput)_
- **Touch** _(DeviceType: BABYLON.DeviceType.Pointer, Inputs: BABYLON.PointerInput)_
- **DualShock Gamepad** _(DeviceType: BABYLON.DeviceType.DualShock, Inputs: BABYLON.DualShockInput)_
- **Xbox Gamepad, One or 360** _(DeviceType: BABYLON.DeviceType.Xbox, Inputs: BABYLON.XboxInput)_
- **Switch Gamepad, L+R JoyCon Grip or Pro Controller** _(DeviceType: BABYLON.DeviceType.Switch, Inputs: BABYLON.SwitchInput)_
- **Generic/Other Gamepad** _(DeviceType: BABYLON.DeviceType.Generic, Inputs: number)_

Here's an example of the DeviceSourceManager in use
<Playground id="#C7PM2B#18" title="DeviceSourceManager Example" description="Simple example showing how to use the DeviceSourceManager in your scene." image="/img/playgroundsAndNMEs/pg-C7PM2B-17.png"/>

To use the DeviceSourceManager, first create an instance of it. You will need to provide an engine object.

```javascript
const deviceSourceManager = new BABYLON.DeviceSourceManager(scene.getEngine());
```

Within your scene's render/game loop, you can query the DeviceSourceManager for the current state of a specific input. First, you will need to get the DeviceSource object. With this object, you can then query for a specific input's status.

```javascript
// If the device has been registered in the DeviceSourceManager
if (deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Xbox)) {
  // And the A button was pressed
  if (deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Xbox).getInput(BABYLON.XboxInput.A) === 1) {
    // Do something
  }
}
```

It should also be noted that you can use optional chaining to make checks fit into a single line

```javascript
if (deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Xbox)?.getInput(BABYLON.XboxInput.A) === 1) {
  // Do something
}
```

## Events and Observables

You can use the following Observables to work with identifiers for a given device

```javascript
// When a device is registered in the DeviceSourceManager
onDeviceConnectedObservable.add((device) => {
  // You can get the device type by using device.deviceType
  // You can also get the device slot by using device.deviceSlot (default is 0 for keyboard and 1 for mouse)
  // "device" is of Type DeviceSource do you can also access the getInput function or add an observable for onInputChangedObservable
});

// When a device is unregistered in the DeviceSourceManager
onDeviceDisconnectedObservable.add((device) => {
  // You can get the device type by using device.deviceType
  // You can also get the device slot by using device.deviceSlot (default is 0 for keyboard and 1 for mouse)
  // "device" is of Type DeviceSource
});
```

Here's a demonstration of how these Observables work
<Playground id="#Y4YWCD#1" title="Basic DeviceSourceManager Demo" description="Simple demonstration of how the DeviceSourceManager observables work" image="/img/playgroundsAndNMEs/pg-Y4YWCD-1.png"/>

For Keyboards and Pointers, you can use an event based system to get the current input and previous input when an input is activated

```javascript
deviceSourceManager.getDeviceSource(BABYLON.DeviceType.Keyboard).onInputChangedObservable.add((eventData) => {
  // eventData will contain the event data that you'd find in something like a PointerEvent or KeyboardEvent
  // eventData also has an additional value inputIndex
});
```
