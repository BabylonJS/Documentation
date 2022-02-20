---
title: Introduction - Chapter 2 - Face Materials
image: 
description: Continue your Babylon.js learning by adding materials to individual faces of the meshes in your scene.
keywords: getting started, start, chapter 2, face material, face materials
further-reading:
    - title: More on Per Face Material
      url: /features/divingDeeper/materials/using/texturePerBoxFace
video-overview:
video-content:
---

# Introduction - Face Materials

## Material For Each House Side

In the options properties for a box one is *faceUV* and array of Vector4s. We can use this to obtain a part of the area of an image to apply to one face of the box.

In the *faceUV* array faces are numbered 0 for back, 1 front, 2 right, 3 left, 4 top and 5 bottom.

## Detached House Example
We will start with this image

![cubehouse texture](/img/getstarted/cubehouse.png)

which contains, in order, images of the same size for the front, right, back and left sides of the house.

The width of each image is 0.25 of the whole image width. To specify the part of the image to use we give two co-ordinates one for the lower left corner and one for the upper right corner. For the whole image we would use (0, 0) and (1, 1), for part images the co-ordinate values will be a fraction between 0 and 1.

Rather then using two sets of co-ordinates we use a 4 dimensional  
vector (lower left x, lower left y, upper right x, upper right y)

Matching sides to part images gives  
front, 1, (0.0, 0.0, 0.25, 1.0)  
right, 2, (0.25, 0, 0.5, 1.0)  
back, 0, (0.5, 0.0, 0.75, 1.0)  
left, 3, (0.75, 0, 1.0, 1.0)  
as the top and bottom are not seen we will just use the defaults.

We set these using
```javascript
faceUV = [];
faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
```

Unless we set another option property, *wrap = true*, some of these partial images will still be rotated. We create the box like this
```javascript
const box = BABYLON.MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
```
Of course we also need to change the image used for the diffuse texture of the box material.

<Playground id="#KBS9I5#72" title="Adding Materials To Individual Object Faces" description="A playground demonstrating how to add materials to individual faces of the objects in your scene." image="/img/playgroundsAndNMEs/gettingStartedFaceMaterials.jpg"/>

![house 3](/img/getstarted/house3.png)

## Semi Detached House Example
In this case the house is twice as wide and so are parts of the image

![semihouse texture](/img/getstarted/semihouse.png)

The front and back of the house (far left and right of the image) is twice the width of a side (middle image) which we can use twice.

<Playground id="#KBS9I5#73" title="Reusing Materials On Individual Object Faces" description="A playground demonstrating how to add reuse materials to apply on individual faces of the objects in your scene." image="/img/playgroundsAndNMEs/gettingStartedFaceMaterialsDoubled.jpg"/>

![house 4](/img/getstarted/house4.png)

## Moving On

Having created our detached and semi-detached houses we would like many copies of them to form our world. We could make, separately, copies of the boxes and the roofs but it would be easier if we could combine a box and roof into one mesh, a house. Before we do this let's tidy up the code so that we can concentrate on the new code we are adding. To this end we place the existing code into functions.

<Playground id="#KBS9I5#74" title="Wrapping House Building Into Functions" description="A playground wrapping mesh-building code into functions for future repeat use." image="/img/playgroundsAndNMEs/gettingStartedFaceMaterials.jpg"/>