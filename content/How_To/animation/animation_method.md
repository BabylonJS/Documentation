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
const myAnim = new BABYLON.Animation(name, property, frames per second, property type, loop mode)
```
-   _name_ - _string_, name of animation

-   _property_ - _string_, a property of the object that the animation will be applied to. For example a Vector3 property such as position or a floating number property such as position.x

-   _frames per second_ - _number_, the number of animation frames per second (independent of the scene rendering frames per second)

-   _property type_ - _number_, the property type of the _property_ parameter. This can be set using the following constants

    BABYLON.Animation.ANIMATIONTYPE_COLOR3  
    BABYLON.Animation.ANIMATIONTYPE_FLOAT  
    BABYLON.Animation.ANIMATIONTYPE_MATRIX  
    BABYLON.Animation.ANIMATIONTYPE_QUATERNION  
    BABYLON.Animation.ANIMATIONTYPE_VECTOR2  
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3

-   _loop mode_ - _number optional_, This can be set using the following Parameters

    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE - Restart the animation from initial value  
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT - Pause the animation at the final value  
    BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE - Repeat the animation incrementing using key value gradients. In this way, for example, a \_clip* showing a character's legs in a walking motion can be looped to show the character progressing across the scene.

## Set Key Frames
This is an array, *myKeys* of objects. Each object having the two properties 

- _frame_ - the frame number
- _value_ - for the property being changed

Once constructed this is added to the animation

```javascript
myAnim.setKeys(myKeys);
```

## Beginning The Animation

To run the animation it is pushed onto the *animations* array property of the mesh

```javascript
mesh.animations.push(myAnim)
```

and started with these required parameters
```javascript
scene.beginAnimation(target, from, to);
```

-   _target_ - _BabylonJS Object_, theBabylon.js object to be animated
-   _from_ - _number_, the frame at which to start the animation
-   _to_ - _number_, the frame at which to end the animation


When you want the animation to loop you and true as the fourth parameter
```javascript
scene.beginAnimation(target, from, to, true)
```

<Playground id="#7V0Y1I" title="Basic Sliding Box Animation" description="An example of basic animation by sliding a box." image="/img/playgroundsAndNMEs/features/divingDeeperAnimationDesign1.jpg"/>

The are a number of further optional parameters than you can find in the *scene* API

You can apply several animations to a target using
```javascript
scene.beginDirectAnimation(target, animations, from, to, loop)
```

-   _target_ - _BabylonJS Object_, theBabylon.js object to be animated

-   _animations_ - _array_, of all the animations to apply to the target

-   _from_ - _number_, the frame at which to start the animation

-   _to_ - _number_, the frame at which to end the animation

-   _loop_ - _boolean_, optional, default *false*, when *true* repeats thee animation

Further optional parameters are available and can be found at the *scene* API

<Playground id="#7V0Y1I#1" title="Sliding Box Direct Animation" description="An example of sliding a box with direct animation." image="/img/playgroundsAndNMEs/features/divingDeeperAnimationDesign1.jpg" isMain={true} category="Animation"/> 

## Animatable

Both methods of starting an animation return an *Animatable* object 

```javascript
const myAnimatable = myscene.beginAnimation(target, from, to, true)
```

which supports the following methods

- _pause()_
- _restart()_
- _stop()_
- _reset()_

<Playground id="#7V0Y1I#2" title="Box animation stop after 5 secs" description="An example of stopping an animation after specific amount of time." image="/img/playgroundsAndNMEs/features/divingDeeperAnimationDesign1.jpg" isMain={true} category="Animation"/>  
