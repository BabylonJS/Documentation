---
title: The Scene Optimizer
image: 
description: Learn all about the scene optimizer in Babylon.js.
keywords: diving deeper, scene, optimize, scene optimizer
further-reading:
video-overview:
video-content:
---

## How To Use **SceneOptimizer**

Rendering a scene in a browser is great because you can reach many different users and hardware configurations. However, the main caveat is that you may encounter very low-end devices.

The `SceneOptimizer` tool is designed to help you reach a specific framerate by gracefully degrading rendering quality at runtime.

## Basic usage

To start using the `SceneOptimizer`, you can create a new `BABYLON.SceneOptimizer` instance.
The `SceneOptimizer` constructor requires the current scene and a `BABYLON.SceneOptimizerOptions` object (we will come back to it later).

```javascript
var options = new BABYLON.SceneOptimizerOptions();
options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));

// Optimizer
var optimizer = new BABYLON.SceneOptimizer(scene, options);
```

When creating the `SceneOptimizer`, you can provide the following parameters:
- A `BABYLON.Scene` which will define the scene to work on
- A `BABYLON.SceneOptimizerOptions` which will define the options to use with the `SceneOptimizer`
- A `boolean` which will define if priorities must be generated and not read from `SceneOptimization` property (true by default)
- A `boolean` which will define if the optimizer will run in improvement mode (see below) (false by default)

The `SceneOptimizer` object allows you to set several properties:
- `optimizations`: This property contains the list of current optimizations
- `targetFrameRate`: This property defines the target frame rate to reach (60 by default)
- `trackerDuration`: This property defines the interval between two checks (2000ms by default)
- `currentFrameRate`: This property (read-only) gets the current frame rate checked by the `SceneOptimizer`
- `currentPriorityLevel`: This property (read-only) gets the current priority level (0 at start)
- `onSuccessObservable`: This property defines an observable called when the optimizer reaches the target frame rate
- `onNewOptimizationAppliedObservable`: This property defines an observable called when the optimizer enables an optimization
- `onFailureObservable`: This property defines an observable called when the optimizer is not able to reach the target frame rate

It also provides several functions:
- `start()`: used to start the overall optimization process
- `stop()`: used to stop the current process
- `reset()`: used to restore the current priority level to 0
- `dispose()`: used to release all resources

## Helper

You can also use a static helper that will create everything you need in one line: `BABYLON.SceneOptimizer.OptimizeAsync()`. You can call this function when you want to optimize your scene. The simplest call is the following:

```javascript
BABYLON.SceneOptimizer.OptimizeAsync(scene),
```

You have to provide at least a scene. That previous line of code is actually equivalent to this:

```javascript
BABYLON.SceneOptimizer.OptimizeAsync(scene, BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(),
function() {
   // On success
}, function() {
   // FPS target not reached
});
```

As you can see, you can provide success/fail callbacks and a set of options.
Please note that the `BABYLON.SceneOptimizer.OptimizeAsync()` function returns a `SceneOptimizer` object which is created with `autoGeneratePriorities` set to false.

## Options

A set of options contains a list of optimizations to apply in a specific order. As soon as the target FPS is reached, the `SceneOptimizer` stops. There are different layers (or passes) that are applied one after another. The `SceneOptimizer` pauses between each layer to ensure a stable FPS and to measure it. Create a `BABYLON.SceneOptimizerOptions` like this:

```javascript
// With a target framerate of 50fps and a check|rate of 500ms
let optimizerOptions = new BABYLON.SceneOptimizerOptions(50, 500);
```

Here are the properties available on a `BABYLON.SceneOptimizerOptions` instance:

* `targetFrameRate`: a number defining the FPS you want to achieve (60 by default)
* `optimizations`: an array of `BABYLON.SceneOptimization` objects.
* `trackerDuration`: time in milliseconds between passes (2000 by default)

By default, there are 3 sets available:

```javascript
BABYLON.SceneOptimizerOptions.LowDegradationAllowed()
BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed()
BABYLON.SceneOptimizerOptions.HighDegradationAllowed()
```

All these sets return a `BABYLON.SceneOptimizerOptions` object configured with progressive degradations.

Based on these optimizations, the basic sets are configured like this:

* **BABYLON.SceneOptimizerOptions.LowDegradationAllowed()**:

  

   * Level 0: `MergeMeshesOptimization`, `ShadowsOptimization` and `LensFlaresOptimization`
   * Level 1: `PostProcessesOptimization` and `ParticlesOptimization`
   * Level 2: `TextureOptimization(2, 1024)`

* **BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed()**:

  

   * Level 0: `MergeMeshesOptimization`, `ShadowsOptimization` and `LensFlaresOptimization`
   * Level 1: `PostProcessesOptimization` and `ParticlesOptimization`
   * Level 2: `TextureOptimization`(2, 512)
   * Level 3: `RenderTargetsOptimization`
   * Level 4: `HardwareScalingOptimization`(4, 2)

