---
title: Vertex Normals
image: 
description: Learn all about vertex normals in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, vertex normals
further-reading:
    - title: Custom Meshes
      url: /divingDeeper/mesh/creation/custom
    - title: Updating Vertices
      url: /divingDeeper/mesh/creation/custom/updatingVertices
video-overview:
video-content:
---

## Vertex Normals

Each triangular facet of a mesh comprises three vertices. Besides a position each vertex has another important vector3 called a normal. These vertex normals are used by the [shader code](/resources/ShaderIntro) in calculating how the mesh is lit. Unlike a mathematical normal there is no necessity for them to be set at right angles and for curved shapes such as a sphere they may not be. In the case of a sphere they are set as the mathematical normal of the sphere surface rather than that of the flat facets of the mesh that create the sphere.

At first the vertex normals are calculated as the mathematical normals for the facet. It then depends whether you want to view the facets as flat surfaces or as part of curve. For flat surfaces the vertex normals remain as the mathematical normals. To enhance the curve when viewed under light where triangular facets share vertices with the same positions each shared vertex normal is recalculated to be the average of the mathematical normals of the shared vertex normals. 

These effects are explored below.

In the following two playgrounds see how the changing directions within the normals array affect how it is lit:

<Playground id="#VKBJN#18" title="Vertex Normals Varying In Unison" description="Simple example of vertex normals varying in unison." image=""/>

<Playground id="#VKBJN#19" title="Showing Normals Varying" description="Simple example of showing vertex normal variation." image=""/>

##Normals and Minimum Vertices

![Wireframe](/img/how_to/Mesh/box1.jpg)

The box above has 8 vertices. If we want to keep the indices to the minimum they will be 0, 1, 2, 3, 4, 5, 6, 7.

Facets 0, 3, 7 and 3, 7, 6 and 0, 3, 2 all have vertex 3 in common and vertex 3 can only have one 
entry in the normals array associated with it.

How does BabylonJS calculate the `normal` for vertex 3? 

The diagram below shows that the average of the three mathematical normals at each vertex is used:

![Normals](/img/how_to/Mesh/box4.jpg)

Besides minimising the number of vertices needed there are other advantages as will be seen when creating a sphere.

Keeping the indices to a minimum the normals at each corner are an average of the mathematical normals of the three faces that meet at that corner. So 8 corners and 8 unique vertex normals.

## Table of Unique Indices, Positions and Normals for Box with Minimum Vertices

index | position | normal
--- | --- | ---
0 | ( -1 ,  1 ,  -1 ) | ( -0.5773502691896258 ,  0.5773502691896258 ,  -0.5773502691896258 )
1 | ( 1 ,  1 ,  -1 ) | ( 0.8164965809277261 ,  0.4082482904638631 ,  -0.4082482904638631 )
2 | ( 1 ,  -1 ,  -1 ) | ( 0.4082482904638631 ,  -0.4082482904638631 ,  -0.8164965809277261 )
3 | ( -1 ,  -1 ,  -1 ) | ( -0.4082482904638631 ,  -0.8164965809277261 ,  -0.4082482904638631 )
4 | ( -1 ,  1 ,  1 ) | ( -0.4082482904638631 ,  0.4082482904638631 ,  0.8164965809277261 )
5 | ( 1 ,  1 ,  1 ) | ( 0.4082482904638631 ,  0.8164965809277261 ,  0.4082482904638631 )
6 | ( 1 ,  -1 ,  1 ) | ( 0.5773502691896258 ,  -0.5773502691896258 ,  0.5773502691896258 )
7 | ( -1 ,  -1 ,  1 ) | ( -0.8164965809277261 ,  -0.4082482904638631 ,  0.4082482904638631 )

## Normals and Flat Shaded Meshes.

There are times, such as needing each face of a box to be covered in a [different material](/divingDeeper/mesh/facetData), 
when it is better to have the box constructed from seperate faces each of which are contructed by two facets and no two faces 
sharing a vertex indices. They will of course share vertex positions.

![Seperate Faces](/img/how_to/Mesh/box3.jpg)

In BabylonJS this can be achieved using the `convertToFlatShadedMesh` function. The results are shown below:

![Flat Shaded Normals](/img/how_to/Mesh/box5.jpg)

For a flat shaded mesh each the triangular facets making a face of the box has mathematical normals as the vertex normals. Each face has 4 corners each of which has a unique normal at right angles to the face. There are 6 faces on a box and so 24 unique corner normals. Since each face is made up of two triangular facets and each facet has three normals there will be 6 x 2 * 3 = 36 normals in the normals array. However since two facets will meet at two corners there will be 12 repeats within these 36.

## Table of Indices, Positions and Unique Normals for Flat Shaded Box

index | position | normal
--- | --- | ---
0 | ( -1 ,  1 ,  -1 ) | ( 0 ,  0 ,  -1 )
1 | ( 1 ,  -1 ,  -1 ) | ( 0 ,  0 ,  -1 )
2 | ( 1 ,  1 ,  -1 ) | ( 0 ,  0 ,  -1 )
3 | ( -1 ,  1 ,  -1 ) | ( 0 ,  0 ,  -1 )
4 | ( -1 ,  1 ,  1 ) | ( 0 ,  0 ,  1 )
5 | ( 1 ,  -1 ,  1 ) | ( 0 ,  0 ,  1 )
6 | ( -1 ,  -1 ,  1 ) | ( 0 ,  0 ,  1 )
7 | ( -1 ,  1 ,  1 ) | ( 0 ,  0 ,  1 )
8 | ( 1 ,  1 ,  -1 ) | ( 1 ,  -0 ,  0 )
9 | ( 1 ,  -1 ,  1 ) | ( 1 ,  -0 ,  0 )
10 | ( 1 ,  1 ,  1 ) | ( 1 ,  -0 ,  0 )
11 | ( 1 ,  1 ,  -1 ) | ( 1 ,  0 ,  0 )
12 | ( -1 ,  1 ,  -1 ) | ( -1 ,  0 ,  0 )
13 | ( -1 ,  -1 ,  1 ) | ( -1 ,  0 ,  0 )
14 | ( -1 ,  -1 ,  -1 ) | ( -1 ,  0 ,  0 )
15 | ( -1 ,  1 ,  -1 ) | ( -1 ,  -0 ,  -0 )
16 | ( -1 ,  1 ,  -1 ) | ( 0 ,  1 ,  0 )
17 | ( 1 ,  1 ,  1 ) | ( 0 ,  1 ,  0 )
18 | ( -1 ,  1 ,  1 ) | ( 0 ,  1 ,  0 )
19 | ( 1 ,  1 ,  -1 ) | ( 0 ,  1 ,  -0 )
20 | ( -1 ,  -1 ,  -1 ) | ( 0 ,  -1 ,  -0 )
21 | ( 1 ,  -1 ,  1 ) | ( 0 ,  -1 ,  -0 )
22 | ( 1 ,  -1 ,  -1 ) | ( 0 ,  -1 ,  -0 )
23 | ( -1 ,  -1 ,  1 ) | ( 0 ,  -1 ,  0 )

## Playground Showing Box Normals

<Playground id="#1H7L5C#37" title="Box Normals" description="Simple example of box normals." image=""/>

## Advantage of Shared Normals

Sharing normals means that the shader produces a rounder looking sphere since the vertex normals are the mathematical normals of the sphere surface.

Applying the function `converToFlatShadedMesh` shows the individual faces making up the sphere. For a flat shaded sphere the normals of each facet are the mathematical normals of the facet.

<Playground id="#1H7L5C#38" title="Comparing Shading of Spheres" description="Simple example comparing shading of spheres." image=""/>