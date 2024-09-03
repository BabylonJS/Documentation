---
title: Gaussian Splatting
image:
description: Learn how use Gaussian Splatting.
keywords: diving deeper, meshes, gaussian, splatting, nerf
further-reading:
video-overview:
video-content:
---

## What is Gaussian Splatting?

Gaussian Splatting is a volume rendering method. It's useful to capture real-life data. The difference with other technics like photogrammetry is the end result consists in a point cloud with each point rendered as a semi transparent ellipsoid projected onto a billboard. Gaussian Splatting is more suitable for rendering reflective and transparent surfaces.

## Supported formats

Supported formats are :

- .PLY https://en.wikipedia.org/wiki/PLY_(file_format)
- .splat that is Javascript types serialized version of .PLY datas

## Loading a Gaussian Splatting

Load asynchronously the splat or PLY file like any other supported file format:

```javascript
BABYLON.SceneLoader.ImportMeshAsync(null, "https://assets.babylonjs.com/splats/", "gs_Skull.splat", scene).then((result) =>{
    const gaussianSplattingMesh = result.meshes[0]; });
```

<Playground id="#CID4NN#203" title="Simple Example of Gaussian Splatting" description="Simple example of setting a Gaussian Splatting."/>

<Playground id="#45KYTJ#61" title="Loading and displaying different Gaussian Splatting scenes" description="Loading and displaying different Gaussian Splatting scenes."/>
