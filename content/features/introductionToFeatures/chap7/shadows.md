---
title: Getting Started - Chapter 7 - Adding Shadows
image: 
description: Learn how to add shadows to your Babylon.js scene.
keywords: getting started, start, chapter 7, lighting, lights, shadows
further-reading:
video-overview:
video-content:
---

# Getting Started - Adding Shadows

## Adding Shadows
The light we have been using so far, the *HemisphericLight*, gives an ambient background light and is not suitable for producing shadows. We could use the lamp spot lights; however, the shadows they produce can be faint, so we will introduce a directional light.

```javascript
const  light = new BABYLON.DirectionalLight("dir", direction, scene);
```
As usual, the direction is a Vector3 and the scene parameter is optional.

Setting its position will affect the direction and length of any created shadows.

```javascript
light.position = new BABYLON.Vector3(0, 15, -30);
```

Shadows will appear only when a *ShadowGenerator* object is created, a mesh is set to cast the shadow, and the mesh receiving the shadow is set to receive shadows. 

```javascript
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
```

The first parameter is the size of the shadow map, and the second is the light generating the shadow.

We also need to add a mesh that will cast the shadow.

```javascript
shadowGenerator.addShadowCaster(casting_mesh, true);
```

The optional second parameter, which has a default value of false, will add any children of the mesh to the shadow caster.

Finally we also have to tell the mesh on which the shadow is cast to receive it.

```javascript
receiving_mesh.receiveShadows = true
```

In our case, at the appropriate positions, we need

```javascript
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

shadowGenerator.addShadowCaster(dude, true);

ground.receiveShadows = true;
```
<Playground id="#4G38H4#7" title="Adding Basic Shadows" description="Set up a scene for shadows with the shadow generator." image="/img/playgroundsAndNMEs/gettingStartedShadows1.webp"/>

Putting this into our world, with suitable value adjustments, gives

<Playground id="#KBS9I5#96" title="Shadows in the Village" description="Adding basic shadows to the village." image="/img/playgroundsAndNMEs/gettingStartedShadows2.webp"/>

So far we have had only one way to view our village world. There are other possibilities with different cameras.
