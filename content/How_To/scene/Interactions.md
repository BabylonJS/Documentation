# How to Interact with A Scene

There are three main ways for a user to interact with a scene, the keyboard, the [GUI](/how_to/Gui) and directly with a mouse, touch or gamepad. The use of keyboard and pointer interactions are described on this page.

# Keyboard Interactions

By customizing the following code template you can control reactions within your scene to different keys. Both the `ascii` code for the key and the key itself are available to you.

```javascript
scene.onKeyboardObservable.add((kbInfo) => {
	switch (kbInfo.type) {
		case BABYLON.KeyboardEventTypes.KEYDOWN:
			console.log("KEY DOWN: ", kbInfo.event.key);
			break;
		case BABYLON.KeyboardEventTypes.KEYUP:
			console.log("KEY UP: ", kbInfo.event.keyCode);
			break;
	}
});
```

# Pointer Interactions.

First of all a reminder that for **touch** events in Babylon.js [PEP](https://github.com/jquery/PEP) is required. To use PEP all that is necessary is to

1. install PEP

```javascript
<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
```

2. stop the default touch-action within the rendering canvas 

```javascript
<canvas id="renderCanvas" touch-action="none"></canvas>
```


Whether your pointer is an icon or a finger by customizing the following code template you will enable your project to react to a range of pointer events;

```javascript
scene.onPointerObservable.add((pointerInfo) => {
	switch (pointerInfo.type) {
		case BABYLON.PointerEventTypes.POINTERDOWN:
			console.log("POINTER DOWN");
			break;
		case BABYLON.PointerEventTypes.POINTERUP:
			console.log("POINTER UP");
			break;
		case BABYLON.PointerEventTypes.POINTERMOVE:
			console.log("POINTER MOVE");
			break;
		case BABYLON.PointerEventTypes.POINTERWHEEL:
			console.log("POINTER WHEEL");
			break;
		case BABYLON.PointerEventTypes.POINTERPICK:
			console.log("POINTER PICK");
			break;
		case BABYLON.PointerEventTypes.POINTERTAP:
			console.log("POINTER TAP");
			break;
		case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
			console.log("POINTER DOUBLE-TAP");
			break;
    }
});
```

# Playground Examples

* [Playground Example Scene Observables Template](https://www.babylonjs-playground.com/#0XYMA9#1)
* [Playground Example Drag](https://www.babylonjs-playground.com/#7CBW04)
* [Playground Example Keyboard](https://www.babylonjs-playground.com/#XZ0TH6)

Remember to click in scene (to set focus) before using keyboard

# Further Reading

# Mid Level - L2

[Observables](/how_to/observables)