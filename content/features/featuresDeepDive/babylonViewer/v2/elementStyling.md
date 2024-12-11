---
title: Viewer HTML Element Styling
image:
description: CSS styles, parts, and slots for the HTML3DElement (<babylon-viewer>).
keywords: viewer, attributes, events, interface, API
further-reading:
    - title: Default UI
      url: /features/featuresDeepDive/babylonViewer/defaultUI
    - title: Viewer HotSpots
      url: /features/featuresDeepDive/babylonViewer/hotspots
video-overview:
video-content:
---

While the Babylon Viewer provides [default UI](/features/featuresDeepDive/babylonViewer/defaultUI) for most capabilities of the Viewer, all of this UI can customized by:
- Styling via CSS variables
- Styling via custom element [CSS shadow parts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_shadow_parts)
- Full control of the UI with [slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots#adding_flexibility_with_slots)

## CSS Variables

The following CSS variables can be used to change basic styling of the default UI:

| Variable                      | Description                                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `--ui-foreground-color`       | The default color for the foreground of all UI elements.                                                                                    |
| `--ui-background-hue`         | The default hue for the background of all UI elements.                                                                                      |
| `--ui-background-saturation`  | The default saturation for the background of all UI elements.                                                                               |
| `--ui-background-lightness`   | The default lightness for the background of all UI elements.                                                                                |
| `--ui-background-opacity`     | The default opacity for the background of all UI elements.                                                                                  |
| `--ui-background-color`       | The default color for the background of all UI elements (by default, derived from the background hue, saturation, lightness, and opacity).              |
| `--ui-background-color-hover` | The default color for the background of all UI elements when hovered (by default, derived from the background hue, saturation, lightness, and opacity). |

<CodePen pen="wBwGMQd" tab="html,result" title="Babylon Viewer Camera Pose" />

## Parts

The following CSS shadow parts can be used for more complex styling changes of the default UI:

| Part           | Description                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `progress-bar` | The loading progress bar that is displayed near the top of the custom element by default.                                                            |
| `tool-bar`     | The toolbar that has controls for animation, material variants, and hotspots and that is displayed near the bottom of the custom element by default. |

<CodePen pen="YPKqwdy" tab="html,result" title="Babylon Viewer Camera Pose" />

## Slots

The following slots can be used to completely replace the default UI:

| Slot           | Description               |
| -------------- | ------------------------- |
| `progress-bar` | The default progress bar. |
| `tool-bar`     | The default toolbar.      |

When replacing the default UI, you can use the properties, functions, and events of the `HTML3DElement` (`<babylon-viewer>`) to bind the UI to the custom element state.

Example of replacing the default **loading progress bar**:

<CodePen pen="GgKZoej" tab="html,result" title="Babylon Viewer Camera Pose" />

Example of replacing the default **tool bar**:

<CodePen pen="jENqWjz" tab="html,result" title="Babylon Viewer Camera Pose" />
