---
title: Creating Polyhedra Shapes
image: 
description: Learn how to create polyhedra shapes in Babylon.js.
keywords: diving deeper, meshes, polyhedra shapes
further-reading:
video-overview:
video-content:
---

## Polyhedra
There are many polyhedra, too many for each to be created under its own name. Their names are often long anyway, so Babylon.js provides 15 common ones by number. There are many beyond these 15, and those can be created from custom data sets provided in the form of Playground examples. 

The twenty-sided icosahedron has the interesting property of approximating a sphere. By dividing each face into triangles and then mapping the resulting vertices onto a sphere, it gives a better approximation of a sphere. The solids formed are called icospheres and provide a more regular distribution of triangles around a sphere than the *CreateSphere* method.

Other sphere approximations can be provided by geodesic and Goldberg polyhedra. Like the icosphere, a geodesic polyhedron is based on an icosahedron and formed from equilateral triangles. In this case, however, their arrangement depends on two integer parameters, m and n. A Goldberg polyhedron is the dual of a geodesic one, and vice versa. A dual polyhedron is formed by mapping its vertices to the faces of the dual and its faces to the dual's vertices. A Goldberg polyhedron is made up of 12 pentagonal faces and many hexagonal faces, and has the advantage of providing a planet-shaped hexagon-grid world.

![Geodesic Vertices](/img/snippets/geo30.webp)  
The arrangement of vertices for a Geodesic Poly with m = 6 and n = 0, 1, 2 in order