---
title: Viewer HTML Element Interface
image:
description: Attributes and events of the HTML3DElement (<babylon-viewer>).
keywords: viewer, attributes, events, interface, API
further-reading:
    - title: Viewer HTML Element Styling
      url: /features/featuresDeepDive/babylonViewer/elementStyling
    - title: Viewer API
      url: https://doc.babylonjs.com/packages/viewer/index
video-overview:
video-content:
---

The `HTML3DElement` (`<babylon-viewer>`) custom element has a number of attributes and events that are not captured by the API documentation, but are summarized below.

## Attributes

<Alert severity="info">
Note that explicitly specified attribute values are re-applied when a new model is loaded.
</Alert>

| Attribute                 | Description                                                                                                                                                                | Options                                                                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `engine`                  | Which Babylon.js engine to use. Changing this value fully reloads the element.                                                                                             | **`auto`**, `WebGL`, `WegGPU`                                                                                                                                   |
| `clear-color`             | The color that fills the control before each frame is rendered.                                                                                                            | Any valid CSS color string                                                                                                                                      |
| `source`                  | A url referencing the model source.                                                                                                                                        | Any valid URL                                                                                                                                                   |
| `extension`               | Explicitly specifies the file extension (format) of the `source`. Use this attribute if the format cannot be determined from the url or the mime type.                     | Any extension supported by any [importer](/features/featuresDeepDive/importers/loadingFileTypes)                                                                |
| `environment`             | A url referencing an [environment](/features/featuresDeepDive/materials/using/HDREnvironment). The environment is used for both image based lighting (IBL) and the skybox. This is effectively a shorthand for setting `environment-lighting` and `environment-skybox` to the same texture. | Any valid URL                                                                                                                                                   |
| `environment-lighting` | A url referencing an [environment](/features/featuresDeepDive/materials/using/HDREnvironment). The environment is used for image based lighting (IBL) only. | Any valid URL |
| `environment-skybox` | A url referencing an [environment](/features/featuresDeepDive/materials/using/HDREnvironment). The environment is used for the skybox only. | Any valid URL |
| `skybox-blur`             | How much to blur the skybox.                                                                                                                                               | Numeric value between 0 and 1                                                                                                                                   |
| `tone-mapping`            | The tone mapping mode.                                                                                                                                                     | **`neutral`**, `standard`, `aces`, `none`                                                                                                                       |
| `contrast`                | The contrast applied to the scene.                                                                                                                                         | Any numeric value                                                                                                                                               |
| `exposure`                | The exposure applied to the scene.                                                                                                                                         | Any numeric value                                                                                                                                               |
| `camera-auto-orbit`       | Indicates the camera should automatically orbit its target when the scene is otherwise idle.                                                                               | Present or absent                                                                                                                                               |
| `camera-auto-orbit-speed` | How fast to orbit the camera when `camera-auto-orbit` is enabled.                                                                                                          | Any numeric value                                                                                                                                               |
| `camera-auto-orbit-delay` | The delay in milliseconds before auto orbit takes effect when the scene becomes idle.                                                                                      | Any non-negative numeric value                                                                                                                                  |
| `camera-orbit`            | Overrides the default camera orbit, defined by alpha (longitudinal rotation), beta (latitudinal rotation), and radius (distance from target).                              | Three values separated by white space (alpha beta radius). Each value can either be `auto` or a numeric value (rotation in radians). For example: `3.14 auto 5` |
| `camera-target`           | Overrides the default camera target, defined by a `x y z` world space coordinate.                                                                                          | Three values separated by white space (x y z). Each value can either be `auto` or a numeric value (distance in world space). For example: `auto 2 auto`         |
| `selected-animation`      | The default animation that is selected when the model is loaded.                                                                                                           | A numeric value that is the index of the animation                                                                                                              |
| `animation-speed`         | The default animation speed.                                                                                                                                               | `0.5`, **`1`**, `1.5`, `2`                                                                                                                                      |
| `animation-auto-play`     | Indicates the default animation should automatically start playing when the model is loaded.                                                                               | Present or absent                                                                                                                                               |
| `material-variant`        | The default material variant to select when the model is loaded.                                                                                                           | The name of the material variant                                                                                                       |
| `hotspots`                | Defines all hotspot data. See the [hotspots](/features/featuresDeepDive/babylonViewer/hotspots) docs for more details.                                                     | A json string matching the hotspots schema                                                                                                                      |

## Events

| Event                           | Description                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `modelchange`                   | Fired when the model changes (loaded or cleared).                                                                                         |
| `modelerror`                    | Fired when a model fails to load.                                                                                                         |
| `loadingprogresschange`         | Fired when the progress state changes while loading a model.                                                                              |
| `environmentchange`             | Fired when the environment changes (loaded or cleared).                                                                                   |
| `environmenterror`              | Fired when an environment fails to load.                                                                                                  |
| `selectedanimationchange`       | Fired when the selected animation changes.                                                                                                |
| `animationspeedchange`          | Fired when the animation speed changes.                                                                                                   |
| `animationplayingchange`        | Fired when animation begins playing or is paused.                                                                                         |
| `animationprogresschange`       | Fired when the elapsed time on the animation timeline changes.                                                                            |
| `selectedmaterialvariantchange` | Fired when the selected material variant changes.                                                                                         |
| `viewerready`                   | Fired when the underlying viewer instance has finished async initialization. This happens any time the element is reconnected to the DOM. |
| `viewerrender`                  | Fired every time the scene is rendered. This can be used for advanced scenarios like custom screen space hotspot UI.                      |

## Examples

Explicitly specifying the initial **camera pose** for a splat (which can be difficult to auto frame):

<CodePen pen="dPbGqaY" tab="html,result" title="Babylon Viewer Camera Pose" />

Enabling and customizing **camera auto orbit**:

<CodePen pen="QwLNyxq" tab="html,result" title="Babylon Viewer Camera Auto Orbit" />
