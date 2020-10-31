One straight forward method of combining a number of clips to form a cartoon is to give start times to each animation clip.

# Design

## Overview

The camera shows a building with a door. The camera moves closer to the door and stops. The door swings open and the camera enters the room. As the camera enters the room
lights come on in the room. The door closes and the camera sweeps around the room.

Since the aim is to show how the movie clip is made the room and door will be simply made with meshes with no textures.

## Performers

Camera - Universal  
Door - Hinged on right hand side, opening inwards  
Spot Lights - with spheres to show position

## Sequence Timetable

![Time Table](/img/how_to/Animations/seq1.jpg)

For each performer you create an animation with key points for each timed event.

## Animations

_For the Camera_  
Moving the camera changes the position (a vector3) of the camera. Sweeping the camera around is a rotation around the y axis (a float).

Since an animation can only change one property two animations are needed for the camera.

Moving the camera the key points will be at time 0 the camera will start away from the building and move towards and down until it is just outside the door at time 3 seconds.  
The camera will hold its position for 2 seconds as the door opens then at time 5 seconds will move forward into the room at an angle away from the door, stopping at time 8 seconds.

There will be no rotation of the camera for 9 seconds then camera will take until time 14 seconds to rotate 180 degrees to face the door.

Key values for the camera will be its positions at frames 0, 3, 5 and 8 seconds and its rotation at 0, 9 and 14 seconds.

```javascript
//for camera move forward
var movein = new BABYLON.Animation(
  "movein",
  "position",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
);

var movein_keys = [];

movein_keys.push({
  frame: 0,
  value: new BABYLON.Vector3(0, 5, -30)
});

movein_keys.push({
  frame: 3 * frameRate,
  value: new BABYLON.Vector3(0, 2, -10)
});

movein_keys.push({
  frame: 5 * frameRate,
  value: new BABYLON.Vector3(0, 2, -10)
});

movein_keys.push({
  frame: 8 * frameRate,
  value: new BABYLON.Vector3(-2, 2, 3)
});

movein.setKeys(movein_keys);

//for camera to sweep round
var rotate = new BABYLON.Animation(
  "rotate",
  "rotation.y",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
);

var rotate_keys = [];

rotate_keys.push({
  frame: 0,
  value: 0
});

rotate_keys.push({
  frame: 9 * frameRate,
  value: 0
});

rotate_keys.push({
  frame: 14 * frameRate,
  value: Math.PI
});

rotate.setKeys(rotate_keys);
```

_For the door_  
The door will sweep around a hinge about the y axis a floatin point rotation. The opening and closing rotations will each take 2 seconds.

Key points will be a times 0, 3, 5, and 13 and 15 seconds.

Key values for the sweep will be its rotation about the y axis at frames.

```javascript
//for door to open and close
var sweep = new BABYLON.Animation(
  "sweep",
  "rotation.y",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
);

var sweep_keys = [];

sweep_keys.push({
  frame: 0,
  value: 0
});

sweep_keys.push({
  frame: 3 * frameRate,
  value: 0
});

sweep_keys.push({
  frame: 5 * frameRate,
  value: Math.PI / 3
});

sweep_keys.push({
  frame: 13 * frameRate,
  value: Math.PI / 3
});

sweep_keys.push({
  frame: 15 * frameRate,
  value: 0
});

sweep.setKeys(sweep_keys);
```

_For Lights_
The lights will vary in intensity (float). These will be an array of spot lights.

Key points for lights are remaining off for 7 seconds, coming to full intensity at 10 seconds which stays until going off at 14 seconds.

```javascript
//for light to brighten and dim
var lightDimmer = new BABYLON.Animation(
  "dimmer",
  "intensity",
  frameRate,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
);

var light_keys = [];

light_keys.push({
  frame: 0,
  value: 0
});

light_keys.push({
  frame: 7 * frameRate,
  value: 0
});

light_keys.push({
  frame: 10 * frameRate,
  value: 1
});

light_keys.push({
  frame: 14 * frameRate,
  value: 1
});

light_keys.push({
  frame: 15 * frameRate,
  value: 0
});

lightDimmer.setKeys(light_keys);
```

# Cartoon

Now just run all the clips simulaneously

```javascript
scene.beginDirectAnimation(camera, [movein, rotate], 0, 25 * frameRate, false);
scene.beginDirectAnimation(hinge, [sweep], 0, 25 * frameRate, false);
scene.beginDirectAnimation(
  spotLights[0],
  [lightDimmer],
  0,
  25 * frameRate,
  false
);
scene.beginDirectAnimation(
  spotLights[1],
  [lightDimmer.clone()],
  0,
  25 * frameRate,
  false
);
```

The Finished Sequence https://www.babylonjs-playground.com/#2L26P1#8)
