---
title: Display Tangent, Normal, and Binormal of a Path3D
image:
description: Helpful code snippet for displaying helpful information about a Path3D object in Babylon.js.
keywords: babylon.js, tools, resources, utilities, tangent, normal, binormal
further-reading:
video-overview:
video-content:
---

## Displays a Path3D Curve

This snippet displays a path3D curve and for on each point its tangent, normal and binormal in red, green and blue respectively.
The size parameter, default 0.5, sets the length for the tangents, normals and binormals.

```javascript
function showPath3D(path3d, size) {
  size = size || 0.5;
  const curve = path3d.getCurve();
  const tgts = path3d.getTangents();
  const norms = path3d.getNormals();
  const binorms = path3d.getBinormals();
  let vcTgt, vcNorm, vcBinorm;
  const line = BABYLON.MeshBuilder.CreateLines("curve", { points: curve }, scene);
  for (let i = 0; i < curve.length; i++) {
    vcTgt = BABYLON.MeshBuilder.CreateLines("tgt" + i, { points: [curve[i], curve[i].add(tgts[i].scale(size))] }, scene);
    vcNorm = BABYLON.MeshBuilder.CreateLines("norm" + i, { points: [curve[i], curve[i].add(norms[i].scale(size))] }, scene);
    vcBinorm = BABYLON.MeshBuilder.CreateLines("binorm" + i, { points: [curve[i], curve[i].add(binorms[i].scale(size))] }, scene);
    vcTgt.color = BABYLON.Color3.Red();
    vcNorm.color = BABYLON.Color3.Green();
    vcBinorm.color = BABYLON.Color3.Blue();
  }
}
```

## Playground

<Playground id="#2IX4FB" title="Display Path3D Info" description=""/>
