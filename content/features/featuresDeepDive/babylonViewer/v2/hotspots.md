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

Defining hotspots by hand is not an easy task. We are working on tooling to make this easy, but in the meantime you can use this Playground to help define hotspots:

<Playground id="#2DBAQN#3" title="Babylon Viewer HotSpot Helper" description="A Playground to help define Babylon Viewer hotspots (until real tooling is finished!)." />

## Annotations

To create annotations, add `HTML3DAnnotationElement` (`<babylon-viewer-annotation>`) elements as children of the `HTML3DElement` (`<babylon-viewer>`), and set the `hotspot` attribute to the name of the hotspot it should track. Then, add whatever HTML you'd like as children of the `HTML3DAnnotationElement` (`<babylon-viewer-annotation>`).

Here is a simple example that adds labels to some of the planets within the solar system. Notice that when an animation plays, the annotations track the hotspots in real time.

<CodePen pen="PwYNNEQ" tab="html,result" title="Babylon Viewer Annotations" />

### Annotation Styling

By default, `HTML3DAnnotationElement` (`<babylon-viewer-annotation>`) has a reduced opacity when the hotspot normal is facing away from the camera. This default styling can be overridden through CSS custom states. The custom states available are:

| State         | Description                                                                                                                                                                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `back-facing` | This state is set when the hotspot normal is facing away from the camera.                                                                                                                                                                                                                    |
| `invalid`     | This state is set when the hotspot is invalid. This can happen because the hotspot name specified in the element does not have corresponding hotspot data, or it can happen if the hotspot data itself is invalid (e.g. references a mesh or vertex index that does not exist in the model). |

Following is an example that overrides the style for the `back-facing` state to keep the annotation at full opacity regardless of the hotspot normal:

<CodePen pen="MYgyyVM" tab="css,result" title="Babylon Viewer Annotations - Styling" />

### Custom Annotations

Fully custom annotations are also possible by:
1. Adding arbitrary child elements to the `HTML3DElement` (`<babylon-viewer>`).
1. Calling the `queryHotSpot` function and using the results to position the child elements.

In the following example, the Earth and Mars hotspots are queried every frame, and the results are used to display a line between Earth and Mars with a label at the midpoint that displays the distance between the two planets in the current orbital state.

<CodePen pen="MYgeejW" tab="css,result" title="Babylon Viewer Annotations - Styling" />
