---
title: Loading Assets From Memory
image-url: /img/defaultImage.webp
description: Learn how to load assets directly from memory.
keywords: advanced, memory, optimization
further-reading:
video-overview:
video-content:
---

## Loading Assets Directly From Memory

There may be times when you'll want to pre-load (store) assets in memory and load those assets into your Babylon scene from memory. This is achievable by using a blob URL.

<Playground id="#FIWM5X#57" title="Load Asset From Memory" description="Simple example of loading an asset from memory."/>

This works by loading an asset into memory, converting it to a blob, creating a URL for that blob in memory, and then using that URL with any of Babylon's loading methods.

Let's take a quick look at the four lines of code needed to achieve this.

First, we load an object from a URL directly into an `ArrayBuffer` in memory.

```javascript
const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync("scenes/BoomBox.glb", true);
```

Next we convert that array buffer to a blob (in memory).

```javascript
const assetBlob = new Blob([assetArrayBuffer]);
```

Then we create a URL for that blob.

```javascript
const assetUrl = URL.createObjectURL(assetBlob);
```

Finally, we load the asset into the scene from the URL that points to the in-memory blob.

```javascript
await BABYLON.AppendSceneAsync(assetUrl, scene, {
    pluginExtension: ".glb"
});
```

It's important to note that the Babylon scene loader will use the correct loader based on the file extension of the asset you're trying to load. In this case, since we're loading binary data saved to memory, the scene loader needs to be explicitly told which loader to use. This is why the final argument in the `AppendSceneAsync` method (the options object) specifies the `pluginExtension` as `".glb"`.
