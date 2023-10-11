---
title: Basic HTML for Babylon.js
image: 
description: Describes the basic HTML layout
keywords: basic, playground, template, javascript
further-reading:
video-overview:
video-content:
---

> ⚠️ WARNING: The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to developers who are learning how to use the platform and for running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>Babylon Template</title>

        <style>
            html, body {
                overflow: hidden;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }
            #renderCanvas {
                width: 100%;
                height: 100%;
                touch-action: none;
            }
        </style>

        <script src="https://cdn.babylonjs.com/babylon.js"></script>

    </head>

   <body>

	<canvas id="renderCanvas"></canvas>

	<script>
        const canvas = document.getElementById("renderCanvas"); // Get the canvas element
        const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
        const createScene = function () {
            // This creates a basic Babylon Scene object (non-mesh)
            const scene = new BABYLON.Scene(engine);
            // This creates and positions a free camera (non-mesh)
            const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
            // This targets the camera to scene origin
            camera.setTarget(BABYLON.Vector3.Zero());
            // This attaches the camera to the canvas
            camera.attachControl(canvas, true);
            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 0.7;
            // Our built-in 'sphere' shape.
            const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
            // Move the sphere upward 1/2 its height
            sphere.position.y = 1;
            // Our built-in 'ground' shape.
            const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
            return scene;
        };
        const scene = createScene(); //Call the createScene function
        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
                scene.render();
        });
        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
                engine.resize();
        });
	</script>

   </body>

</html>
```