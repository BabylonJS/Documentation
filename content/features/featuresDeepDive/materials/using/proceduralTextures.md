---
title: Procedural Textures
image:
description: Learn fresnel parameters in Babylon.js.
keywords: diving deeper, materials, procedural Texture, texture
further-reading:
video-overview:
video-content:
---

## What Are They?

In classic texturing, we use 2D images, often pictures that have been shaped specifically to match an object. Let’s imagine you are creating a medieval fantasy game, working on a dwarf pub, where there are multiple, big, "old school" wooden tables. With classic 2D texturing, you have 3 choices:

- Create a single texture and use it on all of the tables (but every table is going to look the same)

- Create a collection of various wood textures and apply them randomly to each table

- Create a separate texture for each table, insuring that they each look different

No choice seems to be a good one.

Enter **procedural textures**.

Procedural texturing is a way to programmatically create a texture. There are 2 types of procedural textures: code-only, and code that references some classic 2D images, sometimes called 'refMaps' or 'sampler' images.

One main advantage of procedural textures is that they are written using a fragment shader (using GLSL in the case of Babylon.js). That means that the code generating the texture is executed by the GPU and not the CPU (that is to say, NOT executed in JavaScript code). This has a huge performance impact in a positive way.

Procedural textures can be generated:

- Only once to create the texture which is put into cache

- Every 1, 2, 3, or 4, or more frames to be able to create an animated texture (like fire)

See more about 'refresh rate' in the Custom Procedural Textures section... far below.

## Procedural Textures in Babylon.js

**Babylon.js** offers you an easy out-of-the-box way to use this kind of texture. The engine itself provides you with standard default textures that you can use right now. It also gives you the ability to create custom procedural textures and package them in a simple way.

## Using a Procedural Texture

Applying a procedural texture is just the same as using a classic one. Let’s start with a simple mesh (a cylinder in this case) and attach it to your scene:

```javascript
const cylinder = BABYLON.MeshBuilder.CreateCylinder("mycylinder", { height: 7, diameterTop: 2, diameterBottom: 2, tessellation: 12, subdivisions: 1 }, scene);
```

Then, you need to create a StandardMaterial:

```javascript
const material = new BABYLON.StandardMaterial("material", scene);
```

Now, create a WoodProceduralTexture object for which you need to pass a name, the size of the generated texture and the scene.

```javascript
const texture = new BABYLON.WoodProceduralTexture("texture", 1024, scene);
```

You are almost set! All you need to do now is to associate the texture to the material as a diffuseTexture, for instance, (or emissiveTexture, specularTexture, any other) and then apply the material to the mesh.

```javascript
material.diffuseTexture = texture;
cylinder.material = material;
```

You can optionally change the values of special default properties. Here is an example of setting two properties for the WoodProceduralTexture:

```javascript
texture.woodColor = new BABYLON.Color3(0.49, 0.25, 0);
texture.ampScale = new BABYLON.Vector2(1.0, 1.0);
```

## Noise Procedural Texture

The NoiseProceduralTexture is available out of the box with the core Babylon.js engine.

You can create one with the following code:

```javascript
const noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
```

The NoiseProceduralTexture exposes the following properties:

- brightness: Gets or sets a value between 0 and 1 indicating the overall brightness of the texture (default is 0.2)
- octaves: Defines the number of octaves to process (default is 3)
- persistence: Defines the level of persistence (0.8 by default)
- animationSpeedFactor: Gets or sets animation speed factor (default is 1)

<Playground id="#K9GLE6#49" title="Experiment With Noise Properties" description="Simple example for you to experiment with noise properties." image="/img/playgroundsAndNMEs/divingDeeperProceduralTexture1.jpg"/>

## Using Standard Procedural Textures

Babylon.js also has a number of pre-built procedural textures that are gathered in the Procedural Texture library: https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/proceduralTextures

You can use them in your project:

- Using npm with `npm install --save babylonjs babylonjs-procedural-textures`
- With a direct reference to: https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js

All standard procedural textures can be used in the same ways, but they each have specific (special) properties:

- [BrickProceduralTexture](https://doc.babylonjs.com/toolsAndResources/assetLibraries/proceduralTexturesLibrary/brick)
- [CloudProceduralTexture](https://doc.babylonjs.com/toolsAndResources/assetLibraries/proceduralTexturesLibrary/cloud)
- [FireProceduralTexture](https://doc.babylonjs.com/toolsAndResources/assetLibraries/proceduralTexturesLibrary/fire)
- [GrassProceduralTexture](https://doc.babylonjs.com/toolsAndResources/assetLibraries/proceduralTexturesLibrary/grass)
- [MarbleProceduralTexture](https://doc.babylonjs.com/toolsAndResources/assetLibraries/proceduralTexturesLibrary/marble)
- [RoadProceduralTexture](https://doc.babylonjs.com/toolsAndResources/assetLibraries/proceduralTexturesLibrary/road)
- [WoodProceduralTexture](https://doc.babylonjs.com/toolsAndResources/assetLibraries/proceduralTexturesLibrary/wood)
