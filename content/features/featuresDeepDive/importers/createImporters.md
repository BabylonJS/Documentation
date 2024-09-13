---
title: Create Your Own File Importer
image:
description: Learn how to create your own file importer for Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, custom importer
further-reading:
video-overview:
video-content:
---

## How to Create Your Own File Importer

By default, babylon.js comes with an importer for .babylon files.

You can also create your own importer by providing a specific object to the `BABYLON.registerSceneLoaderPlugin` function.

### Plugins

A file importer should implement the `ISceneLoaderPluginAsync` interface.

<Alert severity="warning" title="Warning" description="Avoid using ISceneLoaderPlugin as it is deprecated and has been replaced by ISceneLoaderPluginAsync" />

An abbreviated example of a file importer (scene loader plugin) might look something like this:

```typescript
import { ISceneLoaderPluginAsync } from "@babylonjs/core/Loading/sceneLoader";

class MyCustomImporter implements ISceneLoaderPluginAsync {
  public readonly name = "myCustomImporter";

  public readonly extensions = ".myCustomExtension";

  public async importMeshAsync(...) {
    // Load specified meshes into the Scene
  }

  public async loadAsync(...) {
    // Load all data into the Scene
  }

  public async loadAssetContainerAsync(...) {
    // Load all data into an AssetContainer
  }
}
```

A plugin instance can be passed to `BABYLON.registerSceneLoaderPlugin`, but plugin factories are more flexible and full featured, so we recommend using them to create your custom importers.

### Plugin Factories

When you register a plugin, you can register a plugin factory rather than a plugin instance. The factory must have a `createPlugin` function that returns an instance of the plugin. The factory is invoked each time a load function is called. The `pluginOptions` property of the loader options are also passed to the factory function. This makes it possible for your file importer to be configurable through options.

A plugin factory can return the plugin instance either synchronously or asynchronously. We recommend you dynamically import your plugin to avoid loading it until it is needed. For example:

```typescript
import { registerSceneLoaderPlugin } from "@babylonjs/core/Loading/sceneLoader";

registerSceneLoaderPlugin({
  name: "myCustomImporter",
  extensions: ".myCustomExtension",
  createPlugin: async () => {
    const { MyCustomImporter } = await import("./MyCustomImporter");
    return new MyCustomImporter();
  },
});
```

To expose options for your custom file importer, you should first augment the `SceneLoaderPluginOptions` interface to add options for your importer. For example, if the name of your importer is `myCustomImporter`, you would add the following to your code:

```typescript
type MyCustomImporterOptions = { option1?: string, option2?: number };

declare module "@babylonjs/core" {
  export interface SceneLoaderPluginOptions {
    myCustomImporter: MyCustomImporterOptions;
  }
}
```

Then, when you register your file importer, you can access the options like this:

```typescript
import { registerSceneLoaderPlugin } from "@babylonjs/core/Loading/sceneLoader";

registerSceneLoaderPlugin({
  name: "myCustomImporter",
  extensions: ".myCustomExtension",
  createPlugin: async (options) => {
    const { MyCustomImporter } = await import("./MyCustomImporter");
    return new MyCustomImporter(options["myCustomImporter"]);
  },
});
```

Note that in this example, you will need to modify the `MyCustomImporter` class to accept options (`MyCustomImporterOptions`) in its constructor.

Finally, these options can be passed into one of the scene loader functions like this:

```typescript
await loadAssetContainerAsync("path/to/model", scene, {
  pluginOptions: {
    myCustomImporter: {
      option1: "hello world",
      option2: 42,
    },
  },
});
```
