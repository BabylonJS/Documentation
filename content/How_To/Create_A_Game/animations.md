# Summary
For this game, I made all of the animations myself in blender. In the past, I've had difficulty getting the animations to work correctly in Unity while using my own character rig with mixamo animations. So, I decided to learn how to animate them myself. The meshes are exported as glTF/.glb.

If you'd like to see the animations themselves, you can drag the .glb files into the [Sandbox](https://sandbox.babylonjs.com/).

# Character (Rigged)
# Setting up Animations
When you import a mesh with animations, they will be a part of the result`.animationGroups`. We just need to return this along with the mesh import in [loadCharacter](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/app.ts#L897).

In the constructor of our Player class, we'll be storing each animationGroup that was imported.

```javascript
this._idle = assets.animationGroups[1];
this._jump = assets.animationGroups[2];
this._land = assets.animationGroups[3];
this._run = assets.animationGroups[4];
this._dash = assets.animationGroups[0];
```
This way we can access them through the class variables. AnimationGroups are usually sorted alphabetically, but if you're not sure of the order you can check in the inspector.

Once we've done this, we can set up the animations in [_setUpAnimations](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L236) which is also called in the Player constructor.
```javascript
this.scene.stopAllAnimations();
this._run.loopAnimation = true;
this._idle.loopAnimation = true;
//initialize current and previous
this._currentAnim = this._idle;
this._prevAnim = this._land;
```
1. We want to stop any and all animations.
2. Set which animations are looping.
3. Initialize our current and previous animations.

# Animating the Player
In order to actually animate the player, I created an [_animatePlayer](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L247) function that checks for different states of the player.
```javascript
if (!this._dashPressed && !this._isFalling && !this._jumped 
    && (this._input.inputMap["ArrowUp"]
    || this._input.inputMap["ArrowDown"] 
    || this._input.inputMap["ArrowLeft"]
    || this._input.inputMap["ArrowRight"])) {

    this._currentAnim = this._run;
} else if (this._jumped && !this._isFalling && !this._dashPressed) {
    this._currentAnim = this._jump;
} else if (!this._isFalling && this._grounded) {
    this._currentAnim = this._idle;
} else if (this._isFalling) {
    this._currentAnim = this._land;
}
```
It sets the current animation to the corresponding animationGroup for the state.
The different states our character can be in are:
1.  **Running**
    - As long as movement inputs are detected, and we're not doing an action, then we play the running animation.
2. **Jumping**
    - The jumping animation is triggered by a combination of flags:
```javascript
if (this._input.jumpKeyDown && this._jumpCount > 0) {
    this._gravity.y = Player.JUMP_FORCE;
    this._jumpCount--;

    //jumping and falling animation flags
    this._jumped = true;
    this._isFalling = false;
}
```
Because the jumping and landing animations are separate, so we need to know when exactly the jump phase is and when the landing phase starts.

In the `if(this._isGrounded)` check, we want to reset our animation flags since we're no longer falling and have no longer jumped.
```javascript
//jump & falling animation flags
this._jumped = false;
this._isFalling = false;
```
3. **Idle** 
    - If we're not in any other state and we're grounded, then we're idle.
4. **Falling**
```javascript
//cue falling animation once gravity starts pushing down
if (this._gravity.y < 0 && this._jumped) {
    this._isFalling = true;
}
```
We do this by checking:
    1. That we're currently falling, so our movement is downwards (the sign of gravity here actually correlates to the direction we're moving).
    2. That we've jumped, so we're in the air.
*_jumped* is checked specifically because this falling animation was intended for the landing of the jump, but if you have a falling animation that can be used for any type of falling, then you could probably remove this check.
5. **Dashing**
    - You'll notice that the dash animation is not here. This is because it's a lot easier to include it where the [dash action](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L170) takes place.
```javascript
if (this._input.dashing && !this._dashPressed && this._canDash && !this._grounded) {
    this._canDash = false;
    this._dashPressed = true;

    this._currentAnim = this._dash;
}
```
As soon as we detect that the dash has happened, we set the current animation.

At the end of **_animatePlayer**, we need to check to make sure that we're only calling the current animation once. We do this by making sure that the current and previous animations are not the same, so that the animation actually play out its duration. (This is fine because we've already set which ones are looping, so when they play once, they'll keep looping).
```javascript
if(this._currentAnim != null && this._prevAnim !== this._currentAnim){
    this._prevAnim.stop();
    this._currentAnim.play(this._currentAnim.loopAnimation);
    this._prevAnim = this._currentAnim;
}
```
# Playing Animations
Now that we have the animations hooked up, we need to call **_setUpAnimations** in the *Constructor* and **_animatePlayer** in *_beforeRenderUpdate*

# Mesh
The other meshes in my game that used animations were the lanterns.

The setup for these was a little different because I had to somehow clone the animations as well. I used [Demystifying Animation Groups](https://www.youtube.com/watch?v=BSqxoQ-at24&t=802s) to learn how to extract and clone the animationGroups.
# Importing
The animation groups get imported along with the mesh. Returning to [_loadAsset](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/environment.ts#L100) in the Environment class, we need to extract the animation from the lantern.
```javascript
const importedAnims = res.animationGroups;
let animation = [];
animation.push(importedAnims[0].targetedAnimations[0].animation);
importedAnims[0].dispose();
//create new animation group
let animGroup = new AnimationGroup("lanternAnimGroup");
animGroup.addTargetedAnimation(animation[0], res.meshes[1]);
return {
        //..other meshes,
        animationGroups: animGroup
        }
```
What we do is, from the imported animationGroup, we extract the animation. Then we create a new animation that sets the mesh to its targeted animation. In the video, this was useful because the cannon mesh had two animations each belonging to a different mesh. Even though we have only 1 animation and 1 mesh, it's good to have this structure in case we wanted to add another animation later on.

# Cloning & Setting Up
Similar to how we [cloned our lantern meshes](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/environment.ts#L66), we need to clone the animationGroups so that they are paired with their corresponding mesh.
```javascript
//Animation cloning
let animGroupClone = new AnimationGroup("lanternAnimGroup " + i);
animGroupClone.addTargetedAnimation(assets.animationGroups.targetedAnimations[0].animation, lanternInstance);
let newLantern = new Lantern(this._lightmtl, lanternInstance, this._scene, assets.env.getChildTransformNodes(false).find(m => m.name === "lantern " + i).getAbsolutePosition(), animGroupClone);
```
We create a new animation group for each lantern, and use the animationGroup that we got from the import, then attach it to that specific lantern instance. This animGroupClone is what we pass to the Lantern Constructor.
```javascript
assets.animationGroups.dispose();
```
After we're done setting up all the lanterns, we can dispose of the original animationGroup, like how we did for the original lantern mesh.
# Playing
Playing the animation is really simple since it's non-looping. Whenever the lantern is lit, we want to play the animation in [setEmissiveTexture](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/lantern.ts#L47) since this is where we're doing all the "lighting" effects.

# Further Reading
**Previous:** [Game GUI](/how_to/page11)  
**Next:** [Particle Systems](/how_to/page13)  
[Animations](/babylon101/animations)

# Resources
**Files Used:**  
- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/app.ts)
- [environment.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/environment.ts)
- [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/characterController.ts)
- [lantern.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/lantern.ts)
