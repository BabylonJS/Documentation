---
title: Getting Started with the Editor
image: 
description: Getting Started with the Babylon.js Editor, a community project maintained mostly by Julien Moreau-Mathis.
keywords: editor
further-reading:
video-overview:
video-content:
---

## Welcome to the Babylon.JS Editor documentation

Welcome to the documentation of the Babylon.JS Editor. A series of tutorials are available to understand the basics of the Editor. It is recommended to read the tutorials before starting with the Editor.

Please note that the editor is a community project maintained mostly by Julien Moreau-Mathis ([@luaacro](https://twitter.com/Luaacro)).

## Downloading
The Babylon.js Editor is available as a desktop application using Electron.
When an update is available (new features, bug fixes), you'll get notified and the editor will download the new installer for you.

The Editor supports Windows, macOS and Linux and can be downloaded through its website: http://editor.babylonjs.com/

## External tutorials

Some external tutorials are available:

* [Introduction to the Babylon.JS Editor v4](https://www.crossroad-tech.com/entry/babylonjs-editor-v4-introduction-en) by [@Limes2018](https://gist.github.com/flushpot1125)

## External examples

Some project examples are available on Github:

* [Using WebXR with Babylon.JS Editor v4](https://github.com/flushpot1125/WebXR_VRController_Editor_template) by [@Limes2018](https://gist.github.com/flushpot1125)

## Useful shortcuts

### Global
* `Ctrl+s` or `Command+s`: save the project.
* `Ctrl+f` or `Command+f`: find a node in the current scene or run a command
* `Ctrl+r` or `Command+r`: run the application/game in the integrated browser
* `Ctrl+b` or `Command+b`: build the project (using WebPack, this can take a while)
* `Ctrl+g` or `Command+g`: generate the project (generates all outputs of the current project (scripts, scene files, etc.))
* `Ctrl+Shift+r` or `Command+Shift+r`: build and run the application/game
* `Ctrl+z` or `Command+z`: Undo action
* `Ctrl+y` or `Command+Shift+z`: Redo action

### In preview
* `f`: focus the selected node
* `t`: enable/disable the position gizmo
* `r`: enable/disable the rotation gizmo
* `w`: enable/disable the scaling gizmo
* `i`: toggle the isolated mode. Isolated mode is used to help debugging a mesh by isolating it. Just select a mesh in the Editor and then type `i`. `escape` to exit isolation mode.
* `suppr.`: remove the selected node
* `Ctrl+c` or `Command+c`: copy the selected node
* `Ctrl+v` or `Command+v`: past previously copied node. In case of a mesh, a new instance will be created instead of a real clone of the mesh.
