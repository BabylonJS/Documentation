---
title: Grouping Animations
image:
description: Learn how to group animations together for easier management.
keywords: diving deeper, animation, group, grouping
further-reading:
video-overview:
video-content:
  - title: Demystifying Animation Groups
    url: https://youtu.be/BSqxoQ-at24
---

An `AnimationGroup` allows you to link together animations and meshes and play them, pause them and stop them as a group.

## Forming a Group

Following the tutorial for [creating an animation](/features/featuresDeepDive/animation/animation_introduction) set up one or more animations.

For example having created _animation1_, _animation2_ and _animation3_ and also meshes _mesh1_, _mesh2_, _mesh3_ and _mesh4_ you can form the following animation groups

```javascript
const animationGroup1 = new BABYLON.AnimationGroup("Group1");
const animationGroup2 = new BABYLON.AnimationGroup("Group2");
```

and then use the **addTargetedAnimation** method to link the animations with the meshes and add these to the groups

```javascript
animationGroup1.addTargetedAnimation(animation1, mesh1);
animationGroup1.addTargetedAnimation(animation3, mesh1);
animationGroup1.addTargetedAnimation(animation2, mesh2);

animationGroup2.addTargetedAnimation(animation2, mesh3);
animationGroup2.addTargetedAnimation(animation1, mesh4);
animationGroup2.addTargetedAnimation(animation2, mesh4);
animationGroup2.addTargetedAnimation(animation3, mesh4);
```

As the animations may have been created with differing timelines and these have to be aligned using **normalize**

## Normalize a Group

It may be that _animation1_, _animation2_ and _animation3_ have all been created using different numbers of frames. For instance _animation1_ may go from frame 0 to frame 80, _animation2_ from frame 0 to 75 and _animation3_ from frame 0 to frame 100. You can use the **normalize** method to make the number of frames the same for all animations, as in

```javascript
animationGroup2.normalize(0, 100);
```

In general the parameters for **normalize** are the numbers _beginFrame_ and _endFrame_.

The _beginFrame_ number must be less than or equal to the smallest begin frame of all animations, for the above examples not greater than 0.  
The _endFrame_ number must be greater than or equal to the largest end frame of all animations, for the above examples not less than 100.

- <Playground id="#CBGEQX#1" title="Animation Group Example 1" description="First Example of Animation Groups."/>
- <Playground id="#CBGEQX#858" title="Animation Group Example 2" description="Second Example of Animation Groups." isMain={true} category="Animation"/>
- <Playground id="#CBGEQX#3" title="Animation Group Example 3" description="Third Example of Animation Groups."/>

## Speed Ratio for the Group

The **speedRatio** for all animations in the group can be set, for example

```javascript
animationGroup1.speedRatio = 0.25;
animationGroup2.speedRatio = 3;
```

speeding up or slowing down the animation.

- <Playground id="#CBGEQX#5" title="Animation Group Speed Ratio" description="Example of adjust an animation group's speed ratio."/>

## Creating a group from existing animatables

You can create a new AnimationGroup from an animatable by enumerating the animations contained in the animatable:

```javascript
const animationGroup = new BABYLON.AnimationGroup("my-animation-group");

for (anim of idleAnim.getAnimations()) {
  animationGroup.addTargetedAnimation(anim.animation, anim.target);
}
```

Example: - <Playground id="#CBGEQX#5" title="Create AnimationGroup From Animatable" description="Example of creating an animationGroup by enumerating through the animations contained in an animatable."/>

## On Group Animation End

There is an **onAnimationEnd** observable that can be used to trigger a function when the animation ends.

```javascript
animationGroup1.onAnimationEndObservable.add(function () {
  mesh2.material = redMaterial;
});
```

- <Playground id="#CBGEQX#4" title="On Animation Group End" description="Example of executing code after all animations in an animationGroup finish."/>

## On Group Animation Loop

There is an **onAnimationLoop** observable that can be used to trigger a function when the animation loops.

```javascript
animationGroup1.onAnimationLoopObservable.add(function (targetAnimation) {
  console.log(targetAnimation.animation.name);
});
```

There is also an **onAnimationGroupLoop** observable that can be used to trigger a function when all the animation of the group have looped:

```javascript
animationGroup1.onAnimationGroupLoopObservable.add(function (group) {
  console.log("Group looped!");
});
```

## Masking animations in a group

Masking allows you to define which animations should or should not be played.

By default (without mask), all animations added to an animation group will be played. If you whish only certain animations to be played, you can create an `AnimationGroupMask`:

```javascript
const mask1 = new BABYLON.AnimationGroupMask([sphereA.name, sphereB.name], BABYLON.AnimationGroupMaskMode.Include); // play only animations affecting sphereA and sphereB
animGroup.mask = mask1;
const mask2 = new BABYLON.AnimationGroupMask([sphereA.name, sphereB.name], BABYLON.AnimationGroupMaskMode.Exclude); // play all animations except those affecting sphereA or sphereB
animGroup.mask = mask2;
```

You can use this Playground to test the `mask` property: <Playground id="#56LX6L#9" title="Animation group mask" description="Demonstrate how to use the mask property"/>

Note that if you use the same mask for the entire lifetime of an animation group, you can save performance and memory by removing from the animation group any animations that are rejected by the mask.
You can do this easily by calling the method `AnimationGroup.removeUnmaskedAnimations()`.

What's more, if you update the mask while the animation group is already playing, you need to call the `AnimationGroup.syncWithMask()` method to ensure that the correct animations are stopped/played according to the new mask.

## Ordering animation groups

The `AnimationGroup.playOrder` property defines the order in which animatables created at animation group startup should be processed in the list of active animatables.

This property can be useful when you want to ensure that certain animation groups / animatables are played before or after others (as in a layered system animation, for example).

By default, when `playOrder` is not set (it defaults to 0), animatables are played in the order in which they were created.

## Miscellaneous

`AnimationGroup.enableBlending`, `AnimationGroup.blendingSpeed` and `AnimationGroup.weight` are helper properties that allow you to easily set these values for all animatables in the animation group at once, without having to go through the list of animatables yourself.
