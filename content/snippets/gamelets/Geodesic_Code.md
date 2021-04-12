---
title: Geodesic and Goldberg Polyhedra Code Design
image: 
description: The Math used to build Geodesic and Goldberg Polyhedra
keywords: geodesic, goldberg, icosphere, polyhedron, polyhedra, dome
further-reading:
  - title: Geodesic and Goldberg Polyhedra Mathematics
    url: /guidedLearning/workshop/Geodesic_Math
  - title: Icosphere
    url: /divingDeeper/mesh/creation/polyhedra/icosphere
video-overview:
video-content:
---

## Overview

Using the [geodesic mathematics](/guidedLearning/workshop/Geodesic_Math) already described the code needed to produce Geodesic and Goldberg polyhedra is developed and tested.

## Isometric Vectors

We need a class of 2D iso-vectors to add, subtract and rotate.

```javascript
function IsoVector(x, y) { //x, y integers
    this.x = x;
    this.y = y;
};

IsoVector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.x * this.y);
};

IsoVector.prototype.clone = function() {
    return new IsoVector(this.x, this.y);
};

IsoVector.prototype.add = function(other) { //other isovec
    return new IsoVector(this.x + other.x, this.y + other.y);
};

IsoVector.prototype.addInPlace = function(other) { //other isovec
    this.x += other.x;
    this.y += other.y;
    return this;
};

IsoVector.prototype.addToRef = function(other, result) { //other and result isovecs
    result.x = this.x + other.x;
    result.y = this.y + other.y;
    return result;
};

IsoVector.prototype.subtract = function(other) { //other isovec
    return new IsoVector(this.x - other.x, this.y - other.y);
};

IsoVector.prototype.subtractInPlace = function(other) { //other isovec
    this.x -= other.x;
    this.y -= other.y;
    return this;
};

IsoVector.prototype.subtractToRef = function(other, result) { //other and result isovecs
    result.x = this.x - other.x;
    result.y = this.y - other.y;
    return result;
};

IsoVector.prototype.rotate60About = function(other) { //other isovec
    let x = this.x;
    this.x = other.x + other.y - this.y;
    this.y = x + this.y - other.x;
    return this;
}

IsoVector.prototype.rotateNeg60About = function(other) { //other isovec
    let x = this.x;
    this.x = x + this.y - other.y;
    this.y = other.x + other.y - x;
    return this;
};

IsoVector.prototype.rotate120Sides = function(m, n) { //m, n integers
    let x = this.x;
    this.x = m - x - this.y;
    this.y = n + x;
    return this;
}

IsoVector.prototype.rotateNeg120Sides = function(m, n) { //m, n integers
    let x = this.x
    this.x = this.y - n;
    this.y = m + n - x - this.y;
    return this;
};

IsoVector.prototype.toCartesianOrigin = function(origin, size) { // origin Vector3, size real
    const point = BABYLON.Vector3.Zero();
    point.x = origin.x + 2 * this.x * size + this.y * size;
    point.y = origin.y + 3 * thrdR3 * this.y * size;
    return point;
};
```

PG: <Playground id="#GLLBLZ#2" title="IsoVector Test 1" description="Rotations of 60 and -60"/> 

PG: <Playground id="#GLLBLZ#3" title="IsoVector Test 2" description="Rotations of 120 and -120"/> 

## The Primary Triangle

This is the code needed to produce the primary triangle (Fig 1) with Iso and Cartesian vertices ordered by x for each row.

![facet vertices](/img/snippets/geo25.png)  
Fig 1 Internal Facet Vertices

```javascript
function Primary(m, n) {
    this.m = m;
    this.n = n;

    this.cartesian = [];
    this.vertices = [];
    this.max = [];
    this.min = [];

};   

function CreatePrimary(m, n) {
    const vertices = [];

    O = new IsoVector(0, 0);
    A = new IsoVector(m, n);
    B = new IsoVector(-n, m + n);
    vertices.push(O, A, B);

    //max internal isoceles triangle vertices
    for (let y = n; y < m + 1; y++) {
        //console.log("Y", y);
        for (let x = 0; x < m + 1 - y; x++ ) {
            vertices.push(new IsoVector(x, y));
        }
    }

    //lower rows vertices and their rotations
    const ratio = m / n;
    for (let y = 0; y < n; y++) {
        for (let x = 0; x <= y * ratio; x++) {
            vertices.push(new IsoVector(x, y));
            vertices.push(new IsoVector(x, y).rotate120Sides(m , n));
            vertices.push(new IsoVector(x, y).rotateNeg120Sides(m , n));
        }
    }

    //order vertices by y and x
    vertices.sort((a, b) => {
        return a.x - b.x
    });

    vertices.sort((a, b) => {
        return a.y - b.y
    });

    const min = new Array(m + n + 1);
    const max = new Array(m + n + 1);
    min.fill(Infinity);
    max.fill(-Infinity);

    let y = 0;
    let x = 0;

    let len = vertices.length;
    
    for (i = 0; i < len; i++) {
        x = vertices[i].x;
        y = vertices[i].y
        min[y] = Math.min(x, min[y]);
        max[y] = Math.max(x, max[y]);
    };

    const cartesian = [];
    for (let i = 0; i < vertices.length; i++) {
        cartesian[i] = vertices[i].toCartesianOrigin(new IsoVector(0, 0))
    };

    const P = new Primary(m, n);

    P.vertices = vertices;
    P.cartesian = cartesian;
    P.min = min;
    P.max = max;

    return P;
}
```

