# Picking
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

Pick and rotate selected sprite with sprite manager https://www.babylonjs-playground.com/#YCY2IL#9  
Pick and rotate selected sprite with sprite packed manager https://www.babylonjs-playground.com/#YCY2IL#10

For performance reasons the default is to indicate a hit if the sprite is picked within its bounding rectangle. When you do not want a hit inside a transparent region of the sprite you need to add the following
```javascript
mySprite.useAlphaForPicking = true;
```
and picking will only work if alpha > 0.5.

Transparent regions not reacting to pick https://www.babylonjs-playground.com/#YCY2IL#11


Where sprites are overlapping you can use *multiPickSprite* to get all the sprites under the mouse:

```
const pickResult = scene.multiPickSprite(this.pointerX, this.pointerY);
for (let i = 0; i < pickResult.length; i++) {
    	pickResult[i].pickedSprite.angle += Math.PI / 4;
}
```

multipicking of overlapping sprites https://www.babylonjs-playground.com/#YCY2IL#12

