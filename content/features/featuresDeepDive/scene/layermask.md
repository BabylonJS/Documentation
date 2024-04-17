---
title: In-Depth layerMask
image: 
description: Learn how the layerMask property work accross the library
keywords: diving deeper, scene, layerMask, layer, mask
further-reading:
video-overview:
video-content:
---

# In-Depth layerMask

`layerMask` is a property you can find on many objects and may be a bit difficult to grasp at first. This page should give you a good understanding of how it works across Babylon.js objects.

## layerMask meaning

`layerMask` is a value that can be assigned to different objects (like meshes, cameras, layers, particle systems, etc) and is used to determine the visibility of this object from another one (for eg, if a mesh is visible from a camera or if a layer should be displayed after a given camera is processed).

The only two things to understand with `layerMask` are that:
* it can be any number from 0 to 0xFFFFFFFF (or 4294967295, but it’s easier to write 0xFFFFFFFF)
* when computing a visibility flag, two values of `layerMask` are **AND**ed and if the result is different from 0 the flag is true

So, for eg, if `camera.layerMask = 35` and `mesh.layerMask = 2`, `35 & 2 == 2 != 0` so the mesh is visible from this camera. We often show these numbers in hexadecimal because doing the **AND** as a mental calculation is easier that way: `35=0x23` and `2=0x02` and `35 & 2 == 0x23 & 0x02` and from this latter representation it’s easier to see that the result is 2 (well, at least when you are a bit comfortable with hexadecimal!).

## Usage in Babylon.js

In Babylon, by default all `layerMask` properties are `0x0FFFFFFF` (for Camera, Mesh, Layer, …). So, when it comes to determine a visibility, `0x0FFFFFFF & 0x0FFFFFFF != 0` and everything is always visible (at least from the standpoint of the `layerMask` test).

As you can see, there are 4 bits not set by default in the `layerMask` (the leading `0` before the first `F`). It’s to ease the use of `layerMask`, as a common usage is to make some meshes hidden from a camera. To achieve that, you need to set a `layerMask` on the meshes so that the **AND** operation with the `layerMask` of the camera (`0x0FFFFFFF` by default) is 0: you can use `0x10000000`, `0x20000000`, `0x40000000` or `0x80000000`. Now you see why showing these numbers in hexadecimal helps: it’s a lot easier to see that `0x10000000 & 0x0FFFFFFF = 0` than `268435456 & 268435455`!

If the default value for `layerMask` was `0xFFFFFFFF`, you would also need to update the `layerMask` of your camera to have your meshes invisible from it because `0xFFFFFFFF` is a all-one 32 bit value. So the `0x0FFFFFFF` value is simply a default value that can help make your life a little easier, but in all generality you can put any value in the `layerMask` property of cameras, meshes, layers, etc (as in the `35 & 2` example above) and simply understand how it is used to compute visibility.

### Layers and Skeleton Animations
If the active camera in a scene is using a layerMask to hide meshes that are animated with skeletons, then other cameras that do show the meshes will not show the animation because the skeletons are not being updated.  A solution to this is to prepare the skeleton before each frame rendering

```typescript
let scene: BABYLON.Scene
let avatar: BABYLON.TransformNode;

scene.onBeforeRenderObservable.add(onBeforeRender);

function onBeforeRender(scene:BABYLON.Scene, eventState: BABYLON.EventState){
    const meshes = avatar.getChildMeshes(false);

    meshes.forEach(prepareSkeleton);
}

function prepareSkeleton(mesh:BABYLON.AbstractMesh){
    const skeleton = mesh.skeleton;

    if (!skeleton) return;

    skeleton.prepare();
}
```
