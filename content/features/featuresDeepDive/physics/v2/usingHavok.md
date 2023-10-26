---
title: Using Havok and the Havok Plugin
image:
description: Learn how to use the havok plugin offered by Babylon.js
keywords: diving deeper, physics, havok, plugin
further-reading:
video-overview:
video-content:
---

# Using Havok and the Havok Plugin

## Havok and Babylon.js

The Havok integration in Babylon.js consists of two different modules that work together.
The first is the Havok engine itself, which is a WebAssembly module that is responsible for the actual physics calculations.
The second is the Babylon Havok plugin, which is responsible for the integration of the Havok physics engine into Babylon.js.

## The Havok physics engine

_To read about the babylon plugin directly, [skip to the next section](#the-babylon-havok-plugin)._

Havok is now available for the web, using a WebAssembly version of the engine. It is available, free to use, under the MIT license.
The engine is available on both [the npm package](https://www.npmjs.com/package/@babylonjs/havok) `@babylonjs/havok` and on our CDN under the URL `https://cdn.babylonjs.com/havok/HavokPhysics_umd.js` or `https://cdn.babylonjs.com/havok/HavokPhysics_es.js` when using the `module` script.

> ⚠️ WARNING: The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN.

The NPM package contains the same two flavors as the CDN: an es-modules version and a UMD version for common.js and AMD projects. Your bundler will select the right file for you.

The engine requires initialization in order to be used in Babylon.js. This is done by calling the function returned by the package or the online version.This function initializes the wasm file and returns an object which can be used to initialize the Babylon's Havok plugin.

### Using the npm package

To use the npm package, install the havok package to your project:

```bash
npm install @babylonjs/havok
```

Then, import the package and call the function returned by the package:

```javascript
import HavokPhysics from "@babylonjs/havok";

async function getInitializedHavok() {
  return await HavokPhysics();
}
```

A different way to use the imported package would be to call the function returned by the package directly:

```javascript
import HavokPhysics from "@babylonjs/havok";
let initializedHavok;

HavokPhysics().then((havok) => {
  initializedHavok = havok;
});
```

### Using the CDN

The main different between the CDN and the npm package is the way the HavokPhysics object becomes available in your browser.
Whereas using npm you need to import/require the package, using the CDN you get the object directly from the global scope.

> ⚠️ WARNING: The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN.

```html
<script src="https://cdn.babylonjs.com/havok/HavokPhysics_umd.js"></script>
<script>
  // before initializing your babylon scene:
  let havokInstance;
  HavokPhysics().then((havok) => {
    // Havok is now available
    havokInstance = havok;
  });

  // later in code you can use havokInstance to initialize the plugin
</script>
```

A way to use the CDN without polluting the global scope is to use the `module` script:

```html
<script type="module">
  import HavokPhysics from "https://cdn.babylonjs.com/havok/HavokPhysics_es.js";
  let havokInstance;
  HavokPhysics().then((havok) => {
    // Havok is now available
    havokInstance = havok;
  });

  // later in code you can use havokInstance to initialize the plugin
</script>
```

## The Babylon Havok plugin

When the havok instance is generated and available you can use it to initialize the Babylon Havok plugin.

An example of initializing the plugin:

```javascript
// Assuming HavokPhysics is available, whether by importing or by using the CDN

async function createScene() {
  // generate your scene, do your magic!

  // initialize the plugin using the HavokPlugin constructor
  const havokInstance = await HavokPhysics();
  const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);
}
```

You are now ready to use the Havok plugin in your Babylon.js scene.

### The HK global variable

To simplify the initialization process of the plugin, the Havok plugin will look in the `HK` global variable for an initialized Havok instance. If it is available, it will use it to initialize the plugin. If it is not available, it will use the Havok instance passed to the constructor.

This code will work (assuming the UMD version was loaded in the browser):

```javascript
globalThis.HK = await HavokPhysics();
```

This is the way we are using Havok in our playgrounds.
However, **the recommended way** for a project you fully control is not to pollute the global namespace and to **pass the havok instance to the plugin**.

### Example using npm

A working example using NPM and ES modules can be found in the [Babylon.js template repository](https://github.com/RaananW/babylonjs-webpack-es6/blob/master/src/scenes/physicsWithHavok.ts)
Note that the engine initialization is happening in a different file (https://github.com/RaananW/babylonjs-webpack-es6/blob/master/src/externals/havok.ts), but it is, nonetheless, the same architecture.

### Full in-browser example using the UMD version

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>Babylon.js using Havok</title>

    <!-- Babylon.js -->
    <script src="https://cdn.babylonjs.com/havok/HavokPhysics_umd.js"></script>
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <script src="https://cdn.babylonjs.com/gui/babylon.gui.min.js"></script>

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

      #canvasZone {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="canvasZone"><canvas id="renderCanvas"></canvas></div>
    <script>
      const canvas = document.getElementById("renderCanvas");
      const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
      const createScene = async function () {
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
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

        // Move the sphere upward at 4 units
        sphere.position.y = 4;

        // Our built-in 'ground' shape.
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

        // initialize plugin
        const havokInstance = await HavokPhysics();
        // pass the engine to the plugin
        const hk = new BABYLON.HavokPlugin(true, havokInstance);
        // enable physics in the scene with a gravity
        scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);

        // Create a sphere shape and the associated body. Size will be determined automatically.
        const sphereAggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);

        // Create a static box shape.
        const groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

        return scene;
      };

      createScene().then((scene) => {
        engine.runRenderLoop(function () {
          if (scene) {
            scene.render();
          }
        });
      });
      // Resize
      window.addEventListener("resize", function () {
        engine.resize();
      });
    </script>
  </body>
</html>
```
