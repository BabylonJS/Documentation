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
3 | BILLBOARDMODE_Z
4 | BILLBOARDMODE_ALL

<Playground id="#ANE052#1" title="Simple Example of Mesh Billboard Mode" description="Simple example of setting a mesh to use Billboard Mode."/>