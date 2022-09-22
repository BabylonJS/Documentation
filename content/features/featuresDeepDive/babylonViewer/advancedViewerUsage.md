---
title: Babylon.js Viewer - Advanced usage
image: 
description: Advanced uses of the viewer.
keywords: extensions, babylon.js, library, viewer, advanced
further-reading:
    - title: Babylon.js Viewer
      url: /features/featuresDeepDive/babylonViewer
    - title: Configuring the viewer
      url: /features/featuresDeepDive/babylonViewer/configuringViewer
    - title: The templating system
      url: /features/featuresDeepDive/babylonViewer/viewerTemplatingSystem
    - title: Recreating the default configuration for the viewer
      url: /features/featuresDeepDive/babylonViewer/defaultViewerConfig
    - title: Babylon.js viewer examples
      url: /features/featuresDeepDive/babylonViewer/viewerExamples
video-overview:
video-content:
---


## Forcing the type of loader on a model

Babylon's mesh importer is using the file extension of the model you provided in order to find out what loader to use. Sometimes, it is not possible to provide a file extension - especially if your server doesn't allow it. If that is the case, you can force a specific loader on a model.

To do that, use the `model.loader` configuration variable:

```html
<babylon extends="minimal" model.url="https://example.com/Rabbit" model.loader=".gltf"></babylon>
```

This will load [https://example.com/Rabbit](https://example.com/Rabbit) using the glTF loader.

## Retrieving the viewer instance

The viewer has a viewer manager that registers each viewer currently on this page. The viewer manager is event based, and will trigger a callback every time a new viewer was added. To register the callback, you can use the following:

```javascript
// using basic callback
BabylonViewer.viewerManager.onViewerAdded = function(viewer) {
    console.log(viewer);
}

// user observers

BabylonViewer.viewerManager.onViewerAddedObservable.add(function(viewer) {
    console.log(viewer);
})
```

Another way of getting the viewer is using the promise-based API:

```javascript
// you will need to set an id attribute to the viewer element and use it here:
BabylonViewer.viewerManager.getViewerPromiseById('viewer-id').then(function(viewer) {
    console.log(viewer.getBaseId());
});
```

The Promise-based API will either wait until the viewer was created, or return the viewer itself, if already initialized. It is therefore the safest way to get the viewer instance.

If you know the viewer was already initialized, there are two simple ways of getting it:

```javascript
// using the id
let viewer = BabylonViewer.viewerManager.getViewerById('viewer-id');
// using the viewer HTML element
let element = document.querySelector('babylon');
let viewer2 = BabylonViewer.viewerManager.getViewerByHTMLElement(element);
```

## Initializing a different HTML tag other than `<babylon>`

Babylon Viewer automatically initializes `babylon` HTML tags and renders a viewer on top of them. If you want to use a different HTML Tag, it is more than possible. To do that, you will need to disable the default init, and then init your own tags. Add the following script at the bottom of your page, after including the viewer js file:

```javascript
// a simple way of disabling auto init
BabylonViewer.disableInit = true;
// Initializing the viewer on specific HTML tags.
BabylonViewer.InitTags('the-other-tag-name');
```

## Finding the Babylon Engine, Scene, and Camera

The viewer instance exposes the used Engine, Scene, and Camera objects.
To get them, simply get the viewer (any way you see fit, as previously discussed), and get the public member you need:

```javascript
let viewer = getMeMyViewer();
viewer.sceneManager.scene instanceOf BABYLON.Scene; // true
viewer.engine instanceOf BABYLON.Engine; // true
viewer.sceneManager.camera instanceOf BABYLON.ArcRotateCamera; // true
```

## Event-based development

Other than the scene, engine and camera, the viewer exposes observables that are executed when a certain event happens. At the moment, there are 3 observables currently available:

```javascript
public onSceneInitObservable: PromiseObservable<Scene>; // Executed when a scene object was initialized
public onEngineInitObservable: PromiseObservable<Engine>; // Executed after the engine was created
public onModelLoadedObservable: PromiseObservable<AbstractMesh[]>; // Executed after a model was loaded.
```

You will notice these are Promise-based observables. The difference is, that you can run return a promise instead of a variable, and the viewer will wait for its execution.

Let's take a look at a (very not-helpful) example - we will delay the entire execution after a scene was created using setTimeout() and a Promise object:

```javascript
// taken from here - https://blog.raananweber.com/2015/12/01/writing-a-promise-delayer/
function DelayPromise(delay) {
  //return a function that accepts a single variable
  return function(data) {
    //this function returns a promise.
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        //a promise that is resolved after "delay" milliseconds with the data provided
        console.log('done!');
        resolve(data);
      }, delay);
    });
  }
}

// force a 500 ms delay after the scene was created.
viewer.onSceneInitObservable.add(DelayPromise(500));
```

This will print 'done' and then continue loading the model.

If we would simply use setTimeout and return, setTimeout would have async-executed, and the 'done' would have been logged 500 ms after the model started loading.

The registered function doesn't have to be a promise. If registering a simple function, it will still work and execute correctly:

```javascript
viewer.onSceneInitObservable.add(function(scene) {
    scene.clearColor = BABYLON.Color4.Blue();
    // returning the scene object. a common practice, not a must
    return scene;
});
```

## Enabling the Inspector

To enable the Inspector, add scene.debug="true" to your html tag:

```html
<babylon extends="minimal" scene.debug="true" model="https://playground.babylonjs.com/scenes/Rabbit.babylon"></babylon>
```

## Loading a model async

In certain cases you would want to load your model using javascript after the viewer was initialized. It is the case if, for example, a user clicks on a button to load a model, or drag & drops a model to be viewed. In this case, your HTML should just contain the configuration for the scene (engine, scene, camera and lights), without defining anything related to the model itself:

```html
<babylon id="babylon-viewer" camera.behaviors.auto-rotate="0"></babylon>
```

To do so, the viewer exposes the "loadModel" function. Loading model requires you to wait for the engine to initialize. So in order to get it to work correctly, you will need to wait for the onEngineInit observable to notify you about it:

```javascript
BabylonViewer.viewerManager.getViewerPromiseById('babylon-viewer').then(function (viewer) {
    // this will resolve only after the viewer with this specific ID is initialized

    viewer.onEngineInitObservable.add(function (scene) {
        viewer.loadModel({
            title: "Helmet",
            subtitle: "BabylonJS",
            thumbnail: "https://www.babylonjs.com/img/favicon/apple-icon-144x144.png",
            url: "https://www.babylonjs.com/Assets/DamagedHelmet/glTF/DamagedHelmet.gltf"
        });

        // load another model after 20 seconds. Just to show it is possible
        setTimeout(() => {
            viewer.loadModel({
                title: "Rabbit",
                subtitle: "BabylonJS",
                thumbnail: "https://www.babylonjs.com/img/favicon/apple-icon-144x144.png",
                url: "https://playground.babylonjs.com/scenes/Rabbit.babylon"
            });
        }, 20000);
    });
});
```

The `loadModel` function will return a `Promise<ViewerModel>` that is thenable when the model was fully loaded. Helpful when you want to tell the user the model loaded successfully :

```javascript
viewer.loadModel({
    title: "Helmet",
    subtitle: "BabylonJS",
    thumbnail: "https://www.babylonjs.com/img/favicon/apple-icon-144x144.png",
    url: "https://www.babylonjs.com/Assets/DamagedHelmet/glTF/DamagedHelmet.gltf"
}).then(model => {
    console.log("model loaded!");
}).catch(error => {
    console.log("error loading the model!", error);
});
```