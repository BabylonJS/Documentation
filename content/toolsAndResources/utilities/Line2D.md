---
title: Draw a Line With a Set Width
image: 
description: Helpful code snippet for drawing a line of a set width in Babylon.js.
keywords: babylon.js, tools, resources, utilities, line
further-reading:
video-overview:
video-content:
---

## Draw a Line of Given Width

Four versions of **Line2D** are given below followed by a suggestion for drawing a line in 3D. All Line2Ds can be textured but in only one (the second version) doe the texture follow the line direction.
In addition the code is adapted as **parallelLines** to produce lines parallel to a central line 

## Line in XoY Plane Formed from Central Path

```javascript
var line = line2D("line", options, scene);
```

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3 points forming the centre line of the line2D | **REQUIRED**
width|_(number)_ line width|1
closed|_(boolean)_ true if the first and last points are to be joined to form a polygon|false
standardUV|_(Color4[])_ false squeezes a texture image onto each line segment|true

Just copy the code below if you want to use it.

### Playground Examples

These examples use an orthographic camera giving a 2D view

<Playground id="#FA2H7X#3" title="Open Line" description="Open line example."/>
<Playground id="#FA2H7X#4" title="Closed Line" description="Closed line example."/>
<Playground id="#FA2H7X#5" title="Standard UV = True" description="Standard UV is true."/>
<Playground id="#FA2H7X#6" title="Standard UV = False" description="Standard UV is false."/>

### Line2D Code

