---
title: Merging Meshes
image:
description: Learn how to merge meshes in Babylon.js.
keywords: diving deeper, meshes, merge
further-reading:
video-overview:
video-content:
---

## Native Babylon.js function

To easily merge a number of meshes to a single mesh use the static `MergeMeshes` of the `Mesh` class:

```javascript
const newMesh = BABYLON.Mesh.MergeMeshes(arrayOfMeshes, disposeSource, allow32BitsIndices, meshSubclass, subdivideWithSubMeshes, multiMultiMaterials);
```

| variable                          | description                                                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| arrayOfMeshes                     | An array of Meshes. They should all be of the same material.                                                   |
| disposeSource (optional)          | When true (default), the source meshes will be disposed upon completion.                                       |
| allow32BitsIndices (optional)     | When the sum of the vertices > 64k, this must be set to true.                                                  |
| meshSubclass (optional)           | When set, vertices inserted into this Mesh. Meshes can then be merged into a Mesh sub-class.                   |
| subdivideWithSubMeshes (optional) | When true (false default), subdivide mesh to his subMesh array with meshes source.                             |
| multiMultiMaterials (optional)    | When true (false default), subdivide mesh and accept multiple multi materials, ignores subdivideWithSubMeshes. |

Since `multiMultiMaterials` defaults to false, the resulting merged mesh will have only one material applied to it (taken from the first mesh):

<Playground id="#INZ0Z0#5" title="Merged Meshes Example" description="Simple example of merging meshes together."/>

Compare with the following example which sets `multiMultiMaterials` to true:

<Playground id="#INZ0Z0#59" title="Merging Meshes With Multiple Materials" description="Simple example of merging meshes together with multiple materials."/>

See [this page](/features/featuresDeepDive/materials/using/multiMaterials) for more details on usage of merged meshes.

## Use your own merge function

If you want to merge meshes into a new one using a self implemented function, you can use the following code as basis and improve it to your needs:

Note: Careful, when you merge cloned mesh, you need to update the world matrix of the mesh with computeWorldMatrix before calling the function.

**Note: This article covers the internal merging process. You can also use `BABYLON.VertexData` object and its `merge()` function for a simpler solution.**

```javascript
const mergeMeshes = function (meshName, arrayObj, scene) {
  const arrayPos = [];
  const arrayNormal = [];
  const arrayUv = [];
  const arrayUv2 = [];
  const arrayColor = [];
  const arrayMatricesIndices = [];
  const arrayMatricesWeights = [];
  const arrayIndice = [];
  const savedPosition = [];
  const savedNormal = [];
  const newMesh = new BABYLON.Mesh(meshName, scene);
  const UVKind = true;
  const UV2Kind = true;
  const ColorKind = true;
  const MatricesIndicesKind = true;
  const MatricesWeightsKind = true;

  for (let i = 0; i != arrayObj.length; i++) {
    if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.UVKind])) UVKind = false;
    if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.UV2Kind])) UV2Kind = false;
    if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.ColorKind])) ColorKind = false;
    if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.MatricesIndicesKind])) MatricesIndicesKind = false;
    if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.MatricesWeightsKind])) MatricesWeightsKind = false;
  }

  for (let i = 0; i != arrayObj.length; i++) {
    const ite = 0;
    const iter = 0;
    arrayPos[i] = arrayObj[i].getVerticesData(BABYLON.VertexBuffer.PositionKind);
    arrayNormal[i] = arrayObj[i].getVerticesData(BABYLON.VertexBuffer.NormalKind);
    if (UVKind) arrayUv = arrayUv.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.UVKind));
    if (UV2Kind) arrayUv2 = arrayUv2.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.UV2Kind));
    if (ColorKind) arrayColor = arrayColor.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.ColorKind));
    if (MatricesIndicesKind) arrayMatricesIndices = arrayMatricesIndices.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind));
    if (MatricesWeightsKind) arrayMatricesWeights = arrayMatricesWeights.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind));

    const maxValue = savedPosition.length / 3;

    arrayObj[i].computeWorldMatrix(true);
    const worldMatrix = arrayObj[i].getWorldMatrix();

    for (let ite = 0; ite != arrayPos[i].length; ite += 3) {
      const vertex = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(arrayPos[i][ite], arrayPos[i][ite + 1], arrayPos[i][ite + 2]), worldMatrix);
      savedPosition.push(vertex.x);
      savedPosition.push(vertex.y);
      savedPosition.push(vertex.z);
    }

    for (let iter = 0; iter != arrayNormal[i].length; iter += 3) {
      const vertex = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(arrayNormal[i][iter], arrayNormal[i][iter + 1], arrayNormal[i][iter + 2]), worldMatrix);
      savedNormal.push(vertex.x);
      savedNormal.push(vertex.y);
      savedNormal.push(vertex.z);
    }

    const tmp = arrayObj[i].getIndices();
    for (let it = 0; it != tmp.length; it++) {
      arrayIndice.push(tmp[it] + maxValue);
    }
    arrayIndice = arrayIndice.concat(tmp);

    arrayObj[i].dispose(false);
  }

  newMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, savedPosition, false);
  newMesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, savedNormal, false);
  if (arrayUv.length > 0) newMesh.setVerticesData(BABYLON.VertexBuffer.UVKind, arrayUv, false);
  if (arrayUv2.length > 0) newMesh.setVerticesData(BABYLON.VertexBuffer.UV2Kind, arrayUv, false);
  if (arrayColor.length > 0) newMesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, arrayUv, false);
  if (arrayMatricesIndices.length > 0) newMesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, arrayUv, false);
  if (arrayMatricesWeights.length > 0) newMesh.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, arrayUv, false);

  newMesh.setIndices(arrayIndice);
  return newMesh;
};
```

