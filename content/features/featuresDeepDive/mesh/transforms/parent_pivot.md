---
title: Parents and Pivots
image: 
description: Learn all about parent relationships and pivots in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, parent, pivot
further-reading:
video-overview:
video-content:
---

## Transformation, Pivots and Parents

Should you wish to rotate or scale a mesh, or other object, about a point other than its own _local origin_ then this can be done by changing its center of transformation using either a parent or a pivot. Whilst in general conversation, and some 3D applications, a center of transformation may be referred to as a pivot point, in Babylon.js the term _pivot_ is used when setting a center of transformation with a specific method. The effects of using a parent or a pivot are different. To obtain the behavior of a pivot point as described for example by 3DS Max or Maya then set a parent on the mesh to act as the pivot point rather than using _setPivotPoint_.

When a parent is set on a child mesh, transforming a parent will apply the same transformations to the child. Translations, rotations and scaling of the child will take place relative to the _local origin_ of the child. Setting the position of the child will be relative to the _local origin_ of the parent. In simpler terms, moving the child will not move the parent and moving the parent will move the child.

Depending on the method used to produce the parent child relationship any transformations made to the parent prior to assigning it  children may also be applied to the children when the parent is assigned. It usually makes sense not to rotate or move a child until after you've assigned it to the parent.

When a pivot is set on a mesh, repositioning the mesh will reposition the pivot so that its placement relative to the mesh is not changed. Rotation and scaling of the mesh take place relative to the pivot. More simply, moving the mesh will move the pivot and moving the pivot will not move the mesh.

Using a pivot can be tricky and a number of methods are available. Some of these methods, but not all, may actually change the _local origin_ of a mesh.
