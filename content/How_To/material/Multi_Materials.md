---
title: Multi-Materials
image: 
description: Learn how to use Babylon.js Multi-Materials.
keywords: diving deeper, materials, multi material
further-reading:
video-overview:
video-content:
---

A multi-material is used to apply different materials to different parts of the same object as you can see below

![Multi Material Sphere](/img/how_to/Materials/multi.png)


To be able to define a multi-materials you first have to define some standard materials:

```javascript
var material0 = new BABYLON.StandardMaterial("mat0", scene);
material0.diffuseColor = new BABYLON.Color3(1, 0, 0);
material0.bumpTexture = new BABYLON.Texture("normalMap.jpg", scene);<br/>
    
var material1 = new BABYLON.StandardMaterial("mat1", scene);
material1.diffuseColor = new BABYLON.Color3(0, 0, 1);
  
var material2 = new BABYLON.StandardMaterial("mat2", scene);
material2.emissiveColor = new BABYLON.Color3(0.4, 0, 0.4);</pre>
```

Then you can create a multi-material in order to gather them all:

```javascript
var multimat = new BABYLON.MultiMaterial("multi", scene);
multimat.subMaterials.push(material0);
multimat.subMaterials.push(material1);
multimat.subMaterials.push(material2);
```

You are now able to affect the multi-material to your mesh:

```javascript
var sphere = BABYLON.Mesh.CreateSphere("Sphere0", 16, 3, scene);
sphere.material = multimat;
```

But if you do that, you will see that the sphere will only use the first submaterial (the red bumped one). This is because by default a mesh is is designed to use only one material.

You can specify which part of the mesh uses a specific material by using the _subMeshes_ property. By default, every mesh comes with only one submesh that cover the entire mesh.

To define multiple submeshes, you just have to use this code:

```javascript
sphere.subMeshes = [];
var verticesCount = sphere.getTotalVertices();

new BABYLON.SubMesh(0, 0, verticesCount, 0, 900, sphere);
new BABYLON.SubMesh(1, 0, verticesCount, 900, 900, sphere);
new BABYLON.SubMesh(2, 0, verticesCount, 1800, 2088, sphere);
```

In this case, you will have 3 parts:

* One starting from index 0 to index 900
* One starting from index 900 to index 1800
* One starting from index 1800 to index 3880


A submesh is defined with:

* The index of the material to use (this index is used to find the correct material Inside the _subMaterials_ collection of a multi-material)
* The index of the first vertex and the count of vertices used (To optimize things for collisions for instance)
* Index of the first indice to use and indices count
* The parent mesh

So with the code above, you can use the first material on the top part of the sphere, the second material on the middle part and the last material on the bottom part of the sphere.

<Playground id="#2Q4S2S#268" title="Sphere With Multi-Material" description="Simple example of applying a multi-material to a sphere." image="/img/playgroundsAndNMEs/features/divingDeeperMultiMaterial1.jpg"/>

## With Merged Meshes

When you [merge meshes](/features/divingDeeper/mesh/mergeMeshes) together setting the final parameter *multiMultiMaterial* to true the subMeshes array is automatically created with all merging meshes' subMeshes. Each subMesh's material is also included in the resulting mesh's new multiMaterial. This feature ignores the parameter (`subdivideWithSubMeshes`).

<Playground id="#INZ0Z0#59" title="Multi-Material With Merged Meshes 1" description="Simple example of applying a multi-material to merged meshes." image="/img/playgroundsAndNMEs/features/divingDeeperMultiMaterial2.jpg"/>

When you [merge meshes](/features/divingDeeper/mesh/mergeMeshes) together with the second to last parameter (`subdivideWithSubMeshes`) set to true, but the last parameter (`multiMultiMaterial`) left as false, the subMeshes array is automatically created with each merging mesh as a submesh of the new mesh. You must assign the correct subMesh index to the correct material index.

When you form `mergedMesh` by merging meshes in this array order [mesh1, mesh2], and the multiMaterials subMaterials array contains materials in the order [mat1, mat2] then for the subMesh from `mesh2` to have material `mat2` you need to set

```javascript
mergedMesh.subMeshes[1].materialIndex = 1;
```

<Playground id="#INZ0Z0#6" title="Multi-Material With Merged Meshes 2" description="Simple example of applying a multi-material to merged meshes." image="/img/playgroundsAndNMEs/features/divingDeeperMultiMaterial2.jpg"/>