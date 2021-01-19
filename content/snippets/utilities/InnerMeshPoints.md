---
title: Create Points Inside A Mesh
image: 
description: Helpful code snippet for creating points inside of a mesh in Babylon.js.
keywords: babylon.js, tools, resources, utilities, mesh points, add
further-reading:
    - title: How To Create Points on a Mesh Surface
      url: /toolsAndResources/utilities/SurfaceMeshPoints
    - title: How To Check When Point is Inside a Mesh
      url: /toolsAndResources/utilities/IsInside
video-overview:
video-content:
---

## How To Create Points Inside a Mesh

This utility enables you to create and store Vector3 points each of which is randomly positioned inside a given mesh.

## Design Outline.

1. Take a random triangular facet belonging to the mesh;
2. Choose a random point inside this triangle;
3. For the facet construct an inward pointing random vector;
4. Using that point as ray origin and the vector as ray direction find the hit point of the ray on the mesh;
5. Determine a random point on the line segment joining the origin point to the hit point.

## Design Method.

1. For the mesh get the vertex positions and indices using

```javascript
var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
var indices = mesh.getIndices();
```
Select a facet, F,  at random.

2. Obtain the three facet vertex positions, vertex0, vertex1 and vertex2 using the positions array. From these construct vectors, <u>vec0</u> and <u>vec1</u>, along two sides of the triangle one following the other. For a value 0  &le; &lambda; &le; 1,&nbsp; &lambda;<u>vec0</u> and &lambda;<u>vec1</u> will form two sides of a triangle similar to the facet. So when also given a value 0  &le; &mu; &le; 1,&nbsp; &lambda;<u>vec0</u> and &lambda;&mu;<u>vec1</u> will give a point inside the facet. The range of values for &lambda; and &mu; will determine all points within the facet. Hence random values for  &lambda; and &mu; will give random points on the facet plane.

![Find point](/img/samples/manypoints.jpg)

```javascript
lamda = BABYLON.Scalar.RandomRange(0, 1);	
mu = BABYLON.Scalar.RandomRange(0, 1);
facetPoint = vertex0.add(vec0.scale(lambda)).add(vec1.scale(lambda * mu));
```

3. In order to generate a vector pointing inwards get the normal vector of the facet (which points outward), reverse it to get the vector <u>n</u>, use <u>t</u> = <u>vec0</u> as one vector in the plane and, <u>b</u>, the cross product of the normal and <u>vec0</u> as the other. For an angle 0 &le; &theta; &le; 2&pi;, &nbsp;&nbsp; <u>f</u> = <u>t</u>cos(&theta;) + <u>b</u>sin(&theta;) will give a vector in the facet plane. For an angle 0 &le; &phi; &le; &pi;, &nbsp;&nbsp;  <u>f</u>cos(&phi;) + <u>n</u>sin(&phi;) will give a vector whose direction is towards the inside of the mesh. 

```javascript
mesh.updateFacetData(); // needed to use getFacetNormal

norm = mesh.getFacetNormal(index).normalize().scale(-1);	
tang = vec0.clone().normalize();
biNorm = BABYLON.Vector3.Cross(norm, tang);
angle = BABYLON.Scalar.RandomRange(0, 2 * Math.PI);
facetPlaneVec = tang.scale(Math.cos(angle)).add(biNorm.scale(Math.sin(angle)));
angle = BABYLON.Scalar.RandomRange(0.1, Math.PI);
direction = facetPlaneVec.scale(Math.cos(angle)).add(norm.scale(Math.sin(angle)));
```

4. Construct a ray using the facet point, direction and a distance equal to the diameter of the mesh's bounding sphere to ensure it is long enough to hit another facet of the mesh and find the hit point.

```javascript
var boundInfo = mesh.getBoundingInfo();
var diameter = 2 * boundInfo.boundingSphere.radius;

var ray = new BABYLON.Ray(facetPoint, direction, diameter);
var hitPoint = ray.intersectsMesh(mesh).pickedPoint;
```

