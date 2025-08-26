---
title: .glTF File Loader Plugin
image:
description: Learn about the .glTF File Loader Plugin available in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, .glTF, gltf
further-reading:
video-overview:
video-content:
---

## Overview

The .glTF File Loader Plugin works in conjunction with Babylon's scene loader functions to import [glTF](https://www.khronos.org/gltf/) files.

<Alert severity="info" description="glTF 1.0 is deprecated. This page is primarily focused on glTF 2.0." />

## Setup

The recommended way to use the .glTF file loader plugin is via the `@babylonjs/loaders` ES6 NPM package. Please read [Loading Any File Type](/features/featuresDeepDive/importers/loadingFileTypes#npm) for more information about installing and using the loader package in your own build.

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

But for testing purposes, the following compiled JS files are offered on the public CDN, at https://preview.babylonjs.com/loaders/:

- `babylon.glTF2FileLoader.js` - Only glTF 2.0
- `babylon.glTF1FileLoader.js` - Only glTF 1.0
- `babylon.glTFFileLoader.js` - Both glTF 2.0 and 1.0
- `babylonjs.loaders.js` - The full Babylon loaders package
- `babylonjs.loaders.min.js` - The full Babylon loaders package, minified

### Usage

When using the `@babylonjs/loaders` package, it is preferable to register the glTF file importer via the top level dynamic loader registration function `registerBuiltInLoaders`.

If you want to import the glTF file importer statically (not recommended), you can do so via:

```javascript
import "@babylonjs/loaders/glTF/2.0";
```

You can read more about [NPM support](/setup/frameworkPackages/npmSupport).

### Loading Codecs Locally

If your glTF files use any of the following features, you'll need to take a few extra steps for production use.

| Feature                               | glTF extension             | Babylon interface        |
| ------------------------------------- | -------------------------- | ------------------------ |
| Draco compression                     | KHR_mesh_draco_compression | DracoDecoder             |
| Meshopt compression                   | EXT_meshopt_compression    | MeshoptCompression       |
| .ktx2, or Basis Universal Compression | KHR_texture_basisu         | KhronosTextureContainer2 |

<br/>
Babylon performs extra work at load time to decompress the data that uses these extensions. By default, it will:
- Download the required decoder files from the Babylon CDN.
- Use web workers (if available) to execute the code.

This behavior can lead to issues like GDPR compliance concerns or CSP violations, so we recommend hosting these resources yourself.

How you do this depends on your setup. In general, there are two approaches.

#### Via URL Configuration

You can provide a different base URL (or a full URL) for all decoders, or for each decoder individually. This way, Babylon loads them from your server instead of the CDN. Read how to do this in the
[CDN Support docs](/setup/frameworkPackages/CDN#deploying-your-own-version-of-the-resources).

#### Via Resource Injection

Alternatively, you can inject the decoder modules directly (or workers preloaded with them) instead of relying on Babylon to fetch them.
Follow the steps in the [ESM/NPM Support docs](/setup/frameworkPackages/es6Support#ktx2-decoder-packages) to set this up with the KTX2 and Draco decoders. (_Note: Meshopt compression does not yet support injection._)

## Loading the Scene

Use one of scene loader functions to load a glTF asset.
See [Load from any file type](/features/featuresDeepDive/importers/loadingFileTypes).

See an example here: <Playground id="#WGZLGJ#11018" title="Load a glTF Asset" description="Simple example showing how load a .glTF asset into your scene." image="/img/playgroundsAndNMEs/divingDeeperglTF1.jpg" isMain={true} category="Import"/>

## Extensions

See the built in [extensions](/typedoc/modules/babylon.gltf2.loader.extensions) from the API documentation.

You can also [create your own extensions](/features/featuresDeepDive/importers/glTF/createExtensions).

## Options

Each of the scene loader functions accepts an options object, where you can customize the behavior of the glTF loader plugin. See the [full list of available glTF options](/typedoc/classes/BABYLON.GLTFLoaderOptions) from the API documentation.

### Disabling Extensions

To disable an extension on load, set its `enabled` option:

```typescript
LoadAssetContainerAsync("asset.glb", scene, {
  pluginOptions: {
    gltf: {
      extensionOptions: {
        KHR_texture_basisu: {
          enabled: false,
        },
        myCustomExtension: {
          enabled: false,
        },
      },
    },
  },
});
```

## Behavior

### The \_\_root\_\_ node

A \_root\_ node is added to hold all the **glTF** and **glb** models and model parts are stored as sub-meshes. This is so applications that save models using a right handed system will be loaded correctly into Babylon.js when you add to your create scene function

```javascript
scene.useRightHandedSystem = true;
```

This also means that _loadedMeshes[0]_ will point to the added \_root\_ node and _loadedMeshes[1]_ will point to your first loaded mesh.

### Skinning

See [Skinning](/features/featuresDeepDive/importers/glTF/glTFSkinning) for details on how skinning is implemented in Babylon.js for glTF 2.0.

## Properties and Methods

See the available [properties and methods](/typedoc/modules/babylon.gltffileloader) from the API documentation.

## Version 1 Only

Though deprecated, Babylon maintains a dedicated glTF loader plugin for glTF 1.0.

### Properties

#### IncrementalLoading

Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders. Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled. Defaults to true.

```javascript
BABYLON.GLTFFileLoader.IncrementalLoading = false;
```

#### HomogeneousCoordinates

Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters. Defaults to false.

```javascript
BABYLON.GLTFFileLoader.HomogeneousCoordinates = true;
```
