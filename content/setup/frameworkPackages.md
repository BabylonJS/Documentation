---
title: Obtaining Babylon.js Packages
image:
description: Different ways to obtain the framework packages.
keywords: babylon.js, packages, code, core, gui, loaders, serializers, materials, viewer, inspector
further-reading:
video-overview:
video-content:
---

## Available Packages

We offer the following packages via CDN, NPM, and ES6. It is important that you choose only one of these delivery methods for your project; mixing any two of them will ensure failure.

The packages available are listed below.

The core **babylonjs**, which is necessary for all and sufficient for many projects, plus:

* babylonjs-materials - _A collection of Babylon-supported **advanced** materials._
* babylonjs-loaders - _All of Babylon's official loaders (OBJ, STL, glTF)._
* babylonjs-post-process - _Babylon's post processes._
* babylonjs-procedural-textures - _Officially supported procedural textures_.
* babylonjs-serializers - _Scene / mesh serializers._
* babylonjs-gui - _Babylon.js GUI._
* babylonjs-inspector - _Babylon.js inspector._
* babylonjs-viewer - _The stand-alone Babylon.js Viewer._

## History of Package Delivery

In the early days the framework was written in JavaScript and the common way of consuming a JavaScript framework was to load it in a script tag in your HTML and populate a global namespace. Hence the use of BABYLON as the namespace as, for example, in

```javascript
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10));
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
```

The framework was originally available as a single JavaScript package to download from GitHub, and away you went. While this approach has a very clear upside—ease of use—it also has many downsides. As the package grew larger and larger over time, the framework became harder to maintain, and attempts to provide a way to minimize the package size were only partly successful. To overcome these issues, a change to developing in TypeScript and using NPM was introduced to the framework. As backward compatibility is an important principle of Babylon.js, the current JavaScript packages are still available from the Babylon.js CDN and can be directly accessed or downloaded for local use.

The use of npm meant that developers could include Babylon.js in their build tools. By version 3, module support had been added using CommonJS and then moved to UMD (Universal Module Definition). The good thing about our UMD package is that it supports one of Babylon.js’ cornerstones: backward compatibility. Namespaces worked, packages could still be included in a script tag, and for those who wanted it, projects could be written in TypeScript and compiled to JavaScript. Everybody was happy. Then along came ES6.

ES6 provides better dependency management, better syntax, and better code structure. And with it comes one of its wonderful side effects: take only what you need. There is no need to consume the entire Babylon.js package if you just want to show a sphere in a skybox. Welcome, tree shaking! Writing your project in TypeScript is of course supported. However, ES6 has a few hurdles that need to be jumped over just to get it to work. You will probably need a bundler. You will probably need a (custom) build process. You will probably need to compile it to ES5 for cross-browser support.

Babylon.js’s codebase has gradually moved from an older namespace-based syntax to a modern import-based syntax. A main issue with that was backward compatibility. A future-safe architecture is always a hard task and apparently the older versions of Babylon.js were not entirely that. In some cases, we had circular dependencies. In some cases, we had side-effect (code running when the script is loaded), which is discouraged when using (pure) es6 modules.


## Choosing
What should you use?

Well, as always, that depends. UMD is still faster for rapid prototyping. The Babylon.js playground, for example, still uses the UMD packages (and the global BABYLON namespace). On the other hand, if you start a new project and want to bring a bit of structure, better architecture and smaller package size, I always recommend ES6.

UMD “just works”, mainly because it is still using the most basic browser functionalities. It is also guaranteed to work on any browser with WebGL support (yes IE11, I am looking at Safari). Don’t want to use npm? You don’t have to.

ES6 does not populate the global namespace, so no more BABYLON.* support. This might cause (your) legacy work to stop working, or might present some compatibility issues with our documentation website, which, for the sake of consistency, mostly uses the BABYLON namespace in code examples. So if you want to just copy examples from the doc page without the need to (sometimes) change them, use UMD.

But whatever you do, choose one of them. Most of the time, when we have a forum question about build issues, it is because of mixing the two module flavors.
