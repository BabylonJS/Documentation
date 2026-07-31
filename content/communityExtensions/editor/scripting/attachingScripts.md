---
title: Attaching scripts
image: 
description: Understanding how to add and attach scripts on nodes in a Babylon.JS Editor project
keywords: editor, scripting
further-reading:
video-overview:
video-content:
---

## Introduction

The Editor allows you to create and edit scenes without writing any code. However, each object in the scene can be customized by adding behaviors that developers can create using TypeScript. These behaviors can be attached to objects and will run when the game runs.

As examples, a behavior can be:
* I have a camera and I'd like to launch a ball when I click, according to the camera's direction
* I have an object and I want it to scale up when the mouse is over
* etc. etc.

The Editor provides a way to create, manage, and attach these scripts to all available objects in the scene. To customize scripts, the scripts can export properties (numbers, strings, booleans, vectors, keys, etc.), and these properties can be edited directly in the Editor.

Scripts can be attached to:
* Mesh
* Mesh Instance
* Light
* Camera
* Transform Node

**Note: all scripts are written using TypeScript**

**Note: the Editor is optimized to work with Visual Studio Code**

## Adding a new script

Once a workspace has been created, a folder named `src` is available in the `Assets Browser` panel tree and contains all available scripts in the project starting from the `src` folder.

In the assets browser panel, browse the `src` folder, click `Add -> TypeScript File...`, and give it a name. Once done, a script is created from a template and is ready to be attached.

**Note: when no extension is provided, the `.ts` extension is automatically added.**

![AddingScript](/img/extensions/Editor/AttachingScripts/addingscript.webp)

## Attaching a script

We named our script `cube.ts`, and it will be attached to the cube in our scene for this tutorial. To attach a script, select the cube and go to the `Script` section in the Editor's inspector. We can now select the script to attach, so let us select `cube.ts`.

**Note: The inspector also supports dragging and dropping a script asset.**

**Note: only one script can be attached to an object, but one script can be attached to multiple objects in the scene.**

![AttachingScript](/img/extensions/Editor/AttachingScripts/attachingscript.webp)

## Opening the project in VSCode and focusing on the script
To help locate the project and scripts in our workspace, we can open `Visual Studio Code` directly from the Editor. The Editor can also open scripts directly.

* To open `Visual Studio Code`, just select `File -> Open Visual Studio Code` in the toolbar.
* To open a script, simply `double-click` the desired script in the assets browser panel.

![OpeningVSCodeAndScripts](/img/extensions/Editor/AttachingScripts/openingvscodeandscript.webp)

## Understanding scripts

Scripts are used to specialize an object. This means they are attached to an existing object in the scene (for example, a mesh here). Each script will be notified:
* when it starts: this means when all assets are loaded and the game is ready. This is the function named `onStart` in the script.
* each frame: each time Babylon.JS renders a frame, the script is called immediately before the frame is rendered. This is the function named `onUpdate` in the script.

By default, a script is named `MyScript`, and it can be renamed. Also, a script extends the `Node` class of Babylon.JS by default. Here, we attached the script to a cube, which is a mesh. Let us extend `Mesh` instead of `Node` so we will have auto-completion for `Mesh` when typing `this`:

![RenamingAndExtend](/img/extensions/Editor/AttachingScripts/renamingandextend.webp)

## Customizing scripts in the editor

Scripts can be customized directly in the editor by setting custom properties. Available property types are:
* number
* string
* boolean
* vector (2d, 3d and 4d)
* key map

To make a property visible in the Editor, simply decorate it with `@visibleInInspector` in the script. More information about decorators is available here: https://www.typescriptlang.org/docs/handbook/decorators.html#decorators

**These decorators are available in the file `src/scenes/decorators.ts`. Decorators in `src/scenes/tools.ts` have been deprecated since v4.0.0-rc.2 and will be removed in v4.1.0.**

The `@visibleInInspector` decorator has the following arguments:
* the property type (number, string, boolean, etc.)
* the name of the property to be shown in the Editor
* the default value of the property

Once the property is decorated and the script is saved, the inspector is updated automatically and shows the newly
decorated property.

![UsingDecorators](/img/extensions/Editor/AttachingScripts/decorators.webp)

## Rotating the cube using the attached script

All TypeScript files are packed by default using Webpack, including the scripts that are attached to objects. That means we have to watch (or build) the project to see the effect when running the game.

There are 2 ways to watch the project:
* Watch automatically with the Editor
* Watch using a command line that runs a script available in the `package.json` file of the project.

As a developer using the command line, simply open a terminal at the root folder of the workspace and type:
```bash
npm run watch
```

This will watch all TypeScript files and repack the `dist` files.

Using the editor, simply open the preferences, go to the `Workspace` section, and enable automatic watch
(if not enabled):

![WatchingWebPack](/img/extensions/Editor/AttachingScripts/watchingwebpack.webp)

Now, let's rotate the cube using our customized property `_speed` and run the game. In this tutorial, the `onStart` function is not used. When one of these functions is not used, it can be removed.

Once the scene is playing, each decorated property supports live updates. In other words, each time a
decorated property value is modified in the inspector, the linked element in the scene being played has its
decorated property updated.

![RotatingCube](/img/extensions/Editor/AttachingScripts/rotatingcube.webp)

## Managing scripts

It is **important** that script management be done using the `Assets Browser` panel:
- Moving
- Removing
- Renaming

Doing this in the Editor allows the Editor to automatically reconfigure objects that have attached scripts. For example,
when moving a script, all paths are updated internally.

**Note: once a script has been moved, etc., do not forget to update relative imports in the script to avoid compilation errors.**
