---
title: Introduction - Chapter 1 - First Scene
image: /img/getstarted/wireframe.png
description: Start your Babylon.js learning by creating your first scene and model.
keywords: getting started, start, chapter 1, first scene
further-reading: 
video-overview:
video-content:
---

# Introduction - Chapter 1 - First Scene

## First Scene and Model
Whether you are creating a whole world or just placing one model into a web page you need a [scene](/features/divingDeeper/scene) to contain the world or model, a [camera](/features/divingDeeper/cameras) to view it, a [light](/features/divingDeeper/lights) to illuminate it and, of course, at least one viewable object as a model. All models, whether just a box or a complex character, are made from a [mesh](/features/divingDeeper/mesh) of triangles or facets.


![wireframe](/img/getstarted/wireframe.png)  
Wireframe View Showing Mesh Triangles

A large number of meshes can be created directly within Babylon.js using code, or, as you will shortly see, imported as models from meshes created with other software. Let us start simply with a box.

Examples on these pages can be viewed in the playground, the place to try out Babylon.js live on the web, by clicking on their titles. To edit the code open them with ![open pg](/img/getstarted/openpg.png)

## Say Hello to Your First World

All projects using the Babylon.js Engine need a scene with a camera and a light added. Then we can create our box.

Wait...what is the Babylon.js Engine you ask? Excellent question. The engine variable seen below is the class that's responsible for interfacing with lower-level APIs such as WebGL, Audio, etc. The constructor to create a Babylon scene (the context that renders visuals to the screen) needs the engine to talk to these lower level APIs. This is why the engine variable is needed when creating a scene.

You can read more about the [engine class here](/typedoc/classes/babylon.engine). 

```javascript
const scene = new BABYLON.Scene(engine);

const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
```

Like most meshes created with MeshBuilder the box is created positioned with its center at the origin and needs three parameters. These are a name, *a string*,  options, *a JavaScript object*, and a scene. By leaving the options as an empty object *{}* with no properties the box defaults to one of unit size for its width, height and depth. 

To be usable in a playground we need to place these within a function called **createScene** which has to return a scene. The playground app takes care of the rest.

```javascript
const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));

    const box = BABYLON.MeshBuilder.CreateBox("box", {});

    return scene;
}
```

Since at this point there is only one scene you may notice that this parameter can be dropped from the camera, light and box as the default is for them to be placed in the current scene.

<Playground id="#KBS9I5" title="Introduction First Scene Playground" description="Introduction First Scene Playground." image="/img/playgroundsAndNMEs/gettingStartedFirstScene.jpg"/>

![box](/img/getstarted/house0.png)

Having created our box we can save, or export, the scene from within the playground by selecting the *Inspector*  
![inspector](/img/getstarted/pgpartmenu.png)    

followed by *Tools* and choose which type to export, the *.babylon* format or the *GLB* format.  
![Tools](/img/getstarted/export.png)

Now we have a file we can use it to demonstrate how to view it in a web page.

