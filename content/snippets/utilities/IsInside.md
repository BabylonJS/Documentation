---
title: Check When a Point is Inside a Mesh
image: 
description: Helpful code snippet for checking when a point is inside of a mesh in Babylon.js.
keywords: babylon.js, tools, resources, utilities, inside
further-reading:
    - title: How To Create Points on a Mesh Surface
      url: /snippets/SurfaceMeshPoints
    - title: How To Create Points Inside a Mesh
	  url: /snippets/innerMeshPoints
video-overview:
video-content:
---

## How To Check When Point is Inside a Mesh

This mesh method takes a Vector3 point and checks if it inside the mesh.

## Design Outline

1. Check if point inside or outside of bounding box, when inside continue with following checks;
2. Cast a ray from the point in the positive and negative x directions;
3. When there is a hit, move forward from hit point a very small amount along ray direction and recast ray from new point;
4. Count hits, when zero or an odd number of hits then point is inside mesh and for a even number of hits > 0 non zero then point is outside of mesh. 

## Design Method

1. Check bounding box;

```javascript
var boundInfo = this.getBoundingInfo();
var max = boundInfo.maximum;
var min = boundInfo.minimum;
if(point.x < min.x || point.x > max.x) {
	return false;
}
if(point.y < min.y || point.y > max.y) {
	return false;
}
if(point.z < min.z || point.z > max.z) {
	return false;
}
```

2. Use the diameter of the mesh's bounding sphere as the distance to cast the ray

```javascript
var diameter = 2 * boundInfo.boundingSphere.radius;
ray = new BABYLON.Ray(point, direction, diameter);
```

3. Set hit count to zero, while hits occurring increment hit count

```javascript
var hitCount = 0;
var pickInfo = ray.intersectsMesh(this);
while (pickInfo.hit) {	
	hitCount++;
	pickInfo.pickedPoint.addToRef(direction.scale(0.00000001), point); //move point a small amout in ray direction
	ray.origin  = point;
	pickInfo = ray.intersectsMesh(this);
}
```

4.  Count hits.

```javascript
if((hitCount % 2) === 1) {
	var pointFound = true;
}
else if ((hitCount % 2) === 0 && hitCount > 0) {
	var pointFound = true;
}

return pointFound;
```

## The Whole Function

Returns true if point is inside mesh, false otherwise.

```javascript
BABYLON.Mesh.prototype.pointIsInside = function (point) {    
	var boundInfo = this.getBoundingInfo();
	var max = boundInfo.maximum;
	var min = boundInfo.minimum;
	var diameter = 2 * boundInfo.boundingSphere.radius;
	if(point.x < min.x || point.x > max.x) {
		return false;
	}
	if(point.y < min.y || point.y > max.y) {
		return false;
	}
	if(point.z < min.z || point.z > max.z) {
		return false;
	}

	var pointFound = false;
	var d = 0;
	var hitCount = 0;
	var gap = 0;
	var distance = 0;
	var ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Axis.X, diameter);;
	var pickInfo;
	var direction = point.clone();
    var refPoint = point.clone();

	
	hitCount = 0;
	ray.origin = refPoint;
    ray.direction = direction;
    ray.distance = diameter;		
	pickInfo = ray.intersectsMesh(this);
	while (pickInfo.hit) {	
		hitCount++;
		pickInfo.pickedPoint.addToRef(direction.scale(0.00000001), refPoint);
		ray.origin  = refPoint;
		pickInfo = ray.intersectsMesh(this);
	}	
	if((hitCount % 2) === 1) {
		pointFound = true;
	}
	
	return pointFound;
};
```

## Playground Example

Generate random points in a volume around a twelve pointed star mesh. Place a sphere at each point and turn it red when inside the star.

<Playground id="#XJEG9A#4" title="Twelve Pointed Star" description="Twelve Pointed Star" image=""/>