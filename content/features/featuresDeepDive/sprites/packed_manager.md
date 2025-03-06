---
title: Sprite Packed Manager
image: 
description: Learn about the sprite packed manager in Babylon.js.
keywords: babylon.js, diving deeper, sprites, sprite manager
further-reading:
video-overview:
video-content:
---

## Sprite Packed Manager
*Available from BJS version 4.1*

A packed spritesheet will look something like this

![Packed Spritesheet](/img/how_to/Sprites/pack1.png);

with sprite cells of different sizes arranged to optimize the file size.

The corresponding JSON file will have the format which is based on that produced using the [TexturePacker](https://www.codeandweb.com/texturepacker) app with the following settings:

- Data format: *Babylon.js (JSON Hash for SpritePackedManager)* 
- Trim: None
- Allow Rotation: Off


```javascript
{   "frames": {
		"eye.png": {
			"frame": {"x":0,"y":148,"w":400,"h":400},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":0,"y":0,"w":400,"h":400},
			"sourceSize": {"w":400,"h":400}
		},
		"redman.png": {
			"frame": {"x":0,"y":0,"w":55,"h":97},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":0,"y":0,"w":55,"h":97},
			"sourceSize": {"w":55,"h":97}
			},
		"spot.png": {
			"frame": {"x":199,"y":0,"w":148,"h":148},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":0,"y":0,"w":148,"h":148},
			"sourceSize": {"w":148,"h":148}
		},
		"triangle.png": {
			"frame": {"x":55,"y":0,"w":144,"h":72},
			"rotated": false,
			"trimmed": false,
			"spriteSourceSize": {"x":0,"y":0,"w":144,"h":72},
			"sourceSize": {"w":144,"h":72}
		}
	},
	"meta": {
		"app": "https://www.codeandweb.com/texturepacker",
		"version": "1.0",
		"image": "pack1.png",
		"format": "RGBA8888",
		"size": {"w":400,"h":548},
		"scale": "1",
		"smartupdate": "$TexturePacker:SmartUpdate:c5944b8d86d99a167f95924d4a62d5c3:3ed0ae95f00621580b477fcf2f6edb75:5d0ff2351eb79b7bb8a91bc3358bcff4$"
	}
}
```

**Note:** *SpriteMap* uses the *Babylon.js (JSON Array for SpriteMap)* format for packed spritesheets. JSON files are not interchangeable between *SpritePackedManager* and *SpritMap*.

The minimal format required by *SpritePackedManager* is below. Although currently it only uses the frame property it may be able to use others in the future. 

```javascript
{   "frames": {
		"eye.png": {
			"frame": {"x":0,"y":148,"w":400,"h":400}
		},
		"redman.png": {
			"frame": {"x":0,"y":0,"w":55,"h":97}
			},
		"spot.png": {
			"frame": {"x":199,"y":0,"w":148,"h":148}
		},
		"triangle.png": {
			"frame": {"x":55,"y":0,"w":144,"h":72}
		}
	}
}
```
Reminder the above minimal format is only suitable for the *SpritePackedManager*.

When you create a sprite instance using the packed manager you refer to the cell (frame) to use by its name rather than its index number.

The above JSON is stored in the file *pack1.json* 
```javascript
const mySpritePackedManager = new BABYLON.SpritePackedManager("spm", "textures/pack1.png", 4);

const sprite = new BABYLON.Sprite("sprite", mySpritePackedManager);
sprite.cellRef = "spot.png";
```

Multiple sprites from *pack1.json<Playground id="#YCY2IL#8" title="Multiple Sprites From 1 .json File" description="Simple example of loading multiple sprites from one .json file."/>

The same as for the sprite manager you can apply the following properties,

```javascript
sprite.width = 0.3;
sprite.height = 0.4;
sprite.position =new BABYLON.Vector3(1, 1, 1);
sprite.angle = Math.PI/4;
sprite.invertU = true; //vertical reflection
sprite.invertV = true; //horizontal reflection
```


You are able to animate using a packed spritesheet with *playAnimation*. You must ensure that the frames for the animation are consecutive and in the correct order in the JSON file.

Slide show animation from JSON file: <Playground id="#YCY2IL#5" title="Slide Show From .json" description="Simple example of a slide show loaded from a .json file."/>
Slide show animation with in-line JSON to show order of slides: <Playground id="#YCY2IL#13" title="Slide Show Animation With In-Line .json" description="Simple example of a slide show animation with in-line .json."/>