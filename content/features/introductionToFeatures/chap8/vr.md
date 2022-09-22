---
title: Getting Started - Chapter 8 - Going Virtual
image:
description: Learn the simple process of setting a scene up for VR.
keywords: getting started, start, chapter 8, VR, XR
further-reading:
video-overview:
video-content:
---

# Getting Started - Going Virtual

## See Our Virtual Village World in XR

It could not be simpler - we remove the current camera and replace it with

```javascript
const xr = scene.createDefaultXRExperienceAsync();
```

This will enable WebXR **in VR immersive mode**, including session init, input sources, the camera, teleportation and scene interactions. All using our [WebXR Default Experience Helper](/features/featuresDeepDive/webXR/webXRExperienceHelpers#the-basic-experience-helper).
