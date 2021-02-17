---
title: NPM Support
image: 
description: Learn about Babylon.js's use of the NPM Package Manager.
keywords: welcome, babylon.js, diving deeper, contribution, contribute, open-source, oss, NPM
further-reading:
    - title: How To Get Babylon.js
      url: /divingDeeper/developWithBjs/frameworkVers
    - title: ESNext Support
      url: /divingDeeper/developWithBjs/treeShaking
video-overview:
video-content:
---

## Introduction

The NPM package manager is one of the best way to define and organize your project's dependencies. Parallel to traditional javascript development (including a script in a 'script' HTML Tag), using npm packages allows you to use tools like Webpack or Browserify to pack your project and (continuously) deliver it.

We now officially support our npm packages and will continue updating the npm's repository with new versions as they being developed. The first supported version is 3.1.0-alpha3.4

All examples in this tutorial will use commonjs / es6 imports. However, since we are using [UMD](https://github.com/umdjs/umd), the same files being used in our npm packages can also be used with AMD-imports and can also be simply included in an HTML script tag.

## Available packages

We offer babaylon.js' core and its modules as npm packages. The following are available:

* [babylonjs](https://www.npmjs.com/package/babylonjs) - Babylon's core.
* [babylonjs-materials](https://www.npmjs.com/package/babylonjs-materials) - a collection of Babylon-supported advanced materials.
* [babylonjs-loaders](https://www.npmjs.com/package/babylonjs-loaders) -  All of Babylon's official loaders (OBJ, STL, glTF)
* [babylonjs-post-process](https://www.npmjs.com/package/babylonjs-post-process) - Babylon's post processes.
* [babylonjs-procedural-textures](https://www.npmjs.com/package/babylonjs-procedural-textures) - Officially supported procedural textures
* [babylonjs-serializers](https://www.npmjs.com/package/babylonjs-serializers) - Scene / mesh serializers.
* [babylonjs-gui](https://www.npmjs.com/package/babylonjs-gui) -Babylon.js GUI module.
* [babylonjs-viewer](https://www.npmjs.com/package/babylonjs-viewer) - The stand-aloneBabylon.js Viewer.

## Basic usage

Babylon's core and modules take care of setting the dependencies between themselves, so the developer simply needs to import or require them to get everything working.

### Installing Babylon.js

To install the latest babylon version use:

```bash
npm install --save babylonjs
```

This will install babylonjs' javascript files and will also include a TypeScript declaration file.

To include Babylon in a javascript or typescript file, use:

```javascript
import * as BABYLON from 'babylonjs';
```

You can also load specific classes if you need them:

```javascript
import { Engine, Scene } from 'babylonjs';
```

**NOTE:** if you can't make this import method to work, go to the section on typescript and webpack below.

### Installing other Babylon modules

After including babylonjs you can add Babylon's extra modules using npm as follows:

```bash
npm install --save babylonjs-materials [other packages]
```

Same as the babylonjs, this will install (default-minified and non-minified) javascript files and a declaration file.

To import the dependencies, you will need to import them like for the babylon module:

```javascript
import * as Materials from 'babylonjs-materials';
```

And use it like below:

```javascript
let skyMaterial = new Materials.SkyMaterial(.....)
```

### using require()

If you prefer not to use es6-import syntax, you can use require in order to import babylon into your project:

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

This will load BABYLON's namespace and will allow autocomplete (and of course type safety) correctly.

**NOTE:** to generate a default `tsconfig.json` file that contains useful information about the different settings, run the following in your terminal:
```
tsc --init
```

### Example using webpack

A very simple webpack configuration to compile a babylon.js TypeScript project can look like this:

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

Simply create a file `webpack.config.js` at the root of your project and copy-paste the above template in it.
The file `mygame.ts` should the entry point of the project.

**NOTE:** Make sure you've installed the following packages:
```
npm install --save-dev webpack
npm install --save-dev webpack-cli
npm install --save-dev typescript
npm install --save-dev ts-loader
```


## ES6
If you wish to benefit from tree shaking and other nitty gritties, you can now rely on our Babylon.js ES6 packages:

* [@babylonjs/core](https://www.npmjs.com/package/@babylonjs/core) - Babylon's core.
* [@babylonjs/materials](https://www.npmjs.com/package/@babylonjs/materials) - a collection of Babylon-supported advanced materials.
* [@babylonjs/loaders](https://www.npmjs.com/package/@babylonjs/loaders) -  All of Babylon's official loaders (OBJ, STL, glTF)
* [@babylonjs/post-processes](https://www.npmjs.com/package/@babylonjs/post-processes) - Babylon's post processes.
* [@babylonjs/procedural-textures](https://www.npmjs.com/package/@babylonjs/procedural-textures) - Officially supported procedural textures
* [@babylonjs/serializers](https://www.npmjs.com/package/@babylonjs/serializers) - Scene / mesh serializers.
* [@babylonjs/gui](https://www.npmjs.com/package/@babylonjs/gui) -Babylon.js GUI module.
* [@babylonjs/inspector](https://www.npmjs.com/package/@babylonjs/inspector) - TheBabylon.js Inspector for es 6.

Please note that you can not mix ES6 and our legacy packages.

```javascript
import { Engine } from '@babylonjs/core/Engines/engine'

const canvas = document.getElementById("canvas");

const engine = new Engine(canvas, true);

// code continues....
```

For more information, you can have a look at [the ES6 documentation](/divingDeeper/developWithBjs/treeShaking);

## External libraries

### Pre 3.2.0-beta.1

Cannon and Oimo (both physics engines) are being delivered as dependencies when installing babylonjs using npm. There is no need to install them on your own.

### Current version

Cannon and Oimo are both optional dependencies. If you want to use any of them, please install them yourself.

### using the optional dependencies with AMD

If you wish to use oimo for example, install Oimo using npm:

```shell
npm install oimo
```

This will allow our UMD definition to find oimo in node_modules and use it. If you use AMD you will need to first declare oimo as a module (as oimo uses anonymous AMD definition):

```javascript
define('oimo', ['path/to/oimo'], function(OIMO) {
    return OIMO;
})
```

Now Babylon will automatically find oimo and will inject it.

### Using Webpack

To use either oimo or cannon, install them using npm. Our UMD definition will find them and inject them automatically.

If you use commonjs and webpack and don't install cannon or oimo, you might see a warning saying that those dependencies could not be found. To fix that, use webpack's `externals` feature.

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

### error TS2307: Cannot find module 'babylonjs' (or other modules)

* Make sure you have a version higher than 3.1.0-alpha3.4
* Make sure you added 'babylonjs' to "types" in tsconfig.json

### Even though I use only a few classes from the BABYLON namespace, the entire Babylon module is included

Due to the wayBabylon.js is built, Tree-Shaking is currently not quite possible. Babylon's internal objects have deep connections with one another (for performance reasons). That means, that your built JS file will be at least Babylon.js' minified size.

You can still use custom builds to build you own minimal version: //doc.babylonjs.com/how_to/how_to_start#custom-builds

### Naming is different than what the documentation states

Our documentation always refers to the BABYLON namespace. We therefore always use this namespace when talking about objects/classes, and also use this namespace when talking about the GUI.

When using es-6 imports or require, you are the one responsible to setting the namespace in accordance to your needs. Pay attention when changing it and when copying code from the Playground.

## Example of a webpack project using Babylon modules

Let's see an example of how to setup a Babylon project written in Typescript and bundled using Webpack.

I will be using webpack 4, but the same setup will work with the previous version of webpack.

### Setting up the project

We will be using npm to install dependencies. We first run `npm init` to generate package.json . You can generate package.json in any other way you wish.

After package,json was generated, we will install the needed dev dependencies:

```bash
npm install --save-dev typescript webpack ts-loader webpack-cli
```

Now we will need to configure webpack to know what to actually do. This is a simple example of the webpack configuration file, `webpack.config.js`:

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

We will also add an html file with a canvas (index.html):

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

After adding a new file called `index.ts` we are ready to start developing.

### Adding babylon support

We will start a simple project with Babylon core module, the loaders, and the GUI.

First - let's install babylon's dependencies:

```bash
npm install --save babylonjs babylonjs-loaders babylonjs-gui
```

This will install the latest stable version of Babylon. To install the latest preview version, use the preview stream:

```bash
npm install --save babylonjs@preview babylonjs-loaders@preview babylonjs-gui@preview
```

### Writing some code

Our index.ts will show a sphere for now. I will be using a code very similar to the playground, but you can structure your code as you wish:

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

You will notice that the BABYLON namespace is gone. and that you see a lot of errors, if actually using this file. This is because we haven't yet imported the needed dependencies from babylonjs.

We will use es6 imports for that. To add the dependencies, we have two options. Defining the BABYLON namespace:

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

And running:

```bash
npm run build
```

We will now have an index.js in the dist folder that we can use in our index.html

You will notice there are a few warnings about dependencies. We will deal with that later.

### Checking your project

The best way for you during development would be the webpack dev server (https://github.com/webpack/webpack-dev-server/), but it is not a part of the scope of this tutorial.

To check the current project, I use the http-server npm module (installed globally). You can use any web server that will serve the root folder of our project.

If you open out index.html, we will see a sphere. Hooray!

### Adding the GUI

For the sake of learning, we will add a new file, `gui.ts`, even thou it can still be done with a single ts file. Our gui.ts file will look like this:

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

and in our index.js, we will import the function and use it in our createScene function:

```javascript
import { addLabelToMesh } from "./gui";
```

and the createScene function looks like this:

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

If we compile now using webpack, we will have our GUI element in our scene.

### Eliminating the dependencies warnings

Babylon is using oimo, cannon and earcut as external, optional dependencies. If you don't use them, you can define them as externals in webpack configuration, and avoid the warnings:

```javascript
    externals: {
        "oimo": true,
        "cannon": true,
        "earcut": true
    },
```