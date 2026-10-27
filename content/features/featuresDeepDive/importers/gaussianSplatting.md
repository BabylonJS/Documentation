---
title: Gaussian Splatting File Loader Plugin
image:
description: Learn about the Gaussian Splatting File Loader Plugin available in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, .splat, .ply, .spz
further-reading:
video-overview:
video-content:
---

# Gaussian Splatting File Import
Babylon.js supports multiple Gaussian splatting file formats:
- .PLY
- .Splat
- .compressed.PLY
- Niantic .SPZ
- .SOG/SOGS Self-Organizing Gaussian https://github.com/fraunhoferhhi/Self-Organizing-Gaussians
- Streamed SOG (`lod-meta.json`) for very large scenes
- glTF files using the `KHR_gaussian_splatting` extension (with the glTF loader)

Loader options, supported variants (compressed and half-float PLY, SPZ v4) and streaming are described in the [Gaussian Splatting](/features/featuresDeepDive/mesh/gaussianSplatting) page.

To use it, you just have to reference it after Babylon.js:

```html
<script src="Babylon.js"></script>
<script src="babylon.splatFileLoader.js"></script>
```

If you want to import splat files statically (not recommended), you can do so via:

```javascript
import "@babylonjs/loaders/SPLAT/splatFileLoader";
```

You can read more about [NPM support](/setup/frameworkPackages/npmSupport).
