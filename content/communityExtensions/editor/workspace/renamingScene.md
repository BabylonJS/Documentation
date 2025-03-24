---
title: Renaming a scene
image:
description: Understanding how to rename a scene
keywords: editor, workspace, project, scene
further-reading:
video-overview:
video-content:
---

## Renaming A Scene

To rename a scene, just go to the `Assets Browser` panel and rename the scene file by double-clicking its name.

Once accepted, the following folders will be renamed:

- _`workspacePath`/projects/`oldname`_ -> _`workspacePath`/projects/`newname`_
- _`workspacePath`/scenes/`oldname`_ -> _`workspacePath`/scenes/`newname`_

Scene names must be unique. In case the folders already exists (in other words, if the scene already exists)
then the operation is aborted.

## Renaming paths in loaders in sources

Paths to scenes being loaded in the code must have their paths updated.

For example:

```typescript
const rootUrl = "./scenes/oldName/";

AppendSceneAsync(rootUrl + "scene.babylon", this.scene, () => {
  // ...
});
```

should be renamed to:

```typescript
const rootUrl = "./scenes/newName/";

AppendSceneAsync(rootUrl + "scene.babylon", this.scene, () => {
  // ...
});
```
