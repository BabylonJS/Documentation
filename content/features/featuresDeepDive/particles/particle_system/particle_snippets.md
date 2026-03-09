---
title: Particle Snippet Server
image: 
description: Learn how to save particle systems to the Babylon.js snippet server.
keywords: diving deeper, particles, particle system, snippets, snippet server
further-reading:
video-overview:
video-content:
---

# Snippet Server

Starting with Babylon.js v4.2, you can save, load, and edit particle systems using the Inspector. These code snippets are saved on the Babylon.js snippet server. Make a note of the snippet ID shown when you save it.

![Snippet](/img/how_to/Particles/snippet_screen.png)

When you have a snippet ID, you can easily load the particle system using the following code:

```javascript
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2, segments: 32}, scene);
BABYLON.ParticleHelper.ParseFromSnippetAsync("T54JV7", scene, false).then(system => {
    system.emitter = sphere;
});
```

Live example: <Playground id="#XGX927" title="Particle Snippet Server Example" description="Simple example of loading a particle system from the snippet server." isMain={true} category="Particles"/>

You can also specify `"_BLANK"` for the snippet ID. In this case, the system will create an empty one for you to work on:

```javascript
BABYLON.SpriteManager.ParseFromSnippetAsync("_BLANK", scene);
```
