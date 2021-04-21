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

From this and Fig 2 we can build the IDATA to construct the icosahedron.

```javascript
const IDATA = { 
    "name":"icosahedron", 
    "category":["Regular"], 
    "vertex":[ [0, PHI, -1], [-PHI, 1, 0], [-1, 0, -PHI], [1, 0, -PHI], [PHI, 1, 0], [0, PHI, 1], [-1, 0, PHI], [-PHI, -1, 0], [0, -PHI, -1], [PHI, -1, 0], [1, 0, PHI], [0, -PHI, 1]],
    "face":[
        [ 0, 2, 1 ], [ 0, 3, 2 ], [ 0, 4, 3 ], [ 0, 5, 4 ], [ 0, 1, 5 ],
        [ 7, 6, 1 ],[ 8, 7, 2 ], [ 9, 8, 3 ], [ 10, 9, 4 ], [ 6, 10, 5 ],
        [ 2, 7, 1 ], [ 3, 8, 2 ],[ 4, 9, 3 ], [ 5, 10, 4 ], [ 1, 6, 5 ],
        [ 11, 6, 7 ], [ 11, 7, 8 ], [ 11, 8, 9 ], [ 11, 9, 10 ], [ 11, 10, 6 ]
    ]
};
```

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
    "face":[ //Array of vertex indices in form [index0, index1, index2]
};
```
So far when mapping the primary triangle to each icosahedron face some vertex positions are repeated. These the original icosahedron vertices plus any that lie along the edges of the icosahedron. We need to ensure there are no repeats in  GDmnDATA.vertex. For the original icosahedron vertices we add the positions from its IDATA.

We need to know using Fig 2 above and Table 1 for the Geodesic Math page which icosahedron faces are adjacent and which rotations between faces give the shared GD(m, n) facet vertices. We therefore add to the IDATA and GDmnDATA objects.

```javascript
const IDATA = { 
    "name":"icosahedron", 
    "category":["Regular"], 
    "edgematch": [ [1, "B"], [2, "B"], [3, "B"], [4, "B"], [0, "B"], [10, "O", 14, "A"], [11, "O", 10, "A"], [12, "O", 11, "A"], [13, "O", 12, "A"], [14, "O", 13, "A"], [0, "O"], [1, "O"], [2, "O"], [3, "O"], [4, "O"], [19, "B", 5, "A"], [15, "B", 6, "A"], [16, "B", 7, "A"], [17, "B", 8, "A"], [18, "B", 9, "A"] ],
    "vertex":[ [0, PHI, -1], [-PHI, 1, 0], [-1, 0, -PHI], [1, 0, -PHI], [PHI, 1, 0], [0, PHI, 1], [-1, 0, PHI], [-PHI, -1, 0], [0, -PHI, -1], [PHI, -1, 0], [1, 0, PHI], [0, -PHI, 1]],
    "face":[
        [ 0, 2, 1 ], [ 0, 3, 2 ], [ 0, 4, 3 ], [ 0, 5, 4 ], [ 0, 1, 5 ],
        [ 7, 6, 1 ],[ 8, 7, 2 ], [ 9, 8, 3 ], [ 10, 9, 4 ], [ 6, 10, 5 ],
        [ 2, 7, 1 ], [ 3, 8, 2 ],[ 4, 9, 3 ], [ 5, 10, 4 ], [ 1, 6, 5 ],
        [ 11, 6, 7 ], [ 11, 7, 8 ], [ 11, 8, 9 ], [ 11, 9, 10 ], [ 11, 10, 6 ]
    ]
};
```

```javascript
const GDmnDATA = { 
    "name":"Geodesic_m_n", 
    "category":["Geodesic"],
    "vertex": [ [0, PHI, -1], [-PHI, 1, 0], [-1, 0, -PHI], [1, 0, -PHI], [PHI, 1, 0], [0, PHI, 1], [-1, 0, PHI], [-PHI, -1, 0], [0, -PHI, -1], [PHI, -1, 0], [1, 0, PHI], [0, -PHI, 1] ..........],
    "face":[ //Array of vertex indices in form [index0, index1, index2]
};
```
For the primary triangle OAB we know

O is at the iso grid origin  
A is at m*i*&#8407; + nj*&#8407;
B is at -n*i*&#8407; + (m + n)j*&#8407;

Where O<sub>O</sub>A<sub>O</sub>B<sub>O</sub>, O<sub>A</sub>A<sub>A</sub>B<sub>A</sub>, O<sub>B</sub>A<sub>B</sub>B<sub>B</sub> are the triangle formed when rotating OAB about O, A and B respectively then shared positions along shared edges are

O<sub>O</sub> = O, B<sub>O</sub> = A  
A<sub>A</sub> = A, O<sub>A</sub> = B  
B<sub>B</sub> = B, O<sub>B</sub> = A

For each face we need to map the iso-vector for each facet point in the primary triangle to a unique index. The following is part of the function that does this. It shows the mapping for the rotation about B only.

```javascript
Primary.prototype.SetIndices = function() {
    let indexCount = 12; // 12 verticess already assigned
    const vecToIdx = {}; //maps iso-vectors to indexCount;
    const m = this.m;
    const n = this.n;
    let g = m; // hcf of m, n when n = 0
    let m1 = m;
    let n1 = 0;
    if (n !== 0) {
        g = HCF(m, n);
        m1 = m / g;
        n1 = n / g;
    };

    let fr = 0; //face to the right of current face
    let O = 0;
    let A = 0;
    let B = 0;
    let OR = 0;
    let AR = 0;
    let BR = 0;
    const Ovec = new IsoVector(0, 0);
    const Avec = new IsoVector(m, n);
    const Bvec = new IsoVector(-n, m + n);
    let ORvec = new IsoVector(0, 0);
    let ARvec = new IsoVector(0, 0);
    let BRvec = new IsoVector(0, 0);
    let temp = 0;
    let tempR = 0;
    let verts = [];
    let idx = "";
    let idxR = "";


    /***edges AB to OB***** rotation about B*/
    for (let f = 0; f < 10; f++) { //f current face
        let face = f;
        if (f > 4) {
            face += 10;
        }
        verts = IDATA.face[face];
        O = verts[2];
        A = verts[1];
        B = verts[0];
        fr = IDATA.edgematch[face][0];
        verts = IDATA.face[fr];
        OR = verts[2];
        AR = verts[1];
        BR = verts[0];
        BRvec = Bvec;
        ORvec.x = Avec.x;
        ORvec.y = Avec.y;
        idx = face +"|"+ Avec.x + "|" + Avec.y;
        vecToIdx[idx] = A;
        idx = face +"|"+ Bvec.x + "|" + Bvec.y;
        vecToIdx[idx] = B;
        idx = fr +"|"+ ORvec.x + "|" + ORvec.y;
        vecToIdx[idx] = OR;
        idx = fr +"|"+ BRvec.x + "|" + BRvec.y;
        vecToIdx[idx] = BR;
        for (let i = 1; i < g; i++) {
            temp = n + i * m1;
            idx = face + "|" + this.max[temp] + "|" + temp;
            tempR = i * (m1 + n1);
            idxR = fr + "|" + this.min[tempR] + "|" + tempR;
            if (!(idx in vecToIdx || idxR in vecToIdx )) {
                vecToIdx[idx] = indexCount;
                vecToIdx[idxR] = indexCount;
                indexCount++
            }
            else if (idx in vecToIdx) {
                vecToIdx[idxR] = vecToIdx[idx];
            }
            else {
                vecToIdx[idx] = vecToIdx[idxR];
            }
        }
    };

    /***edges OB to OA***** rotation about O* goes here/

    /***edges AO to AB***** rotation about A goes here*/

    for (let f = 0; f < 20; f++) {
        for (let i = 0; i < this.vertices.length; i++) {
            idx = f + "|" + this.vertices[i].x + "|" + this.vertices[i].y;            if (!(idx in vecToIdx)) {
                vecToIdx[idx] = indexCount++;
            }
        } 
    };
    this.vecToIdx = vecToIdx;
}
```

The following playground both generates grey spheres for all the facet vertex positions with repeats as in *_Icosahedron_* Test 2 above and red spheres showing all the facet vector positions uniquely.

PG: <Playground id="#GLLBLZ#17" title="Icosahedron Test 3" description="Map GD(m, n) Unique Vertices"/> 

Now having the unique vertices we need to join them up correctly into the facet triangles to form the GDmn mesh.