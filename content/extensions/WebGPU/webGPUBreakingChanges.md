---
title: WebGPU Breaking Changes
image:
description: Detail the breaking changes and differences in behaviour with WebGL
keywords: babylon.js, advanced, WebGPU, breaking changes
further-reading:
video-overview:
video-content:
---

This page is describing the breaking changes and differences in behaviour between WebGL and WebGPU.

We try to avoid breaking changes as much as possible in the core library, but sometimes we can't avoid them, and with the big new evolution that supporting WebGPU as a new engine is you need to be aware of a number of things if trying to port your existing projects to WebGPU.

## readPixels is now asynchronous

Probably the biggest change between WebGPU and WebGL is that reading from a texture is asynchronous in WebGPU, no way around it. So, all methods (even in WebGL mode) reading pixels from textures now return a promise:

- [BaseTexture.readPixels](/typedoc/classes/babylon.basetexture#readpixels)
- [ProceduralTexture.getContent](/typedoc/classes/babylon.proceduraltexture#getcontent)
- [ThinEngine.readPixels](/typedoc/classes/babylon.thinengine#readpixels)
- [CubeMapToSphericalPolynomialTools.ConvertCubeMapTextureToSphericalPolynomial](/typedoc/classes/babylon.cubemaptosphericalpolynomialtools#convertcubemaptexturetosphericalpolynomial)
- [CopyTools.GenerateBase64StringFromTexture](/typedoc/classes/babylon.copytools#generatebase64stringfromtexture)

To match how WebGL works there is a [flushFramebuffer](/typedoc/classes/babylon.thinengine#flushframebuffer) call that is automatically performed before reading a texture to be sure you get up to date data. However, if you know your texture is up to date when you call a **readPixels** method, you can avoid this flush (save some tiny bit of perf) by passing the appropriate parameter to the function call (_flushRenderer_ = _false_, see docs). Note that if you are doing the read in **engine.onEndFrameObservable** you don't need to flush, as this observer triggers after the flushing for the current frame has been done.

Note also that currently **readPixels** is slow if `width` is not divisible by 64! Also, it is very slow when reading data from half float textures: use full float textures instead if possible. Speeding those things up is on our roadmap.

## Creation of the WebGPU engine is asynchronous

Creating the engine is also asynchronous in WebGPU. You can do something like this to create a WebGPU engine if supported by the browser, or else a WebGL engine:

```javascript
async function createEngine() {
  const webGPUSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
  if (webGPUSupported) {
    const engine = new BABYLON.WebGPUEngine(document.getElementById("renderCanvas"));
    await engine.initAsync();
    return engine;
  }
  return new BABYLON.Engine(document.getElementById("renderCanvas"), true);
}
```

Or using the `EngineFactory` helper (it will try first to create a WebGPU engine if supported, then a WebGL engine then a null engine):

```javascript
async function createEngine() {
  return BABYLON.EngineFactory.CreateAsync(document.getElementById("renderCanvas"));
}
```

## Shader code differences

### Array of textures

Array of textures in shader code can't be accessed with a varying index, it must be an immediate value. For eg, `myTextures[0]` / `myTextures[1]` does work but not `myTextures[i]` (i being a variable loop for instance).

### Passing samplers to functions

In shaders, you can't pass samplers to functions:

```javascript
vec4 getPixel(sampler2D sampler, vec2 uv) {
    return texture2D(sampler, uv);
}
```

Calling this function will fail with a compilation error in WebGPU.

To simplify porting existing code we have added a pre-pass shader code inliner which will replace a function call by the code of the function itself. You need to tag the function(s) to be inlined with `#define inline` for the inliner to perform its processing:

```javascript
#define inline
vec4 getPixel(sampler2D sampler, vec2 uv) {
    return texture2D(sampler, uv);
}
```

### Binding values to samplers

WebGPU is less forgiving than WebGL, all sampler variables declared in a shader must have a value bound, even if you don't use that variable, contrary to WebGL. If you get a warning message like "**numBindings mismatch**", it means that you probably defined a uniform sampler variable in the shader code but didn't bind a value to it (by calling something like **setTexture("myvar", texture)** on the shader/material).

### ShaderMaterial

If using a custom attribute in a [ShaderMaterial](/typedoc/classes/babylon.shadermaterial) (or [CustomMaterial](/typedoc/classes/babylon.custommaterial) / [PBRCustomMaterial](/typedoc/classes/babylon.pbrcustommaterial)), it must be declared in the list of attributes used by that shader. For eg, for [ShaderMaterial](/typedoc/classes/babylon.shadermaterial), you must pass its name in the _attributes_ array of the options passed to the constructor. In WebGL you can omit this declaration and it will still work (but as a side-effect, it is not really supported).

In WebGL you could list several times the same attribute when creating a [ShaderMaterial](/typedoc/classes/babylon.shadermaterial) and it would work (it was as if you gave this attribute a single time), but in WebGPU it will fail.

### Sampling a depth texture

It is not possible to sample a depth texture from a GLSL shader when using the WebGPU engine because of the special type of a depth texture. **Note that it does work when using a comparison sampler: only non-comparison sampling does not work!**

If you want to sample a depth texture in WebGPU when using a non-comparison sampler, you will need to use a `ShaderMaterial` and write the shader in `WGSL`.

Here's how you can do it so that it works both in WebGL and WebGPU: <Playground id="#8RU8Q3#107" title="Sampling a depth texture" description="Demonstrate sampling a depth texture in WebGL and in WebGPU"/>

This playground creates a render target texture (RTT) and enables the depth/stencil texture. The RTT itself is displayed on the leftmost plane and the depth texture corresponding to this RTT is displayed on the rightmost plane. In WebGL, we are using a standard material and the emissive texture to display the depth texture whereas in WebGPU we are using a custom `ShaderMaterial` written in `WGSL`.

## Miscellaneous

The viewport can't spread outside the framebuffer/texture, contrary to WebGL. So, if you call something like:

```javascript
new BABYLON.Viewport(x, y, w, h);
```

- x, y, w, h must be >= 0 and &lt;= 1.
- x + w must be &lt;= 1
- y + h must be &lt;= 1

The stride of an attribute in a vertex buffer can't be less than 4 bytes, contrary to WebGL. Also, for the time being, position vertex kind must be number/float, it can't be char/int (Int8Array/Int32Array). Try this PG, which works in WebGL but not in WebGPU: <Playground id="#U1CZV3#4" title="Stride of 3 bytes" description="Demonstrate using a byte buffer for position"/>

The `TEXTUREFORMAT_LUMINANCE` format is not supported in WebGPU.
