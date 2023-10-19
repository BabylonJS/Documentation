---
title: Using Build a House from Plans
image: 
description: Starting with a 2D plan of the outline of a house use the functions to build a house
keywords: house, outline, plan, build
further-reading:
video-overview:
video-content:
---

**Please note that some functions used in this project uses Earcut, so, in non playground projects, you will have to add a reference to their [CDN](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or download their [NPM package](https://github.com/mapbox/earcut#install)**

The walls, doors and windows of a house can be built using the function 

```javascript
var house buildFromPlan(walls, ply, height, options, scene);
```
which requires an additional prototype to `PolygonMeshBuilder`.

The code for both of these is given below and can be copied and used in your own projects. Further details can be found by reading the [development of this code](/guidedLearning/workshop/House). 

The parameters are

_walls_ : an array of wall objects  
_ply_ : thickness of each wall  
_height_ : height of each wall  
_options_ : an object containing 5 optional parameters  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;interior: a Boolean, default false, when set to true can be used to draw interior walls  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;interiorUV: a Vector4(bottom left u, bottom left v, top right u, top right v)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exteriorUV: a Vector4(bottom left u, bottom left v, top right u, top right v)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;interiorColor: a Color4(r, g, b, a)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exteriorColor: a Color4(r, g, b, a)  
_scene_ : the scene

Each wall object has one two or three parameters

_corners_: an array of corner objects - required    
_doorSpaces_ : an array of doorSpace objects - optional  
_windowSpaces_ an array of windowSpace objects - optional   

Each corner object has two parameters giving its position in 2D , example new corner(-3, 2)

Each doorSpace object has two parameters
_door_ : door object  
_left_ : distance from left hand edge of wall  

Each door object has two parameters, example new door(2, 1)
_width_ : width of door  
_height_ : height of door

Each windowSpace object has three parameters
_window_ : window object  
_left_ : distance from left hand edge of wall  
_top_ : distance from top of wall  

Each window object has two parameters, example new window(1, 2)
_width_ : width of window  
_height_ : height of window

## Code

### buildFromPlan

The following code should be copied and pasted inside the `createScene` function

```javascript
var buildFromPlan = function(walls, ply, height, options, scene) {
        
	//Arrays for vertex positions and indices
	var positions = [];
	var indices = [];
	var uvs = [];
	var colors = [];
	
	var interiorUV = options.interiorUV || new BABYLON.Vector4(0, 0, 1, 1);
	var exteriorUV = options.exteriorUV || new BABYLON.Vector4(0, 0, 1, 1);
	
	var interiorColor = options.interiorColor || new BABYLON.Color4(1, 1, 1, 1);
	var exteriorColor = options.exteriorColor || new BABYLON.Color4(1, 1, 1, 1);		
	var interior = options.interior || false;
        if(!interior) {
            walls.push(walls[0]);
        }
	
	var interiorIndex;
	
	//Arrays to hold wall corner data 
	var innerBaseCorners = [];
	var outerBaseCorners = [];
	var innerTopCorners = [];
	var outerTopCorners = [];
	var innerDoorCorners = [];
	var outerDoorCorners = [];
	var innerWindowCorners = [];
	var outerWindowCorners = [];
	
	var angle = 0;
	var direction = 0;

        var line = BABYLON.Vector3.Zero();
        var nextLine = BABYLON.Vector3.Zero();		

        var nbWalls = walls.length;
        if(nbWalls === 2) {
            walls[1].corner.subtractToRef(walls[0].corner, line);
            lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
	    line.normalize();
            innerBaseCorners[0] = walls[0].corner;
            outerBaseCorners[0] = walls[0].corner.add(lineNormal.scale(ply));
            innerBaseCorners[1] = walls[1].corner;
            outerBaseCorners[1] = walls[1].corner.add(lineNormal.scale(ply));
        }
        else if(nbWalls > 2) { 
            for(let w = 0; w < nbWalls - 1; w++) {
                walls[w + 1].corner.subtractToRef(walls[w].corner, nextLine);
                angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));			
		    direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;			
		    lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
		    line.normalize();
                innerBaseCorners[w] = walls[w].corner
                outerBaseCorners[w] = walls[w].corner.add(lineNormal.scale(ply)).add(line.scale(direction * ply/Math.tan(angle/2)));		
		    line = nextLine.clone();
            } 
            if(interior) {
                lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
	        line.normalize();
                innerBaseCorners[nbWalls - 1] = walls[nbWalls - 1].corner
                outerBaseCorners[nbWalls - 1] = walls[nbWalls - 1].corner.add(lineNormal.scale(ply));
                walls[1].corner.subtractToRef(walls[0].corner, line);
                lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
	        line.normalize();
                innerBaseCorners[0] = walls[0].corner;
                outerBaseCorners[0] = walls[0].corner.add(lineNormal.scale(ply));
            }
            else {
                walls[1].corner.subtractToRef(walls[0].corner, nextLine);
                angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));			
		    direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;			
		    lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
		    line.normalize();
                innerBaseCorners[0] = walls[0].corner
                outerBaseCorners[0] = walls[0].corner.add(lineNormal.scale(ply)).add(line.scale(direction * ply/Math.tan(angle/2)));
                innerBaseCorners[nbWalls - 1] = innerBaseCorners[0];
                outerBaseCorners[nbWalls - 1] = outerBaseCorners[0]

            }       
        }

	// inner and outer top corners
	for(let w = 0; w < nbWalls; w++) {
		innerTopCorners.push(new BABYLON.Vector3(innerBaseCorners[w].x, height, innerBaseCorners[w].z));
		outerTopCorners.push(new BABYLON.Vector3(outerBaseCorners[w].x, height, outerBaseCorners[w].z));
	}
	
	var maxL = 0;
	for(w = 0; w < nbWalls - 1; w++) {
		maxL = Math.max(innerBaseCorners[w + 1].subtract(innerBaseCorners[w]).length(), maxL);
	}
	
	var maxH = height; // for when gables introduced
	
	/******House Mesh Construction********/
	
	// Wall Construction
	var polygonCorners;
	var polygonTriangulation;
	var wallData;
	var wallDirection = BABYLON.Vector3.Zero();
	var wallNormal = BABYLON.Vector3.Zero(); 
	var wallLength;
	var exteriorWallLength;
	var doorData;
	var windowData;
	var uvx, uvy;
	var wallDiff;
	
	for(let w = 0; w < nbWalls - 1; w++) {
		walls[w + 1].corner.subtractToRef(walls[w].corner, wallDirection);
		wallLength = wallDirection.length();
		wallDirection.normalize();
		wallNormal.x = wallDirection.z;
		wallNormal.z = -1 * wallDirection.x;
		exteriorWallLength = outerBaseCorners[w + 1].subtract(outerBaseCorners[w]).length();
		wallDiff = exteriorWallLength - wallLength;
		var gableHeight = 0;
		
		//doors
		if(walls[w].doorSpaces) {
			walls[w].doorSpaces.sort(compareLeft);
		}
		var doors = walls[w].doorSpaces.length;
		
		//Construct INNER wall polygon starting from (0, 0) using wall length and height and door data
		polygonCorners = [];
		polygonCorners.push(new BABYLON.Vector2(0, 0));
		
		for (let d = 0; d < doors; d++) {			
			polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left, 0));
			polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left, walls[w].doorSpaces[d].door.height));
			polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left + walls[w].doorSpaces[d].door.width, walls[w].doorSpaces[d].door.height));
			polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left + walls[w].doorSpaces[d].door.width, 0));			
		}

		polygonCorners.push(new BABYLON.Vector2(wallLength, 0));
		polygonCorners.push(new BABYLON.Vector2(wallLength, height));
		polygonCorners.push(new BABYLON.Vector2(0, height));
		
		//Construct triangulation of polygon using its corners
		polygonTriangulation = new BABYLON.PolygonMeshBuilder("", polygonCorners, scene);	
		
		//windows
		//Construct holes and add to polygon from window data			
		var windows = walls[w].windowSpaces.length;
		var holes = [];
		for(let ws = 0; ws < windows; ws++) { 
			var holeData = [];
			holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left, height - walls[w].windowSpaces[ws].top - walls[w].windowSpaces[ws].window.height));
			holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left + walls[w].windowSpaces[ws].window.width, height - walls[w].windowSpaces[ws].top - walls[w].windowSpaces[ws].window.height));
			holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left + walls[w].windowSpaces[ws].window.width, height - walls[w].windowSpaces[ws].top));
			holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left, height - walls[w].windowSpaces[ws].top));
			holes.push(holeData);				
		}
		
		for(let h = 0; h < holes.length; h++) {
			polygonTriangulation.addHole(holes[h]);
		}
		
		
		// wallBuilder produces wall vertex positions array and indices using the current and next wall to rotate and translate vertex positions to correct place
		wallData = polygonTriangulation.wallBuilder(walls[w], walls[w + 1]);	

		nbIndices = positions.length/3; // current number of indices
		
		polygonTriangulation._points.elements.forEach(function (p)  {
			uvx = interiorUV.x + p.x * (interiorUV.z - interiorUV.x) / maxL;
			uvy = interiorUV.y + p.y * (interiorUV.w - interiorUV.y) / height;
			uvs.push(uvx, uvy);					
			colors.push(interiorColor.r, interiorColor.g, interiorColor.b, interiorColor.a);
		});
		
		//Add inner wall positions (repeated for flat shaded mesh)
		positions = positions.concat(wallData.positions);
		
		interiorIndex = positions.length/3;

		indices = indices.concat(wallData.indices.map(function(idx){
			return idx + nbIndices;
		}));
		
		//wallData has format for inner wall [base left, 0 or more doors, base right, top right, top left, windows]
		//extract door and wall data
		
		windowData = wallData.positions.slice(12 * (doors + 1)); //4 entries per door + 4 entries for wall corners, each entry has 3 data points
		doorData = wallData.positions.slice(3, 3 * (4 * doors + 1) ); 
		
		//For each inner door save corner as an array of four Vector3s, base left, top left, top right, base right
		//Extend door data outwards by ply and save outer door corners 		
		var doorCornersIn = [];
		var doorCornersOut = [];
		for(let p = 0; p < doorData.length/12; p++) {
			var doorsIn = [];
			var doorsOut = [];
			for(let d = 0; d < 4; d ++) {
				doorsIn.push(new BABYLON.Vector3(doorData[3 * d + 12 * p], doorData[3 * d  + 12 * p + 1], doorData[3 * d + 12 * p + 2]));
				doorData[3 * d + 12 * p] += ply * wallNormal.x;
				doorData[3 * d + 12 * p + 2] += ply * wallNormal.z;
				doorsOut.push(new BABYLON.Vector3(doorData[3 * d + 12 * p], doorData[3 * d  + 12 * p + 1], doorData[3 * d + 12 * p + 2]));
			}
			doorCornersIn.push(doorsIn);
			doorCornersOut.push(doorsOut);
		}			
		innerDoorCorners.push(doorCornersIn);			
		outerDoorCorners.push(doorCornersOut);
		
		//For each inner window save corner as an array of four Vector3s, base left, top left, top right, base right
		//Extend window data outwards by ply and save outer window corners 		
		var windowCornersIn = [];
		var windowCornersOut = [];
		for(let p = 0; p < windowData.length/12; p++) {
			var windowsIn = [];
			var windowsOut = [];
			for(let d = 0; d < 4; d ++) {
				windowsIn.push(new BABYLON.Vector3(windowData[3 * d + 12 * p], windowData[3 * d  + 12 * p + 1], windowData[3 * d + 12 * p + 2]));
				windowData[3 * d + 12 * p] += ply * wallNormal.x;
				windowData[3 * d + 12 * p + 2] += ply * wallNormal.z;
				windowsOut.push(new BABYLON.Vector3(windowData[3 * d + 12 * p], windowData[3 * d  + 12 * p + 1], windowData[3 * d + 12 * p + 2]));
			}
			windowCornersIn.push(windowsIn);
			windowCornersOut.push(windowsOut);
		}			
		innerWindowCorners.push(windowCornersIn);			
		outerWindowCorners.push(windowCornersOut);
		
		//Construct OUTER wall facet positions from inner wall 
		//Add outer wall corner positions back to wallData positions
		wallData.positions = [];
		
		wallData.positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z);
		wallData.positions = wallData.positions.concat(doorData);			
		wallData.positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[(w + 1) % nbWalls].z);
		wallData.positions.push(outerTopCorners[w + 1].x, outerTopCorners[w + 1].y, outerTopCorners[(w + 1) % nbWalls].z);
		wallData.positions.push(outerTopCorners[w].x, outerTopCorners[w].y, outerTopCorners[w].z);
		wallData.positions = wallData.positions.concat(windowData);
		
		//Calulate exterior wall uvs
		polygonTriangulation._points.elements.forEach(function (p)  {
			if (p.x == 0) {
				uvx = exteriorUV.x;
			}
			else if (wallLength - p.x < 0.000001) {
				uvx = exteriorUV.x + (wallDiff + p.x) * (exteriorUV.z - exteriorUV.x) / (maxL + wallDiff)
			}
			else {
				uvx = exteriorUV.x + (0.5 * wallDiff + p.x) * (exteriorUV.z - exteriorUV.x) / (maxL + wallDiff);
			}
			uvy = exteriorUV.y + p.y * (exteriorUV.w - exteriorUV.y) / height;
			uvs.push(uvx, uvy);					
		});
	
		nbIndices = positions.length/3; // current number of indices
		
		//Add outer wall positions, uvs and colors (repeated for flat shaded mesh)
		positions = positions.concat(wallData.positions);

		
		//Reverse indices for correct normals
		wallData.indices.reverse();
		
		indices = indices.concat(wallData.indices.map(function(idx){
			return idx + nbIndices;
		}));
		
		//Construct facets for base and door top and door sides, repeating positions for flatshaded mesh
		var doorsRemaining = doors;
		var doorNb = 0;
		
		if (doorsRemaining > 0) {
			//base
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerBaseCorners[w].x, innerBaseCorners[w].y, innerBaseCorners[w].z); //tl
			positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z); //bl
			positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z); //tr
			positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z); //br
			
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left				
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].left/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].left/maxL, exteriorUV.y); //base right
			
			indices.push(nbIndices, nbIndices + 2, nbIndices + 3, nbIndices + 3, nbIndices + 1, nbIndices);
			
			//left side
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z); //br
			positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z); //tr
			positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z); //bl
			positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z); //tl
			
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height/maxH); //top right
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height/maxH); //top Left
			
			indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices, nbIndices + 3, nbIndices + 2);
			
			//top
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z); //bl
			positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z); //br
			positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z); //tl
			positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z); //tr
			
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
			
			indices.push(nbIndices + 2, nbIndices + 1, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1);
			
			//right side
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z); //tl
			positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z); //bl
			positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z); //tr
			positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z); //br
			
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height/maxH); //top Left
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height/maxH); //top right
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y); //base right
			
			indices.push(nbIndices, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1, nbIndices + 3);
		}
		doorsRemaining--
		doorNb++
		
		while (doorsRemaining > 0 ) {
			
			//base
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerDoorCorners[w][doorNb - 1][3].x, innerDoorCorners[w][doorNb - 1][3].y, innerDoorCorners[w][doorNb -1][3].z); //bl
			positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z); //br
			positions.push(outerDoorCorners[w][doorNb - 1][3].x, outerDoorCorners[w][doorNb - 1][3].y, outerDoorCorners[w][doorNb - 1][3].z); //tl
			positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z); //tr
			
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (walls[w].doorSpaces[doorNb].left - (walls[w].doorSpaces[doorNb - 1].left + walls[w].doorSpaces[doorNb - 1].door.width))/maxL/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (walls[w].doorSpaces[doorNb].left - (walls[w].doorSpaces[doorNb - 1].left + walls[w].doorSpaces[doorNb - 1].door.width))/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
			
			indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices + 3, nbIndices + 2, nbIndices);
			
			//left side
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z); //br
			positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z); //tr
			positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z); //bl
			positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z); //tl
			
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height/maxH); //top right
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height/maxH); //top Left
			
			indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices, nbIndices + 3, nbIndices + 2);
			
			//top
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z); //bl
			positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z); //br
			positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z); //tl
			positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z); //tr
			
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
			
			indices.push(nbIndices + 2, nbIndices + 1, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1);
			
			//right side
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z); //tl
			positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z); //bl
			positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z); //tr
			positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z); //br
			
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height/maxH); //top Left
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height/maxH); //top right
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y); //base right
			
			indices.push(nbIndices, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1, nbIndices + 3);
			
			doorsRemaining--
			doorNb++
			
		} 
		
		doorNb--;
		nbIndices = positions.length/3; // current number of indices
		
		//final base
		if(doors > 0) {
			positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z); //bl
			positions.push(innerBaseCorners[w + 1].x, innerBaseCorners[w + 1].y, innerBaseCorners[w + 1].z); //br
			positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z); //tl
			positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[w + 1].z); //tr
			
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (wallLength - (walls[w].doorSpaces[doorNb].left + walls[w].doorSpaces[doorNb].door.width))/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (wallLength - (walls[w].doorSpaces[doorNb].left + walls[w].doorSpaces[doorNb].door.width))/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
			
		}
		else {
			positions.push(innerBaseCorners[w].x, innerBaseCorners[w].y, innerBaseCorners[w].z); //bl
			positions.push(innerBaseCorners[w + 1].x, innerBaseCorners[w + 1].y, innerBaseCorners[w + 1].z); //br
			positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z); //tl
			positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[w + 1].z); //tr
			
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * wallLength/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * wallLength/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
			
		}
		indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices + 3, nbIndices + 2, nbIndices);
	
		//Construct facets for window base, top and sides, repeating positions for flatshaded mesh
		for (ww = 0 ; ww < innerWindowCorners[w].length; ww++) {
			//left side
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerWindowCorners[w][ww][3].x, innerWindowCorners[w][ww][3].y, innerWindowCorners[w][ww][3].z); //tr
			positions.push(innerWindowCorners[w][ww][0].x, innerWindowCorners[w][ww][0].y, innerWindowCorners[w][ww][0].z); //br
			positions.push(outerWindowCorners[w][ww][3].x, outerWindowCorners[w][ww][3].y, outerWindowCorners[w][ww][3].z); //tl
			positions.push(outerWindowCorners[w][ww][0].x, outerWindowCorners[w][ww][0].y, outerWindowCorners[w][ww][0].z); //bl

			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height/maxH); //top right
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height/maxH); //top Left
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			
			indices.push(nbIndices + 1, nbIndices, nbIndices + 3,  nbIndices + 2, nbIndices + 3, nbIndices);
			
			//base
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerWindowCorners[w][ww][0].x, innerWindowCorners[w][ww][0].y, innerWindowCorners[w][ww][0].z); //tl
			positions.push(innerWindowCorners[w][ww][1].x, innerWindowCorners[w][ww][1].y, innerWindowCorners[w][ww][1].z); //tr
			positions.push(outerWindowCorners[w][ww][0].x, outerWindowCorners[w][ww][0].y, outerWindowCorners[w][ww][0].z); //bl
			positions.push(outerWindowCorners[w][ww][1].x, outerWindowCorners[w][ww][1].y, outerWindowCorners[w][ww][1].z); //br
			
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width/maxL, exteriorUV.y); //base right
			
			indices.push(nbIndices + 1, nbIndices, nbIndices + 3, nbIndices + 3,nbIndices, nbIndices + 2);
			
			//right side
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerWindowCorners[w][ww][1].x, innerWindowCorners[w][ww][1].y, innerWindowCorners[w][ww][1].z); //bl
			positions.push(innerWindowCorners[w][ww][2].x, innerWindowCorners[w][ww][2].y, innerWindowCorners[w][ww][2].z); //tl
			positions.push(outerWindowCorners[w][ww][1].x, outerWindowCorners[w][ww][1].y, outerWindowCorners[w][ww][1].z); //br
			positions.push(outerWindowCorners[w][ww][2].x, outerWindowCorners[w][ww][2].y, outerWindowCorners[w][ww][2].z); //tr
			
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height/maxH); //top Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x), exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height/maxH); //top right
			
			indices.push(nbIndices + 1, nbIndices + 2, nbIndices + 3, nbIndices, nbIndices + 2, nbIndices + 1);
			
			//top
			nbIndices = positions.length/3; // current number of indices
			
			positions.push(innerWindowCorners[w][ww][2].x, innerWindowCorners[w][ww][2].y, innerWindowCorners[w][ww][2].z); //br
			positions.push(innerWindowCorners[w][ww][3].x, innerWindowCorners[w][ww][3].y, innerWindowCorners[w][ww][3].z); //bl
			positions.push(outerWindowCorners[w][ww][2].x, outerWindowCorners[w][ww][2].y, outerWindowCorners[w][ww][2].z); //tr
			positions.push(outerWindowCorners[w][ww][3].x, outerWindowCorners[w][ww][3].y, outerWindowCorners[w][ww][3].z); //tl
			
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width/maxL, exteriorUV.y); //base right
			uvs.push(exteriorUV.x, exteriorUV.y); //base Left
			uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width/maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
			uvs.push(exteriorUV.x , exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
			
			indices.push(nbIndices + 3, nbIndices, nbIndices + 2, nbIndices + 1, nbIndices, nbIndices + 3);
			
		}
		
		//Construction of top of wall facets
		nbIndices = positions.length/3; // current number of indices
		
		positions.push(innerTopCorners[w].x, innerTopCorners[w].y, innerTopCorners[w].z); //tl
		positions.push(innerTopCorners[w + 1].x, innerTopCorners[w + 1].y, innerTopCorners[w + 1].z); //tr
		positions.push(outerTopCorners[w].x, outerTopCorners[w].y, outerTopCorners[w].z); //bl
		positions.push(outerTopCorners[w + 1].x, outerTopCorners[w + 1].y, outerTopCorners[w + 1].z); //br
		
		uvx = exteriorUV.x + 0.5 * wallDiff * (exteriorUV.z - exteriorUV.x)/maxL;
		uvs.push(uvx, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top Left
	
		uvx = exteriorUV.x + (0.5 * wallDiff + wallLength) * (exteriorUV.z - exteriorUV.x)/maxL;
		uvs.push(uvx, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply/maxH); //top right
	
		uvs.push(exteriorUV.x, exteriorUV.y); //base Left		
		uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * exteriorWallLength/(maxL + wallDiff), exteriorUV.y); //base right
	
		indices.push(nbIndices + 1, nbIndices, nbIndices + 3, nbIndices + 2, nbIndices + 3, nbIndices); 
		
		for(let p = interiorIndex; p < positions.length/3; p++) {
			colors.push(exteriorColor.r, exteriorColor.g, exteriorColor.b, exteriorColor.a);
		}

		if (interior) {  //close ends of walls
                nbIndices = positions.length/3; // current number of indices
                
                positions.push(innerBaseCorners[0].x, innerBaseCorners[0].y, innerBaseCorners[0].z);
			    positions.push(outerBaseCorners[0].x, outerBaseCorners[0].y, outerBaseCorners[0].z);
                positions.push(outerTopCorners[0].x, outerTopCorners[0].y, outerTopCorners[0].z);
                positions.push(innerTopCorners[0].x, innerTopCorners[0].y, innerTopCorners[0].z);
			    
                uvs.push(exteriorUV.x, exteriorUV.y);
                uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y);
                uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.z);
				uvs.push(exteriorUV.x, exteriorUV.z);

                indices.push(nbIndices, nbIndices + 1, nbIndices + 2, nbIndices, nbIndices + 2, nbIndices + 3);

                nbIndices = positions.length/3; // current number of indices

                positions.push(innerBaseCorners[nbWalls -1].x, innerBaseCorners[nbWalls -1].y, innerBaseCorners[nbWalls -1].z);
			    positions.push(outerBaseCorners[nbWalls -1].x, outerBaseCorners[nbWalls -1].y, outerBaseCorners[nbWalls -1].z);
                positions.push(outerTopCorners[nbWalls -1].x, outerTopCorners[nbWalls -1].y, outerTopCorners[nbWalls -1].z);
                positions.push(innerTopCorners[nbWalls -1].x, innerTopCorners[nbWalls -1].y, innerTopCorners[nbWalls -1].z);
			    
                uvs.push(exteriorUV.x, exteriorUV.y);
                uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y);
                uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.z);
				uvs.push(exteriorUV.x, exteriorUV.z);

                indices.push(nbIndices + 1, nbIndices, nbIndices + 2, nbIndices + 2, nbIndices, nbIndices + 3);
			    
                for(let p = 0; p < 8; p++) {
				    colors.push(exteriorColor.r, exteriorColor.g, exteriorColor.b, exteriorColor.a);
			    }
            }
	
		var compareLeft = function(a, b) {
			return a.left - b.left
		}
		
	}

	var normals = [];

	BABYLON.VertexData.ComputeNormals(positions, indices, normals);
	BABYLON.VertexData._ComputeSides(BABYLON.Mesh.FRONTSIDE, positions, indices, normals, uvs);

	
	//Create a custom mesh  
	var customMesh = new BABYLON.Mesh("custom", scene);

	//Create a vertexData object
	var vertexData = new BABYLON.VertexData();

	//Assign positions and indices to vertexData
	vertexData.positions = positions;
	vertexData.indices = indices;
	vertexData.normals = normals;
	vertexData.uvs = uvs;
	vertexData.colors = colors;

	//Apply vertexData to custom mesh
	vertexData.applyToMesh(customMesh);
	
	return customMesh;
	
}
```

### PolygonMeshBuilder wallBuilder Method

This code should be copied and pasted within your own code.

```javascript
BABYLON.PolygonMeshBuilder.prototype.wallBuilder = function (w0, w1) {
	var positions = [];
	var iuvs = [];
	var euvs = [];
	var icolors = [];
	var ecolors = [];
	var direction = w1.corner.subtract(w0.corner).normalize();
	var angle = Math.acos(direction.x);
	if(direction.z !=0) {
		angle *= direction.z/Math.abs(direction.z);
	}	
	this._points.elements.forEach(function (p) {
		positions.push(p.x * Math.cos(angle) + w0.corner.x, p.y, p.x * Math.sin(angle) + w0.corner.z);
	});
	var indices = [];		
	var res = earcut(this._epoints, this._eholes, 2);
	for (let i = res.length; i > 0; i--) {
		indices.push(res[i - 1]);
	};			
	return {positions: positions, indices: indices};
};
```

### Building the Data and Parameters, an example

```javascript
	var baseData = [-3, -2, -1, -4, 1,-4, 3, -2, 5, -2, 5, 1, 2, 1, 2, 3, -3, 3];

	
	var corners = [];
	for(b = 0; b < baseData.length/2; b++) {
		corners.push(new corner(baseData[2*b], baseData[2*b + 1]));
	}
	
	
	var door = new door(1, 1.8);
	var doorSpace = new doorSpace(door, 1);
	
	var window0 = new window(1.2, 2.4);
	var window1 = new window(2, 2.4);
	
	var windowSpace02 = new windowSpace(window0, 0.814, 0.4);
	var windowSpace1 =  new windowSpace(window0, 0.4, 0.4);
	var windowSpace78 = new windowSpace(window1, 1.5, 0.4);
	
	var walls = [];
	for(c=0; c<corners.length; c++) {
		walls.push(new wall(corners[c]));
	}
	
	walls[0].windowSpaces = [windowSpace02];
	walls[1].windowSpaces = [windowSpace1];
	walls[2].windowSpaces = [windowSpace02];
	walls[7].windowSpaces = [windowSpace78];
	walls[8].windowSpaces = [windowSpace78];
	
	walls[5].doorSpaces = [doorSpace];
	
	
	var ply = 0.3;
	var height = 3.2;
```
### Build Interior Walls
Really this is a method of building walls that do not form an enclosing shell, i.e. the first and last corners do not produce a wall between them.

Add the option interior: true, for example 

```javascript
var wall = buildFromPlan(walls, ply, height, {interior:true}, scene);
```
You can add doors and windows (?hatches) to these walls as well.

## Playground Examples
PG: <Playground id="#4GBWI5#265" title="House From Floorplan" description="Example of a House Built from a FloorPlan."/>  
PG: <Playground id="#1Z71FW#103" title="Wall From Floorplan 1" description="Example of None Enclosing Wall."/>  
PG: <Playground id="#1Z71FW#102" title="Wall From Floorplan 2" description="Example of None Enclosing Wall with texture."/>  
PG: <Playground id="#1Z71FW#45" title="House and Interior Walls" description="Example of House with interior walls."/>

