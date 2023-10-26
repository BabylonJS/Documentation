---
title: GreasedLineRibbon - a non camera facing version of GreasedLine 
image:
description: GreasedLineRibbon - a non camera facing version on GreasedLine 
keywords: diving deeper, meshes, parametric shapes, greasedline, greased line
further-reading:
video-overview:
video-content:
---

## GreasedLineRibbon

You can use all the features of `GreasedLine` except `sizeAttenuation` which doesn't make sense to use in non camera facing mode. `GreasedLineRibbon` creates ribbon like geometry for the lines. If you want to create a `GreasedLineRibbon` just add the `ribbonOptions` property to the `GreasedLineMeshBuilderOptions` when using the `CreateGreasedLine` builder function or to `GreasedLineMeshOptions` when creating the `GreasedLineRibbon` manually.

## Create a GreasedLineRibbon

The easiest, prefered and recommended way to create a `GreasedLineRibbon` is to use the `CreateGreasedLine` function:

```javascript
function CreateGreasedLine(name: string, options: GreasedLineMeshBuilderOptions, materialOptions?: Nullable<GreasedLineMaterialBuilderOptions>, scene?: Nullable<Scene>)
```

The simplest usage is:

```javascript
const line = BABYLON.CreateGreasedLine("name", { points, ribbonOptions: { } })
```

<Playground id="#P8NDK0#2" title="Basic usage" description="Basic scenarios with GreasedLineRibbon." />

### GreasedLineMeshBuilderOptions.ribbonOptions

If there is a `ribbonOptions` present a non camera facing ribbon like mesh will be created. It's an instance of the `GreasedLineRibbon` class. If you don't want to change the default values it's enough to pass an empty object as shown previously.

```javascript
pointsMode: GreasedLineRibbonPointsMode;
direction: Vector3;
width: number;
facesMode?: GreasedLineRibbonFacesMode;
closePath?: boolean;
smoothShading?: boolean;
```

The default values are:

```javascript
pointsMode = GreasedLineRibbonPointsMode.POINTS_MODE_POINTS;
direction = Vector3.UpReadOnly;
width = GreasedLineMaterialDefaults.DEFAULT_WIDTH; // 0.1
facesMode = GreasedLineRibbonFacesMode.FACES_MODE_SINGLE_SIDED;
closePath = false;
smoothShading = false;
```

*If you are creating the `GreasedLineRibbonMesh` manually you have to take care of setting all the values yourself. In addition you have to set the `cameraFacing` option to `false` in `GreasedLineMaterialOptions` when creating the material manually.*

#### **pointsMode**

There are two point modes available:

```javascript
POINTS_MODE_POINTS = 0,
POINTS_MODE_PATHS = 1,
```

In `GreasedLineRibbonPointsMode.POINTS_MODE_POINTS` every array of points will become the center (backbone) of the ribbon. The ribbon will be expanded by `width / 2` to `+direction` and `-direction` as well.

In `GreasedLineRibbonPointsMode.POINTS_MODE_PATHS` every array of points is one path. These will be used to build one ribbon.

Let's demonstrate both point modes. The gray mesh is the line ribbon itself and the white line is the center (backbone) of it:

<Playground id="#SS1UUI#30" title="Point mode POINTS_MODE_POINTS" description="Shows how POINTS_MODE_POINTS works." />

The gray mesh is the line ribbon itself and the white lines are the paths which the line ribbon is built between:

<Playground id="#SS1UUI#31" title="Point mode POINTS_MODE_PATHS" description="Shows how POINTS_MODE_PATHS works." />

A simple space track created using `POINTS_MODE_PATHS`. The red debug lines shows the paths. Track colors are created using a manually created texture. The red lines shows the paths which defines the edges of the ribbon.

<Playground id="#TN7XWX#35" title="Path mode" description="A simple space track - uses texture." />

The same space track colorizeds by the `colors` property of the `GreasedLineMaterial`:

<Playground id="#TN7XWX#34" title="Path mode" description="A simple space track - uses colors." />

You can have more than two paths to build line ribbons of custom shapes:

<Playground id="#SS1UUI#32" title="Point mode POINTS_MODE_PATHS with more paths" description="Shows how POINTS_MODE_PATHS works with more than 2 paths." />

#### **direction** and **width**

This property is a normalized direction vector of the slope of the line in `POINTS_MODE_POINTS`. The line ribbon will be expanded to `+direction` and `-direction` from the center line defined by `points` by a value of `width / 2`.

You can change the default width by modifying the value of `GreasedLineRibbonMesh.DEFAULT_WIDTH` static property. This will not affect the existing line ribbons.

The `widths` option on `GreasedLineMaterialBuilderOptions` is not supported in `POINTS_MODE_PATHS` because in this mode you define the edges of the ribbon and not the center line.

<Playground id="#1LRZ3#422" title="Shows different direction modes" />

#### **facesMode**

```javascript
FACES_MODE_SINGLE_SIDED = 0,
FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING = 1,
FACES_MODE_DOUBLE_SIDED = 2
```

Controls how the faces are created:
In `GreasedLineRibbonFacesMode.FACES_MODE_SINGLE_SIDED` single sided with back face culling. Default value.
In `GreasedLineRibbonFacesMode.FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING` single sided without back face culling. Sets `backFaceCulling = false` on the material so it affects all line ribbons added to the line ribbon instance.
In `GreasedLineRibbonFacesMode.FACES_MODE_DOUBLE_SIDED` extra back faces are created. This doubles the amount of faces of the mesh.

<Playground id="#SS1UUI#39" title="Shows different face modes" description="Shows different face modes." />

#### **closePath**

If true, the line will be closed. Works in both `pathMode`s.

<Playground id="#SS1UUI#38" title="Without closing the line ribbon path" description="Without closing the line ribbon path." />
<Playground id="#SS1UUI#37" title="Automatically closing the line ribbon path" description="Automatically closing the line ribbon path." />

#### **smoothShading**

If true, normals will be computed when creating the vertex buffers. This results to smooth shading of the mesh. Doesn't work when `closePath = true`. `colorMode` mustn't be `BABYLON.GreasedLineMeshColorMode.COLOR_MODE_SET` and a lightsource must be present of course.

<Playground id="#SS1UUI#35" title="Without smooth shading" description="Without smooth shading." />
<Playground id="#SS1UUI#36" title="With smooth shading" description="With smooth shading." />

## Example playgrounds

<Playground id="#FJRQ8N#138" title="Simple examples" description="A lot of simple examples in one PG." />
<Playground id="#SS1UUI#51" title="Tie drone" description="Shows how to use different options to build a small Imperial Tie drone." />
<Playground id="#SS1UUI#50" title="Tie drones army" description="Flying tie drones from the previous example" />
<Playground id="#H1LRZ3#407" title="Lazy mode" description="Lazy mode line ribbons." />
<Playground id="#H1LRZ3#415" title="Recycle logo" description="Recycle logo comparison. One created using a GreasedLineMesh and the second using GreasedLineRibbonMesh (non camera facing version vs camwea facing versions)." />








