---
title: Getting Started - Chapter 3 - Extruding Polygons
image:
description: Learn to create your own meshes by extruding mesh faces.
keywords: getting started, start, chapter 3, extrude
further-reading:
video-overview:
video-content:
---

# Getting Started - Extruding Polygons

## Building the Car

The car is going to be a very simple one. The body will be built using the _extrudePolygon_ method. This is another shape that can be built using _MeshBuilder_. The outline of the shape is drawn in the XZ plane, with points in counter-clockwise order and the extrusion is in the Y direction. The origin for the polygon is the zero point on the bottom plane.

The outline for the car consists of an array of vector3 points forming a horizontal base line, a quarter circle for the front, followed by a horizontal base line. The vertical back will be formed by the _extrudePolygon_ method as it automatically joins the first and last point.

```javascript
//base
const outline = [new BABYLON.Vector3(-0.3, 0, -0.1), new BABYLON.Vector3(0.2, 0, -0.1)];

//curved front
for (let i = 0; i < 20; i++) {
  outline.push(new BABYLON.Vector3(0.2 * Math.cos((i * Math.PI) / 40), 0, 0.2 * Math.sin((i * Math.PI) / 40) - 0.1));
}

//top
outline.push(new BABYLON.Vector3(0, 0, 0.1));
outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));
```

These and the depth to extrude along Y, give the shape for the car

```javascript
const car = BABYLON.MeshBuilder.ExtrudePolygon("car", { shape: outline, depth: 0.2 });
```

> Note: The _extrudePolygon_ and [PolygonMeshBuilder](https://doc.babylonjs.com/divingDeeper/mesh/creation/param/polyMeshBuilder) both use a _earcut_ slicing algorithm.  
> The playground has earcut defined but if you are following this tutorial on your own file system that you will need to download the earcut algorithm via [cdn](https://unpkg.com/earcut@latest/dist/earcut.min.js) or [npm](https://github.com/mapbox/earcut#install).  
> If you are using TypeScript then you can inject the earcut algorithm as the _earcutInjection_ parameter on the [extudePolygon function](https://doc.babylonjs.com/typedoc/classes/babylon.meshbuilder#extrudepolygon).

<Playground id="#KDPAQ9#10" title="Learning to Extrude" description="Simple demonstration showing the basics of extruding meshes." image="/img/playgroundsAndNMEs/gettingStartedExtrude1.jpg"/>

We form the wheel for the right back position from a cylinder and add it as a child to the car. Then make copies for the right front, left back and left front wheels. This time using _clone_ rather than _createInstance_ since we can clone a clone. When we clone a wheel its parent is made the parent of the clone.

```javascript
const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", { diameter: 0.125, height: 0.05 });
wheelRB.parent = car;
wheelRB.position.z = -0.1;
wheelRB.position.x = -0.2;
wheelRB.position.y = 0.035;

const wheelRF = wheelRB.clone("wheelRF");
wheelRF.position.x = 0.1;

const wheelLB = wheelRB.clone("wheelLB");
wheelLB.position.y = -0.2 - 0.035;

const wheelLF = wheelRF.clone("wheelLF");
wheelLF.position.y = -0.2 - 0.035;
```

<Playground id="#KDPAQ9#11" title="Extruding Wheels" description="Expanding on the basics of extruding meshes." image="/img/playgroundsAndNMEs/gettingStartedExtrude2.jpg"/>

Now we will make the car look a bit more like a car using some textures.
