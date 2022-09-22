---
title: Export from Cheetah to Babylon.js
image:
description: How to export from Cheetah to Babylon.js.
keywords: babylon.js, exporter, export, extension, cheetah
further-reading:
video-overview:
video-content:
---

[Cheetah 3D](http://www.cheetah3d.com/) exporter for [Babylon.JS](https://babylonjs.com/) .babylon scene files. Currently supports the following:

- mesh export with functional transform, naming and parenting
- multicamera export (only perspective, no support for orthogonal right now)
- light export with all babylon type managed :

  - Cheetah3D spot light is a babylon spot
  - Cheetah3D distant light is a babylon directional light
  - Cheetah3D ambiant light is a babylon hemispheric light
  - every other type is a babylon point light
  - supports diffuse and specular color
  - rotations must be on the -Y axis

- materials export:
  - supports diffuse, emissive and specular color (plus specular power as "shininess")
  - supports only diffuse textures, Cheetah3D api is realy sparse on that

More info on [my blog](http://cubeslam.net/).

### Install

Put js script in this folder :

/Users/YOUR_USER/Library/Application Support/Cheetah3D/Scripts/Macro/

### Usage

Just load your scene and go to Tools/Scripts/Macro/Babylon file export. Choose a destination, and load your scene inside Babylon.JS!
