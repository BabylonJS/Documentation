---
title: Creating A Plane
image:
description: Learn how to create a plane in Babylon.js.
keywords: diving deeper, meshes, set shapes, standard shapes, plane
further-reading:
video-overview:
video-content:
---

## Plane

The created plane is a flat surface parallel to the xy plane with its origin at the center of the plane.

## MeshBuilder

Usage :

```javascript
const plane = BABYLON.MeshBuilder.CreatePlane("plane", options, scene); //scene is optional and defaults to the current scene
```

| option          | value                                                                 | default value     |
| --------------- | --------------------------------------------------------------------- | ----------------- |
| size            | _(number)_ side size of the plane                                     | 1                 |
| width           | _(number)_ size of the width                                          | size              |
| height          | _(number)_ size of the height                                         | size              |
| updatable       | _(boolean)_ true if the mesh is updatable                             | false             |
| sideOrientation | _(number)_ side orientation                                           | DEFAULTSIDE       |
| sourcePlane     | _(Plane)_ source plane (math) the mesh will be transformed to         | null              |
| frontUVs        | _(Vector4)_ **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) |
| backUVs         | _(Vector4)_ **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE set** | Vector4(0,0, 1,1) |

### Examples

Single sided: <Playground id="#Q9VZS9#4" title="Create a Single Sided Plane" description="Simple example of creating a single sided plane."/>  
Double sided: <Playground id="#Q9VZS9#2" title="Create a Double Sided Plane" description="Simple example of creating a double sided plane."/>

Using this image  
![Two Tile Pattern](/img/how_to/Mesh/tiles2.jpg)  
to texture the front and back  
front and back <Playground id="#Q9VZS9#3" title="Front and Back Texture" description="Simple example of assigning front and back textures to a plane."/>

We can also create a plane from an abstract math plane  
<Playground id="#Q9VZS9#1" title="Create a Plane From Math Path" description="Simple example of creating a plane from an abstract math plane."/>

## Mesh

Usage :

```javascript
const plane = BABYLON.Mesh.CreatePlane("plane", size, scene);
const plane = BABYLON.Mesh.CreatePlane("plane", size, scene, updatable, sideOrientation); //optional parameters after scene
```

It is only possible to create a square with this method, for a rectangle you need to use scaling.