* **BABYLON.SceneOptimizerOptions.HighDegradationAllowed()**:

  

   * Level 0: `MergeMeshesOptimization`, `ShadowsOptimization` and `LensFlaresOptimization`
   * Level 1: `PostProcessesOptimization` and `ParticlesOptimization`
   * Level 2: `TextureOptimization(2, 256)`
   * Level 3: `RenderTargetsOptimization`
   * Level 4: `HardwareScalingOptimization(4, 4)`

## The Built-in Optimizations.

The `priority` of an optimization is used by the `SceneOptimizer` to form a queue of optimizations. When performing optimizations, the `SceneOptimizer` starts with optimizations with lower `priority`, then continues to optimizations with higher `priorities`:



* `BABYLON.MergeMeshesOptimization(priority)`: This optimization will merge meshes with the same material.
* `BABYLON.TextureOptimization(priority, maximumSize)`: This optimization tries to reduce the size of render textures.
* `BABYLON.HardwareScalingOptimization(priority, maximumScale)`: This optimization increments or decrements the value of hardware scaling. This is a really aggressive optimization that could really help if you are GPU-bound.
* `BABYLON.ShadowsOptimization(priority)`: This optimization disables shadows (It will turn them on if the optimizer is in improvement mode (see below)).
* `BABYLON.PostProcessesOptimization(priority)`: This optimization disables post-processes (It will turn them on if the optimizer is in improvement mode (see below)).
* `BABYLON.LensFlaresOptimization(priority)`: This optimization disables lens flares (It will turn them on if the optimizer is in improvement mode (see below)).
* `BABYLON.ParticlesOptimization(priority)`: This optimization disables particles (It will turn them on if the optimizer is in improvement mode (see below)).
* `BABYLON.RenderTargetsOptimization(priority)`: This optimization disables render targets (It will turn them on if the optimizer is in improvement mode (see below)).
* `BABYLON.CustomOptimization(priority)`: This optimization will call two callbacks when required: 
 * `onApply(scene, optimizer)`: A custom callback used to apply custom optimizations. It must return true if all optimizations were applied
 * `onGetDescription()`: This callback must return a string describing the action of the optimization

### Custom Optimizations.

You can create your own optimizations by extending the class `BABYLON.CustomOptimization`. The new class must provide two functions, `onApply` and `onGetDescription`. Every instance takes a `priority` as its only argument, and it must be a number. For example:

```javascript
class MyCustomOptimization extends BABYLON.CustomOptimization{
    constructor(priority){
        super(priority)
    }

    onApply(){
        // Some optimizing code
    }
    onGetDescription(){
        // A desription of your optimization
        return "I make framerate go prrrr!";
    }
};

options.addOptimization(new MyCustomOptimization(2));
```

A much simpler shorthand is available, using the `addCustomOptimization` method, on a `BABYLON.SceneOptimizerOptions()` instance:

```javascript
// Using shorthand syntax, fn(onApply, onGetDescrition, priority)
options.addCustomOptimization(function () {
	// Some optimizing code
}, function () {
    return "Making optimizations...";
}, 0.6);
```

## Advanced Usage

You can create your own set of options with the following code (please note that if `autoGeneratePriorities` is true, you don't need to define the priority value):

```javascript
var result = new BABYLON.SceneOptimizerOptions(60, 2000);

var priority = 0;
result.optimizations.push(new BABYLON.ShadowsOptimization(priority));
result.optimizations.push(new BABYLON.LensFlaresOptimization(priority));

// Next priority
priority++;
result.optimizations.push(new BABYLON.PostProcessesOptimization(priority));
result.optimizations.push(new BABYLON.ParticlesOptimization(priority));

// Next priority
priority++;
result.optimizations.push(new BABYLON.TextureOptimization(priority, 256));

// Next priority
priority++;
result.optimizations.push(new BABYLON.RenderTargetsOptimization(priority));

// Next priority
priority++;
result.optimizations.push(new BABYLON.HardwareScalingOptimization(priority, 4));

return result;
```

## Improvement Mode

When created in improvement mode (4th parameter of the constructor), the `SceneOptimizer` object will run all optimizations while the current FPS is above the target frame rate. So, for instance, if the target FPS is 60, the optimizer will execute all optimizations in its list while the FPS remains at 60. It is a good tool for providing rendering improvements to a given scene.
Please note that when in improvement mode, the optimizations will adapt their behavior automatically (for instance, the `ShadowsOptimization` will turn shadows on instead of off).

## Demos

<Playground id="#3Q8PCL" title="Scene Optimizer Example" description="Simple example of how to use the scene optimizer."/>

<Playground id="#WZNAU4#4" title="CustomOptimization Example" description="A Playground Example Of The CustomOptimization in action"/>
