# Sprites

In this tutorial, we are going to learn how to manipulate Sprites. Sprites are 2D image/animation, and we will use them to display an image with alpha channel. Sprites always face the camera.

Nowadays, sprites are often used to display animated characters, and for particles, and to simulate 3D complex objects like trees.  Think of these as simplified "Entities" that are being all rendered in a single draw call per manager.  

Any grid like implementations (in a 2d or 2.5d game level for instance) that require thousands of sprites to be animated and rendered require a special system called a [Sprite Map ](#sprite-map) which we will cover later.
 *This is available from BJS version 4.1*

Individual sprites are collected together in a single image file called a spritesheet or texture atlas.

* A uniform spritesheet is one where all the sprites are exactly the same size and arranged in order in the file. When you read the term spritesheet in the documentation you can usually assume that it is referring to a uniform spritesheet. A uniform spritesheet is overseen by a [Sprite Manager](#sprite-manager).
* A packed spritesheet is one where the sprites can be of different sizes and often packed in such a way as to minimize the overall size of the file. Usually the full term of _packed spritesheet_ will be used for such a spritesheet. A packed spritesheet is overseen by a [Sprite Packed Manager](#sprite-packed-manager). *This is available from BJS version 4.1*

For sprites the use of one of these managers is mandatory, even for one sprite. They optimize GPU resources by grouping in one place multiple instances of a sprite.

![Elements](/img/how_to/Sprites/08.png)

_Final result_


## Sprite Manager

For sprites of the same size you use

```javascript
// Create a sprite manager
var spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "Assets/Palm-arecaceae.png", 2000, 800, scene);
```

When creating a sprite manager, you have to decide a few parameters:
* Name: a name for this manager.
* The 2D image URL (most of the time, you will want use an image format which contain alpha channel, like .PNG).
* The capacity of this manager : the maximum number of instances in this manager (in our example, we could create 2000 instances of trees).
* The cell size, corresponding to the size of your image, like we’ll see below. Please note that cellSize could be a number or an object made of a width and height properties (Later on you will be able to also specify `spriteManager.cellWidth` and `spriteManager.cellHeight`)
* The actual scene, to which we will add this manager.

To give another example, look at this snippet:
```javascript
var spriteManagerPlayer = new BABYLON.SpriteManager("playerManager","Assets/Player.png", 2, {width: 64, height: 64}, scene);
```

This time, we only want 2 instances, and we said that our sprite’s size is 64x64. Here is what our image looks like:

![Elements](/img/how_to/Sprites/08-1.png)

Each image of a sprite must be contained in a 64 pixel square, no more no less.

## Picking

Sprites can be picked to interact with like in this example: https://www.babylonjs-playground.com/#9RI8CG#0

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

You can also use `multiPickSprite` to get all the sprites under the mouse:

```
var pickResult = scene.multiPickSprite(this.pointerX, this.pointerY);
for (var i = 0; i < pickResult.length; i++) {
    	pickResult[i].pickedSprite.angle += Math.PI / 4;
}
```

By default picking will use the bounding rectangle of a sprite (for performance reason). You can set system to use sprite alpha value instead (coming from its texture). Picking will work in this case only if alpha > 0.5.

Example here: https://www.babylonjs-playground.com/#9RI8CG#123

## Sprite Packed Manager
*This is available from BJS version 4.1*

For sprites of varying sizes you need an image file and a JSON file containing the positional data of the sprites in the packed spritesheet. The image file and the JSON file should have the same name and be in the same folder, eg pack1.png and pack1.json.

For example:
```javascript
var spm = new BABYLON.SpritePackedManager("spm", "pack1.png", 4, scene);
```
The parameters are:
* Name: a name for this manager.
* The 2D image URL (most of the time, you will want use an image format which contain alpha channel, like .PNG).
* The capacity of this manager : the maximum number of instances in this manager (in our example 4).
* The scene, to which we will add this manager.

It is also possible to reference an existing JSON object, of the correct format, directly. In this case the JSON object is passed as an additional parameter. For example:

For example:
```javascript
var spm = new BABYLON.SpritePackedManager("spm", "pack1.png", 4, scene, JSONObject);
```

### Packed Format

![Packed Spritesheet](/img/how_to/Sprites/pack1.png);

The JSON format for the above file is based on that produced using the _TexturePacker_ app with output file framework set to JSON(Hash) and Trim to None and Allow Rotation to Off. For the above packed spritesheet _TexturePacker_ outputs

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

SpritePackedManager only uses the frame property for each sprite so the minimal JSON format is:

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
However, it is recomended that you use the full file format cited above the previous image if you plan to use any SpriteMaps in your project.

## Create A Sprite Instant

For both managers, we can create instances of a sprite linked to a manager. Creating an instance is as simple as:

```javascript
var sprite = new BABYLON.Sprite("sprite", manager);
```

which uses the first sprite on the sheet.

Using a uniform spritesheet and SpriteManager you indicate which sprite to use will cellIndex, counting from the top sprite on the left in order right and down.

For example

```javascript
var sprite = new BABYLON.Sprite("sprite", manager);
sprite.cellIndex = 2;
```

Using a packed spritesheet and SpritePackedManager you can either use cellIndex, as above, or the cellRef, the name of sprite. 

For example
```javascript
var sprite = new BABYLON.Sprite("sprite", manager);
sprite.cellRef = "spot.png";
```

You can change its size, orientation or reflection:
```javascript
sprite.size = 0.3;
sprite.angle = Math.PI/4;
sprite.invertU = -1;
```

Starting with Babylon.js v2.1, you can define the sprite's width and height:
```
sprite.width = 0.3;
sprite.height = 0.4;
```

you can manipulate it like any other meshes:
```javascript
sprite.position.y = -0.3;
```

## Sprite Animation

One of the advantages of sprites is animations. The most straight forward way is to use a uniform spritesheet and SpriteManager. You only have to load one large image file which will contain all animation images, one next to another. Just be careful to respect the pixel size that you have specified in the manager.
For example with this spritesheet of players:

![Elements](/img/how_to/Sprites/08-2.png)

We can use this to animate our players in more than 40 positions, depending upon the situation (walking, jumping,…). 

If you want to begin the animation, simply call this function:
```javascript
player.playAnimation(0, 43, true, 100);
```
The player sprite will be animated from frame 0 to frame 43. The third parameter is indicating if this animation will loop or not, true to loop. The last parameter is the delay between the frames (the smaller it is, the faster the animation).

* [Playground Example Animation of Uniform Sprites](https://www.babylonjs-playground.com/#9RI8CG)

It is also possible to use playAnimation with sprites from a packed spritesheet. It is worth double checking that the sprites to animate are consecutive and in the correct order in the JSON file.

## Snippet server

tarting with Babylon.js v4.2, you can edit sprite managers using the Inspector. You can then save them on Babylon.js snippet server. When you have a snippet Id, you can easily load the manager using the following code:

```
var spriteManagerPlayer = BABYLON.SpriteManager.CreateFromSnippetAsync("GN24VF", scene).then(manager => {
        scene.debugLayer.show();
        scene.debugLayer.select(manager);
 });
```

Live example: https://www.babylonjs-playground.com/#G9VPHQ

## Packed SpriteSheet Playground Examples

* [Playground Example Direct JSON Object Full TexturePacker Format](https://www.babylonjs-playground.com/#K5KTWA)
* [Playground Example Direct JSON Object Minimum Format](https://www.babylonjs-playground.com/#K5KTWA#1)
* [Playground Example JSON File](https://www.babylonjs-playground.com/#K5KTWA#2)
* [Playground Example JSON File Multiple Sprites](https://www.babylonjs-playground.com/#K5KTWA#4)
* [Playground Example JSON File Animated Slide Show](https://www.babylonjs-playground.com/#K5KTWA#5)

* [Playground Example Multi Pick Sprites](https://www.babylonjs-playground.com/#5GX5DZ)

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
