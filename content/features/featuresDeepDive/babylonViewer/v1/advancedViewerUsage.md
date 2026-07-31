---
title: Babylon.js Viewer - Advanced usage
image:
description: Advanced uses of the viewer.
keywords: extensions, babylon.js, library, viewer, advanced
further-reading:
  - title: Babylon.js Viewer
    url: /legacy/babylonViewer
  - title: Configuring the viewer
    url: /legacy/babylonViewer/configuringViewer
  - title: The templating system
    url: /legacy/babylonViewer/viewerTemplatingSystem
  - title: Recreating the default configuration for the viewer
    url: /legacy/babylonViewer/defaultViewerConfig
  - title: Babylon.js viewer examples
    url: /legacy/babylonViewer/viewerExamples
video-overview:
video-content:
---

## Forcing the type of loader on a model

Babylon's mesh importer uses the file extension of the model you provided to determine which loader to use. Sometimes, it is not possible to provide a file extension, especially if your server does not allow it. If that is the case, you can force a specific loader for a model.

To do that, use the `model.loader` configuration variable:

```html
<babylon extends="minimal" model.url="https://example.com/Rabbit" model.loader=".gltf"></babylon>
```

This will load [https://example.com/Rabbit](https://example.com/Rabbit) using the glTF loader.

## Retrieving the viewer instance

The viewer has a viewer manager that registers each viewer currently on the page. The viewer manager is event-based and triggers a callback every time a new viewer is added. To register the callback, you can use the following:

```javascript
// using basic callback
BabylonViewer.viewerManager.onViewerAdded = function (viewer) {
  console.log(viewer);
};

// user observers

BabylonViewer.viewerManager.onViewerAddedObservable.add(function (viewer) {
  console.log(viewer);
});
```

Another way to get the viewer is to use the promise-based API:

```javascript
// you will need to set an id attribute to the viewer element and use it here:
BabylonViewer.viewerManager.getViewerPromiseById("viewer-id").then(function (viewer) {
  console.log(viewer.getBaseId());
});
```

The Promise-based API will either wait until the viewer is created or return the viewer itself if it is already initialized. It is therefore the safest way to get the viewer instance.

If you know the viewer was already initialized, there are two simple ways of getting it:

```javascript
// using the id
let viewer = BabylonViewer.viewerManager.getViewerById("viewer-id");
// using the viewer HTML element
let element = document.querySelector("babylon");
let viewer2 = BabylonViewer.viewerManager.getViewerByHTMLElement(element);
```

## Initializing a different HTML tag other than `<babylon>`

Babylon Viewer automatically initializes `babylon` HTML tags and renders a viewer on top of them. If you want to use a different HTML tag, you can. To do that, you need to disable the default initialization and then initialize your own tags. Add the following script at the bottom of your page, after including the viewer JS file:

```javascript
// a simple way of disabling auto init
BabylonViewer.disableInit = true;
// Initializing the viewer on specific HTML tags.
BabylonViewer.InitTags("the-other-tag-name");
```

## Finding the Babylon Engine, Scene, and Camera

The viewer instance exposes the Engine, Scene, and Camera objects it uses.
To access them, get the viewer in any of the ways discussed above, then access the public member you need:

```javascript
let viewer = getMeMyViewer();
viewer.sceneManager.scene instanceOf BABYLON.Scene; // true
viewer.engine instanceOf BABYLON.Engine; // true
viewer.sceneManager.camera instanceOf BABYLON.ArcRotateCamera; // true
```

## Event-based development

Besides the scene, engine, and camera, the viewer exposes observables that are triggered when certain events occur. At the moment, 3 observables are available:

```javascript
public onSceneInitObservable: PromiseObservable<Scene>; // Executed when a scene object was initialized
public onEngineInitObservable: PromiseObservable<Engine>; // Executed after the engine was created
public onModelLoadedObservable: PromiseObservable<AbstractMesh[]>; // Executed after a model was loaded.
```

You will notice that these are Promise-based observables. The difference is that you can return a promise instead of a value, and the viewer will wait for it to resolve.

Let's take a look at a not-very-helpful example: we will delay the entire execution after a scene is created by using `setTimeout()` and a Promise object:

```javascript
// taken from here - https://blog.raananweber.com/2015/12/01/writing-a-promise-delayer/
function DelayPromise(delay) {
  //return a function that accepts a single variable
  return function (data) {
    //this function returns a promise.
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        //a promise that is resolved after "delay" milliseconds with the data provided
        console.log("done!");
        resolve(data);
      }, delay);
    });
  };
}

// force a 500 ms delay after the scene was created.
viewer.onSceneInitObservable.add(DelayPromise(500));
```

This will print 'done' and then continue loading the model.

If we simply used `setTimeout()` and returned, it would execute asynchronously, and "done" would be logged 500 ms after the model started loading.

The registered function does not have to return a promise. If you register a simple function, it will still work and execute correctly:

```javascript
viewer.onSceneInitObservable.add(function (scene) {
  scene.clearColor = BABYLON.Color4.Blue();
  // returning the scene object. a common practice, not a must
  return scene;
});
```

## Enabling the Inspector

To enable the Inspector, add scene.debug="true" to your HTML tag:

```html
<babylon extends="minimal" scene.debug="true" model="https://playground.babylonjs.com/scenes/Rabbit.babylon"></babylon>
```

## Loading a model async

In certain cases, you may want to load your model using JavaScript after the viewer is initialized. This is useful if, for example, a user clicks a button to load a model or drags and drops a model to be viewed. In this case, your HTML should contain only the configuration for the scene (engine, scene, camera, and lights), without defining anything related to the model itself:

```html
<babylon id="babylon-viewer" camera.behaviors.auto-rotate="0"></babylon>
```

To do so, the viewer exposes the "loadModel" function. Loading a model requires you to wait for the engine to initialize. To make this work correctly, you need to wait for the onEngineInit observable to notify you:

```javascript
BabylonViewer.viewerManager.getViewerPromiseById("babylon-viewer").then(function (viewer) {
  // this will resolve only after the viewer with this specific ID is initialized

  viewer.onEngineInitObservable.add(function (scene) {
    viewer.loadModel({
      title: "Helmet",
      subtitle: "BabylonJS",
      thumbnail: "https://www.babylonjs.com/img/favicon/apple-icon-144x144.png",
      url: "https://www.babylonjs.com/assets/DamagedHelmet/glTF/DamagedHelmet.gltf",
    });

    // load another model after 20 seconds. Just to show it is possible
    setTimeout(() => {
      viewer.loadModel({
        title: "Rabbit",
        subtitle: "BabylonJS",
        thumbnail: "https://www.babylonjs.com/img/favicon/apple-icon-144x144.png",
        url: "https://playground.babylonjs.com/scenes/Rabbit.babylon",
      });
    }, 20000);
  });
});
```

The `loadModel` function returns a `Promise<ViewerModel>` that resolves when the model is fully loaded. This is helpful when you want to tell the user that the model loaded successfully:

```javascript
viewer
  .loadModel({
    title: "Helmet",
    subtitle: "BabylonJS",
    thumbnail: "https://www.babylonjs.com/img/favicon/apple-icon-144x144.png",
    url: "https://www.babylonjs.com/assets/DamagedHelmet/glTF/DamagedHelmet.gltf",
  })
  .then((model) => {
    console.log("model loaded!");
  })
  .catch((error) => {
    console.log("error loading the model!", error);
  });
```