```javascript
var line2D = function(name, options, scene) {

	//Arrays for vertex positions and indices
	var positions = [];
	var indices = [];
        var normals = [];

        var width = options.width / 2 || 0.5;
        var path = options.path;
	var closed = options.closed || false;
	if(options.standardUV === undefined) {
		standardUV = true;
	}
	else {
		standardUV = options.standardUV;
	}

	var interiorIndex;
	
	//Arrays to hold wall corner data 
	var innerBaseCorners = [];
	var outerBaseCorners = [];
	
	var outerData = [];
        var innerData = [];
	var angle = 0;
	
	var nbPoints = path.length;
	var line = BABYLON.Vector3.Zero();
	var nextLine = BABYLON.Vector3.Zero();
	path[1].subtractToRef(path[0], line);

	if(nbPoints > 2 && closed) {	
		path[2].subtractToRef(path[1], nextLine);    
		for(var p = 0; p < nbPoints; p++) {    
			angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
			direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;                
			lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
			line.normalize();
			innerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
			outerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));        
			line = nextLine.clone();        
			path[(p + 3) % nbPoints].subtractToRef(path[(p + 2) % nbPoints], nextLine);    
		}
	}
	else {
		lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
		line.normalize();		
		innerData[0] = path[0].subtract(lineNormal.scale(width));
		outerData[0] = path[0].add(lineNormal.scale(width));
	
		for(var p = 0; p < nbPoints - 2; p++) {	
			path[p + 2].subtractToRef(path[p + 1], nextLine);
			angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));			
			direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;			
			lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
			line.normalize();
			innerData[p + 1] = path[p + 1].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
			outerData[p + 1] = path[p + 1].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));		
			line = nextLine.clone();			
		}
		if(nbPoints > 2) {
			path[nbPoints - 1].subtractToRef(path[nbPoints - 2], line);
			lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
			line.normalize();		
			innerData[nbPoints - 1] = path[nbPoints - 1].subtract(lineNormal.scale(width));
			outerData[nbPoints - 1] = path[nbPoints - 1].add(lineNormal.scale(width));
		}
		else{
			innerData[1] = path[1].subtract(lineNormal.scale(width));
			outerData[1] = path[1].add(lineNormal.scale(width));
		}
	}
     
	var maxX = Number.MIN_VALUE;
	var minX = Number.MAX_VALUE;
	var maxY = Number.MIN_VALUE;
	var minY = Number.MAX_VALUE;
	
	for(var p = 0; p < nbPoints; p++) {
		positions.push(innerData[p].x, innerData[p].y, innerData[p].z);
		maxX = Math.max(innerData[p].x, maxX);
		minX = Math.min(innerData[p].x, minX);
		maxY = Math.max(innerData[p].y, maxY);
		minY = Math.min(innerData[p].y, minY);
	}

	for(var p = 0; p < nbPoints; p++) {
		positions.push(outerData[p].x, outerData[p].y, outerData[p].z);
		maxX = Math.max(innerData[p].x, maxX);
		minX = Math.min(innerData[p].x, minX);
		maxY = Math.max(innerData[p].y, maxY);
		minY = Math.min(innerData[p].y, minY);
	}

        for(var i = 0; i < nbPoints - 1; i++) {
            indices.push(i, i + 1, nbPoints + i + 1);
            indices.push(i, nbPoints + i + 1, nbPoints + i)
        }
	
	if(nbPoints > 2 && closed) {
		indices.push(nbPoints - 1, 0, nbPoints);
            indices.push(nbPoints - 1, nbPoints, 2 * nbPoints - 1)
	}

	var normals = [];
        var uvs =[];

	if(standardUV) {
		for(var p = 0; p < positions.length; p += 3) {
			uvs.push((positions[p] - minX)/(maxX - minX), (positions[p + 1] - minY)/(maxY - minY))
		}
	}
	else {
		var flip = 0;
		var p1 = 0;
		var p2 = 0;
		var p3 = 0;
		var v0 = innerData[0];
		var v1 = innerData[1].subtract(v0);
		var v2 = outerData[0].subtract(v0);
		var v3 = outerData[1].subtract(v0);
		var axis = v1.clone();
		axis.normalize();

		p1 = BABYLON.Vector3.Dot(axis,v1);
		p2 = BABYLON.Vector3.Dot(axis,v2);
		p3 = BABYLON.Vector3.Dot(axis,v3);
		var minX = Math.min(0, p1, p2, p3);
		var maxX = Math.max(0, p1, p2, p3);
		
		uvs[2 * indices[0]] = -minX/(maxX - minX);
		uvs[2 * indices[0] + 1] = 1;
		uvs[2 * indices[5]] = (p2 - minX)/(maxX - minX);
		uvs[2 * indices[5] + 1] = 0;
		
		uvs[2 * indices[1]] = (p1 - minX)/(maxX - minX);
		uvs[2 * indices[1] + 1] = 1;
		uvs[2 * indices[4]] = (p3 - minX)/(maxX - minX);
		uvs[2 * indices[4] + 1] = 0;
	
		for(var i = 6; i < indices.length; i +=6) {
		
			flip = (flip + 1) % 2;
			v0 = innerData[0];
			v1 = innerData[1].subtract(v0);
			v2 = outerData[0].subtract(v0);
			v3 = outerData[1].subtract(v0);
			axis = v1.clone();
			axis.normalize();

			p1 = BABYLON.Vector3.Dot(axis,v1);
			p2 = BABYLON.Vector3.Dot(axis,v2);
			p3 = BABYLON.Vector3.Dot(axis,v3);
			var minX = Math.min(0, p1, p2, p3);
			var maxX = Math.max(0, p1, p2, p3);
		
			uvs[2 * indices[i + 1]] = flip + Math.cos(flip * Math.PI) * (p1 - minX)/(maxX - minX);
			uvs[2 * indices[i + 1] + 1] = 1;
			uvs[2 * indices[i + 4]] = flip + Math.cos(flip * Math.PI) * (p3 - minX)/(maxX - minX);
			uvs[2 * indices[i + 4] + 1] = 0;
		}
	}
	
	BABYLON.VertexData.ComputeNormals(positions, indices, normals);
	BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, positions, indices, normals, uvs);  	
	console.log(uvs)		
	//Create a custom mesh  
	var customMesh = new BABYLON.Mesh(name, scene);

	//Create a vertexData object
	var vertexData = new BABYLON.VertexData();

	//Assign positions and indices to vertexData
	vertexData.positions = positions;
	vertexData.indices = indices;
	vertexData.normals = normals;
	vertexData.uvs = uvs;

	//Apply vertexData to custom mesh
	vertexData.applyToMesh(customMesh);
	
	return customMesh;
	
}
```

