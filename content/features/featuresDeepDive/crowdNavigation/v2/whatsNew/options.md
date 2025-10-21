---
title: The options parameter
image:
description: Detailed information about the option parameter added to the plugin functions
keywords: extensions, babylon.js, crowd, addons, navigation, new, recast
further-reading:
video-overview:
video-content:
---

## The options Parameter (per-query)

Most plugin query functions accept an optional options object to pass query-specific settings down to Recast/Detour. Common properties include:

```ts
options?: {
filter?: QueryFilter;
halfExtents?: IVector3Like;
// optionally other request-specific params depending on the function
}
```

Use this to apply different filter rules per agent/query and to control search area extents.

### QueryFilter

`QueryFilter` controls which polygons on the navmesh are considered during a path query. It's the primary tool for customizing walkability per agent or per situation.

**Common properties**

```ts
interface QueryFilter {
  includeFlags?: number; // bitmask: polygons that must include at least one of these flags
  excludeFlags?: number; // bitmask: polygons that must NOT include any of these flags
  areaCost?: number[]; // areaCost[areaId] = traversal cost multiplier for that area
}
```

**How it works**

`includeFlags/excludeFlag`s filter polygons by flag bits assigned when the navmesh was generated (via `tileCacheMeshProcess` or default config).

`areaCost` adjusts the traversal cost for polygons with a given area id — higher cost discourages the pathfinder from using that area unless needed.

## Examples

Pedestrian who avoids roads and prefers sidewalks:

```ts
const pedestrianFilter: QueryFilter = {
  includeFlags: 0x0001, // only polygons flagged as "walkable_for_pedestrian"
  excludeFlags: 0x0004, // exclude "road" polygons
  areaCost: [1.0, 2.0, 5.0], // index = area id; higher = more expensive
};

const path = navigationPlugin.findPath(start, end, { filter: pedestrianFilter });
```

Vehicle that only uses "road" polygons:

```ts
const vehicleFilter: QueryFilter = {
  includeFlags: 0x0004, // road flag
  areaCost: [1.0, 1.0, 1.0],
};

const drivePath = navigationPlugin.findPath(vehicleStart, vehicleEnd, { filter: vehicleFilter });
```

### Notes

`areaCost` length should cover the highest area id used in your mesh. Missing entries are treated as cost `1.0`.

Flags and areas are assigned when mesh polygons are processed during build time — use `tileCacheMeshProcess` to control those assignments.
