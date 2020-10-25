# Immutable Solid Particle System
An immutable SPS is one where particle properties will not change. This is one way to optimize your scene when it needs many similar objects that won't change afterwards, such as buildings in the distance or asteroids. Placing multiple copies of a model into one mesh means only one draw call for each frame rendering. Besides SPS there are other methods of forming a single mesh from multiple copies of one mesh; these are merge meshes, instances and thin instances.

You can create an immutable SPS in two different ways.

1. Build your SPS as explained earlier in this section and call  *initParticles* and *setParticles()* just once, before and outside the render loop, to set your particles where and how you need. This method is quite simple However the SPS mesh is still built as updatable so that particle properties can be initiated and because of this particle data is cached, waiting for a hypothetical further change. This is the only way to do it when using billboard mode and in this case you still need to call *setParticles* in the render loop also even if the particles don't move.
2. Set the SPS to updatable on construction using a third options parameter *SolidParticleSystem(name, scene, { updatable: false })* 

It is the second method that we describe here.

To construct an immutable SPS you use
```javascript
var SPS = new BABYLON.SolidParticleSystem(name, scene, { updatable: false });
```

As the mesh can't be updated you cannot initiate the particles with *initParticles()* and calling *setParticles()* has no effect; don't call it, you'll spare some CPU. For now the *particles* array is not even populated!  In fact no particle management function called **after** *SPS.buildMesh()* will have any effect.  

How do you set the initial particle properties when the SPS mesh can't be updated? You pass a custom function to an options object with the property *positionFunction* when you add a model as a shape like this

```javascript
SPS.addShape(model, number_of_particles, { positionFunction: myCustomFunction });
```

Your custom function will be called as many times as the *number_of_particles* for the added shape. It needs up to three parameters;  a particle object, an index, i, which is a counter to the total number of shapes that have been added by all calls to *addShape* and, s, which is a counter to the number of models added by calling *addShape*.

For example, a custom function has this form

```javascript
const myBuilder = function(particle, i, s) {
  // set properties of particle
};
```

When using it on two models

```javascript
SPS.addShape(model1, 1000, { positionFunction: myBuilder });
SPS.addShape(model2, 500, { positionFunction: myBuilder });
```

While model1 is added i runs from 0 to 999 and s runs from 0 to 999.
When model2 is added i runs from 1000 to 1499 and s runs from 0 to 499

The _particle_ object has the following properties that you can set

| property           | type       | default                                                     |
| ------------------ | ---------- | ----------------------------------------------------------- |
| position           | Vector3    | (0,0,0)                                                     |
| rotation           | Vector3    | (0,0,0)                                                     |
| rotationQuaternion | Quaternion | null, if _rotationQuaternion_ is set, _rotation_ is ignored |
| scaling            | Vector3    | (1,1,1)                                                     |
| pivot              | Vector3    | (0,0,0)                                                     |
| color              | Color4     | null                                                        |
| uvs                | Vector4    | (0,0,1,1)                                                   |

An example of code to build an immutable mesh
```javascript
const myBuilder = (particle, i, s) => {
    // particle is the current particle
    // i is its global index in the SPS
    // s is its index in its shape, so here from 0 to 149
    particle.rotation.y = s / 150;
    particle.position.x = s - 150;
    particle.uvs = new BABYLON.Vector4(0, 0, 0.33, 0.33); // first image from an atlas
    particle.scaling.y = Math.random() + 1;
}
const box = BABYLON.MeshBuilder.CreateBox('b', {}, scene);
const SPS = new BABYLON.SolidParticleSystem('SPS', scene, {updatable : false});
SPS.addShape(box, 150, {positionFunction: myBuilder}); // myBuilder will be called for each of the 150 boxes
const mesh = SPS.buildMesh();
```

Immutable color cube of triangle particles  https://www.babylonjs-playground.com/#2FPT1A#5  
Immutable town with 80 000 buildings https://www.babylonjs-playground.com/#2FPT1A#36

Note that although the particles cannot move but you can still move, scale or rotate the whole SPS mesh. When there is no need for you SPS mesh to move, scale or rotate you can use the standard Babylon.js mesh _freezeXXX()_ methods for further performance gain

```javascript
SPS.mesh.freezeWorldMatrix(); // prevents from re-computing the World Matrix each frame
SPS.mesh.freezeNormals(); // prevents from re-computing the normals each frame
```

You are not restricted to using the *positionFunction* to just a SPS created with *updatable = true* although using *initParticles()* and *setParticles()* is probably easier and you have a few more particle properties.

## Solid Particle Vertex Position
In addition to the *positionFunction* to set a particle's property there is also a *vertexFunction* option to modify the shape of each particle by changing the positions of the vertices of the model forming the particle. The custom function you assign to the *vertexFunction* is called once by *SPS.buildMesh()* for each vertex of a particle.

```javascript
var myVertexFunction = function(particle, vertex, i) {
  // particle : the current particle
  // vertex : the current vertex position within the particle
  // i : index of the vertex in the particle shape
  vertex.x *= Math.random() + 1;
};
SPS.addShape(box, 150, { vertexFunction: myVertexFunction }); // the 150 boxes will have their vertices moved randomly
SPS.buildMesh();
```

Of course you can use the both properties together :

```javascript
SPS.addShape(box, 150, {
  vertexFunction: myVertexFunction,
  positionFunction: myPositionFunction
});
```

Example with asteroids : https://www.babylonjs-playground.com/#2FPT1A#2

Making your SPS immutable is one way to optimize your scene. Next we will consider ways to optimize when using an updatable SPS.

## Rebuild the mesh

if a mesh, changed at creation time with `positionFunction` or `vertexFunction` has been then modified with `setParticles()`, it can be rebuild by reapplying the internally stored `positionFunction` or `vertexFunction` functions.  
Note that only the function are stored, not their results. This means that if one of your function produces different results each call (using `Math.random()` for instance), you won't get back the same SPS mesh shape but another computed shape.

```javascript
SPS.rebuildMesh();
```

Except in some very specific cases, you might not need to use this function.