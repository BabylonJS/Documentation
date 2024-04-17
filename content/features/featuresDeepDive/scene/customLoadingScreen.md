---
title: Creating Custom Loading Screens
image: 
description: Learn how to create custom loading screens in Babylon.js.
keywords: diving deeper, scene, loader, loading screen
further-reading:
video-overview:
video-content:
    - title: Custom Loading Screens
      url: https://youtu.be/cLqK9vgTKBw
---

## How To Create a Custom Loading Screen

Starting with Babylon.js 2.3 the loading screen (the screen used when loading assets or a scene) can be changed by the developer.

To create a new loading screen, you will have to create a simple class, implementing the following interface:

```javascript
interface ILoadingScreen {
  //What happens when loading starts
  displayLoadingUI: () => void;
  //What happens when loading stops
  hideLoadingUI: () => void;
  //default loader support. Optional!
  loadingUIBackgroundColor: string;
  loadingUIText: string;
}
```

In plain JavaScript, your loader code will look like this:

```javascript
function CustomLoadingScreen( /* variables needed, for example:*/ text) {
  //init the loader
  this.loadingUIText = text;
}
CustomLoadingScreen.prototype.displayLoadingUI = function() {
  alert(this.loadingUIText);
};
CustomLoadingScreen.prototype.hideLoadingUI = function() {
  alert("Loaded!");
};
```

In TypeScript the same will look like this:

```javascript
class CustomLoadingScreen implements ILoadingScreen {
  //optional, but needed due to interface definitions
  public loadingUIBackgroundColor: string
  constructor(public loadingUIText: string) {}
  public displayLoadingUI() {
    alert(this.loadingUIText);
  }

  public hideLoadingUI() {
    alert("Loaded!");
  }
}
```

The usage is the same in both languages:

```javascript
var loadingScreen = new CustomLoadingScreen("I'm loading!!");
// replace the default loading screen
engine.loadingScreen = loadingScreen;
// show the loading screen
engine.displayLoadingUI();

/*
 * create your scene over here
 */

// hide the loading screen when you want to
engine.hideLoadingUI();
```

## Example

Here a playground using a custom loading screen:

<Playground id="#5Y2GIC#39" title="Custom Loading Screen Example" description="Simple example showing how to create and use a custom loading screen."/>

You might also be interested in a standalone html example:

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>Babylon.js custom loading screen example</title>
    <script src="https://code.jquery.com/pep/0.4.2/pep.min.js"></script>
    <script src="https://preview.babylonjs.com/babylon.js"></script>
    <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.js"></script>

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

        #loadingScreen {
            position: absolute;
            width: 100%;
            height: 100%;
            color: white;
            font-size: 50px;
            text-align: center;
            background-color: #BB464Bcc;
            z-index: 9999;
        }
    </style>
</head>

<body>
    <div id="loadingScreen">default div text</div>
    <canvas id="renderCanvas"></canvas>
    <script>
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, true);

        var loadingScreenDiv = window.document.getElementById("loadingScreen");

        function customLoadingScreen() {
            console.log("customLoadingScreen creation")
        }
        customLoadingScreen.prototype.displayLoadingUI = function () {
            console.log("customLoadingScreen loading")
            loadingScreenDiv.innerHTML = "loading";
        };
        customLoadingScreen.prototype.hideLoadingUI = function () {
            console.log("customLoadingScreen loaded")
            loadingScreenDiv.style.display = "none";
        };
        var loadingScreen = new customLoadingScreen();
        engine.loadingScreen = loadingScreen;

        engine.displayLoadingUI();

        var delayCreateScene = function () {
            var scene = new BABYLON.Scene(engine);
            scene.createDefaultCamera(true, true, true);
            BABYLON.SceneLoader.ImportMesh(
                "",
                "https://models.babylonjs.com/CornellBox/",
                "cornellBox.glb",
                scene,
                function () {
                    scene.createDefaultCamera(true, true, true);
                    scene.createDefaultEnvironment();
                    scene.activeCamera.alpha = Math.PI / 2;

                    engine.hideLoadingUI();

                });
            return scene;
        };
        var scene = delayCreateScene();

        engine.runRenderLoop(function () {
            if (scene) {
                scene.render();
            }
        });
        window.addEventListener("resize", function () {
            engine.resize();
        });
    </script>
</body>
</html>
```

## Getting File Loading Rate

When loading files, you can get the [SceneLoaderProgressEvent](/typedoc/classes/babylon.sceneloader) sent in the `onProgress` callback.

Example using `BABYLON.SceneLoader.ImportMesh`:

```javascript
BABYLON.SceneLoader.ImportMesh(
    "",
    "https://models.babylonjs.com/CornellBox/",
    "cornellBox.glb",
    scene,
    function () {
        // onSuccess
        scene.createDefaultCamera(true, true, true);
        scene.activeCamera.alpha = Math.PI / 2;
        engine.hideLoadingUI();
    },
    function (evt) {
        // onProgress
        var loadedPercent = 0;
        if (evt.lengthComputable) {
            loadedPercent = (evt.loaded * 100 / evt.total).toFixed();
        } else {
            var dlCount = evt.loaded / (1024 * 1024);
            loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
        }
        // assuming "loadingScreenPercent" is an existing html element
        document.getElementById("loadingScreenPercent").innerHTML = loadedPercent;
    }
);


```

## File Loading Rate of Multiple Assets

This example expands on the use of [SceneLoaderProgressEvent](/typedoc/classes/babylon.sceneloader) from the previous section to track the loading of multiple assets using different loading methods.

<Playground id="#BCU1XR#6700" title="Loading Rate of Multiple Assets" description="Example showing how to get a loading rate for multiple assets."/>
