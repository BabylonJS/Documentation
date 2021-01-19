---
title: The Scene Optimizer
image: 
description: Learn all about the scene optimizer in Babylon.js.
keywords: diving deeper, scene, optimize, scene optimizer
further-reading:
video-overview:
video-content:
---

## How To Use SceneOptimizer

Rendering a scene on a browser is a great experience because you can reach a lot of different users and hardware. But the main associated caveat is that you can encounter very low-end devices.

The SceneOptimizer tool is designed to help you reach a specific framerate by gracefully degrading rendering quality at runtime.

## Basic usage
To start using the SceneOptimizer, you can create a new ```BABYLON.SceneOptimizer``` instance.
The SceneOptimizer constructor requires the current scene and a ```BABYLON.SceneOptimizerOptions``` object (we will get back to it later):

```
var options = new BABYLON.SceneOptimizerOptions();
options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));

// Optimizer
var optimizer = new BABYLON.SceneOptimizer(scene, options);
```

When creating the SceneOptimizer you can provide the following parameters:
- A ```BABYLON.Scene``` which will defines the scene to work on
- A ```BABYLON.SceneOptimizerOptions``` which will defines the options to use with the SceneOptimizer
- A ```boolean``` which will defines if priorities must be generated and not read from SceneOptimization property (true by default)
- A ```boolean``` which will defines if the optimizer will run in improvement mode (see below) (false by default)

The SceneOptimizer object allows you to set several properties:
- ```optimizations```: This property contains the list of current optimizations
- ```targetFrameRate```: This property defines the target frame rate to reach (60 by default)
- ```trackerDuration```: This property defines the interval between two checks (2000ms by default)
- ```currentFrameRate```: This property (read-only) gets the current frame rate checked by the SceneOptimizer
- ```currentPriorityLevel```: This property (read-only) gets the current priority level (0 at start)
- ```onSuccessObservable```: This property defines an observable called when the optimizer reaches the target frame rate
- ```onNewOptimizationAppliedObservable```: This property defines an observable called when the optimizer enables an optimization
- ```onFailureObservable```: This property defines an observable called when the optimizer is not able to reach the target frame rate

It also provides several functions:
- ```start()```: used to start the overall optimization process
- ```stop()```: used to stop the current process
- ```reset()```: used to restore the current priority level to 0
- ```dispose()```: used to release all resources

## Helper
You can also decide to use a static helper that will create everything you need in one line. ```BABYLON.SceneOptimizer.OptimizeAsync()```. You can call this function when you want to optimize your scene. The simplest call you can do is the following:

```javascript
BABYLON.SceneOptimizer.OptimizeAsync(scene),
```

You have to provide at least a scene. That previous code line is actually equivalent to this:

```javascript
BABYLON.SceneOptimizer.OptimizeAsync(scene, BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(),
function() {
   // On success
}, function() {
   // FPS target not reached
});
```

As you can see, you can provide success/fail callbacks and a set of options.
Please note that the ```BABYLON.SceneOptimizer.OptimizeAsync()``` function returns a SceneOptimizer object which is created with `autoGeneratePriorities` to false.

## Options
A set of options contains a list of optimizations to apply in a specific order. As soon as the target FPS is reached, the SceneOptimizer stops. There are different layers (or passes) that are applied one after another. The SceneOptimizer pauses between each layer to ensure a stable FPS, for measuring.

By default, there are 3 sets available:

```javascript
BABYLON.SceneOptimizerOptions.LowDegradationAllowed()
BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed()
BABYLON.SceneOptimizerOptions.HighDegradationAllowed()
```

All these sets return a ```BABYLON.SceneOptimizerOptions``` object configured with progressive degradations.

Here are the properties available on a ```BABYLON.SceneOptimizerOptions``` object:

* targetFrameRate: a number defining the FPS you want to achieve (60 by default)
* optimizations: an array of ```BABYLON.SceneOptimization``` objects.
* trackerDuration: time in milliseconds between passes (2000 by default)

SceneOptimizer comes with some out-of-the-box optimizations:

* ```BABYLON.MergeMeshesOptimization(priority)```: This optimization will merge meshes with same material.
* ```BABYLON.TextureOptimization(priority, maximumSize)```: This optimization tries to reduce the size of render textures.
* ```BABYLON.HardwareScalingOptimization(priority, maximumScale)```: This optimization increments or decrements the value of hardware scaling. This is a really aggressive optimization that could really help if you are GPU bound.
* ```BABYLON.ShadowsOptimization(priority)```: This optimization disables shadows (It will turn them on if the optimizer is in improvement mode (see below)).
* ```BABYLON.PostProcessesOptimization(priority)```: This optimization disables post-processes (It will turn them on if the optimizer is in improvement mode (see below)).
* ```BABYLON.LensFlaresOptimization(priority)```: This optimization disables lens flares (It will turn them on if the optimizer is in improvement mode (see below)).
* ```BABYLON.ParticlesOptimization(priority)```: This optimization disables particles (It will turn them on if the optimizer is in improvement mode (see below)).
* ```BABYLON.RenderTargetsOptimization(priority)```: This optimization disables render targets (It will turn them on if the optimizer is in improvement mode (see below)).
* ```BABYLON.CustomOptimization(priority)```: This optimization will call two callbacks when required: 
 * ```onApply(scene, optimizer)```: A custom callback used to apply custom optimizations. It must return true if all optimizations where applied
 * ```onGetDescription()```: This callback must return a string describing the action of the optimization

Based on these optimizations, the basic sets are configured like this:

* BABYLON.SceneOptimizerOptions.LowDegradationAllowed():
 * Level 0: MergeMeshesOptimization, ShadowsOptimization and LensFlaresOptimization
 * Level 1: PostProcessesOptimization and ParticlesOptimization
 * Level 2: TextureOptimization(2, 1024)
* BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed():
 * Level 0: MergeMeshesOptimization, ShadowsOptimization and LensFlaresOptimization
 * Level 1: PostProcessesOptimization and ParticlesOptimization
 * Level 2: TextureOptimization(2, 512)
 * Level 3: RenderTargetsOptimization
 * Level 4: HardwareScalingOptimization(4, 2)
* BABYLON.SceneOptimizerOptions.HighDegradationAllowed():
 * Level 0: MergeMeshesOptimization, ShadowsOptimization and LensFlaresOptimization
 * Level 1: PostProcessesOptimization and ParticlesOptimization
 * Level 2: TextureOptimization(2, 256)
 * Level 3: RenderTargetsOptimization
 * Level 4: HardwareScalingOptimization(4, 4)

## Advanced usage
You can create your own set of options with the following code (please note that if `autoGeneratePriorities` is true, you don't need to define the priority value)

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

You can also create your own optimization by creating your own object:

```javascript
function mySceneOptimization(priority) {
  if (typeof priority === "undefined") {
     priority = 0;
  }

  this.priority = priority;
  this.apply = function (scene) {
    // Work on scene...
    return true;
  };

 this.getDescription = function () {
    return "Applying some changes to the scene";
  };
}
```

## Improvement mode
When created in improvement mode (4th parameter of the constructor), the SceneOptimizer object will run all optimization while the current FPS is above the target frame rate. So, for instance if, the target FPS is 60, the optimizer will execute all optimizations in its list while the FPS remains at 60. It is a good tool to provide rendering improvements to a given scene.
Please note that when in improvement mode, the optimizations will adapt their behavior automatically (for instance, the ShadowsOptimization will turn shadows on instead of off).

## Demo
A demo can be found here: <Playground id="#3Q8PCL" title="Scene Optimizer Example" description="Simple example of how to use the scene optimizer."/>
