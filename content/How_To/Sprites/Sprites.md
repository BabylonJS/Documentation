

## Sprite Map 
*This is available from BJS version 4.1*

Certain situations are outside of the scope of the standard Sprite Manager.   These are generally when you need to render thousands (dare I say millions?) of animated sprites on screen.  Usually situations like this are reserved for 2d game design, but there are other situations where this would be beneficial.  For now we will focus on specifically the topic of 2d and 2.5d level design.  The only current limitation of this system is that the positions of the sprites are static to a specific grid dictated by the Sprite Maps initializing parameters. 

 The SpriteMap is displayed on a standard Plane Mesh and has the ability to be transformed in 3d space.  Each SpriteMap is one draw call and reserves a minimum of 3 texture buffers in memory, more depending on the number of layers in the system.

It uses the same JSON formats as the Packed Manager.  But does support the options for rotation, extrude and padding.  *Soon the trim support will be functional as well*

To create a SpriteMap is simple:
```javascript
var spriteMap = new BABYLON.SpriteMap(name, atlasJSON, spriteTexture, options, scene);
```
The parameters are:
* Name: a name for this Sprite Map.
* atlasJSON: The atlas JSON that the Sprite Map uses.
* spriteTexture: The atlas Texture that the Sprite Map uses.
* options: The initializing options.
* scene: The scene, to which we will add this map.

There are several parameters you can pass to the options object, each one will help the Sprite Map reserve the proper data buffers in memory and get the system prepared for display. 

These options are:
* stageSize: A Vector2 of the number of "tiles" in the system.
	 - default : Vector2(1,1)
* outputSize: A Vector2 of size of the output plane in World Units.
	 - default : Vector2(1,1)
* outputPosition: A Vector3 of position of the output plane in World Units.
	 - default : Vector3.Zero
* outputRotation: A Vector3 of rotation of the output plane in World Units.
	 - default : Vector3.Zero
* layerCount: A Integer of the number of "layers" in the system.
	 - default : 1
* maxAnimationFrames: The maximum number of frames in any animation on the sheet.
	 - default : 0
* baseTile: The frame ID of the initial tile to propagate into the system.
	- default : 0
* flipU: A Boolean flag to trigger flipping the vertical results of the spite after framing caluations.
	- default : false
* colorMultiply: A Vector3 that will multiply the final color value of the map.
	- default : Vector3(1,1,1)

After initialization you can change the rotation and position of the output by referencing the spriteMaps.position | rotation like a standard mesh.  Any other option change (like stageSize, or layerCount etc...) its recommended that you dispose the map and re-initialize with the correct options.

## Sprite Map Tiles
Each Sprite map is comprised of a number of tiles of equal size, splitting the output plane into a grid.  

To change what tile is at a certain location we call this method:
```javascript
spriteMap.changeTiles(layerID, tileID, frameID)
```
The parameters are:
* layerID: Integer of the target layer of the system.
* tileID: Vector2| Vector2[] of the target tile of the layer.
* frameID: Integer frame ID of the sprite you want to change to.

If you are going to make multiple changes at once add all the tileID Vector2's of like frame ids into an array and pass that to the tileID parameter.  Otherwise the buffers have to be updated for each tile instead of in batches which is not optimal. 

It is recommended that you find a single transparent pixel on your Texture file, or create a "blank tile" in your JSON file, so you can have fully transparent tiles when the cell needs to be blank.  

This is easy to do in the full example below I just added:
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
to the top of the JSON frames Object which points to a single pixel on the Texture file.  In the shader this is scaled up to the correct Size and displayed then in the entire tile as transparent data.

### Saving Tile Maps
After you have created a SpriteMap that has the correct tile positions, you can export and save this composition for later use.  When loading the ".tilemaps" file back into the system you must be sure that the SpriteMap you are loading it to has the correct layerCount otherwise you will drop webGL errors.

To save:
```javascript
spriteMap.saveTileMaps()
```
To Load:
```javascript
spriteMap.saveTileMaps(url)
```
* url: String of the location of the .tilemaps file.

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


## Next Step
Having learned about sprites, it’s time to move on to use them in a classic effect in 3D : [particles](/babylon101/Particles).

# Further Reading

[Mesh Overview](/features/Shapes)
