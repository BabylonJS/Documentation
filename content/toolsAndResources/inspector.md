---
title: The Inspector
image:
description: Learn all about the incredibly powerful debug layer called "The Inspector" in Babylon.js.
keywords: babylon.js, tools, resources, inspector, debug layer
further-reading:
  - title: Introduction to the Inspector - video series
    url: /legacy/inspector/inspectorVideoOverview
  - title: How To Use The Inspector in Projects
    url: /legacy/inspector
  - title: Dev blog about the inspector
    url: https://medium.com/@babylonjs/dev-log-creating-the-new-inspector-b15c50900205
  - title: Using the Texture Inspector
    url: /legacy/inspector/textureInspector
video-overview:
video-content:
---

## What Is It?

The Babylon.js Inspector is a visual debugging tool created to help pinpoint issues you may have with a scene.

For a video overview of the inspector, check out [Introduction to the inspector - video series](/legacy/inspector/inspectorVideoOverview).

The Inspector offers multiple tools, such as:

- A hierarchical view of your scene
- Multiple property grids to let you dynamically change object properties
- Specific helpers like the skeleton viewer, etc.

Its interface uses two panes:

- The scene explorer pane
- The inspector pane

It can be opened in two ways:

1. Without [ES Modules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)

```javascript
scene.debugLayer.show();
```

