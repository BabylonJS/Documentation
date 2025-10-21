---
title: Create glTF extensions
image:
description: Learn about creating new glTF loader extensions.
keywords: diving deeper, import, importing assets, asset, glTF, extensions
further-reading: ["https://babylonjs.medium.com/extending-the-gltf-loader-in-babylon-js-588e48fb692b"]
video-overview:
video-content:
---

## Introduction

The glTF format includes the concept of extensions. Usually glTF loader extensions map 1:1 with a corresponding glTF format extensions. However, it is possible to create custom glTF loader extensions are unrelated to glTF format extensions and simply perform some additional processing on the loaded glTF data.

The glTF loader includes support for many glTF format extensions through built-in glTF loader extensions. It is also possible to create your own glTF loader extensions.

## Extensions

Extensions are defined by implementing the `IGLTFLoaderExtension` interface (from `@babylonjs/loaders/glTF/2.0`). An abbreviated example would look something like this:

```typescript
import { IGLTFLoaderExtension } from "@babylonjs/loaders/glTF/2.0";

class MyCustomExtension implements IGLTFLoaderExtension {
    public readonly name = "myCustomExtension";
    public enabled = true;
    public order = 100;

    // Implement any of the optional functions, such as:
    public loadSceneAsync(): Nullable<Promise<void>> {
        // Modify the default behavior when loading scenes.
    }
}
```

## Extension Factories

When you register a loader extension, you register an extension factory. The factory is a function that takes the glTF loader and returns an extension instance synchronously or asynchronously. It is invoked each time a glTF is loaded. Using the factory allows you to dynamically import your extension to avoid loading it until it is needed. A simple example might look something like this:

```typescript
import { registerGLTFExtension } from "@babylonjs/loaders/glTF/2.0";

registerGLTFExtension("myCustomExtension", true, async (loader) => {
    const { MyCustomExtension } = await import("./MyCustomExtension");
    return new MyCustomExtension(loader);
});
```

<Alert severity="info" title="glTF Format Extensions" description="The second parameter of registerGLTFExtension specifies whether the extension is associated with a glTF format extension. If it is, it will only be used when loading glTFs that use that extension. If it is not, it will be used when loading any glTF." />

## Extension Options

To expose options for your custom glTF loader extension, you should first augment the `GLTFLoaderExtensionOptions` interface to add options for your extension. For example:

```typescript
type MyCustomExtensionOptions = { option1?: string, option2?: number };

declare module "@babylonjs/loaders" {
  export interface GLTFLoaderExtensionOptions {
    myCustomExtension: MyCustomImporterOptions;
  }
}
```

Then, when you register your extension, you can access the options like this:

```typescript
class MyCustomExtension implements IGLTFLoaderExtension {
    constructor (loader: GLTFLoader) {
        const options = loader.parent.extensionOptions["myCustomExtension"];
    }
}
```

Finally, these options can be passed into one of the scene loader functions like this:

```typescript
await LoadAssetContainerAsync("path/to/model", scene, {
  pluginOptions: {
    glTF: {
      extensionOptions: {
        myCustomExtension: {
          option1: "hello world",
          option2: 42,
        },
      },
    },
  },
});
```

