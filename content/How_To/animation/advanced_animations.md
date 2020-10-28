## Animations and promises
Starting with Babylon.js v3.3, you can use promises to wait for an animatable to end:

```
var anim = scene.beginAnimation(box1, 0, 100, false);

console.log("before");
await anim.waitAsync();
console.log("after");
```

You can find an example here: https://www.babylonjs-playground.com/#HZBCXR

## Controlling animations

Each Animation has a property called ```currentFrame``` that indicates the current animation key.

For advanced keyframe animation, you can also define the functions used to interpolate (transition) between keys. By default these functions are the following:

```javascript
BABYLON.Animation.prototype.floatInterpolateFunction = function (startValue, endValue, gradient) {
  return startValue + (endValue - startValue) * gradient;
};

BABYLON.Animation.prototype.quaternionInterpolateFunction = function (startValue, endValue, gradient) {
  return BABYLON.Quaternion.Slerp(startValue, endValue, gradient);
};

BABYLON.Animation.prototype.vector3InterpolateFunction = function (startValue, endValue, gradient) {
  return BABYLON.Vector3.Lerp(startValue, endValue, gradient);
};
```

Here is the list of functions that you can change:

* floatInterpolateFunction
* quaternionInterpolateFunction
* quaternionInterpolateFunctionWithTangents
* vector3InterpolateFunction
* vector3InterpolateFunctionWithTangents
* vector2InterpolateFunction
* vector2InterpolateFunctionWithTangents
* sizeInterpolateFunction
* color3InterpolateFunction
* matrixInterpolateFunction

## Helper function

You can use an extended function to create a quick animation:

```javascript
Animation.CreateAndStartAnimation = function(name, mesh, targetProperty, framePerSecond, totalFrame, from, to, loopMode);
```

To be able to use this function, you need to know that :
- Your animation will have predefined key frames (Only 2 keyframes are generated : **Start** and **End**)
- The animation works only on **AbstractMesh** objects.
- The animation is starting right after the method call.

Here is a straightforward sample using the **CreateAndStartAnimation()** function :

```javascript
BABYLON.Animation.CreateAndStartAnimation('boxscale', box1, 'scaling.x', 30, 120, 1.0, 1.5);
```
Fast and easy. :)

## Animation blending

You can start an animation with *enableBlending* = true to enable blending mode. This blended animation will interpolate FROM the current object's state. This would be handy for user-controlled walking characters, or reacting to value changes from an input device. 

In the playground demo below, every time you click on the FPS marker, the new animation is blended with the box's current position: https://www.babylonjs-playground.com/#2BLI9T#368

Although this playground is blending the same animation into itself, more often, a different animation will be blended-into the original, such as when a walking character changes to running: https://www.babylonjs-playground.com/frame.html#IQN716#9

## Animation weights

Starting with Babylon.js 3.2, you can start animations with a specific weight. This means that you can use this API to run multiple animations simultaneously on the same target. The final value will be a mix of all animations weighted based on their weight value.

To start an animation with a weight, you can use the new `scene.beginWeightedAnimation` API:

```
// Will have a weight of 1.0
var idleAnim = scene.beginWeightedAnimation(skeleton, 0, 89, 1.0, true);
// Will have a weight of 0
var walkAnim = scene.beginWeightedAnimation(skeleton, 90, 124, 0, true);
// Will have a weight of 0
var runAnim = scene.beginWeightedAnimation(skeleton, 125, 146, 0, true);
```

This function accepts the following parameters:

| Name | Type | Description | Optional |
|---|---|---|---|
| target | any | The target | No
| from | number | The fps starting frame | No
| to | number | The fps ending frame | No
| weight | number | Weight of this animation. 1.0 by default | Yes
| loop | boolean | If true, the animation will loop (dependent upon BABYLON.Animation.ANIMATIONLOOPMODE) | Yes
| speedRatio | number | default : 1. The speed ratio of this animation | Yes
| onAnimationEnd | () => void | The function triggered on the end of the animation, even if the animation is manually stopped (also dependent upon ANIMATIONLOOPMODE) | Yes
| animatable | Animatable | An optional specific animation | Yes

Like `beginAnimation`, this function returns an animatable but this time with its `weight` property set to a value.

You can also set the `weight` value of any Animatable at any time to switch to a weighted mode. This value has to be between 0 and 1. 
In a same way, you can set it to -1 to turn the weight mode off. If you set the weight to 0, the animation will be considered paused.


```
var idleAnim = scene.beginWeightedAnimation(skeleton, 0, 89, 1.0, true);
var runAnim = scene.beginWeightedAnimation(skeleton, 125, 146, 0, true);

idleAnim.weight = 0.5;
runAnim.weight = 0.5
```

If your animations are not of the same size (same distance between from and to keys) then you will need to turn animation synchronization on with the following code:

```
// Synchronize animations
idleAnim.syncWith(runAnim);		
```

To disable animation synchronization, just call `animation.syncWith(null)`.

