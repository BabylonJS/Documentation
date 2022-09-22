---
title: Getting Started - Chapter 2 - Ground
image:
description: Continue your Babylon.js learning by adding a ground plane to your scene.
keywords: getting started, start, chapter 2, ground, groundplane
further-reading:
video-overview:
video-content:
---

# Getting Started - Ground

## Grounding the World

At the moment we have a box floating in space. To make the scene more world like let's add ground and think of our box as a building set on the ground.

Adding a ground is simple using

```javascript
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 });
```

As we need to create a ground large enough, to put some buildings (boxes) on, the options parameter has two properties set, width in the x direction and height in the z direction. (Yes, we agree, since y is vertical it would make more sense for the properties to be width and depth.)

<Playground id="#KBS9I5#67" title="Adding a Ground Playground" description="A playground showing how to add a basic ground plane to your scene." image="/img/playgroundsAndNMEs/gettingStartedGround.jpg"/>

The immediate thing to note is that the ground cuts through the middle of the box. This is because when they are created meshes are positioned at the origin.

![ground](/img/getstarted/ground.png)

We need to move the box up half its height using

```javascript
box.position.y = 0.5; //box created with default size so height is 1
```

<Playground id="#KBS9I5#66" title="Adjusting the Box position." description="A playground showing how to adjust the position of the box." image="/img/playgroundsAndNMEs/gettingStartedGround.jpg"/>

![house 0](/img/getstarted/house0.png)

Currently our world is silent. Let's add some sound.
