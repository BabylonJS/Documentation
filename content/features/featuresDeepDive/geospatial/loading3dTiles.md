---
title: Loading 3D Tiles
image:
description: Learn about the 3D Tiles format and how to load 3D Tiles datasets in Babylon.js using 3DTilesRenderer.
keywords: 3d tiles, cesium, geospatial, streaming, tiles, NASA, AMMOS, 3DTilesRenderer
further-reading:
  - title: OGC 3D Tiles Specification
    url: https://www.ogc.org/standard/3dtiles/
  - title: Cesium 3D Tiles Documentation
    url: https://cesium.com/learn/3d-tiling/
  - title: 3DTilesRenderer (NASA/AMMOS)
    url: https://github.com/NASA-AMMOS/3DTilesRendererJS
video-overview:
video-content:
---

## What Are 3D Tiles?

[3D Tiles](https://cesium.com/learn/3d-tiling/) is an open standard created by Cesium and adopted by the [Open Geospatial Consortium (OGC)](https://www.ogc.org/standard/3dtiles/) for streaming massive heterogeneous 3D geospatial datasets. It is designed to enable efficient visualization of very large datasets — such as photogrammetry, 3D buildings, terrain, and point clouds — by organizing data into a spatial hierarchy of tiles that are loaded on demand based on the camera's position and level of detail.

## Loading 3D Tiles in Babylon.js

The recommended solution for loading 3D Tiles in Babylon.js is the [3DTilesRendererJS](https://github.com/NASA-AMMOS/3DTilesRendererJS) library from NASA/AMMOS, which has recently added Babylon.js support. This library provides a full 3D Tiles renderer that handles tile set traversal, level-of-detail selection, and tile loading.

**Note:** The Babylon.js implementation of 3DTilesRendererJS has some known limitations in supporting the full 3D tiles spec. For details on current support and restrictions, see the [Babylon.js README](https://github.com/NASA-AMMOS/3DTilesRendererJS/blob/master/src/plugins/babylon/README.md) in the 3DTilesRendererJS repository.

**Playground limitation:** 3DTilesRendererJS cannot be used in the [Babylon.js Playground](/playground). The Playground loads Babylon.js as a pre-bundled global (UMD) script, while the 3DTilesRendererJS npm package imports Babylon.js as ES6 module dependencies (e.g. `import { Scene } from "@babylonjs/core"`). This creates a conflict — the renderer instantiates its own copy of Babylon classes from the npm package rather than using the Playground's pre-loaded instance, causing type mismatches and runtime errors. To use 3DTilesRendererJS, set up a local project with a bundler (e.g. Webpack, Vite) where both Babylon.js and 3DTilesRendererJS are resolved from the same ES6 module installation. Below are some examples.

### Examples

- **[Google Map Tiles with GeospatialCamera](https://codesandbox.io/p/sandbox/t9f52p)** — Loads Google Map 3D Tiles and uses the `GeospatialCamera` for globe-style navigation. This example requires a Google Maps API token or a Cesium ion token to access the map tile data. They are easy to obtain and instructions for doing so are in the sandbox.

<img src="/img/playgroundsAndNMEs/3dTiles.png" title="3D Tiles Loader using NASA/AMMOS 3DTilesRenderer/babylonjs"/>

- **[Simple 3D Tiles with ArcRotateCamera](https://codesandbox.io/p/sandbox/6znjxf)** — Loads a freely available 3D Tiles dataset and uses an `ArcRotateCamera` to orbit and navigate around the model. No API token required.