A complete demo can be find here: https://www.babylonjs-playground.com/#IQN716#9

## Additive animation blending
So far the type of animation blending we've gone over has been override blending. This means that adding influence to an animation takes influence away from other animations that are playing. The result is always normalized, so the more animations playing at the same time, the smaller amount of influence each individual animation has over the final result. All of the keyframes in override animations are stored relative to the object's parent. Say for example you have an object with 2 override animations. The first animation has a translation value of [0, 0, 0] at frame 0, then it interpolates to [0, 2, 0] on frame 30, then back to [0, 0, 0] on frame 60. The second animation has a translation value of [0, 0, 0] at frame 0, interpolates to [0, 0, 2] on frame 30, and then back to [0, 0, 0] on frame 60. If you played these animations simultaneously at full weight, frame 30 would result in a translation value of [0, 1, 1]. Neither the Y or Z axes would ever be able to fully reach a value of 2 with both animations playing. This behavior works great for transitioning between animations, like blending from a walk to a run, but what if you want the motions to build on top of each other? This is where additive animation becomes useful.

Additive animation is unique because it does not use that type of normalization logic. You can have N-number of additive animations playing simultaneously and each one will have the exact amount of influence specified. To accomplish this, additive animation values are relative to the current result of the override animations, not the parent. So if the second animation in the example above were to be played additively, frame 30 would result in a value of [0, 2, 2] because the second animation’s value adds on top of the first.

