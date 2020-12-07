---
title: Exporting Bones from 3D MAX
image: 
description: Babylon.js Editor tool to preview, edit and add materials.
keywords: babylon.js, exporter, export, extension, 3D MAX, bones, influences
further-reading:
video-overview:
video-content:
---

This is a common error you may have when working with bones:

*"Too many bones influences per vertex: 5. Babylon.js only support 4 bones influences per vertex."*

This is because Babylon.js support a maximum of 4 bones influences per vertex.

Here is how to solve this in 3ds max (By default 3ds max has a limit of 20):

In 3ds Max (English version)

![bones influences parameter En](/img/exporters/3DSMax/bonesEN.jpg)

In 3ds Max (French version)

![bones influences parameter Fr](https://s3-eu-west-1.amazonaws.com/sdz-upload/prod/upload/structure_limit.jpg)

Simply add '4' in the red part of the image and you're done!
