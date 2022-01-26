---
title: Quick Start Templates
image: 
description: A range of templates for using Babylon.js on the web
keywords: 3D, 3Dweb, 3D web, web, games, 3DGames, 3D games, Babylon.js, templates, template
further-reading: 
  - title: Getting Started
    url: /divingDeeper/developWithBjs/npmSupport
  - title: A First Web Page
    url: /start/chap1/first_app#code-a-model-setup
video-overview:
video-content:
---

## Minimal HTML Javascript Template

Read more about a [basic HTML template](/start/chap1/first_app#code-a-model-setup). 

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

The **CreateScene** function above, and in all the templates, is where you customize your own Babylon.js magic, the other parts are the support that you need to put it on the web.

## JavaScript Templates Ordered by Pre - requists

|Required Knowledge|Apps to Install|Template Information|Access|Outcome|
|----|----|----|----|----|
|JavaScript|None|[Playground](/quickstart/js_playground)|Browser|Editable basic scene with camera, lights and models|
|HTML, JavaScript|Text Editor|HTML Basic Page|Download|Single File, uses Babylon.js from cloud|
|HTML, JavaScript|Text Editor|HTML Basic Page|Download|Single Zipped File, includes local version of Babylon.js|
|Git, Github, HTML, JavaScript|Node, Git Client, VSCode|HTML Basic Project Environment|Fork and Clone|Folder structure, local Babylon.js, npm webserver|

## Typescript Templates Ordered by Pre - requists

|Required Knowledge|Apps to Install|Template Information|Access|Outcome|
|----|----|----|----|----|
|Typescript|None|Playground|Browser|Editable basic scene with camera, lights and models|
|Git, Github, HTML, JavaScript|Node, Git Client, VSCode|HTML Basic Project Environment|Fork and Clone|Folder structure, local Babylon.js, npm webserver|

## Glossary of Terms

