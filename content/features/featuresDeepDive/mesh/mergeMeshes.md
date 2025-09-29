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
function mergeMeshes(meshes, disposeSource) {
    if (!meshes || meshes.length === 0) {
        return null;
    }

    const validMeshes = [];
    let totalVertices = 0;
    let totalIndices = 0;
    
    const has = {
        normals: false,
        uvs: false,
        uv2s: false,
        colors: false,
        matricesIndices: false,
        matricesWeights: false,
    };

    for (const mesh of meshes) {
        const vd = mesh.getVertexBuffer(BABYLON.VertexBuffer.PositionKind);
        if (!vd) continue;
        
        const vertCount = mesh.getTotalVertices();
        if (!vertCount) continue;
        
        const indices = mesh.getIndices();
        if (!indices) continue;

        validMeshes.push(mesh);
        totalVertices += vertCount;
        totalIndices += indices.length;

        if (!has.normals && mesh.getVertexBuffer(BABYLON.VertexBuffer.NormalKind)) has.normals = true;
        if (!has.uvs && mesh.getVertexBuffer(BABYLON.VertexBuffer.UVKind)) has.uvs = true;
        if (!has.uv2s && mesh.getVertexBuffer(BABYLON.VertexBuffer.UV2Kind)) has.uv2s = true;
        if (!has.colors && mesh.getVertexBuffer(BABYLON.VertexBuffer.ColorKind)) has.colors = true;
        if (!has.matricesIndices && mesh.getVertexBuffer(BABYLON.VertexBuffer.MatricesIndicesKind)) has.matricesIndices = true;
        if (!has.matricesWeights && mesh.getVertexBuffer(BABYLON.VertexBuffer.MatricesWeightsKind)) has.matricesWeights = true;
    }

    if (validMeshes.length === 0) {
        return null;
    }

    const positions = new Float32Array(totalVertices * 3);
    const normals = has.normals ? new Float32Array(totalVertices * 3) : null;
    const uvs = has.uvs ? new Float32Array(totalVertices * 2) : null;
    const uv2s = has.uv2s ? new Float32Array(totalVertices * 2) : null;
    const colors = has.colors ? new Float32Array(totalVertices * 4) : null;
    const matricesIndices = has.matricesIndices ? new Float32Array(totalVertices * 4) : null;
    const matricesWeights = has.matricesWeights ? new Float32Array(totalVertices * 4) : null;
    const indices = new Uint32Array(totalIndices);

    let vertexOffset = 0;
    let indexOffset = 0;

    const vec3tmp1 = new BABYLON.Vector3();
    const vec3tmp2 = new BABYLON.Vector3();

    for (const mesh of validMeshes) {
        const wm = mesh.computeWorldMatrix(true);
        const vertCount = mesh.getTotalVertices();

        const pos = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        const nor = has.normals ? mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind) : null;
        const uv = has.uvs ? mesh.getVerticesData(BABYLON.VertexBuffer.UVKind) : null;
        const uv2 = has.uv2s ? mesh.getVerticesData(BABYLON.VertexBuffer.UV2Kind) : null;
        const col = has.colors ? mesh.getVerticesData(BABYLON.VertexBuffer.ColorKind) : null;
        const matInd = has.matricesIndices ? mesh.getVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind) : null;
        const matWgt = has.matricesWeights ? mesh.getVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind) : null;
        const ind = mesh.getIndices();

        disposeSource && mesh.dispose();

        if (pos) {
            const posOffset = vertexOffset * 3;
            for (let i = 0; i < vertCount; i++) {
                const i3 = i * 3;
                vec3tmp1.set(pos[i3], pos[i3 + 1], pos[i3 + 2]);
                BABYLON.Vector3.TransformCoordinatesToRef(vec3tmp1, wm, vec3tmp2);
                
                const targetIndex = posOffset + i3;
                positions[targetIndex] = vec3tmp2.x;
                positions[targetIndex + 1] = vec3tmp2.y;
                positions[targetIndex + 2] = vec3tmp2.z;
            }
        }

        if (nor && normals) {
            const norOffset = vertexOffset * 3;
            for (let i = 0; i < vertCount; i++) {
                const i3 = i * 3;
                vec3tmp1.set(nor[i3], nor[i3 + 1], nor[i3 + 2]);
                BABYLON.Vector3.TransformNormalToRef(vec3tmp1, wm, vec3tmp2);
                vec3tmp2.normalizeToRef(vec3tmp2);
                
                const targetIndex = norOffset + i3;
                normals[targetIndex] = vec3tmp2.x;
                normals[targetIndex + 1] = vec3tmp2.y;
                normals[targetIndex + 2] = vec3tmp2.z;
            }
        }

        if (uv && uvs) {
            uvs.set(uv, vertexOffset * 2);
        }

        if (uv2 && uv2s) {
            uv2s.set(uv2, vertexOffset * 2);
        }

        if (col && colors) {
            colors.set(col, vertexOffset * 4);
        }

        if (matInd && matricesIndices) {
            matricesIndices.set(matInd, vertexOffset * 4);
        }

        if (matWgt && matricesWeights) {
            matricesWeights.set(matWgt, vertexOffset * 4);
        }

        if (ind) {
            for (let i = 0; i < ind.length; i++) {
                indices[indexOffset + i] = ind[i] + vertexOffset;
            }
            indexOffset += ind.length;
        }

        vertexOffset += vertCount;
    }
    
    const vd = new BABYLON.VertexData();
    vd.positions = positions;
    if (normals) vd.normals = normals;
    if (uvs) vd.uvs = uvs;
    if (uv2s) vd.uv2s = uv2s;
    if (colors) vd.colors = colors;
    if (matricesIndices) vd.matricesIndices = matricesIndices;
    if (matricesWeights) vd.matricesWeights = matricesWeights;
    vd.indices = indices;

    const merged = new BABYLON.Mesh("merged");
    vd.applyToMesh(merged);
    
    return merged;
}
```

## Merging Meshes with Constructive Solid Geometry

You can construct complex meshes by using `subtract`, `intersect`, and `add` methods of the [CSG2](/typedoc/classes/babylon.csg2) class.

Complete example:
<Playground id="#0MDAYA" title="Complete CSG2 example" description="Showcase of subtract, intersect and add"/>

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

### Using CSG2

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
