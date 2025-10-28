---
title: Overview of the frame graph framework
image:
description: Learn all about the Babylon.js Frame Graph system.
keywords: diving deeper, frame graph, rendering, node editor, overview
---

See the [Basic Concepts and Getting Started](/features/featuresDeepDive/frameGraph/frameGraphBasicConcepts) section for general information on nomenclature and an overview of the frame graph concept.

Note that the implementation of the framework is inspired by Unity's [Render Graph System](https://docs.unity3d.com/6000.2/Documentation/Manual/urp/render-graph-introduction.html).

The frame graph class framework consists of several main classes, described below.

## [FrameGraph](/typedoc/classes/babylon.framegraph)
This is the main class, whose purpose is to allow you to build and execute a frame graph.

### Main methods and properties
* `addTask(task)`. Adds a task to the graph.
* `addPass(name, whenTaskDisabled)`, `addRenderPass(name, whenTaskDisabled)`, `addCullPass(name, whenTaskDisabled)`. Methods that create a new pass for the currently processed task and return that pass. These methods can only be called from a `FrameGraphTask.record()` method, which is the method responsible for creating the passes used by the task.
* `build()`. Traverses all tasks in the graph and calls their `record()` method, which in turn will create the task's passes. This is also when the actual textures are allocated and linked to the texture handles created in the frame graph.
* `execute()`. Traverses all tasks in the graph and executes the passes for each of them.
* **textureManager**. This property gives you access to the frame graph's [Texture manager](#framegraphtexturemanager).
* **optimizeTextureAllocation**. This property indicates that texture allocation should be optimized (i.e., reuse existing textures when possible to limit GPU memory usage).

### List of tasks
The graph itself is stored as a list (array) of tasks: explicit connections between task inputs and outputs are not stored in this class, it is up to the user to add tasks to the graph in the correct order, so that a task T2 that requires the result of another task T1 is added after T1.

Tasks are (implicitly) connected together through their input and output properties: these are simple properties that are declared at the class level. For existing tasks in the framework, output properties are generally prefixed with **output** to differentiate them from inputs.

### Code example
Outline of operations for creating and using a frame graph:
```typescript
const frameGraph = new BABYLON.FrameGraph(scene);

// Clear task
const clearTask = new BABYLON.FrameGraphClearTextureTask("clear", frameGraph);

// Defines the task inputs
clearTask.targetTexture = colorTexture;
clearTask.depthTexture = depthTexture;

// Adds the task to the graph
frameGraph.addTask(clearTask);

// Render task
const renderTask = new BABYLON.FrameGraphObjectRendererTask("renderObjects", frameGraph, scene);

// Connects certain inputs of the class to the outputs of the Clear task
renderTask.targetTexture = clearTask.outputTexture;
renderTask.depthTexture = clearTask.outputDepthTexture;

// Defines other inpputs
renderTask.objectList = rlist;
renderTask.camera = camera;

// Adds the task to the graph
frameGraph.addTask(renderTask);

...adds other tasks...

// Builds the graph when all tasks have been added
frameGraph.build();

// Wait until everything is ready to be run / executed
await frameGraph.whenReadyAsync();

// When you want to render the graph, calls:
frameGraph.execute();

// Alternatively, if you set the graph at scene level, execute() will be called automatically every frame
scene.frameGraph = frameGraph;
```

## [FrameGraphTask](/typedoc/classes/babylon.framegraphtask)
This is the base class for a task in a frame graph. A task is usually a rendering process, but it may also be unrelated to rendering (for example, we have a culling task in the frame graph to cull objects relative to a camera).

### Main methods and properties
* `record()`. Called by `FrameGraph` at build time, it is responsible for creating passes for the task.
* **disabled**. Property that allows you to enable/disable a task.
* **dependencies**. Property that allows you to define the dependencies (texture) of the task.

