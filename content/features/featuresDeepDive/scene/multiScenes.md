---
title: Using Multiple Scenes
image:
description: Learn about using multiple scenes at the same time in Babylon.js.
keywords: diving deeper, scene, multi-scene
further-reading:
video-overview:
video-content:
---

## How to Use Multiple Scenes

To use multiple scenes create them with

```javascript
var scene0 = new BABYLON.Scene(engine);
var scene1 = new BABYLON.Scene(engine);
```

then put the relevant camera, lights and meshes inside each scene and call them in `runRenderLoop`

```javascript
engine.runRenderLoop(function () {
  scene0.render();
  scene1.render();
});
```

However, this simple code has a potential problem. Remeber that each `scene.render` call will try to clear what has been rendered before, and to avoid one scene erasing what another has rendered, you need to set `scene.autoClear = false` on all the scenes rendered on "top" of others:

```javascript
var scene0 = new BABYLON.Scene(engine);
var scene1 = new BABYLON.Scene(engine);
scene1.autoClear = false; 
```

```javascript
engine.runRenderLoop(function () {
  scene0.render();
  scene1.render(); // Since scene1's autoClear is false, it will not "erase" what scene0 has rendered.
});
```

### Multiple scenes on the Playground

However there is a difference between writing multiple scenes within your own projects and trying them out in the playground.

In your own project it is easy enough to set up create scene functions for each scene and call them in the engine run render loop. For example

```javascript
var createScene0 = function () {
  var scene0 = new BABYLON.Scene(engine);

  //Add camera, light and meshes for scene0

  return scene0;
};

var createScene1 = function () {
  var scene1 = new BABYLON.Scene(engine);

  //Add camera, light and meshes for scene1

  return scene1;
};

//Any other code
var scene0 = createScene0();
var scene1 = createScene1();

engine.runRenderLoop(function () {
  scene0.render();
  scene1.render();
});
```

The playground has its own engine run render loop which needs to be stopped before running your own version:

```javascript
var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  //Add camera, light and meshes for scene

  ////////OTHER SCENE////////////////////
  var scene1 = new BABYLON.Scene(engine);

  //Add camera, light and meshes for scene

  ////////CONTROL ENGINE LOOP///////////
  setTimeout(function () {
    engine.stopRenderLoop();

    engine.runRenderLoop(function () {
      scene.render();
      scene1.render();
    });
  }, 500);

  return scene;
};
```

An example of switching the currently active scene on the Playground is as follows:
<Playground id="#P3E9YP" title="Switching Scenes" description="Simple example showing how to switch scenes." isMain={true} category="Scene"/>
