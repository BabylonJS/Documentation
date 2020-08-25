
# Parametric Shapes
Unlike set shapes the form of a parametric shape cannot generally be determined by their name as it depends on the parametric values applied to the shape.

The _MeshBuilder_ method uses a number of options that you can set or just settle for the default values. Whilst some options such as size or diameter have an obvious meaning, some such as instance require an explanation before proceeding. Others such as frontUV require [Further Reading](#further-reading).

## Paths

Many parametric shapes require an array of vectors to form a path as one of its parameters. As well as obtaining this array of points by hand there are some [curves](/How_To/How_to_use_Curve3), such as a Bezier curve, that can be generated within Babylon.js and the path vectors extracted. 

## Instance

When in addition the shape has an instance parameter in its options then its shape can be updated by changing the options' values and then using MeshBuilder with instance set to the name of the shape, provided the following conditions are met

1. the updatable option is set to true;
2. the number of elements within any array used for an option remains the same;

In practice all the parametric shapes, except for the Lathe and Polygon (both Create and Extend), can have their shape updated in this way by using the already created instance of the mesh.

Where it is possible two playground examples will be given, the first creating a mesh and the second updating it with the instance option.

# How To Create Parametric Shapes

## Lines
Creates a contiguous series of line segments from a list of points.
You must set at least the _points_ option.
On update, you must set the _points_ and _instance_ options. You can also set the _colors_ option if previously set at construction time.  

Example :
```javascript
//creates lines
var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myArray}, scene);

// updates the existing instance of lines : no need for the parameter scene here
lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myArray, instance: lines});
```

option|value|default value
--------|-----|-------------
points|_(Vector3[])_  array of Vector3, the path of the line **REQUIRED**
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line mesh to be updated|null
colors|_(Color4[])_ array of Color4, each point color|null
useVertexAlpha|_(boolean)_ false if the alpha blending is not required (faster)|true

* [Playground Example of a Spiral from Lines](https://www.babylonjs-playground.com/#165IV6#64)
* [Playground Update of the Spiral from Lines](https://www.babylonjs-playground.com/#165IV6#63)

Lines are colored with a color property

```javascript
lines.color = new BABYLON.Color3(1, 0, 0);
```
* [Playground Example of Colored Lines](https://www.babylonjs-playground.com/#165IV6#78)

## Dashed Lines
Creates a contiguous series of dashed line segments from a list of points.
You must set at least the _points_ option.
On update, you must set the _points_ and _instance_ options. Any other option will not be changed.

Example :
```javascript
// creates an instance of dashedlines
var dashedLines = BABYLON.MeshBuilder.CreateDashedLines("dl", {points: myArray}, scene);

// updates the existing instance of dashedLines : no need for the parameter scene here
dashedLines = BABYLON.MeshBuilder.CreateDashedLines("dl", {points: myArray, instance: dashedLines});
```

option|value|default value
--------|-----|-------------
points|_(Vector3[])_  array of Vector3, the path of the line **REQUIRED** |
dashSize|_(number)_  size of the dashes|3
gapSize|_(number)_  size of the gaps|1
dashNb|_(number)_  intended number of dashes|200
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line mesh to be updated|null

[A Playground Example of Dashed Lines](https://www.babylonjs-playground.com/#165IV6#76)
[A Playground Update of Dashed Lines](https://www.babylonjs-playground.com/#165IV6#77)

Dashed lines are colored with a color property

```javascript
lines.color = new BABYLON.Color3(1, 0, 0);
```
* [Playground Example of Colored Dashed Lines](https://www.babylonjs-playground.com/#165IV6#79)

## Line System  
A system of non-contiguous lines that are independent of each other and may exist in their own space.
You must set at least the _lines_ option.
On update, you must set the _lines_ and _instance_ options. You can also set the _colors_ option if previously set at construction time.  

Example :
```javascript
// creates an instance of a line system
var lineSystem = BABYLON.MeshBuilder.CreateLineSystem("lineSystem", {lines: myArray}, scene);

// updates the existing instance of lineSystem : no need for the parameter scene here
lineSystem = BABYLON.MeshBuilder.CreateLineSystem("lineSystem", {lines: myArray, instance: lineSystem});

```

option|value|default value
--------|-----|-------------
lines|_(Vector3[])_  array of lines, each line being an array of successive Vector3 **REQUIRED**
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line system mesh to be updated|null
colors|_(Color4[])_ array of Color4, each point color|null
useVertexAlpha|_(boolean)_ false if the alpha blending is not required (faster)|true

[A Playground Example of a Linesystem](https://www.babylonjs-playground.com/#165IV6#66)
[A Playground Update of the Linesystem](https://www.babylonjs-playground.com/#165IV6#10)

A line system is colored with a color property

```javascript
linesystem.color = new BABYLON.Color3(1, 0, 0);
```
* [Playground Example of Colored Line System](https://www.babylonjs-playground.com/#165IV6#80)

## Ribbon
You must set at least the _pathArray_ option.
On update, you must set the _pathArray_ and _instance_ options.

Example :
```javascript
// creates an instance
var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: myPaths}, scene);

// updates the existing instance of ribbon : no need for the parameter scene
ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: myPaths, instance: ribbon});
```

option|value|default value
--------|-----|-------------
pathArray|_(Vector3[][])_  array of array of Vector3, the array of paths **REQUIRED**
closeArray|_(boolean)_  to force the ribbon to join its last and first paths|false
closePath|_(boolean)_  to force each ribbon path to join its last and first points|false
offset|_(number)_  used if the pathArray has one path only|half the path length
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of a ribbon to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

[A Playground Example of a Ribbon](https://www.babylonjs-playground.com/#165IV6#65)
[A Playground Update of the Ribbon](https://www.babylonjs-playground.com/#165IV6#13)

## Tube
You must set at least the _path_ option.
On update, you must set the _path_ and _instance_ options and you can set the _radius_, _radiusFunction_ or _arc_ options.

Example :
```javascript
// creates a tube
var tube = BABYLON.MeshBuilder.CreateTube("tube", {path: myPath}, scene);

// updates the existing instance of tube : no need for the parameter scene
tube = BABYLON.MeshBuilder.CreateTube("tube", {path: myPath, instance: tube});

```

option|value|default value
--------|-----|-------------
path|_(Vector3[])_  array of Vector3, the path of the tube **REQUIRED** |
radius|_(number)_  the radius of the tube|1
tessellation|_(number)_  the number of radial segments|64
radiusFunction|_( function(i, distance) )_  a function returning a radius value from _(i, distance)_ parameters|null
cap|_(number)_ tube cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
arc|_(number)_ ratio of the tube circumference between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of a tube to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

[A Playground Example of a Tube](https://www.babylonjs-playground.com/#165IV6#68)
[A Playground Update of the Tube](https://www.babylonjs-playground.com/#165IV6#67)

## Extruded Shapes
You must set at least the _shape_ and _path_ options.
On update, you must set the _shape_, _path_ and _instance_ options and you can set the _scale_ and _rotation_ options.

In whatever direction you want to extrude the shape the design of the shape should be based on coordinates 
in the XOY plane, ie the z component should be 0. Some twisting to this base shape can be applied by leaving the x and y components unchanged but allowing the z component to be non zero but not taking the shape too far from generally lying in th XOY plane. Otherwise results will not be as you might expect.

Example :
```javascript
// creates an extended shape
var extruded = BABYLON.MeshBuilder.ExtrudeShape("ext", {shape: myShape, path: myPath}, scene);

// updates the existing instance of extruded : no need for the parameter scene
extruded = BABYLON.MeshBuilder.ExtrudeShape("ext", {shape: myShape, path: myPath, scale: newScale, rotation: newRotation instance: extruded});

```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to extrude **REQUIRED** |
path|_(Vector3[])_  array of Vector3, the extrusion axis **REQUIRED** |
scale|_(number)_  the value to scale the shape|1
rotation|_(number)_  the value to rotate the shape each step along the path|0
cap|_(number)_ extrusion cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of an extruded shape to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

* [Playground Example of an Extrusion in Z direction](https://www.babylonjs-playground.com/#165IV6#69)
* [Playground Update of the Extrusion Changing Scale and Rotation](https://www.babylonjs-playground.com/#165IV6#16)

* [Playground Example of an Extrusion in Y direction](https://www.babylonjs-playground.com/#165IV6#70)
* [Playground Update of the Extrusion Changing Scale and Rotation](https://www.babylonjs-playground.com/#165IV6#18)

When you need sharp mitred corners there is a utility function available [Extruded Shape with Mitred Corners](/snippets/Mitred)

## Custom Extruded Shapes
You must set at least the _shape_ and _path_ options.
On update, you must set the _shape_, _path_ and _instance_ options and you can set the _rotationFunction_ or _scaleFunction_ options.

Example :
```javascript
//creates an instance of a Custom Extruded Shape
var extruded = BABYLON.MeshBuilder.ExtrudeShapeCustom("ext", {shape: myShape, path: myPath}, scene);

// updates the existing instance of extruded : no need for the parameter scene
extruded = BABYLON.MeshBuilder.ExtrudeShapeCustom("ext", {shape: myShape, path: myPath, scaleFunction: myScaleF, rotationFunction: myRotF instance: extruded});
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to extrude **REQUIRED**|
path|_(Vector3[])_  array of Vector3, the extrusion axis **REQUIRED** |
scaleFunction|_( function(i, distance) )_  a function returning a scale value from _(i, distance)_ parameters|{return 1;}
rotationFunction|_( function(i, distance) )_  a function returning a rotation value from _(i, distance)_ parameters|{return 0;}
ribbonClosePath|_(boolean)_ the underlying ribbon _closePath_ parameter value|false
ribbonCloseArray|_(boolean)_ the underlying ribbon _closeArray_ parameter value|false
cap|_(number)_ extrusion cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of an extruded shape to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

* [Playground Example of a Custom Extruded Shape](https://www.babylonjs-playground.com/#165IV6#71)
* [Playground Update of the Custom Extruded Shape Changing Scale and Rotation Functions](https://www.babylonjs-playground.com/#165IV6#17)

## Lathe
You must set at least the _shape_ option.

Example :
```javascript
var lathe = BABYLON.MeshBuilder.CreateLathe("lathe", {shape: myShape}, scene);
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to turn **REQUIRED** |
radius|_(number)_  the value to radius of the lathe|1
tessellation|_(number)_  the number of iteration around the lathe|64
arc|_(number)_ ratio of the circumference between 0 and 1|1
cap|_(number)_ tube cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
closed|_(boolean)_ to open/close the lathe circumference, should be set to `false` when used with `arc`|true
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

* [Playground Example of a Lathe](https://www.babylonjs-playground.com/#165IV6#72)
* [Playground Update of the Lathe](https://www.babylonjs-playground.com/#165IV6#73)

## Non Regular Polygon

**Please note that CreatePolygon uses Earcut, so, in non playground projects, you will have to add a reference to their [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or download their [npm package](https://github.com/mapbox/earcut#install)**

You must set at least the _shape_ option.

Example :
```javascript
var polygon = BABYLON.MeshBuilder.CreatePolygon("polygon", {shape: myShape, sideOrientation: BABYLON.Mesh.DOUBLESIDE, frontUVs: myFrontUVs, backUVs: myBackUVs}, scene);
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to turn **REQUIRED** |
holes|_(Vector3[])_  array of holes, each hole being an array of successive Vector3 | []
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 

All vectors for shape and holes are Vector3 and should be in the XoZ plane, ie of the form BABYLON.Vector3(x, 0, z) and in counter clockwise order;

[A Playground Example of a Polygon](https://playground.babylonjs.com/#4G18GY#6)

Uses [PolygonMeshBuilder](/How_To/polygonmeshbuilder)

## Extruded Non Regular Polygon

**Please note that ExtrudePolygon uses Earcut, so, in non playground projects, you will have to add a reference to their [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or download their [npm package](https://github.com/mapbox/earcut#install)**

You must set at least the _shape_ and _depth_ options.

Example :
```javascript
var polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", {shape: myShape, depth: 2, faceUV: myUVs}, scene);
```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to turn **REQUIRED** |
depth|_(number)_  the depth of the extrusion **REQUIRED** |
faceColors|_(Color4[])_ array of 3 _Color4_, one per box face|Color4(1, 1, 1, 1) for each side
faceUV|_(Vector4[])_ array of 3 _Vector4_, one per box face| UVs(0, 0, 1, 1) for each side
wrap|_(boolean)_ maps texture to sides with faceUV[1] when false texture mapped to each individual side, when true wrapped over all sides |false
holes|_(Vector3[])_  array of holes, each hole being an array of successive Vector3 | [] 
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

All vectors for shape and holes are Vector3 and should be in the XoZ plane, ie of the form BABYLON.Vector3(x, 0, z) and in counter clockwise order;

* [Playground Example of Extruded Polygon](https://playground.babylonjs.com/#4G18GY#7)
* [Playground Example of Extruded Polygons using faceUV one with wrap one without](https://www.babylonjs-playground.com/#D3943E#1)

Uses [PolygonMeshBuilder](/How_To/polygonmeshbuilder)

# Further Reading

## How To Make the Most of Options

[Side Orientation](/babylon101/Discover_Basic_Elements#side-orientation)  
[Updatable](/How_To/Updating_Vertices)  
[Face UV and Face Colors](/How_To/CreateBox_Per_Face_Textures_And_Colors)  
[Front and Back UV](/How_To/FrontandBackUV)

## Basic - L1

[Mesh Overview](/features/Shapes)  
[Set Shapes 101](/babylon101/Discover_Basic_Elements)  
[Parametric Shapes 101](/babylon101/Parametric_Shapes)  
[Set Shapes](/How_To/Set_Shapes)  
[Polyhedra Shapes](/How_To/Polyhedra_Shapes)  
[Tiled Planes and Boxes](/How_To/Tiled)  
[Decals](/How_To/Decals) 

## Mid Level - L2
 
[Ribbons In Detail](/How_To/Ribbon_Tutorial)

## More Advanced - L3
   
[Maths Makes Ribbons](/resources/Maths_Make_Ribbons)  
[How To Draw 3D Curves](/How_To/How_to_use_Curve3)




