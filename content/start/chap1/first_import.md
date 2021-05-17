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

The playgrounds on this page contain, for example, houses which are be positioned and rotated. Once we have introduced you to the basics of importing and putting your project on a web page we will give you details on how to do this with Babylon.js code.

## Importing a Scene or Model

When you put a model into a scene you are, in fact, loading it into a browser. As you will already know when you load anything into a website it is asynchronous. Before you can do anything with your models you need to know they have loaded. You can do this using the _ImportMeshAsync_ method of the _SceneLoader_, which has the form

```javascript
BABYLON.SceneLoader.ImportMeshAsync(model name, folder path, file name, scene);
```

The scene parameter is optional and will default to the current scene. The first parameter can be of three types depending whether you want to load all the models, just one model or a list of models.

```javascript
BABYLON.SceneLoader.ImportMeshAsync("", "/relative path/", "myFile"); //empty string all meshes
BABYLON.SceneLoader.ImportMeshAsync("model1", "/relative path/", "myFile"); //Name of model for one model
BABYLON.SceneLoader.ImportMeshAsync(["model1", "model2"], "/relative path/", "myFile"); //Array of model names
```

All of the above will only load the models and you will not be able to manipulate them in any way. You have set up a Promise object but not given any way to act after the Promise is fulfilled and it provides a result. Examples of this are in the following two playground which **only** import the named models.

<Playground id="#YNEAUL#11" title="Loading Your First Model" description="Load a model into a scene." image="/img/playgroundsAndNMEs/gettingStartedFirstModel.jpg"/>

<Playground id="#YNEAUL#12" title="Loading Multiple Models at Once" description="Load multiple models into a scene." image="/img/playgroundsAndNMEs/gettingStartedFirstModelwGrass.jpg"/>

To then act on the result we follow the Promise with the _then_ method to call a function with the _result_ of the _Promise_. The _result_ is an object containing, among others, the property _meshes_ which contains all the loaded models. We can use this array, or their names, to manipulate each mesh.

```javascript
BABYLON.SceneLoader.ImportMeshAsync("", "/relative path/", "myFile").then((result) => {
    result.meshes[1].position.x = 20;
    const myMesh1 = scene.getMeshByName("myMesh_1");
    myMesh1.rotation.y = Math.PI / 2;
});
```

This playground imports all the models and their positions are changed.

<Playground id="#YNEAUL#13" title="Modifying Models After Load" description="Load a model into a scene and modify their position after loading completes." image="/img/playgroundsAndNMEs/gettingStartedFirstModelLoadSuccess.jpg"/>

## Moving On

Having a working scene in the playground is one thing but you will want your game or app to work on your own website. So we will give you an HTML template to do just this.

## Warning

An obvious statement - different file types export models differently.

A less obvious statement - different file types may be changed when importing into Babylon.js.

You need to be aware of how the type you are using affects the outcome. It is not appropriate at this stage to go into detail but the following examples indicate why this is important.

1. Some software saves all meshes with a rotationQuaternion set and you cannot then use the _rotation_ method unless you first add

```javascript
myMesh.rotationQuaternion = null; //Any version of Babylon.js
```

```javascript
myMesh.rotation = BABYLON.Vector3(); //babylon.js versions > 4.00
```

2. The following two types were exported from exactly the same scene and imported into Babylon.js.

**.babylon**
A model is stored as one mesh, i.e. each house body and roof forms one house.

```
detached_house
ground
semi_house
```

**.glb**
A \_root\_ node is added to hold all the models and model parts are stored as sub-meshes.

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
