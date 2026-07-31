---
title: Export from Cheetah to Babylon.js
image:
description: How to export from Cheetah to Babylon.js.
keywords: babylon.js, exporter, export, extension, cheetah
further-reading:
video-overview:
video-content:
---

[Cheetah 3D](http://www.cheetah3d.com/) exports [Babylon.JS](https://babylonjs.com/) .babylon scene files. It currently supports the following:

- mesh export with functional transforms, naming, and parenting
- multi-camera export (perspective only; orthogonal is not currently supported)
- light export with all Babylon types handled:

  - Cheetah3D spot light is a babylon spot
  - Cheetah3D distant light is a babylon directional light
  - Cheetah3D ambient light is a babylon hemispheric light
  - every other type is a babylon point light
  - supports diffuse and specular color
  - rotations must be on the -Y axis

- materials export:
  - supports diffuse, emissive and specular color (plus specular power as "shininess")
  - supports only diffuse textures; the Cheetah3D API is very limited there

More info on [my blog](http://cubeslam.net/).

### Install

Put the JS script in this folder:

/Users/YOUR_USER/Library/Application Support/Cheetah3D/Scripts/Macro/

### Usage

Load your scene and go to Tools/Scripts/Macro/Babylon file export. Choose a destination, then load your scene in Babylon.js!
