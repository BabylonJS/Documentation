---
title: Clones
image: 
description: Learn clones and cloning in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, clones
further-reading:
video-overview:
video-content:
---

## Clone
This simply creates a deep copy of the original mesh and saves memory by sharing the geometry. Each clone can have its own material and transformation.


Note that as of v5.0, cloning a mesh with skeleton will assign said skeleton to the clone, ie, the skeleton is shared. If your clone does not need a skeleton, simply set it to null.
```javascript
clone.skeleton = null;
```
Alternatively, if your clone needs a skeleton, simply clone's the source mesh's skeleton.
```javascript
clone.skeleton = mesh.skeleton.clone();
```

## Examples
<Playground id="#QMFPPE" title="Cloning Example 1" description="Simple example showing shared geometry by scaling one geometry by 2." isMain={true} category="Mesh"/> Shows shared geometry by scaling one geometry by 2.  

``` ```
<Playground id="#QMFPPE#1" title="Cloning Example 2" description="Simple example showing transformation by scaling of 2 only changes one mesh."/> Shows transformation by scaling of 2 only changes one mesh.  

``` ```
<Playground id="#QMFPPE#2" title="Cloning Example 3" description="Simple example of clones with different materials."/> Different materials.  
