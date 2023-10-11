---
title: .stl File Loader Plugin
image:
description: Learn about the .stl File Loader Plugin available in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, .stl, stl
further-reading:
video-overview:
video-content:
---

# STL File Import

You can find the STL loader [here](https://cdn.babylonjs.com/loaders/babylon.stlFileLoader.js)

> ⚠️ WARNING: The CDN should not be used in production environments. Please use self-hosting for production. The purpose of our CDN is to serve Babylon packages to developers who are learning how to use the platform and for running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN.

To use it you just have to reference it after Babylon.js:

```html
<script src="Babylon.js"></script>
<script src="babylon.stlFileLoader.js"></script>
```

Then you can use one of the static functions on the `SceneLoader` to load.
See [how to load from any file type](/features/featuresDeepDive/importers/loadingFileTypes)

By default, the STL loader swaps the Y and Z axes. To disable this behavior,
set

```javascript
BABYLON.STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES = true;
```
