---
title: Getting Started - Chapter 2 - Basic House
image: 
description: Continue your Babylon.js learning by adding a new mesh type to your scene.
keywords: getting started, start, chapter 2, meshes, cylinder, prism
further-reading:
    - title: More on Meshes
      url: /features/featuresDeepDive/mesh/creation/set
video-overview:
video-content:
---

# Getting Started - Basic House

## A Basic House
Adding a roof would make our box more house like. We need a prism like shape. Luckily we can do that using *CreateCylinder*. Well the name might imply a cylinder rather than a prism however in using it you need to state how may points around the circumference of the cylinder and for a prism we can use three points.

```javascript
const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
roof.scaling.x = 0.75;
roof.rotation.z = Math.PI / 2;
roof.position.y = 1.22;
```

Since the cylinder is created vertically we needed to rotate it to a horizontal position and scale it down in one direction so that the height of the roof is less than its width.

<Playground id="#KBS9I5#70" title="Adding a Prism Roof Using 'CreateCylinder'" description="A playground demonstrating how to add a 'prism' roof to your house." image="/img/playgroundsAndNMEs/gettingStartedPrism.jpg"/>

![house 1](/img/getstarted/house1.png)

The world will be improved with a little color and texture.