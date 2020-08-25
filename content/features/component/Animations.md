---
title: Animation
description: How to use animations in babylon.js
keywords: animations, gif
image-url: /img/features/animation/Horse_gif_slow.gif
# category: features/component
---

# Animation

One way to animate things in BabylonJS is to change their properties within a scene.registerBeforeRender or scene.registerAfterRender loop. You will find many of the playground examples within the documentation using this method. However BabylonJS also provides animating methods based on a timed frame system. Given the right data BabylonJS calculates and draws a specific frame of the animation at a specific time independently of the scene rendering rate.

## Ways of Animating

To help understand how BabylonJS goes about animating, consider a couple of different ways that animating is done, their similarities and differences. The designer of both has to consider, the action wanted, timing, the number of frames needed to produce the required fluidity and key points within the sequence.

The BabylonJS method is much closer to stop motion.

### Animated Gif

Using an animated gif file a sequence of images, _frames_ are combined to give the impression of movement.

![Horse - Frames](/img/features/animation/horse_frames.jpg)

![Horse Animation](/img/features/animation/Horse_gif_slow.gif) from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Horse_gif_slow.gif)

Each individual image is one _frame_ of the animation.

Software used to create an animated gif often gives the opportunity to set a time for each frame to be displayed - 0.2 seconds in the
example below.

![Horse - Rate](/img/features/animation/horse_rate.jpg)

### Stop Motion Animation

This way takes a physical object which is photographed, changed slightly and then re-photographed. This is done repeatedly to form a series of images, each of which
becomes one _frame_.

