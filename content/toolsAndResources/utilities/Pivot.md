---
title: Rotate and Scale About a Point
image: 
description: Helpful code snippet for rotating and scaling about a point in Babylon.js.
keywords: babylon.js, tools, resources, utilities, pivot
further-reading:
video-overview:
video-content:
---

## Rotating and Enlarging Relative to a Centre.
The following two code snippets give the opportunity to place a centre of rotation or enlargement, or pivot, at any time and have a mesh rotate or enlarge relative to that centre.


## Rotate
 
```javascript
BABYLON.Mesh.prototype.rotateAroundPivot = function(pivotPoint, axis, angle) {
	if(!this._rotationQuaternion) {
		this._rq = BABYLON.Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
	}
	else this._rq = this.rotationQuaternion		
	var _p = new BABYLON.Quaternion(this.position.x - pivotPoint.x, this.position.y - pivotPoint.y, this.position.z - pivotPoint.z, 0);
	axis.normalize();
	var _q = BABYLON.Quaternion.RotationAxis(axis,angle);  //form quaternion rotation		
	var _qinv = BABYLON.Quaternion.Inverse(_q);	
	var _pdash = _q.multiply(_p).multiply(_qinv);
	this.position = new BABYLON.Vector3(pivotPoint.x + _pdash.x, pivotPoint.y + _pdash.y, pivotPoint.z + _pdash.z);
	this.rotationQuaternion = _q.multiply(this._rq);
}

mesh.rotateAroundPivot(new BABYLON.Vector3(1, 2, -1), new BABYLON.Axis.Y, Math.PI/4);
```

The parameters are the position of the pivot (centre of rotation) as a Vector3, axis of rotation as a Vector3 and an angle of rotation a number in radians.

Succesive rotations are accumulative.

## Enlargement

```javascript
BABYLON.Mesh.prototype.scaleFromPivot = function(pivotPoint, sx, sy, sz) {
	var _sx = sx / this.scaling.x;
	var _sy = sy / this.scaling.y;
	var _sz = sz / this.scaling.z;
	this.scaling = new BABYLON.Vector3(sx, sy, sz);	
	this.position = new BABYLON.Vector3(pivotPoint.x + _sx * (this.position.x - pivotPoint.x), pivotPoint.y + _sy * (this.position.y - pivotPoint.y), pivotPoint.z + _sz * (this.position.z - pivotPoint.z));
}

mesh.scaleFromPivotnew BABYLON.Vector3(1, 2, -1), 2, 6, 0.5);
```

The parameters are the position of the pivot (centre of enlargemen) as a Vector3, scaling in the x, y and z directions as numbers.

## Playground

<Playground id="#1MKHR9#254" title="Rotating and Enlarging Relative to a Centre" description=""/>
