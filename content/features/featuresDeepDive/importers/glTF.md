---
title: .glTF File Loader Plugin
image:
description: Learn about the .glTF File Loader Plugin available in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, .glTF, gltf
further-reading:
video-overview:
video-content:
---

## Setup

You can find the loader here [here](https://cdn.babylonjs.com/loaders/babylon.glTFFileLoader.js)

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

## Full Version

This loader supports both glTF 1.0 and 2.0 and will use the correct loader based on the glTF version string.

```html
<script src="babylon.js"></script>
<script src="babylon.glTFFileLoader.js"></script>
```

## Loading files locally

By default, the gltf loader will request additional files for [draco compression](https://google.github.io/draco/) from _preview.babylonjs.com_. In case you want to deliver these files locally (e.g. for GDPR compliance), you can set the [DracoCompression.Configuration](https://doc.babylonjs.com/typedoc/classes/BABYLON.DracoCompression) object to use local files:

```typescript
DracoCompression.Configuration = {
  decoder: {
    wasmUrl: "/babylon-draco-files/draco_wasm_wrapper_gltf.js",
    wasmBinaryUrl: "/babylon-draco-files/draco_decoder_gltf.wasm",
    fallbackUrl: "/babylon-draco-files/draco_decoder_gltf.js",
  },
};
```

Be sure to download the files first (from `https://preview.babylonjs.com/[FILENAME]`) and put them in a local path (`public/babylon-draco-files`, in this case).

## Warning

A \_root\_ node is added to hold all the **glTF** and **glb** models and model parts are stored as sub-meshes. This is so applications that save models using a right handed system will be loaded correctly into Babylon.js when you add to your create scene function

```javascript
scene.useRightHandedSystem = true;
```

This also means that _loadedMeshes[0]_ will point to the added \_root\_ node and _loadedMeshes[1]_ will point to your first loaded mesh.

## Version 2 Only

This loader supports only glTF 2.0 and will fail to load glTF 1.0.

```html
<script src="babylon.js"></script>
<script src="babylon.glTF2FileLoader.js"></script>
```

See [Skinning](/features/featuresDeepDive/importers/glTF/glTFSkinning) for details on how skinning is implemented in Babylon.js for glTF 2.0.

## Version 1 Only

This loader supports only glTF 1.0 and will fail to load glTF 2.0.

```html
<script src="babylon.js"></script>
<script src="babylon.glTF1FileLoader.js"></script>
```

## Loading the Scene

Use one of the static function on the `SceneLoader` to load a glTF asset.
See [Load from any file type](/features/featuresDeepDive/importers/loadingFileTypes).

See an example here: <Playground id="#WGZLGJ" title="Load a glTF Asset" description="Simple example showing how load a .glTF asset into your scene." image="/img/playgroundsAndNMEs/divingDeeperglTF1.jpg" isMain={true} category="Import"/>

## API (Version 2)

## Properties and Methods

See the available [properties and methods](/typedoc/classes/babylon.gltffileloader) from the API documentation.

## Extensions

See the available [extensions](/typedoc/modules/babylon.gltf2.loader.extensions) from the API documentation.

## API (Version 1)

## Properties

### IncrementalLoading

Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders. Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled. Defaults to true.

```javascript
BABYLON.GLTFFileLoader.IncrementalLoading = false;
```

### HomogeneousCoordinates

Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters. Defaults to false.

```javascript
BABYLON.GLTFFileLoader.HomogeneousCoordinates = true;
```

## Extensions

[KHR_binary_glTF](https://github.com/KhronosGroup/glTF/tree/master/extensions/1.0/Khronos/KHR_binary_glTF)  
[KHR_materials_common](https://github.com/KhronosGroup/glTF/tree/master/extensions/1.0/Khronos/KHR_materials_common)
