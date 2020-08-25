# Parametric Shapes 101

These shapes or meshes are determined by parameters or mathematical data. They include lines, a system of lines, ribbons, tubes, extrusions, lathed shapes and irregular polygons. In the 101 course you will only meet lines and you will just use the _MeshBuilder_ method rather than the older legacy _Mesh_ method. How to create all the parametric shapes using either method and the advantages and disadvantages of both can be found by doing [Further Reading](#further_reading). 

## Lines

Lines are a series of line segments in 3D where the end of one line segment is the start of the next segment. Lines are described by a series of points in 3D space.

These three points (0, 0, 0), (0, 1, 1), (0, 1, 0) will form two line segments.

These points are given by position vectors which in Babylon.js are constructed as Vector3 objects and are placed in order in an array to be passed to the _CreateLines_ method.

```javascript
var myPoints = [];

var point1 = new BABYLON.Vector3(0, 0, 0);
myPoints.push(point1);
var point2 = new BABYLON.Vector3(0, 1, 1);
myPoints.push(point2);
var point3 = new BABYLON.Vector3(0, 1, 0);
myPoints.push(point3);

//or the possible alternative

var myPoints = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 1, 1),
    new BABYLON.Vector3(0, 1, 0)
];

```

The array of points MUST be passed to the _CreateLines_ function as the _points_ option

```javascript
//creates lines
var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene);
```
* [Playground Example of Lines](https://www.babylonjs-playground.com/#165IV6#60)
* [Playground Example of a Spiral from Lines](https://www.babylonjs-playground.com/#165IV6#61)

You can use dashed lines with _CreateDashedLines_ and adding the number of dashes _dashNb_ as an option.

* [Playground Example of a Spiral from Dashed Lines](https://www.babylonjs-playground.com/#165IV6#62)


For _CreateLines_ the options are

option|value|default value
--------|-----|-------------
points|_(Vector3[])_  array of Vector3, the path of the line **REQUIRED** |
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line mesh to be updated|null
colors|_(Color4[])_ array of Color4, each point color|null
useVertexAlpha|_(boolean)_ false if the alpha blending is not required (faster)|true

For _CreateDashedLines_ the options are

options|value|default value
--------|-----|-------------
points|_(Vector3[])_  array of Vector3, the path of the line **REQUIRED** |
dashSize|_(number)_  size of the dashes|3
gapSize|_(number)_  size of the gaps|1
dashNb|_(number)_  intended number of dashes|200
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line mesh to be updated|null


### Updatable Option

Lines and Dashed Lines have an updatable option. When this is _true_ it is possible to alter the data associated with each vertex of the Lines and so alter the path of the Lines. For more information see [Updating Vertices](/How_To/Updating_Vertices.html).

### Instance Option

Lines also have an instance option which means there is an alternative way to update the path of the lines just by passing a new set of points. For this to work the original lines creation must have the updatable option as _true_ and the lines created are passed as the value of the option instance. The number of points in the array MUST stay the same. 

Example :
```javascript
//creates lines
var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myArray, updatable: true}, scene);

// updates the existing instance of lines : no need for the parameter scene here
lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myNewArray, instance: lines});
```
* [Playground Example of a Spiral from Lines](https://www.babylonjs-playground.com/#165IV6#63)

Most but not all parametric shapes have the _instance_ option and so can have their mesh updated in this way.


# Next Step

In the previous section, about set shapes, you saw that when created they sit on top of each other at the origin. That is often the case with parametric shapes as well. So its time to move on to position meshes where needed and also find out about rotation and scaling. Ready? Sure you are! [Position, Rotation and Scaling](/babylon101/Position)

# Further Reading

[How to Create Parametric Shapes with MeshBuilder](/How_To/Parametric_Shapes)  
[How to Create Parametric Shapes Legacy Method](/How_To/Legacy_Param)  
[Advantages and Disadvantages](/features/Shapes#ways-of-creating-a-predefined-mesh)



