---
title: Loading Any File Type
image:
description: Learn how to import any file type in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing
further-reading:
  - title: How to get Babylon.js
    url: /setup/frameworkPackages/frameworkVers
  - title: Use the glTF File Loader Plugin
    url: /features/featuresDeepDive/importers/glTF
  - title: Use the OBJ File Loader Plugin
    url: /features/featuresDeepDive/importers/oBJ
  - title: Use the STL File Loader Plugin
    url: /features/featuresDeepDive/importers/stl
  - title: Load Files with Assets Manager
    url: /features/featuresDeepDive/importers/assetManager
  - title: Available Meshes for Importing into Playground
    url: /toolsAndResources/assetLibraries/availableMeshes
  - title: Using External Assets in the Playground
    url: /toolsAndResources/thePlayground/externalPGAssets
  - title: SceneLoader
    url: /typedoc/classes/babylon.sceneloader
video-overview:
video-content:
---

## How to Use Scene Loader

### Basic Usage

To load a file of a given type, Babylon must first have a reference to the plugin for that file type.

Currently plugins can be found for:

- [.gltf](/features/featuresDeepDive/importers/glTF) (also used for binary version .glb)
- [.obj](/features/featuresDeepDive/importers/oBJ)
- [.stl](/features/featuresDeepDive/importers/stl)
- .splat

You can also create your own [custom importer](/features/featuresDeepDive/importers/createImporters) for additional file types.

#### CDN

To quickly add support for all loaders the following script can be added to your page:

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

##### Production links

```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```

##### Preview links (useful to test for changes to loaders)

```html
<script src="https://preview.babylonjs.com/babylon.js"></script>
<script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```

Once the plugin is referenced, scene loader functions can be used to load model files.

#### NPM

When you have a built/bundled app, you can use https://www.npmjs.com/package/@babylonjs/loaders.

The preferred way to bring in the loaders is via:

```typescript
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
...
registerBuiltInLoaders();
```

This will register all supported loaders, but internally uses dynamic imports to only download/load a specific importer (e.g. glTF, splat, etc.) when a model of that type is first loaded.

<Alert severity="warning" title="Warning" description="Note that some of the legacy loader functions (e.g. SceneLoader.Append) synchronously return the loader instance. When using dynamically imported loaders, these functions will return null." />

You can also register all loaders statically (e.g. they will all be included in your primary bundle). This is not recommended, but can be done via:

<Alert severity="warning" title="Warning" description="If possible, prefer registerBuiltInLoaders rather than statically importing loaders." />

```typescript
import "@babylonjs/loaders";
```

Importers must be registered with one of these approaches before the scene loader functions can be used.

## loadAssetContainerAsync

Loads all babylon assets from the file and does not append them to the scene. Instead, they are returned in an `AssetContainer` object.

```typescript
const container = await BABYLON.loadAssetContainerAsync("path/to/model", scene);
```

See an example here: <Playground id="#C3MP99#14" title="Asset Container Load Example" description="Simple example showing how to load assets into asset containers." image="/img/playgroundsAndNMEs/divingDeeperFileImport5.jpg" isMain={true} category="Import"/>

## appendSceneAsync

Loads all babylon assets from the file and appends them to the scene.

```typescript
await BABYLON.appendSceneAsync("path/to/model", scene);
```

See an example here: <Playground id="#WGZLGJ#10491" title="Append An Object" description="Simple example showing how append an object to your scene." image="/img/playgroundsAndNMEs/divingDeeperFileImport1.jpg" isMain={true} category="Import"/>

## loadSceneAsync

Loads all babylon assets from the file and creates a new scene.

```typescript
const scene = await BABYLON.loadSceneAsync("path/to/model", engine);
```

## importAnimationsAsync

Loads the animations from the file and merges them to the scene.
You can customize the import process using options and callbacks.

```typescript
await BABYLON.importAnimationsAsync("./Elf_run.gltf", scene);
```

See an example here: <Playground id="#UGD0Q0#296" title="Importing Animations" description="Simple example showing how to import animations into your scene." image="/img/playgroundsAndNMEs/divingDeeperFileImport6.jpg"/>

## String encoded model sources

For any of the scene loading functions, you can also pass a string containing the model source data itself.

Loads all babylon assets from a string and appends them to the scene.

```typescript
await BABYLON.appendSceneAsync("data:" + gltfString, scene);
```

See an example here: <Playground id="#ANPU8N" title="Append Assets From A String" description="Simple example showing how append objects from a string." image="/img/playgroundsAndNMEs/divingDeeperFileImport2.jpg"/>

You can also load a .glb binary file from a data string as long as the binary data is base64 encoded:

```typescript
const base64_model_content = "data:;base64,BASE 64 ENCODED DATA...";
await BABYLON.appendSceneAsync(base64_model_content, scene);
```

Note that two mime types are allowed in the string data:

```typescript
const base64_model_content = "data:application/octet-stream;base64,-BASE 64 ENCODED DATA-";
const base64_model_content = "data:model/gltf-binary;base64,-BASE 64 ENCODED DATA-";
```

See an example here: <Playground id="#68J9RS" title="Load .glb From Binary Data" description="Simple example showing how to load an object from a data string that is base64 encoded." image="/img/playgroundsAndNMEs/divingDeeperFileImport3.jpg"/>

When loading from a string that is not glTF data, you must specify the pluginExtension option to tell Babylon which loader to use. For example, to load an OBJ file from a string:

```typescript
const objDataURL = "data:;base64,ZyB0ZXRyYWhlZHJvbgoKdiAx...";
await BABYLON.appendSceneAsync(objDataURL, scene, { pluginExtension: "obj" });
```

See example here: <Playground id="#58T0JY#40" title="Load base64 model" description="Example showing how to load a base64 encoded model using the data url syntax" image="/img/playgroundsAndNMEs/pg-58T0JY.png" />

## Advanced usage

For any of the scene loading functions, you can pass in an options object that configures the load function and the loader.

For example, if you need to explicitly pass in the root url (rather than allowing us to try to infer it from the file path), you can do so like this:

```typescript
await BABYLON.appendSceneAsync("model_file_name", scene, { rootUrl: "https://example.com/assets/" });
```

You can also pass in loader specific options. For example, with the glTF loader, you can pass in general glTF options and even options for individual glTF extensions. For example:

```typescript
const assetContainer = await BABYLON.loadAssetContainerAsync("https://raw.githubusercontent.com/BabylonJS/Assets/master/meshes/LevelOfDetail.glb", scene, {
  pluginOptions: {
    gltf: {
      skipMaterials: false,
      extensionOptions: {
        MSFT_lod: {
          maxLODsToLoad: 1,
        },
      },
    },
  },
});
```

See an example here: <Playground id="#IAAJMR#3" title="Load With Detailed Options" description="Simple example showing how to pass glTF loader options and glTF extension options." image="/img/playgroundsAndNMEs/divingDeeperFileImport7.jpg"/>

## SceneLoader class (legacy)

The [`SceneLoader` class](/features/featuresDeepDive/importers/legacy) can also be used to load model files, but has effectively been replaced by module level scene loader functions as they result in better tree shaking (smaller bundles) and offer a simple solution for passing in loader options.
