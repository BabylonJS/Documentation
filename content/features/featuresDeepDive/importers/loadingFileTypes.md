---
title: Loading Any File Type
image: 
description: Learn how to import any file type in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing
further-reading:
    - title: How to get Babylon.js
      url: /divingDeeper/developWithBjs/frameworkVers
    - title: Use the glTF File Loader Plugin
      url: /divingDeeper/importers/glTF
    - title: Use the OBJ File Loader Plugin
      url: /divingDeeper/importers/oBJ
    - title: Use the STL File Loader Plugin
      url: /divingDeeper/importers/stl
    - title: Load Files with Assets Manager
      url: /divingDeeper/importers/assetManager
    - title: Available Meshes for Importing into Playground
      url: /toolsAndResources/assetLibraries/availableMeshes
    - title: Using External Assets in the Playground
      url: /toolsAndResources/tools/playground/externalPGAssets
    - title: SceneLoader
      url: /typedoc/classes/babylon.sceneloader
video-overview:
video-content:
---

## How to Use Scene Loader

### Basic Usage

To load a file of a given type, Babylon must first have a reference to the plugin for that file type.

Currently plugins can be found for:
 - [.glTF also use for binary version .glb](/divingDeeper/importers/glTF)
 - [.obj](/divingDeeper/importers/oBJ)
 - [.stl](/divingDeeper/importers/stl)

To quickly add support for all loaders the following script can be added to your page:

#### Production links

```javascript
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```

#### Preview links (useful to test for changes to loaders)

```javascript
<script src="https://preview.babylonjs.com/babylon.js"></script>
<script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```
For NPM usage see: https://www.npmjs.com/package/babylonjs-loaders

Once the plugin is referenced, the SceneLoader class can be used which provides a few loading methods.

## SceneLoader.Append

Loads all babylon assets from the file and appends them to the scene

```javascript
BABYLON.SceneLoader.Append("./", "duck.gltf", scene, function (scene) {
    // do something with the scene
});
```

See an example here: <Playground id="#WGZLGJ" title="Append An Object" description="Simple example showing how append an object to your scene." image="/img/playgroundsAndNMEs/divingDeeperFileImport1.jpg" isMain={true} category="Import"/>

Loads all babylon assets from a string and appends them to the scene

```javascript
BABYLON.SceneLoader.Append("", "data:" + gltfString, scene, function (scene) {
    // do something with the scene
});
```

See an example here: <Playground id="#88CB6A#1" title="Append Assets From A String" description="Simple example showing how append objects from a string." image="/img/playgroundsAndNMEs/divingDeeperFileImport2.jpg"/>

You can also load a .glb binary file from a data string as long as the binary data is base64 encoded:

```javascript
var base64_model_content = "data:;base64,BASE 64 ENCODED DATA...";
BABYLON.SceneLoader.Append("", base64_model_content, scene, function (scene) { 
    // do something with the scene
});
```

Note that two mime types are allowed in the string data:
```javascript
var base64_model_content = "data:application/octet-stream;base64,-BASE 64 ENCODED DATA-";
var base64_model_content = "data:model/gltf-binary;base64,-BASE 64 ENCODED DATA-";
```

See an example here: <Playground id="#7F6S08#55" title="Load .glb From Binary Data" description="Simple example showing how to load an object from a data string that is base64 encoded." image="/img/playgroundsAndNMEs/divingDeeperFileImport3.jpg"/>

## SceneLoader.Load

Loads all babylon assets from the file and creates a new scene

```javascript
BABYLON.SceneLoader.Load("/assets/", "batman.obj", engine, function (scene) { 
   // do something with the scene
});
```

## SceneLoader.ImportMesh

Loads the meshes from the file and appends them to the scene

```javascript
// The first parameter can be set to null to load all meshes and skeletons
BABYLON.SceneLoader.ImportMesh(["myMesh1", "myMesh2"], "./", "duck.gltf", scene, function (meshes, particleSystems, skeletons) {
    // do something with the meshes and skeletons
    // particleSystems are always null for glTF assets
});
```
See an example here: <Playground id="#JUKXQD" title="Import Mesh" description="Simple example showing how to import an object into your scene." image="/img/playgroundsAndNMEs/divingDeeperFileImport4.jpg" isMain={true} category="Import"/>

