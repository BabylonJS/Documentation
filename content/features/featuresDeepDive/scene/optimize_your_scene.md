---
title: Optimizing Your Scene
image: 
description: Learn how to optimize your scene in Babylon.js.
keywords: diving deeper, scene, optimization, optimize
further-reading:
    - title: How to Use Scene Optimizer
      url: /features/featuresDeepDive/scene/sceneOptimizer
    - title: How To Optimize Your Scene With Octrees
      url: /features/featuresDeepDive/scene/optimizeOctrees
    - title: Multiview VR optimization
      url: /features/featuresDeepDive/cameras/multiViewsPart1
video-overview:
video-content:
---

## How To Optimize Your Scene

This tutorial will help you find some links and info on how you can improve your scene regarding rendering performance.

## Use TransformNode instead of AbstractMesh or empty meshes

If you need node containers or transform nodes, do not use meshes but TransformNode instead. Use meshes only when associated with content to render.

The meshes need to go through an evaluation process where the camera checks if they are in the frustum. This is an expensive process so reducing the number of candidates by using TransformNode when possible is a good practice.

## Reducing Shaders Overhead
Babylon.js uses an advanced and automatic shaders engine. This system will keep shaders up to date regarding material options. If you are using a static material (ie. an immutable material) then you can let it know to Babylon.js by using the following code:

```
material.freeze();
```

Once frozen, the shader will remain unchanged even if you change material's properties. You will have to unfreeze it to update the inner shader:

```
material.unfreeze();
```

## Reducing World Matrices Computation
Every mesh has a world matrix to specify its position / rotation / scaling. This matrix is evaluated on every frame. You can improve performances by freezing this matrix. Any subsequent changes to position / rotation / scaling will then be ignore:

```
mesh.freezeWorldMatrix();
```

You can unfreeze a mesh with:

```
mesh.unfreezeWorldMatrix();
```

## Freezing the active meshes
If you are CPU bound, you can decide to keep the list of active meshes unchanged and then free the time spent by the CPU to determine active meshes:

```
scene.freezeActiveMeshes();
```

You can unfreeze the active meshes with:

```
scene.unfreezeActiveMeshes();
```

Note that you can force a mesh to be in the active meshes before freezing the list with `mesh.alwaysSelectAsActiveMesh = true`.

Freezing active meshes list may cause some things on the scene to stop updating. One example is [RenderTargetTexture](/features/featuresDeepDive/postProcesses/renderTargetTextureMultiPass), if it's used by mesh materials. For that case RTT needs to be explicitly added to the list of active camera's custom render targets, which will guarantee that it ends up in the render list of the scene:

```javascript
camera.customRenderTargets.push(renderTargetTexture);
```

## Not updating the bounding info
In conjonction with `mesh.alwaysSelectAsActiveMesh` you can also decide to turn off bounding info synchronization. This way the world matrix computation will be faster as the bounding info will not be updated (this could be a problem if you want to use picking or collisions):

```
mesh.doNotSyncBoundingInfo = true;
```

## Not picking the scene on pointer move
On every pointer move, the scene is browsing the list of meshes to see if a mesh under the pointer may need to have an associated action / event raised. 
To avoid this process, you can set `scene.skipPointerMovePicking = true`.

