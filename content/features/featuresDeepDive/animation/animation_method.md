---
title: The Animation Method
image:
description: A description of the animation method and approach in Babylon.js.
keywords: diving deeper, animation, approach, method
further-reading:
video-overview:
video-content:
---

# The Animation Method

## Creating the animation

```javascript
const myAnim = new BABYLON.Animation(name, property, frames_per_second, property_type, loop_mode);
```

- _name_ - _string_, name of animation

- _property_ - _string_, a property of the object that the animation will be applied to. For example a Vector3 property such as position or a floating number property such as `light.intensity`.

- _frames per second_ - _number_, the number of animation frames per second (independent of the scene rendering frames per second)

- _property type_ - _number_, the property type of the _property_ parameter. This can be set using the following constants:

  BABYLON.Animation.ANIMATIONTYPE_COLOR3  
  BABYLON.Animation.ANIMATIONTYPE_FLOAT  
  BABYLON.Animation.ANIMATIONTYPE_MATRIX  
  BABYLON.Animation.ANIMATIONTYPE_QUATERNION  
  BABYLON.Animation.ANIMATIONTYPE_VECTOR2  
  BABYLON.Animation.ANIMATIONTYPE_VECTOR3

- _loop mode_ - _number optional_, This can be set using the following Parameters:

  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE - Restart the animation from initial value  
  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT - Pause the animation at the final value  
  BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE - Repeat the animation incrementing using key value gradients. In this way, for example, a \_clip\* showing a character's legs in a walking motion can be looped to show the character progressing across the scene.
  BABYLON.Animation.ANIMATIONLOOPMODE_YOYO - The animation will reverses its direction when it reaches the end instead of restarting from the beginning

## Set Key Frames

The key frames of an animation are held in an array of objects, each containing the following two properties:

- _frame_ - the frame number
- _value_ - for the property being changed

This array will contain one object for each key frame and can contain as many key frames as needed for the desired animation.

```javascript
const myKeys = [
  {
    frame: 0,
    value: 0.5,
  },
  {
    frame: 60,
    value: 1.0,
  },
];
```

Once the key frames array is constructed, in this case an array named _myKeys_, it is added to the animation by setting the keys.

```javascript
myAnim.setKeys(myKeys);
```

## Beginning The Animation

There are several ways to manage the play state of animations. One of the simplest is to add an animation to the _animations_ array property of an object. Objects like Mesh, Material, Light, or Camera have an _animations_ array property defined by default which holds animations which target that specific object.

```javascript
myMaterial.animations.push(myAnim);
```

Additionally, animations can be added to any object that the engine can reach, even if it does not already have an _animations_ array property. Due to the malleable nature of Javascript, simply declaring a new array property for an object will enable us to store animations on target objects. For example, if we want to target the weight property of an animation with another animation, we can add an _animations_ array property to the animation by declaring it.

```javascript
myAnimation.animations = [];
myAnimation.animations.push(weightAnimation);
```

Remember, above we said that anything that the engine can reach can be animated with our animation system. This also applies to content outside of the canvas. For example, since we can reach any DOM object with Javascript, we can apply an animation to it. If we wanted to, we could use an animation to drive the border-radius of a `<div>` object.

### beginAnimation

Now that we have pushed an animation to a target object, starting the animation is a simple case of telling the scene to begin the animations stored with the target object. Note that when `beginAnimation` is called, every animation stored in the `target.animations` array will start.

```javascript
scene.beginAnimation(target, from, to);
```

- _target_ - _BabylonJS Object_, theBabylon.js object to be animated
- _from_ - _number_, the frame at which to start the animation
- _to_ - _number_, the frame at which to end the animation

If a looping animation is desired, set the fourth parameter to true.

```javascript
scene.beginAnimation(target, from, to, true);
```

<Playground id="#7V0Y1I" title="Basic Sliding Box Animation" description="An example of basic animation by sliding a box." image="/img/playgroundsAndNMEs/divingDeeperAnimationDesign1.jpg"/>

There are a number of further optional parameters that you can find in the _scene_ API.

### beginDirectAnimation

If it is preferable to not store animations with a target object, one or more animations can be applied to a target using:

```javascript
scene.beginDirectAnimation(target, animations, from, to, loop);
```

- _target_ - _BabylonJS Object_, theBabylon.js object to be animated
- _animations_ - _array_, of all the animations to apply to the target
- _from_ - _number_, the frame at which to start the animation
- _to_ - _number_, the frame at which to end the animation
- _loop_ - _boolean_, optional, default _false_, when _true_ repeats the animation

Be aware that animations applied with `scene.beginDirectAnimation` do not belong to any object or the scene so the scene is not aware of these animations and they do not register in `scene.animations`. However, this method is extremely useful for applying a one-time animation to an object or for animating an object that does not have an _animations_ array property if it is desireable not to alter the target object. Further optional parameters are available and can be found in the _scene_ API. If `scene.beginDirectAnimation` is the preferable method, but additionally having a reference to the animation that can be used in the future is required, an _Animatable_ is exactly what is needed.

<Playground id="#7V0Y1I#1" title="Sliding Box Direct Animation" description="An example of sliding a box with direct animation." image="/img/playgroundsAndNMEs/divingDeeperAnimationDesign1.jpg" isMain={true} category="Animation"/>

## Animatable

Both `scene.beginAnimation` and `scene.beginDirectAnimation` return an _Animatable_ object that can be referenced when needed to change the state of the animation. Simply capture the return from one of the methods above to store the reference.

```javascript
const myAnimatable = myscene.beginAnimation(target, from, to, true);
```

Once the animatable is stored, any of the following methods can be called to change the state of the animation as needed.

- _pause()_
- _restart()_
- _stop()_
- _reset()_

<Playground id="#7V0Y1I#2" title="Box animation stop after 5 secs" description="An example of stopping an animation after specific amount of time." image="/img/playgroundsAndNMEs/divingDeeperAnimationDesign1.jpg" isMain={true} category="Animation"/>
