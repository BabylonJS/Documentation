---
title: Adding and removing obstacles
image:
description: Learn how to add and remove obstacles for crowd agents.
keywords: extensions, babylon.js, crowd, obstacles
further-reading:
video-overview:
video-content:
---

## Prerequisites

Internally, navigation mesh with support for obstacles differs from 'standard' use case with one static navigation mesh.
Obstacles mark tiles as dirty. Those tiles need to be reprocessed to compute a portion of the navigation mesh.
To do so, Recast introduces the concept of tiles. Each tile is a square portion of the nav mesh. Tiles a processed each frame.
Making huge changes processed of a couple of frames.

In order to build a Tiled nav mesh instead of a single mesh, add the following lines to the nav mesh creation parameters:

```javascript
const navmeshParameters = {
  cs: 0.2,
  ch: 0.2,
  walkableSlopeAngle: 0,
  walkableHeight: 0.0,
  walkableClimb: 0,
  walkableRadius: 1,
  maxEdgeLen: 12,
  maxSimplificationError: 1.3,
  minRegionArea: 8,
  mergeRegionArea: 20,
  maxVertsPerPoly: 6,
  detailSampleDist: 6,
  detailSampleMaxError: 15,
  borderSize: 1,
  tileSize: 20,
};
```

Note the addition of `tileSize`. It's the world unit size of each tile. If it's not present or has a value a zero, it falls back to the standard use and obstacles won't work.
Also, depending on your use case, this value must be carrefully chosen to trade between too many tiles and too much cpu intensive updates.

## Obstacles API

Once the navigation mesh is updated to take tiles into account, obstacles are accessible thru 3 simple functions:

```javascript
addCylinderObstacle(position: Vector3, radius: number, height: number): IObstacle;
addBoxObstacle(position: Vector3, extent: Vector3, angle: number): IObstacle;
removeObstacle(obstacle: IObstacle): void;
```

Keep a list of added obstacles in order to remove them later. An obstacle that's not colliding with the navigation mesh will have no influence.

<Playground id="#WCSDE1" title="Adding a door to a navigation mesh" description="Example of door simulation using nav mesh obstacles."/>
