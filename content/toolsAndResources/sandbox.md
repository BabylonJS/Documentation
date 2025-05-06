---
title: Sandbox
image:
description: Learn about the incredibly powerful sandbox, an asset viewer and debugging tool for Babylon.js.
keywords: babylon.js, tools, resources, sandbox
further-reading:
  - title: How to Use The Inspector in Projects
    url: /toolsAndResources/inspector
video-overview:
video-content:
---

## Overview

The Babylon.js Sandbox is a powerful, web-based 3D asset viewer and debugging tool for developers and designers working with Babylon.js. It allows users to load and inspect 3D models, textures, animations, and materials with an intuitive interface. The Sandbox is an essential utility for testing and fine-tuning assets before integrating them into a Babylon.js project.

## Features

- **Model Preview**: View and interact with 3D models in real-time.
- **Supported File Formats**: `.gltf`, `.glb`, `.obj`, `.stl`, `.babylon`
- **Animation Playback**: Play, pause, and scrub through animations.
- **Environment Map Support**: Select built-in or load custom environment textures for realistic lighting.
- **Inspector Integration**: Explore detailed object properties like meshes, lights, cameras, and more.

## Accessing the Sandbox
1. Open a web browser.
2. Visit the Sandbox at [sandbox.babylonjs.com](https://sandbox.babylonjs.com).

## Loading Assets
Load assets into the Sandbox using one of the following methods:
- **Drag and Drop**: Drag supported files directly onto the Sandbox interface.
- **File Selection**: Use the open button on the toolbar to browse the file system and load assets.

Note that all required assets including files referenced from the main asset file must all be dropped or
selected so that the browser knows about them. For example, if the asset is a glTF, the `.bin` file and
all image files must be dropped or selected for the asset to load properly.

## User Interface

### Toolbar
The toolbar at the bottom provides quick access to common tasks:
- **Animation Controls**: Play, pause, and scrub animations when animations are available.
- **Display inspector**: Opens the Inspector for detailed analysis.
- **Select environment**: Change environment lighting.
- **Open your scene**: Opens files from the local file system.

### Special Keys
- `R` - Reloads the current asset
- `Space` - Toggles the toolbar

## Advanced

### Custom Environment
Drag and drop an HDR environment map to test lighting and reflections on the loaded asset.

### URL Parameters
The sandbox URL accepts a query string to load a specific asset or configure settings. This is particularly useful when sharing an asset with a link so that the asset is presented with a specific configuration. Below are the available parameters.

_Parameter names and values are case-insensitive if possible._

- `asset` - The asset URL to load automatically.
- `autoRotate` - Set to `true` to turn on auto rotation of the active camera. Auto rotation is off by default.
- `camera` - The active camera index to use from the loaded scene.
- `cameraPosition` - The comma-separated `x,y,z` position of the active camera.
- `clearColor` - The clear color for the loaded scene in hex form (e.g., `FFFFFF` for pure white).
- `environment` - The environment URL to load for glTF assets. This parameter is ignored for other asset formats.
- `kiosk` - Set to `true` to hide the toolbar. The toolbar is visible by default.
- `skybox` - Set to `false` to not create a skybox for glTF assets. Skyboxes are created by default for glTF assets. This parameter is ignored for other asset formats.
- `toneMapping` - The tone mapping (`Standard`, `ACES`, `KHR_PBR_Neutral`) to use for the loaded scene.

#### Examples
- Load a specific URL  
  https://sandbox.babylonjs.com/?asset=https://assets.babylonjs.com/meshes/boombox.glb
- Hide the toolbar and auto rotate the camera  
  https://sandbox.babylonjs.com/?asset=https://assets.babylonjs.com/meshes/boombox.glb&kiosk=true&autorotate=true
- Use a specific environment  
  https://sandbox.babylonjs.com/?asset=https://assets.babylonjs.com/meshes/boombox.glb&environment=https://assets.babylonjs.com/environments/studio.env
- Use the Khronos PBR Neutral tone mapping and set the camera to a specific position  
  https://sandbox.babylonjs.com/?asset=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DragonDispersion/glTF/DragonDispersion.gltf&toneMapping=khr_pbr_neutral&cameraPosition=-0.13,1.64,3.4
