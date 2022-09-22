---
title: The Player Camera
image:
description: Dive into some deeper game creation methods and techniques.
keywords: guided learning, create a game, game, player camera
further-reading:
video-overview:
video-content:
---

## Summary

For this game, I wanted to create a third person camera that would follow the character, but still allow them to move freely and jump within camera view. In the beginning I struggled to find a good camera movement and cycled between different camera types and parenting hierarchies. Eventually, I decided to use the Universal Camera as it allowed for the most freedom in manipulating the camera view while still being able to lock onto the character mesh. I also came across the blog posts on [suzy cube's](http://louardongames.blogspot.com/2016/10/lessons-from-suzy-cube-camera-system.html) camera system. I decided to give it a try since the system allowed for different manipulations of the camera while still following the character.

## Camera Hierarchy

Previously, in [Simple Game State](/guidedLearning/createAGame/simpleGameState#character-controller) we made a \_setupPlayerCamera. Here is where we'll be creating our camera hierarchy.

```javascript
private _setupPlayerCamera(): UniversalCamera {
    //root camera parent that handles positioning of the camera to follow the player
    this._camRoot = new TransformNode("root");
    this._camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
    //to face the player from behind (180 degrees)
    this._camRoot.rotation = new Vector3(0, Math.PI, 0);

    //rotations along the x-axis (up/down tilting)
    let yTilt = new TransformNode("ytilt");
    //adjustments to camera view to point down at our player
    yTilt.rotation = Player.ORIGINAL_TILT;
    this._yTilt = yTilt;
    yTilt.parent = this._camRoot;

    //our actual camera that's pointing at our root's position
    this.camera = new UniversalCamera("cam", new Vector3(0, 0, -30), this.scene);
    this.camera.lockedTarget = this._camRoot.position;
    this.camera.fov = 0.47350045992678597;
    this.camera.parent = yTilt;

    this.scene.activeCamera = this.camera;
    return this.camera;
}
```

Here's a breakdown of the hierarchy for the camera system:

-   \_camRoot: TransformNode
    -   \_yTilt: TransformNode
        -   camera: UniversalCamera

**\_camRoot** is our root parent that handles the overall positioning of our camera. It's in charge of updating its position to follow the player's position and is located at the center of the player.

**\_yTilt** is the rotation along the x-axis of our camera. If we need to tilt our camera up or down, this will handle those rotations.

**camera** is the actual camera object that controls what we see on the screen

The suzy cube blog posts go into more detail, but this is the extent of what I needed for my game.

## Update Camera

Since we're moving the camera's position to follow the player, we'll need to update the camera.

I've added 2 (half the height) to the mesh's y position since the origin of my mesh is actually at the bottom. You won't need to do this if your mesh's origin is centered already.

```javascript
private _updateCamera(): void {
    let centerPlayer = this.mesh.position.y + 2;
    this._camRoot.position = Vector3.Lerp(this._camRoot.position, new Vector3(this.mesh.position.x, centerPlayer, this.mesh.position.z), 0.4);
}
```

In order to update our camera's position we want to lerp from its current position to the new position. Lerping allows for a smooth transition between positions rather than an instant repositioning of the camera.

## Resources

**Files Used:** [characterController.ts](https://github.com/BabylonJS/SummerFestival/blob/master/src/characterController.ts)

### External

[Suzy Cube's Camera System](http://louardongames.blogspot.com/2016/10/lessons-from-suzy-cube-camera-system.html)