2. Using ES Modules (Avoid using the first approach if you're already using modules):

```javascript
import { Inspector } from '@babylonjs/inspector';

// ... YOUR SCENE CREATION
Inspector.Show(scene, {});
```

![debug layer overview](/img/features/debuglayer/debuglayer.webp)

### Embedded Mode

The two panes can also be opened in an [embedded mode](/typedoc/interfaces/babylon.iinspectoroptions):

```javascript
scene.debugLayer.show({
  embedMode: true,
});
```

or:

```javascript
Inspector.Show(scene, {
  embedMode: true
});
```

![embed mode](/img/features/debuglayer/embedmode.webp)

To hide the inspector:

```javascript
scene.debugLayer.hide();
```

or:

```javascript
Inspector.Hide(); // You don't need to pass the scene
```

## Scene explorer pane

![scene explorer](/img/features/debuglayer/sceneExplorer.webp)

The scene explorer displays a hierarchical view of your scene. You can filter by name in the filter bar if you want to find a specific entry.

Clicking a line selects it, and the Inspector automatically updates to reflect the properties of the selected item.

Some entities offer shortcuts to contextual actions.

## Scene actions

![scene actions](/img/features/debuglayer/sceneactions.webp)

The scene shortcuts are as follows:

- The first 3 actions turn on a specific gizmo mode ([translation](/typedoc/classes/babylon.transformnode#translate), rotation, scaling). After you click one of them, you can click a node in the Scene Explorer or directly in your scene, and then control it with a gizmo:

![gizmo](/img/features/debuglayer/gizmo.webp)

- The fourth action is a picker. Just pick a mesh in your scene, and it will be selected in your Scene Explorer.
- The last one forces the Scene Explorer to update. For performance reasons, the Scene Explorer does not listen to all changes that can happen in the scene, so you may need to refresh it manually.

## Mesh actions

![mesh actions](/img/features/debuglayer/meshactions.webp)

The mesh shortcuts are as follows:

- The first action will enable the bounding box gizmo:

![bounding box gizmo](/img/features/debuglayer/boundingboxgizmo.webp)

- The second action will show/hide the mesh.

## Light actions

![light actions](/img/features/debuglayer/lightactions.webp)

You can use the light action to turn a light on and off.

## Camera actions

![camera actions](/img/features/debuglayer/cameraactions.webp)

You can use the camera action to switch the active camera when there are multiple cameras in a scene.

## GUI control actions

![gui control actions](/img/features/debuglayer/controlactions.webp)

You can use the GUI control actions to:

- Display outline of a control
- Show / hide a specific control

## Rendering pipeline actions

![Rendering pipeline actions](/img/features/debuglayer/renderpipelineactions.webp)

When your scene does not contain a default rendering pipeline, you can right-click on the rendering pipelines node to get a context menu letting you create a new default rendering pipeline.

## Inspector pane

The Inspector pane contains 4 tabs:

![inspector](/img/features/debuglayer/inspector.webp)

- The property grid, which displays configurable controls for the currently selected entity:

![property grid](/img/features/debuglayer/property.webp)

- The debug pane lets you turn features on and off. It also lets you display a grid and turn viewers (bones or physics) on and off:

![debug pane](/img/features/debuglayer/debugpane.webp)

- The statistics pane gives information about all metrics captured by the engine:

![stats pane](/img/features/debuglayer/statspane.webp)

- The tools pane lets you access utilities such as screen capture, recording, and several tools related to glTF:

![tools](/img/features/debuglayer/tools.webp)

## Popup mode

There are occasions when opening the Inspector in a child window is preferable. The canvas may be too small to use the Inspector effectively, or the Inspector may cover too much of the canvas, making the scene hard to debug. There are a few ways to pop the Inspector into a child window that is still connected to the scene. The first is to click the icon on the right side of the pane header bar adjacent to the close button. 

![popup](/img/features/debuglayer/popup.webp)

This pops out the selected pane - either Scene Explorer or Inspector - into a child window. If the panes have been opened in [embedded mode](/legacy/inspector#embedded-mode), the embedded Inspector opens in a single child window. Additionally, the Inspector can be opened as a popup by default. The individual Scene Explorer and Inspector panes can be opened as popups with the following code:

``` javascript
var debugLayer = await scene.debugLayer.show();

debugLayer.popupSceneExplorer();
debugLayer.popupInspector();
```
<Playground id="#KN5JBQ#3" title="Popup mode for Inspector panes" description="An example of opening inspector panes in popup mode" image="/img/playgroundsAndNMEs/inspectorPopup.webp" />

### Embedded Popup Mode
Additionally, the embedded mode inspector can be opened as a popup by default:

``` javascript
var debugLayer = await scene.debugLayer.show({
    embedMode: true
});

debugLayer.popupEmbed()
```
<Playground id="#KN5JBQ#5" title="Embedded popup mode for Inspector panes" description="An example of opening embedded inspector in popup mode" image="/img/playgroundsAndNMEs/inspectorEmbedPopup.webp" />

## Specific debug tools

Specific debug tools can be found throughout the Inspector:

## Render grid

This tool (available in the Debug pane) will render a grid on the (0,0,0) plane:

![grid](/img/features/debuglayer/grid.webp)

## Bones viewer

This tool (available in the skeleton property grid) will render your skeletons:

![bones](/img/features/debuglayer/BonesView.webp)

## Skeleton Map Shader

This tool (available in the mesh property grid when the mesh has an attached skeleton) will render a unique color on the mesh, for each bone, showing their total contribution:

![bones](/img/features/debuglayer/BonesMap.webp)

## Bone Weight Shader

This tool (available in the mesh property grid when the mesh has an attached skeleton) will render a heat map showing the selected bones' contribution:

![bones](/img/features/debuglayer/BonesWeight.webp)

## Physics viewer

This tool (available in the Debug pane) will render your physics impostors:

![physics](/img/features/debuglayer/physics.webp)

## Normal painter

This tool (available in the property pane when you select a mesh) will paint the normals on your active mesh:

![paint normal](/img/features/debuglayer/paintnormal.webp)

## Vertex normal viewer

This tool (available in the property pane when you select a mesh) will render the vertex normals of a mesh:

![vertex normal](/img/features/debuglayer/vertexnormal.webp)

## Texture painter

This tool (available in the property pane when you select a material that contains textures) will render the texture directly as an emissive one:

![texture painter](/img/features/debuglayer/texturepainter.webp)

## Extensibility

The Inspector can be easily extended to allow manipulation of custom node properties. Simply define your custom properties in the node's `inspectableCustomProperties` array, and they will be available under the CUSTOM heading after selecting the node in the Inspector.

<Playground id="#LQF5QR#2" title="Inspector custom properties for a node" description="An example of inspector custom properties for a node" image="/img/playgroundsAndNMEs/inspectorCustomProperties.webp" />

```javascript
myNode.inspectableCustomProperties = [
  {
    label: "My boolean field",
    propertyName: "myBooleanField",
    type: BABYLON.InspectableType.Checkbox,
  },
  {
    label: "My color field",
    propertyName: "myColor3Field",
    type: BABYLON.InspectableType.Color3,
  },
  {
    label: "My quaternion field",
    propertyName: "myQuaternionField",
    type: BABYLON.InspectableType.Quaternion,
  },
  {
    label: "My numeric range field",
    propertyName: "myRangeField",
    type: BABYLON.InspectableType.Slider,
    min: 0.5,
    max: 5.0,
    step: 0.1,
  },
  {
    label: "My string field",
    propertyName: "myStringField",
    type: BABYLON.InspectableType.String,
  },
  {
    label: "My vector field",
    propertyName: "myVector3Field",
    type: BABYLON.InspectableType.Vector3,
  },
  {
    label: "My tab field",
    type: BABYLON.InspectableType.Tab,
  },
  {
      label: "My options field",
      propertyName: "myOptionsField",
      options: [
          { label: "options1", value: 1 },
          { label: "options2", value: 2 }
      ],
      callback: (option)=>{
      
      },
      type: BABYLON.InspectableType.Options,

  },
  {
      label: "My button field",
      propertyName: "myButtonField",
      callback: ()=>{
      
      },
      type: BABYLON.InspectableType.Button,

  }
];
```

The Inspector can also be extended to allow manipulation of custom material properties.
<Playground id="#LQF5QR#52" title="Inspector custom properties for a material" description="An example of inspector custom properties for a material"/>