![Lego Stop Motion](/img/features/animation/stop_motion.jpg) from [NYFA](https://www.nyfa.edu/student-resources/wp-content/uploads/2015/02/5860045_orig.jpg)

During the design the creator will need to consider how long a sequence will take and how smooth it needs to be. The smoother the movement the more frames are required.
This together with the timing of the sequence will give the frames per second. Also knowing the object's start position and end position and how many frames are required
for this will give the object's movement per frame.

## The BabylonJS Difference

For the animated gif the whole of each frame has to be drawn by the creator. In BabylonJS each frame is drawn from data provided by the creator.

In an animated gif the animation ties in: object being animated; the changes made each frame and the rapid display of the frames one after the other.
In the above you think of the animation as the horse running.

In BabylonJS an _animation_ is a specific javascript object not the overall finished piece. In the same way that a material is created which
can then be applied to any mesh you create an _animation_ which can be applied to any mesh, camera or light.

An _animation_ in BabylonJS basically describes one change that will take place to one property.

Instead of giving the time for each frame to be displayed, in BabylonJS the number of frames per second in an animation is given. This should not be confused
with the rendering speed of a scene, also measured in frames per second. The animation frames per second is specified in an _animation_.

The extent of the changes and when they take place are set in an array of key frames and values.

## Terminology

The following terms will have the given meaning within the How_To about animating.

-   _Performer_ an item that can be animated, could be a mesh, a light or camera for example.

-   _Frame_ - an animation frame not a rendered frame of the scene.

-   _Animation_ - similar to a play or film script but applies to just one property of a performer. It consists of

    -   the property to be changed, for example, position, intensity or rotation
    -   the rate of change of the property in frames per second,
    -   the type of the property being changed, for example vector, floating point number or matrix,
    -   looping conditions,
    -   key values of the property at key frames.

-   _Scripted Performer_ - The performer plus all the animations to be undertaken by the performer.

-   _Performance_ - The scripted performer and the actions done by the performer following the script. In BabylonJS this is the _animatable_ object.

-   _Clip_ - The viewable result of a performance. In practice there are two types of _clip_ a
    _game clip_ and a _movie clip_. In a _movie clip_ the user has no control over the camera and the _clip_ is viewed according to the _animation_ of the camera
    as set by the creator of the _clip_. In a _game clip_ the user is able to move the camera as determined by the type of camera used in the scene. Unless
    it is likely to cause any confusion just the term _clip_ will be used throught the guide when writing about animating.

-   _Cartoon_ - A series of _clips_ played at timed intervals.

## Designing a Clip

The first step is to decide what you want to see in a _clip_, that is what is the _performance_ to be. This gives the performer and its animation.

### A very simple example

In this _game clip_ a box, the _performer_ is to slide between two places once every second. The box will be able to be viewed from any angle.

The first stage design is to sketch what is needed at key time points, a little like an animated gif design.

![key frames](/img/features/animation/ani1.jpg)

After one second the box should be in its new position and one second later in its start position. This sequence is then continually repeated.

In BabylonJS then _animation_ is changing the position of the box along the x axis and its x position is a floating point number and

the _animation_ should loop. In code the animation which slides an item in the x direction becomes

```javascript
var frameRate = 10;

var xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
```

The key frames are at 0, 1 and 2 seconds. To find the frame number after t seconds multiply the time by the frame rate, i.e. t x frameRate.
In this case the key frames are numbers, 0, 1 x frameRate and 2 x frame Rate.

Starting the box at x = 2 and sliding it to x = -2, gives the x positional values of the box after 0, 1 and 2 seconds as 2, -2 and 2 respectively.

The key frames are set into an array of Javascript objects with properties for frame (number) and value and added to the animation, as in

```javascript
var keyFrames = [];

keyFrames.push({
    frame: 0,
    value: 2,
});

keyFrames.push({
    frame: frameRate,
    value: -2,
});

keyFrames.push({
    frame: 2 * frameRate,
    value: 2,
});

xSlide.setKeys(keyFrames);
```

The animation is now fully made and can be applied to the box resulting in a _performance_ (animatable) by .

```javascript
scene.beginDirectAnimation(box, [xSlide], 0, 2 * frameRate, true);
```

-   [Playground Example for Above](https://www.babylonjs-playground.com/#9WUJN#11)

# Functions and Parameters for Animating

## Animation

new BABYLON.Animation(name, property, frames per second, property type, loop mode)

-   _name_ - _string_, name of animation

-   _property_ - _string_, a property of the object that the animation will be applied to. For example a Vector3 property such as position or a floating
    number propert such as position.x

-   _frames per second_ - _number_, the number of animation frames per second (independent of the scene rendering frames per second)

-   _property type_ - _number_, the property type of the _property_ parameter. This can be set using the following constants

    BABYLON.Animation.ANIMATIONTYPE_COLOR3  
     BABYLON.Animation.ANIMATIONTYPE_FLOAT  
     BABYLON.Animation.ANIMATIONTYPE_MATRIX  
     BABYLON.Animation.ANIMATIONTYPE_QUATERNION  
     BABYLON.Animation.ANIMATIONTYPE_VECTOR2  
     BABYLON.Animation.ANIMATIONTYPE_VECTOR3

-   _loop mode_ - _number optional_, This can be set using the following Parameters

    BABYLON.Animation.ANIMATIONLOOPMODE*CYCLE - Restart the animation from initial value  
     BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT - Pause the animation at the final value  
     BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE - Repeat the animation incrementing using key value gradients. In this way, for example, a \_clip* showing
    a character's legs in a walking motion can be looped to show the character progressing across the scene.

## beginDirectAnimation

scene.beginDirectAnimation(target, animations, start frame, end frame, loop, speedRatio, onAnimationEnd);

-   _target_ - _BabylonJS Object_, the BabylonJS object to be animated

-   _animations_ - _array_, of all the animations to apply to the target

-   _start frame_ - _number_, the frame at which to start the animation

-   _end frame_ - _number_, the frame at which to end the animation

-   _loop_ - _boolean_, true when _loop mode_ of the animation is to be activated, false to run animation just once

-   _speedRatio_ - _number_, the speed ratio to apply to all animations

-   _onAnimationEnd_ - _function_, the callback to call when an animation ends (will be called once per node)

# Further Reading

## Basic - L1

[Animation 101](/babylon101/Animations)  
[Grouping Animations](/How_To/Group)  
[Combining Animations](/How_To/Combine.html)

## Mid Level - L2

[A Sequence of Animations](/How_To/Sequence.html)
