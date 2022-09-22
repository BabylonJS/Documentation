---
title: Getting Started - Chapter 5 - Sprite Trees
image:
description: Learn to add a skybox to your scene.
keywords: getting started, start, chapter 5, environment, skybox
further-reading:
video-overview:
video-content:
---

# Getting Started - Working With Code

## Sprite Trees

We are going to plant a couple of woods in our world each containing 500 trees. To maintain rendering speed we are going to use sprites. These are two dimensional images that will always face the camera.

We are using this image
![palm tree](/img/getstarted/palmtree.png)
for out tree sprite and we set up a sprite manager for it.

```javascript
const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "url to tree image", 2000, { width: 512, height: 1024 }, scene);
```

The parameters are a name for the manager, the url of the image, the maximum number of sprites, an object specifying the width and height of the sprite, in this case it is the width and height of the image.

```javascript
for (let i = 0; i < 500; i++) {
  const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
  tree.position.x = Math.random() * -30;
  tree.position.z = Math.random() * 20 + 8;
  tree.position.y = 0.5;
}

for (let i = 0; i < 500; i++) {
  const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
  tree.position.x = Math.random() * 25 + 7;
  tree.position.z = Math.random() * -35 + 8;
  tree.position.y = 0.5;
}
```

<Playground id="#KBS9I5#89" title="Adding Sprites" description="Add sprite trees to your scene." image="/img/playgroundsAndNMEs/gettingStartedSpriteTrees1.jpg"/>

You can also use a collection of images in a sprite map to produce an animation.

![ufo map](/img/getstarted/ufo.png)

The above map consists of cell frames of the same size, 5 across and 4 down. This time the width and height given in the manager is the width and height of one cell.

```javascript
const spriteManagerUFO = new BABYLON.SpriteManager("UFOManager", "url to ufo image", 1, { width: 128, height: 76 });
```

The animation for a sprite is set by giving the first and last cell to be used, whether it loops (true) or not and time between cell frames

```javascript
const ufo = new BABYLON.Sprite("ufo", spriteManagerUFO);
ufo.playAnimation(0, 16, true, 125);
```

<Playground id="#KBS9I5#90" title="Animating Sprites" description="Add an animated UFO to your scene." image="/img/playgroundsAndNMEs/gettingStartedSpriteTrees2.jpg"/>

Now we are going to use some more features to produce a working fountain.