## Texture Follows Line in XoY Plane Formed from Central Path

```javascript
var line = line2D("line", options, scene);
```

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3 points forming the centre line of the line2D | **REQUIRED**
width|_(number)_ line width|1
closed|_(boolean)_ true if the first and last points are to be joined to form a polygon|false

Just copy the code below if you want to use it.

### Playground Examples

These examples use an orthographic camera giving a 2D view

<Playground id="#9MYFC2" title="Open Texture Line" description="Open line example."/>
<Playground id="#9MYFC2#1" title="Closed Texture Line" description="Closed line example."/>


### Texture Follow Line2D Code

```javascript
var createScene = function() {
  var scene = new BABYLON.Scene(engine);

	// Camera
    camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -10), this.scene);
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    var canvas = document.getElementById("renderCanvas");
    let ratio = canvas.width / canvas.height ;
    let zoom = 30;
    let width = zoom * ratio;
    camera.orthoTop = zoom;
    camera.orthoLeft = -width;
    camera.orthoRight = width;
    camera.orthoBottom = -zoom;

	var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
	
	
	var line2D = function(name, options, scene) {
	
		//Arrays for vertex positions and indices
		var positions = [];
		var indices = [];
        var normals = [];
        var uvs = [];

        var width = options.width / 2 || 0.5;
        var path = options.path;
		var closed = options.closed || false;
		if(options.standardUV === undefined) {
			standardUV = true;
		}
		else {
			standardUV = options.standardUV;
		}
	
		var angle = 0;
		
		var nbPoints = path.length;
		var line = BABYLON.Vector3.Zero();
		var nextLine = BABYLON.Vector3.Zero();

		if(nbPoints > 2 && closed) {
            path[0].subtractToRef(path[nbPoints - 1], line);	    
			for(var p = 0; p < nbPoints; p++) {
                path[(p + 1) % nbPoints].subtractToRef(path[p], nextLine);    
				angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
				direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;                
				lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
				line.normalize();
                const in0 = path[p].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
				const out0 = path[p].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));
				line = nextLine.clone();
                path[(p + 2) % nbPoints].subtractToRef(path[(p + 1) % nbPoints], nextLine);
                angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
				direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;                
				lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
				line.normalize();
                const in1 = path[(p + 1) % nbPoints].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
				const out1 = path[(p + 1) % nbPoints].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));        
				positions.push(in0.x, in0.y, in0.z, out0.x, out0.y, out0.z);
                positions.push(in1.x, in1.y, in1.z, out1.x, out1.y, out1.z);
                uvs.push(0, 0, 0, 1, 1, 0, 1, 1);
                indices.push(4 * p + 2, 4 * p + 3, 4 * p + 1, 4 * p + 2, 4 * p + 1, 4 * p);
                path[(p + 1) % nbPoints].subtractToRef(path[p], line);     
			}
		}
		else {
            path[1].subtractToRef(path[0], line);
            lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
			line.normalize();		
			const in0 = path[0].subtract(lineNormal.scale(width));
			const out0 = path[0].add(lineNormal.scale(width));
            positions.push(in0.x, in0.y, in0.z, out0.x, out0.y, out0.z);
            uvs.push(0, 0, 0, 1);
            indices.push(2, 3, 1);
            for(var p = 1; p < nbPoints - 1; p++) {
                path[p + 1].subtractToRef(path[p], nextLine);
                angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
			    direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;
			    lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
			    line.normalize();		
			    const in1 = path[p].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
			    const out1 = path[p].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));        
                positions.push(in1.x, in1.y, in1.z, out1.x, out1.y, out1.z);
                uvs.push(1, 0, 1, 1);
                indices.push(4 * (p - 1) + 2, 4 * (p - 1) + 1, 4 * (p - 1));
                const in0 = in1;
			    const out0 = out1;        
			    positions.push(in0.x, in0.y, in0.z, out0.x, out0.y, out0.z);
                uvs.push(0, 0, 0, 1);
                indices.push(4 * p + 2, 4 * p + 3, 4 * p + 1);
                line = nextLine.clone();
            }                
			lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
			line.normalize();
            const in1 = path[nbPoints - 1].subtract(lineNormal.scale(width));
			const out1 = path[nbPoints - 1].add(lineNormal.scale(width));
            positions.push(in1.x, in1.y, in1.z, out1.x, out1.y, out1.z);
            uvs.push(1, 0, 1, 1);
            indices.push(4 * (nbPoints - 2) + 2, 4 * (nbPoints - 2) + 1, 4 * (nbPoints - 2));
        }
		
		//Create a custom mesh
        BABYLON.VertexData.ComputeNormals(positions, indices, normals);
		BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, positions, indices, normals, uvs);  	
 
		var customMesh = new BABYLON.Mesh("custom", scene);

		//Create a vertexData object
		var vertexData = new BABYLON.VertexData();

		//Assign positions and indices to vertexData
		vertexData.positions = positions;
		vertexData.indices = indices;
		vertexData.normals = normals;
		vertexData.uvs = uvs;

		//Apply vertexData to custom mesh
		vertexData.applyToMesh(customMesh);
		
		return customMesh;
		
	}
}
```


