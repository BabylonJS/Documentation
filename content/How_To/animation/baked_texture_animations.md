---
title: Baked Texture Animations
image:
description: Efficient animations on the GPU.
keywords: diving deeper, animation, advanced
further-reading:
video-overview:
video-content:
---

## Baked vertex animations

Animations are computed by the CPU, applying the bone effects to the mesh. This is reasonably slow and for several animated objects can be a bottleneck. One way to optimize this is pre-computing (or baking) the animations, storing them into a texture (usually called Vertex Animation Textures, or VAT) and using it on the vertex shaders . This frees the CPU, with the trade-off that you need to perform this initial baking step (which can be done at development time), add a new texture file to your downloads and consume more GPU memory. This trade-off is usually quite good, since the CPU tends to be the bottleneck.

A limitation of the current VAT implementation is that you cannot [blend animations to play simultaneously](./advanced_animations#animation-blending).

## Baking Vertex Texture Animations

The `VertexAnimationBaker` class generates a texture for you given the animation.

```js
let baker = null, mesh = null;
BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://raw.githubusercontent.com/RaggarDK/Baby/baby/",
    "arr.babylon",
    scene,
    undefined
).then((importResult) => {
    mesh = importResult.meshes[0];
    baker = new BABYLON.VertexAnimationBaker(scene, mesh);
    // you can slice the animation here with several animation ranges.
    return baker.bakeVertexData([{from: 1, to: 20, name: "My animation"}]);
}).then((vertexData) => {
    const vertexTexture = baker.textureFromBakedVertexData(vertexData);
    // your texture is ready to use, see below
});
``` 

## Applying a baked animation to a mesh

Once you got your texture, you can apply it to a mesh and it'll be animated on the GPU. This is easy to do, updating the `bakedVertexAnimationMap` settings on the material:

```js
  // enable the vertex animation map
  mesh.material.bakedVertexAnimationMap.isEnabled = true;
  // set the texture, which comes from baker.textureFromBakedVertexData():
  mesh.material.bakedVertexAnimationMap.texture = vertexTexture;
  // set animation parameters
  mesh.material.bakedVertexAnimationMap.setAnimationParameters(
      0, // initial frame
      19, // last frame
      0, // offset for the initial frame 
      30 // frames per second
  );

  scene.registerBeforeRender(() => {
    // update the animation
    mesh.material.bakedVertexAnimationMap.time += engine.getDeltaTime / 1000.0;
  });
```

Here's an example for a single mesh:

<Playground id="#CP2RN9#12" title="Vertex Texture Animations" description="An example of playing a vertex texture animation."/>


## VATs for instances

As explained in [How To Use Instances](/divingDeeper/mesh/copies/instances), instances are an excellent way to use hardware accelerated rendering to draw a huge number of identical meshes. VATs can be used further to handle the animations efficiently.

<Playground id="#CP2RN9#13" title="Vertex Texture Animations on instances" description="An example of playing VATs on instances."/>

## VATs for thin instances

VATs can also be used with [thin instances](/divingDeeper/mesh/copies/thinInstances). In this case you need to register a buffer to set the animation parameters for each instance.

```js
  // create the instanced buffer
  mesh.registerInstancedBuffer("bakedVertexAnimationSettingsInstanced", 4);
  // set it for the base mesh
  mesh.instancedBuffers.bakedVertexAnimationSettingsInstanced = new BABYLON.Vector4(0, 0, 0, 0);
```

Then you set the parameters for the thin instances as a

```js
  // allocate the parameters
  const animParameters = new Float32Array(numInstances * 4);

  // for each instance
  for (let i = 0; i < numInstances; i++) {
    // generate the animation parameters with your code:
    // returns a BABYLON.Vector4()
    const params = setAnimationParameters();

    // store in the base array    
    animParameters.set(params.asArray(), i * 4);
  }

  // update the mesh with all settings
  mesh.thinInstanceSetBuffer("bakedVertexAnimationSettingsInstanced", animParameters, 4);
```

Here's an example.

<Playground id="#CP2RN9#14" title="Vertex Texture Animations on thin instances" description="An example of playing VATs on thin instances."/>

## VATs with SPS

TODO

## Serializing and loading VATs

TODO
