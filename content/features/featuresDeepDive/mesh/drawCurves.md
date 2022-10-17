---
title: Drawing Curves
image: 
description: Learn how to draw curves in Babylon.js.
keywords: diving deeper, meshes, curves
further-reading:
    - title: How To Create Parametric Shapes
      url: /features/featuresDeepDive/mesh/creation/param
    - title: How To Use Path3D
      url: /features/featuresDeepDive/mesh/path3D
video-overview:
video-content:
---

## How To Draw Curves

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
## Arc Through Three Points
Available from version 5.0.0.
Given three points in space, not in a straight line, it is always possible to draw join the points up using a circular arc or to draw a circle through the three points.

```javascript
var arc = BABYLON.Curve3.ArcThru3Points(first, second, third, steps, closed, fullCircle)
```
* **first** _Vector3_ the first point the arc must pass through.
* **second** _Vector3_ the second point the arc must pass through.
* **third** _Vector3_ the third point the arc must pass through.
* **steps** _number_ the larger the number of steps the more detailed the arc.
* **closed** _boolean_ optional with default false, when true forms the chord from the first and third point
* **fullCircle** _boolean_ optional with default false, when true forms the complete circle through the three points

This static method returns an instance of _Curve3_.   
Just use the Curve3 _getPoints()_ method to fill your array : _getPoints()_ returns an array of successive _Vector3_.     
The _length()_ method returns the curve length.    
```javascript
var path = arc.getPoints();
var l = arc.length();
```

<Playground id="#KENEJP#3" title="Arc" description="Open arc."/>   


<Playground id="#KENEJP#4" title="Segment" description="Segment."/>  


<Playground id="#KENEJP#5" title="Full Circle" description="Full Circle."/>  


## Quadratic Bezier Curve
http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_curves

