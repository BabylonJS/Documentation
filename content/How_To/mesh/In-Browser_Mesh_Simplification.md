---
title: Simplifying Meshes With Auto-LOD
image:
description: Learn how to use the Auto-LOD system in Babylon.js.
keywords: diving deeper, meshes, LOD, simplify
further-reading:
video-overview:
video-content:
---

## Simplify a Mesh with Auto-LOD

## About

[Level of Details](https://en.wikipedia.org/wiki/Level_of_detail) is a powerful tool that was added to Babylon.js in version 2.0. The concept is rather simple: when the camera is at a certain distance from the mesh, lowering the amount of faces displayed will increase performance without the user noticing the reduction.

LOD requires the developer to add a few meshes to the original mesh. One of the ways to create those meshes is simplification. Many 3D tools offer various simplification algorithms. It is sometimes called Decimation.

Starting with version 2.0, Babylon.js offers an in-browser simplification functionality that works asynchronously while trying not to disturb the rendering process. These LOD levels will be automatically added to the scene after finishing the calculation.

## Usage - Simplifying a mesh

Any object of the class BABYLON.Mesh has a "simplify" function with the following signature:

```javascript
public simplify(settings: Array<ISimplificationSettings>,
                parallelProcessing: boolean = true,
                type: SimplificationType = SimplificationType.QUADRATIC,
                successCallback?: () => void);
```

-   **Settings**

The settings object has two parameters:

1. quality - a number between 0.0 and 1.0, defining the percentage of the decimation (1 being 100%)
2. distance - the distance from the object to which this LOD mesh will be added.
3. (since 2.1) optimizeMesh - should the mesh be optimized? (optional, defaults to false). More about optimization later.

A simple example for an array of settings would be:

```javascript
[
    { quality: 0.9, distance: 25, optimizeMesh: true },
    { quality: 0.3, distance: 50, optimizeMesh: true },
];
```

For the typescript users and the "new" lovers, a SimplificationSettings class exists. So, this can also be done:

```javascript
var settings: Array<ISimplificationSettings> = []; //in JS: var settings = new Array();
settings.push(new BABYLON.SimplificationSettings(0.8, 60));
settings.push(new BABYLON.SimplificationSettings(0.4, 150));
```

-   **Parallel Processing**

The code runs async. The `parallelProcessing` flag sets the order of processing of each level. If set to true, all will run together. This will use more RAM (for a certain period of time) but will run quicker in general. There is a chance however, that the FPS will be reduced to an unaccepted level due to many parallel calculations between frames. Setting this flag to false will process one setting after the other. This will use only one single simplification object and will use less RAM. It can, however, take a little longer.

-   **Type**

To allow further types of simplification to be implemented (will be explained later, for those who are interested) the type of simplification should be stated. There is only one kind at the moment, BABYLON.SimplificationType.QUADRATIC. This is also the default value, if type is undefined.

-   **Success Callback**

Since this is an asynchronous function (which returns immediately), a callback is required in order to run code after the simplification process is over.

This function will be called after the Auto-LOD process is successfully done.

-   **Usage Example**

```javascript
BABYLON.SceneLoader.ImportMesh("", "./", "DanceMoves.babylon", scene, (newMeshes, particleSystems, skeletons) => {
    newMeshes[1].simplify(
        [
            { quality: 0.9, distance: 25 },
            { quality: 0.3, distance: 50 },
        ],
        false,
        BABYLON.SimplificationType.QUADRATIC,
        function () {
            alert("LOD finisehd, let's have a beer!");
        },
    );
});
```

Once the simplification is finished, you can also access the simplified mesh by utilizing the [getLODLevelAtDistance](/typedoc/classes/babylon.mesh#getlodlevelatdistance) and [getLODLevels](/typedoc/classes/babylon.mesh#getlodlevels) functions of the mesh class. You can use this to clone the simplified mesh and use it indepedently of the main mesh.
<Playground id="#1ED15P#38" title="Clone simplified mesh" description="Access a simplified mesh and clone it."/>

## Demos 

Zoom in and out to see the effect, watch the number of active vertices closely.

Simplifying spheres. Materials of the spheres will be set after simplification ended completely.

 <Playground id="#1ED15P#1" title="Simplifying Spheres" description="Simple example of to use Auto-LOD to simplify spheres."/>

Simplifying a color-based complex mesh. An alert window will pop when simplification is over. This mesh will also take time to load and requires optimization.

With global mesh optimization -
<Playground id="#2JBSNA#3" title="Simplifying Complex Meshes" description="Simple example of to use Auto-LOD to simplify complex meshes with global optimization."/>

With optimization during simplification -
<Playground id="#2JBSNA#4" title="Simplifying Complex Meshes" description="Simple example of to use Auto-LOD to simplify complex meshes with optimization during simplification."/>

## Rules, Quirks and things to pay attention to

Not all meshes can be simplified. Better said - all meshes can be simplified, some however, should not be.

An object like a Box (if built in an optimal way, like the BABYLON.Mesh.CreateBox function) has no "extra faces" that can be removed. removing one single face will cause it to... not be a box.

### A few "rules" to follow

(and never forget, rules are meant to be broken!)

1. Try simplifying meshes with more than 500 faces. Less than that will make no sense, probably.
2. Best meshes to simplify are complex objects.
3. Meshes like a plane will probably lose their shape after simplification.
4. The lower the quality of the mesh, the further the distance should be. This should not be linear - a complex mesh that was simplified to 90% will probably still look almost the same, but at 30%, it is very obvious that the mesh was simplified. Lower quality simplification should have a large distance defined.
5. Try simplifying meshes that represent a single object. A mesh containing many distant objects in one will simplify rather poorly. LOD will work poorly on such meshes as well, since the position of the mesh is not actually the position of all mesh-parts.
6. Set the mesh's material before starting the decimation. The LOD Mesh uses them when initialized. If they will not be set, expect the material to disappear when the given distance is reached.

### Quirks

-   Quadratic simplification can be calculated using many factors. Position, normals, colors, UV coordinates, etc... The more factors, the slower it will run (more calculations). The decision was made to stay with position only - this means that after simplification, the UV coordinates will sometimes be a bit off. It is usually unnoticeable if you follow rule 4 above.
-   Meshes might change their shape. Very noticeable with a small plane.
-   Meshes might suddenly have "holes" in them. This can be avoided using the mesh optimization (starting 2.1, described further down)
-   Submeshes are supported starting with Babylon.js 2.1. Meshes with submeshes would not be decimated 100% correctly due to the lack of border detection (see next point). Give it a try and see if it fits your needs.
-   Some triangles on the borders will be "deleted". The reason is usually the (lack of) border detection, which is a part of the original paper. The feature was not included in the implementation due to the amount of time needed to calculate that correctly.
-   Objects that are initialized using an image (best example is a Height Map-based ground) will only decimate after the image is fully loaded. For that, take advantage of the `onReady` callbacks they have:

```javascript
const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground", "textures/heightmap.png", {width: 20, height: 20, subdivisions: 100, onReady: (readyMesh) => {
    //Simplify mesh here
    readyMesh.simplify([{quality: 0.1, distance: 10}]);
    ...
}}, scene);
```

<Playground id="#P2J3R8" title="Simplify ground mesh" description="Create ground mesh from heightmap and simplify it."/>

## Mesh optimization (Starting with Babylon.js 2.1)

Due to the nature of Babylon's file format, it is possible that many vertices will have the same positions, normals, but different color/uv information. This presents a problem to the decimation process, which relies on having all triangles with the same position altered.

If you try simplifying a mesh, and it suddenly lacks a few triangles, this will be the reason - your mesh is not "optimized" for simplification.

There are two types of optimization available:

1. Global altering function, which is a part of BABYLON.Mesh:

```javascript
mesh.optimizeIndices(function () {
    //do whatever you want here
});
```

This option alters(!) the mesh's indices order. It is faster, but might change the UV coordinates of vertices of the mesh. If that is the case, use: 

2. Optimization during simplification - The Simplification Settings now includes a new variable: optimizeMesh, which is a boolean that defaults to false. If set to true, a non-altering mesh optimization will run during the mesh's preparation for decimation. The simplification will run on a temporary array of vertices and will correlate the new vertices' positions with the old uv/color information. This is the better option, but also the slower option (will be noticeable with very large meshes like the demo skull) <Playground id="#2JBSNA#4" title="Optimization During Simplification Example" description="Simple example of optimizing while simplifying."/>

Check which one of the methods works best for you. Both have their up and down sides, for better results use the 2nd option (set optimizeMesh to true in the settings).

## Developing further simplification algorithms

If you want to add a new simplification algorithm, there are a few steps that are required:

1. Create a class that implements the BABYLON.ISimplifier interface (and of course implement the function! :-) )
2. Add the type of simplification to the SimplificationType enum
3. Add the class init in the mesh.simplify function (the inner function "getSimplifier" should contain your type).
4. We'd love to see a PR with your new simplification! 

## Accessing the simplification class directly

You can access the quadratic error decimation directly and play with its features. You can do that by creating an object of the class QuadraticErrorSimplification

```javascript
var decimator = new QuadraticErrorSimplification(meshToDecimate);
```

Afterwards you can play with the following object variables:

1. decimationIterations - max number of iterations of the decimation process. The simplification will (usually) stop before the max number of iterations, but it actually all depends on the next variable. Default: 100.
2. aggressiveness - The threshold that decides if a triangle is up for a deletion is decided using this variable. Setting it to a low value (2, for example) will cause the decimation to be a little slower, but more percise in selecting the triangles. Setting it to a high value (15 for example) will probably cause the decimation to end in 1 or 2 iterations, since a lot of triangles will be chosen for deletion. Anyhow, once the quality is reached, the process stops. The question - did it choose the better triangles to decimate! Default: 7.
3. syncIterations - the number of synchronous iterations inside the async iterations. Rather hard to explain, but a lower number will hurt the performance less but will make the process take a bit more time. If you need explanations look at the AsyncLoop class in babylon.tools.js or contact @raananw at the forum.
   After setting the variables, you can run the simplify function that will start the entire process:

```javascript
simplify(settings, successCallback);
```

See the explanation above to understand what each variable is.
