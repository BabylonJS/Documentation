---
title: Introduction to what's new in NavigationPlugin V2
image:
description: Learn about the new features of NavigationPlugin V2, including new mesh parameters, improved utilities, and performance optimizations.
keywords: extensions, babylon.js, crowd, addons, navigation, new, recast
further-reading:
video-overview:
video-content:
---

# Introduction to NavigationPlugin V2

The Babylon.js Navigation Plugin **V2** builds on V1 with **new parameters**, **additional utility functions**, and **performance improvements**.

It offers finer control over navmesh generation, per-query filtering, debugging, and path post-processing while remaining backward compatible where it matters.

_Note: Get familiar with NavigationPlugin V1 before starting to read about the new features of V2. Everything in the docs about V1 applies to V2 as well._

## New Navigation Mesh Parameters

V2 introduces additional parameters to fine-tune navmesh generation. In addition to all parameters available in V1, you can now use these added ones:

```ts
{
    offMeshConnections: IOffMeshConnection[],
    keepIntermediates: boolean,
    maxObstacles: number,
    expectedLayersPerTile: number,
    tileCacheMeshProcess: TileCacheMeshProcess
}
```

[Read more about the new parameters](v2NavParameters)

## The `options` Parameter (per-query)

Most plugin query functions accept an optional options object to pass query-specific settings down to Recast/Detour. Common properties include:

```ts
options?: {
    filter?: QueryFilter;
    halfExtents?: IVector3Like;
    // optionally other request-specific params depending on the function
}
```

[Read more about the new options parameter](v2Options)

## OffMeshConnections

Defines custom connections between points on the mesh. These can represent **teleports, jump links, or one-way passages** that agents can use.

[Read more about OffMeshConnections](v2OffMeshConnections)

## Exposed tileCache, navMeshQuery and itermediates

`await navigationPlugin.createNavMeshAsync()` returns

```ts
/**
 * Result of a navigation mesh creation.
 */
export type CreateNavMeshResult = Nullable<{
  /**
   * Navigation mesh
   */
  navMesh: NavMesh;
  /**
   * Navigation mesh query
   */
  navMeshQuery: NavMeshQuery;
  /**
   * Intermediates generated during the NavMesh creation process.
   * @remarks This is only available if the `keepIntermediates` parameter is set to true in the `INavMeshParametersV2`.
   * It can be used for debugging or visualization purposes.
   */
  intermediates?: GeneratorIntermediates;
  /**
   * Tile cache generated during the NavMesh creation process.
   * @remarks This is only available if the `maxObstacles` parameter is set to a value greater than 0 in the `INavMeshParametersV2`. Defaults `maxObstacles` to 128.
   * It can be used for obstacle avoidance and dynamic navigation mesh updates.
   * @see {@link INavMeshParametersV2}
   */
  tileCache?: TileCache;
}>;
```

so you can directly access these objects. These objects are exposed via getters on the `navigationPlugin` object as well.

### navMeshQuery

The `navMeshQuery` object provides pathfinding and spatial queries on a built navigation mesh.
It is the primary interface for working with agents and movement once the navmesh has been created.

#### What is it good for?

A NavMeshQuery is mainly used to:

- Find paths between two positions on the navmesh.
- Clamp positions to the nearest valid polygon (e.g., snap a point onto the navmesh).
- Check reachability and test whether a position lies on the navmesh.
- Perform raycasts across the navmesh to simulate line-of-sight or bullet traces.
- Query random positions on the navmesh (useful for AI wandering).
- Handle multiple agents via QueryFilter (define which areas they can walk on, and how costly each area is).
- etc.

### tileCache

[Read more](v2TileCache)

### intermediates

[Read more](v2Debugger)

## The Navigation Debugger

It provides an interactive overlay for developers to better understand why agents behave the way they do, and makes tuning navmesh parameters much easier.

You can use **Navigation Debugger** to inspect:

- The generated navmesh (tiles & layers)
- Off-mesh connections (teleports / jump links)
- Intermediate build data (if `keepIntermediates: true`)

[Read more about the Navigation Debugger](v2Debugger)

## Raycasting

You can use `navigationPlugin.raycast(startPoint, endPoint)` from now to use ray casting through a navigation mesh.

Examples of usage:
- Line of sights check/shooting check: is there and obstacle between the player and an enemy for example, can it see the player, can the player shoot at it, etc…
- Smoth steering: you can start to steer your agents even before they reach a non-navigatable part of the navmesh
- NPCs moving randomly can avoid to start to walk into walls

## New Utility Functions

V2 adds helper utility functions to post-process paths. You can use these function to L-Shape or smooth the curves of a path.

[Read more about the new utility functions](v2UtilFunctions)
