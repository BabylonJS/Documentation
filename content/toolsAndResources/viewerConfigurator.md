---
title: Viewer Configurator
image:
description: Learn about the Viewer Configurator, a tool to simplify configuring the Babylon Viewer.
keywords: babylon.js, tools, resources, viewer, configurator, editor
further-reading:
  - title: Babylon Viewer
    url: /features/featuresDeepDive/babylonViewer
video-overview:
video-content:
---

## Overview

The [Viewer Configurator](https://viewerconfig.babylonjs.com) is a tool that simplifies configuring the [Babylon Viewer](/features/featuresDeepDive/babylonViewer). Rather than relying on documentation and setting the html attributes of the `<babylon-viewer>` directly in your code editor, the Viewer Configurator gives you an interactive visual interface to configure every aspect of the Viewer. The output is a block of html that you can copy and paste into your web app.

## Accessing the Viewer Configurator

1. Open a web browser.
2. Visit the Viewer Configurator at [viewerconfig.babylonjs.com](https://viewerconfig.babylonjs.com).

## Loading Assets

Load a model into the Viewer Configurator using one of the following methods:

1. **URL**: Enter the url to a supported model type in the "Model" text input and click the confirm button to the right of the text input.
2. **File Selection**: Use the open file button to the right of the "Model" text input and browse the file system.
3. **Drag and Drop**: Drag supported files directly onto the Viewer Configurator interface.

<Alert severity="info">
Note that when using a local file, the output html simply includes the name of the file. You will need to set the `source` attribute to a valid model url when using the html snippet in your web app.
</Alert>

<Alert severity="info">
Note that all required assets including files referenced from the main asset file must all be dropped or selected so that the browser knows about them. For example, if the asset is a glTF, the .gltf along with the .bin file and all image files must be dropped or selected for the asset to load properly.
</Alert>

## Configuration

Ideally the Viewer Configurator is self explanatory, but there are some complexities that will be covered in more detail below.

### Revert and Reset

In various places in the Viewer Configurator, you will see Revert and Reset buttons.

Revert means sync the live Viewer state with what you see in the html output (e.g. the current viewer configuration). For example, if an initial camera pose has been configured, but then you change the camera pose in the Viewer, reverting it will set the camera pose back to the configured pose as seen in the html output.

Reset means to remove the configuration entirely and reset to the default state. For example, if an initial camera pose has been configured, resetting the camera pose will remove that configuration *and* revert the camera pose to its default.

### Snapshotting Viewer State

Generally all Viewer configuration happens in the side pane of the Configurator. Usually this is done by manipulating UI such as toggles and sliders directly in the side pane. However some state is established directly in the Viewer. For example, to set the initial camera pose, you can position the camera to your liking in the Viewer, and then click the "Use Current Pose" button. This "snapshots" the current camera pose and adds it to the html snippet.

Similar behaviors exist for other Viewer features, like animation and material variants.

### Hot Spots

Creating and configuration [hot spots](/features/featuresDeepDive/babylonViewer/hotspots) is a multi-step process.

1. Required: Click the `+` button to add a new hot spot.
1. Optional: Update the hot spot name (make sure it is unique relative to other hot spots).
1. Required: Click the target button to the right of the hot spot name text input. You are now in picking mode.
1. Required: Click a point on the surface of the model. This establishes the position of the hot spot.
1. Optional: Rotate the camera around the hot spot to a desired camera pose and then click the camera button to the right of the hot spot name text input. This establishes a custom camera pose relative to the hot spot position.

When hot spots are added, they will immediately show up in the Viewer toolbar. Hot spots can be re-ordered by clicking and dragging the handle to the left of the hot spot name text input.

## Testing

What you see in the Viewer Configurator should be exactly what you see when you use the html snippet in your own web app. An easy way to further test this is to copy the html output from the Viewer Configurator and paste it into this codepen:

<CodePen pen="ByaZQEp" tab="html,result" title="Viewer Configurator Test" />
