---
title: Facet Data
image:
description: Learn all about facet data in Babylon.js.
keywords: diving deeper, meshes, facet data
further-reading:
video-overview:
video-content:
---

# Facet Data

## What is FacetData ?

FacetData is a feature that can be enabled on a mesh.  
As it requires some extra memory, it's not enabled by default.  
This feature provides some methods and properties to access each facet of a mesh, like the facet positions, normals or the ability to retrieve all of a mesh facets in a given zone of the world space.

## What is a mesh facet ?

We use here the term "facet" in order to be not confused with the term "face".  
A mesh can have some planar faces. For example, a box has 6 sides, so 6 planar squared faces. Each of its faces are drawn at the WebGL level with 2 triangles.  
We call "facets" these elementary triangles.

## How to enable the facet data ?

The feature `facetData` can work for any mesh whatever it is created from BJS provided shapes (box, sphere, cylinder, tube, parametric shapes, etc), cloned ones or instances, merged ones or imported ones from an external source (Blender, etc).  
To enable this feature, just call once `updateFacetData()`.  
If the mesh belongs to some parent-child relationship, the feature is then not enabled for its parents or children.

```javascript
const mesh = BABYLON.MeshBuilder.CreateTorusKnot("t", { radius: 2.0 }, scene);
mesh.updateFacetData();
console.log(mesh.facetNb);
```

As soon as the feature is enabled, you can get the mesh total number of facets with the read-only property `.facetNb`.

The method `updateFacetData()` creates two permanent arrays : the mesh facet positions and facet normals.  
Moreover, it logically divides the mesh according to some partitioning and stores all the facets in this partitioning.  
Unless the mesh is updated or morphed afterwards, you don't need to call this method anymore once it has been done.  
If you don't need this feature any longer, you can disable it to release the memory with `mesh.disableFacetData()`.

```javascript
mesh.updateFacetData();
console.log(mesh.isFacetDataEnabled); // displays "true"
mesh.disableFacetData();
console.log(mesh.isFacetDataEnabled); // displays "false"
```

The read-only property `.isFacetDataEnabled` returns the current state of the feature.  
Note that disposing the mesh will automatically disable its facet data.

## The facet data tools

### Facet position

The position of a facet is the position of its barycenter.  
You can get the position of the i-th facet of a mesh with `getFacetPosition(i)`. This returns a new `Vector3` that is the world coordinates of the facet center.

```javascript
const pos = mesh.getFacetPosition(50); // returns the world position of the mesh 50th facet
```

If you don't want to allocate a new `Vector3` per call, you can use `getFacetPositionToRef(i, ref)` instead.

```javascript
const pos = BABYLON.Vector3.Zero();
mesh.getFacetPositionToRef(50, pos); // stores the facet world position in the variable "pos"
```

Actually, in the internal array containing the facet positions, all the stored coordinates are computed in the mesh local space.  
If you need to get some facet local position, call `getFacetLocalPositions()` to get the array of the facet positions, then access the i-th element.

```javascript
const localPositions = mesh.getFacetLocalPositions(); // returns the array of facet positions in the local space
const localPos = localPositions[50]; // Vector3 : the 50th facet local position
```

### Facet normal

The normal of a facet is the normalized vector orthogonal to the facet plane.  
You can get the normal of the i-th facet of a mesh with `getFacetNormal(i)`. This returns a new `Vector3` that is the world coordinates of the facet normal.

```javascript
const norm = mesh.getFacetNormal(50); // returns the world normal of the mesh 50th facet
```

If you don't want to allocate a new `Vector3` per call, you can use `getFacetNormalToRef(i, ref)` instead.

```javascript
const norm = BABYLON.Vector3.Zero();
mesh.getFacetNormalToRef(50, norm); // stores the facet world normal in the variable "norm"
```

Like for the positions, in the internal array containing the facet normals, all the stored coordinates are computed in the mesh local space.  
If you need to get some facet local normal, call `getFacetLocalNormals()` to get the array of the facet local normals, then access the i-th element.

```javascript
const localNormals = mesh.getFacetLocalNormals(); // returns the array of facet normals in the local space
const localPos = localNormals[50]; // Vector3 : the 50th facet local position
```

#### Note

All the methods dealing with the world coordinates use the mesh world matrix. As you may know, this matrix is automatically computed on the render call.  
If you've just moved, scaled or rotated your mesh before calling the facetData methods using the world values and you're not sure about this, you can ever force the world matrix computation.

