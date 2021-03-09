---
title: The Inspector
image: 
description: Learn all about the incredibly powerful debug layer called "The Inspector" in Babylon.js.
keywords: babylon.js, tools, resources, inpsector, debug layer
further-reading:
    - title: Introduction to the Inspector - video series
      url: /toolsAndResources/tools/inspector/inspectorVideoOverview
    - title: How To Use The Inspector in Projects
      url: /toolsAndResources/tools/inspector
    - title: How To Customize the Inspector
      url: /toolsAndResources/tools/inspector/customizingInspector
    - title: Dev blog about the inspector
      url: https://medium.com/@babylonjs/dev-log-creating-the-new-inspector-b15c50900205
    - title: Using the Texture Inspector
      url: /toolsAndResources/tools/textureInspector
video-overview:
video-content:
---

## What Is It?

Babylon.js inspector is a visual debugging tool created to help pinpoint issues you may have with a scene.

For a video overview of the inspector, check out [Introduction to the inspector - video series](/toolsAndResources/tools/inspector/inspectorVideoOverview).

The inspector offers multiple tools like:
- A hierarchical view of your scene
- Multiple property grids to let you dynamically change object properties
- Specific helpers like the skeleton viewer, etc.

Its interface uses two panes:
- The scene explorer pane
- The inspector pane

It can be called using:

```javascript
scene.debugLayer.show();
```

![debug layer overview](/img/features/debuglayer/debuglayer.jpg)

The two panes can also be opened in an [embedded mode](/typedoc/interfaces/babylon.iinspectoroptions):

```javascript
scene.debugLayer.show({
  embedMode: true,
});
```

![embed mode](/img/features/debuglayer/embedmode.jpg)

## Scene explorer pane

![scene explorer](/img/features/debuglayer/sceneExplorer.jpg)

The scene explorer displays a hierarchical view of your scene. You can filter by name in the filter bar if you want to find a specific entry.

By clicking on a line you will select it and the inspector will automatically update to reflect the properties of the selected item.

Some entities offer shortcuts to contextual actions.

## Scene actions

![scene actions](/img/features/debuglayer/sceneactions.jpg)

The scene shortcuts are the following:
- The first 3 actions will turn on a specific gizmo mode (translation, rotation, scaling). When you click on one of them you can then click on a node in the Scene explorer or directly in your scene and it will be controllable with a gizmo:

![gizmo](/img/features/debuglayer/gizmo.jpg)

- The fourth action is a picker. Just pick a mesh in your scene and it will be selected in your scene explorer
- The last one will force the scene explorer to update. For performance reasons, the scene explorer is not listening to all changes that can happen on the scene so you may end up needing to refresh it manually.

## Mesh actions
![mesh actions](/img/features/debuglayer/meshactions.jpg)

The mesh shortcuts are the following:
- The first action will enable the bounding box gizmo:

![bounding box gizmo](/img/features/debuglayer/boundingboxgizmo.jpg)

- The second action will show/hide the mesh.

## Light actions

![light actions](/img/features/debuglayer/lightactions.jpg)

You can use the light action to turn a light on and off.

## Camera actions

![camera actions](/img/features/debuglayer/cameraactions.jpg)

You can use the camera action to switch the active camera (when they are multiple cameras in a scene).

## GUI control actions

![gui control actions](/img/features/debuglayer/controlactions.jpg)

You can use the GUI control actions to:
- Display outline of a control
- Show / hide a specific control

## Rendering pipeline actions

![Rendering pipeline actions](/img/features/debuglayer/renderpipelineactions.jpg)

When your scene does not contain a default rendering pipeline, you can right-click on the rendering pipelines node to get a context menu letting you create a new default rendering pipeline.


## Inspector pane

The inspector pane contains 4 tabs:

![inspector](/img/features/debuglayer/inspector.jpg)

- The property grid which will display configurable controls for the current selected entity:

![property grid](/img/features/debuglayer/property.jpg)

- The debug pane will let you turn features on and off. It also let you display a grid and turn viewers (bones or physics) on and off:

![debug pane](/img/features/debuglayer/debugpane.jpg)

- The statistics pane gives information about all metrics captured by the engine:

![stats pane](/img/features/debuglayer/statspane.jpg)

- The tools pane lets you access utilities (like screen capture or recording as well as several tools related to glTF):

![tools](/img/features/debuglayer/tools.jpg)

## Popup mode

You can move any pane into a popup mode by clicking the icon right left to the close button in the pane header:

![popup](/img/features/debuglayer/popup.jpg)

## Specific debug tools

Specific debug tools can be found across the inspector:

## Render grid

This tool (available in the Debug pane) will render a grid on the (0,0,0) plane:

![grid](/img/features/debuglayer/grid.jpg)

## Bones viewer

This tool (available in the skeleton property grid) will render your skeletons:

![bones](/img/features/debuglayer/BonesView.png)

## Skeleton Map Shader

This tool (available in the mesh property grid when the mesh has an attached skeleton) will render a unique color on the mesh, for each bone, showing their total contribution:

![bones](/img/features/debuglayer/BonesMap.png)

## Bone Weight Shader

This tool (available in the mesh property grid when the mesh has an attached skeleton) will render a heat map showing the selected bones contribution:

![bones](/img/features/debuglayer/BonesWeight.png)

## Physics viewer

This tool (available in the Debug pane) will render your physics impostors:

![physics](/img/features/debuglayer/physics.jpg)

## Normal painter

This tool (available in the property pane when you select a mesh) will paint the normals on your active mesh:

![paint normal](/img/features/debuglayer/paintnormal.jpg)

## Vertex normal viewer

This tool (available in the property pane when you select a mesh) will render the vertex normals of a mesh:

![vertex normal](/img/features/debuglayer/vertexnormal.jpg)

## Texture painter

This tool (available in the property pane when you select a material with textures in it) will render the texture directly as an emissive one:

![texture painter](/img/features/debuglayer/texturepainter.jpg)