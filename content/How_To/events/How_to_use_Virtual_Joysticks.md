---
title: Virtual Joysticks
image: 
description: Learn about virtual gamepad input support in Babylon.js.
keywords: welcome, babylon.js, diving deeper, input, gamepad, controller, virtual gamepad
further-reading:
video-overview:
video-content:
---

## VirtualJoystick
Create virtual joysticks for the left and right side of the screen
```
var leftJoystick = new BABYLON.VirtualJoystick(true);
var rightJoystick = new BABYLON.VirtualJoystick(false);
```

Get joystick value
```
leftJoystick.deltaPosition.x
leftJoystick.deltaPosition.y
```

* <Playground id="#PRQU53" title="VirtualJoystick Example" description="Simple example showing how to add a VirtualJoystick to your scene." image="/img/playgroundsAndNMEs/divingDeeperVirtualJoystick1.jpg"/>

Note: This will create an overlay canvas on top of the canvas for the scene. This will disable interaction with the Babylon GUI elements and scene pointer events. To avoid this the overlay joystick canvas's z index can be modified to toggle between scene interaction and joysticks input as seen in the playground above. Another option would be to create a custom joystick using the Babylon GUI as described below. 

## Custom joystick

To create a custom virtual joystick and modify it to suit specific use cases, the Babylon GUI can be used.

* <Playground id="#C6V6UY#5" title="Custom Joystick Example" description="Simple example showing how to add a Custom Joystick to your scene." image="/img/playgroundsAndNMEs/divingDeeperVirtualJoystick2.jpg"/>

As seen in this example, no overlay canvas is used so other GUI elements will continue to function and the visuals can be modified/positioned if needed.
