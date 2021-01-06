---
title: Mesh Surface Area
image: 
description: Helpful code snippet for finding the surface area of a mesh in Babylon.js.
keywords: babylon.js, tools, resources, utilities, area
further-reading:
video-overview:
video-content:
---

## Surface Area Of a Mesh

This functions will together find the surface area of a mesh.

```javascript
var surfaceArea = function(mesh) {
    if (!mesh) {
        return 0.0;
    }
    var ar = 0.0;
    
    var indices = mesh.getIndices();
    var nbFaces = indices.length / 3;
    
    for (var i = 0; i < nbFaces; i++) {
        ar = ar + facetArea(mesh, i);
    }
    return ar;
};

var facetArea = function(mesh, faceId) {
    if(!mesh) {
        return 0.0;
    }
    var indices = mesh.getIndices();
    if(faceId < 0 || faceId > nbFaces) {
        return 0.0;
    }
    var nbFaces = indices.length / 3;
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var v1x = 0.0;
    var v1y = 0.0;
    var v1z = 0.0;
    var v2x = 0.0;
    var v2y = 0.0;
    var v2z = 0.0;
    var crossx = 0.0;
    var crossy = 0.0;
    var crossz = 0.0;
    var ar = 0.0;
    var i1 = 0;
    var i2 = 0;
    var i3 = 0;

    i1 = indices[faceId * 3];
    i2 = indices[faceId * 3 + 1];
    i3 = indices[faceId * 3 + 2];
    v1x = positions[i1 * 3] - positions[i2 * 3];
    v1y = positions[i1 * 3 + 1] - positions[i2 * 3 + 1];
    v1z = positions[i1 * 3 + 2] - positions[i2 * 3 + 2];
    v2x = positions[i3 * 3] - positions[i2 * 3];
    v2y = positions[i3 * 3 + 1] - positions[i2 * 3 + 1];
    v2z = positions[i3 * 3 + 2] - positions[i2 * 3 + 2];
    crossx = v1y * v2z - v1z * v2y;
    crossy = v1z * v2x - v1x * v2z;
    crossz = v1x * v2y - v1y * v2x; 

    return Math.sqrt(crossx * crossx + crossy * crossy + crossz * crossz) * 0.5;
}
```
The function surfaceArea has been written so that you can use the function facetArea to find the area of an individual facet should you wish to.

Run the following playgrounds directly and view the results in the console.

<Playground id="#3VV5IV" title="Surface Area of a Box" description="Simple example of how to get the surface area of a box."/>
<Playground id="#3VV5IV#2" title="Surface Area of a Sphere" description="Simple example of how to get the surface area of a sphere."/>


**NOTE** For double sided meshes the surface area will be the sum of the exterior and interior areas.