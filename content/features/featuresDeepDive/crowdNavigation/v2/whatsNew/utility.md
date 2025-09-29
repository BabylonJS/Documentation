---
title: Utility functions
image:
description: Detailed information about the utility functions
keywords: extensions, babylon.js, crowd, addons, navigation, new, recast
further-reading:
video-overview:
video-content:
---

## New Utility Functions

This module provides helper functions for smoothing and shaping navigation paths.
They can be used after querying a path from the navigation system to make the resulting movement look more natural or structured.

### Chaikin Path Smoothing

Applies Chaikin's corner-cutting algorithm to smooth a series of 3D points.
This algorithm iteratively refines the path by replacing each line segment with two new points closer to the segment ends, resulting in a smoother curve.

```ts
export function GetChaikinSmoothPath(points: IVector3Like[], iterations = 1): IVector3Like[];
```

| Parameter    | Type             | Default | Description                                                                        |
| ------------ | ---------------- | ------- | ---------------------------------------------------------------------------------- |
| `points`     | `IVector3Like[]` | —       | Array of path points (`{x, y, z}` objects) to be smoothed.                         |
| `iterations` | `number`         | `1`     | Number of smoothing iterations. More iterations = smoother curve, but more points. |

### Get L-Shaped Path

Generates a rectilinear (L-shaped) path between consecutive points of a navigation segment.
Instead of directly connecting points with a straight line, it inserts an intermediate corner point, creating a turn that is either horizontal-then-vertical or vertical-then-horizontal, depending on which direction is shorter.

```ts
export function GetLShapedPath(navSegment: Vector3[]): Vector3[];
```

| Parameter    | Type        | Description                                                                       |
| ------------ | ----------- | --------------------------------------------------------------------------------- |
| `navSegment` | `Vector3[]` | Array of `Vector3` points representing the navigation path segment or whole path. |