PG: <Playground id="#GLLBLZ#12" title="Primary Triangle Test 1" description="Primary Triangle Created"/> 

## Creating the Icosahedron Base

We have based the facet triangles on the net of Fig 2 now with added vertex labels.

![facet vertices labelled](/img/snippets/geo26.png)  
Fig 2 Icosahedron Net with Vertex Labels.

Where each side is of length 2, and with origin at the center of the icosahedron Table 1 gives the (x, y, z) position of each of the twelve vertices where &phi; = (1 + &Sqrt;5) / 2

| Vertex Index | Position| | Vertex Index | Position| | Vertex Index | Position|
|----|----|----|----|----|----|----|----|----|
| 0 | (0, &phi;, -1) | | 4 |  (&phi;, 1, 0) | | 8 |  (0, -&phi;, -1) |
| 1 |  (-&phi;, 1, 0) | | 5 |  (0, &phi;, 1) | | 9 |  (&phi;, -1, 0) |
| 2 |  (-1, 0, -&phi;) | | 6 |  (-1, 0, &phi;) | | 10 |  (1, 0, &phi;) |
| 3 |  (1, 0, -&phi;) | | 7 |  (-&phi;, -1, 0) | | 11 |  (0, -&phi;, 1) |
&nbsp; 
Table 1 

PG: <Playground id="#GLLBLZ#7" title="Icosahedron Test 1" description="Draw Icosahedron"/> 

## Mapping the Primary Triangle onto Icosahedron Faces

After forming the primary triangle for GD(m, n) we need to map the facet vertices formed onto each face of the icosahedron. We use the mathematics from the this section in the Geodesic math page.

```
/******Primary Triangle*********/
function Primary(m, n) {
    this.m = m;
    this.n = n;

    this.cartesian = [];
    this.vertices = [];
    this.mapped = [];
    this.max = [];
    this.min = [];

    this.coau = 0;
    this.cobu = 0;
    this.coav = 0;
    this.cobv = 0;

    this.u = BABYLON.Vector3.Zero();
    this.v = BABYLON.Vector3.Zero();

};

Primary.prototype.CalcCoeffs = function() {
    const m = this.m;
    const n = this.n;

    const LSQD = m * m + n * n + m * n;

    this.coau = (m + n) / LSQD;
    this.cobu = -n / LSQD;
    this.coav = -THRDR3 * (m - n) / LSQD;
    this.cobv = THRDR3 * (2* m + n) / LSQD;
}

Primary.prototype.MapToFace = function (faceNb) {
    const F = IDATA.face[faceNb];
    const Oidx = F[2];
    const Aidx = F[1];
    const Bidx = F[0];

    const O = BABYLON.Vector3.FromArray(IDATA.vertex[Oidx]);
    const A = BABYLON.Vector3.FromArray(IDATA.vertex[Aidx]);
    const B = BABYLON.Vector3.FromArray(IDATA.vertex[Bidx]);

    const OA = A.subtract(O);
    const OB = B.subtract(O);

    this.u = OA.scale(this.coau).add(OB.scale(this.cobu));
    this.v = OA.scale(this.coav).add(OB.scale(this.cobv));
    
    const mapped = [];
    let tempVec = BABYLON.Vector3.Zero();
    for (var i = 0; i < this.cartesian.length; i++) {
        tempVec = this.u.scale(this.cartesian[i].x).add(this.v.scale(this.cartesian[i].y)).add(O);
        mapped[i] = [tempVec.x, tempVec.y, tempVec.z];
    }

    this.mapped.push(mapped);
    this.face = faceNb;
}
```

PG: <Playground id="#GLLBLZ#13" title="Icosahedron Test 2" description="Map GD(m, n) Vertices"/> 

### Forming the Facet Triangles for the Geodesic Mesh GD(m, n)

The intention is to create a GDmnDATA object with the form

```javascript
const GDmnDATA = { 
    "name":"Geodesic_m_n", 
    "category":["Geodesic"], 
    "vertex": //Array of each facet vertex positions in form [x, y, z],
    "face":[ //Array of vertex indices in form [B, A, O)]
};
```
So far when mapping the primary triangle to each icosahedron face some vertex positions are repeated. These are those of the original icosahedron vertices and any that lie along the edges of the icosahedron. We need to ensure there are no repeats in  GDmnDATA.vertex.

