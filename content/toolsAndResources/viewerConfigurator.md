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

The [Viewer Configurator](https://viewerconfig.babylonjs.com) is a tool that simplifies configuring the [Babylon Viewer](/features/featuresDeepDive/babylonViewer). Rather than relying on documentation and setting the HTML attributes of the `<babylon-viewer>` directly in your code editor, the Viewer Configurator gives you an interactive visual interface for configuring every aspect of the Viewer. The output is a block of [HTML](#output-format) that you can copy and paste into your web app, or [JSON](#output-format) that you can use as the `ViewerOptions`.

## Accessing the Viewer Configurator

1. Open a web browser.
2. Visit the Viewer Configurator at [viewerconfig.babylonjs.com](https://viewerconfig.babylonjs.com).

## Loading Assets

Load a model into the Viewer Configurator using one of the following methods:

1. **URL**: Enter the URL for a supported model type in the "Model" text input and click the confirm button to the right of the text input.
2. **File Selection**: Use the open file button to the right of the "Model" text input and browse the file system.
3. **Drag and Drop**: Drag supported files directly onto the Viewer Configurator interface.

<Alert severity="info">
Note that when using a local file, the output HTML simply includes the name of the file. You will need to set the `source` attribute to a valid model URL when using the HTML snippet in your web app.
</Alert>

<Alert severity="info">
Note that all required assets, including files referenced from the main asset file, must be dropped or selected so that the browser knows about them. For example, if the asset is a glTF, the .gltf file, the .bin file, and all image files must be dropped or selected for the asset to load properly.
</Alert>

## Configuration

Ideally, the Viewer Configurator is self-explanatory, but there are some complexities that are covered in more detail below.

### Revert and Reset

In various places in the Viewer Configurator, you will see Revert and Reset buttons.

Revert means syncing the live Viewer state with what you see in the HTML output (e.g. the current Viewer configuration). For example, if an initial camera pose has been configured but you then change the camera pose in the Viewer, reverting it will set the camera pose back to the configured pose shown in the HTML output.

Reset means removing the configuration entirely and returning to the default state. For example, if an initial camera pose has been configured, resetting the camera pose will remove that configuration *and* revert the camera pose to its default.

### Snapshotting Viewer State

Generally, all Viewer configuration happens in the side pane of the Configurator. Usually, this is done by manipulating UI elements such as toggles and sliders directly in the side pane. However, some state is established directly in the Viewer. For example, to set the initial camera pose, you can position the camera as you like in the Viewer and then click the "Use Current Pose" button. This "snapshots" the current camera pose and adds it to the HTML snippet.

Similar behavior exists for other Viewer features, such as animation and material variants.

### Hot Spots

Creating and configuring [hot spots](/features/featuresDeepDive/babylonViewer/hotspots) is a multi-step process.

1. Required: Click the `+` button to add a new hot spot.
1. Optional: Update the hot spot name (make sure it is unique relative to other hot spots).
1. Required: Click the target button to the right of the hot spot name text input. You are now in picking mode.
1. Required: Click a point on the surface of the model. This establishes the position of the hot spot.
1. Optional: Rotate the camera around the hot spot to a desired camera pose and then click the camera button to the right of the hot spot name text input. This establishes a custom camera pose relative to the hot spot position.

When hot spots are added, they will immediately show up in the Viewer toolbar. Hot spots can be re-ordered by clicking and dragging the handle to the left of the hot spot name text input.

## Output Format

By default, the Viewer Configurator outputs HTML that can be copied and pasted into a web page. The output format can also be changed to JSON. In this case, the JSON can be parsed and used directly as `ViewerOptions` in any of the Viewer layers:

```ts
const configuration: string = "the copied and pasted output of the Viewer Configurator goes here";
const options: ViewerOptions = JSON.parse(configuration);
```

### `ConfigureCustomViewerElement`

The `ConfigureCustomViewerElement` function creates a configured `HTML3DElement` (`<babylon-viewer>`). For example, if you know you want the same skybox for multiple instances of the Babylon Viewer, this could be configured in the Configurator and the parsed `ViewerOptions` (as described above) could be used like this:

```ts
ConfigureCustomViewerElement("my-babylon-viewer", options);
```

```html
<!-- Each of these Viewer instances will use the same configured environment. -->
<my-babylon-viewer source="model1.glb"></my-babylon-viewer>
<my-babylon-viewer source="model2.glb"></my-babylon-viewer>
<my-babylon-viewer source="model3.glb"></my-babylon-viewer>
```

### `HTML3DElement` Constructor

If the Viewer element is being constructed in code, the same options can be passed to the constructor:

```ts
const viewerElement = new HTML3DElement(options);
document.body.appendChild(viewerElement);
```

### `CreateViewerForCanvas`

If a `Viewer` is being created from a `Canvas` without the HTML layer, the options can be passed to the factory function:

```ts
const viewer = await CreateViewerForCanvas(canvas, options);
```

### `Viewer` Constructor

If a `Viewer` is being instantiated directly, the options can be passed to the constructor:

```ts
const viewer = new Viewer(engine, options);
```

## Saving & Loading

After the Viewer has been configured, you can also save the current state of the Viewer Configurator and restore it later. This works the same way as in other Babylon tools: clicking the save button will save a "snippet" and encode the snippet ID into the URL. If you reload this URL later, it will restore the currently configured state.

<Alert severity="info">
Note that if you have loaded a local model, that model is not saved with the snippet. You will have to reload the same local model after reloading the URL.
</Alert>

## Testing

What you see in the Viewer Configurator should be exactly what you see when you use the HTML snippet in your own web app. An easy way to test this further is to copy the HTML output from the Viewer Configurator and paste it into this CodePen:

<CodePen pen="ByaZQEp" tab="html,result" title="Viewer Configurator Test" />
