---
title: Usage with the Smart Filter Editor
image-url: /img/defaultImage.png
description: Learn how to create shader blocks for the Smart Filter Editor using Node Material Editor
keywords: shaders, node editor, node graph, NME, SFE, Node Material, Node Material Editor, Smart Filter, Smart Filter Editor
further-reading:
video-overview:
video-content:
---

## Overview

The [Smart Filters Editor](/toolsAndResources/sfe) (SFE) is used to compose multiple shaders into complex effects, while the [Node Material Editor](/toolsAndResources/nme) (NME) is used to create shaders. Naturally, these two tools can work together: NME can generate SFE-ready shaders, which can then be chained together inside SFE. The special "Smart Filters" mode in NME enables this workflow.

Using NME with SFE follows a three-step process.

1. Build shader in NME
2. Export [the annotated GLSL code](/features/featuresDeepDive/smartFilters/creatingNewBlocks#using-annotated-glsl-code)
3. Import the GLSL code into SFE

<br/>
If you're new to either, start by reading more about [Node Materials](/features/featuresDeepDive/materials/node_material/nodeMaterial) and [Smart Filters](/features/featuresDeepDive/smartFilters/introductionToSmartFilters).

## Example

![NME](/img/how_to/Materials/nmeToSfe.png)
Source: <NME id="#QYN8UY#5" title="Halftone Shader" description="An example demonstrating how to create a Smart Filter-ready shader." />

## New NME Blocks

<Alert severity="info" title="Only Fragment Shader Support">Smart Filters are designed to support a set of screen-space optimizations— ones that don’t easily allow for customizing vertex shaders. As a result, "Smart Filters" mode does not support the usual vertex shader capabilities of NME.</Alert>

Alongside the standard 2D-compatible NME blocks, the Smart Filters mode introduces a few specialized blocks:

### SmartFilterFragmentOutput

_Required._ Receives the final color output of the SFE block. Similar to a regular fragment output block, but distinct: since a SmartFilter composes multiple shaders together, this block doesn’t directly write to the final frame color.

### ScreenUV

_Optional._ Provides the screen quad’s UV coordinates in the range of 0-1. This is a preconfigured input block for use with Smart Filter’s UV system.

### SmartFilterTexture

_Optional._ Represents a texture input, as well as its sampling, in a Smart Filter.

Textures assigned to this are placeholders; they are not exported with the final shader block. The textures must be reassigned when using the block in SFE.

In the "Properties" property tab, you can optionally toggle its `Is Main Input` flag (used by Smart Filter’s disable strategy).

## Input Connection Points

By default, each InputBlock (and SmartFilterTextureBlock) is exposed as an input connection point in the exported SFE block. The value you assign to an InputBlock in NME becomes the default for that connection point.

<Alert severity="info" title="Constants">To keep an InputBlock from appearing as an input connection, set the `Type` field to `Constant` under its "Properties" tab.</Alert>

## Naming

To name the exported shader block, modify the `Name` of the Node Material. This field is located under the graph's "General" property tab.

To name the input connection points for the shader block, repeat the same steps as above for each of:

- Textures: rename the corresponding SmartFilterTextureBlock.
- All other inputs: rename their corresponding InputBlocks.

## Exporting

Once finished, use the `Export shaders for SFE` button under the graph's "File" property tab. This will download an annotated GLSL block definition file with the suffix `.block.glsl`. To import this into your SFE project, read about [using custom blocks in SFE](/toolsAndResources/sfe#custom-blocks).
