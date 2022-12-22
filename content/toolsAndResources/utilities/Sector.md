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
  const cross = BABYLON.Vector3.Cross(vector1, vector2);
  const dot = BABYLON.Vector3.Dot(vector1, vector2);
  const angle = Math.acos(dot / (vector1.length() * vector2.length()));
  const points = [];
  const minNb = 4;
  const factor = 2;
  let nbPoints = Math.floor(radius * angle * factor);
  nbPoints = nbPoints < minNb ? minNb : nbPoints;

  const firstPoint = BABYLON.Vector3.Normalize(vector1).scale(radius);
  const lastPoint = BABYLON.Vector3.Normalize(vector2).scale(radius);
  let matrix;
  let ang = angle / nbPoints;
  let rotated;
  for (let i = 0; i < nbPoints; i++) {
    matrix = BABYLON.Matrix.RotationAxis(cross, ang * i);
    rotated = BABYLON.Vector3.TransformCoordinates(firstPoint, matrix);
    points.push(rotated.add(origin));
  }
  points.push(lastPoint.add(origin));

  let sector;
  switch (sectorType) {
    case 0:
      sector = BABYLON.MeshBuilder.CreateLines("sector", { points }, scene);
      break;
    case 1:
      sector = BABYLON.Mesh.CreateDashedLines("sector", points, 3, 1, nbPoints, scene);
      break;
    case 2:
      const pointO = [];
      for (let j = 0; j < points.length; j++) {
        pointO.push(origin);
      }
      sector = BABYLON.Mesh.CreateRibbon("sector", [points, pointO], null, null, 0, scene);
      break;
    default:
      sector = BABYLON.MeshBuilder.CreateLines("sector", { points }, scene);
      break;
  }
  return sector;
}
```

## Playground

<Playground id="#FUK3S#8" title="Draw an Arc Between Two Vectors" description=""/>
