---
title: Getting Started - Chapter 1 - Enhancing Your Website
image: 
description: Continue your first steps into Babylon.js by enhancing your first website.
keywords: getting started, start, chapter 1, first site
further-reading: 
video-overview:
video-content:
---

# Getting Started - Enhancing Your Website

## First Model on a Web Page.
Provided the file type is one recognized by Babylon.js then you can use the Babylon [Viewer](/features/featuresDeepDive/babylonViewer) to display your scene or model on a web page using the `<babylon-viewer>` custom element. Examples of suitable file types are `.gltf` and `.glb`. See the [importer docs](/features/featuresDeepDive/importers/loadingFileTypes) for more details. It makes no difference whether the scene was built with Babylon.js or created with your favorite design software. The `<babylon-viewer>` element will be sized to fit its container.

The easiest way to try the Babylon Viewer is to reference the distribution script in an html page from a free public CDN. For example:

```html
<html lang="en">
    <body>
        <script type="module" src="https://cdn.jsdelivr.net/npm/@babylonjs/viewer@preview/dist/babylon-viewer.esm.min.js"></script>
        <babylon-viewer source="https://playground.babylonjs.com/scenes/BoomBox.glb"></babylon-viewer>
    </body>
</html>
```

For more details, see the main [Viewer](/features/featuresDeepDive/babylonViewer) documentation page and the [NPM](https://www.npmjs.com/package/@babylonjs/viewer) page.