# Getting Started - Working With Models
## A Walking Figure
Sometimes the easiest way to add a model to a scene is to obtain one from elsewhere. This could be one you have created in your favorite model building software or one your have purchased.

The *Dude* model is one that has been built with its own skeleton animation.

![dude walking](/img/getstarted/dude.gif);

Once imported the character and its skeleton are obtained from the meshes and skeletons properties of the results object.

```javascript
BABYLON.SceneLoader.ImportMeshAsync("mesh name", "path to model", "model file", scene).then((result) => {
    var dude = result.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
                
    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
});
```

https://www.babylonjs-playground.com/#SFW46K

Currently the character is set in one position and we would like him to walk around the village. This time instead of creating another animation object for the character we will change it position and orientation before each frame is rendered. 