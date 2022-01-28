---
title: Loading Assets From Memory
image-url: /img/defaultImage.png
description: Learn how to load assets directly from memory.
keywords: advanced, memory, optimization
further-reading:
video-overview:
video-content:
---

## Loading Assets Directly From Memory

There may be times where you'll want to pre-load (store) assets in memory and load those assets from memory into your Babylon scene. This is achievable by using a blob url.

<Playground id="#FIWM5X#1" title="Load Asset From Memory" description="Simple example of loading an asset from memory." image="/img/playgroundsAndNMEs/divingDeeperNodeMaterialParticle1.jpg"/>

The way this works is that you load an asset into memory, convert it to a blob, create a url to that blob in memory, and then you have a url that you can use with any of the loading methods in Babylon.

Let's take a quick look at the 4 lines of code to achieve this.

First we load an object from a url directly into an arrayBuffer in memory.

```
const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync("scenes/BoomBox.glb", true);
```

Next we convert that array buffer to a blob (in memory).

```
const assetBlob = new Blob([assetArrayBuffer]);
```

Then we create a url to that blob.

```
const assetUrl = URL.createObjectURL(assetBlob);
```

Then finally we load the asset into the scene from the url which points to the memory blob.

```
await BABYLON.SceneLoader.AppendAsync(assetUrl, undefined, scene, undefined, ".glb");
```

It's important to note that the Babylon scene loader will use the correct loader based on the file extension of the asset you're trying to load. In this case, since we're loading binary data saved to memory, the scene loader needs to be explicitly told which loader to use. This is why the final argument in the AppendAsync method is ".glb".