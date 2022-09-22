---
title: Sprite Snippet Server
image:
description: Learn about saving and loading sprites from the Babylon.js snippet server.
keywords: babylon.js, diving deeper, sprites, snippet server, snippet
further-reading:
video-overview:
video-content:
---

## Snippet Server

Starting with Babylon.js v4.2, you can save, load and edit sprite managers using the Inspector. These code snippets are saved on the Babylon.js snippet server. Make a note of the snippet Id shown in when you save it.

![Snippet](/img/how_to/Sprites/snippet_screen.png)

When you have a snippet Id, you can easily load the manager using the following code:

```javascript
var spriteManagerPlayer = BABYLON.SpriteManager.CreateFromSnippetAsync(snippetID, scene).then((manager) => {
  scene.debugLayer.show();
  scene.debugLayer.select(manager);
});
```

Live example: <Playground id="#G9VPHQ" title="Sprite Snippet Server Example" description="Simple example of loading a sprite manager from the snippet server."/>

You can also specify "\_BLANK" for the snippet Id, in this case the system will create an empty one for you to work on:

```
BABYLON.SpriteManager.CreateFromSnippetAsync("_BLANK", scene);
```
