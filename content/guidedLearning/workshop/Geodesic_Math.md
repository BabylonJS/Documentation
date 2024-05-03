---
title: Geodesic and Goldberg Polyhedra Mathematics
image: 
description: The Math used to build Geodesic and Goldberg Polyhedra
keywords: geodesic, goldberg, icosphere, polyhedron, polyhedra, dome
further-reading:
  - title: Geodesic and Goldberg Polyhedra Code Design
    url: /guidedLearning/workshop/Geodesic_Code
  - title: Icosphere
    url: /features/featuresDeepDive/mesh/creation/polyhedra/icosphere
  - title: A Unified Approach to Geodesic Polyhedra
    url: https://www.researchgate.net/publication/267268539_A_Unified_Approach_to_Class_I_II_III_Geodesic_Domes
video-overview:
video-content:
---

## Overview

In this design we restrict both polyhedra to ones built from an icosahedron base. A Geodesic polyhedron is built from a number of equilateral triangles. A Goldberg polyhedron is the dual of a Geodesic one and vice versa. A dual of a polyhedron swaps faces for vertices and vertices for faces.

![Dual](/img/snippets/geo1.png)  
Fig 1 Icosahedron and its Dual

The simplest class of Geodesic polyhedra splits each face of an icosahedron into equilateral triangles.

![Geodesic](/img/snippets/geo2.png)  
Fig 2 Geodesic Polyhedron

![Geodesic Sphere](/img/snippets/geo3.png)  
Fig 3 Geodesic Polyhedron mapped to Sphere

More complex classes are formed by rotating, with restrictions, the isometric grid formed by the equilateral triangles that split each face.

## Geodesic Classes

A regular icosahedron is formed from 20 primary equilateral triangles. Rather than rotating the underlying grid we demonstrate the classes by rotating a primary triangle on a fixed isometric grid.

Rotations are formed by applying two positive integers m and n. From a fixed point O (0, 0) on the isometric grid form a point A (m, n) which is m horizontal units from O and n units along the positive gradient line. The primary triangle is formed with a point B such that OAB is an equilateral triangle. The Geodesic polyhedron so formed will be noted as GD(m, n) and its dual the Goldberg polyhedron as GP(m, n);

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

Consider the rotation of the position vector *xi*&#8407; + *yj*&#8407; 60<sup>o</sup> about the origin O, where x and y are integers. The rotation about the origin can be R<sup>+</sup> (counter-clockwise purple to red) or R<sup>-</sup> (clockwise purple to blue) as in Fig 11

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

![rotation center](/img/snippets/geo22.png)  
Fig 12 Symmetry Rotations 0 <sup>o</sup>, 120<sup>o</sup>, -120<sup>o</sup>

We also need to consider rotations 120<sup>o</sup> and -120<sup>o</sup> about the center of the triangle OAB.

Let P have position vector *xi*&#8407; + *yj*&#8407; which after a rotation of 120<sup>o</sup> maps to P<sub>1</sub> and after a rotation of -120<sup>o</sup> maps to P<sup>2</sup>

P<sub>1</sub> = m*i*&#8407; + n*j*&#8407; - *yi*&#8407; + *xk*&#8407;  
= m*i*&#8407; + n*j*&#8407; - *yi*&#8407; - *xi*&#8407; + *xj*&#8407;  
= (m - *x* - *y*)*i*&#8407; + (n + *x*)j*&#8407; 

P<sup>2</sup> =  -n*i*&#8407; + (m + n)*j*&#8407; - *yk*&#8407; - *xj*&#8407;  
= -n*i*&#8407; + (m + n)*j*&#8407; + *yi*&#8407; - *yj*&#8407; - *xj*&#8407;  
= (*y* - n)*i*&#8407; + (m + n - *x* - *y*)*j*&#8407;

