---
title: Thin Instances
image: 
description: Learn how to leverage thin instances in your Babylon.js scenes.
keywords: welcome, babylon.js, diving deeper, meshes, mesh transformation, instances, thin instances
further-reading:
    - title: How To Use Instances
      url: /How_To/How_to_use_Instances
video-overview:
video-content:
---

## How to use Thin Instances
Starting with Babylon.js v4.2, thin intances are a new feature of meshes.

PG: <Playground id="#V1JE4Z#1" title="Thin Instances Example" description="Simple example of using thin instances." image=""/>

As explained in [How To Use Instances](/How_To/How_to_use_Instances), instances are an excellent way to use hardware accelerated rendering to draw a huge number of identical meshes.

However, regular instances still have a performance penalty on the javascript side because each instance is its own object (`InstancedMesh`): if you have 10000 instances in your scene, the engine must loop over all those objects to make a number of processing (visibility check, etc).

Thin instances don't create new objects so you don't incur any penalty on the javascript side by having thousands of them. This performance increase does come with a cost:
* all thin instances are always all drawn (if the mesh is deemed visible) or none. It's all or nothing.
* adding / removing a thin instance is more costly than with `InstancedMesh`

Thin instances should be used when you need a lot of static instances that you know won't change often / at all. Think of the seats of a stadium, for eg.

So, regular instances may still be the way to go, depending on your scene: if you have a lot of objects scattered and only a few are visible in a frame, or if you must add/remove instances continuously, it may be better to use instances than thin instances.

## Creating thin instances
A thin instance is represented by a position/rotation/scaling data packed into a matrix.

The easiest way to create a thin instance is by doing:
```javascript
var matrix = BABYLON.Matrix.Translation(-2, 2, 0);
var idx = sphere.thinInstanceAdd(matrix);
```

You can also pass an array of matrices to `thinInstanceAdd` if you want to create multiple thin instances at once.

Note that `sphere` itself is not rendered. If you want to render it, use `thinInstanceAddSelf()`:
```javascript
var idx2 = sphere.thinInstanceAddSelf();
```

These methods return an index that you can use to reference the thin instance.

For example, you can update a thin instance afterwards:
```javascript
var matrix2 = BABYLON.Matrix.Translation(2, 1, 0);
sphere.thinInstanceSetMatrixAt(idx2, matrix2);
```

Example: <Playground id="#217750" title="Creating Thin Instances" description="Simple example of creating thin instances." image=""/>

Those 3 methods take an additional `refresh` parameter (`true` by default) that allows you to block the buffer refresh mechanism to save performances: if you must use those methods multiple times, pass `false` for all calls except for the last one.

The bounding info of the mesh is recomputed each time you call these methods to encompass all the thin instances (except if you set `doNotSyncBoundingInfo` to `true`). You can also refresh explicitely the bounding info by calling `thinInstanceRefreshBoundingInfo`.

## Custom attributes
As for regular instances, you can add custom attributes to thin instances.

To do so, register the attribute and set the value(s) for the thin instance(s):
```typescript
sphere.thinInstanceRegisterAttribute("color", 4);

sphere.thinInstanceSetAttributeAt("color", idx, [1, 1, 0, 1]);
sphere.thinInstanceSetAttributeAt("color", idx2, [1, 0, 0, 1]);
```

As the thin instance indexes are really indexes into the underlying buffer, you can set the values for several thin instances at once:
```typescript
sphere.thinInstanceRegisterAttribute("color", 4);

sphere.thinInstanceSetAttributeAt("color", 0, [1, 1, 0, 1, 1, 0, 0, 1]);
```

Example: <Playground id="#217750#1" title="Thin Instances Custom Attributes" description="Simple example of thin instances with custom attributes." image=""/>

You can get or set the number of thin instances to display through the `thinInstanceCount` property.

Note that you can't set a number that is higher than what the underlying buffer can handle!

Set the number to 0 to bypass the thin instance rendering and render the mesh as usual.

## Faster thin instances
To get the most of the thin instance support, you can directly pass the pre-built buffer of matrices / custom attributes:
```typescript
var matrix1 = BABYLON.Matrix.Translation(-2, 2, 0);
var matrix2 = BABYLON.Matrix.IdentityReadOnly;
var matrix3 = BABYLON.Matrix.Translation(2, 1, 0);

var bufferMatrices = new Float32Array(16 * 3);

matrix1.copyToArray(bufferMatrices, 0);
matrix2.copyToArray(bufferMatrices, 16);
matrix3.copyToArray(bufferMatrices, 32);

var bufferColors = new Float32Array(3 * 4);

bufferColors.set([1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1]);

sphere.thinInstanceSetBuffer("matrix", bufferMatrices, 16);
sphere.thinInstanceSetBuffer("color", bufferColors, 4);
```

Example: <Playground id="#217750#2" title="Thin Instances Example" description="Simple example showing how to use thin instances." image=""/>

If you have a lot of thin instances to create, it could be a lot faster than calling `thinInstanceAdd` / `thinInstanceSetAttributeAt`. Also, you can allocate a bigger buffer than what you really need at start and play with the `thinInstanceCount` property to adjust the number of instances to display during the course of your program.

Note that you don't need to call `thinInstanceRegisterAttribute` if you set a custom attribute buffer by calling `thinInstanceSetBuffer`.

If you update the buffers you passed to `thinInstanceSetBuffer`, you must call `thinInstanceBufferUpdated` for the changes to take effect.

To gain some performances, you can flag the buffers as **static**, meaning you won't change them later on. This way, the system can apply some optimizations to your buffers.

To do so, pass `true` for the 4th parameter of `thinInstanceSetBuffer`:
```javascript
sphere.thinInstanceSetBuffer("matrix", bufferMatrices, 16, true);
sphere.thinInstanceSetBuffer("color", bufferColors, 4, true);
```

## Support

Thin instances are supported for collisions, picking, rendering and shadows. However, for collisions and picking, a single bounding info encompassing all the thin instances is used to check intersection: the check is not done for each thin instance separately.

## Limitations

Thin instances with mixed positive and negative determinant matrices won't be rendered correctly. If you need thin instances with both positive and negative determinants, create two meshes and add the thin instances to one or the other (don't forget to set the `sideOrientation` property properly for both mesh materials!).

For eg: <Playground id="#217750#3" title="Thin Instances Wrong Rendering" description="Simple example of thin instances with wrong rendering." image=""/>

![Wrong rendering](/img/how_to/Mesh/thinInstancesWrongSideOrientation.png)

The green and blue cubes are not rendered correctly because they have a -1 scale for the X direction, making the determinant of their matrix negative.

To correct the problem, create another mesh, add the green/blue instances to that mesh (and remove them from the first mesh!) and set the side orientation of the material of that mesh to be **Clockwise** (by default, it is **Counter clockwise**):

PG: <Playground id="#217750#4" title="Thin Instances Correct Rendering" description="Simple example of thin instances with correct rendering." image=""/>
![Correct rendering](/img/how_to/Mesh/thinInstancesOkSideOrientation.png)