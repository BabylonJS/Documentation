---
title: Save Your Scene or Meshes
image:
description: Using the scene serializer
keywords: babylon.js, exporter, export, scene, serializer
further-reading:
video-overview:
video-content:
---

Any scene or mesh can be downloaded as a file to you computer. This is achieved with the [scene serializer](/typedoc/classes/babylon.sceneserializer)

## Scene

Include the following code in your project to download your scene

```javascript
var objectUrl;
function doDownload(filename, scene) {
  if (objectUrl) {
    window.URL.revokeObjectURL(objectUrl);
  }

  var serializedScene = BABYLON.SceneSerializer.Serialize(scene);

  var strScene = JSON.stringify(serializedScene);

  if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9) {
    filename += ".babylon";
  }

  var blob = new Blob([strScene], { type: "octet/stream" });

  // turn blob into an object URL; saved as a member, so can be cleaned out later
  objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

  var link = window.document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  var click = document.createEvent("MouseEvents");
  click.initEvent("click", true, false);
  link.dispatchEvent(click);
}
```

The following playground is an example of creating a scene, using the serializer, converting it to a JSON file and then giving the option of downloading it to your computer.  
PG: <Playground id="#1AGCWP#1" title="Save Scene" description="Example of saving a scene." image="/img/playgroundsAndNMEs/pg-1AGCWP-1.png"/>

## Meshes

The following code shows the changes necessary to just download a mesh to your computer.

```javascript
var objectUrl;
function doDownload(filename, mesh) {
  if (objectUrl) {
    window.URL.revokeObjectURL(objectUrl);
  }

  var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(mesh);

  var strMesh = JSON.stringify(serializedMesh);

  if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9) {
    filename += ".babylon";
  }

  var blob = new Blob([strMesh], { type: "octet/stream" });

  // turn blob into an object URL; saved as a member, so can be cleaned out later
  objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

  var link = window.document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  var click = document.createEvent("MouseEvents");
  click.initEvent("click", true, false);
  link.dispatchEvent(click);
}
```
