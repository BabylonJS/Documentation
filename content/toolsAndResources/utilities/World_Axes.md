---
title: Display Axes
image:
description: Helpful feature for displaying world axes in Babylon.js.
keywords: tools, resources, utilities, world axes, axis, local axes, axes
further-reading:
  - title: AxesViewer API
    url: https://doc.babylonjs.com/typedoc/classes/babylon.debug.axesviewer
video-overview:
video-content:
---

## Axes
It is often useful to be able to quickly display world and local axes to see position and rotation for example. For world axes use

```javascript
const axes = new BABYLON.AxesViewer(scene, length_of_axes)
```

To make any of the x, y and z axes local to a mesh (or other appropriate object) use

```javascript
axes.xAxis.parent = mesh;
axes.yAxis.parent = mesh;
axes.zAxis.parent = mesh;
```

<Playground id="#T8UQTA" title="AxesViewer" description="Display Axes"/>

You can customise the axes, which do not have to be orthogonal, using 

```javascript
axes.update(position, xAxis, yAxis, zAxis) //all parameters are Vector3s
```

<Playground id="#T8UQTA#1" title="Update AxesViewer" description="Display Custom Axes"/>
