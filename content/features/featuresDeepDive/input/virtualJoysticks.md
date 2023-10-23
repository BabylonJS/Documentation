---
title: Virtual Joysticks
image:
description: Learn about virtual gamepad input support in Babylon.js.
keywords: diving deeper, input, gamepad, controller, virtual gamepad
further-reading:
video-overview:
video-content:
---

## VirtualJoystick

Create virtual joysticks for the left and right side of the screen

```javascript
const leftJoystick = new BABYLON.VirtualJoystick(true);
const rightJoystick = new BABYLON.VirtualJoystick(false);
```

Get joystick value

```javascript
leftJoystick.deltaPosition.x;
leftJoystick.deltaPosition.y;
```

<Playground id="#PRQU53#7" title="VirtualJoystick Example" description="Simple example showing how to add a VirtualJoystick to your scene." image="/img/playgroundsAndNMEs/divingDeeperVirtualJoystick1.jpg"/>

Note: This will create an overlay canvas on top of the canvas for the scene. This will disable interaction with the Babylon GUI elements and scene pointer events. To avoid this the overlay joystick canvas's z index can be modified to toggle between scene interaction and joysticks input as seen in the playground above. Another option would be to create a custom joystick using the Babylon GUI as described below.

## Custom joystick

To create a custom virtual joystick and modify it to suit specific use cases, the Babylon GUI can be used.

<Playground id="#C6V6UY#5" title="Custom Joystick Example" description="Simple example showing how to add a Custom Joystick to your scene." image="/img/playgroundsAndNMEs/divingDeeperVirtualJoystick2.jpg"/>

As seen in this example, no overlay canvas is used so other GUI elements will continue to function and the visuals can be modified/positioned if needed.

You can also create a custom input for a camera. For example, here is a joined input suitable for FPS games with a movement joystick on the left and swipe-rotation area on the right:

<Playground id="#MQ9B0X#3" title="Custom Joystick Input Example" description="Simple example showing how to add a Custom Joystick Input to your camera." image="/img/playgroundsAndNMEs/divingDeeperVirtualJoystick2.jpg"/>