![Wikipedia Quadratic Bezier Curve](https://upload.wikimedia.org/wikipedia/commons/3/3d/B%C3%A9zier_2_big.gif)

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
<Playground id="#W0XSPA" title="Drawing A Bezier Quadratic Curve" description="Simple example of drawing a bezier quadratic curve."/>

## Cubic Bezier curve
http://en.wikipedia.org/wiki/B%C3%A9zier_curve# Higher-order_curves

![Wikipedia Cubic Bezier Curve](https://upload.wikimedia.org/wikipedia/commons/d/db/B%C3%A9zier_3_big.gif)
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

<Playground id="#EY3EW4" title="Drawing A Bezier Cubic Curve" description="Simple example of drawing a bezier cubic curve."/>


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

<Playground id="#P94GHL" title="Drawing A Hermite Spline" description="Simple example of drawing a Hermite Spline curve."/>

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

<Playground id="#1AU0M4" title="Drawing A Catmull-Rom Spline Open Curve" description="Simple example of drawing a Catmull-Rom Spline Open Curve."/>
<Playground id="#1AU0M4#18" title="Drawing A Catmull-Rom Spline Closed Curve" description="Simple example of drawing a Catmull-Rom Spline Closed Curve."/>

## Hermite Quaternion Spline

```javascript
BABYLON.Quaternion.Hermite(point0, tangent0, point1, tangent1, amount)
```

allows the interpolation of quaternions for use in animation. As a quaternion is a 4D object how can you visualize the Hermite quaternion spline that the interpolation uses? By representing the hyperspline in 3D space.

This is achieved by mapping a rotation quaternion onto a 3D vector.


### The Math
What is needed if a function $f$ from rotation quaternions to 3D vectors of the form 

$f(x, y, z, w) = (x_{v}, y_{v}, z_{v})$

For a rotation quaternion there are two things to note:  

1. &nbsp; $x^2 + y^2 + z^2 + w^2 = 1$
2. &nbsp; $(x, y, z, w)$ and $(-x, -y, -z, -w)$ are equivalent.

The equivalence of $(x, y, z, w)$ and $(-x, -y, -z, -w)$ can be seen in the following

<Playground id="#9S6YUQ" title="Equivalent Rotation Quaternions" description="Scale by -1 produces equivalent rotation quaternions."/>  

It follows that set of rotation quaternions $(x, y, z, w)$ where $x^2 + y^2 + z^2 + w^2 = 1$ and $-1 \leq x, y, z, \leq 1$ and $0 \leq w \leq 1$ covers all possible rotations.

$x^2 + y^2 + z^2 + w^2 = 1$ and so  
$x^2 + y^2 + z^2 = 1 - w^2$ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Eq 1

Since $0 \leq w \leq 1$ then $0 < 1 \leq (1 + w) \leq 2$ 

Dividing Eq 1 by $(1 + w)^2$, which can never be $0$

$x^2 + y^2 + z^2 \over (1 + w)^2$ = $(1 - w^2) \over (1 + w)^2$ = $(1 - w) \over (1 + w)$

This gives the mapping 

$f(x, y, z, w)$ = ($x \over (1 + w)$, $y\over (1 + w)$, $z\over (1 + w)$ )


Each rotation quaternion where $0 \leq w \leq 1$ is mapped onto one of a series of concentric spherical shells of radius, $r$,  

$0 \leq r^2$ = $(1 - w) \over (1 + w)$ $\leq 1$.


![Hermite Quaternion Spline](/img/how_to/Mesh/quatshells.png)

The center of the shells represents the rotation quaternion $(0, 0, 0, 1)$, the outer, white ,,  is a unit sphere where $w = 0$.

The process can be reversed, the inverse function $f^{-1}$ returns the rotation quaternion from a point $(x, y, z)$ from the shells.

Since the radius, r,  of the sphere at $(x, y, z)$ is such that  $r^2 = x^2 + y^2 + z^2$ and 

$r^2$ = $(1 - w) \over (1 + w)$ then

$w$ = $(1 - r^2) \over (1 + r^2)$ and 

$1 + w$ = $2 \over (1 + r^2)$ and

$f^{-1}(x, y, z)$ = ($2x \over (1 + r^2)$, $2y \over (1 + r^2)$, $2z \over (1 + r^2)$, $(1 - r^2) \over (1 + r^2)$)


### Drawing
The following function will return a Curve3 within a unit sphere representing a Hermite quaternion spline in 3D space using the math above.

```javascript
const hermiteQuarternionSpline = (p1, t1, p2, t2, nbPoints) => {
  const hermite = new Array();
  const step = 1.0 / nbPoints;
  for (let i = 0; i <= nbPoints; i++) {
    const q = BABYLON.Quaternion.Hermite(p1, t1, p2, t2, i * step);
    q.normalize();
    if (q.w < 0) {
      q.scaleInPlace(-1);
    }
    const v = new BABYLON.Vector3(q.x / (1 + q.w), q.y / (1 + q.w), q.z / (1 + q.w));
    hermite.push(v);
  }
  return new BABYLON.Curve3(hermite);
}
```
* **p1** : _Quaternion_ the origin point,
* **t1** : _Quaternion_ the origin tangent vector,
* **p2** : _Quaternion_ the destination point,
* **t2** : _Quaternion_ the destination tangent vector,
* **nbPoints** : _number_ the wanted final curve number of points in the array.

**Warning**  
Using BABYON.Quaternion.RotationAxis(axis, angle) to create any of p1, t1, p2, t2 does not produce the expected results. Other means of producing rotation quaternions other than a direct creation should also be checked to ensure the one produced is of the range required for the mapping to work.

To produce a vector on the outer , requires a rotation quaternion with $w = 0$

Take the rotation quaternion from 

```javascript
new BABYLON.Quaternion(1, 1, 1, 0).normalize();  //giving (0.5774, 0.5774, 0.5774, 0) to 4 dp
```

However using 

```javascript
BABYON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 1, 1), 0); // gives (0, 0, 0, 1) 
```
and whilst this may be an equivalent quaternion it places the vector at the center of the shells not on the outer ,.  
**End Warning**  

<Playground id="#4B0VBG" title="Hermite Quaternion Spline" description="Hermite quaternion spline represented in 3D space."/>  

As it is difficult to visualize the spline from pure quaternions it would be useful if there was an editor to draw the representation of the spline in 3D space.

### A (Very) Basic Editor

<Playground id="#4B0VBG#1" title="Hermite Quaternion Editor" description="Hermite quaternion spline Editor 3D space."/>  

This playgound allows you to drag representatives of the start (green) and end (red) quaternions within the unit sphere in 3D space. The representation of the start and end quaternion tangents (purple) are attached to the respective start and end controls. The tangents may also be dragged around (invisible) sphere shells centered on the start and end controls. The shells, and hence radius, may be adjusted using the up and down arrow keys (or w and x) for the selected control. Whilst dragging or adjusting the radius the camera is detached. The camera will be attached whenever any dragging is ended or when using keys you can attach it by pressing the spacebar.

The representation of the spline in 3D space is drawn as you adjust the controls. To apply the Hermite quaternion spline created to the box click on the animate button.


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

<Playground id="#00JR7Z" title="Joining Curves" description="Simple example of joining curves."/>

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

<Playground id="#2GCEVH" title="Closed Joined Curves" description="Simple example of closed joined curves."/>

The orange and yellow curves are the original Bezier curves.   
In light blue, these two curves are continued by each other and a hermite curve is also added in continuation to close the path.   