## Line in XoZ Plane Formed from Central Path

```javascript
var line = line2D("line", options, scene);
```

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3 points forming the centre line of the line2D | **REQUIRED**
width|_(number)_ line width|1
closed|_(boolean)_ true if the first and last points are to be joined to form a polygon|false
standardUV|_(Color4[])_ false squeezes a texture image onto each line segment|true

Just copy the code below if you want to use it.

### Playground Examples

<Playground id="#0RIS0M" title="Open Line" description="Open line example."/>
<Playground id="#0RIS0M#1" title="Closed Line" description="Closed line example."/>
<Playground id="#0RIS0M#2" title="Standard UV = True" description="Standard UV is true."/>
<Playground id="#0RIS0M#3" title="Standard UV = False" description="Standard UV is false."/>

### Line2D Code

```javascript
var line2D = function(name, options, scene) {

	//Arrays for vertex positions and indices
	var positions = [];
	var indices = [];
        var normals = [];

        var width = options.width / 2 || 0.5;
        var path = options.path;
	var closed = options.closed || false;
	if(options.standardUV === undefined) {
		standardUV = true;
	}
	else {
		standardUV = options.standardUV;
	}

	var interiorIndex;
	
	//Arrays to hold wall corner data 
	var innerBaseCorners = [];
	var outerBaseCorners = [];
	
	var outerData = [];
        var innerData = [];
	var angle = 0;
	
	var nbPoints = path.length;
	var line = BABYLON.Vector3.Zero();
	var nextLine = BABYLON.Vector3.Zero();
	path[1].subtractToRef(path[0], line);

	if(nbPoints > 2 && closed) {	
		path[2].subtractToRef(path[1], nextLine);    
		for(var p = 0; p < nbPoints; p++) {    
			angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
			direction = BABYLON.Vector3.Cross(line, nextLine).normalize().y;                
			lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
			line.normalize();
			innerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
			outerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));        				
                line = nextLine.clone();        
			path[(p + 3) % nbPoints].subtractToRef(path[(p + 2) % nbPoints], nextLine);    
		}
	}
	else {
		lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
		line.normalize();		
		innerData[0] = path[0].subtract(lineNormal.scale(width));
		outerData[0] = path[0].add(lineNormal.scale(width));
	
		for(var p = 0; p < nbPoints - 2; p++) {	
			path[p + 2].subtractToRef(path[p + 1], nextLine);
			angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));			
			direction = BABYLON.Vector3.Cross(line, nextLine).normalize().y;			
			lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
			line.normalize();
			innerData[p + 1] = path[p + 1].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
			outerData[p + 1] = path[p + 1].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));		
			line = nextLine.clone();			
		}
		if(nbPoints > 2) {
			path[nbPoints - 1].subtractToRef(path[nbPoints - 2], line);
			lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
			line.normalize();		
			innerData[nbPoints - 1] = path[nbPoints - 1].subtract(lineNormal.scale(width));
			outerData[nbPoints - 1] = path[nbPoints - 1].add(lineNormal.scale(width));
		}
		else{
			innerData[1] = path[1].subtract(lineNormal.scale(width));
			outerData[1] = path[1].add(lineNormal.scale(width));
		}
	}
     
	var maxX = Number.MIN_VALUE;
	var minX = Number.MAX_VALUE;
	var maxZ = Number.MIN_VALUE;
	var minZ = Number.MAX_VALUE;
	
	for(var p = 0; p < nbPoints; p++) {
		positions.push(innerData[p].x, innerData[p].y, innerData[p].z);
		maxX = Math.max(innerData[p].x, maxX);
		minX = Math.min(innerData[p].x, minX);
		maxZ = Math.max(innerData[p].z, maxZ);
		minZ = Math.min(innerData[p].z, minZ);
	}

	for(var p = 0; p < nbPoints; p++) {
		positions.push(outerData[p].x, outerData[p].y, outerData[p].z);
		maxX = Math.max(innerData[p].x, maxX);
		minX = Math.min(innerData[p].x, minX);
		maxZ = Math.max(innerData[p].z, maxZ);
		minZ = Math.min(innerData[p].z, minZ);
	}

        for(var i = 0; i < nbPoints - 1; i++) {
            indices.push(i, i + 1, nbPoints + i + 1);
            indices.push(i, nbPoints + i + 1, nbPoints + i)
        }
	
	if(nbPoints > 2 && closed) {
		indices.push(nbPoints - 1, 0, nbPoints);
            indices.push(nbPoints - 1, nbPoints, 2 * nbPoints - 1)
	}

	var normals = [];
        var uvs =[];

	if(standardUV) {
		for(var p = 0; p < positions.length; p += 3) {
			uvs.push((positions[p] - minX)/(maxX - minX), (positions[p + 2] - minZ)/(maxZ - minZ));               
		}
	}
	else {
		var flip = 0;
		var p1 = 0;
		var p2 = 0;
		var p3 = 0;
		var v0 = innerData[0];
		var v1 = innerData[1].subtract(v0);
		var v2 = outerData[0].subtract(v0);
		var v3 = outerData[1].subtract(v0);
		var axis = v1.clone();
		axis.normalize();

		p1 = BABYLON.Vector3.Dot(axis,v1);
		p2 = BABYLON.Vector3.Dot(axis,v2);
		p3 = BABYLON.Vector3.Dot(axis,v3);
		var minX = Math.min(0, p1, p2, p3);
		var maxX = Math.max(0, p1, p2, p3);
		
		uvs[2 * indices[0]] = -minX/(maxX - minX);
		uvs[2 * indices[0] + 1] = 1;
		uvs[2 * indices[5]] = (p2 - minX)/(maxX - minX);
		uvs[2 * indices[5] + 1] = 0;
		
		uvs[2 * indices[1]] = (p1 - minX)/(maxX - minX);
		uvs[2 * indices[1] + 1] = 1;
		uvs[2 * indices[4]] = (p3 - minX)/(maxX - minX);
		uvs[2 * indices[4] + 1] = 0;
	
		for(var i = 6; i < indices.length; i +=6) {
		
			flip = (flip + 1) % 2;
			v0 = innerData[0];
			v1 = innerData[1].subtract(v0);
			v2 = outerData[0].subtract(v0);
			v3 = outerData[1].subtract(v0);
			axis = v1.clone();
			axis.normalize();

			p1 = BABYLON.Vector3.Dot(axis,v1);
			p2 = BABYLON.Vector3.Dot(axis,v2);
			p3 = BABYLON.Vector3.Dot(axis,v3);
			var minX = Math.min(0, p1, p2, p3);
			var maxX = Math.max(0, p1, p2, p3);
		
			uvs[2 * indices[i + 1]] = flip + Math.cos(flip * Math.PI) * (p1 - minX)/(maxX - minX);
			uvs[2 * indices[i + 1] + 1] = 1;
			uvs[2 * indices[i + 4]] = flip + Math.cos(flip * Math.PI) * (p3 - minX)/(maxX - minX);
			uvs[2 * indices[i + 4] + 1] = 0;
		}
	}
	
	BABYLON.VertexData.ComputeNormals(positions, indices, normals);
	BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, positions, indices, normals, uvs);  	
	console.log(uvs)		
	//Create a custom mesh  
	var customMesh = new BABYLON.Mesh(name, scene);

	//Create a vertexData object
	var vertexData = new BABYLON.VertexData();

	//Assign positions and indices to vertexData
	vertexData.positions = positions;
	vertexData.indices = indices;
	vertexData.normals = normals;
	vertexData.uvs = uvs;

	//Apply vertexData to custom mesh
	vertexData.applyToMesh(customMesh);
	
	return customMesh;
	
}
```

