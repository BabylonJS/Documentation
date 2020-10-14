# Sprite Map Options
The options parameter object, when creating a sprite map, contains a number of properties
```javascript
const spriteMap = new BABYLON.SpriteMap(name, atlasJSON, spriteTexture, options, scene);
```

Each of the options properties helps the sprite map reserve the proper data buffers in memory and get the system prepared for display. 

* stageSize: A Vector2 of the number of "tiles" in the system - default : Vector2(1,1)
* outputSize: A Vector2 of size of the output plane in World Units - default : Vector2(1,1)
* outputPosition: A Vector3 of position of the output plane in World Units - default : Vector3.Zero
* outputRotation: A Vector3 of rotation of the output plane in World Units - default : Vector3.Zero
* layerCount: A Integer of the number of "layers" in the system - default : 1
* maxAnimationFrames: The maximum number of frames in any animation on the sheet - default : 0
* baseTile: The frame ID of the initial tile to propagate into the system - default : 0
* flipU: A Boolean flag to trigger flipping the vertical results of the spite after framing calculations - default : false
* colorMultiply: A Vector3 that will multiply the final color value of the map - default : Vector3(1,1,1)

After initialization you can change the rotation and position of the output plane by referencing the spriteMaps.position | rotation like a standard mesh.  For any other option change (like stageSize, or layerCount etc...) its recommended that you dispose the map and re-initialize with the correct options.

## Examples of Option Properties
base tile used to fill whole grid https://www.babylonjs-playground.com/#YCY2IL#16  
outputSize changes size and ratio of plane https://www.babylonjs-playground.com/#YCY2IL#17  
two layers individual sprites in layer 1 on top of base tile in layer 0 https://www.babylonjs-playground.com/#YCY2IL#18  
color multiplied by red  https://www.babylonjs-playground.com/#YCY2IL#19



## SpriteMap Animations
Now comes the time where you want to initialize animations for the tiles in the system.  One limitation is that you can have only one animation sequence assigned per frame.  This does not limit you though, as you can make duplicate frame references in your JSON file and then just assign a different animation to the added frame.  You do currently have to "compose" the animations though similar to creating the tilemaps.  This does not have an export option as of yet.

These animations are unique from the "film strip" style that the other Sprite systems use.  You can assign any frame as the next frame in the sequence and have its own independent timing per animation frame.  The terms of frame and animation frame are not to be confused.  Frame is a reference to the position of the sprite on the atlas, and the animation frame is the specific frame that is being displayed at that moment, dictated by the originating frame (the one that has the animation assigned to it).  All animations are assumed to be looping though they may all have different timings globally and per animation frame.

To create an animation assign each cell.
```javascript
spriteMap.addAnimationToTile(frameID, animationFrame, nextFrameID, animationFrameDisplayTiming, globalSpeed)
```
* frameID: Integer ID of the sprite frame to assign the animation to.
* animationFrame: Integer ID of the animation frame to assign data to.
* nextFrameID:  Integer ID of the next sprite frame in the animation.
* animationFrameDisplayTiming: Float between 0-1 of when the animation frame will be displayed.  This will be described more below.
* globalSpeed: Float scalar of the speed of the animation.

Each Sprite Map has a timing value being passed to the shader that displays it.  In the shader it modulates the time value between 0-1 essentially looping the time at a set rate.  Each tile looks to see if it has animation data assigned and then check if it is on the correct animation frame for that time.  This is determined by checking if the animation frames display timing value is below the modulated time.  This time value is further controlled by scalar that can speed up or slow down the animation across all its animation frames.

Fortunately you only have to compose the animations once if multiple SpriteMaps use the same data, you can just pass the animation map to the system directly from another and it will propagate all the animations over.

```javascript
spriteMap1.animationMap = spriteMap0.animationMap
```

I know this might sound complex but take a look at the examples for a better understanding.

## SpriteMap Playground Examples

* [Full SpriteMap Example](https://playground.babylonjs.com/#ARLADE)
