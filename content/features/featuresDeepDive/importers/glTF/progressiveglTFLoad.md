---
title: Progressively Load .glTF Files
image: 
description: Learn about progressively loading .glTF files in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, progressive loading
further-reading:
video-overview:
video-content:
---

## Introduction

Downloading large assets is often slow even with a decent internet connection. Progressively loading discrete levels of detail (LODs) is one technique to combat this. The idea is to store multiple LODs in the asset and progressively load them from low to high quality. This method improves the time to first render since the lowest quality LOD is often dramatically smaller than the highest quality LOD.

<Playground id="#ARN6TJ#5" title="Progressive Loading With LODs" description="Simple Example of progressively loading assets with levels of detail." image="/img/playgroundsAndNMEs/divingDeeperProgressivelyLoading1.jpg"/>

This demo playground loads a glTF binary (a.k.a. GLB) asset which is a single file store on the server. It uses HTTP range requests to partially download parts of the GLB. The glTF loader minimizes the amount of HTTP requests sent to the server for optimal efficiency. It also shows progress of each stage of the download. Console logging is enabled to show what the glTF loader is doing.

## About MSFT_lod

[MSFT_lod](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/MSFT_lod) is a Microsoft glTF extension for discrete LODs. It has support for both node and material LODs. Babylon.js supports progressively loading these LODs, for the purpose of reducing the time to first render, as well as selecting LODs based on screen coverage.  
You can use the property `MSFT_screencoverage` in the gltf file to indicate to Babylon.js which LOD level to select. Screen coverage is calculated as a ratio between the screen surface the mesh occupies, and the total screen surface.

