---
title: Viewer Advanced Usage
image:
description: HotSpots and annotations in the Viewer.
keywords: viewer, hotspots, annotations
further-reading:
    - title: Viewer & React
      url: /features/featuresDeepDive/babylonViewer/react
video-overview:
video-content:
---

The Babylon Viewer aims to make the most common model viewing scenarios simple and robust. That said, inevitably there will be specific needs for specific use cases, and as such the Babylon Viewer supports several routes for customization.

## Configuring the Babylon Viewer

### `Viewer`
When constructing a low level `Viewer`, pass in an options object to specify various initialization-time configurations.

### `CreateViewerForCanvas`
Similarly, when calling `CreateViewerForCanvas`, the same options can be passed in.

### `HTML3DElement`
When using the `HTML3DElement` (`<babylon-viewer>`), again the same options can be passed in to the constructor. However, typically an `HTML3DElement` instance is created by having a `<babylon-viewer>` element within an html page, and so constructor arguments cannot be passed. When providing options for the `HTML3DElement` is necessary, use the `ConfigureCustomViewerElement` function to create a custom element with a unique name and the desired options. For example:

```ts
ConfigureCustomViewerElement("my-babylon-viewer", { limitDeviceRatio: 2 });
```

```html
<my-babylon-viewer source="...">
</my-babylon-viewer>
```

In this example, when a `my-babylon-viewer` element is used, it will have a configuration that sets `limitDeviceRatio` to 2, meaning the maximum render resolution will be limited on high resolution devices with a DPR greater than 2.

## Accessing the full Babylon API through the Viewer's public API

The primary public entry point from the  `HTML3DElement` (`<babylon-viewer>`) to the Babylon API is the `viewerDetails` property and the associated `viewerready` event (which fires any time the `viewerDetails` changes). Any time the `HTML3DElement` is disconnected from the DOM, the underlying `viewerDetails` is disposed, and any time it is (re)connected to the DOM, the `viewerDetails` is (re)created. However, it is created asynchronously, so utilizing the `viewerready` event is a way to know when the `engine`, `scene`, etc. have been recreated.

### Example 1 - Drag & Drop

This example uses the `viewerDetails` property to access the underlying `Viewer` and its `loadModel` function to load from a `File` object rather than a url:

<CodePen pen="VYZjPQQ" tab="js,result" title="Babylon Viewer Annotations - Custom" />

### Example 2 - Wireframe

This example uses the `modelchange` event and the `viewerDetails` property to access the materials of the loaded model to enable wireframe rendering:

<CodePen pen="mybrWwo" tab="js,result" title="Babylon Viewer Annotations - Custom" />

## Customizing the Babylon Viewer through the protected API

All layers of the Babylon Viewer support subclassing as a means of customization. Subclasses can access the protected API of each layer.

<Alert severity="warning">
The protected API is still experimental and may change in the future.
</Alert>

The low level `Viewer` exposes many protected APIs, and allow for multiple models to be loaded simultaneously.

When calling `CreateViewerForCanvas`, it is also possible to pass in a `Viewer` subclass. `CreateViewerForCanvas` will use this subclass when creating the `Viewer` instance.

Similarly, when subclassing `ViewerElement` (the base class of `HTML3DElement`), it is possible to pass in a `Viewer` subclass. Additionally, `ViewerElement` exposes protected APIs that allow for additional customization.
