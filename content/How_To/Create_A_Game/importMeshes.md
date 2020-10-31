Importing meshes is actually a really simple process. It's just what you do with those meshes afterwards that can get tricky!

The meshes for the environment and player will be linked below. We'll make a new folder called models inside of the public folder.

# Environment Mesh
Previously, we created an [Environment class](/how_to/page10#environment). In order to import our meshes, we'll neeed to add a [_loadAsset](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/environment.ts#L100) function. 
# _loadAsset
```javascript
const result = await SceneLoader.ImportMeshAsync(null, "./models/", "envSetting.glb", this._scene);

let env = result.meshes[0];
let allMeshes = env.getChildMeshes();
```
We want to first import the mesh for the environment, then grab the root and extract all of the meshes from that root.
```javascript
return {
    env: env, //reference to our entire imported glb (meshes and transform nodes)
    allMeshes: allMeshes // all of the meshes that are in the environment
}
```
Then, we return these objects to complete our environment set up.
# load
Now we need to update the **load** function to call **_loadAsset**. We use await to tell it that we'll be doing something with the returned value. Once our meshes have been imported, we want to set all of the necessary flags:
```javascript
const assets = await this._loadAsset();
//Loop through all environment meshes that were imported
assets.allMeshes.forEach(m => {
    m.receiveShadows = true;
    m.checkCollisions = true;
});
```
We loop through all of the meshes and do have to manually set the flag to check for collisions as well as whether they can receive shadows. The only mesh in this game that actually casts a shadow is the player (for performance reasons). At this point this is all we really need to do with our assets.

If we go back to [_setUpGame](/how_to/page10#environment), this is where we loaded our environment assets.
```javascript
//--LOAD ASSETS--
await this._environment.load(); //environment assets
//...loading character asset
```
Notice how we are using *await* here. This is because we want to wait for the environment to be fully loaded and set up before we try to import our character mesh.

# Character Mesh
Loading the character assets should also begin inside of _setUpGame. We want to make sure that we start loading our meshes before we actually go to the game state.

Recall, we loaded our character assets in [_setUpGame](/how_to/page10#character-controller).
```javascript
//...loaded envrionment assets
await this._loadCharacterAssets(scene);
```
Again, here we are awaiting in order to ensure that the asset is fully imported and set up. This is **SUPER** important because our player constructor actually depends on some of the environment assets being loaded.

Previously in [_loadCharacterAssets](/how_to/page10#loading-assets), we set up the character mesh system.
The function's purpose is to call loadCharacter(), store our assets, and then return the results to signify that it's complete.

In order to load our assets, we just need to modify the body portion of our character assets. Instead of having primitives for our body, we'll be using the imported mesh.

```javascript
return SceneLoader.ImportMeshAsync(null, "./models/", "player.glb", scene).then((result) =>{
    const root = result.meshes[0];
    //body is our actual player mesh
    const body = root;
    body.parent = outer;
    body.isPickable = false; //so our raycasts dont hit ourself
    body.getChildMeshes().forEach(m => {
        m.isPickable = false;
    })

    return {
        mesh: outer as Mesh,
    }
});
```
Here is where we actually bring in the character mesh, and the result of this import is what gets returned (the box collider parented to the character mesh). The reason why we loop through the meshes here is because if a glTF has multiple materials used, it will treat them as separate meshes. 

Now that we've got our character mesh imported, we can place our player's light at the right spot!
```javascript
this.scene.getLightByName("sparklight").parent = this.scene.getTransformNodeByName("Empty");
```
In the Player Constructor, we just need to set its parent to the TransformNode that was placed in the character's blender file.

Lastly, since we've brought in our new environment and character mesh, we need to re-position the player. I've created a special TransformNode for this inside of the player mesh itself. So, where we were setting the character position previously, we just need to change it to use this TransformNode:
```javascript
scene.getMeshByName("outer").position = scene.getTransformNodeByName("startPosition").getAbsolutePosition(); //move the player to the start position
```

**Now**, you'll notice that when we run the game, we get an error! This is because we aren't waiting for the meshes to finish loading before going to the game (if we immediately click next). So, this is where we start modifying **goToCutScene** to actually start awaiting **_setUpGame()**:
```javascript
await this._setUpGame().then(res =>{
    finishedLoading = true;
    this._goToGame();
});
```
Instead of calling _goToGame when we click the next button, we can call it once the assets are done loading! This will now automatically take us to the game state.

When you run the game now, you'll see the environment and character meshes in their raw form: all meshes imported are visible, and the character by default plays its animationGroups.

# Further Reading
**Previous:** [Character Movement Part 2](/how_to/page4)   
**Next:** [Lanterns](/how_to/page7)

# Resources
**Files Used:**  
- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/app.ts)
- [environment.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/environment.ts)
- [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/characterController.ts)

**Follow Along:** 
- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/importMeshes/app.ts)
- [environment.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/importMeshes/environment.ts)
- [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/importMeshes/characterController.ts)
- [environment model](https://github.com/BabylonJS/SummerFestival/blob/master/public/models/envSetting.glb)
- [player model](https://github.com/BabylonJS/SummerFestival/blob/master/public/models/player.glb)
