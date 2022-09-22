---
title: Asset Containers
image: 
description: Learn all about using asset containers in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, asset containers
further-reading:
video-overview:
video-content:
---

An AssetContainer can be used to manage a list of assets (like nodes, cameras, lights, meshes, etc..). This assets are still linked to a scene but are not taken in account. Consider asset containers like pool of entities.

## Creating an AssetContainer

It can be created manually
```javascript
var container = new BABYLON.AssetContainer(scene);
```
Or by loading from a file. See [loading from files](/features/featuresDeepDive/importers/loadingFileTypes)

## Adding or removing assets to the scene

The container can then be used to add or remove contents of the container from the scene.
```javascript
// Add all objects in the asset container to the scene
container.addAllToScene()

// Remove all objects in the container from the scene
container.removeAllFromScene()
```

<Playground id="#5NFRVE#1" title="Asset Container Adding and Removing Assets" description="Simple Example of adding and removing asset container assets into your scene." image="/img/playgroundsAndNMEs/divingDeeperAssetContainer1.jpg"/>

This can be used to add/remove all objects in a scene without the need to exit WebVR. <Playground id="#JA1ND3#48" title="Asset Container Adding and Removing Assets in WebVR" description="Simple Example of adding and removing asset container assets into your WebVR scene." image="/img/playgroundsAndNMEs/divingDeeperAssetContainer2.jpg"/>

When creating assets manually the moveAllFromScene method can be used to move all assets currently in a scene into an AssetContainer and remove them from the scene for later use. 
```javascript
var keepAssets = new BABYLON.KeepAssets();
keepAssets.cameras.push(camera);
container.moveAllFromScene(keepAssets);
```
<Playground id="#5NFRVE#3" title="Moving Assets Into an Asset Container" description="Simple Example of moving assets in a scene into an asset container."/> 

## Duplicating the models
Asset containers can also be used as "templates" to duplicate models without reloading them.

To do so, you only need to call:
```
let entries = container.instantiateModelsToScene();
```

The return entries object will contain:
- rootNodes: A list of all the root nodes created by the duplication process
- skeletons: A list of all the skeletons created by the duplication process
- animationGroups: A list of all the animation groups created by the duplication process

<Playground id="#S7E00P" title="Instantiating Asset Container Assets" description="Simple Example of using asset containers as templates to dupliate assets in a scene." image="/img/playgroundsAndNMEs/divingDeeperAssetContainer3.jpg"/>

You can also set two parameters to the call to `instantiateModelsToScene`:
- nameFunction: This will let you decide what will be the name of the cloned entities (instead of "Clone of...")
- cloneMaterials: By default materials are not cloned but shared. With this parameter you can force the system to also clone the materials

```
var entries = container.instantiateModelsToScene(name => "p" + name, true);
```