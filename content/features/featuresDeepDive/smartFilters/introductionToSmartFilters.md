---
title: Introduction To Smart Filters
image:
description: Learn how to get started with Smart Filters
keywords: video, babylon.js, sfe, smart, filter, effect
further-reading:
video-overview:
video-content:
---

## Overview

Smart Filters are "full screen" effects built by composing blocks together into a `SmartFilter` object, from which a `SmartFilterRuntime` is created.

You can use the built-in blocks or use blocks you create yourself to build your Smart Filters.

The Smart Filter core comes with an optimizer which can take a `SmartFilter` and return an optimized `SmartFilter` which consolidates the shader blocks into as few as possible. The `RenderTargetGenerator` used when creating a `SmartFilterRuntime` also contains an optimizer which will reuse intermediate textures whenever possible within the Smart Filter.

## How To Explore

### With the Smart Filter Editor

To familiarize yourself with Smart Filters, you can start by trying out the [Smart Filter Editor](https://sfe.babylonjs.com)
![SFE](/img/how_to/smart-filters/sfe-default.png)

This tool lets you visually construct and run Smart Filters using the provided built in blocks, as well as with custom blocks you create and load into the tool, all before you even clone the repo.

Read more about the Smart Filters Editor [here](../../../../toolsAndResources/sfe/)

### In the Playground

You can also experiment with Smart Filters in the Playground!

<Playground id="#N7VSE6" title="Smart Filter Camera" description="Demonstrates how a Smart Filter can be used to apply an effect to the camera in a scene." />
<Playground id="#1VIWKL#2" title="Smart Filter Camera from SFE" description="Demonstrates how a Smart Filter saved from the Smart Filter Editor can be used to apply an effect to the camera in a scene." />

### With Code

Clone [BabylonJS/SmartFilters](https://github.com/BabylonJS/SmartFilters), and you can see a small demo of how Smart Filters can be integrated into a web application.

Once you've cloned, simply run these commands to see the demo application:

- npm install
- npm start

#### Key Files

- demo/src/app.ts
  - The main file for the demo app - responsible for creating all of the helpers, wiring up to the UI, and connecting them all together
- demo/src/smartFilterLoader.ts
  - Loads a `SmartFilter` from a "Manifest" (either a hardcoded or serialized Smart Filter)
- demo/src/smartFilterRenderer.ts
  - Takes a `SmartFilter`, creates the `SmartFilterRuntime`, loads any test assets (e.g. images or videos), and starts rendering
- demo/src/configuration/smartFilters/\*.ts
  - The hardcoded and serialized example Smart Filters
