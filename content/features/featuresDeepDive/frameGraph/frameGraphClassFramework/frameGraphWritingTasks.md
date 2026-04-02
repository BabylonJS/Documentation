---
title: Writing Frame Graph Tasks
image:
description: A comprehensive guide to implementing custom frame graph tasks in Babylon.js, covering task anatomy, texture management, pass creation, composite tasks, and best practices.
keywords: diving deeper, frame graph, rendering, task, custom, implementation, guide
---

This page explains how to implement custom frame graph tasks. It covers the fundamentals common to all tasks, then builds up to more advanced patterns such as composite tasks that leverage other tasks in their implementation.

For a complete worked example, see [Implementing volumetric lighting with frame graphs](/features/featuresDeepDive/frameGraph/frameGraphExamples/frameGraphExampleVolumetricLighting).

## Task anatomy

Every frame graph task extends `FrameGraphTask` (or `FrameGraphTaskMultiRenderTarget` for multi-render-target tasks). Here is the minimal structure:

```typescript
export class MyTask extends BABYLON.FrameGraphTask {
    // Input properties
    public sourceTexture: BABYLON.FrameGraphTextureHandle;

    // Output properties (always created in the constructor)
    public readonly outputTexture: BABYLON.FrameGraphTextureHandle;

    constructor(name: string, frameGraph: BABYLON.FrameGraph) {
        super(name, frameGraph);

        // Create dangling handles for outputs
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }

    public override getClassName(): string {
        return "MyTask";
    }

    public override isReady(): boolean {
        // Only check that internal resources are ready — not input parameters
        return true;
    }

    public record(skipCreationOfDisabledPasses = false): void {
        // Validate inputs, resolve handles, create passes
    }

    public override dispose(): void {
        // Clean up all resources
        super.dispose();
    }
}
```

### Required methods

| Method | Purpose |
|--------|---------|
| `record(skipCreationOfDisabledPasses?)` | **Abstract.** Creates passes for the task. Called each time the frame graph is built or rebuilt (e.g., on window resize). |
| `getClassName()` | Returns the class name as a string. |

### Optional methods

| Method | Purpose |
|--------|---------|
| `isReady()` | Checks whether internal resources (shaders, textures, etc.) are ready. Default returns `true`. |
| `initAsync()` | Called once after the task is added to the graph and before the first build. Use it for asynchronous initialization (e.g., lazy shader imports). |
| `dispose()` | Cleans up all resources. Always call `super.dispose()`. |

### Lifecycle

1. The task is created and added to the frame graph via `frameGraph.addTask(task)`.
2. `initAsync()` is called once.
3. `frameGraph.buildAsync()` calls `record()` on every task in order.
4. Textures are allocated. `onTexturesAllocatedObservable` fires.
5. `isReady()` is polled until all tasks return `true`.
6. `frameGraph.execute()` executes each task's passes on every frame.

<Alert severity="warning" title="record() can be called multiple times">
`record()` is called every time the frame graph is rebuilt (e.g., after a window resize). Make sure your implementation handles this correctly: don't register scene-level observers inside `record()` unless you also clean them up when `record()` is called again.
</Alert>

## Input and output properties

### Naming conventions

Use descriptive names without prefixes:
```typescript
// ✅ Good
public depthTexture: BABYLON.FrameGraphTextureHandle;
public normalTexture: BABYLON.FrameGraphTextureHandle;
public camera: BABYLON.Camera;

// ❌ Avoid
public gbufferDepthTexture: BABYLON.FrameGraphTextureHandle;
```

Output properties should be prefixed with `output`:
```typescript
public readonly outputTexture: BABYLON.FrameGraphTextureHandle;
public readonly outputDepthTexture: BABYLON.FrameGraphTextureHandle;
```

### Texture documentation

Document the expected format(s) for each texture input, especially when multiple formats exist. For example, depth textures can come in several flavors:

```typescript
/**
 * The depth texture used for shadow tracing.
 * Must contain screen-space depth values.
 * Camera-space Z or normalized camera-space Z are NOT supported.
 */
public depthTexture: BABYLON.FrameGraphTextureHandle;

/**
 * World-space normal texture.
 * Must contain signed normals in the [-1, 1] range (not unsigned [0, 1]).
 */
public normalTexture: BABYLON.FrameGraphTextureHandle;
```

### Texture handles and dangling handles

Textures in the frame graph are manipulated through **handles** (numbers), not direct references. This allows the system to optimize texture allocation by reusing textures across tasks.

