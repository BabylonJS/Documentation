---
title: Creating Parametric Meshes
image:
description: Learn how to create parametric meshes in Babylon.js.
keywords: diving deeper, meshes, parametric shapes
further-reading:
video-overview:
video-content:
---

## Parametric Shapes

These meshes are so called because their shape is defined by a an array of vector3 parameters and can be irregular in nature. You can produce a series of broken or unbroken lines across 3D space. In 2D you can produce an horizontal irregular convex or concave polygon, which may be extruded vertically into 3D. It is also possible to extrude the 2D outline along a path that travels in 3D space and vary its rotation and scale as it travels the path. You can also 'lathe' an outline to give a shape with rotational symmetry.

To create these meshes you use one of

```javascript
const mesh = BABYLON.MeshBuilder.Create < MeshType > (name, options, scene);
const mesh = BABYLON.MeshBuilder.Extrude < MeshType > (name, options, scene);
```

where the _options_ object properties vary according to the type of mesh. The scene parameter is optional and defaults to the current scene. One or more of the _options_ properties will be used to set the vector3 data to define paths and outlines and you must set these.

All the parametric shapes, except for the CreateLathe, CreatePolygon and ExtrudePolygon have an _instance_ property in the options. This is used to update the shape after creation provided its _updatable_ options property was set to _true_. You can only change values in the shape defining data arrays not the size of the arrays.

Where possible playgrounds will give two examples; the first creating a mesh and the second updating it with the instance option. Comment out the latter to see the original mesh.

It is still possible to use the \*Mesh" method to create these shapes. This has the forms

```javascript
const mesh = BABYLON.Mesh.Create<MeshType>(name, required_param1, required_param2, ..., scene, optional_parameter1, ........);
const mesh = BABYLON.Mesh.Extrude<MeshType>(name, required_param1, required_param2, ..., scene, optional_parameter1, ........);
```

The scene parameter is compulsory when used with optional parameters. You will still find this method in playgrounds.
