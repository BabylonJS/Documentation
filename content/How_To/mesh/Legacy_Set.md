# How To Create Set Shapes using Legacy Method

# Box
```javascript
var box = BABYLON.Mesh.CreateBox("box", 6.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```
Parameters are: name, size of the box, the scene to attach the mesh, updatable? (if the mesh must be modified later) and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);
```

# Sphere
```javascript
var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene, false,  BABYLON.Mesh.DEFAULTSIDE);
```
Parameters are: name, number of segments (highly detailed or not), size, scene to attach the mesh, updatable? (if the mesh must be modified later) and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);
```
Beware to adapt the number of segments to the size of your mesh ;)

# Plane

```javascript
var plane = BABYLON.Mesh.CreatePlane("plane", 10.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, size, and scene to attach the mesh, updatable? (if the mesh must be modified later) and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var plane = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);
```

# Disc or Regular Polygon
```javascript
var disc = BABYLON.Mesh.CreateDisc("disc", 5, 30, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```
Parameters are: name, radius, tessellation, scene, updatable and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var disc = BABYLON.Mesh.CreateDisc("disc", 5, 30, scene);
```
With the  _tessellation_ value, you can get a regular polygon :  
3 gives a triangle,  
4 a square,  
5 a pentagon,  
6 a hexagon, 7 a heptagon, 8 an octogon, and so on.

# Cylinder

```javascript
var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 6, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, height, diamTop, diamBottom, tessellation, heightSubdivs, scene, updatable and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 3, 3, 3, 6, 1, scene);
```

# Torus

```javascript
var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```
Parameters are: name, diameter, thickness, tessellation (highly detailed or not), scene, updatable and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var torus = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene);
```

# Knot

```javascript
var knot = BABYLON.Mesh.CreateTorusKnot("knot", 2, 0.5, 128, 64, 2, 3, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```
Parameters are: name, radius, tube, radialSegments, tubularSegments, p, q, scene, updatable and the optional side orientation (see below). The last two parameters can be omitted if you just need the default behavior :
```javascript
var knot = BABYLON.Mesh.CreateTorusKnot("knot", 2, 0.5, 128, 64, 2, 3, scene);
```
You can learn more about torus knots... [RIGHT HERE](http://en.wikipedia.org/wiki/Torus_knot).

# Ground

```javascript
var ground = BABYLON.Mesh.CreateGround("ground", 6, 6, 2, scene);
```

Parameters are: name, width, depth, subdivs, scene

Our *Playground Demo Scene 01* uses a CreateGround constructor... so you can see one in action by using the link below:

https://www.babylonjs-playground.com/#TAZ2CB

# Ground From HeightMap

```javascript
var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "heightmap.jpg", 200, 200, 250, 0, 10, scene, false, successCallback);
```
Parameters are: name, heightmapPath, width, depth, subdivs, minheight, maxheight, scene, updatable, successCallback

HeightMap grounds are easy, but we decided to create a separate tutorial so we could say more about this important Babylon.js feature. Please see our [HeightMap Tutorial](/babylon101/Height_Map) to learn all about heightMap grounds.

# Tiled Ground

Thanks to forum user Kostar111 for this handy Tiled Ground constructor. Here is the basic code needed to create a tiled ground.

```javascript

var precision = {
    "w" : 2,
    "h" : 2
};
var subdivisions = {
    'h' : 8,
    'w' : 8
};
var tiledGround = BABYLON.Mesh.CreateTiledGround("Tiled Ground", -3, -3, 3, 3, subdivisions, precision, scene, false);
```

Parameters are: name, xmin, zmin, xmax, zmax, subdivisions = the number of tiles. (subdivisions.w : in width; subdivisions.h: in height), precision = the number of subdivisions inside a tile. (precision.w : in width; precision.h: in height), scene, updatable.

Kostar111 was also kind enough to give us a fine tutorial about how to use tiled grounds. [Click right here](http://makina-corpus.com/blog/metier/how-to-use-multimaterials-with-a-tiled-ground-in-babylonjs) to view it. At that link, Kostar111 thoroughly explains how the tiled ground works, and also provides some Babylon.js Playground scenes that nicely demonstrate some of its many uses.

# Further Reading

## Basic - L1

[Mesh Overview](/features/Shapes)  
[Set Shapes 101](/babylon101/Discover_Basic_Elements)  
[Parametric Shapes 101](/babylon101/Parametric_Shapes)  
[Set Shapes](/How_To/Set_Shapes)  
[Parametric Shapes](/How_To/Parametric_Shapes)  
[Polyhedra Shapes](/How_To/Polyhedra_Shapes)  
[Tiled Planes and Boxes](/How_To/Tiled)  