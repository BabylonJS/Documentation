# Sprite Map Animations
A sprite map animation is created, as you would expect, from a sequence of frameIDs from the frames array. The sequence does not have to be in consecutive order of frameIDs. For example, animation frame 0 could draw the sprite from frameID 19 and animation frame 1 could draw the sprite from frameID 6. Also each animation frame can have its own independent timing.

The terms of frame and animation frame are not to be confused.  Frame is a reference to the position of the sprite on the atlas, and the animation frame is the specific frame that is being displayed at that moment

One limitation is that you can have only one animation sequence assigned per frame.  This does not limit you though, as you can make duplicate frame references in your JSON file and then just assign a different animation to the added frame.

All animations are assumed to be looping though they may all have different timings globally and per animation frame.

![sprite map animation](/img/how_to/Sprites/water_anim.png)

Lets assume their frameIDs in order are 24, 25, 26, 27, 28, 29, 30 and 31 and we want to play them in this order. We start with frameID 24 and add this to the tiles, or rather any tile that contains frameID 24 will show the animation.

In order for the animation to run we must set the *maxAnimationFrames* options property. In this case their are 8 frames

```javascript
let backgroundSize = new BABYLON.Vector2(1, 1);
let background = new BABYLON.SpriteMap('background', atlasJSON, spriteSheet, {
    stageSize: backgroundSize,
    maxAnimationFrames:8,
    flipU: true
    },
    scene); 

background.changeTiles(0, new BABYLON.Vector2(0, 0), 24); // set the single tile to frameID 24
```

We want the animation to change frames every eighth of a second, 1 / 8.  
After 1 eighth of a second we want frameID 24 to become frameID 25,  
after 2 eights of a second we want frameID 24 to become frameID 26,  
after 3 eights of a second we want frameID 24 to become frameID 27,  
and so on

We can slow or speed up the timing change by adding a speed factor, giving

```javascript
let eighth = 1 / 8
let speed = 0.005
background.addAnimationToTile(24, 0, 25, eighth * 1, speed);
background.addAnimationToTile(24, 1, 26, eighth * 2, speed);
background.addAnimationToTile(24, 2, 27, eighth * 3, speed);
background.addAnimationToTile(24, 3, 28, eighth * 4, speed);
background.addAnimationToTile(24, 4, 29, eighth * 5, speed);
background.addAnimationToTile(24, 5, 30, eighth * 6, speed);
background.addAnimationToTile(24, 6, 31, eighth * 7, speed);
background.addAnimationToTile(24, 7, 24, 1, 	 	 speed);
```

Single tile animation https://www.babylonjs-playground.com/#YCY2IL#26

More generally to create an animation use
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
