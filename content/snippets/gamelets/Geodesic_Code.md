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

This is the code needed to produce the vertices of the primary triangle and to arrange them ordered by x for each row.

![facet vertices](/img/snippets/geo21.png)  
Fig 1 Internal Facet Vertices

```javascript
function CreatePrimaryVertices(m, n) {
    this.m = m;
    this.n = n;
    this.vertices = [];

    this.O = new IsoVector(0, 0);
    this.A = new IsoVector(m, n);
    this.B = new IsoVector(-n, m + n);
    this.vertices.push(this.O, this.A, this.B);

    //max internal isoceles triangle vertices
    for (let y = n; y < m + 1; y++) {
        //console.log("Y", y);
        for (let x = 0; x < m + 1 - y; x++ ) {
            this.vertices.push(new IsoVector(x, y));
        }
    }

    //lower rows vertices and their rotations
    const ratio = m / n;
    for (let y = 0; y < n; y++) {
        for (x = 0; x < y * ratio; x++) {
            this.vertices.push(new IsoVector(x, y));
            this.vertices.push(new IsoVector(x, y).rotate120Sides(m , n));
            this.vertices.push(new IsoVector(x, y).rotateNeg120Sides(m , n));
        }
    }

    //order vertices by y and x
    this.vertices.sort((a, b) => {
        return a.x - b.x
    });

    this.vertices.sort((a, b) => {
        return a.y - b.y
    });

}
```

PG: <Playground id="#GLLBLZ#5" title="Primary Triangle Test 1" description="Internal Vertices Created and Ordered"/> 
