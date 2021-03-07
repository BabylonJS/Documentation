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

From the net we can see that while some of the triangular facets that will make up the mesh lie in the plane of a primary triangle others will lie across adjacent primary triangles

![net 2](/img/snippets/geo7.png)  
Fig 7 Vertices of some facets lie across adjacent primary triangles.

When the icosahedron is formed from the net these facets will not lie on any the plane of any primary triangle.