[This playground](https://playground.babylonjs.com/#2YZFA0#228) demonstrates loading a simple gltf file that contains 3 LOD levels. You can retrieve the file [here](https://playground.babylonjs.com/scenes/msft-lod.gltf) if you want to inspect it.

There are not many tools that can create assets with MSFT_lod at the moment. The car asset in the first demo above is exported from [Adobe Dimension](https://www.adobe.com/products/dimension.html) for sharing on the web. [BabylonPolymorph](https://github.com/BabylonJS/BabylonPolymorph) will eventually be able to do this, but this project is still very early. There is also [glTF-Toolkit](https://github.com/Microsoft/glTF-Toolkit) for Windows Mixed Reality which unfortunately is not well suited for Babylon.js, but perhaps it can be modified to work better.

## Using HTTP Range Requests

A glTF asset can be either loose files or packed together into a glTF binary (GLB). Serving files as GLB on a server is typically not a good idea except when using [HTTP range requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests). Using range requests will enable the loader to partially download a range of the asset instead of all at once. The glTF loader in Babylon.js supports range requests. It can be enabled like this:

```javascript
BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(function (loader) {
    if (loader.name === "gltf") {
        loader.useRangeRequests = true;
    }
});
```

## Caveats
- The HTTP server hosting the asset must support range requests.
- The LODs in the GLB should be authored with a contiguous range per LOD for maximum efficiency.

## Showing Progress

When loading large assets either using loose files or with range requests, it is useful to show the download progress. Progress is supported through the progress callback of `BABYLON.SceneLoader` methods which is a small subset of the HTTP request [progress event](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent). Here is an example from the demo above:

```javascript
BABYLON.SceneLoader.AppendAsync(url, undefined, scene, function (event) {
    // Compute the percentage for each stage unless the length is not computable.
    // The lengthComputable is often false when serving content that is gzipped.
    const percentage = event.lengthComputable ? " " + Math.floor(event.loaded / event.total * 100) + "%" : "";

    // Check if an LOD is loading yet.
    if (lodNext === null) {
        // Ignore GLB header progress.
        if (event.total === 20) return;

        // Show that the glTF is downloading.
        bottomLine.text = "Loading glTF..." + percentage;
    }
    else {
        // Show that the LOD is downloading.
        bottomLine.text = "Loading '" + lodNames[lodNext] + "' LOD..." + percentage;
    }
}, ".glb")
```

## Key Notes
- Gzipped content hosted on server often results in `lengthComputable` equaling `false` which in turn causes the `total` to be zero. When this happens, the only choices are to not show the progress or show the number of bytes downloaded instead.
- When using HTTP range requests with a GLB, the first thing that is downloaded is the GLB header which downloads very quickly and is almost always 20 bytes loaded and 20 bytes total when the progress event fires. Ignore it by checking when `total` is exactly 20.

## Debugging LODs

It is useful to stop at a specific LOD to inspect the results. This can be achieved by setting the `maxLODsToLoad` property on the MSFT_lod loader extension:

```javascript
BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(function (loader) {
    if (loader.name === "gltf") {
        loader.onExtensionLoadedObservable.add(function (extension) {
            if (extension.name === "MSFT_lod") {
                // Stop at the first LOD.
                extension.maxLODsToLoad = 1;
            }
        }
    }
}
```

## Enabling Logging

Enabling logging is often useful to understand and debug the loading of a glTF asset. This is especially true for MSFT_lod assets. Logging can be enabled like this:

```javascript
BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(function (loader) {
    if (loader.name === "gltf") {
        loader.loggingEnabled = true;
    }
});
```

Here is an example console log from the demo above:
```
BJS - [16:31:29]: Binary version: 2
BJS - [16:31:29]: JSON length: 59200
BJS - [16:31:29]: Loading 0
BJS - [16:31:29]: Asset version: 2.0
BJS - [16:31:29]: Asset generator: Adobe Dimension - 9ce31d2be91132df879a9b9136f9df4ef7b7fa2c
BJS - [16:31:29]: LOADING
BJS - [16:31:29]: /scenes/0 scene
BJS - [16:31:29]:   /nodes/0 render_camera_n3d
BJS - [16:31:29]:     /cameras/0 render_camera
BJS - [16:31:29]:   /nodes/1 ground_plane_n3d
BJS - [16:31:29]:   /nodes/2 sportsCar_4K
BJS - [16:31:29]:     /nodes/3 car_lores.obj
BJS - [16:31:29]:       /nodes/4 g car_lores_gt_lores_lowdetails group1
BJS - [16:31:29]:         /nodes/5 car_lores_gt_lores_lowdetails group1
BJS - [16:31:29]:           /meshes/0 car_lores_gt_lores_lowdetails group1
BJS - [16:31:29]:             /meshes/0/primitives/0
BJS - [16:31:29]:               deferred
BJS - [16:31:30]:               /materials/12/extensions/MSFT_lod
BJS - [16:31:30]:                 /materials/0 details_lod2
BJS - [16:31:30]:                   /materials/0/normalTexture
BJS - [16:31:30]:                     /textures/2 tmp_image_pie_10f1_2c55_943e
BJS - [16:31:30]:                       /images/2 normal
BJS - [16:31:30]:                         deferred
BJS - [16:31:30]:                   /materials/0/occlusionTexture
BJS - [16:31:30]:                     /textures/1 ambient_roughness_metallic
BJS - [16:31:30]:                       /images/1 ambient_roughness_metallic
BJS - [16:31:30]:                         deferred
...
BJS - [16:31:32]: Loading buffer range [0-4864522]
BJS - [16:31:37]: READY
BJS - [16:31:37]: Loading buffer range [4864523-8856965]
BJS - [16:31:39]: Loaded material LOD 1
BJS - [16:31:39]: Loading buffer range [8856966-67953580]
BJS - [16:32:00]: Loaded material LOD 2
BJS - [16:32:00]: COMPLETE
```

Note the `deferred` message when loading primitives and images. The loader is deferring the download until it has determined what ranges of the GLB is necessary for the LODs. Once the ranges are determined, the loader loads the range for the first LOD before the state changes to `READY` which indicates the asset is ready for viewing. Then it loads the remaining LODs in sequence until all the LODs are loaded before the state changes to `COMPELTE` which indicates the asset is completely loaded.