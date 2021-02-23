---
title: Exploding Meshes
image: 
description: Learn how to explode meshes in Babylon.js.
keywords: diving deeper, meshes, explode, mesh explode
further-reading:
video-overview:
video-content:
---

## How To Use MeshExploder

`MeshExploder` takes an array of meshes and increases/decreases distance to a center `Mesh`.

```javascript
var newExplosion = new BABYLON.MeshExploder(meshes, centerMesh);

newExplosion.explode();        //Explodes meshes away from center. Default 1.0.
```

|variable| description|
|----------|-----------|
|meshes| The array of meshes to explode/implode.|
|centerMesh (optional)| The mesh to be the center of explosion. Defaults to mesh closest to center of all meshes.|

`MeshExploder` explode function takes a number parameter to multiply the distance of explosion. Negative numbers implode. Zero resets meshes to original positions.

```javascript
newExplosion.explode(-2);      //Implodes
newExplosion.explode(0);       //Resets
```

## Example Usage
```javascript
var toExplodeArray = [];
var sphere1 = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments:12, diameter:2 }, scene);
sphere1.position.y += 2;
toExplodeArray.push(sphere1);

for (var alpha = 0; alpha < Math.PI*2; alpha+=Math.PI/10) {
    var sphere0 = BABYLON.MeshBuilder.CreateSphere('sphere0', { segments:8, diameter:.5 }, scene);
    sphere0.position.y = 2;
    sphere0.position.z = Math.cos(alpha)*1.25;
    sphere0.position.x = Math.sin(alpha)*1.25;
    toExplodeArray.push(sphere0);
}

var newExplosion = new BABYLON.MeshExploder(toExplodeArray);

newExplosion.explode(2);
```

# Example With Imported Objects
```javascript
var assetsManager = new BABYLON.AssetsManager(scene);
var meshTask = assetsManager.addMeshTask("model", "", "./", "model.gltf");

var meshes;

meshTask.onSuccess = function(task) {
    meshes = task.loadedMeshes;
}
assetsManager.load();
var newExplosion;
scene.executeWhenReady(function() {
    newExplosion = new BABYLON.MeshExploder(meshes);
    newExplosion.explode(2);
});
```

## Example Using the Babylon.js Viewer
```javascript
BabylonViewer.viewerManager.getViewerPromiseById('babylon-viewer').then(function (viewer) {
    viewerObservables(viewer);
});
var newExplosion;
function viewerObservables(viewer) {
    viewer.onModelLoadedObservable.add(function (model) {
        model.rootMesh.getScene().executeWhenReady(function() {
          newExplosion = new BABYLON.MeshExploder(model.meshes, model.meshes[0]);
          newExplosion.explode(2);
        });
    });
}
```