---
title: Designing Animations
image: 
description: A deeper overview of animation and how to leverage it in Babylon.js.
keywords: diving deeper, animation, introduction, intro
further-reading:
video-overview:
video-content:
---

## Designing a Clip

The first step is to decide what you want to see in a _clip_, that is what is the _performance_ to be. This gives the performer and its animation.

In this _game clip_ a box, the _performer_, is to slide between two places once every second. The box will be able to be viewed from any angle.

The first stage design is to sketch what is needed at key time points, a little like an animated gif design.

![key frames](/img/features/animation/ani1.jpg)

After one second the box should be in its new position and one second later in its start position. This sequence is then continually repeated.

In Babylon.js the _Animation_ is changing the position of the box along the x axis and its x position is a floating point number and

the _animation_ should loop. In code the animation which slides an item in the x direction becomes

```javascript
const frameRate = 10;

const xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
```

The key frames are at 0, 1 and 2 seconds. To find the frame number after t seconds multiply the time by the frame rate, i.e. t x frameRate.  
In this case the key frames are at frame numbers, 0, 1 x frameRate and 2 x frame Rate.

Starting the box at x = 2 and sliding it to x = -2, gives the x positional values of the box after 0, 1 and 2 seconds as 2, -2 and 2 respectively.

The key frames are set into an array of JavaScript objects with properties for frame (number) and value and added to the animation, as in

```javascript
const keyFrames = [];

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

The animation is now fully made and can be applied to the box 

```javascript
box.animations.push(xSlide);
```
The _performance_ (*Animatable*) is started with

```javascript
scene.beginAnimation(box, 0, 2 * frameRate, true);
```

You can see the result here  
<Playground id="#7V0Y1I" title="Basic Sliding Box Animation" description="An example of basic animation by sliding a box." image="/img/playgroundsAndNMEs/features/divingDeeperAnimationDesign1.jpg" isMain={true} category="Animation"/>

## Reversing an Animation

Fun tip, the second and third arguments for the beginAnimation method are a starting frame and ending frame from your keyFrames list. If you reverse those two values, the animation will play in reverse!

```javascript
const startFrame = 0;
const endFrame = 10;
const frameRate = 10;

const xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

const keyFrames = []; 

keyFrames.push({
    frame: startFrame,
    value: 2
});

keyFrames.push({
    frame: endFrame,
    value: -2
});


xSlide.setKeys(keyFrames);

box.animations.push(xSlide);

//backwards animation
scene.beginAnimation(box, endFrame, startFrame, false);
```

Check it out here: 
<Playground id="#7V0Y1I#940" title="Playing an Animation in Reverse" description="An example of playing an animation forwards and backwards."/>


## The Animation Curve Editor (ACE)

Now that you're starting to understand the basics of animations in Babylon and how to create them, you'll also want to consider taking a look at the Animation Curve Editor (ACE). This super easy-to-use tool allows you to create full animations in a matter of seconds without writing any code!

[Check it out!](/toolsAndResources/inspector/animationCurveEditor)

<img src="/img/tools/ACE/overview.jpg" title="Babylon.js Animation Curve Editor"/>