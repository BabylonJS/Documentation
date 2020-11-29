---
title: Getting Started with the Editor
image: 
description: Getting Started with the Babylon.js Editor, a community project maintained mostly by Julien Moreau.
keywords: welcome, babylon.js, editor
further-reading:
video-overview:
video-content:
---

The V3 of the Babylon.js Editor is now available and comes with new features from the V2. Such as multiple scene managements, improved tools and new tools.

The editor V3 is available at http://editor.babylonjs.com/v3.
The video tutorials are all available on [a Youtube playlist](https://www.youtube.com/watch?v=obEuCI_pPL4&list=PLuZE-0i73Wo-xqfBsgZA531BXeesXQ3Op&index=1)

Please note that the editor is a community project maintained mostly by Julien Moreau.

## Desktop App
The Babylon.js Editor is firstly available as a desktop application.

**Note: It is highly recommended to use the desktop app as you'll get access to the local file system to save your projects.**

When an update is available (new features, bug fixes), you'll get notified and the editor will download the new installer for you.
This will also allow you to continue working even in offline mode and save projects directly on your local file system instead of using OneDrive. Basically, the online version must be just used as a playground or a scene explorer.

Downloading:
* Windows: [http://editor.babylonjs.com/BabylonJS Editor.exe](http://editor.babylonjs.com/download/win32.html)
* Mac OS X: [http://editor.babylonjs.com/BabylonJS Editor.dmg](http://editor.babylonjs.com/download/osx.html)
* Linux: [http://editor.babylonjs.com/v3/BabylonJS Editor.zip](https://editor.babylonjs.com/v3/BabylonJS%20Editor.zip)

## Project example
As an example, the following demo has been done 100% in the editor. It includes writing custom scripts, custom post-processes etc.

<iframe width="560" height="315" src="https://www.youtube.com/embed/obEuCI_pPL4" frameborder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>

## Available features
* Create, edit and save particle systems
* Create, edit and save particle system sets
* Create and edit animations
* Create and edit lens flares systems
* Create and edit physics states on meshes
* Create and edit materials (including materials library)
* Add and edit sounds
* Add and edit textures (including render target textures & procedural textures)
* Save projects on OneDrive / local with Electron
* Deploy project template on OneDrive / local with Electron
* Scene graph view
* Create and edit custom post-process
* Attach custom scripts (JavaScript and TypeScript) to your objects
* Test your scenes with debug support

## Starting with the editor
Once you run the editor, you'll see several panels:
* Preview: the scene preview in live
* Assets: this will contain assets in future such as custom scripts etc. that you'll be able to modify and drag'n'drop
* Graph: the current scene's graph showing the nodes configuration
* Inspector: contains all the tools available for the currently selected object in the scene. The inspector is used to modify the properties of the selected object
* Stats: shows the rendering and scene statistics for information according to the current scene preview
* Files: shows all the files that have been loaded in your current project. Just as information.

To use the tools and start a new project, it is highly recommended to read the documentation of each tool in this section.