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

1. Grouping the vertices into three to form each face of the Geodesic polyhedron
2. Positioning the vertices in 3D space

In order to achieve both of these we need to understand transformations on an isomorphic grid and how to match three facet vertices across the edges of a primary triangle. Using Fig 7 as a basis, we can then label each GD(m, n) vertex in a primary triangle using an isomorphic coordinate system and then use rotations of 60<sup>o</sup> of a primary triangle to match up vertices to form the triangular facets of an adjacent primary triangle.

### Transformations on an Isomorphic Grid

In terms of the net all the GD(m, n) vertices lie on an isometric grid and we will need to rotate them 60<sup>o</sup> about given points. To understand how this is achieved we consider isometric vectors and their transformations.

The *x* axis is horizontal and the angle between the *x* axis and the *y* axis is 60<sup>o</sup> 

![axis](/img/snippets/geo11.png)  
Fig 8 Isometric Axis

The unit vector along the *x* axis is *i*&#8407; and along the *y* axis is *j*&#8407;, the unit vector k&#8407; = -*i*&#8407; + *j*&#8407;which lies along the third line of an isometric grid is also useful.

![unit vectors](/img/snippets/geo12.png)  
Fig 9 Unit Vectors

Consider the position vector *xi*&#8407; + *yj*&#8407; its length |*xi*&#8407; + *yj*&#8407;| = &radic;(*x<sup>2</sup>* + *y<sup>2</sup>* + *xy*);. This is the result of applying the cosine rule to the triangle in Fig 10 

|*xi*&#8407; + *yj*&#8407;| = &radic;(*x<sup>2</sup>* + *y<sup>2</sup>* + 2*xy*cos(120<sup>o</sup>)); and cos(120<sup>o</sup>) = 0.5

![length](/img/snippets/geo13.png)  
Fig 10 Unit Vectors

Vector additions still hold *xi*&#8407; + *yj*&#8407; + *ai*&#8407; + *bj*&#8407; = (*x* + *a*)*i*&#8407; + (*y* + *b*)*j*&#8407;

Luckily all our application needs only integer values for the vectors and rotations only multiples of 60<sup>o</sup>

Consider the rotation of the position vector *xi*&#8407; + *yj*&#8407; 60<sup>o</sup> about the origin O, where x and y are integers. The rotation about the origin can be R<sup>+</sup> (counter clockwise purple to red) or R<sup>-</sup> (clockwise purple to blue) as in Fig 11

![rotation](/img/snippets/geo14.png)  
Fig 11 Rotation about the origin

