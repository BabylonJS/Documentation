---
title: Viewer (V2)
image:
description: The viewer is the simplest way to display 3D content on a web page.
keywords: extensions, babylon.js, viewer, web page, display
further-reading:
    - title: Viewer NPM
      url: https://www.npmjs.com/package/@babylonjs/viewer
    - title: Viewer API
      url: https://doc.babylonjs.com/packages/viewer/index
    - title: Viewer Blog Post
      url: https://www.linkedin.com/pulse/babylon-viewer-v2-babylon-js-lkstc/?trackingId=8xWb1OZKqf5Rulor%2BbhCZQ%3D%3D
    - title: Babylon.js Supported Model Formats
      url: /features/featuresDeepDive/importers/loadingFileTypes
    - title: WebGPU Snapshot Rendering
      url: /setup/support/webGPU/webGPUOptimization/webGPUSnapshotRendering
video-overview:
video-content:
---

The Babylon Viewer aims to simplify a specific but common Babylon.js use case: loading, viewing, and interacting with a 3D model.

At the same time, the Babylon Viewer does ***not*** abstract away the Babylon.js API, but rather provides access to it. This ensures that you can leverage the common functionality of the Viewer but still bring your own [custom code/functionality](/features/featuresDeepDive/babylonViewer/advancedUsage) for more niche needs.

<Alert severity="info">
- For instructions on **integrating the Babylon Viewer** into your project, see the [NPM page](https://www.npmjs.com/package/@babylonjs/viewer).
- For **details on the API**, see the [API docs](https://doc.babylonjs.com/packages/viewer/index).
- For background on the **goals and design principles** of the Babylon Viewer, see the introduction [blog post](https://www.linkedin.com/pulse/babylon-viewer-v2-babylon-js-lkstc/?trackingId=8xWb1OZKqf5Rulor%2BbhCZQ%3D%3D).
- If you have any **feedback or feature requests**, see the [announcement forum thread](https://forum.babylonjs.com/t/babylon-viewer-v2/54317).
- For details on the deprecated Babylon Viewer V1, see the [legacy docs](/legacy/babylonViewer).
</Alert>

To get started, here is a very basic usage example:

<CodePen pen="ogvbyyW" tab="html,result" title="Babylon Viewer Basics" />

<Alert severity="warning" title="CDN vs. Bundler">
  In the example above (and all other Viewer examples in the docs), for simplicity the ESM bundle included in the NPM package is referenced through a public CDN.
  In most production scenarios, it is likely preferable to use the NPM packages directly with your own bundler and your own deployment. You can install the package into your project via:

  ```bash
  npm install @babylonjs/viewer
  ```

  See the [NPM page](https://www.npmjs.com/package/@babylonjs/viewer) for more details on using the NPM package.
</Alert>

## Viewer Layers

The Babylon Viewer is constructed through three layers to enable cross platform and cross framework usage.

**`HTML3DElement` (`<babylon-viewer>`)** - this layer leverages [HTML Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements), is intended for use directly in HTML, and provides default UI for things like animation controls. The documentation primarily focuses on this layer.

**`createViewerForCanvas`** - this layer binds Viewer functionality to an html `canvas`. It is used by `HTML3DElement`, and could be used for other web framework bindings (such as [React](https://react.dev/)).

**`Viewer`** - this layer has the bulk of the core Viewer functionality. It is used by `createViewerForCanvas`, and could be used in other Babylon scenarios, such as with Babylon Native.

## File Formats

The Babylon Viewer supports all formats supported by `@babylonjs/loaders`. See the [importer docs](/features/featuresDeepDive/importers/loadingFileTypes) for a complete list of supported formats.

Loaders are dynamically imported, so the user does not pay the download cost until the client loads a model format associated with the loader. Similarly, glTF extensions are dynamically imported and are not downloaded until a model is loaded that uses the extension.

<Alert title="Dynamic Imports & Babylon Native" severity="warning">
*When using Babylon Native, dynamic imports are not supported, so be sure to configure your bundler to create a single chunk. You can find more details in the [Babylon Native docs](https://github.com/BabylonJS/BabylonNative/blob/master/Documentation/ConsumingJavaScript.md#using-a-bundler-to-create-a-single-js-file).*
</Alert>

## Engines

`HTML3DElement` (`<babylon-viewer>`) and `createViewerForCanvas` support both WebGL and WebGPU. When not explicitly selected, the Viewer will default to an appropriate engine based on browser support and stability.

When WebGPU is used, [snapshot rendering](/setup/support/webGPU/webGPUOptimization/webGPUSnapshotRendering) is automatically enabled and managed. This can significantly improve performance for complex models.

For Babylon Native, a `NativeEngine` instance can be passed into the `Viewer` constructor.

## Power & Resource Optimizations

When a `HTML3DElement` (`<babylon-viewer>`) is not within the browser's viewport (e.g. scrolled out of view), it pauses the render loop. This is especially helpful on power or resource constrained devices (e.g. mobile), or when many Viewer instances are used on a page.

## 3D Commerce Certified

The Babylon Viewer is configured by default to be compliant with the [Khronos 3D Commerce Certification](/setup/support/3D_commerce_certif).
