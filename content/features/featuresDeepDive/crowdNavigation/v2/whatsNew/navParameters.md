---
title: New navigation mesh parameters
image:
description: Learn about the extended parameters for creating a navigation mesh
keywords: extensions, babylon.js, crowd, addons, navigation, parameters
further-reading:
video-overview:
video-content:
---

## New Navigation Mesh Parameters

V2 adds a few parameters to help tune navmesh generation and runtime behavior:

| Property                | Type                   | Description                                                                                                                  | Default |
| ----------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| `offMeshConnections`    | `IOffMeshConnection[]` | Custom connections between two points on/near the mesh (teleports, jumps, one-way links).                                    | —       |
| `keepIntermediates`     | `boolean`              | Preserve intermediate Recast build data (heightfields, contours, detail meshes) for visualization or incremental rebuilds.   | `false` |
| `maxObstacles`          | `number`               | Max number of dynamic obstacles supported. If > 0, plugin uses a tile cache for dynamic obstacle updating.                   | `128`   |
| `expectedLayersPerTile` | `number`               | Hint for expected layers per tile — useful for memory/perf tuning in highly layered environments.                            | `32`    |
| `tileCacheMeshProcess`  | `TileCacheMeshProcess` | Callback used when building tile cache mesh to set `polyAreas` and `polyFlags`. Defaults to all areas = `0` and flags = `1`. | —       |

```ts
await navigationPlugin.createNavMeshAsync(mesh, parameters);
```

### offMeshConnections

```ts
const offMeshConnections: IOffMeshConnection[] = [
  {
    start: { x: 4.5, y: 0.0, z: 10.0 },
    end: { x: 4.5, y: 3.0, z: 10.0 },
    radius: 0.6, // maximum agent width
    bidirectional: false, // one-way up
    area: 0,
    flags: 1,
  },
  {
    start: { x: 12, y: 1, z: 3 },
    end: { x: 18, y: 1, z: 3 },
    radius: 0.4, // maximum agent width
    bidirectional: true, // works both ways
    area: 1,
    flags: 1,
  },
];
```

### keepIntermediates

By default the Recast build pipeline discards intermediate structures (heightfields, compact heightfields, contour sets, detail meshes) to save memory.
Set `keepIntermediates:` true when you want:

- Debugging: show voxelization, contours, and detail meshes in the [Navigation Debugger](../v2Debugger).
- Faster iterative tuning: reuse intermediate data to avoid full recomputation when parameters change slightly.

Caveat: intermediate data increases memory usage — keep it disabled in production unless you need it.

### maxObstacles

The maximum number of dynamic obstacles (e.g. barrels, boxes, temporary walls) that can be added to the navmesh. If > 0, the navmesh will be built with a tile cache.

V1 sets this value to 128 so V2 does for backwards compatibility. In V2 you can set this value lower to preserve memory or you can turn off tile cache generation by setting this values to `0`.

If you use obstacled there will be always a `TileCache` generated.

### Adding/removing obstacles

Adding or removing obstacles requires a `TileCache` update.

```ts
public addBoxObstacle(position: IVector3Like, extent: IVector3Like, angle: number, doNotWaitForCacheUpdate = false): Nullable<IObstacle>
public addCylinderObstacle(position: IVector3Like, radius: number, height: number, doNotWaitForCacheUpdate = false): Nullable<IObstacle>
public removeObstacle(obstacle: IObstacle, doNotWaitForCacheUpdate = false): void
```

A new parameter `doNotWaitForCacheUpdate: boolean` has been introduced in the "obstacle" functions.

Important! [Read more about the doNotWaitForCacheUpdate parameter and how to handle TileCache updates when altering obstacles](../v2TileCache)

### expectedLayersPerTile

Defines how many layers are expected to be defined per tile when tile cache is used. It's used for tuning memory/performance when tiles stack multiple walkable layers.

### tileCacheMeshProcess

`tileCacheMeshProcess` is a callback function used in Recast’s tile cache system.
Think of it as a hook to assign areas and flags per polygon, giving you control over which parts of the navmesh different agents can traverse.

[Read more about TileCacheMeshProcess](../v2TileCache)

## What is the TileCache

In short `TileCache` is an extension of the navmesh system that allows dynamic updates of the navigation mesh in smaller regions (tiles) instead of rebuilding the whole mesh.

[Read more about TileCache](../v2TileCache)

_Note: For more information refer to the Recast docs._
