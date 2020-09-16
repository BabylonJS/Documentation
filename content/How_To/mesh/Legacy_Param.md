# How To Create Parametric Shapes using Legacy Method
 
## Ribbon

For details on what it is and how it is constructed you might want to read the [Ribbon Tutorial](/How_To/Ribbon_Tutorial)

```javascript
var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", [path1, path2, ..., pathn], false, false, 0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, pathArray, closeArray, closePath, offset, scene, updatable? (if the mesh must be modified later)  and the optional side orientation (see below).


  * name : a string, the name you want to give to your shape,
  * pathArray : an array populated with paths. Paths are also arrays, populated with series of successive _Vector3_. You need at least one path to construct a ribbon and each path must contain at least four _Vector3_,
  * closeArray : boolean, if true an extra set of triangles is constructed between the last path and the first path of _pathArray_,
  * closePath : boolean, if true the last point of each path of _pathArray_ is joined to the first point of this path,
  * offset : integer (default half the _path_ size) mandatory only if the _pathArray_ contents only one path. The ribbon will be constructed joining each i-th point of the single path to the i+offset-th point. It is ignored if _pathArray_ has more than one path,
  * scene : the current scene object,
  * updatable : boolean, if the ribbon should allow updating later,
  * sideOrientation : the wanted side-orientation (BABYLON.Mesh.FRONTSIDE / BACKSIDE / DOUBLESIDE / DEFAULT).

The last two parameters can be omitted if you just need the default behavior :
```javascript
var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", [path1, path2, ..., pathn], false, false, 0, scene);
```

##  Tube

```javascript
var tube = BABYLON.Mesh.CreateTube("tube", [V1, V2, ..., Vn], radius, tesselation, radiusFunction, cap, scene, false, BABYLON.Mesh.DEFAULTSIDE);

