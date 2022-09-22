---
title: Creating A Capsule
image:
description: Learn how to create a capsule in Babylon.js.
keywords: diving deeper, meshes, set shapes, standard shapes, capsule
further-reading:
video-overview:
video-content:
---

## Capsule

_Requires BJS version 4.2+_
The created capsule has its origin at the center of the capsule. The height minus the sum of the top and bottom radius must be > 0.

## MeshBuilder

Usage :

```javascript
const capsule = BABYLON.MeshBuilder.CreateCapsule("ribbon", options, scene); //scene is optional and defaults to the current scene
```

| option                 | value                                                                                                 | default value |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------- |
| orientation?           | _(Vector3)_ Direction of the capsule upon inception.                                                  | Vector3.Up    |
| subdivisions           | _(number)_ Number of sub segments on the tube section of the capsule running parallel to orientation. | 2             |
| tessellation           | _(number)_ Number of cylindrical segments on the capsule.                                             | 16            |
| height                 | _(number)_ Height or length of the capsule.                                                           | 1             |
| radius                 | _(number)_ Radius of the capsule.                                                                     | 0.25          |
| capSubdivisions        | _(number)_ Number of sub segments on the cap sections of the capsule running parallel to orientation. | 6             |
| radiusTop?             | _(number)_ Overwrite for the top radius.                                                              |
| radiusBottom?          | _(number)_ Overwrite for the bottom radius.                                                           |
| topCapSubdivisions?    | _(number)_ Overwrite for the top capSubdivisions.                                                     |
| bottomCapSubdivisions? | _(number)_ Overwrite for the bottom capSubdivisions.                                                  |

### Examples

Default capsule: <Playground id="#CL6HZ0" title="Create a Default Capsule" description="Simple example of creating a default capsule."/>  
Different cap subdivisions: <Playground id="#CL6HZ0#1" title="Create a Capsule With Subdivisions" description="Simple example of creating a capsule with subdivisions."/>
Forward orientation: <Playground id="#CL6HZ0#2" title="Create a Capsule With Foreward Orientation" description="Simple example of creating a capsule with forward orientation."/>
Different radii: <Playground id="#CL6HZ0#3" title="Create a Capsule With Different Radii" description="Simple example of creating a capsule with different radii."/>

## Mesh

```javascript
const capsule = BABYLON.Mesh.CreateCapsule("ribbon", options, scene); //scene is optional and defaults to the current scene
```

The same form as for _MeshBuilder_
