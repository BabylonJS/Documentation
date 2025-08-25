---
title: Usage with the Smart Filter Editor
image-url: /img/defaultImage.png
description: Learn how to create shader blocks for the Smart Filter Editor using Node Material Editor
keywords: shaders, node editor, node graph, NME, SFE, Node Material, Node Material Editor, Smart Filter, Smart Filter Editor
further-reading:
video-overview:
video-content:
---

TODO:

- Add image with full example showcasing NME and SFE side-by-side
- Add crosslinks

## Overview

The Smart Filters Editor (SFE) is a node editor for composing shader passes. The Node Material Editor (NME) is used to create shaders. Naturally, these two tools can work together: NME can generate SFE-ready shader blocks, which you can then chain together inside SFE. The special SFE mode in NME enables this workflow.

If you’re new to either editor, start with the introductions first: Node Material Editor · Smart Filters Editor.

## Creating an SFE block using NME

### Fragment Shaders Only

The SFE mode is designed exclusively for fragment shaders. This is because a Smart Filter is designed to apply a set of screen-space optimizations— ones that don’t easily allow for customizing the vertex shader. As a result, SFE mode does not support the usual vertex shader capabilities of NME.

### New NME Blocks

Alongside the standard 2D-compatible NME blocks, SFE introduces a few specialized blocks:

#### SmartFilterFragmentOutputBlock

_Required._ Receives the final color output of the SFE block. Similar to a regular fragment output block, but distinct— since a SmartFilter composes multiple shaders together, this block doesn’t directly write to the final frame color.

#### ScreenUVBlock

_Optional._ Provides the screen quad’s UV coordinates. This is a preconfigured input block for use with Smart Filter’s UV system. Use it like any other UV.

#### SmartFilterTextureBlock

_Optional._ Represents a texture input, as well as its sampling, in an SFE graph.

Textures assigned to this act as placeholders only; they are not exported with the shader block. The textures must be reassigned when using the block in SFE.

In the properties pane, you can optionally mark a texture as the main input (used by Smart Filter’s disable strategy)

### Naming

To name the exported SFE shader block, rename the Node Material itself in NME.

To name inputs for an exported block:

- For textures: rename the corresponding SmartFilterTextureBlock.
- For all other inputs: rename their corresponding InputBlock.

### InputBlock Behavior

By default, every InputBlock in NME becomes an input connection point in the exported SFE block.

#### Default Values

The value you assign to an InputBlock in NME becomes its default value in the exported SFE block.

> Exception: SmartFilterTextureBlock values are placeholders only.

#### Constants

To keep an InputBlock from appearing as an input connection, set its type to Constant.
