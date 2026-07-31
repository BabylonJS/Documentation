---
title: Blender Tips
image:
description: Tips on exporting from Blender.
keywords: babylon.js, exporter, export, extension, blender
further-reading:
video-overview:
video-content:
---

Since Babylon and Blender often do things differently, it can sometimes be a pain working with both of them together. Here are a few tips that will smooth things out a bit.

## Geometry

### Smooth shading

If you export the default Blender scene to BJS, you'll quickly see that your cube doesn't look exactly as it should:

![smooth-shading-issue](/img/exporters/blender/smooth-shading-basic-issue.webp)

This is because a 3D modeler's viewport doesn't act like a 3D real-time engine. By default, Blender always creates objects using flat shading.
If you want to see your scene smoothed as it appears in BJS, select all your objects and click _Shading_ > _Smooth_ in the 3D View Toolshelf.

![blender-smooth-shading](/img/exporters/blender/blender-smooth-shading.webp)

Now, your cube looks ugly. You have to adjust its sharpness by adding an _edge split_ modifier and playing with the edge angle and sharp edges. Job done!

![blender-sharp-edges](/img/exporters/blender/blender-smooth-shading-sharpness.webp)

---

## Cameras

### ArcRotate

When choosing the ArcRotate camera type, you have to add a target to your camera.

To do that:

- first select your camera, then its target (for example, an object or an empty),
- press `Ctrl` + `T` > `Track To Constraint`.

---

## Workflow

### Quickly Export

If you go to _File_ > _export_ and right click on babylon, you can select _Create Shortcut_, and make an easy-to-use shortcut to export to babylon! For example, you can use _Ctrl-E_.

![quick-export-shortcut](/img/exporters/blender/quick-export-shortcut.webp)

---

## Animation

### Commons

#### One file per animated object

Usually, you will have one master scene containing all static elements, and a blend file for each animated element.

To easily see your animated element inside the master scene, open your master scene and go to File > Link, then go inside the blend containing the animated element, and import your objects. It can be simpler to link groups instead of objects, which makes updating links easier.

#### Rotation mode

By default, Blender uses the `XYZ Euler` rotation mode, which is fine for most cases, but you should know that `Quaternion` (which avoids gimbal lock issues) is also supported.

- `XYZ Euler` will be stored in the [mesh.rotation](/typedoc/classes/babylon.mesh#rotation) property
- `Quaternion` will be stored in the [mesh.rotationQuaternion](/typedoc/classes/babylon.mesh#rotationquaternion) property

For armatures, it does not matter because the animation is kind of baked during export.

### Armatures

#### Maximum ## of influencers fix

If you ever get the error `WARNING: Maximum ## of influencers exceeded for a vertex, extras ignored`, never fear!

In weight painting mode, click _weights_ and then _limit total_. This will automatically limit the mesh's vertices to 4 influences.

![weight-limit](/img/exporters/blender/weight-limit.webp)
