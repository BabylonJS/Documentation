---
title: Getting Started - Chapter 8 - Have a Look Around
image: 
description: Learn the basics of the arcRotateCamera.
keywords: welcome, babylon.js, getting started, start, chapter 8, cameras, camera, arcRotate
further-reading:
video-overview:
video-content:
---

# Getting Started - Have a Look Around

## Have a Look Around
Currently we are using the *ArcRotateCamera* which has us orbiting the village world from a distance. How about a view from inside the village? Let's parent the camera to the character walking around the village and with a few adjustments to values look around from over his shoulder. The creation of the *ArcRotateCamera* has this form,

```javascript
const camera = new BABYLON.ArcRotateCamera("name", alpha angle, beta angle, radius, target position);
```

As will all cameras in order to move it in response to user input we need to attach it to the canvas.

```javascript
camera.attachControl(canvas, true);
```

Think of this camera as one orbiting its target position, or more imaginatively as a spy satellite orbiting the earth. Its position relative to the target (earth) can be set by three parameters, _alpha_ (radians) the longitudinal rotation, _beta_ (radians) the latitudinal rotation and  _radius_ the distance from the target position.

![arc rotate camera](/img/how_to/camalphabeta.jpg)

In our case we want to have the camera parented to the character

```javascript
camera.parent = dude;
```

and, because the dude is scaled in size we use a large radius which as parented to the dude will be scaled down. To track him we use 

```javascript
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 150, new BABYLON.Vector3(0, 60, 0));
```

Since the character makes instant turns the camera also does. To make the viewing smoother a smoother track for the character to follow would be needed.

<Playground id="#KBS9I5#97" title="Over The Shoulder" description="Parent the camera to a character for an over the shoulder angle." image="/img/playgroundsAndNMEs/gettingStartedCamera.jpg"/>

We can also use a different type of camera to follow the character another way.
