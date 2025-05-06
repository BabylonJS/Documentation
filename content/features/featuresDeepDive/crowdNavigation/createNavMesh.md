---
title: Creating A Navigation Mesh
image:
description: Learn how to create a mesh as a confinment system for crowd agents.
keywords: extensions, babylon.js, crowd
further-reading:
video-overview:
video-content:
---

## How to use the navigation mesh?

There are many cases to use a navigation mesh: AI and path finding, replace physics for collision detection (only allow player to go where it's possible instead of using collision detection) and many more cases Babylon.js users will find.

First, create the navigation plugin

```javascript
let navigationPlugin = new BABYLON.RecastJSPlugin();
```

Prepare some parameters for the agent constraints (described below)

```javascript
const parameters = {
  cs: 0.2,
  ch: 0.2,
  walkableSlopeAngle: 35,
  walkableHeight: 1,
  walkableClimb: 1,
  walkableRadius: 1,
  maxEdgeLen: 12,
  maxSimplificationError: 1.3,
  minRegionArea: 8,
  mergeRegionArea: 20,
  maxVertsPerPoly: 6,
  detailSampleDist: 6,
  detailSampleMaxError: 1,
};
```

Call the navigation mesh generation with the parameters and the list of meshes

```javascript
navigationPlugin.createNavMesh([groundMesh, wallMesh1, wallMesh2, stair1, stair2], parameters);
```

And that's it! You can now use the navigation mesh with the crowd system or make queries.

Optionally, you can get a display of the navmesh to ensure it corresponds to your space constraints

```javascript
navmeshdebug = navigationPlugin.createDebugNavMesh(scene);
const matdebug = new BABYLON.StandardMaterial("matdebug", scene);
matdebug.diffuseColor = new BABYLON.Color3(0.1, 0.2, 1);
matdebug.alpha = 0.2;
navmeshdebug.material = matdebug;
```

<Playground id="#KVQP83#0" title="Simple navigation mesh computation" description="Simple navigation mesh computation"/>

## Parameters

cs - The meshes are voxelized in order to compute walkable navmesh. This parameter in world units defines the width and depth of 1 voxel.

ch - Same as cs but for height of the voxel.

walkableSlopeAngle - Angle in degrees for the maximum walkable slope.

walkableHeight - The height in voxel units that is allowed to walk in.

walkableClimb - The delta in voxel units that can be climbed.

walkableRadius - the radius in voxel units of the agents.

maxEdgeLen - The maximum allowed length for contour edges along the border of the mesh. Voxel units.

maxSimplificationError - The maximum distance a simplified contour's border edges should deviate the original raw contour. Voxel units.

minRegionArea - The minimum number of cells allowed to form isolated island areas. Voxel units.

mergeRegionArea - Any regions with a span count smaller than this value will, if possible, be merged with larger regions. Voxel units.

maxVertsPerPoly - The maximum number of vertices allowed for polygons generated during the contour to polygon conversion process. Must be > 3.

detailSampleDist - Sets the sampling distance to use when generating the detail mesh. World units.

detailSampleMaxError - The maximum distance the detail mesh surface should deviate from heightfield data. World Units.

You can find more information about those parameters on the [Recast documentation](https://recastnav.com/structrcConfig.html).

## Queries

Basically, query functions help at getting constraint point and vector by the navigation mesh.

```javascript
getClosestPoint(position: Vector3): Vector3;
getRandomPointAround(position: Vector3, maxRadius: number): Vector3;
moveAlong(position: Vector3, destination: Vector3): Vector3;
```

Respectively:

- get a point on the navmesh close to a world position parameter
- get a random world position, on the navmesh, inside a circle of maxRadius.
- constraint a segment by the navmesh and returns the ending world position. Like walking on the navmesh and stopping at the edge.

When the query can't find a valid solution, the value (0,0,0) is returned.

Those functions use a bounding box for querying the world. The solution returned is within that bound. To properly set the default box extent to get a finer or broader result, call:

```javascript
setDefaultQueryExtent(extent: Vector3): void;
```

If your query returns a point too far from the expected result, use a smaller extent.

It's possible to get a path built for navigation as a point array. It's up to the user to use this array for drawing prediction path, trigger events,...

```javascript
const pathPoints = navigationPlugin.computePath(crowd.getAgentPosition(agent), navigationPlugin.getClosestPoint(destinationPoint));
pathLine = BABYLON.MeshBuilder.CreateDashedLines("ribbon", { points: pathPoints, updatable: true, instance: pathLine }, scene);
```

## Baking result

Building a navigation mesh can take a lot of cpu and network resources. In order to lower the download size and cpu needed, it's possible to bake the result of the navigation mesh computation to a byte stream. That byte stream can later be restored to get the navigation mesh back.

To retrieve the binary representation of the computed navigation mesh:

```javascript
const binaryData = navigationPlugin.getNavmeshData();
```

binaryData is an Uint8Array that you can save to a file for example.
To restore an UInt8Array to a navigation mesh:

```javascript
navigationPlugin.buildFromNavmeshData(uint8array);
```
## Using 3rd party tools
3rd party tools like `navmesh-editor` can help create navmesh and bake result to a binary file that is directly useable (navmesh coordinate system is right handed) : https://navmesh-editor.babylonjs.xyz/
Navmesh computation is run on drag and dropped gltf. The export can then be opened like in this Playground:

<img src="/img/pageImages/navmesh-editor.jpg" title="Precomputing a navmesh with navmesh-editor"/>

Loading a precomputed navmesh: <Playground id="#KVQP83#92" title="Loading a precomputed navmesh" description="Loading a precomputed navmesh"/>

## Web Worker

Building a navigation mesh can be time and resource heavy. For many use cases, it can be necessary to delegate navmesh computation to a webworker. Work will be done in parallel, letting the engine display the content without slow downs.

To enable web worker, specify a web worker .js script URL to use:

```javascript
let navigationPlugin = new BABYLON.RecastJSPlugin();
navigationPlugin.setWorkerURL("workers/navMeshWorker.js");
```

A default web worker is provided at this URL : https://github.com/BabylonJS/Babylon.js/blob/master/packages/tools/playground/public/workers/navMeshWorker.js

Then, provide a completion callback to `createNavMesh` method. This callback will be called when the navigation mesh is computed and ready to use by the plugin.

```javascript
navigationPlugin.createNavMesh([staticMesh], navmeshParameters,(navmeshData) =>
{
    console.log("got worker data", navmeshData);
    navigationPlugin.buildFromNavmeshData(navmeshData);
    ...
```

`navMeshData` is a binary version, ready to serialize, of the navmesh. It can be saved, streamed. User has to call `buildFromNavmeshData` to deserialize data. Once the navmesh is fully loaded, it's possible to create crowd, query the navmesh,...

Performance note: The navmesh is constructed from geometry data. If multiple meshes are needed, their geometry will be merged before passing the geometry positions and indices to Recast. This part of the code can be CPU intensive and cannot be done in a worker because of dependencies, copies, memory footprint.

An example of use with web worker : <Playground id="#TN7KNN#2" title="Navigation mesh computation with a web worker" description="Navigation mesh computation with a web worker"/>

## NPM

Loading Recast-Detour NPM module is different between version 1.3.0 and 1.4.0+ as later version is asynchronous. User has to use `await` like this:

```javascript
const recast = await Recast();
```
