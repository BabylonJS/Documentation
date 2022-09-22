---
title: Sprite Map Tile Layout
image:
description: Learn all about sprite map tile layout in Babylon.js.
keywords: babylon.js, diving deeper, sprites, tile layout, tile
further-reading:
video-overview:
video-content:
---

## Sprite Map Tile Layout

Each sprite map is comprised of tiles of equal size, filling the output plane and forming a grid. Tiles are identified by their position on the grid. For 36 tiles laid out in 9 rows with 4 columns in each; (0, 0) is the bottom left hand corner tile and (3, 8) the top right hand corner tile. Tiles can be placed on top of one another in layers - more on layers later.

```javascript
tileID = new Vector2(2, 6);
```

Given the frameID (index in frames array) you can set one or more tiles to contain the sprite referenced by this frameID

```javascript
spriteMap.changeTiles(layerID, tileID, frameID); //Change one tile
spriteMap.changeTiles(layerID, [tileID0, tileID1, ...tileIDn], frameID); //Change multiple tiles to sprite at frameID
```

When you are going to make multiple changes using just one frameID then passing the tileIDs in an array is optimal. It prevents the buffers having to be updated for each tile instead of in batches.

Change a whole row of stones to Roman columns <Playground id="#YCY2IL#20" title="Sprite Map Tile Layout" description="Simple example showing sprite map tile layouts."/>

You will often find the need for a blank tile. We recommend that you find a single transparent pixel on your packed spritesheet file You can reference this in JSON file.

In the spritesheet file used in these docs there is a transparent pixel at x = 221, y = 221 so we make a cell frame of width = height = 1 and maintain the same source sizes as the other frames. Adding the following to your JSON gives a blank tile.

```
{
	"filename": "blank.png",
	"frame": {"x":221,"y":221,"w":1,"h":1},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":32,"h":32},
	"sourceSize": {"w":32,"h":32}
},
```

<Playground id="#YCY2IL#21" title="Blank Tile Added to JSON" description="Simple example of adding a blank tile to a JSON file."/>
