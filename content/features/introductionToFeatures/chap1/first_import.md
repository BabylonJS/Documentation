---
title: Getting Started - Chapter 1 - Working with Models
image:
description: Learn to load your first model into a Babylon.js scene.
keywords: getting started, start, chapter 1, first model, import
further-reading:
video-overview:
video-content:
---

# Getting Started - Working with Models

The playgrounds on this page contain models (in this example, houses) which can be positioned, rotated and scaled. Once the basics (such as importing a model and putting your project on a web page) have been introduced, we will give you details on how to accomplish this with Babylon.js.

## Importing a Scene or Model

When you add a model to a scene, you are loading it through the browser. As you likely already know, loading anything from a website is an asynchronous function. Therefore, before you can do anything with your models, you first must ensure they have been loaded successfully. You can do this using the _ImportMeshAsync_ method of the _SceneLoader_, which can be done as follows:

```javascript
BABYLON.ImportMeshAsync(folder_path + file_name, scene, optionalOptions);
```

The scene parameter is optional and will default to the current scene. In the options you can specify which meshes to load:

```javascript
BABYLON.ImportMeshAsync("/relative path/myFile"); //Empty string loads all meshes
BABYLON.ImportMeshAsync("/relative path/myFile", scene, { meshNames: "model1" }); //Name of the model loads one model
BABYLON.ImportMeshAsync("/relative path/myFile", scene, { meshNames: ["model1", "model2"] }); //Array of model names
```

Note that any of the calls above will only load the models; however, you will not be able to manipulate them in any way. Internally, a Promise object is setup and returned, but the above code does nothing with the result of that Promise. Examples of this are in the following two playgrounds, which **only** import the named models.

<Playground id="#YNEAUL#5260" title="Loading Your First Model" description="Load a model into a scene." image="/img/playgroundsAndNMEs/gettingStartedFirstModel.jpg"/>

<Playground id="#YNEAUL#5261" title="Loading Multiple Models at Once" description="Load multiple models into a scene." image="/img/playgroundsAndNMEs/gettingStartedFirstModelwGrass.jpg"/>

Therefore, in order to act on the result and manipulate the objects, we follow the Promise with the _then_ method to call a function with the _result_ of the _Promise_. The _result_ is an object containing, among other things, the property _meshes_ which contains all the loaded models. We can use this array, or their names, to manipulate each mesh.

```javascript
BABYLON.ImportMeshAsync("/relative path/myFile").then((result) => {
  result.meshes[1].position.x = 20;
  const myMesh1 = scene.getMeshByName("myMesh_1");
  myMesh1.rotation.y = Math.PI / 2;
});
```

The following playground imports all models and changes their positions:

<Playground id="#YNEAUL#5262" title="Modifying Models After Load" description="Load a model into a scene and modify their position after loading completes." image="/img/playgroundsAndNMEs/gettingStartedFirstModelLoadSuccess.jpg"/>

## Moving On

Having a working scene in the playground is one thing, but you will ultimately want your game or application to run on your own website. In the next section, we will provide an HTML template to do just this.

## Warning

An obvious statement - different file types export models differently.

A less obvious statement - different file types may be changed when importing into Babylon.js.

You need to be aware of how the type you are using affects the outcome. It is not appropriate at this stage to go into detail but the following examples indicate why this is important.

1. Some software saves all meshes with a rotationQuaternion set and you cannot then use the _rotation_ methods unless you first add:

```javascript
myMesh.rotationQuaternion = null; //Any version of Babylon.js
```

```javascript
myMesh.rotation = BABYLON.Vector3.Zero(); //babylon.js versions > 4.00
```

2. The following two types were exported from exactly the same scene and imported into Babylon.js:

**.babylon**
A model is stored as one mesh, i.e. each house body and roof forms one house.

```
detached_house
ground
semi_house
```

**.glb**
A \_root\_ node is added to hold all the models and model parts, which are stored as sub-meshes.

```
_root_
    detached_house
        detached_house primitive0
        detached_house primitive1
    ground
    semi_house
        semi_house primitive0
        semi_house primitive1
```
