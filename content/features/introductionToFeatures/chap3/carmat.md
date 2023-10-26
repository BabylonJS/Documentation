---
title: Getting Started - Chapter 3 - Car Materials
image:
description: Learn to add materials to extruded meshes.
keywords: getting started, start, chapter 3, materials, extrude
further-reading:
video-overview:
video-content:
---

# Getting Started - Car Materials

## Car Material

Just as we used different images on different faces of a box something similar is available for extruded polygons and cylinders.

For the car body we use this image

![car](/img/getstarted/car.png)

and this one for the wheels

![wheel](/img/getstarted/wheel.png)

For the cylinder face 0, is the bottom, face 2 the top and face 1 the edge joining the bottom and top and for the extruded polygon it is face 0, is the top and face 2 the bottom. Remember that currently the car body and its wheels are built lying down

The top and bottom of the car body use the image in the top left (almost) quarter. The edge part goes across the bottom, round the front, across the top and down the back of the body uses the lower half of the image.

The top of the car body is as you would expect and is given by the bottom left co-ordinates (0, 0.5) to the top right ones (0.38, 1);

```javascript
faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
```

The bottom of the car body uses the same image but it needs flipping over to fit the other side of the car.
```javascript
faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);
```

The edge runs from (0, 0) to (1, 0.5)
```javascript
faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
```

<Playground id="#KDPAQ9#12" title="Adding Materials To The Car" description="Simple demonstration of adding a material to the extruded car body." image="/img/playgroundsAndNMEs/gettingStartedCarMaterials1.jpg"/>

A wheel is more straight forward because of its symmetry and it uses the whole image for the top and bottom and just picks up a black pixel for the edges.

```javascript
wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
```
Putting these together and rotating the finished car upright gives

![car model](/img/getstarted/carmodel.png)

<Playground id="#KDPAQ9#13" title="Adding Materials To The Wheels" description="Simple demonstration of adding a material to the extruded wheels." image="/img/playgroundsAndNMEs/gettingStartedCarMaterials2.jpg"/> 

At last we are ready to think about animating the wheels.