There are a few ways you can specify that you want an animation to be evaluated additively. First, an optional boolean `isAdditive` parameter has been added to all of the Scene methods for beginning animations. Check the [Scene API documentation](https://doc.babylonjs.com/api/classes/babylon.scene) to see the most up to date parameter lists for each method. This parameter is false by default and will set the new boolean `isAdditive` property of the resulting [Animatable](https://doc.babylonjs.com/api/classes/babylon.animatable#isadditive). This `isAdditive` property controls whether the Animatable should be evaluated additively and can be changed at any time. [AnimationGroups](https://doc.babylonjs.com/api/classes/babylon.animationgroup#isadditive) also now have an `isAdditive` accessor which is false by default. Setting this accessor will set the `isAdditive` properties of all of the Animatables controlled by the group.

One issue with additive animations is the problem of authoring for hierarchies. Because additive animations are evaluated relative to the result of other animations rather than the object's parent, it is not very intuitive to create them directly. To ease this burden, static `MakeAnimationAdditive` methods have been added to the [AnimationGroup](https://doc.babylonjs.com/api/classes/babylon.animationgroup#makeanimationadditive), [Skeleton](https://doc.babylonjs.com/api/classes/babylon.skeleton#makeanimationadditive) and [Animation](https://doc.babylonjs.com/api/classes/babylon.animation#makeanimationadditive) classes. These methods allow you to specify a frame in an existing animation and subtract it out of the rest of the keyframes in the animation to make them all relative to that specific pose.

[Click here](https://playground.babylonjs.com/#6I67BL#2) for a sample demonstrating how to convert animations to additive and blend them on top of override animations. The UI buttons allow you to blend between several override animations and the sliders blend in additive animations on top.

## Overriding properties
When you have a mesh with multiple animations or a skeleton (where all bones can be animated) you can use an animationPropertiesOverride to specify some general properties for all child animations. These properties will override local animation properties:

```
var overrides = new BABYLON.AnimationPropertiesOverride();

overrides.enableBlending = true;
overrides.blendingSpeed = 0.1;

skeleton.animationPropertiesOverride = overrides;
```

Here is the list of properties that can be overridden:
* enableBlending
* blendingSpeed
* loopMode

Please note that the scene.animationPropertiesOverride will be used if animation target does not contain one.

## Easing functions

You can add some behaviors to your animations, using easing functions. 
If you want more information about easing functions, here are some useful links : 
- [MSDN Easing functions documentation](http://msdn.microsoft.com/en-us/library/ee308751.aspx)
- [Easing functions cheat sheet](https://easings.net)

All those easing functions are implemented in BABYLON, allowing you to apply custom mathematical formulas to your animations.

Here are the predefined easing functions you can use : 
- ```BABYLON.CircleEase()```
- ```BABYLON.BackEase(amplitude)```
- ```BABYLON.BounceEase(bounces, bounciness)```
- ```BABYLON.CubicEase()```
- ```BABYLON.ElasticEase(oscillations, springiness)```
- ```BABYLON.ExponentialEase(exponent)```
- ```BABYLON.PowerEase(power)```
- ```BABYLON.QuadraticEase()```
- ```BABYLON.QuarticEase()```
- ```BABYLON.QuinticEase()```
- ```BABYLON.SineEase()```
- ```BABYLON.BezierCurveEase()```

You can use the **EasingMode** property to alter how the easing function behaves, that is, change how the animation interpolates. 
There are three possible values you can give for EasingMode: 

- ```BABYLON.EasingFunction.EASINGMODE_EASEIN``` : Interpolation follows the mathematical formula associated with the easing function.
- ```BABYLON.EasingFunction.EASINGMODE_EASEOUT``` : Interpolation follows 100% interpolation minus the output of the formula associated with the easing function.
- ```BABYLON.EasingFunction.EASINGMODE_EASEINOUT``` : Interpolation uses EaseIn for the first half of the animation and EaseOut for the second half.

Here is a straightforward sample to animate a torus within a ```CircleEase``` easing function :

```javascript
//Create a Vector3 animation at 30 FPS
var animationTorus = new BABYLON.Animation("torusEasingAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

// the torus destination position
var nextPos = torus.position.add(new BABYLON.Vector3(-80, 0, 0));

// Animation keys
var keysTorus = [];
keysTorus.push({ frame: 0, value: torus.position });
keysTorus.push({ frame: 120, value: nextPos });
animationTorus.setKeys(keysTorus);

// Creating an easing function
var easingFunction = new BABYLON.CircleEase();

// For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

// Adding the easing function to the animation
animationTorus.setEasingFunction(easingFunction);

// Adding animation to my torus animations collection
torus.animations.push(animationTorus);

//Finally, launch animations on torus, from key 0 to key 120 with loop activated
scene.beginAnimation(torus, 0, 120, true);
```

You can play with bezier curve algorithm too, using the **BezierCurveEase(x1, y1, x2, y2)** function. 
For purpose, here is a good reference to create your curve algorithm : [http://cubic-bezier.com](http://cubic-bezier.com)

Here is a pretty cool implementation using the bezier curve algorithm :

![](/img/how_to/Animations/bezier.jpg)

```javascript
var bezierEase = new BABYLON.BezierCurveEase(0.32, -0.73, 0.69, 1.59);
```

Finally, you can extend the **EasingFunction** base function to create your own easing function, like this :

```javascript
var FunnyEase = (function (_super) {
  __extends(FunnyEase, _super);
  function FunnyEase() {
    _super.apply(this, arguments);
  ;}
  FunnyEase.prototype.easeInCore = function (gradient) {
    // Here is the core method you should change to make your own Easing Function
    // Gradient is the percent of value change
    return Math.pow(Math.pow(gradient, 4), gradient);

  };
  return FunnyEase;
})(BABYLON.EasingFunction);
```
You will find a complete demonstration of the easing functions behaviors, in the playground : [**Easing function playground**](https://www.babylonjs-playground.com/#8ZNVGR)



## Attach events to animations

From Babylon.js version 2.3, you can attach [animation events](/api/classes/babylon.animationevent) to specific frames on an animation.

An event is a function that will be called at a given frame.

It's very simple to do this:
```javascript
// 3 parameters to create an event:
// - The frame at which the event will be triggered
// - The action to execute
// - A boolean if the event should execute only once (false by default)
var event1 = new BABYLON.AnimationEvent(50, function() { console.log("Yeah!"); }, true);
// Attach your event to your animation
animation.addEvent(event1);
```

## Deterministic lockstep
Sometimes it is important to make sure animations, physics and game logic code are in sync and decoupled by frame-rate variance. This might be useful to be able to replay how a scene evolved, given the same initial condition and inputs, or to minimize differences on multiple clients in a multi-user environment.

The principle is to quantize the state execution time, by updating the state at a fixed frequency with discrete time steps, keeping an accumulator so to carry over exceeding time to the next frame update.

To achieve this, Babylon engine needs to be created passing the following two options:

```javascript
this.engine = new BABYLON.Engine(theCanvas, true, {
  deterministicLockstep: true,
  lockstepMaxSteps: 4
});
```
This way, the scene will render quantizing physics and animation steps by discrete chunks of the timeStep amount, as set in the physics engine. For example:
```javascript
var physEngine = new BABYLON.CannonJSPlugin(false);
newScene.enablePhysics(this.gravity, physEngine);
physEngine.setTimeStep(1/60);
```
With the code above, the engine will run discrete steps at 60Hz (0.01666667s) and, in case of a late frame render time, it will try to calculate a maximum of 4 steps (lockstepMaxSteps) to recover eventual accumulated delay, before rendering the frame.

Note that when explicitly creating the CannonJSPlugin, it is important to pass false as _useDeltaForWorldStep parameter in its constructor, to disable CannonJS internal accumulator.

To run logic code in sync with the steps, there are the two following observables on the scene:

```javascript
newScene.onBeforeStepObservable.add(function(theScene){
  console.log("Performing game logic, BEFORE animations and physics for stepId: "+theScene.getStepId());
});

newScene.onAfterStepObservable.add(function(theScene){
  console.log("Performing game logic, AFTER animations and physics for stepId: "+theScene.getStepId());
});
```
Using them allows running arbitrary logic code before and after animations and physics are updated.

In the following example, you can see in console the stepId in which the sphere is considered at rest and the rotation value for the rotating box. Multiple runs will always result in the same values, whatever the frame-rate.

https://www.babylonjs-playground.com/#DU4FPJ#3


