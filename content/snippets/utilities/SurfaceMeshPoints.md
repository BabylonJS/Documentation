---
title: Draw Points on a Mesh Surface
image: 
description: Helpful code snippet for drawing points on a mesh surface in Babylon.js.
keywords: babylon.js, tools, resources, utilities, camera
further-reading:
    - title: How To Create Points Inside a Mesh
      url: /snippets/innerMeshPoints
    - title: How To Check When Point is Inside a Mesh
      url: /snippets/isInside
video-overview:
video-content:
---

## How To Create Points on the Mesh Surface

This utility enables you to create and store Vector3 points each of which is randomly positioned uniformly on the surface of a mesh.

## Design Outline.

1. Take a random triangular facet belonging to the mesh;
2. Calculate the area of the triangle;
3. Calculate the number of random points to place on the facet using density * area;
4. Choose random points inside this triangle;


## Design Method.

For the mesh get the vertex positions and indices using

```javascript
var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
var indices = mesh.getIndices();
```

For each facet, F,  in turn obtain the three facet vertex positions, vertex0, vertex1 and vertex2 using the positions array. From these construct vectors, <u>vec0</u>, <u>vec1</u> and <u>vec2</u>, along each side of the triangle. Using the lengths of the sides calculate the area of the triangle. For a value 0  &le; &lambda; &le; 1,&nbsp; &lambda;<u>vec0</u> and &lambda;<u>vec1</u> will form two sides of a triangle similar to the facet. So when also given a value 0  &le; &mu; &le; 1,&nbsp; &lambda;<u>vec0</u> and &lambda;&mu;<u>vec1</u> will give a point inside the facet. The range of values for &lambda; and &mu; will determine all points within the facet. Hence random values for  &lambda; and &mu; will give random points on the facet plane.

![Find point](/img/samples/manypoints.jpg)

```javascript
lamda = BABYLON.Scalar.RandomRange(0, 1);	
mu = BABYLON.Scalar.RandomRange(0, 1);
facetPoint = vertex0.add(vec0.scale(lambda)).add(vec1.scale(lambda * mu));
```

Repeat for density * area random points for each facet.

## The Whole function

Set the density for the points and generate the points and store and return them in an array.

```javascript
BABYLON.Mesh.prototype.createSurfacePoints = function(pointDensity) {
	var positions = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	var indices = this.getIndices();
	
	var point = BABYLON.Vector3.Zero();
	var points = [];
	
	var randX = 0;
	var randY = 0;
	var randZ = 0
	
	var index = 0;
	var id0 = 0;
	var id1 = 0; 
	var id2 = 0;
	var v0X = 0;
	var v0Y = 0;
	var v0Z = 0;
	var v1X = 0;
	var v1Y = 0
	var v1Z = 0;
	var v2X = 0;
	var v2Y = 0;
	var v2Z = 0;
	var vertex0 = BABYLON.Vector3.Zero();
	var vertex1 = BABYLON.Vector3.Zero();
	var vertex2 = BABYLON.Vector3.Zero();
	var vec0 = BABYLON.Vector3.Zero();
	var vec1 = BABYLON.Vector3.Zero();
    var vec2 = BABYLON.Vector3.Zero();

    var a = 0; //length of side of triangle
    var b = 0; //length of side of triangle
    var c = 0; //length of side of triangle
    var p = 0; //perimeter of triangle
    var area = 0;
    var nbPoints = 0; //nbPoints per triangle
		
	var lamda = 0;	
	var mu = 0;

	for(var index = 0; index <indices.length / 3; index++) {  				
		id0 = indices[3 * index];
		id1 = indices[3 * index + 1]; 
		id2 = indices[3 * index + 2];        
		v0X = positions[3 * id0];
		v0Y = positions[3 * id0 + 1];
		v0Z = positions[3 * id0 + 2];
		v1X = positions[3 * id1];
		v1Y = positions[3 * id1 + 1];
		v1Z = positions[3 * id1 + 2];
		v2X = positions[3 * id2];
		v2Y = positions[3 * id2 + 1];
		v2Z = positions[3 * id2 + 2];
		vertex0.set(v0X, v0Y, v0Z);
		vertex1.set(v1X, v1Y, v1Z);
		vertex2.set(v2X, v2Y, v2Z);
		vertex1.subtractToRef(vertex0, vec0);
		vertex2.subtractToRef(vertex1, vec1);
        vertex2.subtractToRef(vertex0, vec2);
        a = vec0.length();
        b = vec1.length();
        c = vec2.length();
        p = (a + b + c) / 2;        
        area = Math.sqrt(p * (p - a) * (p - b) * (p - c));
        nbPoints = Math.round(pointDensity * area);
        for (var i = 0; i < nbPoints; i++) {
            //form a point inside the facet v0, v1, v2;
            lamda = BABYLON.Scalar.RandomRange(0, 1);	
		    mu = BABYLON.Scalar.RandomRange(0, 1);
		    facetPoint = vertex0.add(vec0.scale(lamda)).add(vec1.scale(lamda * mu));
            points.push(facetPoint);
        }	
	}
	return points;
}
```

<Playground id="#NFSGWT#2" title="Drawing Points on a Mesh Surface" description="" image=""/>