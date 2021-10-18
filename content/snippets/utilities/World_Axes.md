---
title: Display World Axes
image:
description: Helpful code snippet for displaying world axes in Babylon.js.
keywords: babylon.js, tools, resources, utilities, world axes
further-reading:
video-overview:
video-content:
---

## World Axes

This snippet displays the world axes. The X axis is red, the Y axis green and the Z axis blue. The length of the axes may be set with the size parameter.

```javascript
var showWorldAxis = function (size, scene) {
  var makeTextPlane = function (text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
    var plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", { size }, scene);
    var planeMaterial = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material = planeMaterial;
    planeMaterial.backFaceCulling = false;
    planeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    planeMaterial.diffuseTexture = dynamicTexture;
    return plane;
  };

  var axisX = BABYLON.MeshBuilder.CreateLines(
    "axisX",
    {
      points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)],
    },
    scene,
  );
  axisX.color = new BABYLON.Color3(1, 0, 0);
  var xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

  var axisY = BABYLON.MeshBuilder.CreateLines(
    "axisY",
    {
      points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)],
    },
    scene,
  );
  axisY.color = new BABYLON.Color3(0, 1, 0);
  var yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

  var axisZ = BABYLON.MeshBuilder.CreateLines(
    "axisZ",
    {
      points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)],
    },
    scene,
  );
  axisZ.color = new BABYLON.Color3(0, 0, 1);
  var zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};
```

## Playground

<Playground id="#NFTIFR" title="Displaying World Axes" description=""/>
