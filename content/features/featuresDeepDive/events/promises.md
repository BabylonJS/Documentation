---
title: Promises
image:
description: Learn all about the power of promises in Babylon.js.
keywords: diving deeper, events, promises
further-reading:
video-overview:
video-content:
---

# How To Use Promises

## Introduction

Starting with v3.2, we introduced (without breaking backward compatibility of course) a new pattern: the promises.
To learn more about promises, please read this great [MDN web documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

In a nutshell, the basic idea is to rely on promises instead of having to deal with pyramids of callbacks intricated in a non easy to maintain way.
Regarding portability, Babylon.js provides a custom polyfill for browsers where promises are not supported so you can blindly use them.

## Examples

### Basic usage

```javascript
BABYLON.LoadAssetContainerAsync("https://playground.babylonjs.com/scenes/skull.babylon", scene).then(function (container) {
  container.addAllToScene();
});
```

<Playground id="/#JA1ND3#1052" title="Simple Promise Example" description="Simple example loading an asset into a scene after the file has been loaded." image="/img/playgroundsAndNMEs/divingDeeperPromises1.jpg"/>

### Chaining multiple promises together

```javascript
const scene = new BABYLON.Scene(engine);
const xrPromise = scene.createDefaultXRExperienceAsync();
xrPromise
  .then((xrExperience) => {
    return BABYLON.AppendSceneAsync("https://playground.babylonjs.com/scenes/skull.babylon", scene);
  })
  .then(function () {
    // xr resolved, skull added to the scene
  });
```

### Using async/await with promises

Note: This is not supported in all browsers

```javascript
const main = async function () {
  const scene = new BABYLON.Scene(engine);
  const xrPromise = await scene.createDefaultXRExperienceAsync();
  return BABYLON.AppendSceneAsync("https://playground.babylonjs.com/scenes/skull.babylon", scene);
};
```

### Loading two glTF assets in parallel

```javascript
const scene = new BABYLON.Scene(engine);

const baseUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/";

Promise.all([
  BABYLON.ImportMeshAsync(baseUrl + "BoomBox/glTF/BoomBox.gltf", scene).then(function (result) {
    result.meshes[0].position.x = 0.01;
  }),
  BABYLON.ImportMeshAsync(baseUrl + "Avocado/glTF/Avocado.gltf", scene).then(function (result) {
    result.meshes[0].position.x = -0.01;
    result.meshes[0].position.y = -0.01;
    result.meshes[0].scaling.scaleInPlace(0.25);
  }),
]).then(() => {
  scene.createDefaultCameraOrLight(true, true, true);
  scene.activeCamera.alpha += Math.PI;
});
```

<Playground id="#U2KKMK#308" title="Load 2 Asset At Once" description="Simple example of loading 2 assets at once inside of a promise." image="/img/playgroundsAndNMEs/divingDeeperPromises2.jpg"/>
