---
title: NPM Support
image: 
description: Learn about Babylon.js's use of the NPM Package Manager.
keywords: diving deeper, contribution, contribute, open-source, oss, NPM
further-reading:
    - title: How To Get Babylon.js
      url: /setup/frameworkPackages/frameworkVers
    - title: ESNext Support
      url: /setup/frameworkPackages/es6Support
video-overview:
video-content:
---

## Introduction

The NPM package manager is one of the best ways to define and organize your project's dependencies. Unlike traditional JavaScript development, which includes a script in an HTML `<script>` tag, using npm packages lets you use tools like Webpack or Browserify to bundle your project and deliver it continuously.

We now officially support our npm packages and will continue updating the npm repository with new versions as they are developed. The first supported version is 3.1.0-alpha3.4.

All examples in this tutorial use CommonJS / ES6 imports. However, since we use [UMD](https://github.com/umdjs/umd), the same files used in our npm packages can also be used with AMD imports or simply included in an HTML script tag.

## Available packages

We offer the babylon.js core and its modules as npm packages. The following are available:

* [babylonjs](https://www.npmjs.com/package/babylonjs) - Babylon's core.
* [babylonjs-materials](https://www.npmjs.com/package/babylonjs-materials) - a collection of Babylon-supported advanced materials.
* [babylonjs-loaders](https://www.npmjs.com/package/babylonjs-loaders) -  All of Babylon's official loaders (OBJ, STL, glTF)
* [babylonjs-post-process](https://www.npmjs.com/package/babylonjs-post-process) - Babylon's post processes.
* [babylonjs-procedural-textures](https://www.npmjs.com/package/babylonjs-procedural-textures) - Officially supported procedural textures
* [babylonjs-serializers](https://www.npmjs.com/package/babylonjs-serializers) - Scene / mesh serializers.
* [babylonjs-gui](https://www.npmjs.com/package/babylonjs-gui) - Babylon.js GUI module.
* [babylonjs-viewer](https://www.npmjs.com/package/babylonjs-viewer) - The stand-alone Babylon.js Viewer.

## Basic usage

Babylon's core and modules take care of setting the dependencies between themselves, so the developer simply needs to import or require them to get everything working.

### Installing Babylon.js

To install the latest Babylon version, use:

```bash
npm install --save babylonjs
```

This installs Babylon.js JavaScript files and also includes a TypeScript declaration file.

To include Babylon in a JavaScript or TypeScript file, use:

```javascript
import * as BABYLON from 'babylonjs';
```

You can also load specific classes if you need them:

```javascript
import { Engine, Scene } from 'babylonjs';
```

**NOTE:** If you can't get this import method to work, go to the section on TypeScript and webpack below.

### Installing other Babylon modules

After including babylonjs you can add Babylon's extra modules using npm as follows:

```bash
npm install --save babylonjs-materials [other packages]
```

Like `babylonjs`, this installs the default minified and non-minified JavaScript files, along with a declaration file.

To import the dependencies, you will need to import them like for the babylon module:

```javascript
import * as Materials from 'babylonjs-materials';
```

And use it like below:

```javascript
let skyMaterial = new Materials.SkyMaterial(.....)
```

### Using require()

If you prefer not to use ES6 import syntax, you can use `require` to import Babylon into your project:

```javascript
let BABYLON = require('babylonjs');
let GUI = require('babylonjs-gui');
let materials = require('babylonjs-materials');
```

## TypeScript support

Being written in TypeScript, Babylon.js will always support TypeScript developers. We provide a declaration file in each package, that either extends the BABYLON namespace or declares a new namespace that can be used during development.

If not detected by your IDE (mostly in case you are not relying on import/export), the most important thing to get full TypeScript support in your project is to add the imported packages as types of compilerOptions in [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) as follows:

```javascript
{
    "compilerOptions": {
        .....,
        "types": [
            "babylonjs",
            "babylonjs-gui",
            "babylonjs-materials"
        ],
        ...
    },
    ...
}

```

This loads the `BABYLON` namespace and enables autocomplete and type safety.

**NOTE:** to generate a default `tsconfig.json` file that contains useful information about the different settings, run the following in your terminal:
```
tsc --init
```

### Example using webpack

A very simple webpack configuration for compiling a Babylon.js TypeScript project can look like this:

```javascript
module.exports = {
    entry: {
        app: './mygame.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [

    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
}
```

Simply create a file named `webpack.config.js` at the root of your project and copy the template above into it.
The file `mygame.ts` should be the entry point of the project.

**NOTE:** Make sure you've installed the following packages:
```
npm install --save-dev webpack
npm install --save-dev webpack-cli
npm install --save-dev typescript
npm install --save-dev ts-loader
```


## ES6
If you want to benefit from tree shaking and other details, you can use our Babylon.js ES6 packages:

* [@babylonjs/core](https://www.npmjs.com/package/@babylonjs/core) - Babylon's core.
* [@babylonjs/materials](https://www.npmjs.com/package/@babylonjs/materials) - a collection of Babylon-supported advanced materials.
* [@babylonjs/loaders](https://www.npmjs.com/package/@babylonjs/loaders) -  All of Babylon's official loaders (OBJ, STL, glTF)
* [@babylonjs/post-processes](https://www.npmjs.com/package/@babylonjs/post-processes) - Babylon's post processes.
* [@babylonjs/procedural-textures](https://www.npmjs.com/package/@babylonjs/procedural-textures) - Officially supported procedural textures
* [@babylonjs/serializers](https://www.npmjs.com/package/@babylonjs/serializers) - Scene / mesh serializers.
* [@babylonjs/gui](https://www.npmjs.com/package/@babylonjs/gui) - Babylon.js GUI module.
* [@babylonjs/inspector](https://www.npmjs.com/package/@babylonjs/inspector) - The Babylon.js Inspector for ES6.

Please note that you cannot mix ES6 and our legacy packages.

```javascript
import { Engine } from '@babylonjs/core/Engines/engine'

const canvas = document.getElementById("canvas");

const engine = new Engine(canvas, true);

// code continues....
```

For more information, you can have a look at [the ES6 documentation](/setup/frameworkPackages/es6Support);

## External libraries

### Pre 3.2.0-beta.1

Cannon and Oimo (both physics engines) are being delivered as dependencies when installing babylonjs using npm. There is no need to install them on your own.

### Current version

Cannon and Oimo are both optional dependencies. If you want to use any of them, please install them yourself.

### Using the optional dependencies with AMD

If you want to use Oimo, for example, install it using npm:

```shell
npm install oimo
```

This allows our UMD definition to find Oimo in `node_modules` and use it. If you use AMD, you first need to declare Oimo as a module, because Oimo uses an anonymous AMD definition:

```javascript
define('oimo', ['path/to/oimo'], function(OIMO) {
    return OIMO;
})
```

Babylon will now automatically find Oimo and inject it.

### Using Webpack

To use either oimo or cannon, install them using npm. Our UMD definition will find them and inject them automatically.

If you use CommonJS and webpack and do not install Cannon or Oimo, you might see a warning saying that those dependencies could not be found. To fix that, use webpack's `externals` feature.

In `webpack.config.js` add:

```javascript
    ...,
    externals: {
        oimo: 'OIMO', //or true
        cannon: 'CANNON' //or true
    },
    ...
```

This will define both of those dependencies as external dependencies and will not load them anymore.

You can see an example of that in the Viewer directory of our main repository.

## Questions and Troubleshooting

### Error TS2307: Cannot find module 'babylonjs' (or other modules)

* Make sure you have a version later than 3.1.0-alpha3.4
* Make sure you added 'babylonjs' to "types" in tsconfig.json

### Even though I use only a few classes from the BABYLON namespace, the entire Babylon module is included

Due to the way Babylon.js is built, tree shaking is currently not very effective. Babylon's internal objects have deep connections with one another for performance reasons. That means your built JS file will be at least the size of Babylon.js minified.

You can still use custom builds to create your own minimal version: //doc.babylonjs.com/how_to/how_to_start#custom-builds

### Naming is different than what the documentation states

Our documentation always refers to the BABYLON namespace. We therefore always use this namespace when talking about objects/classes, and also use this namespace when talking about the GUI.

When using ES6 imports or `require`, you are responsible for setting the namespace to suit your needs. Pay attention when changing it and when copying code from the Playground.

## Example of a webpack project using Babylon modules

Let's look at an example of how to set up a Babylon project written in TypeScript and bundled with webpack.

I will be using webpack 4, but the same setup will work with the previous version of webpack.

### Setting up the project

We will use npm to install dependencies. First, run `npm init` to generate `package.json`. You can generate `package.json` in any other way you prefer.

After `package.json` has been generated, install the required dev dependencies:

```bash
npm install --save-dev typescript webpack ts-loader webpack-cli
```

Now we need to configure webpack so it knows what to do. Here is a simple example of the `webpack.config.js` file:

```javascript
const path = require("path");

module.exports = {
    entry: './index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    mode: "development"
};
```

We will also add `tsconfig.json`:

```javascript
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "noResolve": false,
        "noImplicitAny": false,
        "removeComments": true,
        "preserveConstEnums": true,
        "sourceMap": true,
        "experimentalDecorators": true,
        "isolatedModules": false,
        "lib": [
            "dom",
            "es2015.promise",
            "es5"
        ],
        "declaration": true,
        "outDir": "./"
    },
    "files": [
        "./index.ts"
    ]
}
```

We will also add an HTML file with a canvas (`index.html`):

```html
<!DOCTYPE html>
<html>

    <head>
        <style>
            html,
            body {
                overflow: hidden;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                text-align: center;
            }

            #renderCanvas {
                width: 100%;
                height: 100%;
                touch-action: none;
            }
        </style>
    </head>

    <body>
        <canvas id="renderCanvas"></canvas>
        <script src="dist/index.js"></script>
    </body>

</html>
```

After adding a new file called `index.ts`, we are ready to start developing.

### Adding Babylon support

We will start a simple project with the Babylon core module, the loaders, and the GUI.

First, let's install Babylon's dependencies:

```bash
npm install --save babylonjs babylonjs-loaders babylonjs-gui
```

This will install the latest stable version of Babylon. To install the latest preview version, use the preview stream:

```bash
npm install --save babylonjs@preview babylonjs-loaders@preview babylonjs-gui@preview
```

### Writing some code

Our `index.ts` will display a sphere for now. The code will be very similar to the Playground, but you can structure your code however you like:

```javascript
var canvas: any = document.getElementById("renderCanvas");
var engine: Engine = new Engine(canvas, true);

function createScene(): Scene {
    var scene: Scene = new Scene(engine);

    var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    return scene;
}

var scene: Scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});
```

You will notice that the `BABYLON` namespace is gone and that you will see many errors if you actually use this file. This is because we haven't yet imported the required dependencies from `babylonjs`.

We will use ES6 imports for that. To add the dependencies, we have two options. The first is to define the `BABYLON` namespace:

```javascript
import * as BABYLON from 'babylonjs';
```

This will actually bring back the BABYLON namespace. My preferred option is only loading the dependencies you need:

```javascript
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh } from "babylonjs";
```

Adding this line to the beginning of the file will load all needed dependencies to your project and will eliminate all errors.

### Bundling the project

Compiling index.ts using tsc will work. But it will generate a file that is unusable without babylonjs itself. To get a bundled file we will run webpack. Again, two ways for that:

```bash
./node_modules/.bin/webpack
```

Or creating a build task in package.json:

```javascript
    "scripts": {
        "build": "webpack"
    },
```

Then run:

```bash
npm run build
```

We will now have an `index.js` file in the `dist` folder that we can use in our _index.html_.

You will notice there are a few warnings about dependencies. We will deal with that later.

### Checking your project

The best option during development is the webpack dev server (https://github.com/webpack/webpack-dev-server/), but it is outside the scope of this tutorial.

To check the current project, I use the `http-server` npm module, installed globally. You can use any web server that serves the root folder of your project.

If you open our _index.html_, you will see a sphere. Hooray!

### Adding the GUI

For the sake of learning, we will add a new file, `gui.ts`, even though this could still be done in a single TypeScript file. Our `gui.ts` file will look like this:

```javascript
import { AbstractMesh } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle, Control, TextBlock } from "babylonjs-gui";

let advancedTexture: AdvancedDynamicTexture;

function init(): void {
    if (!advancedTexture) {
        advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("ui1");
    }
}

export function addLabelToMesh(mesh: AbstractMesh): void {
    if (!advancedTexture) {
        init();
    }
    let label: Rectangle = new Rectangle("label for " + mesh.name);
    label.background = "black";
    label.height = "30px";
    label.alpha = 0.5;
    label.width = "100px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = 30;
    label.top = "10%";
    label.zIndex = 5;
    label.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(label);

    const text1: TextBlock = new TextBlock();
    text1.text = mesh.name;
    text1.color = "white";
    label.addControl(text1);
}
```

In our `index.ts`, we will import the function and use it in `createScene`:

```javascript
import { addLabelToMesh } from "./gui";
```

The `createScene` function now looks like this:

```javascript
function createScene(): Scene {
    var scene: Scene = new Scene(engine);

    var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    addLabelToMesh(sphere);

    return scene;
}
```

If we compile now with webpack, our GUI element will appear in the scene.

### Eliminating the dependencies warnings

Babylon uses Oimo, Cannon, and Earcut as external, optional dependencies. If you don't use them, you can define them as externals in your webpack configuration to avoid the warnings:

```javascript
    externals: {
        "oimo": true,
        "cannon": true,
        "earcut": true
    },
```
