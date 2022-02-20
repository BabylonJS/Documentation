---
title: Geodesic and Goldberg Polyhedra Code Design
image: 
description: The Math used to build Geodesic and Goldberg Polyhedra
keywords: geodesic, goldberg, icosphere, polyhedron, polyhedra, dome
further-reading:
  - title: Geodesic and Goldberg Polyhedra Mathematics
    url: /features/guidedLearning/workshop/Geodesic_Math
  - title: Icosphere
    url: /features/divingDeeper/mesh/creation/polyhedra/icosphere
video-overview:
video-content:
---

## Overview

Using the [geodesic mathematics](/features/guidedLearning/workshop/Geodesic_Math) already described the code needed to produce Geodesic and Goldberg polyhedra is developed and tested.

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
    for (let y = n; y < m + 1 ; y++) {
        for (let x = 0; x < m + 1 - y; x++ ) {
            vertices.push(new IsoVector(x, y));
        }
    }

    //shared vertices along edges when needed
    if (n > 0) {
        let g = m; // hcf of m, n when n != 0
        let m1 = 1;
        let n1 = 0;
        if (n !== 0) {
            g = HCF(m, n);
        };
        m1 = m / g;
        n1 = n / g; 

        for (let i = 1; i < g; i++) {
            vertices.push(new IsoVector(i * m1, i * n1)); //OA
            vertices.push(new IsoVector(-i * n1, i * (m1 + n1)));  //OB
            vertices.push(new IsoVector(m - i * (m1 + n1), n + i * m1)); // AB
        }; 

        //lower rows vertices and their rotations
        const ratio = m / n;
        for (let y = 1; y < n; y++) {
            for (let x = 0; x < y * ratio; x++) {
                vertices.push(new IsoVector(x, y));
                vertices.push(new IsoVector(x, y).rotate120Sides(m , n));
                vertices.push(new IsoVector(x, y).rotateNeg120Sides(m , n));
            }
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

For each face we need to map the iso-vector for each facet point in the primary triangle to a unique index. The following is the function that does this.

```javascript
Primary.prototype.SetIndices = function() {
    let indexCount = 12; // 12 vertices already assigned
    const vecToIdx = {}; //maps iso-vectors to indexCount;
    const m = this.m;
    const n = this.n;
    let g = m; // hcf of m, n when n != 0
    let m1 = 1;
    let n1 = 0;
    if (n !== 0) {
        g = HCF(m, n);
    };
    m1 = m / g;
    n1 = n / g;

    let fr = 0; //face to the right of current face
    let rot = ""; //rotation about which vertes for fr
    let O = 0;
    let A = 0;
    let B = 0;
    let OR = 0;
    let AR = 0;
    let BR = 0;
    const Ovec = new IsoVector(0, 0);
    const Avec = new IsoVector(m, n);
    const Bvec = new IsoVector(-n, m + n);
    let OAvec = new IsoVector(0, 0);
    let ABvec = new IsoVector(0, 0);
    let OBvec = new IsoVector(0, 0);
    let temp = 0;
    let tempR = 0;
    let verts = [];
    let idx = "";
    let idxR = "";


    /***edges AB to OB***** rotation about B*/
    for (let f = 0; f < 20; f++) { //f current face

        verts = IDATA.face[f];
        O = verts[2];
        A = verts[1];
        B = verts[0];

        idx = f +"|"+ Ovec.x + "|" + Ovec.y;
        if (!(idx in vecToIdx)) {
            vecToIdx[idx] = O;
        }
        
        idx = f +"|"+ Avec.x + "|" + Avec.y;
        if (!(idx in vecToIdx)) {
            vecToIdx[idx] = A;
        }
        idx = f +"|"+ Bvec.x + "|" + Bvec.y;
        if (!(idx in vecToIdx)) {
            vecToIdx[idx] = B;
        }
        fr = IDATA.edgematch[f][0];
        rot = IDATA.edgematch[f][1];
        if (rot === "B") {
                for (let i = 1; i < g; i++) {
                    ABvec.x = m - i * (m1 + n1);
                    ABvec.y = n + i * m1;
                    OBvec.x = -i * n1;
                    OBvec.y = i * (m1 + n1);
                    idx = f +"|"+ ABvec.x + "|" + ABvec.y;
                    idxR = fr +"|"+ OBvec.x + "|" + OBvec.y;
                    matchIdx(idx, idxR, "B");
                }
        };

       if (rot === "O") {
                for (let i = 1; i < g; i++) {
                    OBvec.x = -i * n1;
                    OBvec.y = i * (m1 + n1);
                    OAvec.x = i * m1;
                    OAvec.y = i * n1;
                    idx = f +"|"+ OBvec.x + "|" + OBvec.y;
                    idxR = fr +"|"+ OAvec.x + "|" + OAvec.y;
                    matchIdx(idx, idxR, "O");
                }
        };

        fr = IDATA.edgematch[f][2];
        rot = IDATA.edgematch[f][3];       
      if (rot && rot === "A") {
                for (let i = 1; i < g; i++) {
                    OAvec.x = i * m1;
                    OAvec.y = i * n1;
                    ABvec.x = m - (g - i) * (m1 + n1);;  //reversed for BA
                    ABvec.y = n + (g - i) * m1; //reversed for BA
                    idx = f +"|"+ OAvec.x + "|" + OAvec.y;
                    idxR = fr +"|"+ ABvec.x + "|" + ABvec.y;
                    matchIdx(idx, idxR, "A");
                }
        };

        for (let i = 0; i < this.vertices.length; i++) {
            idx = f + "|" + this.vertices[i].x + "|" + this.vertices[i].y;
            if (!(idx in vecToIdx)) {
                vecToIdx[idx] = indexCount++;
            }
        } 
    };

    function matchIdx(idx, idxR, v) {
        if (!(idx in vecToIdx || idxR in vecToIdx )) {
            vecToIdx[idx] = indexCount;
            vecToIdx[idxR] = indexCount;
            indexCount++;
        }
        else if ((idx in vecToIdx) && !(idxR in vecToIdx)) {
            vecToIdx[idxR] = vecToIdx[idx];
        }
        else if ((idxR in vecToIdx) && !(idx in vecToIdx)) {
            vecToIdx[idx] = vecToIdx[idxR];
        }
    };
    
    this.vecToIdx = vecToIdx;
}
```

The following playground both generates grey spheres, which have repeats, for all the facet vertex positions with repeats as in *_Icosahedron_* Test 2 above and red spheres showing all the facet vector positions uniquely.

PG: <Playground id="#GLLBLZ#30" title="Icosahedron Test 3" description="Map GD(m, n) Unique Vertices"/> 

Now having the unique vertices we need to join them up correctly into the facet triangles to form the GDmn mesh.

The first step is to generate the facet triple vertex indices for all the facets that lie wholly inside the primary triangle. This is relatively straight forward.

```javascript
Primary.prototype.InnerFacets = function() {
    const m = this.m;
    const n = this.n;
    for (let y = 0; y < n + m + 1; y++) {
        for (x = this.min[y]; x < this.max[y] + 1; x++) {
            if (x < this.max[y] && x < this.max[y + 1] + 1) {
                this.innerFacets.push(["|" + x + "|" + y, "|" + x + "|" + (y + 1), "|" + (x + 1) + "|" + y]);
            }
            if ( y > 0 && x < this.max[y - 1] && x + 1 < this.max[y] + 1) {
                this.innerFacets.push(["|" + x + "|" + y, "|" + (x + 1) + "|" + y, "|" + (x + 1) + "|" + (y - 1)]);
            }
        }    
    }
}

Primary.prototype.InnerToGDmnData = function(face) {
    for (i = 0; i < this.innerFacets.length; i++) {
        GDmnDATA.face.push(this.innerFacets[i].map((el) => this.vecToIdx[face + el]));
    }
}
```

Next we deal with overlapping facets between edges AB and OB where the primary triangle is rotated right about B

```javascript
Primary.prototype.EdgeVecsABOB = function() {
    let m = this.m;
    let n = this.n;

    const B = new IsoVector(-n, m + n)

    for (let y = 1; y < m + n; y++) {
        const point = new IsoVector(this.min[y], y);
        const prev = new IsoVector(this.min[y - 1], y - 1);
        const next = new IsoVector(this.min[y + 1], y + 1);
        const pointR = point.clone();
        const prevR = prev.clone();
        const nextR = next.clone();
        
        pointR.rotate60About(B);
        prevR.rotate60About(B);
        nextR.rotate60About(B);

        const maxPoint = new IsoVector(this.max[pointR.y], pointR.y);
        const maxPrev = new IsoVector(this.max[pointR.y - 1], pointR.y - 1);
        const maxLeftPrev = new IsoVector( this.max[pointR.y - 1] - 1, pointR.y - 1);

        if ((pointR.x !== maxPoint.x) || (pointR.y !== maxPoint.y)) {
            if (pointR.x !== maxPrev.x) { // type2
                //up
                this.vertexTypes.push([1, 0, 0]);
                this.isoVecsABOB.push([point, maxPrev, maxLeftPrev]);
                //down
                this.vertexTypes.push([1, 0, 0]);
                this.isoVecsABOB.push([point, maxLeftPrev, maxPoint]);
            }
            else if (pointR.y === nextR.y) { // type1
                //up
                this.vertexTypes.push([1, 1, 0]);
                this.isoVecsABOB.push([point, prev, maxPrev]);
                //down
                this.vertexTypes.push([1, 0, 1]);
                this.isoVecsABOB.push([point, maxPrev, next]);
            }
            else { // type 0
                //up
                this.vertexTypes.push([1, 1, 0]);
                this.isoVecsABOB.push([point, prev, maxPrev])
                //down
                this.vertexTypes.push([1, 0, 0]);
                this.isoVecsABOB.push([point, maxPrev, maxPoint]);
            }
        };
    };
};

Primary.prototype.ABOBtoGDmnDATA = function (faceNb) {
    const fr = IDATA.edgematch[faceNb][0];
    for (let i = 0; i < this.isoVecsABOB.length; i++) {
        const temp = [];
        for (let j = 0; j < 3; j++) {
            if (this.vertexTypes[i][j] === 0) {
                temp.push(faceNb + "|" + this.isoVecsABOB[i][j].x + "|" + this.isoVecsABOB[i][j].y);
            }
            else {
                temp.push(fr + "|" + this.isoVecsABOB[i][j].x + "|" + this.isoVecsABOB[i][j].y);
            }
        }
        GDmnDATA.face.push([this.vecToIdx[temp[0]], this.vecToIdx[temp[1]], this.vecToIdx[temp[2]]]);
    }
};
```

We store the iso-vector data for the facets to obtain the other overlap facet data using rotation.

Overlapping facets between edges OB and OA where the primary triangle is rotated right about O

```javascript
Primary.prototype.ABOBtoOBOA = function() {
    let point = new IsoVector(0, 0);
    for (let i = 0; i < this.isoVecsABOB.length; i++) {
        const temp = [];
        for (let j = 0; j < 3; j++) {
            point.x = this.isoVecsABOB[i][j].x;
            point.y = this.isoVecsABOB[i][j].y;
            if (this.vertexTypes[i][j] === 0) {
                point.rotateNeg120Sides(this.m, this.n);
            }
            temp.push(point.clone());
        }
        this.isoVecsOBOA.push(temp);
    }
};

Primary.prototype.OBOAtoGDmnDATA = function (faceNb) {
    const fr = IDATA.edgematch[faceNb][0];
    for (let i = 0; i < this.isoVecsOBOA.length; i++) {
        const temp = [];
        for (let j = 0; j < 3; j++) {
            if (this.vertexTypes[i][j] === 1) {
                temp.push(faceNb + "|" + this.isoVecsOBOA[i][j].x + "|" + this.isoVecsOBOA[i][j].y);
            }
            else {
                temp.push(fr + "|" + this.isoVecsOBOA[i][j].x + "|" + this.isoVecsOBOA[i][j].y);
            }
        }
        GDmnDATA.face.push([this.vecToIdx[temp[0]], this.vecToIdx[temp[1]], this.vecToIdx[temp[2]]]);
    }
};
```

Finally Overlapping facets between edges BA and OA where the primary triangle is rotated right about A

```javascript
Primary.prototype.ABOBtoBAOA = function() {
    let point = new IsoVector(0, 0);
    for (let i = 0; i < this.isoVecsABOB.length; i++) {
        const temp = [];
        for (let j = 0; j < 3; j++) {
            point.x = this.isoVecsABOB[i][j].x;
            point.y = this.isoVecsABOB[i][j].y;
            if (this.vertexTypes[i][j] === 1) {
                point.rotate120Sides(this.m, this.n);
            }
            temp.push(point.clone());
        }
        this.isoVecsBAOA.push(temp);
    }
    
};

Primary.prototype.BAOAtoGDmnDATA = function (faceNb) {
    const fr = IDATA.edgematch[faceNb][2];
    for (let i = 0; i < this.isoVecsBAOA.length; i++) {
        const temp = [];
        for (let j = 0; j < 3; j++) {
            if (this.vertexTypes[i][j] === 1) {
                temp.push(faceNb + "|" + this.isoVecsBAOA[i][j].x + "|" + this.isoVecsBAOA[i][j].y);
            }
            else {
                temp.push(fr + "|" + this.isoVecsBAOA[i][j].x + "|" + this.isoVecsBAOA[i][j].y);
            }
        }
        GDmnDATA.face.push([this.vecToIdx[temp[0]], this.vecToIdx[temp[1]], this.vecToIdx[temp[2]]]);
    }
};
```

These methods are called for each appropriate face

```javascript
PT = CreatePrimary(m, n);
   PT.SetIndices();
   PT.CalcCoeffs();
   PT.InnerFacets();
   PT.EdgeVecsABOB();
   PT.ABOBtoOBOA();
   PT.ABOBtoBAOA();
   for (f = 0; f < IDATA.face.length; f++) {
       PT.MapToFace(f);
       PT.InnerToGDmnData(f);
       if(IDATA.edgematch[f][1] === "B") {
            PT.ABOBtoGDmnDATA(f);
       };
       if(IDATA.edgematch[f][1] === "O") {
            PT.OBOAtoGDmnDATA(f);
       };
       if(IDATA.edgematch[f][3] === "A") {
            PT.BAOAtoGDmnDATA(f);
       };
   };
```

PG: <Playground id="#GLLBLZ#31" title="Icosahedron Test 4" description="GD(m, n) Mesh Mapped to Icosahedron"/>   
PG: <Playground id="#GLLBLZ#32" title="Icosahedron Test 5" description="GD(m, n) Mesh Mapped to Sphere"/> 

## Forming the Goldberg Polyhedron from the Geodesic Polyhedron.

Since each is the dual of the other we need to form the data for the Goldberg polyhedra from the Geodesic data.

```javascript
//Puts vertices of a face for GP in correct order for mesh construction
 const setOrder = (m, faces, data) => {
     const dualFaces = [];
     let face = faces.pop();
     dualFaces.push(face);
     let index = data.face[face].indexOf(m);
     index = (index + 2) % 3; //index to vertex included in adjacent face
     let v = data.face[face][index];
     let f = 0;
     let vIndex = 0;
     while (faces.length > 0) {
         face = faces[f]
         if (data.face[face].indexOf(v) > -1) { // v is a vertex of face f
             index = (data.face[face].indexOf(v) + 1) % 3;
             v = data.face[face][index];
             dualFaces.push(face);
             faces.splice(f, 1);
             f = 0;
         }
         else {
             f++
         }
     }
     return dualFaces; 
 }

 //convert geodesic to Goldberg by forming the dual
 const GDtoGP = function(GDdata) {
     const GPdata = {};
     GPdata.name = "GD dual";
     GPdata.category = ["Goldberg"];
     GPdata.vertex = [];
     GPdata.face = [];
     verticesNb = GDdata.vertex.length;
     const map = new Array(verticesNb);
     for (let v = 0; v < verticesNb; v++) {
         map[v] = new Set();
     }
     for (let f = 0; f < GDdata.face.length; f++) {
         for (let i = 0; i < 3; i++) {
             map[GDdata.face[f][i]].add(f);
         }
     }
     let cx = 0;
     let cy = 0;
     let cz = 0;
     let face = [];
     let vertex = [];
     for(let m = 0; m < map.length; m++) {
         GPdata.face[m] = setOrder(m, Array.from(map[m]), GDdata);
         map[m].forEach((el) => {
             cx = 0;
             cy = 0;
             cz = 0;
             face = GDdata.face[el];
             for(let i = 0; i < 3; i++) {
                 vertex = GDdata.vertex[face[i]];
                 cx += vertex[0];
                 cy += vertex[1];
                 cz += vertex[2];
             }
             GPdata.vertex[el] = [cx / 3, cy / 3, cz / 3];  
         });
     }
     return GPdata;
 };
```

This gives us a final test before creating a more user friendly example.

PG: <Playground id="#GLLBLZ#27" title="Goldberg Test 1" description="Goldberg(m, n) Mesh Mapped to Sphere"/> 

For different m and n change their values on lines 53 and 54, **note** m must be greater than n. 