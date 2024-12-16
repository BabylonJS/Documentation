---
title: Viewer Default UI
image:
description: Default UI provided by the HTML3DElement (<babylon-viewer>).
keywords: viewer, camera, controls, mouse, touch
further-reading:
    - title: Viewer HTML Element Interface
      url: /features/featuresDeepDive/babylonViewer/elementInterface
    - title: Viewer HTML Element Styling
      url: /features/featuresDeepDive/babylonViewer/elementStyling
video-overview:
video-content:
---

The `HTML3DElement` (`<babylon-viewer>`) custom element includes default UI for a number of Viewer capabilities. All of the UI can be customized, as described later in the [styling](/features/featuresDeepDive/babylonViewer/elementStyling) doc page.

## Loading Progress

When a model is loading a default progress bar is shown near the top of the element. If the model size can be determined, it will show actual progress. If not, it will be displayed as an indeterminate progress bar. The example below loads a large model that most likely will show the progress bar.

<CodePen pen="yyBexov" tab="result" title="Babylon Viewer Progress Bar" />

## Camera

A reset camera pose button is always present. When pressed, the camera will interpolate to the default pose. This is the same as double clicking/tapping off the model.

## Animation

When a model contains animations, controls will be displayed to play/pause the animation, change the speed of the animation, and provide an animation timeline (that can also be manually scrubbed). If a model contains several animations, additional UI is shown to allow selecting the active animation. The example below shows a model with multiple animations.

<CodePen pen="JoPGaMq" tab="result" title="Babylon Viewer Animation" />

## Material Variants

When a glTF model contains [material variants](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_variants/README.md), controls will be displayed to allow selection of the active variant. The example below shows a model with multiple material variants.

<CodePen pen="mybVGxP" tab="result" title="Babylon Viewer Material Variants" />

## HotSpots

When [hotspots](/features/featuresDeepDive/babylonViewer/hotspots) are defined on a `HTML3DElement` (`<babylon-viewer>`) instance, controls will be displayed to allow "focusing" the camera on the hotspot. When selected, the camera will interpolate to the hotspot's target pose.

<CodePen pen="VYZeGxY" tab="result" title="Babylon Viewer HotSpots" />
