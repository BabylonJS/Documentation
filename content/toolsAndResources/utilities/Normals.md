---
title: Display Vertex Normals
image:
description: Helpful code snippet for displaying vertex normals in Babylon.js.
keywords: babylon.js, tools, resources, utilities, vertex normals, normals
further-reading:
video-overview:
video-content:
---

## Show Mesh Vertex Normals

This snippet allows you to add lines showing the normals for each vertex of a mesh. The colour and size of the lines can be set.

```javascript
function showNormals(mesh, size, color, sc) {
  var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
  var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  color = color || BABYLON.Color3.White();
  sc = sc || scene;
  size = size || 1;

  var lines = [];
  for (var i = 0; i < normals.length; i += 3) {
    var v1 = BABYLON.Vector3.FromArray(positions, i);
    var v2 = v1.add(BABYLON.Vector3.FromArray(normals, i).scaleInPlace(size));
    lines.push([v1.add(mesh.position), v2.add(mesh.position)]);
  }
  var normalLines = BABYLON.MeshBuilder.CreateLineSystem("normalLines", { lines: lines }, sc);
  normalLines.color = color;
  return normalLines;
}
```

## Playground

<Playground id="#1ENDNT" title="Displaying Vertex Normals" description=""/>
