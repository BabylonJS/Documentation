---
title: Dynamically Morph A Mesh
image:
description: Learn how to dynamically morph a mesh in Babylon.js.
keywords: diving deeper, meshes, morph
further-reading:
video-overview:
video-content:
---

## What is morphing ?

This part is about the way to morph some kind of meshes.  
For now, it concerns only ribbons, tubes, extruded shapes and lines.

When talking about morphing, we mean here changing the vertices positions of an existing mesh. Indices remain unchanged. This means the mesh keeps the same number of vertices, the same faces between vertices and it remains the same object in your code.
Only its vertices change their coordinates.

If you handle a box or another fixed basic shape, it's quite easy to access to vertices positions because your mesh has an expected shape. For example, you can guess a box has 4 vertices per face.  
But when handling parametric shapes like ribbons, tubes, etc, it becomes very difficult to guess how and where vertices were positioned by the mesh constructor algorithm. For a tube, for instance, you only know the axis path you gave to build it (and radius, tessellation, of course).

So you will learn here how to update the shape of an existing mesh and how to morph it in the render loop.

## Ribbon

### _ribbon updatable parameter : pathArray_

_(reminder : only points positions can change in the path array, not the number of points. Please see the summary at the bottom of this page for more details)_

Let's create a ribbon.  
As explained in the Ribbon tutorial part, a good way to create a ribbon is to fill many arrays with _Vector3_ with two _for_ loops : one for each path, another one for the array of paths : the _pathArray_.

Here we create a simple plane ribbon in the xOz plane

```javascript
// path function
const pathFunction = function (k) {
  const path = [];
  for (let i = 0; i < 60; i++) {
    const x = i - 30;
    const y = 0;
    const z = k;
    path.push(new BABYLON.Vector3(x, y, z));
  }
  return path;
};
// ribbon creation
const sideO = BABYLON.Mesh.BACKSIDE;
const pathArray = [];
for (let i = -20; i < 20; i++) {
  pathArray.push(pathFunction(i * 2));
}
const mesh = BABYLON.Mesh.CreateRibbon("ribbon", pathArray, false, false, 0, scene, true, sideO);
```

example : <Playground id="#1MSEBT" title="Dynamic Mesh Morph Example 1" description="Simple example of dynamically morphing a mesh."/> _(please rotate the cam to see it)_

The important key to notice is that we set the **_updatable_** parameter to **_true_** in the _CreateRibbon()_ method : the one just between the _scene_ and the _sideO_ parameters.

We can now imagine we want to change this existing ribbon _y_ coordinates according to a sinus function. So for each path in the existing _pathArray_ array we just change _Vector3_ coordinates.  
Note we don't create new paths or a new _pathArray_ array. We just access with indexes to every element and just change values.

```javascript
const updatePath = function (path) {
  for (let i = 0; i < path.length; i++) {
    const x = path[i].x;
    const z = path[i].z;
    const y = 20 * Math.sin(i / 10);
    path[i].x = x;
    path[i].y = y;
    path[i].z = z;
  }
};

// update pathArray
for (let p = 0; p < pathArray.length; p++) {
  updatePath(pathArray[p]);
}
```

The way to update then our existing mesh is quite simple : let's just re-use the _CreateRibbon()_ method and give it this mesh as last parameter with our modified _pathArray_.

```javascript
mesh = BABYLON.Mesh.CreateRibbon(null, pathArray, null, null, null, null, null, null, mesh);
```

The other parameters than _pathArray_ and _mesh_ are just ignored when updating, so they can be set to _null_ for better understanding.  
The _CreateRibbon()_ method thus updates the given ribbon and returns it.  
You can also use the other call signature :

```javascript
mesh = BABYLON.MeshBuilder.CreateRibbon(null, { pathArray: pathArray, instance: mesh });
```

example : <Playground id="#1MSEBT#1" title="Dynamic Mesh Morph Example 2" description="Simple example of dynamically morphing a mesh."/>

Well, we just updated our ribbon's shape once for now.

If we now want its shape to evolve dynamically, we just have to set the _pathArray_ computation (fixed to change with an extra _k_ parameter) and the _CreateRibbon()_ call inside the render loop.

```javascript
const updatePath = function (path, k) {
  for (let i = 0; i < path.length; i++) {
    const x = path[i].x;
    const z = path[i].z;
    const y = 20 * Math.sin(i / 10) * Math.sin(k + z / 40);
    path[i].x = x;
    path[i].y = y;
    path[i].z = z;
  }
};

// path array population ...
const mesh = BABYLON.Mesh.CreateRibbon("ribbon", pathArray, false, false, 0, scene, true);

// morphing
const k = 0;
scene.registerBeforeRender(function () {
  // path array update
  for (let p = 0; p < pathArray.length; p++) {
    updatePath(pathArray[p], k);
  }
  // ribbon update
  mesh = BABYLON.Mesh.CreateRibbon(null, pathArray, null, null, null, null, null, null, mesh);
  // or also :
  // mesh = BABYLON.MeshBuilder.CreateRibbon(null, {pathArray: pathArray, instance: mesh});
  k += 0.05;
});
```

