---
title: Introduction to Animations
image:
description: A deeper overview of animation and how to leverage it in Babylon.js.
keywords: diving deeper, animation, introduction, intro
---

## An Introduction to Animation

However animation is achieved it has to take into account the action wanted, timing, the number of frames needed to produce the required fluidity and key points within the sequence. This introduction should help to understand how Babylon.js goes about animations and how they are achieved.

Animations are produced by a sequence of images, _frames_, which are displayed one after the other. This sequence of _frames_ can be individual drawings or for, stop motion animation, photographs of models that are moved slightly frame by frame

![Horse - Frames](/img/features/animation/horse_frames.jpg)

<img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Horse_gif_slow.gif" title="Horse Animation" caption="from Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Horse_gif_slow.gif)"/>

During the design stage the creator will need to consider how long a sequence should take and how smooth it needs to be. The smoother the movement the more frames are required. Once the number of frames is known the animation frames per second can be inferred. Also knowing the object's start position and end position and how many frames are required will determine the object's movement per frame.

In Babylon.js, as in stop motion animation, individual objects have to be moved one by. Whereas we might talk about the overall finished piece as an animation in Babylon.js an _Animation_ is also a specific object that details a transformation, timing and looping that can then be applied to any mesh, camera or light. To this data is added values at key frames from which Babylon.js calculates the transformations to take place for the in between frames.

## Terminology Used in the Animation Documentation

The following terms will have the given meaning within the How_To about animating.

- _Performer_ an item that can be animated, could be a mesh, a light or camera for example. Performers can, however, be more than just a node in the scene. The performer can also be a value like a color property on a shader, the intensity property of a light, or even the weight property on another animation.

- _Frame_ - an animation frame not a rendered frame of the scene.

- _Animation_ - similar to a play or film script but applies to just one property of a performer. It consists of

  - the property to be changed, for example, position, intensity or rotation
  - the rate of change of the property in frames per second,
  - the type of the property being changed, for example vector, floating point number or matrix,
  - looping conditions,
  - key values of the property at key frames.

- _Scripted Performer_ - The performer plus all the animations to be undertaken by the performer.

- _Performance_ - The scripted performer and the actions done by the performer following the script. In Babylon.js this is the _animatable_ object.

- _Clip_ - The viewable result of a performance. In practice there are two types of _clip_ a
  _game clip_ and a _movie clip_. In a _movie clip_ the user has no control over the camera and the _clip_ is viewed according to the _animation_ of the camera as set by the creator of the _clip_. In a _game clip_ the user is able to move the camera as determined by the type of camera used in the scene. Unless it is likely to cause any confusion just the term _clip_ will be used throughout the documentation when writing about animating.

- _Cartoon_ - A series of _clips_ played at timed intervals.
