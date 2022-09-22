---
title: Ribbons With Math
image:
description: Learn how to create ribbons with math in Babylon.js.
keywords: diving deeper, meshes, parametric shapes, ribbons
further-reading:
video-overview:
video-content:
---

## Surfaces, Mathematics and Ribbons

Mathematics is very useful for drawing surfaces in 3D space. Surfaces are often described by the following equation type _y = f(x, z)_, that is height of point on the surface is determined by the ground coordinate position below the point

For the moment take z as fixed, say _z = 6_. That means for that value of z _y = g(x)_ for some function g.

When x is changing in a linear way it is easy to write a direct equation, such as _y = x²_ and to use Babylon.js to draw it path for a range of values of x.

```javascript
const path = [];
for (let x = -5; x <= 5; x++) {
  let y = x * x;
  path.push(new BABYLON.Vector3(x, y, 6));
}
```

Another way would be to use a separate parameter t, for example, and write _x = t_, and _y = t²_. This might seem a waste of time and extra work.

```javascript
const path = [];
for (let t = -5; t <= 5; t++) {
  let x = t;
  let y = t * t;
  path.push(new BABYLON.Vector3(x, y, 6));
}
```

Where it is useful is when the change in x is not linear. Consider a circle or radius 5 for example. The direct equation is _x² + y² = 25_. How do you code that? Using the angle, a, as parameter gives

```javascript
const path = [];
for (let a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
  let x = 5 * Math.cos(a);
  let y = 5 * Math.sin(a);
  path.push(new BABYLON.Vector3(x, y, 6));
}
path.push(path[0]); // close circle
```

When it is possible to write the equations using parameters _x = f(t)_ and _y = g(t)_ it makes coding easier. Assuming the functions f(t) and g(t) have already been coded.

```javascript
const path = [];
for (let t = -5; t <= 5; t++) {
  let x = f(t);
  let y = g(t);
  path.push(new BABYLON.Vector3(x, y, 6));
}
```

Having constructed one path to draw a circle at _z = 6_ do the same across a range of _z_ values and use the many paths to create a ribbon.

```javascript
const paths = [];
for (let z = -6; z <= 6; z++) {
  const path = [];
  for (let a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
    let x = 5 * Math.cos(a);
    let y = 5 * Math.sin(a);
    path.push(new BABYLON.Vector3(x, y, z));
  }
  path.push(path[0]); // close circle
  paths.push(path);
}
```

Again we can use a parameter for _z_

```javascript
const paths = [];
for (let t = -6; t <= 6; t++) {
  const path = [];
  for (let a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
    let x = 2 * Math.cos(a);
    let y = 2 * Math.sin(a);
    let z = t;
    path.push(new BABYLON.Vector3(x, y, z));
  }
  path.push(path[0]); // close circle
  paths.push(path);
}
```

Makes a tube: <Playground id="#F6JW5W#18" title="Math-Based Ribbon Tube" description="Simple example of creating ribbon tube with math."/>

We can also use the _z_ parameter with _x_ and _y_

```javascript
const paths = [];
for (let t = -6; t <= 6; t++) {
  const path = [];
  for (let a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
    let x = 2 * Math.cos(a) + t / 2;
    let y = 2 * Math.sin(a) + (t * t) / 4;
    let z = t;
    path.push(new BABYLON.Vector3(x, y, z));
  }
  path.push(path[0]); // close circle
  paths.push(path);
}
```

Makes a U tube: <Playground id="#F6JW5W#19" title="Math-Based Ribbon U-Tube" description="Simple example of creating ribbon U-tube with math."/>

and surfaces get more interesting if the change in z is not linear

```javascript
const paths = [];
for (let t = 0; t < Math.PI; t += Math.PI / 32) {
  const path = [];
  for (let a = 0; a < 2 * Math.PI; a += Math.PI / 32) {
    let x = 4 * Math.cos(a) * Math.sin(t);
    let y = 4 * Math.sin(a) * Math.sin(t);
    let z = 4 * Math.cos(t);
    path.push(new BABYLON.Vector3(x, y, z));
  }
  path.push(path[0]); // close circle
  paths.push(path);
}
```

a sphere: <Playground id="#F6JW5W#25" title="Math-Based Ribbon Sphere" description="Simple example of creating ribbon sphere with math."/>

## More examples

It is hard to stop playing  
A ribbon of parabolas: <Playground id="#F6JW5W#22" title="Math-Based Ribbon Parabolas" description="Simple example of creating ribbon parabolas with math."/>  
parabolas scaled: <Playground id="#F6JW5W#21" title="Math-Based Scaled Ribbon Parabolas" description="Simple example of creating scaled ribbon parabolas with math."/>  
parabolas with some trigonometry: <Playground id="#F6JW5W#23" title="Trigonometry-Based Ribbon Parabolas 1" description="Simple example of creating ribbon parabolas with trigonometry."/>
parabolas and more trigonometry: <Playground id="#F6JW5W#24" title="Trigonometry-Based Ribbon Parabolas 2" description="Simple example of creating ribbon parabolas with trigonometry."/>

## Paths to Try

You could choose a known math curve from these sites
http://en.wikipedia.org/wiki/List_of_curves  
http://www.mathcurve.com/courbes2d/courbes2d.shtml  
or others.  
When you feel more comfortable, create you own.
