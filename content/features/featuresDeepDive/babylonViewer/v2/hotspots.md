---
title: Viewer HotSpots
image:
description: HotSpots and annotations in the Viewer.
keywords: viewer, hotspots, annotations
further-reading:
    - title: Advanced Usage
      url: /features/featuresDeepDive/babylonViewer/advancedUsage
video-overview:
video-content:
---

HotSpots and Annotations are related concepts. HotSpots are data that define "points of interest" within the model. Annotations are HTML elements that track a hotspot in screen space.

## HotSpot Data

There are currently two types of hotspots:

1. **Surface** - this type of hotspot is defined by referencing a specific face (by the three vertex indices of the triangle) and barycentric coordinates (a specific point on the surface of that face/triangle). Surface hotspots track the point even when the model is animating. The normal is calculated from the face.
2. **World** - this type of hotspot is defined by a static world position and normal.

Any hotspot can also optionally include a custom camera orbit (alpha, beta, radius) relative to the hotspot point. In the following example, there is one "surface" hotspot tied to the planet Earth, and one static hotspot that gives a top down view of the solar system.

<CodePen pen="vEBGGmx" tab="html,result" title="Babylon Viewer HotSpots" />

Defining hot spots by hand is not an easy task, but the [Viewer Configurator](/toolsAndResources/viewerConfigurator) makes this simple.

## Annotations

To create annotations, add `HTML3DAnnotationElement` (`<babylon-viewer-annotation>`) elements as children of the `HTML3DElement` (`<babylon-viewer>`), and set the `hotspot` attribute to the name of the hotspot it should track. Then, add whatever HTML you'd like as children of the `HTML3DAnnotationElement` (`<babylon-viewer-annotation>`).

Here is a simple example that adds labels to some of the planets within the solar system. Notice that when an animation plays, the annotations track the hotspots in real time.

<CodePen pen="PwYNNEQ" tab="html,result" title="Babylon Viewer Annotations" />

### Annotation Styling

Annotations provide default UI which can be styled in several ways.

#### CSS Variables

The following CSS variables can be used to change basic styling of the default UI:

| Variable                        | Description                                              |
| ------------------------------- | -------------------------------------------------------- |
| `--annotation-foreground-color` | The default color for the foreground of all annotations. |
| `--annotation-background-color` | The default color for the background of all annotations. |

#### CSS Custom States

By default, `HTML3DAnnotationElement` (`<babylon-viewer-annotation>`) has a reduced opacity when the hotspot normal is facing away from the camera. This default styling can be overridden through CSS custom states. The custom states available are:

| State         | Description                                                                                                                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `back-facing` | This state is set when the hotspot normal is facing away from the camera.                                                                                                                                                                                                                    |
| `invalid`     | This state is set when the hotspot is invalid. This can happen because the hotspot name specified in the element does not have corresponding hotspot data, or it can happen if the hotspot data itself is invalid (e.g. references a mesh or vertex index that does not exist in the model). |

Following is an example that overrides the style for the `back-facing` state to keep the annotation at full opacity regardless of the hotspot normal:

<CodePen pen="MYgyyVM" tab="css,result" title="Babylon Viewer Annotations - CSS States" />

#### Parts

For more complex styling, use the `annotation` part. Following is an example that uses this to increase the annotation font size:

<CodePen pen="mydpOyB" tab="css,result" title="Babylon Viewer Annotations - Parts" />

### Custom Annotations

Custom annotations are also supported in two different ways.

#### Custom UI

If you want annotations that track a single hotspot just like the default annotation UI, but you want to completely customize how it looks, simply add child elements to the `HTML3DAnnotationElement` (`<babylon-viewer-annotation>`). These child elements will override the default UI.

Following is an example that overrides the default annotation UI:

#### Custom UI and Behavior

If you want custom UI and you don't want the default "one annotation tracks one hotspot" behavior, this is also supported by:
1. Adding arbitrary child elements to the `HTML3DElement` (`<babylon-viewer>`).
1. Calling the `queryHotSpot` function and using the results to position the child elements.

In the following example, the Earth and Mars hotspots are queried every frame, and the results are used to display a line between Earth and Mars with a label at the midpoint that displays the distance between the two planets in the current orbital state.

<CodePen pen="MYgeejW" tab="css,result" title="Babylon Viewer Annotations - Custom" />
