# How To Use Promises

## Introduction

Starting with v3.2, we introduced (without breaking backward compatibility of course) a new pattern: the promises.
To learn more about promises, please read this great [MDN web documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

In a nutshell, the basic idea is to rely on promises instead of having to deal with pyramids of callbacks intricated in a non easy to maintain way.
Regarding portability, Babylon.js provides a custom polyfill for browsers where promises are not supported so you can blindly use them.

## Examples
### Basic usage
```javascript
BABYLON.SceneLoader.LoadAssetContainerAsync("https://playground.babylonjs.com/scenes/", "skull.babylon", scene).then(function (container) {
    container.addAllToScene();
});
```
[Demo](https://playground.babylonjs.com/#JA1ND3#63)

### Chaining multiple promises together
```javascript
var scene = new BABYLON.Scene(engine);
var helper = scene.createDefaultVRExperience();
helper.webVRCamera.useStandingMatrixAsync().then(function (supported) {
    console.log(supported);
    return BABYLON.SceneLoader.AppendAsync("https://playground.babylonjs.com/scenes/", "skull.babylon", scene);
}).then(function () {
    //added to scene
});
```

### Using async/await with promises
Note: This is not supported in all browsers
```javascript
var main = async function () {
    var scene = new BABYLON.Scene(engine);
    var helper = scene.createDefaultVRExperience();
    var supported = await helper.webVRCamera.useStandingMatrixAsync();
    console.log(supported);
    await BABYLON.SceneLoader.AppendAsync("https://playground.babylonjs.com/scenes/", "skull.babylon", scene);
}
```

### Loading two glTF assets in parallel
```javascript
var scene = new BABYLON.Scene(engine);

var baseUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/";

Promise.all([
    BABYLON.SceneLoader.ImportMeshAsync(null, baseUrl + "BoomBox/glTF/", "BoomBox.gltf", scene).then(function (result) {
        result.meshes[0].position.x = 0.01;
    }),
    BABYLON.SceneLoader.ImportMeshAsync(null, baseUrl + "Avocado/glTF/", "Avocado.gltf", scene).then(function (result) {
        result.meshes[0].position.x = -0.01;
        result.meshes[0].position.y = -0.01;
        result.meshes[0].scaling.scaleInPlace(0.25);
    })
]).then(() => {
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.alpha += Math.PI;
});
```
[Demo](https://playground.babylonjs.com/#U2KKMK#1)
