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

A limitation of the current VAT implementation is that you cannot [blend animations to play simultaneously](./advanced_animations#animation-blending). Also, the animations may not be as smooth as when not using BVA because there is no interpolation between frames. The "smoothness" will depend on the number of frames of the animation.

## Baking Vertex Texture Animations

The `VertexAnimationBaker` class generates a texture for you given the animation.

```javascript
let baker = null,
  mesh = null;
const animationRanges = [{ from: 1, to: 20, name: "My animation" }];
BABYLON.ImportMeshAsync("https://raw.githubusercontent.com/RaggarDK/Baby/baby/arr.babylon", scene, undefined)
  .then((importResult) => {
    mesh = importResult.meshes[0];
    // create the baker helper, so we can generate the texture
    baker = new BABYLON.VertexAnimationBaker(scene, mesh);
    // you can slice the animation here with several animation ranges.
    return baker.bakeVertexData(ranges);
  })
  .then((vertexData) => {
    // we got the vertex data. create the texture from it:
    const vertexTexture = baker.textureFromBakedVertexData(vertexData);
    // create a manager to store it.
    const manager = new BABYLON.BakedVertexAnimationManager(scene);
    // store the texture
    manager.texture = vertexTexture;

    // set the animation parameters. You can change this at any time.
    manager.setAnimationParameters(
      animationRanges[0].from, // initial frame
      animationRanges[0].to, // last frame
      0, // offset
      30, // frames per second
    );

    // associate the manager with the mesh
    mesh.bakedVertexAnimationManager = manager;

    // update the time to play the animation
    scene.registerBeforeRender(() => {
      manager.time += engine.getDeltaTime() / 1000.0;
    });
  });
```

Here's an example for a single mesh:

<Playground id="#CP2RN9#235" title="Vertex Texture Animations" description="An example of playing a vertex texture animation."/>

## VATs for instances

As explained in [How To Use Instances](/features/featuresDeepDive/mesh/copies/instances), instances are an excellent way to use hardware accelerated rendering to draw a huge number of identical meshes. VATs can be used further to handle the animations efficiently. In this case you need to register a buffer to set the animation parameters for each instance.

```javascript
// create the instanced buffer
mesh.registerInstancedBuffer("bakedVertexAnimationSettingsInstanced", 4);
// set it for the base mesh
mesh.instancedBuffers.bakedVertexAnimationSettingsInstanced = new BABYLON.Vector4(0, 0, 0, 0);
```

<Playground id="#CP2RN9#290" title="Vertex Texture Animations on instances" description="An example of playing VATs on instances."/>

## VATs for thin instances

VATs can also be used with [thin instances](/features/featuresDeepDive/mesh/copies/thinInstances). Then you set the parameters for the thin instances:

```javascript
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

Here's an example:

<Playground id="#CP2RN9#291" title="Vertex Texture Animations on thin instances" description="An example of playing VATs on thin instances."/>

### VATs offset

When using VAT with thin instances, you might expect each instance to start its animation with a specific time
offset. However, this is **not guaranteed by default**.

This is because multiple instances often share the same `BakedVertexAnimationManager`, which internally handles the
current animation frame globally. To ensure that a specific instance starts at its intended offset you can manually
compute the correct offset using the following formula:

```typescript
function computeOffset(
  fromFrame: number,
  toFrame: number,
  time: number,
  fps: number = 60
): number {
  const totalFrames = toFrame - fromFrame + 1;
  const t = time * fps / totalFrames;
  const frame = Math.floor((t - Math.floor(t)) * totalFrames);
  return totalFrames - frame;
}
```

The `time` parameter can be retrieved directly from the used `BakedVertexAnimationManager` via `manager.time`.

<Playground id="#3NIXCL#707" title="Vertex Texture Animations on thin instances at offset" description="An example of playing VATs on thin instances with specific offset."/>


## Serializing and loading VATs

Baking the texture can be a slow process, and will play the entire animation visibly. In order to avoid this during run-time, it's better to bake the texture data at build time, and just load it at run-time. Here's a sample script to bake the vertex data and get the JSON file to save locally:

```javascript
let baker = null,
  mesh = null;
const animationRanges = [{ from: 1, to: 20, name: "My animation" }];
BABYLON.ImportMeshAsync("http://example.com/arr.babylon", scene, undefined)
  .then((importResult) => {
    mesh = importResult.meshes[0];
    // create the baker helper, so we can generate the texture
    baker = new BABYLON.VertexAnimationBaker(scene, mesh);
    // you can slice the animation here with several animation ranges.
    return baker.bakeVertexData(ranges);
  })
  .then((vertexData) => {
    // we got the vertex data. let's serialize it:
    const vertexDataJSON = baker.serializeBakedVertexDataToJSON(vertexData);
    // and save it to a local JSON file
    let a = document.createElement("a");
    a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(vertexDataJSON));
    a.setAttribute("download", "vertexData.json");
    a.click();
  });
```

At your actual application you can now easily load the JSON file. Here's a simple example:

```javascript
let baker = null,
  mesh = null;
const animationRanges = [{ from: 1, to: 20, name: "My animation" }];

// read your mesh like always
BABYLON.ImportMeshAsync("http://example.com/arr.babylon", scene, undefined)
  .then((importResult) => {
    mesh = importResult.meshes[0];
    // read the vertex data file.
    return fetch("/vertexData.json");
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    // convert to json
    return response.json();
  })
  .then((json) => {
    // create the baker helper, so we can generate the texture
    baker = new BABYLON.VertexAnimationBaker(scene, mesh);
    const vertexData = baker.loadBakedVertexDataFromJSON(json);
    // we got the vertex data. create the texture from it:
    const vertexTexture = baker.textureFromBakedVertexData(vertexData);

    // .... and now the same code as above
  });
```
