# How To Create Polyhedra

There are fifteen polyhedra that can be created simply by setting its type number from 0 to 14, and one, the icosphere that is created by name to which more variations can be applied. 
However there are plenty more to choose from, just follow the instructions under [Custom Polyhedra](#custom-polyhedra).

## Polyhedron
Example :
```javascript
var octahedron = BABYLON.MeshBuilder.CreatePolyhedron("oct", {type: 1, size: 3}, scene);
```
Properties, all optional :

property|value|default value
--------|-----|-------------
type|_(number)_ polyhedron type in the range [0,14]|0
size|_(number)_ polyhedron size|1
sizeX|_(number)_ X polyhedron size, overwrites the _size_ property|1
sizeY|_(number)_ Y polyhedron size, overwrites the _size_ property|1
sizeZ|_(number)_ Z polyhedron size, overwrites the _size_ property|1
custom|_(polygonObjectReference)_ a polyhedron object, overwrites the _type_ property|null
faceColors|_(Color4[])_ array of _Color4_, one per face|Color4(1, 1, 1, 1) for each side
faceUV|_(Vector4[])_ array of _Vector4_, one per face| UVs(0, 0, 1, 1) for each side
flat|_(boolean)_ if false, a polyhedron has a single global face, _faceUV_ and _faceColors_ are ignored|true
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

To understand how to set _faceUV_ or _faceColors_, please read about [Face Colors and Textures for a Box](/How_To/CreateBox_Per_Face_Textures_And_Colors) taking into account the right number of faces of your polyhedron, instead of only 6 for a box. 


### Provided Polyhedron Types :

type|name|side number
----|----|-----------
0|Tetrahedron|4
1|Octahedron|8
2|Dodecahedron|12
3|Icosahedron|20
4|Rhombicuboctahedron|26
5|Triangular Prism|5
6|Pentagonal Prism|7
7|Hexagonal Prism|8
8|Square Pyramid (J1)|5
9|Pentagonal Pyramid (J2)|6
10|Triangular Dipyramid (J12)|6
11|Pentagonal Dipyramid (J13)|10
12|Elongated Square Dipyramid (J15)|12
13|Elongated Pentagonal Dipyramid (J16)|15
14|Elongated Pentagonal Cupola (J20)|22

## Custom Polyhedra

If you need to use a custom polyhedron visit https://www.babylonjs-playground.com/#21QRSK#15 : minimize the code editor by unchecking box by Editor under Settings and note the polyhedron names under the mouse pointer. 
The data for each name can be found in the polyhedra.js file here https://github.com/BabylonJS/Extensions/tree/master/Polyhedron
Find the name and copy/paste the wanted polyhedron object in your code like this :

```javascript
var heptagonalPrism = { "name":"Heptagonal Prism", "category":["Prism"], "vertex":[[0,0,1.090071],[0.796065,0,0.7446715],[-0.1498633,0.7818315,0.7446715],[-0.7396399,-0.2943675,0.7446715],[0.6462017,0.7818315,0.3992718],[1.049102,-0.2943675,-0.03143449],[-0.8895032,0.487464,0.3992718],[-0.8658909,-0.6614378,-0.03143449],[0.8992386,0.487464,-0.3768342],[0.5685687,-0.6614378,-0.6538232],[-1.015754,0.1203937,-0.3768342],[-0.2836832,-0.8247995,-0.6538232],[0.4187054,0.1203937,-0.9992228],[-0.4335465,-0.042968,-0.9992228]],
"face":[[0,1,4,2],[0,2,6,3],[1,5,8,4],[3,6,10,7],[5,9,12,8],[7,10,13,11],[9,11,13,12],[0,3,7,11,9,5,1],[2,4,8,12,13,10,6]]};

var mesh = BABYLON.MeshBuilder.CreatePolyhedron("h", {custom: heptagonalPrism}, scene);
```

## IcoSphere
This a sphere based upon an icosahedron with 20 triangular faces which can be subdivided.
```javascript
var icosphere = BABYLON.MeshBuilder.CreateIcoSphere("ico", {radius: 5, radiusY: 8, subdivisions: 6}, scene);
```

Properties, all optional :

property|value|default value
--------|-----|-------------
radius|_(number)_ radius | 1
radiusX|_(number)_  the X radius, overwrites the radius value|radius
radiusY|_(Vector3)_  the Y radius, overwrites the radius value|radius
radiusZ|_(number)_ the Z radius, overwrites the radius value|radius
subdivisions|_(number)_ the number of subdivisions|4
flat|_(boolean)_ if true, the mesh faces have their own normals|true
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

An example of an IcoSphere: https://www.babylonjs-playground.com/#24DUYD#1

and one with animation: https://www.babylonjs-playground.com/#E3TVT#1

## Updatable

Where a polyhedral shape has an updatable parameter in its options it means that it is possible to alter the data associated 
with each vertex of the mesh and so alter the shape of the mesh. For more information see [Updating Vertices](/How_To/Updating_Vertices.html)

# Further Reading

## Mid Level - L2  
[Set Shapes](/babylon101/Discover_Basic_Elements)  
[Parametric Shapes](/babylon101/Parametric_Shapes)  
[Ribbons In Detail](/How_To/Ribbon_Tutorial)  
[Maths Makes Ribbons](/resources/Maths_Make_Ribbons)  
[Decals](/How_To/Decals) 
