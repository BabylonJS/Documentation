---
title: Sprite Manager
image:
description: Learn all about sprite management in Babylon.js.
keywords: babylon.js, diving deeper, sprites, sprite manager
further-reading:
video-overview:
video-content:
---

## Sprite Manager

Take a single sprite image example, i.e. just one cell.

![palm tree](/img/getstarted/palmtree.png)

Using an image format which contain alpha channel for transparency, like .png, allows complex shapes to be displayed.

Create the sprite manager for the trees

```javascript
const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", path to palm.png, 2000, {width: 512, height: 1024});
```

Drawing sprites just uses a name and the sprite manager linking to the sprite image. For an accurately scaled representation of the image the width and height of the sprite should be in the same ratio as the sprite image.

```javascript
const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
tree.width = 1;
tree.height = 2;
```

single sprite image <Playground id="#YCY2IL" title="Single Sprite Image" description="Simple example of a single sprite image." isMain={true} category="Sprites"/>

You can alter the cell width and height after creation using these properties _mySpriteManager.cellWidth_ and _mySpriteManager.cellWidth_

with single image size altered <Playground id="#YCY2IL#1" title="Single Sprite Image Altered" description="Simple example of a single sprite image altered."/>
multiple trees <Playground id="#YCY2IL#2" title="Multiple Sprites Example" description="Simple example of multiple sprites."/>

As well as width and height you can apply the following properties,

```javascript
sprite.position = new BABYLON.Vector3(1, 1, 1);
sprite.angle = Math.PI / 4;
sprite.invertU = true; //vertical reflection
sprite.invertV = true; //horizontal reflection
```

Please note that the z-axis position of a sprite will affect its size on the screen, i.e, sprites with a higher z-axis value will appear farther away and such, will be smaller on the screen: <Playground id="#YCY2IL#811" title="Sprite size affected by z position" description="An example of how the z axis position affects a sprite size."/>

A spritesheet example

![uniform spritesheet](/img/how_to/Sprites/08-2.png)

There are 44 cells in the above spritesheet, each one 64 x 64 pixels. Since the cells are square you can just use the cell size rather than its width and height. Create the sprite manager with

```javascript
const spriteManagerPlayer = new BABYLON.SpriteManager("playerManager", "path to Player.png", 1, 64);
```

which can then be use to produce just one sprite instance.

```javascript
const player = new BABYLON.Sprite("player", spriteManagerPlayer);
player.cellIndex = 1;
```

![Elements](/img/how_to/Sprites/08-1.png)

Since the cells are square the default values for player width and height are 1 and the ratio is correct they are not needed. However the if the sprite is to draw from a cell with index other than 0 it must be specified.

Sprites from different cells: <Playground id="#YCY2IL#3" title="Sprites From Different Cells" description="Simple example of sprites from different cells" isMain={true} category="Sprites"/>

It is by changing of cell numbers that you produce a sprite animation.

To begin an animation, use:

```javascript
mySprite.playAnimation(start cell, end cell, loop, delay);
```

The sprite will be animated from the start cell to the end cell. when _loop_ is set to true the animation will loop. The delay is the time delay between the frames of the animation (the smaller it is, the faster the animation). The cells must be in animation frame order.

Sprite animation: <Playground id="#YCY2IL#4" title="Sprite Animation" description="Simple example of how to handle sprite animation." isMain={true} category="Sprites"/>
