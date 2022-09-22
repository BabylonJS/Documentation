---
title: Asset Manager
image:
description: Learn the wonderful world of the Babylon.js asset manager.
keywords: diving deeper, import, importing assets, asset, importing, asset manager
further-reading:
video-overview:
video-content:
---

## How To Load Files with Assets Manager

In order to help developers load multiple assets, Babylon.js (starting with version 1.14) introduced the AssetsManager class.

This class can be used to import meshes into a scene or load text and binary files.

**Note:** Since meshes you import can have a _rotationQuaternion_ set applying a _rotation_ to one will have unforeseen consequences as detailed in this [warning](/features/featuresDeepDive/mesh/transforms/center_origin/rotation_conventions).

## Using AssetsManager

### Initializing and creating tasks

To use it, you just have to instantiate it with a current scene:

```javascript
var assetsManager = new BABYLON.AssetsManager(scene);
```

Then you can add tasks to the manager:

```javascript
var meshTask = assetsManager.addMeshTask("skull task", "", "scenes/", "skull.babylon");
```

Each task provides an `onSuccess` and an `onError` callback:

```javascript
meshTask.onSuccess = function (task) {
  task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
};
```

```javascript
meshTask.onError = function (task, message, exception) {
  console.log(message, exception);
};
```

You can do the same thing but with text and binary files:

```javascript
var textTask = assetsManager.addTextFileTask("text task", "msg.txt");
textTask.onSuccess = function (task) {
  console.log(task.text);
};

var binaryTask = assetsManager.addBinaryFileTask("binary task", "grass.jpg");
binaryTask.onSuccess = function (task) {
  // Do something with task.data
};
```

Images are also supported through imageTask:

```javascript
var imageTask = assetsManager.addImageTask("image task", "img.jpg");
imageTask.onSuccess = function (task) {
  console.log(task.image.width);
};
```

Textures can also be loaded, through textureTask:

```javascript
var textureTask = assetsManager.addTextureTask("image task", "img.jpg");
textureTask.onSuccess = function (task) {
  material.diffuseTexture = task.texture;
};
```

### Task state and error handling

Each task has a state object that represents the current execution state of the task. The state is represented by an enum, `BABYLON.AssetTaskState` and has 4 states:

- INIT - before the task started executing
- RUNNING - when the task started executing but hasn't finished yet.
- DONE - when the task successfully finished execution
- ERROR - when the task failed.

If a task has the error state (`BABYLON.AssetTaskState.ERROR`) a new object will be added to the task: `task.errorObject` . The error object have 2 variables defined, both optional:

- message - a string explaining the error shortly (such as "request returned 404")
- exception - in case an exception was thrown during execution, the exception object will contain the stack trace information

This way the error is accessible also when using the assets manager observers:

```javascript
assetsManager.onTaskErrorObservable.add(function (task) {
  console.log("task failed", task.errorObject.message, task.errorObject.exception);
});
```

### Manager callbacks and observables

The manager itself provides four callbacks:

- onFinish
- onProgress
- onTaskSuccess
- onTaskError

```javascript
assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
  engine.loadingUIText = "We are loading the scene. " + remainingCount + " out of " + totalCount + " items still need to be loaded.";
};

assetsManager.onFinish = function (tasks) {
  engine.runRenderLoop(function () {
    scene.render();
  });
};
```

The manager also allows you to use observers in order to handle onFinish, onProgress, onTaskSuccess and onTaskError:

- onTaskSuccessObservable - registered observers will be executed when a single task finished successfully.
- onTaskErrorObservable - registered observers will be executed when a single task failed.
- onProgressObservable - registered observers will be executed when a single task finished successfully or failed.
- onTasksDoneObservable - registered observers will be execute when all tasks' executions are done (success or failed!)

```javascript
assetsManager.onTaskSuccessObservable.add(function (task) {
  console.log("task successful", task);
});
```

```javascript
assetsManager.onTasksDoneObservable.add(function (tasks) {
  var errors = tasks.filter(function (task) {
    return task.taskState === BABYLON.AssetTaskState.ERROR;
  });
  var successes = tasks.filter(function (task) {
    return task.taskState !== BABYLON.AssetTaskState.ERROR;
  });
});
```

### Executing the tasks

To launch all the tasks, you have to call:

```javascript
assetsManager.load();
```

