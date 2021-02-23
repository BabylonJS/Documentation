---
title: Interacting With Scenes
image: 
description: Begin learning about how to develop interactions for your Babylon.js scenes.
keywords: welcome, babylon.js, diving deeper, events, interactions 
further-reading:
    - title: Observables
      url: /divingDeeper/events/observables
video-overview:
video-content:
---

## How to Interact with A Scene

There are three main ways for a user to interact with a scene, the keyboard, the [GUI](/divingDeeper/gui) and directly with a mouse, touch or gamepad. The use of keyboard and pointer interactions are described on this page.

## Keyboard Interactions

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

## Pointer Interactions

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

## Playground Examples

<Playground id="#0XYMA9#1" title="Scene Observables Template" description="Simple scene observables template." image="/img/playgroundsAndNMEs/divingDeeperInteractions1.jpg" isMain={true} category="Scene"/>
<Playground id="#7CBW04" title="Simple Drag Example" description="Simple example of a drag behavior." image="/img/playgroundsAndNMEs/divingDeeperInteractions2.jpg" isMain={true} category="Scene"/>
<Playground id="#XZ0TH6" title="Simple Keyboard Input Example" description="Simple example of keyboard input." image="/img/playgroundsAndNMEs/divingDeeperInteractions3.jpg" isMain={true} category="Scene"/>

Remember to click in scene (to set focus) before using keyboard