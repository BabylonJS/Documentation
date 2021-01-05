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
then put the relevant camera, lights and meshes inside each scene and call them in the engine run render loop

```javascript
engine.runRenderLoop(function () {
  scene0.render();
  scene1.render();
});
```
When you want the meshes of both scenes to be visible at the same time then set the 'autoClear' of scene1 (the last rendered scene(s)) to false.

However there is a difference between writing multiple scenes within your own projects and trying them out in the playground.

In your own project it is easy enough to set up create scene functions for each scene and call them in the engine run render loop. For example

```javascript
var createScene0 = function () {
    var scene0 = new BABYLON.Scene(engine);

    //Add camera, light and meshes for scene0

	return scene0;
}

var createScene1 = function () {
    var scene1 = new BABYLON.Scene(engine);

    //Add camera, light and meshes for scene1

	return scene1;
}

//Any other code
var scene0 = createScene0();
var scene1 = createScene1();

engine.runRenderLoop(function () {
  scene0.render();
  scene1.render();
});
```

In the playground the create scene function is wrapped by the code running the playground and so the easiest method is just to create a new scene within the function and add a camera, light and meshes to it. Also the playground has its own engine run render loop which needs to be stopped before running your own version, the trick is to use a setTimeout. Putting these together playground code can look like this example

```javascript
var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    //Add camera, light and meshes for scene

    ////////OTHER SCENE////////////////////
    var scene1 = new BABYLON.Scene(engine);

    //Add camera, light and meshes for scene

    ////////CONTROL ENGINE LOOP///////////
    setTimeout(function() {
        engine.stopRenderLoop();

        engine.runRenderLoop(function () {
            scene.render();
            scene1.render();
        });
    }, 500);

	return scene;
}
```


## Switch Scenes
You might want a user to be able to switch between scenes, remember that the Babylon GUI is a good way to set triggers for this to be possible. 

An example of one way to do this is

```javascript
var clicks = 0;
var showScene = 0;
var advancedTexture;
   

var createGUI = function(scene, showScene) {             
    switch (showScene) {
        case 0:            
            advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene0);
        break
        case 1:            
            advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene1);
        break
    }
    var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Scene " + ((clicks + 1) % 2));
    button.width = 0.2;
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    advancedTexture.addControl(button);

    
    button.onPointerUpObservable.add(function () {       
        clicks++;                   
    });
}  

createGUI(scene, showScene);

engine.runRenderLoop(function () {
    if(showScene != (clicks % 2)){
        showScene = clicks % 2;          
        switch (showScene) {
            case 0:                    
                advancedTexture.dispose();
                createGUI(scene0, showScene);
                scene0.render();
            break
            case 1:
                advancedTexture.dispose();
                createGUI(scene1, showScene);
                scene1.render();
            break
        }
    }
}); 
```

<Playground id="#MXCRPS#1" title="Switching Scenes" description="Simple example showing how to switch scenes."/>

## Overlay Multiple Scenes

Suppose you want a first person shooter type project with a 3D foreground representing the user and then a background scene representing what the user is tracking. In this case you want the meshes in both the foreground and background visible. To do this you want the foreground meshes drawn over the background, that is you do not want the render canvas cleared when rendering the foreground. In this case set 'autoClear' to false 

```javascript

//other code

var foregroundScene = new BABYLON.Scene(engine);
foregroundScene.autoClear = false;

//other code

engine.runRenderLoop(function () {
  backgroundScene.render();
  foregroundScene.render();
});
``` 

<Playground id="#L0IMUD#1" title="Overlaying Scenes" description="Simple example of overlaying scenes."/>