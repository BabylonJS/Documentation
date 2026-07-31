---
title: Creating and understanding scenes
image: 
description: Creating new scenes and understanding how they behave in a workspace
keywords: editor, workspace, project, scene
further-reading:
video-overview:
video-content:
---

## Adding Scene To Workspace

*Note: since Editor v4.4.0, the way to create new scenes has changed. It is highly recommended to update to at least this version.*

By default, a newly created workspace contains one scene. Within a workspace, it is possible to manage multiple
scenes in order to, for example, split the levels of a game.

A newly created scene is always empty and ready to receive new assets, etc.

## Creating A New Scene
To create a new scene in the workspace, just go to the `Assets Browser` panel and select `Add -> Scene...`.

![CreateNewProjectToolbar](/img/extensions/Editor/CreatingProject/create-new-project.webp)

Once clicked, a pop-up appears to ask for the name of the scene. Once the `Finish` button is clicked,
the new scene is created on the file system. Then, the Editor asks whether to continue working
on the current scene or load the new one.

Once a scene has been created, a new folder located at *"`workspacePath`/projects/`sceneName`"* is created containing
all the resources of the scene. Once the new scene is loaded and generated, a new folder located at *"`workspacePath`/scenes/`sceneName`"* is created.
