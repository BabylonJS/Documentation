---
title: Deconstruct A Mesh
image: 
description: Helpful code snippet for deconstructing a mesh in Babylon.js.
keywords: babylon.js, tools, resources, utilities, deconstruct
further-reading:
video-overview:
video-content:
---

## Extract Submeshes as Meshes
This snippet takes a mesh and splits its subMeshes into individual meshes. Returns array of new meshes.

```javascript
function deconstructMesh(mesh) {
    if (mesh.subMeshes.length > 1) {
        var otherVertexData = BABYLON.VertexData.ExtractFromMesh(mesh, true, true);
        var indices = otherVertexData.indices;
        var normals = otherVertexData.normals;
        var positions = otherVertexData.positions;
        var uvs = otherVertexData.uvs;
        var newMeshArray = [];
        for (let index = 0; index < mesh.subMeshes.length; index++) {
            var newVertexData = new BABYLON.VertexData();
            
            var newI = indices.slice(mesh.subMeshes[index].indexStart, mesh.subMeshes[index].indexStart+mesh.subMeshes[index].indexCount);
            var newN = normals.slice(mesh.subMeshes[index].verticesStart * 3, mesh.subMeshes[index].verticesStart * 3 + mesh.subMeshes[index].verticesCount * 3);
            var newP = positions.slice(mesh.subMeshes[index].verticesStart * 3, mesh.subMeshes[index].verticesStart * 3 + mesh.subMeshes[index].verticesCount * 3);
            var newU = uvs.slice(mesh.subMeshes[index].verticesStart * 2, mesh.subMeshes[index].verticesStart * 2 + mesh.subMeshes[index].verticesCount * 2);
            for (let subIndex = 0; subIndex < newI.length; subIndex++) {
                newI[subIndex] = newI[subIndex] - mesh.subMeshes[index].verticesStart;
            }

            newVertexData.indices = newI;
            newVertexData.normals = newN;
            newVertexData.positions = newP;
            newVertexData.uvs = newU;
            
            var meshSubclass = new BABYLON.Mesh(mesh.name+'-'+index, scene);
            
            newVertexData.applyToMesh(meshSubclass);
                    
            newMeshArray.push(meshSubclass);
        }
        return newMeshArray;
    } else {
        return [mesh];
    }
}
```