## Merging Meshes with Constructive Solid Geometry

You can also construct complex meshes by using `subtract`, `intersect`, and `add` methods of the [CSG2](/typedoc/classes/babylon.csg2) class.

### Initializing CSG2

Before being able to use `CSG2` you will have to initialize the [Manifold](https://github.com/elalish/manifold) library.

To do so you need to call the `InitializeCSG2Async` function:

```
await BABYLON.InitializeCSG2Async();
```

Please note that if you want to import the library yourself, you have to call the `InitializeCSG2Async` with the following information:

```
await BABYLON.InitializeCSG2Async({
  manifoldInstance: ...
  manifoldMeshInstance: ...
});
```

You can alternatively provide a link to the library itself:

```
await BABYLON.InitializeCSG2Async({
  manifoldUrl: "https://unpkg.com/manifold-3d@2.5.1"
});
```

### using CSG2

Let's say you want to create a "pipe" shape with an inner and outer diameter (_i.e._, not just a "tube" mesh, which is a curved plane with no "thickness"). This can be constructed by first creating a "cylinder" mesh, and then _subtracting_ a "tube" mesh from the inside of it.

```typescript
function createPipe(diamInner: number, diamOuter: number, height: number, scene: BABYLON.Scene): BABYLON.Mesh {
  // Create the outer wall using a Cylinder mesh
  const mOuter = BABYLON.MeshBuilder.CreateCylinder(
    "mOuter",
    {
      diameter: diamOuter,
      height: height,
    },
    scene,
  );
  // Create the inner wall using a Cylinder mesh
  const mInner = BABYLON.MeshBuilder.CreateCylinder(
    "mOuter",
    {
      diameter: diamInner,
      height: height,
    },
    scene,
  );
  // Create CSG objects from each mesh
  const outerCSG = BABYLON.CSG2.FromMesh(mOuter);
  const innerCSG = BABYLON.CSG2.FromMesh(mInner);

  // Create a new CSG object by subtracting the inner tube from the outer cylinder
  const pipeCSG = outerCSG.subtract(innerCSG);

  // Create the resulting mesh from the new CSG object
  const mPipe = pipeCSG.toMesh("mPipe", scene);

  // Dispose of the meshes, no longer needed
  mInner.dispose();
  mOuter.dispose();

  outerCSG.dispose();
  innerCSG.dispose();

  // Return the result
  return mPipe;
}
```

Playground example:
<Playground id="#PJQHYV" title="Pipe CSG Example" description="Creating a pipe from 2 cylinders using CSGs."/>

The `FromMesh` function accepts a second parameter that can be set to `true` if you do not want to work in world space.
The `toMesh` function can take an option as the third parameter:

```
{
    /**
     * Rebuild normals (false by default)
     */
    rebuildNormals: boolean;
    /**
     * True to center the mesh on 0,0,0. True by default
     */
    centerMesh?: boolean;
}

```

Please note that you can also work directly with `VertexData` with the `FromVertexData` and `toVertexData` functions.

Subtract example:
<Playground id="#PJQHYV#1" title="CSG Subtract Example" description="Simple example of using a CSG subtract operation."/>