R<sup>+</sup>(*xi*&#8407; + *yj*&#8407;) = *yk*&#8407; + *xj*&#8407; = *y*(-*i*&#8407; + *j*&#8407;) + *xj*&#8407;  
= -*yi*&#8407; + (*x* + *y*)*j*&#8407;

R<sup>-</sup>(*xi*&#8407; + *yj*&#8407;) = *yi*&#8407; - *xk*&#8407; = *yi*&#8407; - *x*(-*i*&#8407; + *j*&#8407;);  
= (*x* + *y*)*&#8407; - *xj*&#8407;

Where S<sup>+</sup> and S<sup>-</sup> are respectively counter clockwise and clockwise rotations of *xi*&#8407; + *yj*&#8407;  60<sup>o</sup> about a point *ai*&#8407; + *bj*&#8407; 

S<sup>+</sup>(*xi*&#8407; + *yj*&#8407;, *ai*&#8407; + *bj*&#8407;)  
= R<sup>+</sup>((*xi*&#8407; + *yj*&#8407;) - (*ai*&#8407; + *bj*&#8407;)) + *ai*&#8407; + *bj*&#8407;  
= R<sup>+</sup>((*x* - *a*)*i*&#8407;) + (*y* - *b*)*j*&#8407;) + *ai*&#8407; + *bj*&#8407;   
= -(*y* - *b*)*i*&#8407; + ((*x* - *a*) + (*y* - *b*))*j*&#8407; + *ai*&#8407; + *bj*&#8407;  
= (*a* + *b* - *y)*i*&#8407; + (*x* + *y* - *a*)*j*&#8407;

S<sup>-</sup>(*xi*&#8407; + *yj*&#8407;, *ai*&#8407; + *bj*&#8407;)  
= R<sup>-</sup>((*xi*&#8407; + *yj*&#8407;) - (*ai*&#8407; + *bj*&#8407;)) + *ai*&#8407; + *bj*&#8407;    
= R<sup>-</sup>((*x* - *a*)*i*&#8407; + (*y* - *b*)*j*&#8407;) + *ai*&#8407; + *bj*&#8407;  
= (*x* - *a* + *y* - *b*)*i*&#8407; - (*x* - *a*)*j*&#8407; + *ai*&#8407; + *bj*&#8407;  
= (*x* + *y* - *b*)*i*&#8407; + (*a* + *b* - *x*)*j*&#8407;


### Match Vertices Across Edges of a Primary Face

A can be seen in Fig 12 every face F has three primary vertices, O, A and B, and is adjacent to three other faces F<sub>R</sub>, F<sub>L</sub>, F<sub>B</sub> where F can be mapped onto 
* F<sub>R</sub> by a rotation of 60<sup>o</sup> counter clockwise about B
* F<sub>L</sub> by a rotation of 60<sup>o</sup> clockwise about B
* F<sub>B</sub> by a rotation of 60<sup>o</sup> clockwise about O

You should also note that 
* F<sub>L</sub> can be mapped onto F by a rotation of 60<sup>o</sup> counter clockwise about B
* F<sub>B</sub> can be mapped onto F by a rotation of 60<sup>o</sup> counter clockwise about O


![map 1](/img/snippets/geo10.png)  
Fig 12 Face and Edge Relationships 

Since F shares edges with F<sub>R</sub>, F<sub>L</sub> and F<sub>B</sub> any matching of GD(m, n) vertices across the edges of F can be dealt with by considering the counter clockwise rotations of F onto F<sub>R</sub>, F<sub>L</sub> onto F and F<sub>B</sub> onto F. Using the labelled net of an icosahedron in Fig 13 a table covering all 30 edges of the icosahedron can be built showing which face is needed to be mapped 60<sup>o</sup> counter clockwise about which primary vertex onto which other face to enable the GD(m, n) facets to be correctly built across the edges.

![net 2](/img/snippets/geo9.png)  
Fig 13 Labelled Net

| From Face	| To Face	| About |	From Edge |	To Edge | | From Face	| To Face	| About |	From Edge |	To Edge |
| ----| ----	| ---- |	---- |	---- | ---- | ----| ----	| ---- |	---- |	---- |
| 0 | 1 | B | AB | OB | | 12 | 13 | A | AB | OA |
| 1 | 2 | B | AB | OB | | 12 | 3 | O | OB | OA |
| 2 | 3 | B | AB | OB | | 13 | 14 | O | OB | OA |
| 3 | 4 | B | AB | OB | | 14 | 5 | A | AB | OA |
| 4 | 0 | B | AB | OB | | 14 | 4 | O | OB | OA |
| 5 | 6 | O | OB | OA | | 15 | 19 | B | AB | OB |
| 6 | 7 | A | AB | OA | | 15 | 5 | A | OA | AB |
| 6 | 0 | O | OB | OA | | 16 | 15 | B | AB | OB |
| 7 | 8 | O | OB | OA | | 16 | 7 | A | OA | AB |
| 8 | 9 | A | AB | OA | | 17 | 16 | B | AB | OB |
| 8 | 1 | O | OB | OA | | 17 | 9 | A | OA | AB |
| 9 | 10 | O | OB | OA | | 18 | 17 | B | AB | OB |
| 10 | 11 | A | AB | OA | | 18 | 11 | A | OA | AB |
| 10 | 2 | O | OB | OA | | 19 | 18 | B | AB | OB |
| 11 | 12 | O | OB | OA | | 19 | 13 | A | OA | AB |




![primary triangle](/img/snippets/geo15.png)  
Fig 14 Rotation of Primary Triangle about the B for - Left GD(5, 2), Right (GD(6, 3))

Consider a primary triangle OAB as in Fig 14. For triangle OAB take O as the origin of the isometric axes then each vertex (red sphere) can be given (x, y) coordinates. For each y there is a minimum (blue marker) and maximum (green) value of x that belong to OAB. Rotating OAB 60<sup>o</sup> counter clockwise about B the minimum x map to the orange markers in the rotation. As you can see in Fig 14 example there is overlap of maximum and minimum markers at the primary triangle vertices. For GD(m, n) when n is a factor of m then the maximum x (green) of OAB coincide with the rotated minimum x (orange) for some facet vertices as well as at the primary triangle vertices.

We can also see that rows contain either one or two rotated minimums. 

![overlaps](/img/snippets/geo16.png)  
Fig 15 Facet Overlap Vertices

In Fig 15 we can see that for some rotated minimum vertices, say type T, (e.g. 3, 2, 1) the previous vertex is on the row below and for some, say type W, (e.g. 4) the previous vertex is on the same row. When a type T vertex shares a row with a type W vertex we type it as T<sub>1</sub> and when on a row by itself a type T<sub>0</sub>

For all facet vertices *xi*&#8407; + *yj*&#8407; of a primary triangle OAB of GD(m, n) let M<sup>X</sup>(*y*) be the point with maximum x value and M<sup>N</sup>(*y*) the point with minimum x value for row *y*.

Let *P* = *x<sub>p</sub>i*&#8407; + *y<sub>p</sub>j*&#8407; be the position vector of a rotated minimum *xi*&#8407; + *yj*&#8407;. 

When *P* is of type T, both  T<sub>0</sub> and T<sub>1</sub>, the upright triangle (light grey) has vertices *P*, M<sup>X</sup>(*y<sub>p</sub>* - 1), *P* + *i*&#8407; - *j*&#8407;

When *P* is of type T<sub>0</sub> the down triangle (dark grey) has vertices *P*, M<sup>X</sup>(*y<sub>p</sub>*), M<sup>X</sup>(*y<sub>p</sub>* - 1)

When *P* is of type T<sub>1</sub> the down triangle (dark grey) has vertices *P*, M<sup>X</sup>(*y<sub>p</sub>*), M<sup>X</sup>(*y<sub>p</sub>* - 1)

When *P* is of type W and *P* &ne; M<sup>X</sup>(*y<sub>p</sub>*):  
 &nbsp;&nbsp;&nbsp;the upright triangle (light grey) has vertices *P*, M<sup>X</sup>(*y<sub>p</sub>* - 1) - *i*&#8407;, M<sup>X</sup>(*y<sub>p</sub>* - 1)
 &nbsp;&nbsp;&nbsp;the down triangle (dark grey) has vertices *P*, M<sup>X</sup>(*y<sub>p</sub>*), M<sup>X</sup>(*y<sub>p</sub>* - 1) - *i*&#8407;

This range of vertex triples forms all the overlapping facets.

Considering Fig 14 these position vectors are all relative to the origin O of primary triangle F. However for facet vertices in F<sub>R</sub> we need the position vectors of these vertices to be relative to the origin O of F<sub>R</sub> when F<sub>R</sub> is rotated 60<sup>o</sup> clockwise. This is because we want all the primary triangles to be based on that in Fig 4

For each vertex in the triples based on *P* we just need to apply S<sup>-</sup>.  

For type T<sub>0</sub> it is clear that for some *y*  
S<sup>-</sup>(*P*, B) = M<sup>N</sup>(*y*) and  
S<sup>-</sup>(*P* + *i*&#8407; - *j*&#8407;, B) = M<sup>N</sup>(*y* - 1)

For types W and T<sub>1</sub> it is clear that for some *y*  
S<sup>-</sup>(T, B) = M<sup>N</sup>(*y*) and  
S<sup>-</sup>(W, B) = M<sup>N</sup>(*y* + 1)

Using Fig 4 as an example we can see that B = O + m*j*&#8407; + n*k*&#8407; 
 = m*j*&#8407 + n(*-i*&#8407; + j*&#8407;)    
= -n*i*&#8407 + (m + n)*j*&#8407

Taking any point on a row y, *xi*&#8407; + *yj*&#8407; and rotating about B to give *P*
S<sup>+</sup>(*xi*&#8407; + *yj*&#8407;, -n*i*&#8407; + (m + n)*j*&#8407;)  
= (-n + m + n - *y)*i*&#8407; + (*x* + *y* + *n*)*j*&#8407;
= (m - *y)*i*&#8407; + (*x* + *y* + *n*)*j*&#8407; 

and so *y<sub>p</sub>* = *x* + *y* + *n*

If follows that taking *y* from 1 to m + n and, excluding vertices where S<sup>+</sup>(M<sub>F<sub>R</sub></sub><sup>N</sup>(*y*)) = M<sub>F</sub><sup>N</sup>(*y*), the overlapping facet vertex triples are given by

| *P* Type | Triangle | Vertex Triple |
| ---- | ---- | ---- |
| T<sub>0</sub>, T<sub>1</sub> | Upright | M<sub>F<sub>R</sub></sub><sup>N</sup>(*y*), M<sub>F</sub><sup>X</sup>(*x* + *y* + *n* - 1) - *i*&#8407;, M<sub>F<sub>R</sub></sub><sup>N</sup>(*y* - 1) |
| W | Upright | M<sub>F<sub>R</sub></sub><sup>N</sup>(*y*), M<sub>F</sub><sup>X</sup>(*x* + *y* + *n* - 1) - *i*&#8407;, M<sub>F</sub><sup>X</sup>(*x* + *y* + *n* - 1) |
| T<sub>0</sub> | Down | M<sub>F<sub>R</sub></sub><sup>N</sup>(*y*), M<sub>F</sub><sup>X</sup>(*x* + *y* + *n*), M<sub>F</sub><sup>X</sup>(*x* + *y* + *n* - 1) |
| T<sub>1</sub> | Down | M<sub>F<sub>R</sub></sub><sup>N</sup>(*y*), M<sub>F<sub>R</sub></sub><sup>N</sup>(*y* + 1), M<sub>F</sub><sup>X</sup>(*x* + *y* + *n* - 1) |
| W | Down | M<sub>F<sub>R</sub></sub><sup>N</sup>(*y*), M<sub>F</sub><sup>X</sup>(*x* + *y* + *n*), M<sub>F</sub><sup>X</sup>(*x* + *y* + *n* - 1) - *i*&#8407; |

