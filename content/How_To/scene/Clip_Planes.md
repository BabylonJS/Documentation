---
title: Using Clipping Planes
image: 
description: Learn all about clipping planes in Babylon.js.
keywords: diving deeper, scene, clip, clipping, clipping planes
further-reading:
video-overview:
video-content:
---

## How to use clip planes

You can clip the rendering of a scene by using one of the supported clip planes:

- `scene.clipPlane`
- `scene.clipPlane2`
- `scene.clipPlane3`
- `scene.clipPlane4`

Each clip plane is a BABYLON.Plane that you can define like this:

```
scene.clipPlane4 = new BABYLON.Plane(0, 1, 0, 0);
```

The 3 first parameters of the Plane constructor defines the normal of the plane and the last one defines the distance from (0,0,0).

You can find an interactive demo about clip planes here: <Playground id="#Y6W087" title="Clipping Planes Example 1" description="Simple example showing how to use clipping planes."/>

A maximum of 4 different clip planes can be used simultaneously for a specific rendering.

If you want to apply per mesh clip planes, you can rely on the following observables:

- `mesh.onBeforeRenderObservable`
- `mesh.onAfterRenderObservable`

Example:

```
sphere.onBeforeRenderObservable.add(function() {
    scene.clipPlane = new BABYLON.Plane(1, 0, 0, 0);
});

sphere.onAfterRenderObservable.add(function() {
    scene.clipPlane = null;
});    
```

Demo: <Playground id="#EHLHNX" title="Clipping Planes Example 2" description="Using 4 different clipping planes at the same time."/>