**Output handles** must be created in the constructor using `createDanglingHandle()`, because other tasks may reference them immediately after construction:

```typescript
constructor(name: string, frameGraph: BABYLON.FrameGraph) {
    super(name, frameGraph);
    this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
}
```

**Resolving handles** associates a dangling handle with an actual texture. This is done in `record()`:

```typescript
public record(skipCreationOfDisabledPasses = false) {
    // Associate outputTexture with the same underlying texture as targetTexture
    this._frameGraph.textureManager.resolveDanglingHandle(
        this.outputTexture, this.targetTexture
    );

    // Or create a new texture and associate it with the handle
    this._frameGraph.textureManager.resolveDanglingHandle(
        this.outputTexture,
        undefined,
        `${this.name} Output`,
        creationOptions
    );
}
```

## The `record()` method

This is the core method of any task. It is responsible for creating the passes that will be executed each frame. Here is the pattern:

```typescript
public record(skipCreationOfDisabledPasses = false): void {
    // 1. Validate required inputs
    if (this.sourceTexture === undefined) {
        throw new Error(`MyTask "${this.name}": sourceTexture is required`);
    }

    // 2. Resolve output dangling handles
    this._frameGraph.textureManager.resolveDanglingHandle(
        this.outputTexture, this.targetTexture
    );

    // 3. Create render pass(es)
    const pass = this._frameGraph.addRenderPass(this.name);

    // 4. Declare dependencies (can accept an array)
    pass.addDependencies([this.sourceTexture, this.depthTexture]);

    // 5. Set the render target
    pass.setRenderTarget(this.outputTexture);

    // 6. Set the execute function
    pass.setExecuteFunc((context) => {
        context.copyTexture(this.sourceTexture);
    });

    // 7. Create disabled pass(es)
    if (!skipCreationOfDisabledPasses) {
        const passDisabled = this._frameGraph.addRenderPass(
            this.name + "_disabled", true
        );
        passDisabled.setRenderTarget(this.outputTexture);
        passDisabled.setExecuteFunc((_context) => {});
    }
}
```

### Pass types

| Method | Context type | Use case |
|--------|-------------|----------|
| `addPass(name, disabled?)` | `FrameGraphContext` | Non-rendering work (updating uniforms, culling, etc.) |
| `addRenderPass(name, disabled?)` | `FrameGraphRenderContext` | Rendering to a texture |
| `addObjectListPass(name, disabled?)` | `FrameGraphContext` | Outputting an object list |

