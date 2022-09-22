---
title: Character Movement Part 1
image: 
description: Dive into some deeper game creation methods and techniques.
keywords: guided learning, create a game, game, character movement
further-reading:
video-overview:
video-content:
---

## Summary
The first step I took towards making the game was to figure out how movement would work. My past experience with 3D games pushed me towards thinking that movement would be the most difficult part of the development process, so I wanted to make sure to focus on that early on. Since I was just getting started, I knew I needed to get some prototyping in for it, so I started off by making a playground to test out simple walking, jumping, and dashing: [early prototype](https://playground.babylonjs.com/#UP84Y8#10)

A few things you can see from this is:
1. The player is able to walk through the platform 
2. The player falls off of the platform before the mesh is "completely" off of the platform
3. And most importantly, when you jump, the player lands partially inside of the ground

This prototype underwent a lot of transformations to get to the point that it's at for the final game! For the final version, I've implemented a capsule collider + simulated rigidbody by using Babylon's collision physics and raycasting for ground detection.

For part 1 we'll be going over how to detect inputs and how to get simple walking/running movement. Links to the complete files are below, but I'll be referencing certain parts that are important.

In order to achieve certain character movements, I referenced a few different Unity tutorials as well as game dev blog posts that will be linked below.

## Input Controller
For this part of the tutorial, we'll be going over the basics for movement with keyboard controls. You'll want to create a file called **inputController.ts**. Here we'll be creating a [PlayerInput](https://github.com/BabylonJS/SummerFestival/blob/master/src/inputController.ts#L4) class that will handle all of the inputs for our game.
```javascript
constructor(scene: Scene) {
    scene.actionManager = new ActionManager(scene);

    this.inputMap = {};
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    scene.onBeforeRenderObservable.add(() => {
        this._updateFromKeyboard();
    });
}
```
Within our constructor we're creating an action manager to register keydown and keyup events and using the inputMap to store whether the key was down. We're then telling the scene to call the [_updateFromKeyboard](https://github.com/BabylonJS/SummerFestival/blob/fc5435921f3aecdcc84d9d3f44d812ad5a4368a7/src/inputController.ts#L58) function before the scene renders.

```javascript
private _updateFromKeyboard(): void {
    if (this.inputMap["ArrowUp"]) {
        this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
        this.verticalAxis = 1;

    } else if (this.inputMap["ArrowDown"]) {
        this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
        this.verticalAxis = -1;
    } else {
        this.vertical = 0;
        this.verticalAxis = 0;
    }

    if (this.inputMap["ArrowLeft"]) {
        this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
        this.horizontalAxis = -1;

    } else if (this.inputMap["ArrowRight"]) {
        this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
        this.horizontalAxis = 1;
    }
    else {
        this.horizontal = 0;
        this.horizontalAxis = 0;
    }
}
```
Inside of **_updateFromKeyBoard**, we're checking for whether our arrow keys have been pressed by looking at the value that's in our inputMap. The up and down arrows are checking the vertical inputs which correspond to forward and backwards movement. The left and right arrows are checking for horizontal movement. As we press the key, we want to lerp the value so that it has a smoother transition. We are doing a couple different things here:
1. As you hold the key, it gradually increases the value to 1 or -1. 
2. We're keeping track of which axis/direction we were moving in
3. If we don't detect any inputs in an axis, we set both the direction and value to 0

Now, in order to use this *PlayerInput*, we'll need to create one in **_goToGame**:
```javascript
//--INPUT--
this._input = new PlayerInput(scene); //detect keyboard/mobile inputs
```
This means we will also need to update the line where we create our Player to take in the input **_initializeGameAsync**:
```javascript
//Create the player
this._player = new Player(this.assets, scene, shadowGenerator, this._input);
```

## Basic Movement Setup
Now that we can detect our inputs, we need to implement what to do when those inputs are detected. We'll be focusing on the [updateFromControls](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L158) function inside of **characterController.ts**.

### Input
```javascript
this._moveDirection = Vector3.Zero(); // vector that holds movement information
this._h = this._input.horizontal; //x-axis
this._v = this._input.vertical; //z-axis
```
First, we set up a Vector3 to use as our movement vector. This will be reset every frame. Then we grab our inputs from the PlayerInput class.
```javascript
//--MOVEMENTS BASED ON CAMERA (as it rotates)--
let fwd = this._camRoot.forward;
let right = this._camRoot.right;
let correctedVertical = fwd.scaleInPlace(this._v);
let correctedHorizontal = right.scaleInPlace(this._h);

//movement based off of camera's view
let move = correctedHorizontal.addInPlace(correctedVertical);
```
Now, since we want the player to move in relation to the camera, we need to grab the forward and right vectors of the camera. We then scale them by our inputs. We now have a new movement vector called move that's the combined vertical and horizontal movement. The reason why I've implemented this is because the camera view will be rotating at certain areas of the map and if the player was moving to the right as the camera rotated, we want them to be able to continue moving right even as the orientation changes. 
```javascript
//clear y so that the character doesnt fly up, normalize for next step
this._moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);
```
Here, we are normalizing the vector and setting the y value to 0 since we only care about x-axis and z-axis movement.
```javascript
//clamp the input value so that diagonal movement isn't twice as fast
let inputMag = Math.abs(this._h) + Math.abs(this._v);
if (inputMag < 0) {
    this._inputAmt = 0;
} else if (inputMag > 1) {
    this._inputAmt = 1;
} else {
    this._inputAmt = inputMag;
}
```
Then, we want to find the magnitude of what our combined horizontal and vertical movements give us and clamp it to be a maximum of 1 since we don't want to move faster if we're moving diagonally.
```javascript
//final movement that takes into consideration the inputs
this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt * Player.PLAYER_SPEED);
```
We then scale our final *_moveDirection* by that amount multiplied by the speed we want the player to move at.

### Updating the Game
In order to actually see our player move, we'll need to do a few things:
1. Before each render, we need to make sure that we're updating our character. To do this, we first need to activate our player in **activatePlayerCamera**:
```javascript
public activatePlayerCamera(): UniversalCamera {
    this.scene.registerBeforeRender(() => {

        this._beforeRenderUpdate();
        this._updateCamera();

    })
    return this.camera;
}
```
What this does is, before each render, calls our character update function (_beforeRenderUpdate) and calls our camera update function (_updateCamera).
2. **_beforeRenderUpdate** for now will just involve updating the movement
```javascript
private _beforeRenderUpdate(): void {
    this._updateFromControls();
    //move our mesh
    this.mesh.moveWithCollisions(this._moveDirection);
}
```
Here we are also calling `mesh.moveWithCollisions` that uses the _moveDirection Vector3 that we created. We will update this in part 2 to account for gravity.
3. Call **activatePlayerCamera** in **_initializeGameAsync** after we call our Player Constructor.
```javascript
//...player constructor
const camera = this._player.activatePlayerCamera();
```

## Rotation
Now, how do we get our player to rotate towards the direction it's moving? This is where we're checking our input axes (**_updateFromControls**).
```javascript
//check if there is movement to determine if rotation is needed
let input = new Vector3(this._input.horizontalAxis, 0, this._input.verticalAxis); //along which axis is the direction
if (input.length() == 0) {//if there's no input detected, prevent rotation and keep player in same rotation
    return;
}
```
We first grab the input axes and check whether there were any inputs. This will determine whether or not we continue to calculate the rotation of the character. The reason why we want to return if there are no inputs is because the player will re-adjust their rotation to face forwards again if we don't explicitly tell it not to.
```javascript
//rotation based on input & the camera angle
let angle = Math.atan2(this._input.horizontalAxis, this._input.verticalAxis);
angle += this._camRoot.rotation.y;
let targ = Quaternion.FromEulerAngles(0, angle, 0);
this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 10 * this._deltaTime);
```
Here we are calculating the angle to move the player to based off of the camera's current angle. Then we are slerping to that new target angle by a value of 10 x *this._deltaTime* so that we have a smooth transition as we rotate.
- [this._deltaTime](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L159) is the amount of time in between frames (ms), so we divide by 1000 to get seconds.

At this point, if we run the project, we should be able to move around & see our player rotate directions!

### Raycasts

#### Raycast

Raycasting is going to be our main method of detecting the ground beneath the character. First, we need a function [_floorRaycast](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L278):
```javascript
let raycastFloorPos = new Vector3(this.mesh.position.x + offsetx, this.mesh.position.y + 0.5, this.mesh.position.z + offsetz);
let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);
```
We want to send a single raycast downwards from the center of the character plus some offset if passed in, 0.5 above the bottom of the character (since the origin is at the bottom of my character mesh).
```javascript
let predicate = function (mesh) {
    return mesh.isPickable && mesh.isEnabled();
}
let pick = this.scene.pickWithRay(ray, predicate);
```
Then, we want to define what can be picked by our raycast. This was important to have since I created custom collision meshes for the parts of the environment that had more complex geometry. These meshes are invisible, but should still be pickable. We start checking whether our raycast has hit anything by using pickWithRay.
```javascript
if (pick.hit) { 
    return pick.pickedPoint;
} else { 
    return Vector3.Zero();
}
```
If our ray has hit anything, return the pickedPoint, a Vector3. Else, we return the zero vector.

#### Grounded

The [_isGrounded](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L298) function checks whether or not the player is on a ground by sending a raycast.
```javascript
if (this._floorRaycast(0, 0, 0.6).equals(Vector3.Zero())) {
    return false;
} else {
    return true;
}
```
The raycast that we send is at the center of our character and extends 0.1 past the bottom. We want it to extend a little further so that it detects the ground before the player has a chance to intersect it.

#### Gravity

Now that we're able to detect the ground, we need to apply gravity to the player to keep them grounded! The [_updateGroundDetection](https://github.com/BabylonJS/SummerFestival/blob/a0abccc2efbb7399820efe2e25f53bb5b4a02500/src/characterController.ts#L355) will handle everything that has to do with gravity.
```javascript
if (!this._isGrounded()) {
    this._gravity = this._gravity.addInPlace(Vector3.Up().scale(this._deltaTime * Player.GRAVITY));
    this._grounded = false;
}
```
If we're not grounded, we want to add to our gravity and set our* _grounded* flag to false. Player.GRAVITY is a negative value, which is what makes our overall gravity point downwards.
```javascript
//limit the speed of gravity to the negative of the jump power
if (this._gravity.y < -Player.JUMP_FORCE) {
    this._gravity.y = -Player.JUMP_FORCE;
}
this.mesh.moveWithCollisions(this._moveDirection.addInPlace(this._gravity));
```
We want make sure that we cap the value of gravity so that while we're in the air, the character doesn't infinitely increase its downward acceleration. Then we apply gravity to our player by adding it to the current *_moveDirection* and moving the player by that vector.

```javascript
if (this._isGrounded()) {
    this._gravity.y = 0;
    this._grounded = true;
    this._lastGroundPos.copyFrom(this.mesh.position);
}
```
If the player is grounded, we want to set the gravity to 0 to keep our player grounded and set our *_grounded* flag to true. In addition, we'll update our *_lastGroundPos* to our current position to keep track of our last safe grounded position (we'll be using this later on).

Lastly, since we're now accounting for gravity and calling `mesh.moveWithCollisions` here, we can remove our call in **_beforeRenderUpdate** and replace it with a call to **_updateGroundDetection**:
```javascript
private _beforeRenderUpdate(): void {
    this._updateFromControls();
    this._updateGroundDetection();
}
```

Now if you run the game, our player falls to the ground, and can move around!

## Resources

### Files Used:
- [inputController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/inputController.ts)
- [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/characterController.ts)
- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/app.ts)

### Follow Along:
- [inputController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/characterMove1/inputController.ts)
- [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/characterMove1/characterController.ts)
- [app.ts](https://github.com/BabylonJS/SummerFestival/blob/master/tutorial/characterMove1/app.ts)

### External
[Unity 3D 8 Directional Character System](https://www.youtube.com/watch?v=cVy-NTjqZR8)  
[AstroKat: Moving Kat](https://www.patreon.com/posts/21343562)  
[How to Make a Dash Move in Unity](https://www.youtube.com/watch?v=w4YV8s9Wi3w)
