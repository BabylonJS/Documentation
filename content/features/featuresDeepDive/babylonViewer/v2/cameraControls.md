---
title: Viewer Camera Controls
image:
description: How to control the Viewer's camera.
keywords: viewer, camera, controls, mouse, touch
further-reading:
    - title: Default UI
      url: /features/featuresDeepDive/babylonViewer/defaultUI
    - title: ArcRotateCamera
      url: /typedoc/classes/babylon.arcrotatecamera
video-overview:
video-content:
---

The Babylon Viewer uses Babylon's [`ArcRotateCamera`](/typedoc/classes/babylon.arcrotatecamera), so the camera interaction model is rotating the model around a target point, or moving it closer to / further from that target point. Additionally, there is some custom behavior for changing the camera target and resetting the camera pose. In short:

| Mouse                      | Touch                    | Keyboard                        | Behavior                                                                                 |
| -------------------------- | ------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------- |
| Left click + drag          | One finger + drag        | Arrow keys                      | Rotate the camera around the target                                                      |
| Right click + drag         | Two fingers + drag       | Ctrl + Shift + arrow keys       | Pan the camera (move the target)                                                         |
| Wheel                      | Pinch                    | Alt/Option + up/down arrow keys | Zoom the camera                                                                          |
| Double click on model      | Double tap on model      | N/A                             | Raycast to set a new target (e.g. the camera will rotate around this point on the model) |
| Double click off the model | Double tap off the model | N/A                             | Reset the camera to its original pose                                                    |

Also note that any time the camera pose has an immediate change (e.g. resetting the camera pose, selecting a hotspot, changing the target, etc.), the camera will smoothly interpolate to its new pose to avoid disorienting the user.
