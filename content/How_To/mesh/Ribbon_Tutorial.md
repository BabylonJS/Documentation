---
title: Ribbon In Detail
image:
description: Dive into the details of ribbons in Babylon.js.
keywords: diving deeper, meshes, parametric shapes, ribbons
further-reading:
video-overview:
video-content:
---

## Ribbon in Detail

Lets take a closer look at a ribbon

It is formed using paths. A path is simply an array of a minimum of two vector3 points.

Below shows the construction of a ribbon using two paths A and B each having five points.

![Ribbon](/img/how_to/ribbon/ribbon.png)

Here's a simple example:

<Playground id="#MZ7QRG#1194" title="Simple Ribbon Example" description="Simple ribbon example."/>

You can have as many paths as you wish, including just one, you can close all the paths and/or close the paths array itself. Imagine a long ribbon of narrow width in the real world with wire running down its length. Closing the paths forms a loop of ribbon while closing the array would form a tube.

## Single Path Ribbon

First construct the single path, for example

```javascript
pathHelix = [];
let v;
for (let i = 0; i <= 60; i++) {
  v = (2.0 * Math.PI * i) / 20;
  pathHelix.push(new BABYLON.Vector3(3 * Math.cos(v), i / 4, 3 * Math.sin(v)));
}
```

Showing the path: <Playground id="#F6JW5W#12" title="Showing Ribbon Path" description="Simple example of showing ribbon path."/>

The ribbon is formed by joining each point on the path to a later point where one exists. The _offset_ property governs how many points ahead the current point with be joined to. The triangular facets for the mesh are formed from the current point, the next point and the offset point.

For point _p_ and offset _f_ the triangle is _p_, _p + 1_, _p + f_, provided of course that _p + f &lt; number of points in the path array_

Create the ribbon with a variety of offsets and show in wireframe  
default offset, half the path length (60 / 2 = 30): <Playground id="#F6JW5W#13" title="Create a Ribbon Example 1" description="Simple example of creating a ribbon with varying properties."/>
offset 10: <Playground id="#F6JW5W#14" title="Create a Ribbon Example 2" description="Simple example of creating a ribbon with varying properties."/>
offset 5: <Playground id="#F6JW5W#15" title="Create a Ribbon Example 3" description="Simple example of creating a ribbon with varying properties."/>
offset 20: <Playground id="#F6JW5W#16" title="Create a Ribbon Example 4" description="Simple example of creating a ribbon with varying properties."/>

So playing with _offset_, _closeArray_, or other parameters, you can easily get volumes, even with a single path: <Playground id="#F6JW5W#17" title="Create a Ribbon Example 5" description="Simple example of creating a ribbon with varying properties."/>

## Length of Paths

It's not mandatory that all the ribbon paths have the same length, but it is not recommended.  
The best way to emulate different lengths for some parts of your mesh is then to simply use many ribbons.

In this example: <Playground id="#88AZQ#16" title="Create a Ribbon With Path Lengths" description="Simple example of creating a ribbon using path lengths."/>
_path2_ and _path3_ are longer than _path1_ and _path4_.

As you can see, the final ribbon adjusts to different lengths. The rule is they all start from first path points and each intermediate ribbon then stops at first of its both constituting paths end. However, while you can add color using a material, as done here: <Playground id="#88AZQ#17" title="Create a Colored Ribbon" description="Simple example of creating a colred ribbon."/>

There is no incidence on light reflection for ribbon with different length paths.
Therefore you **can't add a texture** to a ribbon constructed with different length paths.  
This is due to the fact that the nested ribbon texturing algorithm only knows how to deal with a unique length for all paths.
When applying a texture the algorithm assumes that the ribbon can be unfolded into a rectangle that can stretched to fit on top of the image used for the texture.
This is only possible when paths are of equal length.

## Closed shapes : normals or textures ?

The ribbon mesh provides two ways to automatically close an unclosed shape.

- _closeArray_ parameter : this will add an extra unit ribbon between the last path and the first path of your _pathArray_.
- _closePath_ parameter : this will join the last and first points of each _path_ in your _pathArray_.

<Playground id="#3XMWZ#44" title="Start With An Unclosed Ribbon" description="Simple example of creating an unlcosed ribbon."/>

```javascript
var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: paths }, scene);
```

<Playground id="#3XMWZ#45" title="Ribbon With CloseArray" description="Simple example of creating a ribbon With CloseArray set to true."/>

```javascript
var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: paths, closeArray: true }, scene);
```

<Playground id="#3XMWZ#49" title="Textured Ribbon" description="Simple example of creating a textured ribbon."/>

Notice that the texture isn't stretched on the surface added by the automatic closing but applied independently.
The reason for this behavior is that, with ribbon _closeXXX_ parameters, priority is given to the normals (the tools that compute light reflection) over textures.
If you don't care about continuous light reflection but you do want your texture to be stretched along the whole surface,
you just have to forget automatic closing and close the ribbon by yourself. A simple way to do this is just to re-push the first _path_ at the end of the _pathArray_

<Playground id="#3XMWZ#50" title="Closed Textured Ribbon" description="Simple example of creating a closed textured ribbon."/>

```javascript
paths.push(paths[0]);
var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: paths }, scene);
```

The same rules and workarounds apply to the _closePath_ parameter.

<Playground id="#3XMWZ#52" title="Ribbon With ClosePath" description="Simple example of creating a ribbon with closePath set to true."/>

<Playground id="#3XMWZ#51" title="Textured Ribbon With ClosePath" description="Simple example of creating a textured ribbon with closePath set to true."/>
