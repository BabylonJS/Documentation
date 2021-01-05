---
title: Solid Particles From Mesh Facets
image: 
description: Learn how to create solid particles from mesh facets in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles, facets
further-reading:
video-overview:
video-content:
---

## Digest a Mesh

There is another way than adding shapes of meshes used as models to populate the SPS : you can directly "digest" a mesh.  
To digest a mesh means that the SPS will decompose this mesh geometry and use all its facets to generate the particles. So, by default, a digested mesh generates as many particles as the mesh number of facets.

```javascript
var model = BABYLON.MeshBuilder.CreateTorusKnot(
  "s",
  { radius: 20, tube: 6, tubularSegments: 64, radialSegments: 128 },
  scene
);
SPS.digest(model);
model.dispose();
SPS.buildMesh();
```

Note that in this case, all the generated particles have their property "position" set with some values and no more to (0, 0, 0).  
This method is obviously compatible with `addShape()` and you can even call it several times with the same model, or different models, in the same SPS.

```javascript
var model = BABYLON.MeshBuilder.CreateTorusKnot(
  "s",
  { radius: 20, tube: 6, tubularSegments: 64, radialSegments: 128 },
  scene
);
SPS.addShape(boxModel, 50);
SPS.digest(model);
SPS.addShape(sphereModel, 20);
SPS.digest(model, { number: 10 });
model.dispose();
sphereModel.dispose();
boxModel.dispose();
SPS.buildMesh();
```

This method accepts three optional parameters : `facetNb`, `delta` and `number`

- `facetNb` is the number of the mesh facets required to build each particle. By default, the value is set to 1, this means each particle will just be a triangle (a mesh facet). Set to 2 and you'll probably get quads instead.  
  The number of generated particles depends then on the mesh initial number of facets and on the `faceNb` value.  
  This parameter is overriden if the parameter `number` is set.
- `delta` (default 0), used with `facetNb`, allows to generate each particle with a random size between _facetNb_ and _facetNb + delta_ facets.
- `number` is the wanted number of particles. `digest()` divides then the mesh into `number` particles of the same size in term of the number of facets used per particle.  
  If `number` is greater than the total number of mesh facets, then this total number is used for the value of `number`.

```javascript
var model = BABYLON.MeshBuilder.CreateTorusKnot(
  "s",
  { radius: 20, tube: 6, tubularSegments: 64, radialSegments: 128 },
  scene
);
SPS.digest(model, { facetNb: 10 }); // 10 facets per particle whatever their final number
SPS.digest(model, { number: 200 }); // 200 particles whatever their final size
SPS.digest(model, { facetNb: 10, delta: 30 }); // between 10 and 40 facets per particle, randomly, whatever their final number
model.dispose();
SPS.buildMesh();
```

Example (click on the torus knot): <Playground id="#HDHQN" title="Solid Particle From Mesh Facets Example" description="Simple example of solid particles from mesh facets (click on the torus knot)"/>