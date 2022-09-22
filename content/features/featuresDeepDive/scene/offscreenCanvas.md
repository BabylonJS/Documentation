---
title: Offscreen Canvas
image: 
description: Learn all about the offscreen canvas in Babylon.js.
keywords: diving deeper, scene, offscreen canvas
further-reading:
video-overview:
video-content:
---

An offscreen canvas is a canvas that can be rendered off screen and on a different thread than the main UI thread.

It could be really interesting to do so if your main thread is already heavily used for other tasks.

You can see a page demonstrating this use case here: https://www.babylonjs.com/Demos/Offscreen

<Youtube id="zYrZNROQzKQ"/>

# Setting up the engine
Starting with Babylon.js v4.1, you can create an engine inside a worker by initializing it with an offscreen canvas.

First you need to create an offscreen canvas out of your regular canvas:
```
var canvas = document.getElementById("renderCanvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var offscreen = canvas.transferControlToOffscreen();
```

Then you need to spin off a new worker and send it the offscreen canvas

```
var worker = new Worker("worker.js"); 
worker.postMessage({canvas: offscreen}, [offscreen]);
```

The worker code will then listen to your message, get the offscreen canvas and start babylon.js as usual:

```
onmessage = function(evt) {
    canvas = evt.data.canvas;
    var engine = new BABYLON.Engine(canvas, true);

    // Your scene setup here
}
```

Then you can use your engine as usual.

# Caveats
The main caveat of using Babylon.js with an offscreen canvas in a worker thread is that you will need to do special work to communicate with the engine from the main thread. You will have to use the same messaging API we used before to communicate between threads.

Furthermore, Babylon.js will not be able to handle inputs for you and so APIs like `camera.attachControls()` will not work and you will have to message inputs to workers.

Here is an example of communication you will have to setup to support canvas resizing.

On main thread:
```
window.addEventListener("resize", () => {
    worker.postMessage({width: canvas.clientWidth, height:canvas.clientHeight});
});
```

On worker thread:
```

var engine;
onmessage = function(evt) {
    if (evt.data.width) {
        canvas.width = evt.data.width;
        canvas.height = evt.data.height;
    }
}
```

# Compatibility

Note that this feature is new and not yet compatible with every device or browser.
You can check current support of offscreen canvas here: https://caniuse.com/#feat=offscreencanvas

If you want to test the compatibility, you can add this condition before using offscreen canvas:
```
if ("OffscreenCanvas" in window && "transferControlToOffscreen" in canvas) { 
    // Ok to use offscreen canvas
}
```

# Resources
- https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- https://developers.google.com/web/updates/2018/08/offscreen-canvas