Where R<sup>C+</sup> is a rotation of 120<sup>o</sup> and R<sup>C-</sup> is a rotation of -120<sup>o</sup> about the center of OAB

R<sup>C+</sup>(*xi*&#8407; + *yj*&#8407;) = (m - *x* - *y*)*i*&#8407; + (n + *x*)j*&#8407;  
R<sup>C-</sup>(*xi*&#8407; + *yj*&#8407;) = (*y* - n)*i*&#8407; + (m + n - *x* - *y*)j*&#8407;

### Match Vertices Across Edges of a Primary Face

We can label the face and vertices for each primary triangle as shown in the net for Fig 13. Taking OA as the base, OB as the left edge and AB as the right edge of each face; every face has a face on its left, F<sub>L</sub>, right, F<sub>R</sub>, and base F<sub>B</sub>

![net 2](/img/snippets/geo9.png)  
Fig 13 Labelled Net

Depending on the position of the face the vertex alignment differs as can be seen in Fig 14.

![map 1](/img/snippets/geo10.png)  
Fig 14 Face and Edge Relationships 

Since F shares edges with F<sub>R</sub>, F<sub>L</sub> and F<sub>B</sub> any matching of GD(m, n) vertices across the edges of F can be dealt with by considering the counter-clockwise rotations of various permutations of F, F<sub>R</sub>, F<sub>L</sub> or F<sub>B</sub> around the vertices, O, A or B,  as shown in red in Fig 14. The 30 possible edges are all covered by the table below.

|From Face|To Face|About||From Face|To Face|About|
|----|----|----|----|----|----|----|
|0|1|B||10|0|O||
|1|2|B||11|1|O||
|2|3|B||12|2|O|
|3|4|B||13|3|O|
|4|0|B||14|4|O|
|5|10|O||15|19|B|
|5|14|A||15|5|A|
|6|11|O||16|15|B|
|6|10|A||16|6|A|
|7|12|O||17|16|B|
|7|11|A||17|7|A|
|8|13|O||18|17|B|
|8|12|A||18|8|A|
|9|14|O||19|18|B|
|9|13|A||19|9|A|

Table 1  

&nbsp  
&nbsp;  

We can see that a rotation about B aligns edge AB and OB, about O aligns edge OB and OA and about A aligns OA and BA. 

We now consider obtaining the three vertices for the edge overlapping facets in more detail. We start with a rotation about B


![primary triangle](/img/snippets/geo15.png)  
Fig 15 Rotation of Primary Triangle about the B for - Left GD(5, 2), Right (GD(6, 3))

Consider a primary triangle OAB as in Fig 15. For triangle OAB take O as the origin of the isometric axes then each vertex (red sphere) can be given (x, y) coordinates. For each y there is a minimum (blue marker) and maximum (green) value of x that belong to OAB. Rotating OAB 60<sup>o</sup> counter-clockwise about B the minimum x map to the orange markers in the rotation. As you can see in Fig 15 example there is overlap of maximum and minimum markers at the primary triangle vertices. For GD(m, n) when n is a factor of m then the maximum x (green) of OAB coincide with the rotated minimum x (orange) for some facet vertices as well as at the primary triangle vertices.

We can also see that rows contain either one or two rotated minimums. 

![overlaps](/img/snippets/geo16.png)  
Fig 16 Facet Overlap Vertices

In Fig 16 we can see that there are three types of rotated minimum vertices 0, 1, 2 that produce facets that overlap the edge. Each of these points can be associated with two facet triangle, one that is up (light grey) and one down (dark grey).

For all facet vertices *xi*&#8407; + *yj*&#8407; of a primary triangle OAB of GD(m, n) let M<sup>max</sup>(*y*) be the point with maximum x value and M<sup>min</sup>(*y*) the point with minimum x value for row *y*.

Let *P* = *x<sub>p</sub>i*&#8407; + *y<sub>p</sub>j*&#8407; be the position vector of a rotated minimum *xi*&#8407; + *yj*&#8407; =  M<sup>min</sup>(*y*). 

When *P* = M<sup>max</sup>(*y<sub>p</sub>*) the up and down facets lie inside the primary triangle are thus ignored in creating overlapping facets.

For an up facet
When *P* is of type 0 and 1 the facet (light grey) has vertices *P*, M<sup>max</sup>(*y<sub>p</sub>* - 1), *P* + *i*&#8407; - *j*&#8407;

When *P* is of type 2 the facet (light grey) has vertices *P*, M<sup>max</sup>(*y<sub>p</sub>* - 1) - *i*&#8407;, M<sup>max</sup>(*y<sub>p</sub>* - 1)

For a down facet
When *P* is of type 0 the facet (dark grey) has vertices *P*, M<sup>max</sup>(*y<sub>p</sub>*), M<sup>max</sup>(*y<sub>p</sub>* - 1)

When *P* is of type 1 the facet (dark grey) has vertices *P*, *P* - *i*&#8407;, M<sup>max</sup>(*y<sub>p</sub>* - 1)

When *P* is of type 2 the facet (dark grey) has vertices *P*, M<sup>max</sup>(*y<sub>p</sub>*), M<sup>max</sup>(*y<sub>p</sub>* - 1) - *i*&#8407;

This range of vertex triples forms all the overlapping facets.

Considering Fig 15 these position vectors are all relative to the origin O of primary triangle F. However for facet vertices in F<sub>R</sub> we need the position vectors of these vertices to be relative to the origin O of F<sub>R</sub>. Rotating F<sub>R</sub> 60<sup>o</sup> clockwise will return F<sub>R</sub> to the primary triangles position as in Fig 4

For each vertex in the triples based on *P* we just need to apply S<sup>-</sup>.  Since S<sup>-</sup>(S<sup>+</sup>) is the identity S<sup>-</sup>(*P*, B) = *xi*&#8407; + *yj*&#8407;

For *xi*&#8407; + *yj*&#8407;   
Type 1 occurs when *P*.*j*&#8407 = S<sup>+</sup>(M<sup>min</sup>(*y* + 1);, B).*j*&#8407  
Type 2 occurs when *P* - *j*&#8407; &ne;  M<sup>max</sup>(*y<sub>p</sub>* - 1)  
Otherwise *P* is of type 0.

*P* = S<sup>+</sup>(*xi*&#8407; + *yj*&#8407;, B)    
= S<sup>+</sup>(*xi*&#8407; + *yj*&#8407;, -n*i*&#8407; + (m + n)*j*&#8407;)  
= (-n + m + n - *y*)*i*&#8407; + (*x* + *y* + *n*)*j*&#8407;  
= (m - *y*)*i*&#8407; + (*x* + *y* + n)*j*&#8407;  

*P* + *i*&#8407; - *j*&#8407; = (m - *y*)*i*&#8407; + (*x* + *y* + n)*j*&#8407; + *i*&#8407; - *j*&#8407;  
= (m - (*y* - 1))*i*&#8407; + (*x* + (*y* - 1) + n)*j*&#8407;
= S<sup>+</sup>(*xi*&#8407; + (*y* - 1)j*&#8407;, B);

*P* - *i*&#8407; = (m - *y*)*i*&#8407; + (*x* + *y* + n)*j*&#8407; - *i*&#8407;  
= (m - (*y* + 1))*i*&#8407; + (*x* - 1 + (*y* + 1) + n)*j*&#8407;
= S<sup>+</sup>((*x* - 1)i*&#8407; + (*y* + 1)j*&#8407;, B);


If follows that the overlapping facet vertex triples are given by

| *P* Type | Triangle | Vertex Triple |
| ---- | ---- | ---- |
| 0, 1 | Up | M<sub>F<sub>R</sub></sub><sup>min</sup>(*y*), M<sub>F</sub><sup>max</sup>(*y<sub>p</sub>* - 1), M<sub>F<sub>R</sub></sub><sup>min</sup>(*y* - 1)|
| 2 | Up | M<sub>F<sub>R</sub></sub><sup>min</sup>(*y*), M<sub>F</sub><sup>max</sup>(*y<sub>p</sub>* - 1) - *i*&#8407;, M<sub>F</sub><sup>max</sup>(*y<sub>p</sub>* - 1) |
| 0 | Down | M<sub>F<sub>R</sub></sub><sup>min</sup>(*y*), M<sub>F</sub><sup>max</sup>(*y<sub>p</sub>*), M<sub>F</sub><sup>max</sup>(*y<sub>p</sub>* - 1) |
| 1 | Down | M<sub>F<sub>R</sub></sub><sup>min</sup>(*y*), M<sub>F<sub>R</sub></sub><sup>min</sup>(*y* + 1), M<sup>max</sup>(*y<sub>p</sub>* - 1) |
| 2 | Down | M<sub>F<sub>R</sub></sub><sup>min</sup>(*y*), M<sub>F</sub><sup>max</sup>(*y<sub>p</sub>*), M<sub>F</sub><sup>max</sup>(*y<sub>p</sub>* - 1) - *i*&#8407; |

Table 2

&nbsp;  

  
A rotation about O is as in Fig 17

![rotation O](/img/snippets/geo17.png)  
Fig 17 Rotation OAB 60<sup>o</sup> about O

This can also be achieved by rotating the diagrams in Fig 15 120<sup>o</sup> counter-clockwise as in Fig 18

![rotation A](/img/snippets/geo18.png)  
Fig 18 Rotation Fig 15 120<sup>o</sup> about O

Hence applying a rotation of 120<sup>o</sup> to the values in Table 2 will produce the correct vertex isometric positions for the overlapping facets of edges OA and OB

A rotation about A is as in Fig 19

![rotation O](/img/snippets/geo19.png)  
Fig 19 Rotation OAB 60<sup>o</sup> about A and translation

This can also be achieved by rotating the diagrams in Fig 15 -120<sup>o</sup> counter-clockwise and translating -m*i*&#8407 - n*j*&#8407 as in Fig 20

![rotation A](/img/snippets/geo20.png)  
Fig 20 Rotation Fig 15 -120<sup>o</sup> about A and translation

Hence applying a rotation of -120<sup>o</sup> about A to the values in Table 2 followed by a translation of -m*i*&#8407 - n*j*&#8407 will produce the correct vertex isometric positions for the overlapping facets of edges OA and AB.

### Facet Isometric Coordinates

For each facet vertex that lies on within the primary triangle we determine the isometric coordinates (x, y). When constructing the primary triangle for GD(m, n) O is (0, 0), A is (m, n) and B is (-n, m + n) these are the white vertices in Fig 21

![facet vertices](/img/snippets/geo21.png)  
Fig 21 Internal Facet Vertices

The red vertices lie on the maximum equilateral triangle CDE, that can be drawn wholly inside OAB along grid lines. The bottom left red vertex lies on the intersection of the y axis and the line through A parallel to the x axis and so has iso-coordinates (0, n). 

![Rotational Symmetry](/img/snippets/geo22.png)  
Fig 22 Rotating (x, y) 0, 120<sup>o</sup>, -120<sup>o</sup>

Therefore by rotational symmetry 

D = R<sup>C+</sup>(0, n) = (m - n, n) and   
E = R<sup>C-</sup>(0, n) = (0, m)

Now consider the green vertices, they all lie on triangles similar to OCA as in Fig 23 and note that OA = n and CA = m

![Green Vertices](/img/snippets/geo23.png)  
Fig 23 Green Vertices

Let F be the point (0, y) with y &lt; n and G the point (x, y). Let H be the point where the extended line through FG meets OA. It follows that x &le; FH. Note that 

![Similar Triangles](/img/snippets/geo24.png)  
Fig 24 Similar Triangles

Triangles OCA and OFH are similar and so

<ins>FH</ins> = <ins>OF</ins>     

CA &nbsp; OC

and so

FH = y * (m / n)  and since x &le; FH  
x &le; y * (m / n);

The green vertices all lie on the iso-grid and so are all points (x, y) with integer values for x and y where

0 &lt; y &lt n and 0 &le; x &le; y * (m / n);
Using rotation symmetry and rotating about the center of OAB 120<sup>o</sup> and -120<sup>o</sup> gives the yellow and blue vertices.

![Along edge](/img/snippets/geo29.png)  
Fig 25 Facet vertices along edges when m and n &ne; 0 have factors in common and n &ne; 0

Any facet vertices lying on an edge of a primary triangle will have the same position as that on a matched edge.

When n = 0, there is no rotation and there are m - 1 shared positions along each edge between the vertices.

When n &ne; 0, let g be the HCF (highest common factor) of m and n. When n = 1 there are no shared positions along each edge between vertices. When n &gt; 1 let m<sub>1</sub> and n<sub>1</sub> be such that m = gm<sub>1</sub> and n = gn<sub>1</sub> then the number of shared positions between the vertices along one edge is g - 1.
 
Along OA they occur at  m<sub>1</sub>*i*&#8407; + n<sub>1</sub>j*&#8407;, 2m<sub>1</sub>*i*&#8407; + 2n<sub>1</sub>j*&#8407;, ......, (g - 1)m<sub>1</sub>*i*&#8407; + (g - 1)n<sub>1</sub>j*&#8407;.

Along AB at R<sup>C+</sup>(m<sub>1</sub>*i*&#8407; + n<sub>1</sub>j*&#8407;), R<sup>C+</sup>(2m<sub>1</sub>*i*&#8407; + 2n<sub>1</sub>j*&#8407);, ......, R<sup>C+</sup>((g - 1)m<sub>1</sub>*i*&#8407; + (g - 1)n<sub>1</sub>j*&#8407;).

Along BO at R<sup>C-</sup>(m<sub>1</sub>*i*&#8407; + n<sub>1</sub>j*&#8407;), R<sup>C-</sup>(2m<sub>1</sub>*i*&#8407; + 2n<sub>1</sub>j*&#8407);, ......, R<sup>C-</sup>((g - 1)m<sub>1</sub>*i*&#8407; + (g - 1)n<sub>1</sub>j*&#8407;).


### Cartesian Coordinates

![Carteian](/img/snippets/geo27.png)  
Fig 26 Cartesian Coordinates

Fig 26 shows that the cartesian coordinates of a point with position iso-vector *xi*&#8407; + *yj*&#8407;  
has cartesian coordinates (*x* + 0.5*y*, 0.5&radic;3y)

### Mapping Primary Triangle to Icosahedron Face

![Primary Map](/img/snippets/geo28.png)  
Fig 27 Primary Triangle Mapping to Icosahedron Face

Let OAB be an equilateral triangle with a Cartesian frame of reference with units vectors *u*&#8407 and *v*&#8407 along the *X* and *Y* axes respectively and *i*&#8407; and *j*&#8407; the usual iso-vectors. O<sub>1</sub>A<sub>1</sub>B<sub>1</sub> and the frame of reference *X<sub>1</sub>Y<sub>1</sub>* are formed by a rotation and scaling of OAB and *XY* in 3D space with *u<sub>1</sub>*&#8407 and *v<sub>1</sub>*&#8407 and *i<sub>1</sub>*&#8407; and *j<sub>1</sub>*&#8407; the corresponding Cartesian and iso Vectors.

Let P be any point with cartesian position vector *xu*&#8407; + *yv*&#8407;.  Let *d* be the scaling of O<sub>1</sub>A<sub>1</sub>B<sub>1</sub> to OAB. The corresponding point P<sub>1</sub> to P with have position vector *xdu&#8407;<sub>1</sub>* + *ydv*&#8407;<sub>1</sub>. 

In iso_vectors OA = m*i*&#8407; + n*j*&#8407; and OB = -n*i*&#8407; + (m + n)*j*&#8407; and so in Cartesian vectors

OA = (m + 0.5n)*u*&#8407; + 0.5&radic;3n*v*&#8407; and 

OB = (0.5(m + n) - n)*u*&#8407; + 0.5&radic;3(m + n)*v*&#8407; = 0.5(m - n)*u*&#8407; + 0.5&radic;3(m + n)*v*&#8407;

(m + 0.5n)OB = (m + 0.5n)(0.5(m - n))*u*&#8407; + 0.5&radic;3(m + n)(m + 0.5n)*uv&#8407;

(0.5(m - n))OA = (m + 0.5)(0.5(m - n))*u*&#8407; + 0.5&radic;3n(0.5(m - n))*v*&#8407;

(m + 0.5n)OB - (0.5(m - n))OA = 0.5&radic;3((m + n)(m + 0.5n) - n(0.5(m - n)))*v*&#8407;

(2m + n)OB - (m - n)OA = &radic;3(m<sup>2</sup> + 0.5n<sup>2</sup> + mn + 0.5mn - 0.5mn + 0.5n<sup>2</sup>)*v*&#8407;

(2m + n)OB - (m - n)OA = &radic;3(m<sup>2</sup> + n<sup>2</sup> + mn)*v*&#8407;

from which we can find *v*&#8407; and then *u*&#8407; in terms of OA and OB. 

Since O<sub>1</sub>A<sub>1</sub> = md*i<sub>1</sub>*&#8407; + nd*j<sub>1</sub>*&#8407; and   
O<sub>1</sub>B<sub>1</sub> = -nd*i<sub>1</sub>*&#8407; + (m + n)d*j<sub>1</sub>*&#8407;

we can use this method to find *v<sub>1</sub>*&#8407; and then *u<sub>1</sub>*&#8407; in terms of O<sub>1</sub>A<sub>1</sub> and O<sub>1</sub>B<sub>1</sub> so that we can determine P<sub>1</sub>. 

For example when finding *v<sub>1</sub>*&#8407; the coefficient of O<sub>1</sub>B<sub>1</sub> will be 

<ins>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d(m + n)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</ins>  
&nbsp;  

d<sup>2</sup>&radic;3(m<sup>2</sup> + n<sup>2</sup> + mn)

=

<ins>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(m + n)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</ins>  
&nbsp;  

d&radic;3(m<sup>2</sup> + n<sup>2</sup> + mn)

We also note that m<sup>2</sup> + n<sup>2</sup> + mn = l<sup>2</sup>, where l is the length of OA. 

Doing the calculations for *v<sub>1</sub>*&#8407; and for *u<sub>1</sub>*&#8407; the coefficients of O<sub>1</sub>A<sub>1</sub> and of  O<sub>1</sub>B<sub>1</sub> all contain the common multiplier 1 / dl<sup>2</sup>.

Since *xu*&#8407; + *yv*&#8407; in OAB maps to  *xdu&#8407;<sub>1</sub>* + *ydv*&#8407;<sub>1</sub> in O<sub>1</sub>A<sub>1</sub>O<sub>1</sub>B<sub>1</sub> and d / dl<sup>2</sup> = 1 / l<sup>2</sup> when it comes to coding we can calculate constant coefficients just once and rather than calculating *u*&#8407; and *v*&#8407; as unit vectors calculate them as vectors scaled by d, for example

*v*&#8407; = ((2m + n)O<sub>1</sub>B<sub>1</sub> - (m - n)O<sub>1</sub>A<sub>1</sub>) / l<sup>2</sup>&radic;3




