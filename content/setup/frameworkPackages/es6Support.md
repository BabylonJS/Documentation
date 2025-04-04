---
title: Babylon.js ES6 support with Tree Shaking
image:
description: Learn about tree shaking and package management in Babylon.js.
keywords: diving deeper, contribution, contribute, open-source, oss, tree-shaking, packages
further-reading:
  - title: How To Get Babylon.js
    url: /setup/frameworkPackages/frameworkVers
  - title: NPM Support
    url: /setup/frameworkPackages/npmSupport
video-overview:
video-content:
---

## Introduction

The NPM package manager is one of the best ways to define and organize your project's dependencies. Parallel to traditional javascript development (including a script in a 'script' HTML Tag), using npm packages allows you to use tools like Webpack or Browserify to pack your project and (continuously) deliver it.

We now officially support our npm ES6 packages and will continue updating the npm's repository with new versions as they are being developed.

Please note that by using ES6 packages, you will need to rely on extra tooling to bundle and test your library but on the bright side you will be able to tree shake your application and reduce its final size.

All the babylon ES6 packages are available within the npm scope @babylonjs.

## Available packages

We offer babylon.js' core and its modules as npm packages. The following are available:

- [@babylonjs/core](https://www.npmjs.com/package/@babylonjs/core) - Babylon's core.
- [@babylonjs/materials](https://www.npmjs.com/package/@babylonjs/materials) - A collection of Babylon-supported advanced materials.
- [@babylonjs/loaders](https://www.npmjs.com/package/@babylonjs/loaders) - All of Babylon's official loaders (OBJ, STL, glTF).
- [@babylonjs/post-processes](https://www.npmjs.com/package/@babylonjs/post-processes) - Babylon's post processes.
- [@babylonjs/procedural-textures](https://www.npmjs.com/package/@babylonjs/procedural-textures) - Officially supported procedural textures.
- [@babylonjs/serializers](https://www.npmjs.com/package/@babylonjs/serializers) - Scene / mesh serializers.
- [@babylonjs/gui](https://www.npmjs.com/package/@babylonjs/gui) - Babylon.js GUI module.
- [@babylonjs/viewer](https://www.npmjs.com/package/@babylonjs/viewer) - The stand-alone Babylon.js Viewer.
- [@babylonjs/inspector](https://www.npmjs.com/package/@babylonjs/inspector) - The Babylon.js Inspector for visual debugging.
- [@babylonjs/ktx2decoder](https://www.npmjs.com/package/@babylonjs/ktx2decoder) - Babylon's KTX2 Decoder module.

## Basic Example

A boilerplate project with a few examples on how to use the ES6 modules can be found here - [Babylon.js, Webpack and ES6 modules](https://github.com/RaananW/babylonjs-webpack-es6) on GitHub. It is a project skeleton, based on TypeScript, Webpack and our ES6 modules. The different scenes (Asset loading, physics, simple scene) to show the different aspects of module-loading and Babylon.js.

## Basic usage

As the ES6 version is composed of many separated files the usual way to consume such packages is through Webpack or other bundlers. The following examples will be done with Webpack but you could rely on any of the tools you are familiar with.

### Application Creation Summary

1. Create new folder **MyAwesomeApp**
2. Open **GitBash** (or similar) for **MyAwesomeApp**
3. Run `npm init`
4. Run `npm install webpack webpack-cli webpack-dev-server --save-dev`
5. Run `npm install @babylonjs/core @babylonjs/materials`
6. Create Folder **public** in MyAwesomeApp and create **index.html** file in public as described in First App Section below
7. Create Folder **src** in **MyAwesomeApp**
8. Create **index.js** file in **src** as described in `First App Section` below
9. Run `npx webpack serve` to check result in `http://localhost:8080/`
10. Run `npx webpack` to create dist folder

Read all the following sections for full description.

### Using Webpack

First create a new folder where you will develop your app: `mkdir MyAwesomeApp` .

Then navigate to the folder `cd MyAwesomeApp` and initializes npm with the command `npm init` . Simply fill out the requested question or leave default if you prefer.

You can then install Webpack like this: `` `npm install webpack webpack-cli webpack-dev-server --save-dev` ``. This will also install a local dev server pretty handy to develop locally.

Following the default Webpack convention, you do not even need a configuration file.

### Installing Babylon.js

To install the latest babylon ES6 version use:

```bash
npm install @babylonjs/core
```

This will install babylonjs' javascript files and will also include a TypeScript declaration file.

To include the whole of Babylon in a javascript or typescript file, use:

```javascript
import * as BABYLON from "@babylonjs/core/Legacy/legacy.js";
```

This will work exactly like the none ES6 version and the entire library will be included as a dependency.

You can also load specific classes to help with your code:

```javascript
import { Engine, Scene } from "@babylonjs/core";
```

**NOTE:** Some of the modules working through side effects you might need to `` `import "@babylonjs/core/Meshes/meshBuilder.js"` `` for side effects only in order to rely on any of the Mesh creation static methods like `` `MeshBuilder.CreateBox` `` for instance. This was the best way to deliver our ES6 version without breaking backward compatibility of the bundled version.

### Installing other Babylon modules

After including `` `@babylonjs/core` `` you can add Babylon's extra modules using npm as follows:

```bash
npm install --save-dev @babylonjs/materials [other packages]
```

Same as the babylonjs, this will install the javascript files and a declaration file.

To import the dependencies, you simply need to import the library (without giving it a namespace):

```javascript
import {
    GridMaterial
} from '@babylonjs/materials';

let gridMaterial = new GridMaterial(.....)
```

### Creating our first js APP

Now we have all the dependencies created, create an _index.html_ file in the public folder and fill it with the following code:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Local Development</title>

    <script src="https://code.jquery.com/pep/0.4.2/pep.min.js"></script>

    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        overflow: hidden;
      }

      #renderCanvas {
        width: 100%;
        height: 100%;
        display: block;
        font-size: 0;
      }
    </style>
  </head>

  <body>
    <canvas id="renderCanvas" touch-action="none"></canvas>

    <script src="main.js"></script>
  </body>
</html>
```

This will only have a fullscreen canvas as well as a reference to our application file (by default webpack output during development is "main.js");

Once done you can create a `src` folder containing an index.js file with the following content:

```javascript
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder.js";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder.js";
import { Scene } from "@babylonjs/core/scene.js";

import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial.js";

// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas");

// Associate a Babylon Engine to it.
const engine = new Engine(canvas);

// Create our first scene.
const scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Create a grid material
const material = new GridMaterial("grid", scene);

// Our built-in 'sphere' shape.
const sphere = CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 2;

// Affect a material
sphere.material = material;

// Our built-in 'ground' shape.
const ground = CreateGround("ground1", { width: 6, height: 6, subdivisions: 2 }, scene);

// Affect a material
ground.material = material;

// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});
```

Finally you can run the local dev environment through the command `npx webpack serve` .

Open the browser and navigate to the url `http://localhost:8080/` . You should see a sphere and a plane using the Grid Material.

To create the distribution folder `dist` use the command `npx webpack`

You may have noticed that we did our imports from files instead of the base modules. This is to ensure we get the full benefit of Tree Shaking. For more information, see the **Side Effects** section below.

## Typescript

Switching the project to typescript is pretty straight forward. First in the previous example `MyAwesomeApp` folder we need to install typescript and one of the module allowing the use of typescript in Webpack: `npm install typescript ts-loader --save-dev`

Once done we can replace our previous index.js by its typescript equivalent index.ts:

```javascript
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder.js";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder.js";
import { Scene } from "@babylonjs/core/scene.js";

import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial.js";

// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Associate a Babylon Engine to it.
const engine = new Engine(canvas);

// Create our first scene.
const scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Create a grid material
const material = new GridMaterial("grid", scene);

// Our built-in 'sphere' shape.
const sphere = CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 2;

// Affect a material
sphere.material = material;

// Our built-in 'ground' shape.
const ground = CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene);

// Affect a material
ground.material = material;

// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});
```

The only change being the addition of `as HTMLCanvasElement` on the canvas element.

With that done we need to configure Webpack to allow the use of Typescript. Add a `webpack.config.js` at the root of your project containing the following:

```javascript
module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
};
```

We also need to configure typescript in the application folder. The simplest is to add a tsconfig.json file at the root of the project containing:

```javascript
{
    "compilerOptions": {
        "module": "esNext",
        "target": "es5",
        "moduleResolution": "node",
    }
}
```

This will ensure our babylonjs module can be loaded and used in your application.

It is time to run again with the command `npx webpack serve` and open your browser on `http://localhost:8080/` . You should see a sphere and a plane using the Grid Material exactly like in javascript. You are now fully ready to use the Babylon.js ES6 packages in Typescript.

As in the **Creating our first js APP** section above, we did our imports from files instead of the base modules. This is to ensure we get the full benefit of Tree Shaking. For more information, see the **Side Effects** section below.

## Tree Shaking

From the beginning you could wonder why using these ES6 packages vs the default bundled ones. Beside being more "modern" which is not a valuable enough argument to make the switch, you can now fully benefit from [tree shaking](https://webpack.js.org/guides/tree-shaking/).

This means the previous example is now requiring about 700Kb vs 2.3Mb before.

**Please note we are continuing to improve our min package size by decoupling a bit more our packages so if you spot any unnecessary dependency, please, do not hesitate to create an issue on [GitHub](https://github.com/BabylonJS/Babylon.js).**

**As you will see in the next paragraph, you also need to target individual files to fully benefit from tree shaking in your app.**

## Side Effects

Due to our attachment to backward compatibility, we had to make a hard choice between the APIs and the side effects. Actually whilst not working with modules, it is easy to not worry about side effects and we relied on this pattern a lot to create a friendlier API surface. For instance, you can directly use the Mesh class to create basic shapes like cubes, spheres and so on. Despite being convenient, this means that the full MeshBuilder constructs are then a dependency of Mesh. But what if you are not using any of them? Why should they be part of the final package?

Easy call, we could move those functions elsewhere and we did exactly this by creating smaller builder modules dedicated to construct only one type of shapes. But now quid of back compat? Yup, it is lost so to ensure you could use the same code in both UMD bundle and ES6, when the builder files are being parsed, they are swapping the MeshBuilder methods. This implies a **side effect** A module executing code whilst being parsed. This is the tradeoff we had to make, valuing back compatibility and API consistency vs side effect free code.

As a result, it is impossible for Webpack and the other bundlers to determine if imports are safe to be removed when not used so if you import directly from index, all the imports will be followed and included in your packages.

The treatment even if a bit annoying is simple: you need to import manually only from the modules you need. This will force you to target your imports on the dedicated modules (vs index ones) if you want to fully benefit from tree shaking. The folder structure should be natural enough and in case you are finding some modules in not intuitive locations, do not hesitate to file an issue on [GitHub](https://github.com/BabylonJS/Babylon.js) and we will be more than happy to document it here.

### FAQ

_How do I efficiently use the `Mesh.Create...` methods?_

The simplest is to load only the builder corresponding to your construction method. If you wish to use the `CreateBox` method, you can simply `import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder.js";` to ensure that the dependant modules have been loaded.**Except if you are relying on all the MeshBuilder methods, we would recommend to not use it directly but favor the smaller builders**.

_Why using the default material is not working?_
By default, any mesh in a scene are using the scene defaultMaterial. With tree shaking you might not need this material so we do not force it as a dependency in the code. That said, would you need to use it, you can simply `` `import "@babylonjs/core/Materials/standardMaterial.js";` `` to ensure that the default material would be operational.

_How does deserialization work?_

When you deserialize a Babylon.js object like a Material or Light, it is impossible for the framework to know beforehand what kind of entity is enclosed in your file. For instance, are you relying on Standard vs PBRMaterial. We again rely on side effect here and the deserialization will only be able to load the kind of entity you have imported in your app. This means if you know you will need to deserialize a PBRMaterial, you can `import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial.js";` beforehand.

_How do I know if I am importing a folder or a file?_

By convention and to simplify the discovery, all folders starts with an upper case character where the files start with a lower case one.

_How to find what module contains the entity I am trying to import?_

This is actually a pretty good question. It should be intuitive enough and if not, do not hesitate to ping us so we can add it to the documentation.

_The intellisense does not propose the method I normally use in the bundled version and an undefined error is raised at runtime?_

Your IDE may not be able to discover methods defined by module augmentation. This means that as long as you are not importing the parent modules, the methods will not even be discoverable. This is the case for all our scene components. For enabling physics on the scene you need `import "@babylonjs\core\Physics\physicsEngineComponent.js"` to populate the `scene.enablePhysics` function. 

Please find below the list of those components for their augmented methods (note that all imports of files must include the extension):

- scene."animationRelatedMethods" like beginAnimation and so on... " are available in the `Animations/animatable.js` module.
- scene."audioRelatedMethods" are available in the `Audio/audioSceneComponent.js` and `Audio/audioEngine.js` module.
- Octree functions can be found in the `Culling/Octrees/octreeSceneComponent.js` module.
- Ray and Picking functions can be found in the `Culling/ray.js` module.
- Debug Layer functions can be found in the `Debug/debugLayer.js` module.
- Occlusion Queries can be found in the `Engines/Extensions/engine.query.js` module.
- Transform Feedback can be found in the `Engines/Extensions/engine.transformFeedback.js` module.
- Gamepad support can be found in the `Gamepad/gamepadSceneComponent.js` module.
- Scene Helpers like createDefaultCamera, createDefaultXXX can be found in the `Helpers/sceneHelpers.js` module.
- Mesh Simplification functions can be found in the `Meshes/meshSimplicationSceneComponent.js` .
- DDS Loader support can be installed from the `Materials/Textures/Loaders/ddsTextureLoader.js` and you will also need `core/Misc/dds.js` module.
- Env Loader support can be installed from the `Materials/Textures/Loaders/envTextureLoader.js` .
- KTX Loader support can be installed from the `Materials/Textures/Loaders/ktxTextureLoader.js` .
- TGA Loader support can be installed from the `Materials/Textures/Loaders/tgaTextureLoader.js` .
- Particle support can be found in the `Particles/particleSystemComponent.js` .
- For GPUParticleSystem, WebGL2 support can be found in `Particles/webgl2ParticleSystem.js` and WebGPU support in `Particles/computeShaderParticleSystem.js`
- Physics Engine support can be found in the `Physics/physicsEngineComponent.js` .
- .babylon file support can be found in the `Loading/Plugins/babylonFileLoader.js` .
- shadowGenerator support can be found in the `Lights/Shadows/shadowGeneratorSceneComponent.js` .
- depthRendering support can be found in the `Rendering/depthRendererSceneComponent.js` .
- screenshot support can be found in the `Misc/screenshotTools.js` .
- boundingBox support can be found in the `Rendering/boundingBoxRenderer.js` .
- Screen surface reflection postprocess (`scene.enablePrePassRender`) can be found in the `Rendering/prePassRendererSceneComponent.js` .
- Decal Map support is enabled by importing `Materials/material.decalMap.js`. If you only want to enable support at the mesh level and not the material level, use `Meshes/abstractMesh.decalMap.js` instead. See [here](/features/featuresDeepDive/mesh/decals#using-decal-maps-with-es6-and-tree-shaking) for why you want to do this.

_Why do I have a TypeError in the console telling me that something is not a function, even though my IDE shows it via intellisense?_

Some methods are added via module augmentation. While some IDEs cannot detect these methods at all, others – like VSCode – seem to be able to find them even when they are not actually available. You will need to import the correct module to add that method. If your issue is with a missing `scene` method, see the previous question.

_Why do I have an error in the console inviting me to import some other modules?_

This might happen on some modules where we are heavily relying on side effects and where we can automatically detect the none presence of the dependency.

## Almighty Inspector

Due to the modules name changing and other ES6 modules differences, the UMD and CDN inspector version is not compatible with ES6. Nevertheless, you can install the ES6 version of the inspector and import it for side effect only in your code. Then the debug layer would work as usual.

First install the inspector package:

```bash
npm install --save-dev @babylonjs/inspector
```

And then in your code:

```javascript
import "@babylonjs/core/Debug/debugLayer.js"; // Augments the scene with the debug methods
import "@babylonjs/inspector"; // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version
...
scene.debugLayer.show();
```

## Earcut/Oimo/Canon

As we do not want to force by default our user to include any dependencies, we have extended the way users could rely on external dependencies for ES6.

For each of the external dependencies Babylon.js is relying upon, if you are planning on relying on them, you can provide them as global variables in you bundler. For instance if you are willing to use the `PolygonMeshBuilder` class in your app you can add earcut in Webpack like this:

```javascript
module.exports = {
    context: __dirname,
    ...
    plugins: [
        new webpack.ProvidePlugin({
            'earcut': 'earcut'
        })
    ]
}
```

Or if you do not want to use a global var for earcut, you could simply pass the dependency to the PolygonMeshBuilder class like this:

```javascript
import * as MyEarcut from "earcut";
...
new PolygonMeshBuilder("polytri", corners, scene, MyEarcut);
```

It would be the same for physics plugin where you can either provide the underlying engine as a var or inject it in the constructor of the Babylon.js respective plugin.

## Ammo

Exactly like in the previous paragraph, you can inject your ammo dependency into Babylon.js. Either you can keep as a global script reference thus not including the dependency in your bundle or you could follow the following steps to include ammo as part of your bundled application.

First, install ammo.js from its Github build folder (in order to benefit from an up to date version):

```javascript
npm install kripken/ammo.js
```

Then in Webpack, you need to disable the node.js dependencies to generate a successful package (obviously if you are targeting web builds):

```javascript
module.exports = {
  ...
  resolve: {
    fallback: {
      'fs': false,
      'path': false,
    }
  }
}
```

Finally, in your code, you can setup the AmmoJSPlugin this way:

```javascript
import ammo from "ammo.js";
const Ammo = await ammo();
...
const ammoPlugin = new AmmoJSPlugin(true, Ammo);
```

For Webpack versions before 5, you'll instead need:

```javascript
module.exports = {
    context: __dirname,
    ...
    node: {
        fs: 'empty'
    }
}
```

```javascript
import * as ammo from "ammo.js";
const Ammo = await ammo.default();
...
const ammoPlugin = new AmmoJSPlugin(true, Ammo);
```

## Ammo with types enabled

Follow the instructions at https://github.com/giniedp/ammojs-typed.

Import the dependencies:

```javascript
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin.js";
import Ammo from "ammojs-typed";
```

and in your code:

```javascript
const ammo = await Ammo();
scene.enablePhysics(new Vector3(0, -9.81, 0), new AmmoJSPlugin(true, ammo));
```

![](/img/resources/ammo-es6/ammo-es6-typed.png)

## Loaders

In Babylon.js the loaders you can install from `@babylonjs/loaders` are actually plugins of the main `SceneLoader` module. In order to use for instance the obj loader in your app, you simply need to import it for side effects only: `import "@babylonjs/loaders/OBJ.js";` . It would be exactly the same for glTF: `import "@babylonjs/loaders/glTF.js";` .

## KTX2 Decoder packages

The ES6 KTX2 decoder module includes all of the decoders and their corresponding WASM files and wrappers so users can use them locally and deploy them as part of their build. The KTX2 decoder module is available in the npm scope `@babylonjs/ktx2decoder`.

To use the KTX2 decoder module, install it as follows:

```bash
npm install --save-dev @babylonjs/ktx2decoder
```

Then, you need to decide if you want to use workers or decode the KTX2 files on the main thread. The difference is in the way you will initialize the module.

If you want to use workers, you will need to generate the worker file that will be used to decode the textures and pass a worker pool. The example below uses the MSC decoder, but the same process can be used to initialize any other type of decoder.

First let's create a worker file. We will call it worker.js (note - typescript will work the same):

```javascript
// worker.js
import * as KTX2Decoder from "@babylonjs/ktx2decoder";
import { workerFunction } from "@babylonjs/core/Misc/khronosTextureContainer2Worker.js";
import mscTranscoderJsModule from "@babylonjs/ktx2decoder/wasm/msc_basis_transcoder.js";
import { MSCTranscoder as jsMSCTranscoder } from "@babylonjs/ktx2decoder/Transcoders/mscTranscoder.js";
// set the globalThis object to make sure the worker can access the global scope
globalThis.KTX2DECODER = KTX2Decoder;
// set the msc decoder module
jsMSCTranscoder.JSModule = mscTranscoderJsModule;
// Call the worker function, imported from the core module
workerFunction(KTX2Decoder);
```

Then in your main file, you will need to do few things:

1. import the wasm as an arraybuffer
2. Create a worker pool
3. Initialize the worker pool with the worker file
4. Pass the workerpool to the KhronosTextureContainer2 module

```javascript
// mainFile.js
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import wasmMSCTranscoder from "@babylonjs/ktx2decoder/wasm/msc_basis_transcoder.wasm"; // make sure the import is an arraybuffer
import { KhronosTextureContainer2 } from "@babylonjs/core/Misc/khronosTextureContainer2.js";
import { AutoReleaseWorkerPool } from "@babylonjs/core/Misc/workerPool.js";
import { initializeWebWorker } from "@babylonjs/core/Misc/khronosTextureContainer2Worker.js";
import "@babylonjs/core/Materials/Textures/Loaders/ktxTextureLoader.js";

export function initScene(element) {
  const engine = new Engine(element);
  const scene = new Scene(engine);

  // Create a worker pool
  // This will be used when a new KhronosTextureContainer2 is created
  KhronosTextureContainer2.WorkerPool = new AutoReleaseWorkerPool(4, () => {
    // Create a new worker using the worker.js file we have already created
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    // Initialize the worker with the wasm array buffer
    return initializeWebWorker(worker, {
      // pass all arraybuffers here
      wasmMSCTranscoder,
    });
  });

  // decode the texture
  const texture = new Texture(
    "./2d_etc1s.ktx2",
    scene,
    false,
    true,
    Texture.TRILINEAR_SAMPLINGMODE,
    () => {
      console.log(texture);
    },
    (message, exception) => {
      console.error("Can't fetch texture", message, exception);
    },
  );
}
```

### How to get the wasms as arraybuffers

When importing the wasm files, you will need to import them as arraybuffers. As this is non-standard, it depends on your bundler and environment.

When using webpack you can use the arraybuffer-loader. The way to do that is documented here - https://www.npmjs.com/package/arraybuffer-loader#for-wasm-file

When using vite you can use `vite-plugin-arraybuffer`, documented here - https://www.npmjs.com/package/vite-plugin-arraybuffer.

When using node environment, you can just use the fs module to read the file as an arraybuffer.

## Providing your own resources for Draco compression and Basis decoder

We provide the Draco compression and Basis decoder as part of the ES6 `@babylonjs/core` package. As recommended, it is always better to serve those resources from your own server. If you want them to be included as part of your build process, you can do so by providing the resources directly to the modules.

### Draco Decoder packages

Just like with the KTX2 decoder, you need to first decide if you use workers or not. For example, in a node environment you will not be able to use workers, but in a web environment it would be recommended to use them.

If using workers, create a worker file:

```javascript
// worker.js
import { DecoderWorkerFunction } from "@babylonjs/core/Meshes/Compression/dracoCompressionWorker.js";
// will populate globalThis.DracoDecoderModule
import "@babylonjs/core/assets/Draco/draco_decoder_gltf.js";

DecoderWorkerFunction();
```

And then create a worker pool:

```javascript
// mainFile.js
// import the wasm as array buffer. see the KTX2 documentation for hints on how to do that
import wasm from "@babylonjs/core/assets/Draco/draco_decoder_gltf.wasm";
import { AutoReleaseWorkerPool } from "@babylonjs/core/Misc/workerPool.js";
import { DracoDecoder } from "@babylonjs/core/Meshes/Compression/dracoDecoder.js";
import { initializeWebWorker } from "@babylonjs/core/Meshes/Compression/dracoCompressionWorker.js";
import { Tools } from "@babylonjs/core/Misc/tools.js";
import { VertexBuffer } from "@babylonjs/core/Meshes/buffer.js";

const workerPool = new AutoReleaseWorkerPool(4, () => {
  const worker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
  });
  return initializeWebWorker(worker, wasm);
});

// set the worker pool
DracoDecoder.DefaultConfiguration.workerPool = workerPool;

// if you are creating your own version of the draco decoder class you can pass the worker pool in the constructor instead:

const dracoDecoder = new DracoDecoder({
  workerPool,
});
```

If you are not using workers, you will need to pass the wasm file and its js module directly to the draco decoder configuration:

```javascript
// import the wasm file as an arraybuffer
import wasm from "@babylonjs/core/assets/Draco/draco_decoder_gltf.wasm";
// import the js module
import "@babylonjs/core/assets/Draco/draco_decoder_gltf.js";
DracoDecoder.DefaultConfiguration.wasmBinary = wasm;
DracoDecoder.DefaultConfiguration.jsModule = globalThis.DracoDecoderModule;
```

#### Using Draco in node environment

To use the draco decoder in nodejs to decode your own file:

```javascript
const BABYLON = require("babylonjs");
const fs = require("fs");
const xhr = require("xhr2");
require("babylonjs-loaders");

// get the resources from the local disk. Note - the resources need to be downloaded manually.
const Draco = require("./assets/draco_decoder_gltf.js");
const wasm = fs.readFileSync(process.cwd() + "/assets/draco_decoder_gltf.wasm");

BABYLON.DracoDecoder.DefaultConfiguration.wasmBinary = wasm;
BABYLON.DracoDecoder.DefaultConfiguration.jsModule = Draco;

globalThis.XMLHttpRequest = xhr.XMLHttpRequest;
let engine = new BABYLON.NullEngine();
// create your scene here
const scene = .....;

BABYLON.ImportMeshAsync("https://awesomeserver.mine.com/my.glb", scene).then(() => {  
    console.log("draco worked");
  }, (e) => {
    console.log("oh no! something is off", e);
  }
);
```

### Basis Decoder

The basis decoder doesn't use a worker pool, but does have a worker that can be initialized.

To use the basis decoder in your app, you will need to initialize the worker:

```javascript
// worker.js
import { workerFunction } from "@babylonjs/core/Misc/basisWorker.js";
import "@babylonjs/core/assets/Basis/basis_transcoder.js";

workerFunction();
```

Now initialize the webworker on the main thread, and set this worker for basis decoding:

```javascript
// mainFile.js
import wasm from "@babylonjs/core/assets/Basis/basis_transcoder.wasm";
import { initializeWebWorker } from "@babylonjs/core/Misc/basisWorker.js";
import { SetBasisTranscoderWorker } from "@babylonjs/core/Misc/basis.js";

const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});
initializeWebWorker(worker, wasm);

SetBasisTranscoderWorker(worker);
```

## Avoiding side-effects

Starting with Babylon.js v7.23, we are introducing a new way for ES6 users to import optional features without side effects.
Depending on how the internal engine works, we have aimed to reduce the number of functions that need to be added at the prototype level. Instead, when possible, we are offering more 'pick and choose' public functions.

### Animations

- File to import: "core/Animations/animatable.core" (instead of "core/Animations/animatable" which has side-effects)
- Function to import and execute to initialize the module: `AddAnimationExtensions(sceneClass, boneClass)`
- Calling `AddAnimationExtensions` will populate the following prootype functions:
  - Bone.prototype.copyAnimationRange
  - Scene.prototype.beginAnimation
  - Scene.prototype.beginDirectAnimation
  - Scene.prototype.beginDirectHierarchyAnimation
  - Scene.prototype.beginWeightedAnimation
  - Scene.prototype.beginHierarchyAnimation
  - Scene.prototype.getAllAnimatablesByTarget
  - Scene.prototype.getAnimatableByTarget
  - Scene.prototype.sortActiveAnimatables
  - Scene.prototype.stopAllAnimations

### Ray

- File to import: "core/Culling/ray.core" (instead of "core/Culling/ray" which has side-effects)
- Function to import and execute to initialize the module: `AddRayExtensions(sceneClass, cameraClass)`
- Calling `AddRayExtensions` will populate the following prootype functions:
  - Camera.prototype.getForwardRay
  - Camera.prototype.getForwardRayToRef
  - Scene.prototype.createPickingRay
- The following functions will be available:
  - CreatePickingRay
  - CreatePickingRayToRef
  - CreatePickingRayInCameraSpace
  - CreatePickingRayInCameraSpaceToRef
  - Pick
  - PickWithRay
  - PickWithBoundingInfo
  - MultiPick
  - MultiPickWithRay