example : <Playground id="#1MSEBT#3" title="Dynamic Mesh Morph Example 3" description="Simple example of dynamically morphing a mesh."/>

## Lines and DashedLines

### _lines and dashed lines updatable parameter : points_

### _lines optional updatable parameter : colors_

_(reminder : only points positions can change, not the number of points. Please see the summary at the bottom of this page for more details)_

Once we got the understanding for ribbons, we can apply it to Lines or DashedLines.
It's even easier as Lines just require a path of points as parameter.

```javascript
const points1 = [v1, v2, ..., vN]; // vector3 array
let lines = BABYLON.MeshBuilder.CreateLines("lines", {points: points1, updatable: true}, scene, true);
let dashedLines = BABYLON.Mesh.CreateDashedLines("lines", points1, dashSize, gapSize, nb, scene, true);

lines = BABYLON.MeshBuilder.CreateLines(null, {points: points2, instance: lines});
dashedLines = BABYLON.MeshBuilder.CreateDashedLines(null, {points: points2, instance: dashedLines});
```

We can, of course, set the update method within the render loop.

example lines: <Playground id="#24PQRQ" title="Lines Example" description="Simple example of dynamically morphing a mesh with lines."/>
dashed lines: <Playground id="#XKYAE#3" title="Dashed Lines Example" description="Simple example of dynamically morphing a mesh with dashed lines."/>

## Tube

### _tube updatable parameters : path, radius, radiusFunction_

_(reminder : only points positions can change in the path, not the number of points. Please see the summary at the bottom of this page for more details)_

Nothing differs for tubes. Let's create a tube and then update it according to new _path_, _radius_ or _radiusFunction_ values :

```javascript
const path1 = [v1, ..., vN]; //vector3 array : tube axis1
const radius1 = 5;
const path2 = [u1, ..., uN]; // another vector3 array : tube axis2
const radius2 = 8;
const tube = BABYLON.Mesh.CreateTube("tube", path1, radius1, 12, null, cap, scene, true);
tube = BABYLON.MeshBuilder.CreateTube(null, {path: path2, radius: radius2, instance: tube});
```

Of course, it also works with the _radiusFunction_ parameter :

```javascript
const radiusFunction1 = function(i, distance) { ... };
const radiusFunction2 = function(i, distance) { ... };
let tube = BABYLON.MeshBuilder.CreateTube("tube", { path: path1, tessellation: 12, radiusFunction: radiusFunction1, cap, updatable: true }, scene);
tube = BABYLON.MeshBuilder.CreateTube(null, {path: path2, radiusFunction: radiusFunction2, instance: tube});
```

Example: <Playground id="#ACKC2#1" title="Tube Example" description="Simple example of dynamically morphing a tube."/>

As you can read at line 53, the _radiusFunction_ is redefined here at each iteration in the _registerBeforeRender_ loop because it uses the value of the incrementing parameter _k_ : the radius changes according to each path point position and according to k varying in the time.

## Extruded shape

### _extrusion updatable parameters for ExtrudeShape(): shape, path, scale, rotation_

### _extrusion updatable parameters for ExtrudeShapeCustom(): shape, path, scaleFunction, rotateFunction_

_(reminder : only points positions can change in the path, not the number of points. Please see the summary at the bottom of this page for more details)_

We can see extrusion as some tube generalization : a tube would be a circle _shape_ extruded along a path.  
So we have here the same update capabilities than for a tube (_path_ or shape _scale_ which would be the equivalent to tube _radius_) and some extra parameters : the _rotation_ step can be updated and the _shape_ itself also !  
It is mandatory that the new _shape_ array has the same number of Vector3 than the _shape_ used to build the original instance. A good way to assure this is simply to keep the original _shape_ instance and to modify it instead of creating a new one (or to modify a copy of it).

```javascript
const shape1 = [s1, s2, ...sN]; // Vector3 array
const shape2 = [t1, t2, ...tN]; // another Vector3 array
const path1 = [p1, p2, ...pN]; // Vector3 array
const path2 = [q1, q2, ...qN]; // another Vector3 array
const scale1 = 1;
const scale2 = 3;
const rotation1 = 0;
const rotation2 = 0.2;
// extrusion
let extruded = BABYLON.MeshBuilder.ExtrudeShape("ext", { shape: shape1, path: path1, scale: scale1, rotation: rotation1, cap, updatable: true }, scene);
// mesh update
extruded = BABYLON.MeshBuilder.ExtrudeShape(null, { shape: shape2, path: path2, scale: scale2, rotation: rotation2, instance: extruded });
```

Idem for _ExtrudeShapeCustom()_ accepting _scaleFunction_ and _rotationFunction_ parameters :