## Line in XoZ Plane Formed from Inner Path

With this version you can use it as an edge of a given width to a polygon

```javascript
var line = line2D("line", options, scene);
```

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3 points forming the centre line of the line2D, **REQUIRED**
width|_(number)_ line width|1
closed|_(boolean)_ true if the first and last points are to be joined to form a polygon|false
standardUV|_(Color4[])_ false squeezes a texture image onto each line segment|true

Just copy the code below if you want to use it.

### Playground Examples (Including Use as Edge to Polygon)

<Playground id="#S7HM64" title="Open Line" description="Open line example."/>
<Playground id="#S7HM64#1" title="Closed Line" description="Closed line example."/>
<Playground id="#S7HM64#2" title="Edge Around Polygon, Standard UV = True" description="Edge Around Polygon, Standard UV = True"/>
<Playground id="#S7HM64#3" title="Edge Around Polygon, Standard UV = False" description="Edge Around Polygon, Standard UV = False"/>

### Line2D Code

```javascript
var line2D = function(name, options, scene) {

	//Arrays for vertex positions and indices
	var positions = [];
	var indices = [];
        var normals = [];

        var width = options.width || 1;
        var path = options.path;
	var closed = options.closed || false;
	if(options.standardUV === undefined) {
		standardUV = true;
	}
	else {
		standardUV = options.standardUV;
	}

	var interiorIndex;
	
	//Arrays to hold wall corner data 
	var innerBaseCorners = [];
	var outerBaseCorners = [];
	
	var outerData = [];
        var innerData = [];
	var angle = 0;
	
	var nbPoints = path.length;
	var line = BABYLON.Vector3.Zero();
	var nextLine = BABYLON.Vector3.Zero();
	path[1].subtractToRef(path[0], line);

	if(nbPoints > 2 && closed) {	
		path[2].subtractToRef(path[1], nextLine);    
		for(var p = 0; p < nbPoints; p++) {    
			angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
			direction = BABYLON.Vector3.Cross(line, nextLine).normalize().y;                
			lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
			line.normalize();
			innerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints];
			outerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));        
                line = nextLine.clone();        
			path[(p + 3) % nbPoints].subtractToRef(path[(p + 2) % nbPoints], nextLine);    
		}
	}
	else {
		lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
		line.normalize();		
		innerData[0] = path[0];
		outerData[0] = path[0].add(lineNormal.scale(width));
	
		for(var p = 0; p < nbPoints - 2; p++) {	
			path[p + 2].subtractToRef(path[p + 1], nextLine);
			angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));			
			direction = BABYLON.Vector3.Cross(line, nextLine).normalize().y;			
			lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
			line.normalize();
			innerData[p + 1] = path[p + 1];
			outerData[p + 1] = path[p + 1].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));		
			line = nextLine.clone();			
		}
		if(nbPoints > 2) {
			path[nbPoints - 1].subtractToRef(path[nbPoints - 2], line);
			lineNormal = new BABYLON.Vector3(-line.z, 0, 1 * line.x).normalize();
			line.normalize();		
			innerData[nbPoints - 1] = path[nbPoints - 1];
			outerData[nbPoints - 1] = path[nbPoints - 1].add(lineNormal.scale(width));
		}
		else{
			innerData[1] = path[1]
			outerData[1] = path[1].add(lineNormal.scale(width));
		}
	}
     
	var maxX = Number.MIN_VALUE;
	var minX = Number.MAX_VALUE;
	var maxZ = Number.MIN_VALUE;
	var minZ = Number.MAX_VALUE;
	
	for(var p = 0; p < nbPoints; p++) {
		positions.push(innerData[p].x, innerData[p].y, innerData[p].z);
		maxX = Math.max(innerData[p].x, maxX);
		minX = Math.min(innerData[p].x, minX);
		maxZ = Math.max(innerData[p].z, maxZ);
		minZ = Math.min(innerData[p].z, minZ);
	}

	for(var p = 0; p < nbPoints; p++) {
		positions.push(outerData[p].x, outerData[p].y, outerData[p].z);
		maxX = Math.max(innerData[p].x, maxX);
		minX = Math.min(innerData[p].x, minX);
		maxZ = Math.max(innerData[p].z, maxZ);
		minZ = Math.min(innerData[p].z, minZ);
	}

        for(var i = 0; i < nbPoints - 1; i++) {
            indices.push(i, i + 1, nbPoints + i + 1);
            indices.push(i, nbPoints + i + 1, nbPoints + i)
        }
	
	if(nbPoints > 2 && closed) {
		indices.push(nbPoints - 1, 0, nbPoints);
            indices.push(nbPoints - 1, nbPoints, 2 * nbPoints - 1)
	}

	var normals = [];
        var uvs =[];

	if(standardUV) {
		for(var p = 0; p < positions.length; p += 3) {
			uvs.push((positions[p] - minX)/(maxX - minX), (positions[p + 2] - minZ)/(maxZ - minZ));                
		}
	}
	else {
		var flip = 0;
		var p1 = 0;
		var p2 = 0;
		var p3 = 0;
		var v0 = innerData[0];
		var v1 = innerData[1].subtract(v0);
		var v2 = outerData[0].subtract(v0);
		var v3 = outerData[1].subtract(v0);
		var axis = v1.clone();
		axis.normalize();

		p1 = BABYLON.Vector3.Dot(axis,v1);
		p2 = BABYLON.Vector3.Dot(axis,v2);
		p3 = BABYLON.Vector3.Dot(axis,v3);
		var minX = Math.min(0, p1, p2, p3);
		var maxX = Math.max(0, p1, p2, p3);
		
		uvs[2 * indices[0]] = -minX/(maxX - minX);
		uvs[2 * indices[0] + 1] = 1;
		uvs[2 * indices[5]] = (p2 - minX)/(maxX - minX);
		uvs[2 * indices[5] + 1] = 0;
		
		uvs[2 * indices[1]] = (p1 - minX)/(maxX - minX);
		uvs[2 * indices[1] + 1] = 1;
		uvs[2 * indices[4]] = (p3 - minX)/(maxX - minX);
		uvs[2 * indices[4] + 1] = 0;
	
		for(var i = 6; i < indices.length; i +=6) {
		
			flip = (flip + 1) % 2;
			v0 = innerData[0];
			v1 = innerData[1].subtract(v0);
			v2 = outerData[0].subtract(v0);
			v3 = outerData[1].subtract(v0);
			axis = v1.clone();
			axis.normalize();

			p1 = BABYLON.Vector3.Dot(axis,v1);
			p2 = BABYLON.Vector3.Dot(axis,v2);
			p3 = BABYLON.Vector3.Dot(axis,v3);
			var minX = Math.min(0, p1, p2, p3);
			var maxX = Math.max(0, p1, p2, p3);
		
			uvs[2 * indices[i + 1]] = flip + Math.cos(flip * Math.PI) * (p1 - minX)/(maxX - minX);
			uvs[2 * indices[i + 1] + 1] = 1;
			uvs[2 * indices[i + 4]] = flip + Math.cos(flip * Math.PI) * (p3 - minX)/(maxX - minX);
			uvs[2 * indices[i + 4] + 1] = 0;
		}
	}
	
	BABYLON.VertexData.ComputeNormals(positions, indices, normals);
	BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, positions, indices, normals, uvs);  	
	console.log(uvs)		
	//Create a custom mesh  
	var customMesh = new BABYLON.Mesh(name, scene);

	//Create a vertexData object
	var vertexData = new BABYLON.VertexData();

	//Assign positions and indices to vertexData
	vertexData.positions = positions;
	vertexData.indices = indices;
	vertexData.normals = normals;
	vertexData.uvs = uvs;

	//Apply vertexData to custom mesh
	vertexData.applyToMesh(customMesh);
	
	return customMesh;
	
}
```

