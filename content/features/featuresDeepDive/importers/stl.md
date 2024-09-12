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

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

To use it you just have to reference it after Babylon.js:

```html
<script src="Babylon.js"></script>
<script src="babylon.stlFileLoader.js"></script>
```

When using the Babylon npm packages in your own build, it is preferable to register the STL file importer via the top level dynamic loader registration function `registerBuiltInLoaders`. See [Loading Any File Type](/features/featuresDeepDive/importers/loadingFileTypes#npm) for more information.

If you want to import the STL file importer statically (not recommended), you can do so via:

```javascript
import "@babylonjs/loaders/STL/stlFileLoader";
```

You can read more about [NPM support](/setup/frameworkPackages/npmSupport)

By default, the STL loader swaps the Y and Z axes. To disable this behavior,
set

```javascript
BABYLON.STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES = true;
```