Please note that by doing it, you will have no event over any mesh when the pointer will move (And `scene.meshUnderPointer` will not be updated even if `scene.constantlyUpdateMeshUnderPointer === true`.

## Reducing draw calls
As soon as you can please use [instances](/features/featuresDeepDive/mesh/copies/instances) as they are drawn with one single draw call.

If sharing the same material is a problem, you can then think about using clones which share the same geometry with `mesh.clone("newName")`

One remark regarding instances: If one of the instances has a world matrix with a different determinant (eg. one instance has a negative scale where others don't), babylon.js will be forced to remove the back face culling from their material.

## Reducing calls to gl.clear()
By default, Babylon.js automatically clears the color, depth, and stencil buffers before rendering the scene. It also clears the depth and stencil buffers after switching to a new camera and before rendering a new RenderingGroup. On systems with poor fill rates, these can add up quickly and have a significant impact on performance.

If your scene is set up in such a way that the viewport is always 100% filled with opaque geometry (if you're always inside a skybox, for instance), you can disable the default scene clearing behavior with:

```
scene.autoClear = false; // Color buffer
scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
```

If you know that the geometry in a particular RenderingGroup will always be positioned in front of geometry from other groups, you can disable buffer clearing for that group with the following:

```
scene.setRenderingAutoClearDepthStencil(renderingGroupIdx, autoClear, depth, stencil);
```
```autoClear```: ```true``` to enable auto clearing. If ```false```, overrides ```depth``` and ```stencil```

```depth```: Defaults to ```true``` to enable clearing of the depth buffer

```stencil```: Defaults to ```true``` to enable clearing of the stencil buffer

Go ahead and be aggressive with these settings. You'll know if it's not appropriate for your application if you see any smearing!

## Using depth pre-pass
When dealing with complex scenes, it could be useful to use depth pre-pass. This technique will render designated meshes only in the depth buffer to leverage early depth test rejection. This could be used for instance when a scene contains meshes with advanced shaders.
To enable a depth pre-pass for a mesh, just call `mesh.material.needDepthPrePass = true`.

## Using unindexed meshes
By default Babylon.js uses indexed meshes where vertices can be reuse by faces. When vertex reuse is low and when vertex structure is fairly simple (like just a position and a normal) then you may want to unfold your vertices and stop using indices:

```
mesh.convertToUnIndexedMesh();
```
For example this works very well for a cube where it is more efficient to send 32 positions instead of 24 positions and 32 indices.

## Turning AdaptToDeviceRatio Off/On
By default, Babylon.js does not adapt to device ratio anymore. It by default focuses on perf vs quality after receiving lots of community requests.

The drawback is that this could look low rea. You can turn it on with the fourth parameter of the Engine constructor:

```
var engine = new BABYLON.Engine(canvas, antialiasing, null, true);
```

## Blocking the dirty mechanism

By default the scene will keep all materials up to date when you change a property that could potentially impact them (alpha, texture update, etc...). To do so the scene needs to go through all materials and flag them as dirty. This could be a potential bottleneck if you have a lot of material.

To prevent this automatic update, you can execute:

```
scene.blockMaterialDirtyMechanism = true;
```

Do not forget to restore it to false when you are done with your batch changes.

## Using Animation Ratio
Babylon.js processes speed depending on the current frame rate.

On low-end devices animations or camera movement may differ from high-end devices. To compensate this you can use:

```
scene.getAnimationRatio();
```

The return value is higher on low frame rates.

## Handling WebGL context lost
Starting with version 3.1, Babylon.js can handle [WebGL context lost event](https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14.13). This event is raised by the browser when the GPU needs to be taken away from your code. This can happen for instance when using WebVR in hybrid scenario (with multiple GPU). In this case, Babylon.js has to recreate ALL low level resources (including textures, shaders, program, buffers, etc.). The process is entirely transparent and done under the hood by Babylon.js.

As a developer you should not be concerned by this mechanism. However, to support this scenario, Babylon.js may need an additional amount of memory to keep track of resources creation. If you do not need to support WebGL context lost event, you can turn off the tracking by instantiating your engine with doNotHandleContextLost option set to true.

If you created resources that need to be rebuilt (like vertex buffers or index buffers), you can use the `engine.onContextLostObservable` and `engine.onContextRestoredObservable` observables to keep track of the context lost and context restored events.

## Scene with large number of meshes
If you have a large number of meshes in a scene, and need to reduce the time spent when adding/removing those meshes to/from the scene, There are several options of the `Scene` constructor that can help :
 - Setting the option `useGeometryIdsMap` to `true` will speed-up the addition and removal of `Geometry` in the scene.
 - Setting the option `useMaterialMeshMap` to `true` will speed-up the disposing of `Material` by reducing the time spent to look for bound meshes.
 - Setting the option `useClonedMeshMap` to `true` will speed-up the disposing of `Mesh` by reducing the time spent to look for associated cloned meshes.

For each of this options turned on, Babylon.js will need an additional amount of memory.

Also, If you are disposing a large number of meshes in a row, you can save unnecessary computation by turning the scene property `blockfreeActiveMeshesAndRenderingGroups` to true just before disposing the meshes, and set it back to `false` just after, like this :
````javascript

scene.blockfreeActiveMeshesAndRenderingGroups = true;
/*
 * Dispose all the meshes in a row here
 */
scene.blockfreeActiveMeshesAndRenderingGroups = false;

````
## Changing Mesh Culling Strategy
The culling is the process to select whether a mesh must be passed to the GPU to be rendered or not. It's done CPU side.  
If a mesh intersects the camera frustum in some way then it's passed to the GPU.  
Depending on its accuracy (checking mesh bouding boxes or bouding spheres only, trying to include or to exclude fast the mesh from the frustum), this process can be time consuming.   
In the other hand, reducing this process accuracy to make it faster can lead to some false positives : some meshes are passed to the GPU, are computed there and won't be finally visible in the viewport.   
By default, BABYLON applies "Bounding Sphere Only" exclusion test to check if a mesh is in the camera frustum.  
You can change this behaviour for any mesh of your scene at any time (and change it back then, if needed) this the property `mesh.cullingStrategy`.  
```javascript 
/**
* Possible values : 
         * - BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD  
         * - BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY  
         * - BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION  
         * - BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY  
*/

mesh.cullingStrategy = oneOfThePossibleValues;
```
* Standard : the more accurate and standard one (exclusion test)  
* Bounding Sphere Only : faster but less accurate (exclusion test)  
* Optimistic Inclusion : mesh center inclusion test then standard exclusion test, for meshes almost always expected in the frustum. Same accuracy than the standard test.  
* Optimistic Inclusion Then Bounding Sphere Only : mesh center inclusion test, then bounding sphere exclusion test only. Same accuracy than the bSphereOnly test, interesting for almost always in the frustum meshes.  

Optimistic Inclusion modes give a little gain. They keep the same accuracy than the basic mode on what they are applied (standard or bSphereOnly).  
BoundingSphereOnly modes, because they reduce a lot the accuracy, give a good perf gain. These should not be used with high poly meshes while sending false positives to the GPU has a real rendering cost. These can be very interesting for numerous low poly meshes instead. *Really useful if you are CPU bound**.  

## Performance Priority Modes

Starting with Babylon.js 5.22, you can now change how the scene will treat performance regarding backward compatibility and ease of use.

### Backward compatiblity mode (default)
By default, `scene.performancePriority` is set to `BABYLON.ScenePerformancePriority.BackwardCompatible`. In this mode, there is simply no change. The scene will keep prioritizing ease of use and backward compatibility.

### Intermediate mode
If you switch the `performancePriority` to `BABYLON.ScenePerformancePriority.Intermediate`, the scene will automatically:
* Freeze materials when they are ready. If you need to change something on a material, you will have to call `material.unfreeze()`, do your changes, and then call `material.freeze()` again
* New meshes will have their `alwaysSelectAsActiveMesh` property set to true. The system will then skip frustrum clipping for the mesh and always set it to active (saving complex CPU operations). Keep in mind to turn it off if your scene is GPU bound
* New meshes will have their `isPickable ` property set to false. Picking and action managers will not work anymore. You can always turn that property back on if you need picking for a specific mesh
* `scene.skipPointerMovePicking ` will be turned on (meaning that there will be no OnPointerMove events)
* `scene.autoClear` will be turned off

### Agressive mode
If you switch the `performancePriority` to `BABYLON.ScenePerformancePriority.Aggressive`, the scene will automatically:
* Enable all features of the `Intermediate` mode
* The scene will skip all the frustum clipping phase entirely (`scene.skipFrustumClipping` will be set to true)
* New meshes will have their `doNotSyncBoundingInfo` set to true
* The manager will not reset between frames (`scene.renderingManager.maintainStateBetweenFrames` is set to true). This means that if a mesh becomes invisible or transparent it will not be visible until this boolean is set to false again

 

** Please note that the `Intermediate` and `Aggressive` modes will not be backward compatible, which means that we will probably add more features in these modes in the future to support performance first**

Here is an example: <Playground id="#6HWS9M" title="Performance Mode Example" description="Simple example of using Performance Mode."/>

## Instrumentation
Instrumentation is a key tool when you want to optimize a scene. It will help you figure out where are the bottlenecks so you will be able to optimize what needs to be optimized.

### EngineInstrumentation
The EngineInstrumentation class allows you to get the following counters:
* *gpuFrameTimeCounter*: Time (in nanoseconds) spent by the GPU to render a single frame. Must be turned on with `instrumentation.captureGPUFrameTime = true`.
* *shaderCompilationTimeCounter*: Time (in milliseconds) spent by the CPU to compile all shaders. Must be turned on with `instrumentation.captureShaderCompilationTime = true`.

Here is an example of how to use engine instrumentation:
<Playground id="#HH8T00#1" title="Engine Instrumentation Example" description="Simple example of using engine instrumentation."/>

Please note that each counter is *PerfCounter* object which can provide multiple properties like average, total, min, max, count, etc.

The GPU timer requires a special extension (EXT_DISJOINT_TIMER_QUERY - also sometimes reported with the \_webgl2 prefix in WebGL2 context) in order to work. This extension had been disabled due to Spectre and Meltdown on all major browsers, but some have added it back, like Chrome and Edge. You can check if your browser supports this extension on the [Khronos SDK test page](https://www.khronos.org/registry/webgl/sdk/tests/conformance/extensions/ext-disjoint-timer-query.html) or on [WebGL report](https://webglreport.com/?v=2).

* Note: On Chrome mobile, this extension can be enabled at `chrome://flags#enable-webgl-developer-extensions` followed by a browser restart

### SceneInstrumentation
The SceneInstrumentation class allows you to get the following counters (per scene):
* *activeMeshesEvaluationTimeCounter*: Time (in milliseconds) spent to evaluate active meshes (based on active camera frustum). Must be turned on with `instrumentation.captureActiveMeshesEvaluationTime = true`.
* *renderTargetsRenderTimeCounter*: Time (in milliseconds) spent to render all render target textures. Must be turned on with `instrumentation.captureRenderTargetsRenderTime = true`.
* *drawCallsCounter*: Number of draw calls (actual calls to engine.draw) per frame. A good advice is to keep this number as small as possible.
* *frameTimeCounter*: Time (in milliseconds) spent to process an entire frame (including animations, physics, render targets, special fx, etc.). Must be turned on with `instrumentation.captureFrameTime = true`.
* *renderTimeCounter*: Time (in milliseconds) spent to render a frame. Must be turned on with `instrumentation.captureRenderTime = true`.
* *interFrameTimeCounter*: Time (in milliseconds) spent between two frames. Must be turned on with `instrumentation.captureInterFrameTime = true`.
* *particlesRenderTimeCounter*: Time (in milliseconds) spent rendering particles (including animations). Must be turned on with `instrumentation.captureParticlesRenderTime = true`.
* *spritesRenderTimeCounter*: Time (in milliseconds) spent rendering sprites. Must be turned on with `instrumentation.captureSpritesRenderTime = true`.
* *physicsTimeCounter*: Time (in milliseconds) spent simulating physics. Must be turned on with `instrumentation.capturePhysicsTime = true`.
* *cameraRenderTimeCounter*: Time (in milliseconds) spent to render a camera. Must be turned on with `instrumentation.captureCameraRenderTime = true`.

Those counters are all reset to 0 at the beginning of each frame. Therefore it is easier to access them in the onAfterRender callback or observable.

## Inspector

Starting with Babylon.js v4.0 you can use the Inspector to [analyze your scene](/toolsAndResources/inspector#inspector-pane) or turn on/off features or [debugging tools](/toolsAndResources/inspector#specific-debug-tools).

## VR/XR scenarios

When usingBabylon.js with WebVR or WebXR, enabling [Multiview](/features/featuresDeepDive/cameras/multiViewsPart1) is a quick way to almost double the rendering speed.