### Passes
The main purpose of a task is to manage a list of passes: these passes are executed when the `execute()` method of the frame graph is called (which in turn calls the `_execute()` method of each task).

Passes are created by the `record()` method, which is the main method of a task, and must be implemented by classes extending `FrameGraphTask` (`record()` is abstract in `FrameGraphTask`). Different types of passes can be created (normal passes, rendering passes, and culling passes). The type of pass you create (by calling the appropriate method of `FrameGraph`) determines the type of context that the callback passed to `Pass.setExecuteFunc(func: (context: T) => void)` receives, which is the function executed when the pass is executed:
* [FrameGraphContext](/typedoc/classes/babylon.framegraphcontext) for normal passes
* [FrameGraphRenderContext](/typedoc/classes/babylon.framegraphrendercontext) for render passes
* [FrameGraphContext](/typedoc/classes/babylon.framegraphcontext) for culling passes (there is no special context class for culling passes yet, but this may change in the future)

In turn, the context determines what you can do during the execution of the pass (the `FrameGraphContext` class does not have any rendering-related methods, for example, contrary to `FrameGraphRenderContext`).

Compared to other frame graph implementations, Babylon.js is a bit unusual when it comes to passes, as there are two sets of passes: regular passes and disabled passes. The latter are executed instead of the former if the task is disabled (**disabled** property set to *true*).

This allows you to easily “remove” a task from the graph without actually deleting it. Removing a task from a graph can be a bit complicated, as the inputs/outputs of other tasks must be reconnected to account for the removal, and the graph must be rebuilt to regenerate the passes. In comparison, disabling a task is very easy and does not require any of these operations. However, this simplicity comes at a price: performance may be (slightly) worse when a task is disabled than when it is removed from the graph. This is because some tasks still need to perform some processing when they are disabled. For example, a post-processing task must copy the contents of its source texture to the target texture when it is disabled. If a post-processing task is completely removed from the graph, you will save this copy. As is often the case, this is a trade-off between ease of use and performance.

### Task dependencies
Another property worth mentioning is that of **dependencies**. You can add a texture to a task's dependencies to indicate that a texture must retain its content at least until that task before the texture optimizer can reuse it for subsequent tasks. If you don't do this, a texture may be reused too early and the result of the task may not match your expectations. Most of the time (if not always), all inputs in a task that are textures should be added to the set of **dependencies**, as this means that the task uses these textures as part of its processing.

Babylon.js already implements a number of tasks (see LINK), but you can also implement your own tasks (see LINK).

### Code example
As an illustration, here is the complete implementation of a simple task, the “copy to back buffer color” task (the class [FrameGraphCopyToBackbufferColorTask](/typedoc/classes/babylon.framegraphcopytobackbuffercolortask)):
```typescript
export class FrameGraphCopyToBackbufferColorTask extends FrameGraphTask {
    /**
     * The source texture to copy to the backbuffer color texture.
     */
    public sourceTexture: FrameGraphTextureHandle;

    public record() {
        if (this.sourceTexture === undefined) {
            throw new Error(`FrameGraphCopyToBackbufferColorTask "${this.name}": sourceTexture is required`);
        }

        const pass = this._frameGraph.addRenderPass(this.name);

        pass.addDependencies(this.sourceTexture);

        pass.setRenderTarget(backbufferColorTextureHandle);
        pass.setExecuteFunc((context) => {
            if (!context.isBackbuffer(this.sourceTexture)) {
                context.copyTexture(this.sourceTexture);
            }
        });

        const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);

        passDisabled.setRenderTarget(backbufferColorTextureHandle);
        passDisabled.setExecuteFunc((_context) => {});
    }
}
```
Notes:
* For a render pass, you must specify which texture the pass should be rendered to by calling the `RenderPass.setRenderTarget(textureHandle)` method.
* To create a render pass that is used when the task is disabled, simply pass *true* as the second parameter to `FrameGraph.addXXXPass(name, whenTaskDisabled)`.

