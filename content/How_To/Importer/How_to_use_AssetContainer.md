An AssetContainer can be used to manage a list of assets (like nodes, cameras, lights, meshes, etc..). This assets are still linked to a scene but are not taken in account. Consider asset containers like pool of entities.

# Creating an AssetContainer

It can be created manually
```javascript
var container = new BABYLON.AssetContainer(scene);
```
Or by loading from a file. See [loading from files](/How_To/Load_From_Any_File_Type)

# Adding or removing assets to the scene

The container can then be used to add or remove contents of the container from the scene.
```javascript
// Add all objects in the asset container to the scene
container.addAllToScene()

// Remove all objects in the container from the scene
container.removeAllFromScene()
```

[Demo](https://www.babylonjs-playground.com/#5NFRVE#1)
This can be used to add/remove all objects in a scene without the need to exit WebVR. [Demo](https://www.babylonjs-playground.com/#JA1ND3#48)

When creating assets manually the moveAllFromScene method can be used to move all assets currently in a scene into an AssetContainer and remove them from the scene for later use. 
```javascript
var keepAssets = new BABYLON.KeepAssets();
keepAssets.cameras.push(camera);
container.moveAllFromScene(keepAssets);
```
[Demo](https://www.babylonjs-playground.com/#5NFRVE#3)

# Duplicating the models
Asset containers can also be used as "templates" to duplicate models without reloading them.

To do so, you only need to call:
```
let entries = container.instantiateModelsToScene();
```

The return entries object will contain:
- rootNodes: A list of all the root nodes created by the duplication process
- skeletons: A list of all the skeletons created by the duplication process
- animationGroups: A list of all the animation groups created by the duplication process

[Demo](https://www.babylonjs-playground.com/#S7E00P)

You can also set two parameters to the call to `instantiateModelsToScene`:
- nameFunction: This will let you decide what will be the name of the cloned entities (instead of "Clone of...")
- cloneMaterials: By default materials are not cloned but shared. With this parameter you can force the system to also clone the materials

```
var entries = container.instantiateModelsToScene(name => "p" + name, true);
```
