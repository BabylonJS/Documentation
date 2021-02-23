---
title: Getting Started - Chapter 2 - Mesh Placement
image: 
description: Continue your Babylon.js learning by placing and positioning meshes in your scene.
keywords: getting started, start, chapter 2, placement, position
further-reading: 
    - title: More on Placement
      url: /divingDeeper/mesh/transforms/center_origin/position
video-overview:
video-content:
---

# Getting Started - Mesh Placement

## Place and Scale a Mesh

### Size
Some meshes, such as box, have properties that you can set to change during their creation.

```javascript
const box = BABYLON.MeshBuilder.CreateBox("box", {width: 2, height: 1.5, depth: 3})
```

After creation, and for meshes that do not have sizing options, changes in size are achieved by scaling the mesh.

```javascript
const box = BABYLON.MeshBuilder.CreateBox("box", {}); //unit cube
box.scaling.x = 2;
box.scaling.y = 1.5;
box.scaling.z = 3;
```

```javascript
const box = BABYLON.MeshBuilder.CreateBox("box", {}); //unit cube
box.scaling = new BABYLON.Vector3(2, 1.5, 3);
```

As you can see, from the above codes, scaling is a vector object with properties x, y, and z.

All three of the above sets of codes will produce boxes of the same size

## Position
For the majority of meshes the [position](/divingDeeper/mesh/transforms/center_origin/position) property places the center of the mesh at that position. Position is also a vector object with properties x, y, and z, so that the following two sets of codes position the box in the same place.

```javascript
box.position.x = -2;
box.position.y = 4.2;
box.position.z = 0.1;
```

```javascript
box.position = new BABYLON.Vector3(-2, 4.2, 0.1);
```

We can now use positions to place the boxes sized in three different ways in one playground. In each case the height of a box is 1.5 and therefore for each box position.y = 0.75 to place it on the ground.

<Playground id="#KBS9I5#68" title="Positioning Meshes" description="A playground demonstrating different ways to position a mesh in your scene." image="/img/playgroundsAndNMEs/gettingStartedMeshPlacement.jpg"/>

### Orientation
As for scaling and position the [rotation](/divingDeeper/mesh/transforms/center_origin/rotation) property of a mesh is a vector object with properties x, y and z. However when building our first world we will only consider rotation about one axis since a setting a rotation about all three axes can be surprisingly confusing.

Rotations are given in radians. If you prefer working in degrees Babylon.js provides a conversion tool. Both these lines of code with produce the same rotation.

```javascript
box.rotation.y = Math.PI / 4;
box.rotation.y = BABYLON.Tools.ToRadians(45);
```

<Playground id="#KBS9I5#69" title="Rotating Meshes" description="A playground demonstrating how to rotate a mesh in your scene." image="/img/playgroundsAndNMEs/gettingStartedRotatingMeshes.jpg"/>

We can now change the size, position and orientate a mesh adding a little more variation to the box as a building. Before we place more boxes in the scene let us see if we can make them a little more building like.
