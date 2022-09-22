---
title: Getting Started - Chapter 8 - Follow That Character
image:
description: Learn the basics of the FollowCamera.
keywords: getting started, start, chapter 8, cameras, camera, FollowCamera
further-reading:
video-overview:
video-content:
---

# Getting Started - Follow That Character

## Follow That Character

Without using parenting we can also track the characters movements with a _FollowCamera_.

We give a _FollowCamera_ a start position and a target to follow and a goal position from which to view the target.

We create the _FollowCamera_ with a name, start position and the optional scene parameter.

```javascript
const camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-6, 0, 0), scene);
```

We then set the goal:
height above the the center of the target;

```javascript
camera.heightOffset = 8;
```

radial distance from target plus height offset;

```javascript
camera.radius = 1;
```

rotation, in radians, center of target in x y plane;

```javascript
camera.rotationOffset = 0;
```

acceleration in moving from current to goal position;

```javascript
camera.cameraAcceleration = 0.005;
```

speed at which acceleration is halted

```javascript
camera.maxCameraSpeed = 10;
```

Of course we also attach the camera to the canvas

```javascript
camera.attachControl(canvas, true);
```

Finally we set the target

```javascript
camera.lockedTarget = targetMesh;
```

<Playground id="#KBS9I5#98" title="Follow The Character" description="Use the follow cam to follow the character around the village." image="/img/playgroundsAndNMEs/gettingStartedFollowCam.jpg"/>

Having created a 3D world, albeit just a small village, it would be good to see it in all its 3D glory. All you need is a 3D viewer whether a simple one such as the Google Carboard or a high tech one and the appropriate camera from Babylon.js.
