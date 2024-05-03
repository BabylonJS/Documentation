---
title: Making A Frame
image: 
description: Helpful code snippet for a frame in Babylon.js.
keywords: babylon.js, tools, resources, utilities, frame
further-reading:
video-overview:
video-content:
---

# Making a Frame

## Using Frame Maker

var frame = frameMaker("frame", options, scene);

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3 points forming outer edge of the frame, z must be 0, **REQUIRED**
profile|_(Vector3[])_  array of Vector3 points forming the frame profile, z must be 0, **REQUIRED**

The profile or cross section of the frame, has to be a consecutive sequence of points in the XoY giving the corners of the profile. The left most point or points will follow the path and form the outer edge of the frame. The following profile is a square with a rebated corner.

```javascript
var profilePoints = [
	new BABYLON.Vector3(-15, 15, 0),
	new BABYLON.Vector3(-15, -15, 0),
	new BABYLON.Vector3(15, -15, 0),
	new BABYLON.Vector3(15, 10, 0),
	new BABYLON.Vector3(10, 10, 0),
	new BABYLON.Vector3(10, 15, 0)
];
```

The path defines the outer edge of the frame and again is given as points in the XoY plane. The following example produces a rectangular frame.

```javascript
path  = [
    new BABYLON.Vector3(-150, -100, 0),
    new BABYLON.Vector3(150, -100, 0),
    new BABYLON.Vector3(150, 100, 0),
    new BABYLON.Vector3(-150, 100, 0)
]; 
```

The direction of the path (clockwise or counter-clockwise) determines the orientation of the profile around the frame. If it turns out you need to flip the profile then reverse the path array before passing to frameMaker.

```javascript
path.reverse();
```

### Playground Examples

<Playground id="#ZGVYNB" title="Window With Rebate" description="Window With Rebate."/>
<Playground id="#ZGVYNB#1" title="Triangular Frame with L Shape Profile" description="Triangular Frame with L Shape Profile."/>
<Playground id="#ZGVYNB#2" title="Oval Frame" description="Oval Frame"/>

## Code

```javascript
var frameMaker = function(name, options, scene) {	

	var path = options.path;
	var profile = options.profile;
	
	var originX = Number.MAX_VALUE;
	
	for(let m = 0; m < profile.length; m++) {
		originX = Math.min(originX, profile[m].x);
	}

	var innerData = [];
        var outerData = [];
	var angle = 0;
	var extrusion = 0;
	var width = 0;
	var cornerProfile = [];
	
	var nbPoints = path.length;
	var line = BABYLON.Vector3.Zero();
	var nextLine = BABYLON.Vector3.Zero();
	path[1].subtractToRef(path[0], line);
	path[2].subtractToRef(path[1], nextLine);    
	
	for(let p = 0; p < nbPoints; p++) {    
		angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
		direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;                
		lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
		line.normalize();
		extrusionLength = line.length();
		cornerProfile[(p + 1) % nbPoints] = [];
		//local profile
		for(m = 0; m < profile.length; m++) {
			width = profile[m].x - originX;
			cornerProfile[(p + 1) % nbPoints].push(path[(p + 1) % nbPoints].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2))));			
		}   
		
		line = nextLine.clone();        
		path[(p + 3) % nbPoints].subtractToRef(path[(p + 2) % nbPoints], nextLine);    
	}
	
	var frame = [];
	var extrusionPaths = []
	
	for(let p = 0; p < nbPoints; p++) {
		extrusionPaths = [];
		for(let m = 0; m < profile.length; m++) {
			extrusionPaths[m] = [];
			extrusionPaths[m].push(new BABYLON.Vector3(cornerProfile[p][m].x, cornerProfile[p][m].y, profile[m].y));
			extrusionPaths[m].push(new BABYLON.Vector3(cornerProfile[(p + 1) % nbPoints][m].x, cornerProfile[(p + 1) % nbPoints][m].y, profile[m].y));
		}
		
		frame[p] = BABYLON.MeshBuilder.CreateRibbon("frameLeft", {pathArray: extrusionPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true, closeArray: true}, scene);
	}
	
	return BABYLON.Mesh.MergeMeshes(frame, true).convertToFlatShadedMesh();
}

```
