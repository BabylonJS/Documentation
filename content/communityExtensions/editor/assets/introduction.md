---
title: Assets introduction
image: 
description: Understanding how to use the "Assets Browser" panel in the Babylon.JS Editor
keywords: editor, workspace, assets
further-reading:
video-overview:
video-content:
---

## Introduction

Starting with Babylon.JS Editor v4.1.0, asset management has been improved by introducing a new panel: **"Assets Browser"**.
All assets are now shared across projects and can be browsed as in other popular 3D editors.

The Assets Browser can browse two main asset types:
* Source folder `/src`, which contains all the project's TypeScript, JSON, and other files
* Assets folder `/assets`, which contains all scene assets (textures, meshes, materials, sounds, etc.).

To identify assets quickly, distinct colors are applied to titles:
* `Yellow` represents mesh assets
* `Green` represents material assets
* `Blue` represents particle system assets

## Using Assets Browser

The Assets Browser panel is composed of 2 resizable panes:
* left pane: the directory tree, like we have in any file explorer
* right pane: the content of the selected directory (files & sub-directories)

Each time a directory is selected in the tree (left pane), the right pane is updated to show its content.

![SelectDirectoryTree](/img/extensions/Editor/AssetsIntroduction/select-directory-tree.webp)

The right pane also contains a stack of open folders. This stack shows the currently browsed path
and can be clicked to quickly access a directory available in the stack.

![UseStack](/img/extensions/Editor/AssetsIntroduction/use-stack.webp)

## Using Favorites

At the top of the directory tree, 2 favorite shortcuts are available:
* `All Materials`: shows the list of all available material assets that have been instantiated (used) in the current scene.
* `All Textures`: like materials, shows the list of all available texture assets that have been instantiated (used) in the current scene.

![UsingFavorites](/img/extensions/Editor/AssetsIntroduction/using-favorites.webp)

## Creating a New Folder

New folders can be created at any time. Just right-click an empty space in the panel, select `New Directory...`, and
type the name of the folder to create. Once accepted, a new folder will be created in the currently browsed folder.

![CreatingFolder](/img/extensions/Editor/AssetsIntroduction/creating-folder.webp)

## Selecting Files

As in any other file browser, multiple files can be selected using either:
- `CTRL or Command + Click` to select multiple individual files
- `Shift + Click` to select a range of files

**Note: rectangle selection is not yet available and is still WIP.**

![SelectingFiles](/img/extensions/Editor/AssetsIntroduction/selecting-files.webp)

## Moving Files

Once file(s) have been selected, they can be dragged and dropped into any folder. Once moved, all links to the moved files
are updated automatically by the editor (materials, textures, sounds, etc.).

Until the project is saved, the editor creates a temporary file named `links.json` located at `${workspacePath}/projects/links.json`.
This JSON file stores the latest move actions for each moved file so that, if the project is closed before saving, the real path for linked assets (such as material textures) can still be retrieved.

![MovingFiles](/img/extensions/Editor/AssetsIntroduction/moving-files.webp)

Drag and drop is also supported in the tree.

![MovingFiles](/img/extensions/Editor/AssetsIntroduction/moving-files-tree.webp)
