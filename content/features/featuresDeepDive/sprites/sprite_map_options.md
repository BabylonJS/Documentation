---
title: Sprite Map Options
image:
description: Learn all about sprite map options in Babylon.js.
keywords: babylon.js, diving deeper, sprites, options
further-reading:
video-overview:
video-content:
---

## Sprite Map Options

The options parameter object, when creating a sprite map, contains a number of properties

```javascript
const spriteMap = new BABYLON.SpriteMap(name, atlasJSON, spriteTexture, options, scene);
```

Each of the options properties helps the sprite map reserve the proper data buffers in memory and get the system prepared for display.

- stageSize: A Vector2 of the number of "tiles" in the system - default : Vector2(1,1)
- outputSize: A Vector2 of size of the output plane in World Units - default : Vector2(1,1)
- outputPosition: A Vector3 of position of the output plane in World Units - default : Vector3.Zero
- outputRotation: A Vector3 of rotation of the output plane in World Units - default : Vector3.Zero
- layerCount: A Integer of the number of "layers" in the system - default : 1
- maxAnimationFrames: The maximum number of frames in any animation on the sheet - default : 0
- baseTile: The frame ID of the initial tile to propagate into the system - default : 0
- flipU: A Boolean flag to trigger flipping the vertical results of the spite after framing calculations - default : false
- colorMultiply: A Vector3 that will multiply the final color value of the map - default : Vector3(1,1,1)

After initialization you can change the rotation and position of the output plane by referencing the spriteMaps.position | rotation like a standard mesh. For any other option change (like stageSize, or layerCount etc...) its recommended that you dispose the map and re-initialize with the correct options.

## Examples of Option Properties

base tile used to fill whole grid: <Playground id="#YCY2IL#16" title="Base Tile Used To Fill Whole Grid" description="Simple example of a base tile used to fill a whole grid."/>
outputSize changes size and ratio of plane: <Playground id="#YCY2IL#17" title="OutputSize Changes Size And Ratio Of Plane" description="Simple example showing outputSize changing the size and ratio of a plane."/>
two layers individual sprites in layer 1 on top of base tile in layer 0: <Playground id="#YCY2IL#18" title="Two Layre Individual Sprites" description="Simple example of two layers individual sprites in layer 1 on top of base tile in layer 0."/>
color multiplied by red: <Playground id="#YCY2IL#19" title="Color Multipled By Red" description="Simple example of color multiplied by red."/>