```javascript
mesh.rotate.y += 0.2; // the mesh will be rotated on the next render call, but I need a rotated normal
mesh.computeWorldMatrix(true); // force the world matrix computation
const norm = mesh.getFacetNormal(50); // returns the world normal of the mesh 50th facet
```

#### Examples :

Displaying all the facet normals of an icosphere: <Playground id="#1YTZAC" title="Displaying Facet Data" description="Simple example of displaying all the facet normals of an icosphere."/>
Just change the mesh shape, torus knot : <Playground id="#1YTZAC#1" title="Displaying Facet Data - Torus Knot" description="Simple example of displaying all the facet normals of a torus knot."/>
Smarter : set a box at a distance of 2 from the mesh 10th facet and keep it there, even if the mesh rotates: <Playground id="#1YTZAC#3" title="Displaying Facet Data" description="Simple example of displaying all the facet normals."/>
Of course, you can add some [translation](/typedoc/classes/babylon.transformnode#translate) to the mesh and even some rotation to the box: <Playground id="#1YTZAC#4" title="Displaying Facet Data" description="Simple example of displaying all the facet normals."/>

Note also that the facet index is the same as the facet id `faceId` used by the pickingInfo object or the `faceId` used by the SPS when pickable.  
Here is an example combining pickingInfo, pickable SPS and facetData facet index: <Playground id="#2FPT1A#119" title="Combining pickingInfo and facetData" description="Simple example combining pickingInfo, pickable SPS and facetData facet index."/>
Just click and the ball is positioned at the clicked facet position, not the clicked point.

### Mesh partitioning

The feature `facetData` provides also another tool called the mesh partitioning.  
The mesh is logically divided in 3D blocks aligned with the X, Y and Z axis in its local space.  
Here's an illustration about how this logical partitioning looks like (please wait until the skull is downloaded): <Playground id="#UZGNA#5" title="Mesh Partitioning" description="Simple example of mesh partitioning."/>
In order to improve the visibility, the planes along the axis Z weren't displayed.  
As you can see, there are by default 10 subdivisions on each axis.  
When you call `updateFacetData()`, the indexes of the all the facets are sorted in the partioning array according to the facet belonging to each block.

Thus you can get all the facet indexes from some local coordinates _(x, y, z)_ with `getFacetsAtLocalCoordinates(x, y, z)`.

```javascript
const indexes = mesh.getFacetsAtLocalCoordinates(x, y, z); // returns an array containing the facet indexes
if (indexes != null) {
  const worldPos = mesh.getFacetPosition(indexes[0]); // the world position of the first facet in the block
}
```

This method returns an array containing the indexes of the facet belonging to the block containing the point at the coordinates _(x, y, z)_.  
If _(x, y, z)_ aren't in any block or if there's no facet in the block containing _(x, y, z)_, it returns `null`.  
So you can retrieve this way all the facets near some position and do your own treatment.  
This method can be called as many times you need, even in the render loop. It doesn't allocate any object in memory.

Sometimes you don't need all the facets from a given block but only the closest facet to some world, but not local, coordinates.  
You can then use the method `getClosestFacetAtCoordinates(x, y, z)` what returns the index of the closest facet to the World coordinates _(x, y, z)_.

```javascript
const index = mesh.getClosestFacetAtCoordinates(x, y, z); // returns the index of the closest facet to (x, y, z)
if (index != null) {
  const worldPos = mesh.getFacetPosition(index); // the world position of this facet
}
```

The method returns just the index of the closest facet, if any.  
Actually the world coordinates _(x, y, z)_ are internally transformed to local coordinates in the mesh local system.  
If these local coordinates aren't in any block or if there's no facet in this block, it returns `null`.  
This method can be called as many times you need, even in the render loop.

This method can also compute for you the coordinates of the projection of _(x, y, z)_ on the closest facet plane. You can imagine this projection point as the contact point of _(x, y, z)_ on the facet, or the nearest point from _(x, y, z)_ on the facet.  
Just pass it a`Vector3` as a reference :

```javascript
const projected = BABYLON.Vector3.Zero();
const index = mesh.getClosestFacetAtCoordinates(x, y, z, projected); // sets the point "projected" world coordinates
if (index != null) {
  const worldPos = mesh.getFacetPosition(index); // the world position of this facet
  // use the vector3 projected here ...
}
```

You can even filter the returned facet index.  
Imagine that you want only the facet "facing" the coordinates _(x, y, z)_, it is to say the facet of which the dot product normal \* facetPosition*to*(x, y, z) is positive.

So just set the fifth parameter `checkFace` to `true` (default `false`) and the sixth parameter `facing?` to `true` (default `true`).

```javascript
const projected = BABYLON.Vector3.Zero();
const index = mesh.getClosestFacetAtCoordinates(x, y, z, projected, true); // just the "facing" closest facet
if (index != null) {
  const worldPos = mesh.getFacetPosition(index); // the world position of this facet
  // use the vector3 projected here ...
}
```

On the contrary, if you just want the closest facet "turning its back" to _(x, y, z)_, set `checkFace` to `true` and `facing?` to `false`.

```javascript
const projected = BABYLON.Vector3.Zero();
const index = mesh.getClosestFacetAtCoordinates(x, y, z, projected, true, false); // just the "turning back" closest facet
if (index != null) {
  const worldPos = mesh.getFacetPosition(index); // the world position of this facet
  // use the vector3 projected here ...
}
```

If you need it, this method exists also in the mesh local space. Everything is then expressed in the local space : _(x, y, z)_ and the returned coordinates of the projected point.  
Just call `getClosestFacetAtLocalCoordinates(x, y, z, projected, checkFace, facing?)` instead.

```javascript
const localProj = BABYLON.Vector3.Zero();
const index = mesh.getClosestFacetAtLocalCoordinates(x, y, z, localProj); // local projection
if (index != null) {
  const worldPos = mesh.getFacetPosition(index); // the world position of this facet
  // use the vector3 localProj here ...
}
```

#### Note

As said before, the returned facet indexes from all these former methods are the same values as the `PickingInfo` or pickable SPS `faceId` values.
So, you can easily mix all these features together. Ex : to get the facet normal from a picked mesh.

#### Example

A rotating torus knot with facet data enabled and a Solid Particle System (SPS) moving balls with simple custom physics :

- move the ball,
- get the torus closest facet to the particle,
- if any, bounce back the particle.

 <Playground id="#7ATLX" title="Rotating Torus Knot With Facet Data" description="Simple example of rotating torus knot with facet data."/>

### Tweaking the partitioning

By default, the partitioning is set to 10 subdivisions per axis. These subdivisions are applied to the mesh bounding box.  
Actually, it's a bit smarter. It divides the biggest bounding box dimension by 10 and adjust the other ones to their ratio to this biggest.  
Example : if the mesh is sized 200 on X, 100 on Z and 3 on Y, it will subdive X in 10 subdivisions, Z in 5 subdivisions and Y in only 1.  
10 subdivisions is an arbitrary default value. You can change it according to your mesh geometry.  
Just keep in mind these two principles :

- the subdivisions (blocks) must be bigger than the facets to get accurate results,
- the more subdivisions, the fastest the method `getClosestFacetAtCoordinates()`.

So if you deal with a huge mesh with plenty of very small facets like the BJS skull, you can easily set the subdivision number to 50, but if you deal with your own ribbon built with only one hundred big facets, you should probably reduce this number to 4.  
To set the number of subdivisions, just use the property `.partitioningSubdivisions`. It will be taken in account at the next call to `updateFacetData()` and can be changed at will.

```javascript
mesh.partitioningSubdivisions = 50; // set a bigger value than the default one (integer)
mesh.updateFacetData(); // now the internal partitioning has 50 blocks per axis
```

You can also enlarge a bit the space used by the blocks to have a bigger "detection zone" (remember that if _(x, y, z)_ is outside the block zone, the methods return `null`).  
By default, the block area is 1% bigger than the mesh bounding box in order to keep a little space between the peripheric blocks and their contained facets.  
You can set your own value with the property `.partitioningBBoxRatio` (default = 1.01). It will be taken in account at the next call to `updateFacetData()` and can be changed at will.

```javascript
mesh.partitioningBBoxRatio = 1.05; // 5% bigger than the bounding box instead of 1% bigger
mesh.updateFacetData(); // now the internal block area if 5% bigger than the bounding box
```

In order to understand, here are two examples :  
ratio = 1.20 (20% bigger) <Playground id="#UZGNA#6" title="Partitioning With a Larger Ratio" description="Simple example of partitioning with a larger ratio."/>  
ratio = 0.80 (20% smaller) <Playground id="#UZGNA#7" title="Partitioning With a Smaller Ratio" description="Simple example of partitioning with a smaller ratio."/>  
Those examples aren't pertinent, because the values are too big or too small : the block area is too far from the mesh or inside the mesh.  
Right values should keep between 1.0 and 1.10.

### Updating Facet Data

As said in the first part, you need to call once `updateFacetData()` to enable the feature.  
This is enough if the mesh geometry keep unchanged afterwards.

Nonetheless, if you update or morph your mesh afterwards, you need to call `updateFacetData()` again to force the partitioning recomputation.

```javascript
const mesh = myBlenderImportedMesh; // import some mesh from an external source
mesh.updateFacetData(); // enable facetData
// ... process here using the mesh with its current geometry and FacetData
if (condition) {
  customMorphFunction(mesh); // update the mesh geometry
  mesh.updateFacetData(); // update the facet data
}
```

`updateFacetData()` can be called on demand, even in the render loop. However this method as a CPU cost, actually exactly the same as the static method `ComputeNormals()`.  
So if your mesh has a very huge amount of facets like the BJS skul, this can take some times.

Some of the provided BJS mesh types are updatable/morphable by their dedicated methods : the parametric shapes and the SPS.

- the parametric shapes are updatable by calling again the method `CreateXXX()` with the parameter `instance`,
- the SPS is updated each call to `setParticles()`.

For these specific types of updatable meshes, you don't need to call `updateFacetData()` by your own, if the feature is already enabled.
It will be done automatically, generally in an optimized way, inside the process loop of the mesh geometry update.

```javascript
const paths = someArrayOfPaths;
const mesh = BABYLON.MeshBuilder.CreateRibbon("m", {pathArray: paths, updatable: true}, scene); // create an updatable ribbon
mesh.updateFacetData();    // enable the feature once
// morphing function : change the ribbon geometry
const morphRibbon = function(k) {
    for (let p = 0; p < paths.length; p++) {
        const path = paths[p];
        for (let i = 0; i < path.length) {
            path[i].y = Math.sin(k) * Math.cos(i);
        }
    }
}
const k = 0.0;
// render loop
scene.registerBeforeRender(function() {
    morphRibbon(k);                     // change the geometry
    BABYLON.MeshBuilder.CreateRibbon(null, {pathArray: paths, instance: mesh}); // actually morph the ribbon
    // No need for updateFacetData() here, CreateRibbon() just did it ... faster !
    k += 0.01;
});
```

Example :  
Custom simple physics on a dynamically morphed ribbon: <Playground id="#XVGK0#3" title="Physics On A Morphed Ribbon" description="Simple example of custom simple physics on a dynamically morphed ribbon."/>

### Facet Depth Sort

As you may know, for performance reasons, the facets of a given mesh are always drawn in the same order. This comes to visual issues when the mesh is transparent, concave and is no longer oriented in the right place from the camera :

<Playground id="#FWKUY0" title="Facet Depth Sort 1" description="Simple example of using facet depth sort."/>

This new feature solves the self transparency issue by sorting the mesh facets from some location (the camera position by default) just before drawing them.  
The mesh is **required** to be `updatable`.  
The depth sort is done on each call to `updateFacetData()`. It can be disabled at any time to save CPU cycles if the mesh and the camera don't move anymore.  
Usage :

```javascript
// the mesh must be updatable
const mesh = BABYLON.MeshBuilder.CreateTorusKnot("mesh", {updatable: true}, scene);
mesh.material = mat;                         // transparent material
mesh.mustDepthSortFacets = true;             // enable the depth sort, can be disabled at any time

scene.registerBeforeRender(function() {
mesh.updateFacetData();     // sort the facets each frame
```

Exampl: <Playground id="#FWKUY0#1" title="Facet Depth Sort 2" description="Simple example of using facet depth sort."/>

Depth sorted on the left, standard on the right.

If you don't need the depth sort once enabled, you can simply stop to call `updateFacetData()`.  
If, for some reason, you still need to call `updateFacetData()` but you don't need the depth sort any longer, just disabled it with `mesh.mustDepthSortFacets = false`.  
In both cases, the facet will keep the last given order.

Note that if your mesh is an SPS (Solid Particle System), it's better to not enable the facet depth sort in the same time as the particle depth sort, simply because the underlying sort is done twice, so more CPU used and no gain.  
In this case, just choose what kind of sorting is better for you : at particle level (faster) or at facet level (more accurate).

As the facet depth sort reorganizes the mesh indices, it **can't work** with the MultiMaterials.
