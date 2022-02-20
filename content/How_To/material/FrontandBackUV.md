---
title: Different Textures On The Front And Back Of A Mesh
image: 
description: Learn how to apply different textures to the front and back of a mesh.
keywords: diving deeper, materials, face materials, front, back, UV, UVs
further-reading:
video-overview:
video-content:
---

Having a front and a back makes most sense when talking about flat meshes such as a plane, a disc or a polygon. All of which have exactly two sides both of which can be seen only when the option _sideOrientation_ is set to **BABYLON.Mesh.DOUBLESIDE**.

However, many meshes have the option _sideOrientation_ and this method applies to them as well. In which case think of the front as outside and the back as inside.

To have different textures front and back the front and back image must be in the same file, like the one below

![front and back images](/img/how_to/different-material-front-back/card.jpg)

This is then split using the _frontUVs_ and _backUVs_ options.


## FrontUVs and BackUVs

Both frontUVs and backUVs have the form Vector4(u0, v0, u1, v1) with 0&lt;=  u0, v0, u1, v1 &lt;= 1 and 
(u0, v0) are the bottom left coordinates and (u1, v1) the top right coordinates of the clipping rectangle 
of the image.

To split the image above you can form two variables

```javascript
var f = new BABYLON.Vector4(0.5,0, 1, 1); // front image = half the whole image along the width 
var b = new BABYLON.Vector4(0,0, 0.5, 1); // back image = second half along the width 
```

and then place in the options

```javascript
var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 0.665, sideOrientation: BABYLON.Mesh.DOUBLESIDE, frontUVs: f, backUVs: b}, scene);
```

taking into account width to height ratio of section of image.

It is then just a case of creating a _StandardMaterial_ and setting the texture to the image.

```javascript
var mat = new BABYLON.StandardMaterial("", scene);
mat.diffuseTexture = new BABYLON.Texture("URL to Image File", scene);
plane.material = mat;
```

## Two Sided Examples

<Playground id="#LXZPJK#3" title="Different Images On A Plane" description="Simple example of applying different images to the front and back of a plane." image="/img/playgroundsAndNMEs/features/divingDeeperFrontBack1.jpg"/>
<Playground id="#4G18GY#2" title="Different Images On A Polygon" description="Simple example of applying different images to the front and back of a Polygon." image="/img/playgroundsAndNMEs/features/divingDeeperFrontBack2.jpg"/>

## Inside and Outside Examples

<Playground id="#165IV6#74" title="Different Images On A Tube" description="Simple example of applying different images to the front and back of a tube." image="/img/playgroundsAndNMEs/features/divingDeeperFrontBack3.jpg"/>
<Playground id="#K6M44R#3" title="Image On The Outside Of A Sphere" description="Simple example of applying an image to the outside of a sphere." image="/img/playgroundsAndNMEs/features/divingDeeperFrontBack4.jpg"/>
<Playground id="#K6M44R#4" title="Image On The Inside Of A Sphere" description="Simple example of applying an image to the inside of a sphere." image="/img/playgroundsAndNMEs/features/divingDeeperFrontBack5.jpg"/>