Always create passes via the `FrameGraph` methods — never instantiate pass classes directly. This ensures passes are correctly associated with the current task (see [Composite tasks](#composite-tasks) for why this matters).

### Dependencies

Use `pass.addDependencies()` to declare which textures a pass reads. This tells the texture optimizer that the texture must retain its content at least until this pass executes. The method accepts a single handle or an array:

```typescript
// Single dependency
pass.addDependencies(this.sourceTexture);

// Multiple dependencies
pass.addDependencies([
    this.depthTexture,
    this.normalTexture,
    this.positionTexture,
]);
```

### Disabled passes

A task can be enabled or disabled via its `disabled` property. When disabled, the framework executes the task's **disabled passes** instead of its regular passes. Both sets must render to the **same output texture(s)** — the framework validates this.

Common patterns for disabled passes:
* **No-op**: The disabled pass does nothing (the output texture retains its previous content).
* **Copy**: The disabled pass copies the source texture to the output, effectively passing through.

Pass `true` as the second argument to `addPass()` / `addRenderPass()` to create a disabled pass:
```typescript
const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
passDisabled.setRenderTarget(this.outputTexture);
passDisabled.setExecuteFunc((_context) => {});
```

### The `skipCreationOfDisabledPasses` parameter

When a task is used as a **sub-task** inside a composite task, the parent task typically creates its own disabled passes and passes `true` for `skipCreationOfDisabledPasses` when calling sub-task `record()` methods. This is the most common pattern, but it is not mandatory — there may be cases where keeping a sub-task's disabled passes is the right thing to do. Use your judgment based on what makes sense for your specific pipeline.

```typescript
public record(skipCreationOfDisabledPasses = false): void {
    // ...create regular passes...

    if (!skipCreationOfDisabledPasses) {
        // Only create disabled passes when this task is a top-level task
        const passDisabled = this._frameGraph.addRenderPass(
            this.name + "_disabled", true
        );
        passDisabled.setRenderTarget(this.outputTexture);
        passDisabled.setExecuteFunc((_context) => {});
    }
}
```

## The `isReady()` method

`isReady()` should **only** check whether internal resources (shaders, post-processes, materials) are ready. It should **not** validate input parameters — that's the job of `record()`, which is called before `isReady()`.

```typescript
// ✅ Good — only checks resource readiness
public override isReady(): boolean {
    return this.postProcess.isReady() && this._material.isReady();
}

// ❌ Bad — checks inputs (already validated in record())
public override isReady(): boolean {
    return this.sourceTexture !== undefined
        && this.camera !== undefined
        && this.postProcess.isReady();
}
```

## The `dispose()` method

`dispose()` must clean up **all** resources owned by the task:
* Dispose materials, post-processes, textures created by the task
* Remove all observer registrations (scene observers, camera observers, etc.)
* Dispose sub-tasks if the task is a composite task
* Always call `super.dispose()` at the end

```typescript
public override dispose(): void {
    // Remove observers
    this._scene.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
    this._camera.onViewMatrixChangedObservable.remove(this._onViewMatrixChangedObserver);

    // Dispose owned resources
    this._material.dispose();
    this._postProcess.dispose();

    // Dispose sub-tasks (composite tasks only)
    this._subTask1.dispose();
    this._subTask2.dispose();

    // Always call super
    super.dispose();
}
```

## The `onTexturesAllocatedObservable` callback

This observable fires after the graph is built and GPU textures have been allocated. At this point, you can safely retrieve actual `InternalTexture` instances from handles using `textureManager.getTextureFromHandle()`.

This is the right place to bind textures to materials or shaders that need direct `InternalTexture` references:

```typescript
constructor(name: string, frameGraph: BABYLON.FrameGraph) {
    super(name, frameGraph);

    this._material = new BABYLON.ShaderMaterial(/* ... */);

    this.onTexturesAllocatedObservable.add(() => {
        this._material.setInternalTexture(
            "depthTexture",
            frameGraph.textureManager.getTextureFromHandle(this.depthTexture)!
        );
    });

    this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
}
```

## Composite tasks

A composite task uses other frame graph tasks as part of its implementation. The parent task is the only one visible to the user — the sub-tasks are internal implementation details.

### Architecture

```
User sees:          FrameGraphVolumetricLightingTask
                    ├── record() calls:
Internally uses:    │   ├── _clearTask.record(true)
                    │   ├── _renderTask.record(true)
                    │   └── _blendTask.record(true)
```

### Constructor

Create sub-task instances in the constructor. Do **not** add them to the frame graph — they are not top-level tasks:

```typescript
constructor(name: string, frameGraph: BABYLON.FrameGraph) {
    super(name, frameGraph);

    // Create sub-tasks (NOT added to the frame graph)
    this._clearTask = new BABYLON.FrameGraphClearTextureTask(
        `${name} - clear`, frameGraph
    );
    this._renderTask = new BABYLON.FrameGraphObjectRendererTask(
        `${name} - render`, frameGraph, frameGraph.scene
    );
    this._blendTask = new MyBlendTask(
        `${name} - blend`, frameGraph
    );

    this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
}
```

### Forwarding input parameters to sub-tasks

When the parent task exposes input properties that are used by sub-tasks, the parent's setters must forward changes to the relevant sub-tasks. This ensures that if the user changes a property on the parent after construction, the sub-tasks stay in sync:

```typescript
private _camera: BABYLON.Camera;

public get camera() {
    return this._camera;
}

public set camera(value: BABYLON.Camera) {
    if (this._camera === value) {
        return;
    }
    this._camera = value;
    // Forward to all sub-tasks that use the camera
    this._renderTask.camera = value;
    this._blendTask.camera = value;
}
```

Note that texture handle inputs (e.g., `depthTexture`, `normalTexture`) typically don't need setter-based forwarding — they are set on the sub-tasks inside the `record()` method, since their values may not be available at construction time.

### Updating sub-task names

Override the `name` getter/setter to propagate name changes to sub-tasks. This is important for debugging — texture and pass names are derived from the task name, and mismatched names in the inspector make it hard to trace issues:

```typescript
public override get name() {
    return this._name;
}

public override set name(name: string) {
    this._name = name;
    if (this._clearTask) {
        this._clearTask.name = `${name} - clear`;
    }
    if (this._renderTask) {
        this._renderTask.name = `${name} - render`;
    }
    if (this._blendTask) {
        this._blendTask.name = `${name} - blend`;
    }
}
```

Note that in JavaScript, overriding a setter requires also overriding the getter (and vice versa).

### Recording sub-task passes

In `record()`, configure each sub-task's inputs and call its `record(true)` method. The `true` parameter prevents sub-tasks from creating their own disabled passes:

```typescript
public record(skipCreationOfDisabledPasses = false): void {
    if (this.targetTexture === undefined || this.depthTexture === undefined) {
        throw new Error(`MyCompositeTask "${this.name}": inputs are required`);
    }

    this._frameGraph.textureManager.resolveDanglingHandle(
        this.outputTexture, this.targetTexture
    );

    // Configure and record sub-tasks
    this._clearTask.targetTexture = lightingVolumeTexture;
    this._clearTask.clearColor = true;
    this._clearTask.color = new BABYLON.Color4(0, 0, 0, 1);
    this._clearTask.record(true);   // true = skip disabled passes

    this._renderTask.targetTexture = this._clearTask.outputTexture;
    this._renderTask.objectList = this.objectList;
    this._renderTask.camera = this.camera;
    this._renderTask.record(true);

    this._blendTask.sourceTexture = this._renderTask.outputTexture;
    this._blendTask.targetTexture = this.targetTexture;
    this._blendTask.record(true);

    // Create the disabled pass for the composite task
    if (!skipCreationOfDisabledPasses) {
        const disabledPass = this._frameGraph.addPass(
            this.name + "_disabled", true
        );
        disabledPass.setExecuteFunc(() => {});
    }
}
```

### How it works

When `FrameGraph.buildAsync()` calls your `record()` method, the frame graph sets an internal variable (`_currentProcessedTask`) to your task. When sub-tasks call `this._frameGraph.addPass()` or `this._frameGraph.addRenderPass()` inside their own `record()` methods, the created passes are added to **your task** (the current processed task), not to the sub-tasks. This is why you must always create passes via the `FrameGraph` methods and never instantiate pass classes directly.

### Dispose

Composite tasks must dispose their sub-tasks:

```typescript
public override dispose(): void {
    this._clearTask.dispose();
    this._renderTask.dispose();
    this._blendTask.dispose();
    super.dispose();
}
```

### isReady

Check readiness of all sub-tasks, as well as any resources owned by the parent task itself (e.g., materials, post-processes):

```typescript
public override isReady(): boolean {
    return this._material.isReady()
        && this._clearTask.isReady()
        && this._renderTask.isReady()
        && this._blendTask.isReady();
}
```

## Do's and Don'ts

### ✅ Do

- **Create output handles** in the constructor using `createDanglingHandle()`.
- **Resolve handles** in `record()` using `resolveDanglingHandle()`.
- **Validate inputs** at the beginning of `record()` by throwing an error if required properties are undefined.
- **Use `addDependencies()`** to declare every texture a pass reads, so the texture optimizer does not reclaim it too early.
- **Create disabled passes** for top-level tasks (unless `skipCreationOfDisabledPasses` is `true`). Disabled passes must write to the same output texture(s) as the regular passes.
- **Call `super.dispose()`** at the end of your `dispose()` implementation.
- **Clean up all observers** in `dispose()` — keep references to all observer registrations so they can be removed.
- **Use `initAsync()`** for asynchronous initialization (e.g., lazy shader imports for tree-shaking).
- **Use `onTexturesAllocatedObservable`** to bind `InternalTexture` instances to materials after the graph is built.
- **Use explicit access modifiers** (`public`, `protected`, `private`) on all properties and methods.
- **Document texture format expectations** for each texture input.

### ❌ Don't

- **Don't check input parameters** in `isReady()` — only check resource readiness.
- **Don't add sub-tasks to the frame graph** with `addTask()` — call their `record(true)` method from the parent's `record()`.
- **Don't expose sub-tasks** as public properties — keep them as `private` implementation details.
- **Don't use `as any`** casts — use proper type narrowing (e.g., `instanceof` checks) or add appropriate public API (getters, interfaces) to avoid accessing private members.
- **Don't register scene-level observers** inside `record()` without tracking them for cleanup, because `record()` is called each time the graph is rebuilt.
- **Don't create passes directly** — always use `FrameGraph.addPass()`, `addRenderPass()`, or `addObjectListPass()`.
- **Don't rely on the `GeometryBufferRenderer`** or other legacy rendering infrastructure — the frame graph should be self-contained.
