---
title: Grouping Animations
image: 
description: Learn how to group animations together for easier management.
keywords: welcome, babylon.js, diving deeper, animation, group, grouping
further-reading:
video-overview:
video-content:
    - title: Demystifying Animation Groups
      url: https://youtu.be/BSqxoQ-at24
---

An `AnimationGroup` allows you to link together animations and meshes and play them, pause them and stop them as a group.

## Forming a Group

Following the tutorial for [creating an animation](/divingDeeper/animation/animation_introduction) set up one or more animations.

For example having created _animation1_, _animation2_ and _animation3_ and also meshes _mesh1_, _mesh2_, _mesh3_ and _mesh4_ you can form the following animation groups

```javascript
var animationGroup1 = new BABYLON.AnimationGroup("Group1");
var animationGroup2 = new BABYLON.AnimationGroup("Group2");
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

- <Playground id="#CBGEQX#1" title="Animation Group Example 1" description="First Example of Animation Groups." image="/img/playgroundsAndNMEs/divingDeeperAnimationGroup1.jpg"/>
- <Playground id="#CBGEQX#2" title="Animation Group Example 2" description="Second Example of Animation Groups." image="/img/playgroundsAndNMEs/divingDeeperAnimationGroup1.jpg" isMain={true} category="Animation"/>
- <Playground id="#CBGEQX#3" title="Animation Group Example 3" description="Third Example of Animation Groups." image="/img/playgroundsAndNMEs/divingDeeperAnimationGroup1.jpg"/>

## Speed Ratio for the Group

The **speedRatio** for all animations in the group can be set, for example

```javascript
animationGroup1.speedRatio = 0.25;
animationGroup2.speedRatio = 3;
```

speeding up or slowing down the animation.

- <Playground id="#CBGEQX#5" title="Animation Group Speed Ratio" description="Example of adjust an animation group's speed ratio." image="/img/playgroundsAndNMEs/divingDeeperAnimationGroup2.jpg"/>

## Creating a group from existing animatables

You can create a new AnimationGroup from an animatable by enumerating the animations contained in the animatable:

```javascript
var animationGroup = new BABYLON.AnimationGroup("my-animation-group");

for (anim of idleAnim.getAnimations()) {
    animationGroup.addTargetedAnimation(anim.animation, anim.target);
}
```

Example: - <Playground id="#CBGEQX#5" title="Create AnimationGroup From Animatable" description="Example of creating an animationGroup by enumerating through the animations contained in an animatable." image="/img/playgroundsAndNMEs/divingDeeperAnimationGroup3.jpg"/>

## On Group Animation End

There is an **onAnimationEnd** observable that can be used to trigger a function when the animation ends.

```javascript
animationGroup1.onAnimationEndObservable.add(function() {
  mesh2.material = redMaterial;
});
```

- <Playground id="#CBGEQX#4" title="On Animation Group End" description="Example of executing code after all animations in an animationGroup finish." image="/img/playgroundsAndNMEs/divingDeeperAnimationGroup1.jpg"/>

## On Group Animation Loop

There is an **onAnimationLoop** observable that can be used to trigger a function when the animation loops.

```javascript
animationGroup1.onAnimationLoopObservable.add(function(targetAnimation) {
  console.log(targetAnimation.animation.name);
});
```

There is also an **onAnimationGroupLoop** observable that can be used to trigger a function when all the animation of the group ahve looped:

```javascript
animationGroup1.onAnimationGroupLoopObservable.add(function(group) {
  console.log("Group looped!");
});
```