---
title: Navigation Debugger
image:
description: Learn about the Navigation Debugger
keywords: extensions, babylon.js, crowd, addons, navigation, debugger, debug
further-reading:
video-overview:
video-content:
---

## The Navigation Debugger

It provides an overlay for developers to better understand why agents behave the way they do, and makes tuning navmesh parameters much easier.

You can use **Navigation Debugger** to inspect:

- The generated navmesh (tiles & layers)
- Off-mesh connections (teleports / jump links)
- Intermediate build data (if `keepIntermediates: true`)

**Note: Keeping intermediates uses more memory. For production builds, it’s recommended to leave this `false`.**

### Debug overlay to display intermediate build data

You have to set `keepIntermediates: true` in the nav mesh parameters to retain the intermediate build data after the nav mesh is built.

First you need to create `NavigationDebugger` instance and pass a babylon.js scene and optional parameters to the `NavigationDebugger.constructor`:

```ts
    constructor(
        private _scene: Scene,
        options?: {
            parent?: {
                node?: TransformNode | string;
            };
            primitiveTypes?: DebugDrawerPrimitiveType[];
            materials?: {
                triMaterial?: StandardMaterial;
                pointMaterial?: StandardMaterial;
                lineMaterialOptions: {
                    greasedLineMaterialOptions: Partial<GreasedLineMaterialOptions>;
                    greasedLineMeshOptions: Partial<GreasedLineMeshOptions>;
                };
            };
        }
    )
```

#### Parameters

| Parameter | Type                | Description                                                                                   |
| --------- | ------------------- | --------------------------------------------------------------------------------------------- |
| `_scene`  | `Scene`             | The Babylon.js scene where the debug drawer will be created.                                  |
| `options` | `object` (optional) | Additional configuration options for customizing parent node, primitive types, and materials. |

#### Options parameter

| Property                                                   | Type                                  | Description                                                                               |
| ---------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `parent.node`                                              | `TransformNode \| string`             | Optional parent node (or its name) to which the debug drawer should be attached.          |
| `primitiveTypes`                                           | `DebugDrawerPrimitiveType[]`          | List of primitive types (triangles, lines, points) to enable for debugging visualization. |
| `materials.triMaterial`                                    | `StandardMaterial`                    | Custom material for drawing triangle primitives.                                          |
| `materials.pointMaterial`                                  | `StandardMaterial`                    | Custom material for drawing point primitives.                                             |
| `materials.lineMaterialOptions.greasedLineMaterialOptions` | `Partial<GreasedLineMaterialOptions>` | Configuration for the **GreasedLineMaterial** used when rendering debug lines.            |
| `materials.lineMaterialOptions.greasedLineMeshOptions`     | `Partial<GreasedLineMeshOptions>`     | Configuration for the **GreasedLineMesh** geometry options                                |

```ts
export type DebugDrawerPrimitiveType = "lines" | "tris" | "quads" | "points";
```

You can then call the `draw` function to visualize the required layers:

```ts
const debugLayerOptions = DebugLayerOption.COMPACT_HEIGHTFIELD_DISTANCE;
debug.draw(navigationPlugin.navMesh, navigationPlugin.intermediates, scene, debugLayerOptions);
```

#### Available DebugLayerOptions

| Constant                       | Description                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `HEIGHTFIELD_SOLID`            | Shows the raw solid voxel heightfield generated from geometry.                 |
| `HEIGHTFIELD_WALKABLE`         | Shows the walkable areas in the heightfield after slope and clearance tests.   |
| `COMPACT_HEIGHTFIELD_SOLID`    | Shows the compact heightfield, a memory-efficient representation of voxels.    |
| `COMPACT_HEIGHTFIELD_REGIONS`  | Displays distinct connected regions extracted from the compact heightfield.    |
| `COMPACT_HEIGHTFIELD_DISTANCE` | Shows the distance field used for region partitioning and contour tracing.     |
| `RAW_CONTOURS`                 | Displays raw, un-simplified contours extracted from regions.                   |
| `CONTOURS`                     | Shows simplified and optimized contours, ready for polygonization.             |
| `POLY_MESH`                    | Displays the polygon mesh generated from contours.                             |
| `POLY_MESH_DETAIL`             | Shows the detailed mesh (with height detail) built on top of the polygon mesh. |
| `NAVMESH`                      | Displays the final navigation mesh used for pathfinding.                       |
| `NAVMESH_BV_TREE`              | Shows the bounding volume tree (BVTree) used for fast spatial queries.         |

Note: You can also use the specific `draw` functions from the `NavigationDebugger`. [Refere to the NavigationDebugger API](API)

Drawing a debug nav mesh where `polyFlags` are set to `1` (default value) with `blue` color:

```ts
debug.drawNavMeshPolysWithFlags(navigationPlugin.navMesh, 1, 0x0000ff);
```

This function visualizes the off-mesh connections as well as seen on the image:

<img src="/img/extensions/navigation/debug-offmesh.png" title="Offmesh connections visualized in a debug layer" width="30%" />

#### Examples

Example of creating a `line` debugger with setting the `GreasedLine` properties in the `options` parameter:

```ts
const debug = new ADDONS.NavigationDebugger(scene, {
  primitiveTypes: ["lines"],
  materials: {
    lineMaterialOptions: {
      greasedLineMaterialOptions: {
        width: 8,
        sizeAttenuation: true,
        color: BABYLON.Color3.Yellow(),
      },
    },
  },
});
```

You can then visualize the intermediate data as follows:

```ts
debug.draw(navigationPlugin.navMesh, navigationPlugin.intermediates, scene, ADDONS.DebugLayerOption.COMPACT_HEIGHTFIELD_DISTANCE);
```

<img src="/img/extensions/navigation/debug-heightfield-distance.png" title="Heighfield distance debug layer" width="30%" />

#### Polymesh detail

<img src="/img/extensions/navigation/debug-poly-mesh-detail.png" title="Polymesh detail debug layer" width="30%" />

#### BV tree

<img src="/img/extensions/navigation/debug-bv-tree.png" title="BV tree detail debug layer" width="30%" />

### The createDebugNavMesh function

The function `navigationPlugin.createDebugNavMesh` is available in V2 to maintain backwards compatiblity.