### SceneLoader.ImportMeshAsync

[Asynchronous](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous) version of the ImportMesh function. The result can be obtained by calling on the returned [Promise](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises) or by using the [await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) keyword (note: to be able to use the await keyword in the `createScene` function, it has to be marked as async in its definition). 

```javascript
// The first parameter can be set to null to load all meshes and skeletons
const importPromise = BABYLON.SceneLoader.ImportMeshAsync(["myMesh1", "myMesh2"], "./", "duck.gltf", scene);
importPromise.then((result) => {
    //// Result has meshes, particleSystems, skeletons, animationGroups and transformNodes
})
```
See an example here: <Playground id="#TVHK90" title="Import Mesh Async with Promises" description="Importing an object in your scene with async/await paradigm" image="/img/playgroundsAndNMEs/divingDeeperFileImport4.jpg" isMain={true} category="Import"/>

or 

```javascript
// The first parameter can be set to null to load all meshes and skeletons
const result = await BABYLON.SceneLoader.ImportMeshAsync(["myMesh1", "myMesh2"], "./", "duck.gltf", scene);
// Result has meshes, particleSystems, skeletons, animationGroups and transformNodes
```

See an example here: <Playground id="#YAL1RN" title="Import Mesh Async with await" description="Importing an object in your scene with async/await paradigm" image="/img/playgroundsAndNMEs/divingDeeperFileImport4.jpg" isMain={true} category="Import"/>

## SceneLoader.LoadAssetContainer

Loads all babylon assets from the file and does not append them to the scene

```javascript
BABYLON.SceneLoader.LoadAssetContainer("./", "duck.gltf", scene, function (container) {
    var meshes = container.meshes;
    var materials = container.materials;
    //...

    // Adds all elements to the scene
    container.addAllToScene();
});
```

See an example here: <Playground id="#JA1ND3#48" title="Asset Container Load Example" description="Simple example showing how to load assets into asset containers." image="/img/playgroundsAndNMEs/divingDeeperFileImport5.jpg" isMain={true} category="Import"/>

## SceneLoader.ImportAnimations

Loads the animations from the file and merges them to the scene
You can customize the import process using options and callbacks
```javascript
BABYLON.SceneLoader.ImportAnimations("./", "Elf_run.gltf", scene);
```
See an example here: <Playground id="#UGD0Q0#62" title="Importing Animations" description="Simple example showing how to import animations into your scene." image="/img/playgroundsAndNMEs/divingDeeperFileImport6.jpg"/>

## SceneLoader.AppendAsync

There are also `Async` versions of these functions that return promises:

```javascript
BABYLON.SceneLoader.AppendAsync("./", "duck.gltf", scene).then(function (scene) {
    // do something with the scene
});
```

See [How to Use Promises](/divingDeeper/events/promises) to learn more about using promises.

## Advanced Usage

Use the `onPluginActivatedObservable` to set properties and call methods specific to a particular loader.

```javascript
BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    if (loader.name === "gltf") {
        // do something with the loader
        // loader.<option1> = <...>
        // loader.<option2> = <...>
    }
});
```

Alternatively, the static synchronous SceneLoader functions return the plugin.

```javascript
var loader = BABYLON.SceneLoader.Load("./", "duck.gltf", engine, function (scene) {
    // do something with the scene
});

// do something with the loader
// loader.<option1> = <...>
// loader.<option2> = <...>
```

## Loading multiple assets

For assistance when load multiple assets the AssetsManager class can be used.
See [Load Files with Assets Manager](/divingDeeper/importers/assetManager)

## Direct loading base64 encoded models

Babylon.JS supports directly loading models from base64 encoded [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) without
needing to create an object URL or download the file. When loading from a base64 data url the plugin is not automatically detected (with the exception of some
glb formats). The `pluginExtension` parameter should be set when using base64 data urls in order to ensure the correct plugin is used to load the model.

The format for a minimum base64 encoded model file is:
```
data:;base64,<base64_encoded_file_contents>
```

The **;** before **base64** and the **,** following it are both required. See here for an example of loading an obj file in base64 encoding: 
<Playground id="#58T0JY" title="Load base64 model" description="Example showing how to load a base64 encoded model using the data url syntax" image="/img/playgroundsAndNMEs/pg-58T0JY.png" />
