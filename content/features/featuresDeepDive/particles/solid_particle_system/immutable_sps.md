---
title: Immutable Solid Particle Systems
image:
description: Learn how to create immutable solid particle systems in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles, immutable
further-reading:
video-overview:
video-content:
---

# Immutable Solid Particle System

An immutable SPS is one whose particle properties do not change. This is one way to optimize your scene when it needs many similar objects that will not change afterward, such as buildings in the distance or asteroids. Placing multiple copies of a model into one mesh means only one draw call per frame. Besides SPS, other methods of forming a single mesh from multiple copies of one mesh include merge meshes, instances, and thin instances.

You can create an immutable SPS in two different ways.

1. Build your SPS as explained earlier in this section, and call _initParticles_ and _setParticles()_ just once, before and outside the render loop, to set your particles where and how you need them. This method is quite simple. However, the SPS mesh is still built as updatable so that particle properties can be initialized, and because of this, particle data is cached while waiting for a hypothetical further change. This is the only way to do it when using billboard mode, and in this case you still need to call _setParticles_ in the render loop even if the particles do not move.
2. Set the SPS to be non-updatable on construction by using a third options parameter: _SolidParticleSystem(name, scene, \{ updatable: false \})_.

It is the second method that we describe here.

To construct an immutable SPS, you use:

```javascript
var SPS = new BABYLON.SolidParticleSystem(name, scene, { updatable: false });
```

As the mesh cannot be updated, you cannot initialize the particles with _initParticles()_, and calling _setParticles()_ has no effect; do not call it, and you will spare some CPU. For now, the _particles_ array is not even populated. In fact, no particle management function called **after** _SPS.buildMesh()_ will have any effect.

How do you set the initial particle properties when the SPS mesh cannot be updated? You pass a custom function to an options object with the property _positionFunction_ when you add a model as a shape, like this:

```javascript
SPS.addShape(model, number_of_particles, { positionFunction: myCustomFunction });
```

Your custom function will be called as many times as the _number_of_particles_ for the added shape. It takes up to three parameters: a particle object; an index, `i`, which is a counter for the total number of shapes added by all calls to _addShape_; and `s`, which is a counter for the number of models added by calling _addShape_.

For example, a custom function has this form:

```javascript
const myBuilder = function (particle, i, s) {
  // set properties of particle
};
```

When you use it on two models:

```javascript
SPS.addShape(model1, 1000, { positionFunction: myBuilder });
SPS.addShape(model2, 500, { positionFunction: myBuilder });
```

While model1 is added, `i` runs from 0 to 999 and `s` runs from 0 to 999.
When model2 is added, `i` runs from 1000 to 1499 and `s` runs from 0 to 499.

The _particle_ object has the following properties that you can set:

| property           | type       | default                                                     |
| ------------------ | ---------- | ----------------------------------------------------------- |
| position           | Vector3    | (0,0,0)                                                     |
| rotation           | Vector3    | (0,0,0)                                                     |
| rotationQuaternion | Quaternion | null, if _rotationQuaternion_ is set, _rotation_ is ignored |
| scaling            | Vector3    | (1,1,1)                                                     |
| pivot              | Vector3    | (0,0,0)                                                     |
| color              | Color4     | null                                                        |
| uvs                | Vector4    | (0,0,1,1)                                                   |

An example that builds an immutable mesh:

```javascript
const myBuilder = (particle, i, s) => {
  // particle is the current particle
  // i is its global index in the SPS
  // s is its index in its shape, so here from 0 to 149
  particle.rotation.y = s / 150;
  particle.position.x = s - 150;
  particle.uvs = new BABYLON.Vector4(0, 0, 0.33, 0.33); // first image from an atlas
  particle.scaling.y = Math.random() + 1;
};
const box = BABYLON.MeshBuilder.CreateBox("b", {}, scene);
const SPS = new BABYLON.SolidParticleSystem("SPS", scene, { updatable: false });
SPS.addShape(box, 150, { positionFunction: myBuilder }); // myBuilder will be called for each of the 150 boxes
const mesh = SPS.buildMesh();
```

Immutable color cube of triangle particles: <Playground id="#2FPT1A#5" title="Immutable Color Cube of Triangle Particles" description="Simple example of immutable color cube of triangle particles."/>
Immutable town with 80,000 buildings: <Playground id="#2FPT1A#36" title="Immutable Town With 80,000 Buildings" description="Simple example of an immutable town with 80,000 buildings"/>

Note that although the particles cannot move, you can still move, scale, or rotate the whole SPS mesh. When there is no need for your SPS mesh to move, scale, or rotate, you can use the standard Babylon.js mesh _freezeXXX()_ methods for further performance gains.

```javascript
SPS.mesh.freezeWorldMatrix(); // prevents from re-computing the World Matrix each frame
SPS.mesh.freezeNormals(); // prevents from re-computing the normals each frame
```

You are not restricted to using _positionFunction_ only with an SPS created with _updatable = true_, although using _initParticles()_ and _setParticles()_ is probably easier and gives you a few more particle properties.

## Solid Particle Vertex Position

In addition to _positionFunction_ for setting a particle's properties, there is also a _vertexFunction_ option to modify the shape of each particle by changing the positions of the vertices of the model that forms the particle. The custom function you assign to the _vertexFunction_ is called once by _SPS.buildMesh()_ for each vertex of a particle.

```javascript
var myVertexFunction = function (particle, vertex, i) {
  // particle : the current particle
  // vertex : the current vertex position within the particle
  // i : index of the vertex in the particle shape
  vertex.x *= Math.random() + 1;
};
SPS.addShape(box, 150, { vertexFunction: myVertexFunction }); // the 150 boxes will have their vertices moved randomly
SPS.buildMesh();
```

Of course, you can use both properties together:

```javascript
SPS.addShape(box, 150, {
  vertexFunction: myVertexFunction,
  positionFunction: myPositionFunction,
});
```

Example with asteroids: <Playground id="#2FPT1A#2" title="Solid Particle Vertex Position Example" description="Simple example of updating solid particle vertex positions"/>

Making your SPS immutable is one way to optimize your scene. Next we will consider ways to optimize when using an updatable SPS.

## Rebuild the mesh

If a mesh changed at creation time with `positionFunction` or `vertexFunction` has then been modified with `setParticles()`, it can be rebuilt by reapplying the internally stored `positionFunction` or `vertexFunction` functions.  
Note that only the functions are stored, not their results. This means that if one of your functions produces different results on each call (using `Math.random()`, for instance), you will not get back the same SPS mesh shape but another computed shape.

```javascript
SPS.rebuildMesh();
```

Except in some very specific cases, you might not need to use this function.
