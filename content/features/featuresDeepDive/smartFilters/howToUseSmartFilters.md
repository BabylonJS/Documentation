---
title: How To Use Smart Filters
image:
description: Learn how to get started with Smart Filters
keywords: video, babylon.js, sfe, smart, filter, effect
further-reading:
video-overview:
video-content:
---

## How to Install

Install the Smart Filters core package: `npm install @babylonjs/smart-filters`.

The package has been marked as `sideEffects: false` so you can freely import from the index and know that tree shaking will remove any code you don't end up using.

It requires the following peer dependencies:

- @babylonjs/core

## Important Notes

<Alert severity="info">
Do not rely on the path of files within the `@babylonjs/smart-filters` package
 - Instead import from the root index and allow tree-shaking to remove anything you don't use
 - Otherwise future updates could move or rename files and require you to update your references

</Alert>

## Simplest Usage

This sample creates a trivial hardcoded SmartFilter, creates the runtime, and then calls render() to render one frame to the canvas.

<Alert severity="info">
Note: Smart Filters are currently compatible with the Babylon Engine and ThinEngine.
</Alert>

```typescript
// Create a SmartFilter
const smartFilter = new SmartFilter("Simplest");
const titleInput = new InputBlock(smartFilter, "logo", ConnectionPointType.Texture, logoTexture);
titleInput.output.connectTo(smartFilter.output);

// Create a SmartFilterRuntime
const engine = new ThinEngine(canvas, true);
const runtime = await smartFilter.createRuntimeAsync(engine);

// Render one frame
runtime.render();
```

## Using the Optimizer

This sample creates a more interesting SmartFilter, uses the SmartFilterOptimizer to optimize the SmartFilter, and creates a RenderTargetGenerator with optimizations enabled.

```typescript
// Create a SmartFilter
const smartFilter = new SmartFilter("BlackAndWhiteAndPixelate");
const logoInput = new InputBlock(smartFilter, "logo", ConnectionPointType.Texture, createStrongRef(logoTexture));
const blackAndWhite = new BlackAndWhiteBlock(smartFilter, "blackAndWhite");
const pixelate = new PixelateBlock(smartFilter, "pixelate");
const pixelateIntensity = new InputBlock(smartFilter, "intensity", ConnectionPointType.Float, 0.4);

logoInput.output.connectTo(blackAndWhite.input);
blackAndWhite.output.connectTo(pixelate.input);
pixelateIntensity.output.connectTo(pixelate.intensity);
pixelate.output.connectTo(smartFilter.output);

// Create and call the optimizer
const optimizer = new SmartFilterOptimizer(smartFilter);
const optimizedSmartFilter = optimizer.optimize();

// Create a RenderTargetGenerator with optimization enabled
const rtg = new RenderTargetGenerator(true);

// Create the ThinEngine and the SmartFilterRuntime
const engine = new ThinEngine(canvas, true);
const runtime = await optimizedSmartFilter.createRuntimeAsync(engine, rtg);

// Render one frame
runtime.render();
```

## Rendering to Another Render Target

In this example, we build a trivial hardcoded Smart Filter, then have it render to a RenderTargetWrapper we supply instead of rendering to the canvas:

```typescript
// Create a SmartFilter
const smartFilter = new SmartFilter("Simplest");
const titleInput = new InputBlock(smartFilter, "logo", ConnectionPointType.Texture, logoTexture);
titleInput.output.connectTo(smartFilter.output);

// Tell the SmartFilter to render to RenderTargetWrapper we supply
smartFilter.outputBlock.renderTargetWrapper = myRenderTargetWrapper;

// Create a SmartFilterRuntime
const engine = new ThinEngine(canvas, true);
const runtime = await smartFilter.createRuntimeAsync(engine);

// Render one frame
runtime.render();
```

Notes:

1. The choice between rendering to the canvas and to a renderTargetWrapper is locked in for a runtime when you create the `SmartFilterRuntime`.
   - To change from rendering to the canvas to rendering to a RenderTargetWrapper, or the reverse, create a new runtime.
1. If you started with a RenderTargetWrapper, you can change outputBlock.renderTargetWrapper to a different RenderTargetWrapper at runtime, and the next render() call will target it instead.
   - If the new renderTargetWrapper is a different size from the previous one, call smartFilter.resize() before the next render() call is made.

## Handling Resize

If the canvas changes sizes (or you are using outputBlock.renderTargetWrapper and you change to a new RenderTargetWrapper), be sure to call smartFilter.resize() to ensure all intermediate textures are resized as well.

## Full Example

See [Introduction To Smart Filters](../introductionToSmartFilters) for more information about the demo application included in the Smart Filters repo.
