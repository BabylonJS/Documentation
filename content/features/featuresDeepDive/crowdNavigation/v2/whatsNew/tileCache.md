---
title: NavMeshCreateParams
image:
description: List of the NavMeshCreateParams class functions
keywords: extensions, babylon.js, crowd, addons, navigation, parameters
further-reading:
video-overview:
video-content:
---

## TileCache

In short `TileCache` is an extension of the navmesh system that allows dynamic updates of the navigation mesh in smaller regions (tiles) instead of rebuilding the whole mesh.

If you alter the `TileCache` you need to wait until it's fully updated. Use this function:

```ts
WaitForFullTileCacheUpdate(navMesh: NavMesh, tileCache: TileCache)
```

If you are altering multiple obstacles at once set `doNotWaitForCacheUpdate = true` and call `WaitForFullTileCacheUpdate(navMesh: NavMesh, tileCache: TileCache)` at the end of the batch operation. If it's set to `false` every obstacle operation returns only after the `TileCache` has been fully updated.

_Note: If you are not dealing with a lot of obstacle updated you can wait for the `TileCache` update in the render loop._

## TileCacheMeshProcess

`tileCacheMeshProcess` is a callback function used in Recast’s tile cache system.

**Its purpose:**

- During tile cache generation, each tile is processed into polygons (the navmesh).
- tileCacheMeshProcess allows you to customize each polygon’s properties, such as:
  - polyAreas → the type of area (e.g., walkable, road, stairs).
  - polyFlags → flags used by agents/queries for filtering or cost calculations.

Think of it as a hook to assign areas and flags per polygon, giving you control over which parts of the navmesh different agents can traverse.

Using `navMeshCreateParams` you can access all information you might need about the `polys` being processed.

[Read more about TileCache, TileCacheMeshProcess and check the list of available NavMeshCreateParams functions](../v2TileCache)

Example:

```ts
const tileCacheMeshProcess: TileCacheMeshProcess = (navMeshCreateParams: NavMeshCreateParams, polyAreas: UnsignedCharArray, polyFlags: UnsignedShortArray) => {
  const STAIRS_AREA = 1;
  const DEFAULT_AREA = 0;
  const WALK_FLAG = 1;
  const STAIRS_FLAG = 2;

  const vertsCount = navMeshCreateParams.vertCount();
  const indicesCount = navMeshCreateParams.polyCount() * 3;

  for (let i = 0; i < polyAreas.length; i++) {
    // compute average y of polygon vertices
    const idx0 = navMeshCreateParams.polys(i * 3 + 0);
    const idx1 = navMeshCreateParams.polys(i * 3 + 1);
    const idx2 = navMeshCreateParams.polys(i * 3 + 2);

    const avgY = (navMeshCreateParams.verts(idx0 * 3 + 1) + navMeshCreateParams.verts(idx1 * 3 + 1) + navMeshCreateParams.verts(idx2 * 3 + 1)) / 3;

    if (avgY > 1.5) {
      polyAreas[i] = STAIRS_AREA;
      polyFlags[i] = STAIRS_FLAG;
    } else {
      polyAreas[i] = DEFAULT_AREA;
      polyFlags[i] = WALK_FLAG;
    }
  }
};

// Use when creating navmesh
navigationPlugin.createNavMesh(meshes, {
  maxObstacles: 64,
  expectedLayersPerTile: 2,
  tileCacheMeshProcess,
});
```

## List of available functions in NavMeshCreateParams used with TileCacheMeshProcess

```ts
setPolyMeshCreateParams(polyMesh: RecastPolyMesh): void;
setPolyMeshDetailCreateParams(polyMeshDetail: RecastPolyMeshDetail): void;
setOffMeshConnections(offMeshConnections: OffMeshConnectionParams[]): void;
verts(index: number): number;
setVerts(index: number, value: number): void;
vertCount(): number;
polys(index: number): number;
setPolys(index: number, value: number): void;
polyAreas(index: number): number;
setPolyAreas(index: number, value: number): void;
polyFlags(index: number): number;
setPolyFlags(index: number, value: number): void;
polyCount(): number;
nvp(): number;
setNvp(value: number): void;
detailMeshes(index: number): number;
setDetailMeshes(index: number, value: number): void;
detailVerts(index: number): number;
setDetailVerts(index: number, value: number): void;
detailVertsCount(): number;
detailTris(index: number): number;
setDetailTris(index: number, value: number): void;
detailTriCount(): number;
offMeshConVerts(index: number): number;
offMeshConRad(index: number): number;
offMeshConDir(index: number): number;
offMeshConAreas(index: number): number;
offMeshConFlags(index: number): number;
offMeshConUserID(index: number): number;
offMeshConCount(): number;
userId(): number;
tileX(): number;
setTileX(value: number): void;
tileY(): number;
setTileY(value: number): void;
tileLayer(): number;
setTileLayer(value: number): void;
boundsMin(): Vector3Tuple;
setBoundsMin(value: Vector3Tuple): void;
boundsMax(): Vector3Tuple;
setBoundsMax(value: Vector3Tuple): void;
walkableHeight(): number;
setWalkableHeight(value: number): void;
walkableRadius(): number;
setWalkableRadius(value: number): void;
walkableClimb(): number;
setWalkableClimb(value: number): void;
cellSize(): number;
setCellSize(value: number): void;
cellHeight(): number;
setCellHeight(value: number): void;
buildBvTree(): boolean;
setBuildBvTree(value: boolean): void;
```

_For detailed information refer to `recast-navigation-js` docs._
