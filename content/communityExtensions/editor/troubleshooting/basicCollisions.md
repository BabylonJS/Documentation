---
title: Blurred Babylon.js Editor UI
image: 
description: Understanding how blurred Babylon.js Editor UI can be fixed
keywords: editor, troubleshooting
further-reading:
video-overview:
video-content:
---

## Blurred UI

The Babylon.JS Editor is based on the Electron framework. On Win32 systems, it has been noticed that on
specific configurations, the overall UI of the Editor can be blurred.

This can be fixed by updating the drivers of the video card to the latest version.

In the case of RTX NVIDIA video cards, try installing the `Studio` driver version instead of the `Game` one.

For NVIDIA video cards in general, try opening the `NVIDIA Control Panel` and selecting `No Scaling` in the display settings.

## References
Linked issue: https://github.com/BabylonJS/Editor/issues/266