5. Take some random fraction, 0 *le; r &le; 1, of the distance between the hit point and facet point and use this to determine a position of a point along this line using facetPoint + r(hitPoint - facetPoint) to determine a point within the mesh.

```javascript
var ray = new BABYLON.Ray(facetPoint, direction, diameter);
var pickInfo = ray.intersectsMesh(this);	
	if (pickInfo.hit) {			
		var distance = pickInfo.pickedPoint.subtract(facetPoint).length();
		var gap = BABYLON.Scalar.RandomRange(0, 1) * distance;
		var point = facetPoint.add(direction.scale(gap));
	}
	else { // just in the rare case the facet point randomly chosen is on the adjoining axis of two concave meeting facets
			point.set(0, 0, 0);
	}
```

## The Whole function

Set how many inside points to generate and store and return them in an array.

```javascript
BABYLON.Mesh.prototype.createInnerPoints = function(pointsNb) {
	var boundInfo = this.getBoundingInfo();
	var diameter = 2 * boundInfo.boundingSphere.radius;
	this.updateFacetData();

	var positions = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	var indices = this.getIndices();
	
	var point = BABYLON.Vector3.Zero();
	var points = [];
	var directions = [];
	
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
		
	var lamda = 0;	
	var mu = 0;
	var norm = BABYLON.Vector3.Zero();
	var tang = BABYLON.Vector3.Zero();
	var biNorm = BABYLON.Vector3.Zero();
	var angle = 0;
	var facetPlaneVec = BABYLON.Vector3.Zero();

	var gap = 0;
	var distance = 0;
	var ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.AxisX);
	var pickInfo;
	var facetPoint = BABYLON.Vector3.Zero();
	var direction = BABYLON.Vector3.Zero();
	var particleDirection = BABYLON.Vector3.Zero();
	var particleDistance = 0;
	var testPoint = BABYLON.Vector3.Zero();

	for(var p = 0; p <pointsNb; p++) {			
		index = Math.floor(BABYLON.Scalar.RandomRange(0, indices.length / 3));		
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
		
		norm = this.getFacetNormal(index).normalize().scale(-1);	
		tang = vec0.clone().normalize();
		biNorm = BABYLON.Vector3.Cross(norm, tang);
		angle = BABYLON.Scalar.RandomRange(0, 2 * Math.PI);
		facetPlaneVec = tang.scale(Math.cos(angle)).add(biNorm.scale(Math.sin(angle)));
		angle = BABYLON.Scalar.RandomRange(0.1, Math.PI);
		direction = facetPlaneVec.scale(Math.cos(angle)).add(norm.scale(Math.sin(angle)));
		
		//form a point inside the facet v0, v1, v2;
		lamda = BABYLON.Scalar.RandomRange(0, 1);	
		mu = BABYLON.Scalar.RandomRange(0, 1);
		facetPoint = vertex0.add(vec0.scale(lamda)).add(vec1.scale(lamda * mu));

		gap = 0;
		distance = 0;
		pickInfo;	
		ray.origin = facetPoint;
		ray.direction = direction;
		ray.length = diameter;	
		pickInfo = ray.intersectsMesh(this);	
		if (pickInfo.hit) {			
			distance = pickInfo.pickedPoint.subtract(facetPoint).length();
			gap = BABYLON.Scalar.RandomRange(0, 1) * distance;
			point = facetPoint.add(direction.scale(gap));
		}
		else {
			point.set(0, 0, 0);
		}
		points.push(point);	
	}
	
	return points;
}
```

<Playground id="#2K3T61#8" title="Points Inside a Twelve Pointed Star" description="Points Inside a Twelve Pointed Star"/>

## Examples of Use 

<Playground id="#2K3T61#2" title="Using SPS" description="Using SPS"/>
<Playground id="#2K3T61#7" title="Using Particles" description="Using Particles"/>