```
Parameters are : name, path, radius, tesselation, optional radiusFunction, cap, scene, updatable, sideOrientation.

  * name : string, the name of the tube mesh,
  * path : an array of successive Vector3, at least two Vector3,
  * radius : nuumber, the tube radius, used when _radiusFunction_ parameter set to _null_,
  * tesselation : the number of radial segments,
  * radiusFunction : _optional_, a javascript function returns a radius value. This can be set to _null_,
  * cap : BABYLON.Mesh.NO_CAP, BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL,  
  * updatable : boolean, if the tube should allow updating later,
  * sideOrientation : the wanted side orientation (front, back or double side).

The last two parameters can be omitted if you just need the default behavior :
```javascript
var tube = BABYLON.Mesh.CreateTube("tube", [V1, V2, ..., Vn], radius, tesselation, radiusFunction, cap, scene);
```
While a tube can just be a cyclinder it can be far more than that
  
* [Playground Example with a simple cos/sin path](https://www.babylonjs-playground.com/#LG3GS#8)   


Your function must just return a radius value.  
Example :
```javascript
var myFunction = function(i, distance) {
  var radius = 3 * Math.cos(distance / 5);
  return radius;
};
var tube = BABYLON.Mesh.CreateTube("lumps", path, null, 20, myFunction, scene);
```

Here is an example with both an _i_ sinusoidal radius function and _x_ sinusoidal incrementing path :
https://www.babylonjs-playground.com/#LG3GS#9    
Here's another example with a circular path and varying radius : https://www.babylonjs-playground.com/#LG3GS#10  

## Non Regular Polygon

**Please note that CreatePolygon uses Earcut, so, in non playground projects, you will have to add a reference to their [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or download their [npm package](https://github.com/mapbox/earcut#install)**

```javascript
var polygon = BABYLON.Mesh.CreatePolygon("polygon", [V1, V2, ..., Vn], scene, [[V1, V2, ..., Vn], [V1, V2, ..., Vn], ....[V1, V2, ..., Vn]], false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, polygon shape as an array of comma-separated vectors,  scene, optional holes as an array of an array of comma-separated vectors, optional updatable and the optional side orientation. The last three parameters can be omitted if you just need the default behavior :

NOTE all vectors are Vector3 and should be in the XoZ plane, ie of the form BABYLON.Vector3(x, 0, z);

```javascript
var polygon = BABYLON.Mesh.CreatePolygon("cylinder", [V1, V2, ..., Vn], scene);
```
Uses [PolygonMeshBuilder](/How_To/polygonmeshbuilder)

## Extrusion of a Non Regular Polygon

**Please note that ExtrudePolygon uses Earcut, so, in non playground projects, you will have to add a reference to their [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or download their [npm package](https://github.com/mapbox/earcut#install)**

```javascript
var polygon = BABYLON.Mesh.ExtrudePolygon("polygon", [V1, V2, ..., Vn], 2, scene, [[V1, V2, ..., Vn], [V1, V2, ..., Vn], ....[V1, V2, ..., Vn]], false, BABYLON.Mesh.DEFAULTSIDE);
```

Parameters are: name, polygon shape as an array of comma-separated vectors, depth, scene, optional holes as an array of an array of comma-separated vectors, optional updatable and the optional side orientation. The last three parameters can be omitted if you just need the default behavior :

NOTE all vectors are Vector3 and should be in the XoZ plane, ie of the form BABYLON.Vector3(x, 0, z) and in counter clockwise order;

```javascript
var polygon = BABYLON.Mesh.CreatePolygon("polygon", [V1, V2, ..., Vn], 2, scene);
```

Uses [PolygonMeshBuilder](/How_To/polygonmeshbuilder)

## Lines

```javascript
var lines = BABYLON.Mesh.CreateLines("lines", [
    new BABYLON.Vector3(-10, 0, 0),
    new BABYLON.Vector3(10, 0, 0),
    new BABYLON.Vector3(0, 0, -10),
    new BABYLON.Vector3(0, 0, 10)
], scene);
```
Parameters are: name, [array of comma-separated vectors], scene. 

I could explain how the Lines Mesh constructor works, but I think you can see how it works just by looking at the demo code above.  Notice the [ and ].  Those are the enclosing tokens for an array, yet another kind of Javascript value.  The first vector3 of the array is the starting location for drawing lines.  After that, a comma, and then the next vector3 location... indicating where the line is drawing-to next.  Then, another comma, and another vector3 to a new location.  You can add as many vectors as you wish, but notice that the LAST vector3 does not have a comma following it.  Please make your array of vectors be formatted similarly.    

## Dashed Lines

```javascript
var dashedlines = BABYLON.Mesh.CreateDashedLines("dashedLines", [v1, v2, ... vn], dashSize, gapSize, dashNb, scene);
```
Parameters are : name, [array of Vectors3], dashSize, gapSize, dashNumber, scene.    
As for Lines, a line along the vectors3 will be displayed in space. It will try to set _dashNumber_ strokes on this line depending on the length of each segment between two successive vectors3.    
_dashSize_ and _gapSize_ are relative to each other dash and gap sizes within these strokes.    

## Extruded Shape
What is extrusion ?  
Extrusion is the way to transform a 2D shape into a volumic shape.  
Let's imagine that you define a star shape by filling an array with successive _Vector3_. In order to have a 2D shape, you only set these points in the xOy plane, so every z coordinate is zero.  
ex : https://www.babylonjs-playground.com/#RF9W9  
Let's show the World axis so it is clearer : https://www.babylonjs-playground.com/#RF9W9#1  
Let's now imagine you could stretch this 2D shape along the Z-axis to give it some volume... this is extrusion :  https://www.babylonjs-playground.com/#RF9W9#30    

Let's now imagine you can extrude your star along a 3D path in space, a sinus curve for example, and not only along the z-axis.  
https://www.babylonjs-playground.com/#RF9W9#31    


Extrusion can be accomplished with two different methods. A basic one and an advanced or custom one.  

BASIC METHOD  
```javascript
BABYLON.Mesh.ExtrudeShape(name, shape, path, scale, rotation, cap, scene, updatable?, sideOrientation)
```
* name : the extruded mesh name.
* shape : the shape to be extruded, an array of successive Vector3.
* path : the path to extrude the shape along, an array of successive Vector3.
* scale : _default 1_, the value to scale the initial shape.
* rotation : _default 0_, the step value to rotate the shape at each path point.
*  cap : BABYLON.Mesh.NO_CAP, BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL.  
* scene : the current scene.
* updatable? : if the mesh is updatable.
* sideOrientation : the side orientation - _front, back_ or _double_.  

If we change the _scale_ value from 1 to 3 for example (line 84), the initial star is scaled to 3 along the curve : https://www.babylonjs-playground.com/#RF9W9#526 
If we now change the _rotation_ step value from 0 to _PI / 24_ for example, the curve is twisted this angle at each curve point : https://www.babylonjs-playground.com/#RF9W9#218  

Of course, even if you define your 2D shape in the xOy plane as described, the extrusion still works along any path direction : https://www.babylonjs-playground.com/#RF9W9#32    

Moreover, the shape doesn't need to be closed. You can have a simple (or complex) open shape : https://www.babylonjs-playground.com/#RF9W9#7  
Extrusion : https://www.babylonjs-playground.com/#RF9W9#33      
Extrusion with rotation : https://www.babylonjs-playground.com/#RF9W9#34    

Remember that your shape doesn't need to be centered on the coordinate system either. Here is an offset simple shape : https://www.babylonjs-playground.com/#RF9W9#10  
Extrusion (the extrusion path is shown in magenta so the offset is visible) : https://www.babylonjs-playground.com/#RF9W9#35    
Now rotation... around the path axis : https://www.babylonjs-playground.com/#RF9W9#36    
As you can see, this is a way to build complex curved helix meshes without handling maths or simpler ones : https://www.babylonjs-playground.com/#RF9W9#37    
As the shape to be extruded is unpredictable, it is assumed that the cap, if want to add it one or two to your extruded mesh, is computed with its center set to the shape barycenter.  



ADVANCED METHOD  
```javascript
BABYLON.Mesh.ExtrudeShapeCustom(name, shape, path, scaleFunction, rotateFunction, ribbonCloseArray, ribbonClosePath, cap, scene)
```
* name : the extruded mesh name,
* shape : the shape to be extruded, an array of successive Vector3.
* path : the path to extrude the shape along, an array of successive Vector3.
* scaleFunction : a custom javascript function. This function is called on each path point and is given the _i_ position of the point in the path and its _distance_ from the begining of the path. It must return a _scale_ numeric value. This value will be the scaling applied to the shape drawn at the _i-th_  point.
* rotationFunction : a custom javascript function. This function is called on each path point and is given the _i_ position of the point in the path and its _distance_ from the begining of the path. It must return a _rotation_ numeric value. This value will be the rotation applied to the shape drawn at the _i-th_  point.
* ribbonCloseArray : _default false_, boolean. The underlying ribbon _closeArray_  parameter. This can be used to automatically close a path with right normals computation.
* ribbonClosePath : _default false_, boolean. The underlying ribbon _closePath_  parameter. This can be used to automatically close a shape with right normals computation.  
*  cap : BABYLON.Mesh.NO_CAP, BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL.  
* scene : the current scene.
* updatable? : if the mesh is updatable.
* sideOrientation : the side orientation - _front, back_ or _double_.

In this advanced method, the _scale_ and _rotation_ parameters are replaced by custom functions.  

  _scaleFunction_   
This javascript function will be called on each path point iteration when extruding. It will be passed two parameters : _i_ and _distance_.  

* i is the point position in the path, starting from zero for the first point.
* distance is the current point distance from the begining of the path.  

This custom function must return a _scale_ numeric value which will be applied to the shape on the _i-th_ point.  
Example :
```javascript
var myScale = function(i, distance) {
  var scale = 2 * Math.sin(i / 5);
  return scale;
};
```

Here is an example with an unclosed un-centered simple shape whose scale evolves linearly along the path : https://www.babylonjs-playground.com/#RF9W9#38    
Now if we use a sinus scaling function instead and as the shape isn't centered, we get interesting results : https://www.babylonjs-playground.com/#RF9W9#39    
We can even emulate rotation by alternately scaling positive/negative : https://www.babylonjs-playground.com/#RF9W9#40    


  _rotateFunction_  
This javascript function will be called on each path point iteration when extruding. It will be passed two parameters : _i_ and _distance_.  

* i is the point position in the path, starting from zero for the first point.
* distance is the current point distance from the begining of the path. 

This custom function must return a _rotation_ numeric value which will be applied to the shape on the _i-th_ point.  
Example :
```javascript
var myRotation = function(i, distance) {
  var rotation = distance / 20;
  return rotation;
};
```
Here is an example of constant scale and rotation evolving with the distance : https://www.babylonjs-playground.com/#RF9W9#41    
You can set a non-linear rotation function of course, sinus here : https://www.babylonjs-playground.com/#RF9W9#42    



  Fixed values

This advanced method needs two custom functions. But you may want to use a custom scale function with a fixed (or no) rotation function, for example. In this case, just pass a custom rotation function returning a fixed value :  
Example :  
```javascript
var noRotation = function(i, distance) {
  return 0;
};
```
If you carefully read the code of this previous example, you can see in line 41 that the _scaleFunction_ returns the constant 1 value : https://www.babylonjs-playground.com/#RF9W9#41      

  _ribbonCloseXXX_ parameters

The extruded mesh is based on an underlying ribbon. When you extrude a shape, you actually make a particular ribbon.  
This means you can also set this ribbon _closeArray_ and _closePath_ parameter if you need to automatically close the extruded shape.  
NOTE : the _closeXXX_ names are the ribbon ones. Not the extruded shape ones.  
So it may be confusing because :  

* _ribbonCloseArray_ set to true will close your shape extrusion path,
* _ribbonClosePath_ set to true will close your shape itself (if unclosed).  

Let's now do this unclosed, un-centered extruded shape : https://www.babylonjs-playground.com/#RF9W9#20  
And this almost circular path : https://www.babylonjs-playground.com/#RF9W9#21  
Extrusion with constant scale and no rotation : https://www.babylonjs-playground.com/#RF9W9#43    
Now let's set the _ribbonCloseArray_ to true :https://www.babylonjs-playground.com/#RF9W9#44    
As you can see, it closes the extrusion path. Let's set it back to false and let's set the _ribbonClosePath_ to true instead : https://www.babylonjs-playground.com/#RF9W9#45    
Now the shape is closed.  
Both together : https://www.babylonjs-playground.com/#RF9W9#46    


 Summary  
At last, the extrude custom function call would be, for example:  
```javascript
BABYLON.Mesh.ExtrudeShapeCustom("extruded", shape, path, myScale, myRotation, false, true, scene)
```
A shape is an array of successive Vector3. This means 2D or 3D shapes can be extruded as well.  
The shape is to be designed in the local coordinate system knowing that the z-axis will be the extrusion path axis.  
Finally, shapes don't have to be centered in the local coordinate system.  
A centered shape will be extruded symmetrically centered along the path axis. An un-centered shape will be extruded offset from the path axis.  

Easy way to generate strange shapes : https://www.babylonjs-playground.com/#RF9W9#47   

# Further Reading

## Basic - L1

[Mesh Overview](/features/Shapes)  
[Set Shapes 101](/babylon101/Discover_Basic_Elements)  
[Parametric Shapes 101](/babylon101/Parametric_Shapes)  
[Set Shapes](/How_To/Set_Shapes)  
[Parametric Shapes](/How_To/Parametric_Shapes)  
[Polyhedra Shapes](/How_To/Polyhedra_Shapes)  
[Tiled Planes and Boxes](/How_To/Tiled)  