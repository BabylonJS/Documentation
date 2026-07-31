---
title: Centered on Created Origin
image:
description: Learn origins and pivots in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, origin, pivot
further-reading:
video-overview:
video-content:
---

## Transformations About the Local Origin

When a mesh is created, the position vector for each vertex is given from (0, 0, 0), the _created origin_ of the mesh, which is also its _local origin_ for [translation](/typedoc/classes/babylon.transformnode#translate), rotation, and scaling. In this section, the center of transformation of a mesh will always be its _local origin_. For changes to the center of transformation, visit [Parents and Pivots](/features/featuresDeepDive/mesh/transforms/parent_pivot). As well as simply assigning vector values to change the position, rotation, and scale of a mesh, it is also possible to use coordinate transformation to transform one mesh in terms of another mesh's frame of reference. You can also transform the mesh vertex coordinates and effectively change the _local origin_. This process of _baking transformations_ is described here, although it should only be necessary in exceptional circumstances.