## [FrameGraphTextureManager](/typedoc/classes/babylon.framegraphtexturemanager)
This is the class responsible for managing textures (render target textures, that is textures we render to) in a frame graph.

### Main methods and properties
* `getTextureFromHandle(handle)`. Retrieves the real texture (an `InternalTexture` instance) from a texture handle.
* `importTexture(name, internalTexture)`. Imports an `InternalTexture` instance into the texture manager. This method returns a handle so that the texture can be used inside the frame graph (see explanations below about handles).
* `createRenderTargetTexture(name, creationOptions)`. Creates a texture for use in the frame graph. Returns a handle.
* `createDanglingHandle()`. Creates an empty handle. You must call `resolveDanglingHandle()` at some later point, and before the graph is built, to associate a texture to this handle.
* `resolveDanglingHandle(danglingHandle, handle?, newTextureName?, creationOptions?)`. Associates a texture to a dangling handle. If you don't provide a handle to a texture (second parameter), then the third and fourth parameters are used to create a new texture handle by calling `createRenderTargetTexture(newTextureName, creationOptions)`.

### Texture handles
To achieve texture reuse (activated through [FrameGraph.optimizeTextureAllocation](/typedoc/classes/babylon.framegraph#optimizetextureallocation)), which is one of the main goal of frame graphs, textures must be manipulated through handles (which are just numbers under the hood) and not directly by using a reference (pointer) to the actual texture. That way, the system is free to link the same texture to different handles without the user knowing it. Whenever you need a real texture pointer, use the `getTextureFromHandle(handle)` method.

When you want to create a (render target) texture for use in a frame graph, calls the `FrameGraphTextureManager.createRenderTargetTexture(name, creationOptions)` method. This method will return a handle to the texture, that you can then use as inputs for some tasks, for example:
```typescript
const colorTexture = frameGraph.textureManager.createRenderTargetTexture("color", {
    size: { width: 100, height: 100 },
    options: {
        createMipMaps: false,
        types: [BABYLON.Constants.TEXTURETYPE_FLOAT],
        formats: [BABYLON.Constants.TEXTUREFORMAT_RGBA],
        samples: 1,
        useSRGBBuffers: [false],
        labels: ["color"],
    },
    sizeIsPercentage: true,
});

const clearTask = new BABYLON.FrameGraphClearTextureTask("clear", frameGraph);

clearTask.clearColor = true;
clearTask.targetTexture = colorTexture;

frameGraph.addTask(clearTask);
```

### Dangling texture handles
Sometimes, you want to create a texture handle but you don't know yet what the texture really is. It happens for all tasks that have an output texture. For these tasks, we want to create the output handle as soon as possible, so that this handle can be used when we build and connect the tasks of a frame graph.

For example:
```typescript
const clearTask = new BABYLON.FrameGraphClearTextureTask("clear", frameGraph);

...set properties of clearTask...

const renderTask = new BABYLON.FrameGraphObjectRendererTask("renderObjects", frameGraph, scene);

renderTask.targetTexture = clearTask.outputTexture;
```
**clearTask.outputTexture** must have a value just after the task is created, because we use it straight away to set the **renderTask.targetTexture** value. It means the handle must be created in the `FrameGraphClearTextureTask` constructor, but at this time we don't have enough information to associate a texture to that handle. That's why we create a dangling handle in the constructor, that we assign to **FrameGraphClearTextureTask.outputTexture** (same thing for the depth texture):
```typescript
constructor(name: string, frameGraph: FrameGraph) {
    super(name, frameGraph);

    this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    this.outputDepthTexture = this._frameGraph.textureManager.createDanglingHandle();
}
```
Later on (in `FrameGraphClearTextureTask.record()`), we will resolve the dangling handle (by calling `FrameGraphTextureManager.resolveDanglingHandle()`) with a real texture handle.

### History textures
Babylon supports a simplified version of history textures: ping-pong textures.

