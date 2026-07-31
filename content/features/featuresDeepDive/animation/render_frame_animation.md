---
title: Animation Using the Render Loop
image:
description: Understand how to animate objects with the scene's render loop.
keywords: diving deeper, animation, advanced, render loop
further-reading:
video-overview:
video-content:
---

## Animation Using the Render Loop

Babylon.js allows you to change an object's properties immediately before or after a frame is rendered. This is an alternative way of producing animation in a scene.
This type of animation lets you control everything on each frame of the animation (each tick). The code computed at run time must be located in this function:

```javascript
scene.onBeforeRenderObservable.add(() => {
  //Your code here
});
```

The functions added to `onBeforeRenderObservable()` run before every frame (usually ~60 times per second), so animation is created by making small changes to object properties very quickly.

A simple demonstration of complex animation can be found in the playground here:
<Playground id="#YJVTI6#562" title="Render Loop Animation Example" description="A simple example of animation using the scene's render loop." image="/img/playgroundsAndNMEs/divingDeeperRenderLoopAnimation1.webp"/>

This function can be very useful for complex animations, such as games, where characters have to move depending on many parameters.

Don’t hesitate to combine all those types of animations. If done well, it’s very powerful.

Don't forget to [visit our API documentation](/typedoc) in order to learn more about the [**Babylon.js Animation**](/typedoc/classes/babylon.animation) and [**Babylon.js Animatable**](/typedoc/classes/babylon.animatable) classes.
