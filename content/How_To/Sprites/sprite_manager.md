# Sprite Manager

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

single sprite image https://www.babylonjs-playground.com/#YCY2IL

You can alter the cell width and height after creation using these properties *mySpriteManager.cellWidth* and *mySpriteManager.cellWidth*

with single image size altered https://www.babylonjs-playground.com/#YCY2IL#1
multiple trees https://www.babylonjs-playground.com/#YCY2IL#2

As well as width and height you can apply the following properties,

```javascript
sprite.position =new BABYLON.Vector3(1, 1, 1);
sprite.angle = Math.PI/4;
sprite.invertU = true; //vertical reflection
sprite.invertV = true; //horizontal reflection
```

A spritesheet example

![uniform spritesheet](/img/how_to/Sprites/08-2.png)

There are 44 cells in the above spritesheet, each one 64 x 64 pixels. Since the cells are square you can just use  the cell size rather than its width and height. Create the sprite manager with
```javascript
const spriteManagerPlayer = new BABYLON.SpriteManager("playerManager","path to Player.png", 1, 64);
```
which can then be use to produce just one sprite instance.

```javascript
const player = new BABYLON.Sprite("player", spriteManagerPlayer); 
player.cellIndex = 1;
```
![Elements](/img/how_to/Sprites/08-1.png)

Since the cells are square the default values for player width and height are 1 and the ratio is correct they are not needed. However the if the sprite is to draw from a cell with index other than 0 it must be specified.

Sprites from different cells https://www.babylonjs-playground.com/#YCY2IL#3

It is by changing of cell numbers that you produce a sprite animation.

To begin an animation, use:
```javascript
mySprite.playAnimation(start cell, end cell, loop, delay);
```
The sprite will be animated from the start cell to the end cell. when *loop* is set to true the animation will loop. The delay is the time delay between the frames of the animation (the smaller it is, the faster the animation). The cells must be in animation frame order.

Sprite animation https://www.babylonjs-playground.com/#YCY2IL#4
