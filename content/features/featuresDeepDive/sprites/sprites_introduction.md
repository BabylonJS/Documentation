---
title: Introduction To Sprites
image:
description: Dive into learning the basics of sprites in Babylon.js.
keywords: babylon.js, diving deeper, sprites
further-reading:
video-overview:
video-content:
---

## Sprites

![Elements](/img/how_to/Sprites/08.png)

Babylon.js has three ways of managing sprites, the _SpriteManager_, the _SpritePackedManager_ and the _SpriteMap_. The first manages a single image file or, for animation, a spritesheet (also called a sprite atlas) of multiple sprite images all of the same size. The second is for a packed spritesheet of different sized sprite images. The third uses a packed spritesheet to form a 2D (or 2.5D) grid of possibly thousands of sprites.

The separate images in a spritesheet off either type are in what are called cells.

The brief overviews on this page are further detailed within this section.

## Sprite Manager

For a single sprite image or uniform spritesheet you create a sprite manager.

```javascript
const mySpriteManagerTrees = new BABYLON.SpriteManager(name, url, capacity, size, scene); //scene is optional and defaults to the current scene
```

- _name_ - (_string_) manager name;
- _url_ - (_string_) path to the image/spritesheet url;
- _capacity_ (_number_) maximum number of sprite instances in this manager;
- _size_ (_\{width: number, height: number\} | number_), width and height or size of a sprite or a cell within a spritesheet;
- _scene_ (_scene_) optional

## Sprite Packed Manager

_Available from BJS version 4.1_

When your sprites images are of varying sizes you need a packed spritesheet file and a JSON file containing the positional data of the individual sprites within the packed spritesheet. The packed spritesheet file and the JSON file should have the same name and be in the same folder, eg pack1.png and pack1.json. You can then create a sprite packed manager by either

referencing just the packed spritesheet file

```javascript
const mySpritePackedManager = new BABYLON.SpritePackedManager(name, spritesheet url, capacity, scene); //scene is optional and defaults to the current scene
```

or a packed spritesheet file and an appropriate JSON object

```javascript
const spm = new BABYLON.SpritePackedManager(name, spritesheet url, capacity, scene, atlasJSON);
```

- _name_ - (_string_) manager name;
- _url_ - (_string_) path to the spritesheet url;
- _capacity_ (_number_) maximum number of sprite instances in this manager;
- _scene_ (_scene_) optional unless the following parameter is used
- _JSONpack_ (_JSON object_) optional

Currently the sprite packed manager only uses the cell positional and cell size data from the packed spritesheet.

## Sprite Map

_Available from BJS version 4.1_

When creating a 2D or 2.5D game you often need to render thousands of animated sprites on screen fast. This is beyond the capabilities of either of the sprite managers. The Babylon.js _SpriteMap_ was made for use in this situation. The only current limitation of this sprite mapping system is that the positions of the sprites are static to a specific grid dictated by the Sprite Maps initializing parameters.

**Note:** _SpriteMap_ uses a different JSON format to _SpritePackedManager_ and so their files are not interchangeable. Also you need to create a texture from the packed spritesheet and pass this rather than a direct path to its url.

To create a SpriteMap is simple:

```javascript
const mySpriteMap = new BABYLON.SpriteMap(name, atlasJSON, spriteSheetTexture, options, scene);
```

- _name_ - (_string_) manager name;
- _atlasJSON_ (_JSON object_) referencing the packed spritesheet;
- _spriteTexture_ - (_texture_) a texture created from a packed spritesheet;
- _options_ (_number_) initializing options;
- _scene_ (_scene_) _REQUIRED_

The initializing options set up the data buffers in memory and get the system prepared for display. When making changes to any of the options it is recommended that you dispose the map and re-initialize with the correct options.

## Pixel perfection

You can use the `options` object to set options for the both sprite managers:

```typescript
export interface SpriteManagerOptions {
    spriteRendererOptions: SpriteRendererOptions;
}
```

This way you can set options for the sprite render:

```typescript
export interface SpriteRendererOptions {
    pixelPerfect?: boolean;
}
```

Setting `pixelPerfect` to true instantiates the sprite render in pixel perfect mode. Creating the renderer in pixel perfect mode is faster than creating it in non-pixel perfect mode and setting it's `pixelPerfect` property to `true`.

### Example:

```javascript
const spriteManagerPlayer = new BABYLON.SpriteManager(
    "playerManager",
    "sprite_url.png",
    3,
    {
        width: 32,
        height: 32,
    },
    scene,
    0.003,
    undefined,
    undefined,
    undefined,
    {
        spriteRendererOptions: {
            pixelPerfect: true
        }
    }
);
```
