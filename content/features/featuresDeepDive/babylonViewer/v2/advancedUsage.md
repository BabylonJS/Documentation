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

The Babylon Viewer aims to make the most common model viewing scenarios simple and robust. That said, inevitably there will be specific needs for specific use cases, and to support those use cases the full Babylon API is exposed through the Babylon Viewer.

The primary entry point from the  `HTML3DElement` (`<babylon-viewer>`) is the `viewerDetails` property and the associated `viewerready` event (which fires any time the `viewerDetails` changes). Any time the `HTML3DElement` is disconnected from the DOM, the underlying `viewerDetails` is disposed, and any time it is (re)connected to the DOM, the `viewerDetails` is (re)created. However, it is created asynchronously, so utilizing the `viewerready` event is a way to know when the `engine`, `scene`, etc. have been recreated.

### Example 1 - Drag & Drop

This example uses the `viewerDetails` property to access the underlying `Viewer` and its `loadModel` function to load from a `File` object rather than a url:

<CodePen pen="VYZjPQQ" tab="js,result" title="Babylon Viewer Annotations - Custom" />

### Example 2 - Wireframe

This example uses the `modelchange` event and the `viewerDetails` property to access the materials of the loaded model to enable wireframe rendering:

<CodePen pen="mybrWwo" tab="js,result" title="Babylon Viewer Annotations - Custom" />
