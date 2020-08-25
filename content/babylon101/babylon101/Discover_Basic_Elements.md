# Set Shapes 101

These are shapes that usually already have names in everyday use. They are a box (or cuboid), a sphere, a cylinder, a cone, regular polygons, a plane and a specialist horizontal plane called the ground. Slightly less well known but also included in set shapes are a torus, a torus knot and the polyhedra. You will have to wait for the next section to learn how to create shapes that have no everyday names but are formed through data sets and parameters. These are termed _parametric shapes_.

In the 101 course you will only meet a limited number of set shapes, starting on this page with boxes, spheres, planes and ground. Also you will just use the _MeshBuilder_ method of shape creation rather than the older legacy _Mesh_ method. How to create all the set shapes using either method and the advantages and disadvantages of both can be found by doing [Further Reading](#further-reading).

## MeshBuilder Method

The general form to create a set shape is:

var _shape_ = BABYLON.MeshBuilder.Create<i>Shape</i>(name, options, scene);

The options parameter allows you to do such things as set the size of the shape and set whether you can update it or not. Specific examples below.

### Box

```javascript
var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene); // default box

var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 5, width: 2, depth: 0.5}, scene);
```

option|value|default value
--------|-----|------------
size|_(number)_ size of each box side|1
height|_(number)_ height size, overwrites _size_ property|size
width|_(number)_ width size, overwrites _size_ property|size
depth|_(number)_ depth size,  overwrites _size_ property|size
faceColors|_(Color4[])_ array of 6 _Color4_, one per box face|Color4(1, 1, 1, 1) for each side
faceUV|_(Vector4[])_ array of 6 _Vector4_, one per box face| UVs(0, 0, 1, 1) for each side
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

* [Playground Example of a Cuboid](https://www.babylonjs-playground.com/#3QW4J1#1)

### Sphere

```javascript
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene); //default sphere

var mySphere = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 2, diameterX: 3}, scene);
```

option|value|default value
--------|-----|-------------
segments|_(number)_ number of horizontal segments|32
diameter|_(number)_ diameter of the sphere|1
diameterX|_(number)_ diameter on X axis, overwrites _diameter_ property|diameter
diameterY|_(number)_ diameter on Y axis, overwrites _diameter_ property|diameter
diameterZ|_(number)_ diameter on Z axis, overwrites _diameter_ property|diameter
arc|_(number)_ ratio of the circumference (latitude) between 0 and 1|1
slice|_(number)_ ratio of the height (longitude) between 0 and 1|1
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE

* [Playground Example of an Ellipsoid](https://www.babylonjs-playground.com/#K6M44R)

### Plane

```javascript
var plane = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene); // default plane

var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 2}, scene);
```

option|value|default value
--------|-----|-------------
size|_(number)_ side size of the plane|1
width|_(number)_ size of the width|size
height|_(number)_ size of the height|size
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) 
sourcePlane|_(Plane)_ source plane (maths) the mesh will be transformed to|null

* [Playground Example of a Plane](https://www.babylonjs-playground.com/#LXZPJK)

_sourcePlane_ is a unique option for a plane mesh and provides a method to orientate and position it. For now just consider its orientation which on creation is the vector (0, 0, 1). Now should you want the orientation to be the vector (0, -1, 1) then you create a source plane using

```javascript
var sourcePlane = new BABYLON.Plane(0, -1, 1, 0);
sourcePlane.normalize();
```
This creates a mathematical plane which is used as the orientation source. The fourth parameter is a distance moved in the direction of the orientation vector. At this stage leave as 0. 

* [Playground Example with Source Plane](https://www.babylonjs-playground.com/#LXZPJK#2)

### Ground

```javascript
var ground = BABYLON.MeshBuilder.CreateGround("ground", {}, scene); //default ground

var myGround = BABYLON.MeshBuilder.CreateGround("myGround", {width: 6, height: 4, subdivisions: 4}, scene);
```

option|value|default value
--------|-----|-------------
width|_(number)_ size of the width|1
height|_(number)_ size of the height|1
updatable|_(boolean)_ true if the mesh is updatable|false
subdivisions|_(number)_ number of square subdivisions|1

* [Playground Example of Ground](https://www.babylonjs-playground.com/#MJ6YSM)

A variation on _CreateGround_ is [_CreateGroundFromHeightMap_](/babylon101/Height_map) which lets you form undulating ground rather than a flat plane.

## Face Colors or UV

This is only available on a limited number of meshes that have distinct faces such as a box but not a sphere. This allows you to give each face for those meshes an individual color or image. [Find out about Face Colors and UV](/How_To/CreateBox_Per_Face_Textures_And_Colors).

More about UV mapping on [Wikipedia](https://en.wikipedia.org/wiki/UV_mapping).

## Updatable

Where a mesh has the updatable parameter set to true it means that it is possible to alter the data associated with each vertex of the mesh and so alter the shape of the mesh. For more information see [How to Update Vertices](/How_To/Updating_Vertices.html)


## Side Orientation
  
The side orientation option is used to change how each side of a mesh is viewed.  

There are four possible values for this option :  

  * BABYLON.Mesh.FRONTSIDE,
  * BABYLON.Mesh.BACKSIDE,
  * BABYLON.Mesh.DOUBLESIDE,
  * BABYLON.Mesh.DEFAULT which is the default value and equals FRONTSIDE currently.

In the following examples you can compare between DEFAULT and DOUBLESIDE by moving your screen pointer left and right to rotate the planes.
* [Playground Example of a DEFAULT Plane](https://www.babylonjs-playground.com/#LXZPJK)
* [Playground Example of a DOUBLESIDE Plane](https://www.babylonjs-playground.com/#LXZPJK#1)


## Front and Back UV

When a mesh has a sideOrientation option present and it is set to DOUBLESIDE then it is possible for the front and back to display different images.

## Position and Rotation

When you create a mesh it is always centered at the origin and in line with the axes. You will want to give it a different position and rotation. If you can't wait then skip the next step and go to [How to Change Position and Rotation](/babylon101/Position)

# Next Step 

Now that you have some of the set shapes under your belt its time to find out about [Shapes Less Set in Their Ways](/babylon101/Parametric_Shapes)

# Further Reading

## Basic - L1
[How to Create Set Shapes with MeshBuilder](/How_To/Set_Shapes)  
[How to Create Set Shapes Legacy Method](/How_To/Legacy_Set)  
[Advantages and Disadvantages](/features/Shapes#ways-of-creating-a-predefined-mesh)


