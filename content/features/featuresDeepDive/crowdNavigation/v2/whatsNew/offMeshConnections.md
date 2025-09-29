---
title: OffMeshConnections aka Teleports
image:
description: Learn about how to use teleports
keywords: extensions, babylon.js, crowd, addons, navigation, offmesh, connection, teleport
further-reading:
video-overview:
video-content:
---

## OffMeshConnections aka Teleports

Off-mesh connections allow agents to traverse between arbitrary points in the world, outside the standard walkable surfaces of a navmesh.  
Typical use cases include **jumping across gaps, climbing ladders, or teleporting through portals/doors**.

### OffMeshConnectionParams

| Name            | Type      | Required | Description                                                   | Default |
| --------------- | --------- | -------- | ------------------------------------------------------------- | ------- |
| `startPosition` | `Vector3` | ✔        | World-space start position of the connection.                 | –       |
| `endPosition`   | `Vector3` | ✔        | World-space end position of the connection.                   | –       |
| `radius`        | `number`  | ✔        | Radius of the connection in world units.                      | –       |
| `bidirectional` | `boolean` | ✔        | Whether the connection can be traversed in both directions.   | –       |
| `area`          | `number`  | ✖        | Area type of the connection (e.g. ground, water, door).       | `0`     |
| `flags`         | `number`  | ✖        | Flags associated with the connection (e.g. walk, swim, jump). | `1`     |
| `userId`        | `number`  | ✖        | Optional user-defined identifier for the connection.          | –       |

#### Example

The following example adds an **off-mesh jump connection** between two platforms:

```ts
const jumpConnection: OffMeshConnectionParams = {
  startPosition: new Vector3(0, 1, 0), // platform A
  endPosition: new Vector3(5, 1, 0), // platform B
  radius: 0.5, // connection width
  bidirectional: true, // can jump both ways
  area: 0, // default area type
  flags: 1, // default walkable flag
  userId: 42, // optional identifier
};

const navmeshParameters = {
  cs: 0.5,
  ch: 0.5,
  // etc
  offMeshConnections: [jumpConnection],
};

const { navMesh, navMeshQuery } = await navigationPlugin.createNavMeshAsync([staticMesh], navmeshParameters);
```
