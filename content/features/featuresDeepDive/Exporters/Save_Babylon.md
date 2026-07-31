---
title: Save Your Scene or Meshes
image:
description: Using the scene serializer
keywords: babylon.js, exporter, export, scene, serializer
further-reading:
video-overview:
video-content:
---

Any scene or mesh can be downloaded as a file to your computer. This is achieved with the [scene serializer](/typedoc/classes/babylon.sceneserializer)

## Scene

Include the following code in your project to download your scene

```javascript
let objectUrl;
function doDownload(filename, scene) {
  if (objectUrl) {
    window.URL.revokeObjectURL(objectUrl);
  }

  const serializedScene = BABYLON.SceneSerializer.Serialize(scene);

  const strScene = JSON.stringify(serializedScene);

  if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9) {
    filename += ".babylon";
  }

  const blob = new Blob([strScene], { type: "octet/stream" });

  BABYLON.Tools.Download(blob, filename);
}
```

The following playground shows how to create a scene, use the serializer, convert it to a JSON file, and then offer it for download to your computer.  
PG: <Playground id="#1AGCWP#1" title="Save Scene" description="Example of saving a scene." image="/img/playgroundsAndNMEs/pg-1AGCWP-1.webp"/>

## Meshes

The following code shows the changes needed to download only a mesh to your computer.

```javascript
let objectUrl;
function doDownload(filename, mesh) {
  if (objectUrl) {
    window.URL.revokeObjectURL(objectUrl);
  }

  const serializedMesh = BABYLON.SceneSerializer.SerializeMesh(mesh);

  const strMesh = JSON.stringify(serializedMesh);

  if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9) {
    filename += ".babylon";
  }

  const blob = new Blob([strMesh], { type: "octet/stream" });

  BABYLON.Tools.Download(blob, filename);
}
```
