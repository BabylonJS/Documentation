---
title: Importing Assets
image: 
description: Learn how to import assets to use in your Babylon.js scenes.
keywords: diving deeper, import, importing assets, asset, importing
further-reading:
video-overview:
video-content:
---

# Importing Assets

The built-in file type is `.babylon`, and Babylon.js can load it without a plugin. All other file types require a plugin, as described in this section.

Possible file types include glTF, splat, OBJ, and STL.

To help you manage imported assets, Babylon.js provides an asset manager.

**Note:** Since imported meshes can already have a `rotationQuaternion` set, set `rotationQuaternion` to `null` before applying a rotation.