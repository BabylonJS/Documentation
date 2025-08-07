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

Clone [BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js), and you can see how the Smart Filters Editor application uses Smart Filters

Once you've cloned, run `npm install` then choose one of these approaches to build the Smart Filter Editor:

- Select `Smart Filter Editor development (Edge)` or `Smart Filter Editor development (Chrome)` in Visual Studio Code's `Run and Debug` menu then hit F5
- Run `npm run watch:assets:smart-filters` in a terminal, then `npm run watch:source:smart-filters` in another terminal, and finally `npm run serve -w @tools/smart-filters-editor` in a third terminal

#### Key Files

- [app.ts](https://github.com/BabylonJS/Babylon.js/blob/master/packages/tools/smartFiltersEditor/src/app.ts)
  - The main file for the Smart Filter Editor - it handles loading and saving Smart Filters and launching the editor control
- [smartFilterLoader.ts](https://github.com/BabylonJS/Babylon.js/blob/master/packages/tools/smartFiltersEditor/src/smartFilterLoader.ts)
  - The helper which takes a deserializer and uses it to load Smart Filters
- [smartFilterRenderer.ts](https://github.com/BabylonJS/Babylon.js/blob/master/packages/tools/smartFiltersEditor/src/smartFilterRenderer.ts)
  - The helper that takes a loaded Smart Filter and begins rendering it
