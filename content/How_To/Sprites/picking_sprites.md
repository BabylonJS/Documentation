---
title: Picking Sprites
image: 
description: Learn about picking sprites in Babylon.js.
keywords: babylon.js, diving deeper, sprites, picking
further-reading:
video-overview:
video-content:
---

## Picking
Sprites managed by either the sprite or packed manager can be selected, or picked, provided both the sprite and the manager are set to pickable. This is done as follows

```javascript
mySpriteManager.isPickable = true;
mySpritePackedManager.isPickable = true;
mySprite.isPickable = true;
```

To do so, you need to:
- Turn on picking on the sprites you want: `sprite.isPickable = true;`
- Enable SpriteManager to support picking: `spriteManager.isPickable = true;`

To do picking you can use the `scene.pickSprite`:

```
var pickResult = scene.pickSprite(this.pointerX, this.pointerY);
if (pickResult.hit) {
	pickResult.pickedSprite.angle += 0.5;
}
```

Pick and rotate selected sprite with sprite manager: <Playground id="#YCY2IL#9" title="Pick And Rotate A Selected Sprite" description="Simple example of picking a sprite and rotating it."/>
Pick and rotate selected sprite with sprite packed manager: <Playground id="#YCY2IL#10" title="Pick and Rotate A Selected Sprite With Sprite Packed Manager" description="Simple example of selecting a sprite from a sprite packed manager and rotating it."/>

For performance reasons the default is to indicate a hit if the sprite is picked within its bounding rectangle. When you do not want a hit inside a transparent region of the sprite you need to add the following
```javascript
mySprite.useAlphaForPicking = true;
```
and picking will only work if alpha > 0.5.

Transparent regions not reacting to pick: <Playground id="#YCY2IL#11" title="Transparent Regions No Picking" description="Simple example showing how you cannot pick transparent regions of sprites."/>


Where sprites are overlapping you can use *multiPickSprite* to get all the sprites under the mouse:

```
const pickResult = scene.multiPickSprite(this.pointerX, this.pointerY);
for (let i = 0; i < pickResult.length; i++) {
    	pickResult[i].pickedSprite.angle += Math.PI / 4;
}
```

multipicking of overlapping sprites: <Playground id="#YCY2IL#12" title="Multipicking Overlapping Sprites" description="Simple example of multipicking of overlapping sprites."/>