---
title: BillBoard Mode
image: 
description: Learn how use Mesh BillBoard Mode.
keywords: diving deeper, meshes, billboard, camera facing
further-reading:
video-overview:
video-content:
---

# Billboard Mode

Billboard is a special mode for meshes, ensuring that the mesh is always facing towards the camera. This is commonly used to display information to the user, sprites or particles for instance.

Example :
```javascript
box.billboardMode = 7;
```

Billboard Mode Values:

value|Type
-----|-------------
0 | BILLBOARDMODE_NONE
1 | BILLBOARDMODE_X
2 | BILLBOARDMODE_Y
4 | BILLBOARDMODE_Z
7 | BILLBOARDMODE_ALL

<Playground id="#ANE052#1" title="Simple Example of Mesh Billboard Mode" description="Simple example of setting a mesh to use Billboard Mode."/>

# Integrating with parent hierarchy

The things get a bit more complex when your billboard object has a parent because then you may or may not want to integrate parent rotation in the mix.

If you set nothing but the billboardMode, the mesh will ignore its parent rotation:

<Playground id="#PDO1L6#2" title="Simple Example of Mesh Billboard Mode with a parent" description="Simple Example of Mesh Billboard Mode with a parent."/>

You can decide to force all the billboards to take the parent rotation in account without messing up with the billboard orientation with `BABYLON.TransformNode.BillboardUseParentOrientation = true;`:

<Playground id="#PDO1L6#3" title="Simple Example of Mesh Billboard Mode with a parent" description="Simple Example of Mesh Billboard Mode with a parent."/>



