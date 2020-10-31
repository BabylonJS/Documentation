---
title: How To Use Logarithmic Depth Buffer
---

Pretty much every 3D programmer runs into depth buffer issues sooner or later. 
This is especially true when creating outer-space scenes where object distances can be in light years.

In such cases, the linear depth buffer (the default) can generate glitches when distances start reaching big numbers. 
In short, the depth values are proportional to the reciprocal of Z. This gives good precision near the camera, but a little off in the distance.

You can read an interesting analysis by Brano Kemen on this blog: http://www.gamasutra.com/blogs/BranoKemen/20090812/85207/Logarithmic_Depth_Buffer.php

To help with this issue, you may want to use a better Z-value distribution: the logarithmic depth buffer where Z = log(C*z + 1) / log(C*Far + 1) * w

StandardMaterials can enable the logarithmic depth buffer if the browser supports *GL_EXT_frag_depth* extension.

To enable it, just use this code:
```
material.useLogarithmicDepth = true;
```

If the extension is not supported, Babylon.js will revert to linear depth buffering.
