---
title: Creating Meshes
image:
description: Learn about the different processes of creating meshes in Babylon.js.
keywords: diving deeper, materials, meshes, creation, mesh creation
further-reading:
video-overview:
video-content:
---

## The Creation of Different Types of Mesh

There is a large variety of meshes that you can create. The range falls into four broad categories, the first three of which requiring a single Babylon.js method to build.

1. Set Shapes - which usually have names in everyday use and their forms are well known and recognized. Examples include the box, sphere, cone and plane. These shapes are created with a method having the form _Create&lt;MeshType&gt_

2. Parametric Shapes - these have no everyday names and are formed through data sets and tend to have irregular shapes. Examples include ribbons, extrusions, and irregular convex or concave polygons. They are created mainly with _Create&lt;MeshType&gt_ and also with _Extrude&lt;MeshType&gt_

3. Polyhedra - three dimensional regular solids including octahedron, dodecahedron, icosahedron and icosphere. The method of creating these is _createPolyhedron_ along with a number for the basic shapes and an array of vertices for a wider range of shapes or _createIcoSphere_.

4. Custom - those you design yourself and build from your own set of vertices connected into triangular facets as you choose.

The current way to create a mesh is using _MeshBuilder_

```javascript
const mesh = BABYLON.MeshBuilder.Create < MeshType > (name, options, scene);
```

The _options_ object will have different properties according to the type of mesh and can be empty {}. The scene parameter is optional and defaults to the current scene.

There is an older method, retained for backwards compatibility, which uses _Mesh_ and a string of parameters

```javascript
const mesh = BABYLON.Mesh.Create<MeshType>(name, required_param1, required_param2, ..., scene, optional_parameter1, ........);
```

The scene parameter is compulsory when used with optional parameters. You will still find this method in playgrounds.