- You can see a live demo [here](https://www.babylonjs.com/scenes/assets)
- Playground demo: <Playground id="#ZJYNY#0" title="Asset Manager Example" description="Simple Example of using the asset manager in your scene." image="/img/playgroundsAndNMEs/divingDeeperAssetManager1.jpg"/>

## Available tasks

There are 7 types of tasks that can be executed using the assets manager.

Each task is extending the AbstractAssetTask class (and implementing IAssetTask interface) with the following properties:

```javascript
onSuccess: (task: IAssetTask) => void;
onError: (task: IAssetTask, message?: string, exception?: any) => void;

isCompleted: boolean = false;
name: string;
taskState: AssetTaskState;
errorObject: { message?: string; exception?: any; };
```

Note that the properties required to initialize a task are always corresponding to the object type it creates. Foe example, the constructor signature of the CubeTextureAssetTask takes the same variables as the class BABYLON.CubeTexture . The order of the variables might vary.

### MeshAssetTask

The mesh asset task is used to load a model externally (a .babylon, .obj, .gltf and so on).

Constructor signature:

```javascript
constructor(name: string, meshesNames: any, rootUrl: string, sceneFilename: string | File)
```

Extra properties:

```javascript
public loadedMeshes: Array<AbstractMesh>;
public loadedParticleSystems: Array<ParticleSystem>;
public loadedSkeletons: Array<Skeleton>;
```

### TextFileAssetTask

Is used to async-load a (text) file.

Constructor signature:

```javascript
constructor(name: string, url: string)
```

Extra properties:

```javascript
public url: string;
public text: string;
```

### BinaryFileAssetTask

This task is used to load a binary file. The main difference between this and the TextFileAssetTask is that the data will be stored in an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Constructor signature:

```javascript
constructor(name: string, url: string)
```

Extra properties:

```javascript
public url: string;
public data: ArrayBuffer;
```

### ImageAssetTask

This function will load an image (.png, .jpg, .gif). It will create an [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) object

Constructor signature:

```javascript
constructor(name: string, url: string)
```

Extra properties:

```javascript
public url: string;
public image: HTMLImageElement;
```

### TextureAssetTask

This will create a new BABYLON.Texture from a provided single url.

Constructor signature:

```javascript
constructor(name: string, url: string, noMipmap?: boolean, invertY?: boolean, samplingMode: number = BABYLON.Texture.TRILINEAR_SAMPLINGMODE)
```

Extra properties:

```javascript
public texture: Texture;
```

### CubeTextureAssetTask

The same as the TextureAssetTask but for a cube texture

Constructor signature:

```javascript
constructor(name: string, url: string, extensions?: string[], noMipmap?: boolean, files?: string[])
```

Extra properties:

```javascript
public texture: CubeTexture;
```

### HDRCubeTextureAssetTask

Same as the CubeTextureAssetTask, but for HDR cube textures

```javascript
constructor(name: string, url: string, size?: number, noMipmap = false, generateHarmonics = true, useInGammaSpace = false, usePMREMGenerator = false)
```

Extra properties:

```javascript
public texture: HDRCubeTexture;
```

### EquiRectangularCubeTextureAssetTask

Same as the CubeTextureAssetTask, but for Equirectangular cube textures

```javascript
constructor(name: string, url: string, size: number, noMipmap = false, useInGammaSpace = true)
```

Extra properties:

```javascript
public texture: EquiRectangularCubeTexture;
```

## Using a loading screen

By default, the AssetsManager will display a loading screen while loading assets:

<img src="/img/features/scene/loader.jpg" title="Babylon.js Loading Spinner"/>

If you want to disable the loading screen, you have to set `useDefaultLoadingScreen` to false:

```javascript
assetsManager.useDefaultLoadingScreen = false;
```

The loading screen will also be displayed while loading a scene using SceneLoader if `ShowLoadingScreen` is set to true (by default).

```javascript
BABYLON.SceneLoader.ShowLoadingScreen = false;
```

In the same way, you can also display or hide the loading screen manually using these functions:

```javascript
engine.displayLoadingUI();
engine.hideLoadingUI();
```

Loading text is controlled using `loadingUIText` :

```javascript
engine.loadingUIText = "text";
```

Background color is controlled using `loadingUIBackgroundColor` :

```javascript
engine.loadingUIBackgroundColor = "red";
```
