---
title: Draw a Sector of a Circle
image: 
description: Helpful code snippet for drawing a sector of a circle in Babylon.js.
keywords: babylon.js, tools, resources, utilities, draw, circle, sector
further-reading:
video-overview:
video-content:
---

## Draw an Arc Between Two Vectors

Given an origin O and two vectors OA and OB this snippet draws an arc between the two vectors with a given radius. The arc can be drawn in three types 0 (default) a solid line, 1 a dashed line, 2 filled between arc and vectors.

```javascript
function showAngleSector(origin, vector1, vector2, radius, sectorType) {
    radius = radius || 1;
    sectorType = sectorType || 0;
    var cross = BABYLON.Vector3.Cross(vector1, vector2);
    var dot = BABYLON.Vector3.Dot(vector1, vector2);
    var angle = Math.acos(dot / (vector1.length() * vector2.length()));
    var points = [];
    var minNb = 4;
    var factor = 2;
    var nbPoints = Math.floor(radius * angle * factor);
    nbPoints = (nbPoints < minNb) ? minNb : nbPoints;

    var firstPoint = ((BABYLON.Vector3.Normalize(vector1)).scale(radius));
    var lastPoint = ((BABYLON.Vector3.Normalize(vector2)).scale(radius));
    var matrix;
    var ang = angle / nbPoints;
    var rotated;
    for (var i = 0; i < nbPoints; i++) {
      matrix = BABYLON.Matrix.RotationAxis(cross, ang * i);
      rotated = BABYLON.Vector3.TransformCoordinates(firstPoint, matrix);
      points.push(rotated.add(origin));
    }
    points.push(lastPoint.add(origin));
  
    var sector;
    switch (sectorType) {
      case 0:
        sector = BABYLON.Mesh.CreateLines("sector", points, scene);
        break;
      case 1:
        sector = BABYLON.Mesh.CreateDashedLines("sector", points, 3, 1, nbPoints , scene);
        break;
      case 2:
        var pointO = [];
        for (var j = 0; j < points.length; j++) {
          pointO.push(origin);
        }
        sector = BABYLON.Mesh.CreateRibbon("sector", [points, pointO], null, null, 0, scene);
        break;
      default:
        sector = BABYLON.Mesh.CreateLines("sector", points, scene);
        break;
    }
    return sector;
}
```
## Playground

<Playground id="#FUK3S#8" title="Draw an Arc Between Two Vectors" description="" image=""/>