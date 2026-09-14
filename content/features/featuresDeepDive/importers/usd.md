---
title: OpenUSD File Loader Plugin
image:
description: Load composed OpenUSD stages from .usd, .usda, .usdc, and .usdz files in Babylon.js.
keywords: diving deeper, import, importing assets, OpenUSD, USD, USDA, USDC, USDZ, sublayers, composition
further-reading:
  - title: Loading Any File Type
    url: /features/featuresDeepDive/importers/loadingFileTypes
  - title: SceneLoader
    url: /typedoc/classes/babylon.sceneloader
  - title: USDFileLoader
    url: /typedoc/classes/BABYLON.USDFileLoader
video-overview:
video-content:
---

## Overview

The OpenUSD file loader imports `.usd`, `.usda`, `.usdc`, and `.usdz` stages. A WebAssembly build of [OpenUSD](https://openusd.org/) composes and extracts the stage in a Web Worker, then Babylon.js creates the scene objects from transferable binary buffers. No intermediate glTF or `.babylon` file is created.

The loader supports:

- OpenUSD composition, including sublayers, references, and payloads, when all dependencies are supplied to the loader
- Transform hierarchies, stage units, up-axis conversion, and visibility
- Polygon meshes, normals, UVs, display colors, geometric subsets, and analytic cube, sphere, cylinder, and cone primitives
- `UsdPreviewSurface` materials and `UsdUVTexture` textures
- Native instances and `UsdGeomPointInstancer` batches backed by Babylon.js thin instances
- `UsdSkel` skeletons, skinning, and animation
- Blend shapes, in-between shapes, and animated morph influences

## Setup

The recommended setup for an NPM application is the dynamic loader registration function. It loads the USD implementation only when a USD file is first requested.

```typescript
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";

registerBuiltInLoaders();
```

You can instead register the USD loader statically:

```typescript
import "@babylonjs/loaders/USD/usdFileLoader";
```

For a script-based experiment, load the complete loader bundle after Babylon.js:

<Alert severity="warning" title="Warning" description="The Babylon.js CDN should not be used in production environments. Serve Babylon.js, the loader bundle, and the OpenUSD runtime assets from your own CDN when deploying an application." />

```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```

The loader downloads its OpenUSD worker, WebAssembly module, JavaScript glue, and data bundle when it is first used. Browsers can cache those assets for subsequent imports.

## Loading a USD File

After registering the plugin, use any of the standard scene loader functions:

```typescript
await AppendSceneAsync("https://example.com/assets/model.usdz", scene);
```

Use `LoadAssetContainerAsync` when the imported objects should not be added to the scene immediately:

```typescript
const container = await LoadAssetContainerAsync("https://example.com/assets/model.usda", scene);
container.addAllToScene();
```

See a complete example here: <Playground id="#H0RPC8#0" title="Load an OpenUSD Stage" description="Load a public USDA stage with the Babylon.js OpenUSD file loader." isMain={true} category="Import" />

## Loading a Stage with Sublayers and References

OpenUSD stages often consist of a root layer plus other layers, payloads, and textures. The browser loader stages those files in a virtual filesystem before OpenUSD opens the root layer.

<Alert severity="info" title="Supply every dependency" description="Loading the root layer from a URL does not make its dependencies available automatically. Fetch each external layer, payload, and texture, then pass its bytes through pluginOptions.usd.files. A USDZ package that contains all of its dependencies normally needs only the package itself." />

Virtual paths must preserve the directory structure used by the authored asset paths. For example, assume the root layer is staged as `Package/Scenes/Main.usda`:

```text
Package/
|-- Scenes/
|   `-- Main.usda
|-- Layers/
|   `-- Geometry.usdc
`-- Looks/
    `-- Appearance.usda
```

If `Main.usda` contains:

```usda
#usda 1.0
(
    subLayers = [
        @../Layers/Geometry.usdc@,
        @../Looks/Appearance.usda@
    ]
)
```

load the root and supporting layers as follows:

```typescript
const assetRoot = "https://example.com/assets/Package";

const [geometryLayer, appearanceLayer] = await Promise.all([
    fetch(`${assetRoot}/Layers/Geometry.usdc`).then((response) => response.arrayBuffer()),
    fetch(`${assetRoot}/Looks/Appearance.usda`).then((response) => response.arrayBuffer()),
]);

await AppendSceneAsync(`${assetRoot}/Scenes/Main.usda`, scene, {
    pluginOptions: {
        usd: {
            rootFileName: "Package/Scenes/Main.usda",
            files: {
                "Package/Layers/Geometry.usdc": geometryLayer,
                "Package/Looks/Appearance.usda": appearanceLayer,
            },
        },
    },
});
```

The keys in `files` are virtual paths, not URLs. `rootFileName` gives the root layer its path in that same virtual filesystem, so OpenUSD can resolve each relative asset path exactly as authored.

See this composition working entirely from in-memory layers: <Playground id="#8VK7U1#0" title="Load Multiple OpenUSD Sublayers" description="Compose a root USDA layer with geometry and appearance sublayers supplied through the virtual file map." />

### Loading a Local Directory

For local assets, let the user select a directory and preserve each file's `webkitRelativePath`. If the directory contains multiple `.usd`, `.usda`, `.usdc`, or `.usdz` files, ask the user which one is the root layer.

```html
<input id="usdDirectory" type="file" webkitdirectory multiple />
```

```typescript
const input = document.getElementById("usdDirectory") as HTMLInputElement;
const selectedFiles = Array.from(input.files ?? []);
const rootFile = selectedFiles.find((file) => file.webkitRelativePath.endsWith("/Scenes/Main.usda"));

if (!rootFile) {
    throw new Error("The root USD layer was not selected.");
}

const entries = await Promise.all(
    selectedFiles
        .filter((file) => file !== rootFile)
        .map(async (file) => [file.webkitRelativePath, await file.arrayBuffer()] as const)
);

await AppendSceneAsync(rootFile, scene, {
    pluginOptions: {
        usd: {
            rootFileName: rootFile.webkitRelativePath,
            files: Object.fromEntries(entries),
        },
    },
});
```

### Absolute Asset Paths

`resolveByFileName` defaults to `true`. When an unresolved asset uses an absolute path authored on another computer, the loader can conservatively match one supplied virtual file with the same file name.

```typescript
pluginOptions: {
    usd: {
        rootFileName,
        files,
        resolveByFileName: true,
    },
}
```

This fallback only works when the file name is unambiguous. Preserve the authored directory layout whenever possible, especially when different directories contain files with the same name. Set `resolveByFileName` to `false` to require strict path resolution.

## Diagnostics

Use the loader callbacks to display progress, collect OpenUSD messages, and detect missing dependencies:

```typescript
await AppendSceneAsync(rootFile, scene, {
    pluginOptions: {
        usd: {
            rootFileName,
            files,
            onProgress: ({ phase, message }) => {
                console.log(phase, message);
            },
            onLog: (level, message) => {
                console.log(`[${level}] ${message}`);
            },
            onComplete: ({ timings, statistics, missingAssets }) => {
                console.table(timings);
                console.table(statistics);
                console.log("Missing assets:", missingAssets);
            },
        },
    },
});
```

`missingAssets` lists references that OpenUSD could not resolve from the root layer, a USDZ package, or the supplied virtual files.

## Hosting the OpenUSD Runtime

By default, the worker and OpenUSD runtime are downloaded from the Babylon.js CDN. To host them with your application, copy all four runtime files from the same protocol version and configure their URLs for each load:

```typescript
const importerRoot = "/runtime/babylonUsdImporter/";

await AppendSceneAsync("/assets/model.usdz", scene, {
    pluginOptions: {
        usd: {
            workerUrl: `${importerRoot}babylon-usd-importer.worker.js`,
            glueUrl: `${importerRoot}babylon-usd-importer.js`,
            wasmUrl: `${importerRoot}babylon-usd-importer.wasm`,
            dataUrl: `${importerRoot}babylon-usd-importer.data`,
        },
    },
});
```

Keep these four files together and use the protocol version associated with your `@babylonjs/loaders` version. Mixing runtime files or protocol versions is not supported.

## Current Limitations

- `UsdPreviewSurface` is supported; MaterialX and other surface shader networks currently use the default material.
- PNG, JPEG, BMP, and WebP textures are supported. Convert other texture formats before loading them in a browser.
- Animated point-instancer data is imported at its first authored frame as static thin instances.
- Nested point instancers are not currently supported.
- Mesh-name filtering is not currently supported; `ImportMeshAsync` imports the complete composed stage.
