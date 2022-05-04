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

To use it you just have to reference it after Babylon.js:

```html
<script src="Babylon.js"></script>
<script src="babylon.stlFileLoader.js"></script>
```

Then you can use one of the static functions on the `SceneLoader` to load.
See [how to load from any file type](/divingDeeper/importers/loadingFileTypes)

By default, the STL loader swaps the Y and Z axes. To disable this behavior,
set

```javascript
BABYLON.STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES = true;
```
