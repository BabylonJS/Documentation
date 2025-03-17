---
title: How Smart Filters Work
image:
description: Learn how the Smart Filters core works
keywords: video, babylon.js, sfe, smart, filter, effect
further-reading:
video-overview:
video-content:
---

## Overview

The entire system has been split in two parts: the Smart Filter and the Smart Filter Runtime.

## Design Principles

1. Keep the Smart Filter core simple and ensure the runtime is fast
2. Provide an easy to use API surface
3. Support only loading the code you need, and support delay loading that code (e.g. deserialization is async so deserialization code doesn't have to be loaded until it is used)

### Smart Filter

The notion of a `SmartFilter` is a graph of blocks (all inheriting from `BaseBlock`) linked to each other through `ConnectionPoint`s.

During the initialization phase, the `SmartFilter` examines the graph and builds a list of commands to execute during each frame and stores them in a `CommandBuffer`:

- This keeps each frame render very fast by minimizing the amount of code running and branches in that code.
- Basically, every `BaseBlock` during its `generateCommandsAndGatherInitPromises` step will register in the `CommandBuffer` only the work it has to execute according to its options.
- In the end the render loop only needs to execute each command in the list.
- This also allows for easy injection of debug tools or logging in between each command without growing the minimum required code to run a filter.
- Each Block is responsible for "injecting" its command in the Smart Filter's `CommandBuffer`.
- For example: the `ShaderBlock` highlights how convenient it can be to only switch once at init time between rendering to the main render target (if linked to the output) or to an intermediate texture if in the middle of the chain.

Each block is responsible for exposing their inputs and outputs through `registerInput` and `registerOutput`:

- This creates and stores the related `ConnectionPoint`.
- Any property values of a block must be updated only before `initialize` is called as the runtime won't reference it at render time.
- All values that need to be dynamically updated after `initialize` must be defined as connection points or 'StrongRef'.
- By convention, blocks defined in TypeScript should expose their input connection points as properties for convenience.

The `ConnectionPoints` are:

- Strongly typed, allowing more type safety while creating `SmartFilter` by code, yet keeping enough flexibility to be understood efficiently at runtime.
- They are also responsible for their compatibility when linked to each other.

The Smart Filter is fully abstracted away from the runtime and does not even require a Babylon Engine to work with. It is only responsible to hold the "graph" of the Smart Filter or the "map" of all its blocks. A Smart Filter only needs a name to be created:

```typescript
const smartFilter = new SmartFilter("Simplest");
```

Once a Smart Filter exists, one can add as many blocks as necessary to it:

```typescript
const blur = new BlurBlock(smartFilter, "blur");
```

Then, the various blocks can be linked together:

```typescript
videoInput.output.connectTo(blur.input);
blur.output.connectTo(blackAndWhite.input);
```

Finally the last block should be linked into the Smart Filter output:

```typescript
titleInput.output.connectTo(smartFilter.output);
```

### Optimizations

You can activate two optimizations once you've created your graph and have an instance of `SmartFilter` ready.

The first is a graph optimizer which attempts to "merge" the "compatible" shader blocks to create an optimized version of the graph, thus reducing the final number of draw calls (as there are as many draw calls as there are shader blocks in the graph). This optimization pass will create a new instance of `SmartFilter` which you can use in place of the initial instance. Here's how to do it:

```typescript
const vfo = new SmartFilterOptimizer(smartFilter, {
  // filters is an (unoptimized) instance of SmartFilter
  maxSamplersInFragmentShader: engine.getCaps().maxTexturesImageUnits,
});
const optimizedSmartFilter = vfo.optimize();
```

One caveat is that a fragment shader has a limited number of samplers it can use, so we shouldn't merge blocks (even if they're compatible) once we've reached this limit. You should normally use the current GPU limit, so it is recommended to pass engine.getCaps().maxTexturesImageUnits as the maxSamplersInFragmentShader value.

The second optimization is a texture analyzer that traverses the graph and recycles textures between blocks (where possible), in order to limit the total number of textures used by the graph. You can activate it as follows:

```typescript
const rtg = new RenderTargetGenerator(true); // true to minimize the number of textures created
const runtime = await filter.createRuntimeAsync(this.engine, rtg);
```

### Alpha

Smart Filter blocks operate on straight alpha. If you need premultiplied alpha for your output, you can use a PreMultiplyAlphaBlock at the end of your Smart Filter. Note that the Smart Filter Editor sets the Engine option [premultipliedAlpha](/typedoc/interfaces/BABYLON.EngineOptions#premultipliedalpha) to false when creating the ThinEngine so it doesn't expect premultiplied alpha, so Smart Filters in the Smart Filter Editor do not need to use a PreMultiplyAlphaBlock.

## Runtime

To keep a nice separation between edit time, resource management and render time, the filter itself cannot be rendered directly. In order to do so, a runtime needs to be created from the filter:

```typescript
const runtime = await smartFilter.createRuntimeAsync(engine);
```

<Alert severity="info">
Note that the same filter can be used across different runtimes.
</Alert>

The runtime contains the list of resources required to render the filter like (intermediate textures, shaders and buffers). It also owns a Command buffer containing the list of all the actions required to render the filter.

For instance the content of the command buffer for the simplest filter would be:

```console
----- Command buffer commands -----
    Owner: OutputBlock (output) - Command: OutputBlock.render
-----------------------------------
```

Whereas the one of a more complex one could look like:

```console
----- Command buffer commands -----
    Owner: DirectionalBlurBlock (blurIV) - Command: DirectionalBlurBlock.render
    Owner: DirectionalBlurBlock (blurIH) - Command: DirectionalBlurBlock.render
    Owner: DirectionalBlurBlock (blurV) - Command: DirectionalBlurBlock.render
    Owner: DirectionalBlurBlock (blurH) - Command: DirectionalBlurBlock.render
    Owner: BlackAndWhiteBlock (blackAndWhite) - Command: BlackAndWhiteBlock.render
    Owner: FrameBlock (frame) - Command: FrameBlock.renderToCanvas
-----------------------------------
```

The command buffer is accessible through the runtime for debugging and logging purposes. The list of commands could be extended with custom ones if necessary, such as for introspection as we do in ./src/command/commandBufferDebugger.ts

Rendering the current runtime is as simple as `runtime.render();`

<Alert severity="info">
Note that the runtime should be disposed once it is no longer needed to free GPU memory and prevent leaks.
</Alert>

## A Few Core Principles

- Be CPU efficient: for instance, keeping the number of commands and the amount of branching in commands as low as possible.
- Be memory efficient: no commands should allocate memory as it could trigger some garbage collection which could result in frame loss.
- Be GPU efficient: the graph and texture optimizers minimize the number of "passes" required to render an image and the GPU resources used by the graph.
