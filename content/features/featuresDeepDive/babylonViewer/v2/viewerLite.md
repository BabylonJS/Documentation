---
title: Viewer Lite
image:
description: Using the smaller, WebGPU-only version of the Babylon Viewer.
keywords: viewer, lite, webgpu, gltf, glb
further-reading:
    - title: Viewer NPM
      url: https://www.npmjs.com/package/@babylonjs/viewer
    - title: Babylon Lite NPM
      url: https://www.npmjs.com/package/@babylonjs/lite
    - title: Viewer HTML Element Interface
      url: /features/featuresDeepDive/babylonViewer/elementInterface
video-overview:
video-content:
---

Viewer Lite is a smaller version of the Babylon Viewer powered by [`@babylonjs/lite`](https://www.npmjs.com/package/@babylonjs/lite). It provides the same `<babylon-viewer>` custom element and many of the same model-viewing capabilities as the full Viewer, but it is WebGPU-only and does not yet support every Viewer feature.

Use Viewer Lite when minimizing download size is important and its [current limitations](#current-limitations) are acceptable. Use the full Viewer when you need WebGL fallback, model formats other than glTF/GLB, or access to the full Babylon.js API.

## Enabling Viewer Lite

Viewer Lite is a separate package entry point, not a runtime option. Choose either the full Viewer or Viewer Lite for a page; do not import both because they register the same `<babylon-viewer>` custom element.

### NPM

Install the Viewer and Babylon Lite packages:

```bash
npm install @babylonjs/viewer @babylonjs/lite
```

Import the Lite entry point instead of `@babylonjs/viewer`:

```js
import "@babylonjs/viewer/lite";
```

Then use `<babylon-viewer>` as usual:

```html
<babylon-viewer source="https://playground.babylonjs.com/scenes/BoomBox.glb"></babylon-viewer>
```

The Lite entry point also exports `Viewer`, `CreateViewerForCanvas`, `HTML3DElement`, and `ConfigureCustomViewerElement` for programmatic use.

### CDN

To use Viewer Lite without a bundler, reference the Lite ESM bundle:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@babylonjs/viewer/dist/babylon-viewer-lite.esm.min.js"
></script>

<babylon-viewer source="https://playground.babylonjs.com/scenes/BoomBox.glb"></babylon-viewer>
```

If you self-host the bundle, deploy the complete `dist` directory so the entry point can load its relative chunks.

## Browser Support

Viewer Lite requires WebGPU and does not fall back to WebGL. Verify that WebGPU is available in every browser you support before choosing Viewer Lite.

## Current Limitations

The following Viewer features are not currently supported, or work differently, in Viewer Lite:

| Area | Viewer Lite limitation |
| --- | --- |
| Engines | WebGPU only. The `engine` attribute, WebGL, and full Viewer engine-creation options are not supported. |
| Model sources | Only string URLs are supported. `File` and `ArrayBufferView` sources are not supported. |
| Model formats | Only glTF and GLB are supported. The `extension`/`pluginExtension` options do not enable other loader formats. |
| Babylon.js API access | The full Viewer's `ViewerDetails` bridge is not available. Lite elements expose `viewer` instead of `viewerDetails`, but do not provide the full Viewer's public engine, scene, camera, model, and picking APIs. |
| SSAO | Not supported. Enabling `ssao` logs a warning and has no rendering effect. |
| Shadows | `none` and `normal` are supported; `high` is not. Set shadow quality before loading the model because changing it after loading does not rebuild the shadows. |
| Environments | `environment-intensity` has no rendering effect. After an environment or skybox is loaded, it cannot be replaced or removed without recreating the Viewer. An HDR environment cannot be used for lighting without also creating a skybox. |
| Embedded cameras | `camerasAsHotSpots` is not supported. Explicitly configured world and surface hotspots are supported. |
| Rendering suspension | `render-when-idle` and `autoSuspendRendering` are ignored. Rendering is still suspended when the Viewer is outside the browser viewport. |
| Loading options | `useOpenPBR`, `useRightHandedSystem`, and full Viewer loader options are not supported. |
| Loading progress | Loading progress is indeterminate; numeric byte progress is not reported. |
| Viewer Configurator | The Viewer Configurator currently targets the full Viewer. |

