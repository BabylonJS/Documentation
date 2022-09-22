---
title: WebGPU Limitations
image:
description: Learn the limitations of the WebGPU implementation/specification
keywords: babylon.js, WebGPU, limitation
further-reading:
video-overview:
video-content:
---

Here are listed the current limitations of the WebGPU specification/implementation as of 2022/01/16.

## Non linear-filterable 32 bits float texture

32 bits float textures are not linear-filterable (see [List of texture formats](https://www.w3.org/TR/webgpu/#plain-color-formats)), meaning you can't use the bi/tri linear filtering with them, for eg. You will need to use 16 bits float textures instead, until the spec (or an extension) adds support for it.

## Low number of varying support

Chrome (which is the only browser supported by Babylon.js at this time because of the other browsers lagging behind in term of the WebGPU spec implementation) only supports 14 "varyings", meaning variables that are created in the vertex shader and reused in the fragment shader.

That means that the `kernelBlur` shader is more limited than in WebGL in case your GPU would support more than 14 varyings (for eg, the GTX1080 supports up to 30 of them).

It also limits the complexity of node materials: some materials that would work in WebGL won't work in WebGPU because of that.
