# VirtualJoystick
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

* [Playground Example](https://playground.babylonjs.com/#PRQU53)

Note: This will create an overlay canvas on top of the canvas for the scene. This will disable interaction with the Babylon GUI elements and scene pointer events. To avoid this the overlay joystick canvas's z index can be modified to toggle between scene interaction and joysticks input as seen in the playground above. Another option would be to create a custom joystick using the Babylon GUI as described below. 

# Custom joystick

To create a custom virtual joystick and modify it to suit specific use cases, the Babylon GUI can be used.

* [Playground Example](https://www.babylonjs-playground.com/#C6V6UY#5)

As seen in this example, no overlay canvas is used so other GUI elements will continue to function and the visuals can be modified/positioned if needed.
