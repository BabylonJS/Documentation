## Introduction

This document will describe all the ways you can use to get access to Babylon.js.

## CDN

Babylon.js can be downloaded or used from our CDN using the following URLs:

### Stable version

* BabylonJS: https://cdn.babylonjs.com/babylon.js
* BabylonJS (unminified): https://cdn.babylonjs.com/babylon.max.js 
* Inspector: https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js
* Loaders: [https://cdn.babylonjs.com/loaders/*xxx*](https://cdn.babylonjs.com/loaders/)
  * *xxx* can be any file from [/dist/loaders/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/loaders/)
* Materials library: [https://cdn.babylonjs.com/materialsLibrary/*xxx*](https://cdn.babylonjs.com/materialsLibrary/)
  * *xxx* can be any file from [/dist/materialsLibrary/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/materialsLibrary/)
* PostProcesses library: [https://cdn.babylonjs.com/postProcessesLibrary/*xxx*](https://cdn.babylonjs.com/postProcessesLibrary/)
  * *xxx* can be any file from [/dist/postProcessesLibrary/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/postProcessesLibrary/)
* GUI: https://cdn.babylonjs.com/gui/babylon.gui.min.js
* Procedural Textures library: [https://cdn.babylonjs.com/proceduralTexturesLibrary/*xxx*](https://cdn.babylonjs.com/proceduralTexturesLibrary/)
  * *xxx* can be any file from [/dist/proceduralTexturesLibrary/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/proceduralTexturesLibrary/)
* Serializers: [https://cdn.babylonjs.com/serializers/*xxx*](https://cdn.babylonjs.com/serializers/)
  * *xxx* can be any file from [/dist/serializers/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/serializers/)

Example:

```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
<script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
<script src="https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
<script src="https://cdn.babylonjs.com/gui/babylon.gui.min.js"></script>
<script src="https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
<script src="https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
```

### Preview version

* BabylonJS: https://preview.babylonjs.com/babylon.js
* BabylonJS (unminified): https://preview.babylonjs.com/babylon.max.js 
* Inspector: https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js
* Loaders: [https://preview.babylonjs.com/loaders/*xxx*](https://preview.babylonjs.com/loaders/)
  * *xxx* can be any file from [/dist/preview release/loaders/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview%20release/loaders/)
* Materials library: [https://preview.babylonjs.com/materialsLibrary/*xxx*](https://preview.babylonjs.com/materialsLibrary/)
  * *xxx* can be any file from [/dist/preview release/materialsLibrary/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview%20release/materialsLibrary/)
* PostProcesses library: [https://preview.babylonjs.com/postProcessesLibrary/*xxx*](https://preview.babylonjs.com/postProcessesLibrary/)
  * *xxx* can be any file from [/dist/preview release/postProcessesLibrary/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview%20release/postProcessesLibrary/)
* GUI: https://preview.babylonjs.com/gui/babylon.gui.min.js
* Procedural Textures library: [https://preview.babylonjs.com/proceduralTexturesLibrary/*xxx*](https://preview.babylonjs.com/proceduralTexturesLibrary/)
  * *xxx* can be any file from [/dist/preview release/proceduralTexturesLibrary/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview%20release/proceduralTexturesLibrary/)
* Serializers: [https://preview.babylonjs.com/serializers/*xxx*](https://preview.babylonjs.com/serializers/)
  * *xxx* can be any file from [/dist/preview release/serializers/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview%20release/serializers/)

Example:

```html
<script src="https://preview.babylonjs.com/babylon.js"></script>
<script src="https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
<script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
<script src="https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
<script src="https://preview.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
<script src="https://preview.babylonjs.com/gui/babylon.gui.min.js"></script>
<script src="https://preview.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
<script src="https://preview.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
<script src="https://preview.babylonjs.com/nodeEditor/babylon.nodeEditor.js"></script>
```

## NPM

A complete description of all our NPM packages can be found here:
* For [ES5](/features/NPM_Support)
* For [ESNext (ES6+)](/features/ES6_Support)

## GitHub

You can also directly point to [our repo](https://github.com/BabylonJS/Babylon.js) in the following folders:
* For stable release: [/dist/](https://github.com/BabylonJS/Babylon.js/tree/master/dist)
* For preview release: [/dist/preview release/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/preview%20release)
* For previous versions: [/dist/previous release/](https://github.com/BabylonJS/Babylon.js/tree/master/dist/previous%20releases)

# Further Reading
[First Steps](/babylon101/first)  
[NPM Support](/features/NPM_Support)  
[ESNext Support](/features/ES6_Support)