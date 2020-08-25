# How To Draw Curves

If you want to draw a circular path then it is easy enough to generate the points, in the XY plane, for this using

```javascript
var path = [];
for(var theta = 0; theta < 2 * Math.PI; theta +=deltaTheta ) {
    path.push(new BABYLON.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0));
```

When you are of a mind to do it you can work out some quite complex paths by hand. 

What follows is how to draw some mathematical curves by using the Babylon.js _Curve3_ object, from which you can extract the array of points you need to draw lines, ribbons, tubes and extruded shapes.

The general form is

```javascript
var curve = BABYLON.Curve3.Create.CURVETYPE(parameters);
```

## Quadratic Bezier Curve
http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_curves

![Wikipedia Quadratic Bezier Curve](http://upload.wikimedia.org/wikipedia/commons/3/3d/B%C3%A9zier_2_big.gif)

```javascript
var bezier2 = BABYLON.Curve3.CreateQuadraticBezier(origin, control, destination, nb_of_points);
```
* **origin** : _Vector3_ the origin point,
* **control** : _Vector3_ the control point,
* **destination** : _Vector3_ the destination point,
* **nb_of_points** : _number_ number of points wanted in the path array.

This static method returns an instance of _Curve3_.   
Just use the Curve3 _getPoints()_ method to fill your array : _getPoints()_ returns an array of successive _Vector3_.       
The _length()_ method returns the curve length.   
```javascript
var path = bezier2.getPoints();
var l = bezier2.length();
```
* [Playground Example - Bezier Quadratic Curve](https://www.babylonjs-playground.com/#W0XSPA)

## Cubic Bezier curve
http://en.wikipedia.org/wiki/B%C3%A9zier_curve# Higher-order_curves

![Wikipedia Cubic Bezier Curve](http://upload.wikimedia.org/wikipedia/commons/d/db/B%C3%A9zier_3_big.gif)
```javascript
var bezier3 = BABYLON.Curve3.CreateCubicBezier(origin, control1, control2, destination, nb_of_points)
```
* **origin** : _Vector3_ the origin point,
* **control1** : _Vector3_ the first control point,
* **control2** : _Vector3_ the second control point,
* **destination** : _Vector3_ the destination point,
* **nb_of_points** : _number_ the wanted final curve number of points in the array.

This static method returns an instance of _Curve3_.   
Just use the Curve3 _getPoints()_ method to fill your array : _getPoints()_ returns an array of successive _Vector3_.     
The _length()_ method returns the curve length.    
```javascript
var path = bezier3.getPoints();
var l = bezier3.length();
```

* [Playground Example - Bezier Cubic Curve](https://www.babylonjs-playground.com/#EY3EW4);


## Hermite Spline
http://en.wikipedia.org/wiki/Cubic_Hermite_spline

![Hermite Spline](/img/how_to/Mesh/hermite.jpg)

```javascript
var hermite = BABYLON.Curve3.CreateHermiteSpline(p1, t1, p2, t2, nbPoints);
```
* **p1** : _Vector3_ the origin point,
* **t1** : _Vector3_ the origin tangent vector,
* **p2** : _Vector3_ the destination point,
* **t2** : _Vector3_ the destination tangent vector,
* **nbPoints** : _number_ the wanted final curve number of points in the array.

This static method returns an instance of _Curve3_.    
Just use the Curve3 _getPoints()_ method to fill your array : _getPoints()_ returns an array of successive _Vector3_.      
The _length()_ method returns the curve length.   
```javascript
var path = hermite.getPoints();
var l = hermite.length();
```

* [Playground Example - Hermite Spline](https://www.babylonjs-playground.com/#P94GHL)

## Catmull-Rom Spline  
https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull.E2.80.93Rom_spline  

![Wikibooks Cubic Hermite spline](https://upload.wikimedia.org/wikipedia/commons/1/1c/Finite_difference_spline_example.png)

```javascript
var nbPoints = 20;                     // the number of points between each Vector3 control points
var points = [vec1, vec2, ..., vecN];  // an array of Vector3 the curve must pass through : the control points
var closed = true;                     // closes the curve when true
var catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(points, nbPoints, closed);
```
* **points** : _Vector3_ an array of Vector3 (the control points) the curve will pass through,
* **nbPoints** : _number_ the wanted curve number of points between each control point,
* **closed** : _boolean_ optional with default _false_; available from BJS V3.3; when true forms a closed curve.

This static method returns an instance of _Curve3_.    
Just use the Curve3 _getPoints()_ method to fill your array : _getPoints()_ returns an array of successive _Vector3_.       
The _length()_ method returns the curve length.   
```javascript
var path = catmullRom.getPoints();
var l = catmullRom.length();
```

* [Playground example - Catmull-Rom Spline Open Curve](https://www.babylonjs-playground.com/#1AU0M4)
* [Playground example - Catmull-Rom Spline Closed Curve](https://www.babylonjs-playground.com/#1AU0M4#18)

## Custom Curve3 Object
You can also make your own Curve3 object from a simple array of successive Vector3.   
Why would you do this and not just use the points to draw a line?   
Because the _Curve3_ object has a useful method, the  _continue()_ method, that allows you place the start of one _Curve3_ onto the end of another _Curve3_ without any calculations to match the start and end points of the curves.   

### Example 1
Create an array of  Vector3 along a simple sinus curve.  

```javascript
var mySinus = [];
for (var i = 0; i < 30; i++) {
 mySinus.push( new BABYLON.Vector3(i, Math.sin(i / 10), 0) );
}
var mySinusCurve = new BABYLON.Curve3(mySinus);
```

You would like to continue your _mySinus_ curve with a _bezier3_ curve and then join on a _bezier2_. 
 
```javascript
var myFullCurve = mySinusCurve.continue(bezier3).continue(bezier2);
```
The _continue()_ method returns a new _Curve3_ object and leaves _mySinusCurve3_, _bezier3_ and _bezier2_ unchanged.   

If you then need to draw the curve or use it for whatever you want you just get the array of points with the _getPoints()_ method. This method simply returns an array of successive _Vector3_.

```javascript
var path = myFullCurve.getPoints();
var extruded = BABYLON.Mesh.ExtrudeShape("extrudedShape", shape, path, 1, 0, scene);
```

If you need then to know the curve length, just use the _**length()**_ method.    
```javascript
var l = myFullCurve.length();
```

[Playgound Example - Joined Curves](https://www.babylonjs-playground.com/#00JR7Z)

### Example 2
Here is an example where a Hermite Spline is used to close smoothly a concatenation of two Bezier curves. As the spline is closing the curves the first and last points of the open continued curve need to be read from the array.  

* The first and last points of the concatenation are used as last and first point of the Hermite spline.  
* The first and last segments of the concatenation are used as last and first tangent vectors of the Hermite. Since these segments are quite small, they are scaled according to the concatenation _length_ so the longer the concatenation, the more curved the spline.   

```javascript
// two concatened cubic Bezier
var cubicA = BABYLON.Curve3.CreateCubicBezier(vA0, vA1, vA2, vA3, 50);
var cubicB = BABYLON.Curve3.CreateCubicBezier(vB0, vB1, vB2, vB3, 50);
var continued = cubicA.continue(cubicB);

// initial Hermite values from continued first and last segments
var t = continued.length() / 2;                             // tangent scale factor
var points = continued.getPoints();
var p1 = points[points.length - 1];                         // last continued point = first hermite point
var t1 = (p1.subtract(points[points.length - 2])).scale(t); // last segment scaled = hermite tangent t1
var p2 = points[0];                                         // first continued point = last hermite point
var t2 = (points[1].subtract(p2)).scale(t);                 // first segment scaled = hermite tangent t2

var hermite = BABYLON.Curve3.CreateHermiteSpline(p1, t1, p2, t2, 50);
continued = continued.continue(hermite);

// finally drawing a smooth closed curve
var closedCurve = BABYLON.Mesh.CreateLines("closed", continued.getPoints(), scene);
```

* [Playground Example - Closed Joined Curves](https://www.babylonjs-playground.com/#2GCEVH)

The orange and yellow curves are the original Bezier curves.   
In light blue, these two curves are continued by each other and a hermite curve is also added in continuation to close the path.   

# Further Reading

# Basic - Level 1
[How To Create Parametric Shapes](/How_To/parametric_shapes)

## More Advanced - Level 3
[How To Use Path3D](/How_To/How_to_use_Path3D)  