## Lines in 3D

The [lines](/features/featuresDeepDive/mesh/creation/param#lines) and [line system](/features/featuresDeepDive/mesh/creation/param#line-system) methods just produce a thin line and you cannot vary the width. The best way to simulate a line with a given width in 3D is to use a [tube](/features/featuresDeepDive/mesh/creation/param#tube).

<Playground id="#MRE78Z" title="Tube As Line" description="Tube as a line example."/>

## Parallel Lines in XoY Plane

Given the path of a central line the function **parallelLines** with return the path points of two lines either side of this line.

```javascript
var line = line2D("line", options, scene);
```

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3 points forming the centre line of the line2D, **REQUIRED**
innerWidth|_(number)_ distance from central line | 0.5
outerWidth|_(number)_ distance from central line | 0.5


Just copy the code below if you want to use it.

### Playground Example

<Playground id="#FA2H7X#18" title="Dotted Lines Parallel To Central Line" description="Dotted Lines Parallel To Central Line"/>

### Parallel Line Code

```javascript
var parallelLines = function(options, scene) {

	//Arrays for vertex positions and indices
	var positions = [];
	var indices = [];
        var normals = [];

        var innerWidth = options.innerWidth || 0.5;
        var outerWidth = options.outerWidth || 0.5;
        var path = options.path;

	var interiorIndex;
	
	//Arrays to hold wall corner data 
	var innerBaseCorners = [];
	var outerBaseCorners = [];
	
	var outerData = [];
        var innerData = [];
	var angle = 0;
	
	var nbPoints = path.length;
	var line = BABYLON.Vector3.Zero();
	var nextLine = BABYLON.Vector3.Zero();
	path[1].subtractToRef(path[0], line);

    	lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
	line.normalize();		
	innerData[0] = path[0].subtract(lineNormal.scale(innerWidth));
	outerData[0] = path[0].add(lineNormal.scale(outerWidth));

	for(var p = 0; p < nbPoints - 2; p++) {	
		path[p + 2].subtractToRef(path[p + 1], nextLine);
		angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));			
		direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;			
		lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
		line.normalize();
		innerData[p + 1] = path[p + 1].subtract(lineNormal.scale(innerWidth)).subtract(line.scale(direction * innerWidth/Math.tan(angle/2)));
		outerData[p + 1] = path[p + 1].add(lineNormal.scale(outerWidth)).add(line.scale(direction * outerWidth/Math.tan(angle/2)));		
		line = nextLine.clone();			
	}
	if(nbPoints > 2) {
		path[nbPoints - 1].subtractToRef(path[nbPoints - 2], line);
		lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
		line.normalize();		
		innerData[nbPoints - 1] = path[nbPoints - 1].subtract(lineNormal.scale(innerWidth));
		outerData[nbPoints - 1] = path[nbPoints - 1].add(lineNormal.scale(outerWidth));
	}
	else{
		innerData[1] = path[1].subtract(lineNormal.scale(innerWidth));
		outerData[1] = path[1].add(lineNormal.scale(outerWidth));
	}

    return {outerPoints: outerData, innerPoints: innerData};

}
```