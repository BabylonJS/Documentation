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

The primary entry point from the  `HTML3DElement` (`<babylon-viewer>`) is the `viewerDetails` property and the associated `viewerready` event (which fires any time the `viewerDetails` changes). Any time the `HTML3DElement` is disconnected from the DOM, the underlying `viewerDetails` is disposed, and any time it is (re)connected to the DOM, the `viewerDetails` is (re)created. However, it is created asynchronously, so utilizing the `viewerready` event is necessary.

Following is an example that uses the underlying `viewerDetails` to help enable file drag & drop:

<CodePen pen="VYZjPQQ" tab="js,result" title="Babylon Viewer Annotations - Custom" />
