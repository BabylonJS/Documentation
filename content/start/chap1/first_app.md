---
title: Introduction - Chapter 1 - Setup Your First Web App
image: 
description: HTML Templates to load your first model or code into a Babylon.js scene.
keywords: getting started, start, chapter 1, first model, import
further-reading:
  - title: Setup with NPM
    url: /workflow/wfDeeper/developWithBjs/npmSupport
  - title: Setup with Tree Shaking
    url: /workflow/packages/treeShaking
video-overview:
video-content:
---

# A Web Application Template

You will have seen that the template needed for any code on the playground is

```javascript
var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  // Add a camera to the scene and attach it to the canvas
  // Add a lights to the scene

  //Your Code

  return scene;
};
```

By following this format in you own project you can quickly drop it into your own HTML page using the following as a template.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Babylon Template</title>

    <style>
      html,
      body {
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
    <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
  </head>

  <body>
    <canvas id="renderCanvas" touch-action="none"></canvas>
    <!-- touch-action="none" for best results from PEP -->

    <script>
      const canvas = document.getElementById("renderCanvas"); // Get the canvas element
      const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

      // Add your code here matching the playground format

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

This line

```javascript
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```

allows you to import models into your scene.

This line

```javascript
<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
```

allows you to use a touch screen.

## Examples

### Import a Model Setup

The following loads a box model into an app.

[First App](/webpages/app1.html)

Example setup for a loaded model

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Babylon Template</title>

    <style>
      html,
      body {
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
    <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
  </head>

  <body>
    <canvas id="renderCanvas" touch-action="none"></canvas>
    <!-- touch-action="none" for best results from PEP -->

    <script>
      const canvas = document.getElementById("renderCanvas"); // Get the canvas element
      const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

      // Add your code here matching the playground format
      const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "box.babylon");

        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

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

### Code a Model Setup

The following creates a box model in an app.

[First Coded App](/webpages/app2.html).

Example setup for a coded model

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Babylon Template</title>

    <style>
      html,
      body {
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
    <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
  </head>

  <body>
    <canvas id="renderCanvas" touch-action="none"></canvas>
    <!-- touch-action="none" for best results from PEP -->

    <script>
      const canvas = document.getElementById("renderCanvas"); // Get the canvas element
      const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

      // Add your code here matching the playground format
      const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        BABYLON.MeshBuilder.CreateBox("box", {});

        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

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

Let's move on to learning more about using Babylon.js code and build more interesting models. We start with giving our world a ground to build on.
