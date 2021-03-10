---
title: Geodesic and Goldberg Polyhedra Code Design
image: 
description: Creating the code to build Geodesic and Goldberg Polyhedra
keywords: geodesic, goldberg, icosphere, polyhedron, polyhedra, dome
further-reading:
  - title: Icosphere
    url: /divingDeeper/mesh/creation/polyhedra/icosphere
video-overview:
video-content:
---

## Overview
In this design we restrict both polyhedra to ones built from an icosahedron base. A Geodesic polyhedron is built from a number of isosceles triangles. A Goldberg polyhedron is the dual of a Geodesic one and vice versa. A dual of a polyhedron swaps faces for vertices and vertices for faces.

![Dual](/img/snippets/geo1.png)  
Fig 1 Icosahedron and its Dual

The simplest class of Geodesic polyhedra splits each face of an icosahedron into isosceles triangles.

![Geodesic](/img/snippets/geo2.png)  
Fig 2 Geodesic Polyhedron

![Geodesic Sphere](/img/snippets/geo3.png)  
Fig 3 Geodesic Polyhedron mapped to Sphere

More complex classes are formed by rotating, with restrictions, the isometric grid formed by the isosceles triangles that split each face.

## Geodesic Classes

An icosahedron is formed from 20 primary isosceles triangles. Rather than rotating the underlying grid we demonstrate the classes by rotating a primary triangle on a fixed isometric grid.

Rotations are formed by applying two positive integers *m* and *n*. From a fixed point O (0, 0) on the isometric grid form a point A (m, n) which is m horizontal units from O and n units along the positive gradient line. The primary triangle is formed with a point B such that OAB is an isosceles triangle. The Geodesic polyhedron so formed will be noted as GD(m, n) and its dual the Goldberg polyhedron as GP(m, n);

![primary 1](/img/snippets/geo5.png)  
Fig 4 Creating a GD(5, 2) on Isometric Grid

![primary 2](/img/snippets/geo6.png)  
Fig 5 Primary Triangle Grid Rotation 5, 2

There are three classes of these types of polyhedra

* Class I GD(m, 0)  
* Class II GD(m, m)  
* Class III GD(m, n) m &ne; n

For Class III GD(m, n) and GD(n, m) are reflections of each other as are GP(m, n) and GP(n, m). We only consider Class III GD(m, n) where m > n.

## Geodesic Nets

![net 1](/img/snippets/geo4.png)  
Fig 6 Net of Icosahedron for GD(5, 2)

From the net we can see that while some of the triangular faces that will make up the Geodesic mesh lie in the plane of a primary triangle others will lie across adjacent primary triangles

![net 2](/img/snippets/geo7.png)  
Fig 7 Vertices of some triangular faces lie across adjacent primary triangles.

When the icosahedron is formed from the net these faces will not lie on any the plane of any primary triangle.

## Building the Geodesic Polyhedron

There are two main steps to this:

1. Grouping the vertices into three to form each face of the Geodesic polyhedron;
2. Positioning the vertices in 3D space.

Part of the solution for 1 is dealing with transformations on an isomorphic grid.

### Coordinates and Vectors on an Isomorphic Grid

### Face Map

![net 2](/img/snippets/geo9.png)  
Fig 8 Labelled Net

Edge	From Face	To Face	About Vertex	From Edge	To Edge
0|1	0	1	B	AB	OB
1|2	1	2	B	AB	OB
2|3	2	3	B	AB	OB
3|4	3	4	B	AB	OB
0|4	4	0	B	AB	OB
5|6	5	6	O	OB	OA
6|7	6	7	A	AB	OA
0|6	6	0	O	OB	OA
7|8	7	8	O	OB	OA
8|9	8	9	A	AB	OA
1|8	8	1	O	OB	OA
9|10	9	10	O	OB	OA
10|11	10	11	A	AB	OA
2|10	10	2	O	OB	OA
11|12	11	12	O	OB	OA
12|13	12	13	A	AB	OA
3|12	12	3	O	OB	OA
13|14	13	14	O	OB	OA
5|14	14	5	A	AB	OA
4|14	14	4	O	OB	OA
15|19	15	19	B	AB	OB
5|15	15	5	A	OA	AB
15|16	16	15	B	AB	OB
7|16	16	7	A	OA	AB
16|17	17	16	B	AB	OB
9|17	17	9	A	OA	AB
17|18	18	17	B	AB	OB
11|18	18	11	A	OA	AB
18|19	19	18	B	AB	OB
13|19	19	13	A	OA	AB





