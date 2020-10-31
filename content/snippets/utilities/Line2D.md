# Draw a Line of Given Width

Three versions of **Line2D** are given below followed by a suggestion for drawing a line in 3D.
In addition the code is adapted as **parallelLines** to produce lines parallel to a central line 

# Line in XoY Plane Formed from Central Path

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

## Playground Examples

These examples use an orthographic camera giving a 2D view

* [Playground Example - Open Line](https://www.babylonjs-playground.com/#FA2H7X#3)
* [Playground Example - Closed Line](https://www.babylonjs-playground.com/#FA2H7X#4)
* [Playground Example - Standard UV is True](https://www.babylonjs-playground.com/#FA2H7X#5)
* [Playground Example - Standard UV is False](https://www.babylonjs-playground.com/#FA2H7X#6)

## Line2D Code

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

# Line in XoZ Plane Formed from Central Path

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

## Playground Examples

* [Playground Example - Open Line](https://www.babylonjs-playground.com/#0RIS0M)
* [Playground Example - Closed Line](https://www.babylonjs-playground.com/#0RIS0M#1)
* [Playground Example - Standard UV is True](https://www.babylonjs-playground.com/#0RIS0M#2)
* [Playground Example - Standard UV is False](https://www.babylonjs-playground.com/#0RIS0M#3)

## Line2D Code

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

# Line in XoZ Plane Formed from Inner Path

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

## Playground Examples (Including Use as Edge to Polygon)

* [Playground Example - Open Line](https://www.babylonjs-playground.com/#S7HM64)
* [Playground Example - Closed Line as Edge Around Polygon](https://www.babylonjs-playground.com/#S7HM64#1)
* [Playground Example - Edge Around Polygon, Standard UV is True](https://www.babylonjs-playground.com/#S7HM64#2)
* [Playground Example - Edge Around Polygon, Standard UV is False](https://www.babylonjs-playground.com/#S7HM64#3)

## Line2D Code

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

# Lines in 3D

The [lines](/how_to/parametric_shapes#lines) and [line system](/how_to/parametric_shapes#line-system) methods just produce a thin line and you cannot vary the width. The best way to simulate a line with a given width in 3D is to use a [tube](/how_to/parametric_shapes#tube).

* [Playground Example - Tube as Line](https://www.babylonjs-playground.com/#MRE78Z)

# Parallel Lines in XoY Plane

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

## Playground Example

* [Playground Example - Dotted Lines Parallel to Central Line](https://www.babylonjs-playground.com/#FA2H7X#18)

## Parallel Line Code

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
