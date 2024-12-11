---
title: Babylon.js Viewer (V1)
image:
description: The viewer is the simplest way to display 3D content on a web page.
keywords: extensions, babylon.js, viewer, web page, display
further-reading:
    - title: Configuring the viewer
      url: /legacy/babylonViewer/configuringViewer
    - title: The templating system
      url: /legacy/babylonViewer/viewerTemplatingSystem
    - title: Recreating the default configuration for the viewer
      url: /legacy/babylonViewer/defaultViewerConfig
    - title: Advanced usage
      url: /legacy/babylonViewer/advancedViewerUsage
    - title: Babylon.js viewer examples
      url: /legacy/babylonViewer/viewerExamples
video-overview:
video-content:
---

<Alert severity="warning" title="Deprecated">
  The Babylon Viewer V1 is deprecated. When building new experiences, please use the [Babylon Viewer V2](/features/featuresDeepDive/babylonViewer).
</Alert>

## Display 3D models on your webpage

The Babylon.js viewer is the simplest way to display 3D content on a web page.

To display a 3D model on you web page:

1. Add a script reference to the viewer

    ```html
    <script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
    ```

2. Add a `<babylon>` tag and set the _model_ attribute to point to a `.gltf` or `.glb` file

    ```html
    <babylon model="model.gltf"></babylon>
    ```

    We recommend using the [glTF format](https://github.com/khronosgroup/gltf) (`.gltf` or `.glb`) for displaying 3D models on your webpage. Other formats supported by Babylon.js loaders are also supported by the viewer component including `.babylon`, `.obj`, and `.stl` formats.

The Babylon.js viewer automatically provides a [default viewing experience](#default-viewing-experience) for 3D models. All aspects of this experience are configurable. See [Configuring the viewer](//doc.babylonjs.com/extensions/babylonViewer/configuringViewer) for more information on customizing the viewing experience.

## Example

<CodePen pen="QxzBPd" tab="html,result" title="Babylon.js Viewer - Display a 3D model" />

## Resizing

Controlling the size of the viewer is one of the most common configuration operation. It is rather easy as the viewer in default mode will fill 100% of the width and height of its container. So in order to control the viewer, you can simply style its enclosing container.

<CodePen pen="qMBwar" tab="html,result" title="Babylon.js Viewer - Resize the viewer" />

## Using the viewer in your project

The Babylon.js viewer is available on CDN as well as an NPM package. The Babylon.js viewer is a wrapper around the Babylon.js engine and follows the same versioning scheme as the engine. The currently stable version of the Babylon.js viewer will use the current stable version of Babylon.js engine and the preview version of the Babylon.js viewer will use the preview version of Babylon.js engine.

## CDN

Stable versions of the viewer are available on:

-   https://cdn.babylonjs.com/viewer/babylon.viewer.js (minified)
-   https://cdn.babylonjs.com/viewer/babylon.viewer.max.js

Preview releases (nightlies) of the viewer are available on:

-   https://preview.babylonjs.com/viewer/babylon.viewer.js (minified)
-   https://preview.babylonjs.com/viewer/babylon.viewer.max.js

## NPM

To install the Babylon.js viewer through NPM use:

```javascript
npm install --save babylonjs-viewer
```

This will install the latest stable version of the viewer, including its needed dependencies.

Afterwards it can be imported to the project using:

```javascript
import "babylonjs-viewer";
```

This will enable the `BabylonViewer` namespace.