```javascript
// path and shape const declared before ...
const myScale1 = function(i, distance) { ... };
const myScale2 = function(i, distance) { ... };
const myRotation1 = function(i, distance) { ... };
const myRotation2 = function(i, distance) { ... };
// extrusion
let ext = BABYLON.Mesh.ExtrudeShapeCustom("ext", { shape: shape1, path: path1, scaleFunction: myScale1, rotationFunction: myRotation1, updatable: true, cap }, scene);
// mesh update
ext = BABYLON.MeshBuilder.ExtrudeShapeCustom(null,{shape: shape2, path: path2, scaleFunction: myScale2, rotationFunction: myRotation2, instance: ext});
```

Both new functions can be used in the render loop.

The funny part is, as _ExtrudeShape()_ and _ExtrudedShapeCustom()_ build the same mesh (only parameters change), you can create a simple extruded shape with _ExtrudeShape()_ and then morph it with _ExtrudeShapeCustom()_ if you need more complexity.

```javascript
let ext = BABYLON.Mesh.ExtrudeShape("ext", shape1, path1, scale1, rotation1, cap, scene, true);
// mesh update
ext = BABYLON.Mesh.ExtrudeShapeCustom(null, shape2, path2, myScale2, myRotation2, null, null, null, null, null, null, ext);
```

Example: <Playground id="#20IBWW#14" title="Extruded Shape Example" description="Simple example of dynamically morphing an extruded shape."/>

## Other shapes : updateMeshPositions

For now, we just talked about parametric shapes which can be updated with their own _CreateXXX()_ initial method.
But what about the other mesh types : boxes, spheres, cylinders, etc ?

There is no mean to update them with their initial _CreateXXX()_ because a box remains a box, a sphere remains a sphere whether you change their size, radius, etc.
So usually, the right way to change these basic shapes is to play with their `mesh.scale` property.

Nevertheleless, if you create your basic shape with its _updatable_ parameter set to true, you can access another way to morph/change the shape afterwards : the _updateMeshPositions()_ method.

This method needs two parameters :

- a _positionFunction_ which is js function which will modify the mesh _positions_ array,
- a _computeNormals_ boolean (default = true) to skip/unskip the normals re-computation after the mesh update .

```javascript
const box = BABYLON.MeshBuilder.CreateBox("box", { size: 5.0, updatable: true }, scene);
const positionFunction = function (positions) {
  // modify positions array values here
};
box.updateMeshPositions(positionFunction, true);
```

Example: <Playground id="#1UZIZC#6" title="Custom Shape Example" description="Simple example of dynamically morphing a custom shape."/>

## More speed : freezeNormals

The former _CreateXXX()_ update functions try to be as much optimized as possible to run fast in the render loop.  
However, you may need some more speed for any reason (huge mesh with dozens of thousands of vertices for instance).  
So, if your mesh doesn't need to reflect the light (emissive color only for instance), you can skip the normals re-computation which is a CPU consuming process.  
Use then the _freezeNormals()_ method just after your mesh is created :

```javascript
const tube = BABYLON.Mesh.CreateTube("tube", path, 3, 12, null, BABYLON.Mesh.NO_CAP, scene, true);
tube.freezeNormals();
// path update here ...
tube = BABYLON.Mesh.CreateTube(null, path, 3, null, null, null, null, null, null, tube);
```

If you need to reset the normals computation process on, use then once the _unfreezeNormals()_ method.

```javascript
tube.unfreezeNormals();
```

The normals will then be recomputed and re-applied on the next _CreateXXX()_ update call.

## Summary

- To create an updatable mesh, it is mandatory to set its _updatable_ parameter to _true_ when calling _CreateXXX()_ method.
- To update then an existing parametric shape, we just have to use the same _CreateXXX_ method as we used to construct it.
- Only the existing mesh and the data relative to new positions (path, pathArray, array of points) must be passed to this method, the other parameters are ignored.
- If we want to morph the mesh, we then use the _CreateXXX()_ method within the render loop.  
  In this case, it is important not to allocate new memory each frame : we access our arrays by indexes and just change values instead of creating new arrays, we access existing objects instead of instantiating new ones, etc. We also take care about the weight of each object (number of sides, number of vertices, etc).

example : if we need to update a Lines mesh in the render loop, it is to say to update the _points_ array each frame, it is better to change each array element values (_points[i].x = newXValue; points[i].y = newYValue; points[i].z = newZValue;_) in a _for_ loop instead of instantiating a new _points_ array.

Use case with a _path_ parameter as all parametric shapes have one :

```javascript
const path = [v1, v2, ..., vN]; // your own array, created once
const mesh = CreateXXX("mesh", path, etc, ..., scene, true); // updatable = true : creates your initial mesh
const computeValue = function(val1, val2) { ... }; // your update logic : returns a value in function of val1 and val2
const getParam = function() { ... }; // returns a param value evolving in the render loop
const updatePath = function(path, k) { // updates the existing path array elements
  for (let i = 0; i < path.length; i++) {
    const x = computeValue(path[i].x, k);
    const y = computeValue(path[i].y, k);
    const z = computeValue(path[i].z, k);
    path[i].x = x;
    path[i].y = y;
    path[i].z = z;
  }
};

scene.registerBeforeRender(function() {
  const k = getParam();
  updatePath(path, k);
  mesh = CreateXXX(null, path, null, ..., null, mesh);
});

```
