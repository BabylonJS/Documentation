---
title: WebGPU Breaking Changes
image:
description: Details the breaking changes and differences in behavior from WebGL
keywords: babylon.js, advanced, WebGPU, breaking changes
further-reading:
video-overview:
video-content:
---

This page describes the breaking changes and differences in behavior between WebGL and WebGPU.

We try to avoid breaking changes in the core library as much as possible, but sometimes we cannot avoid them. With the major change that WebGPU introduces as a new engine, you need to be aware of a number of things when porting existing projects to WebGPU.

## readPixels is now asynchronous

Probably the biggest change between WebGPU and WebGL is that reading from a texture is asynchronous in WebGPU. As a result, all methods that read pixels from textures, even in WebGL mode, now return a promise:

- [BaseTexture.readPixels](/typedoc/classes/babylon.basetexture#readpixels)
- [ProceduralTexture.getContent](/typedoc/classes/babylon.proceduraltexture#getcontent)
- [ThinEngine.readPixels](/typedoc/classes/babylon.thinengine#readpixels)
- [CubeMapToSphericalPolynomialTools.ConvertCubeMapTextureToSphericalPolynomial](/typedoc/classes/babylon.cubemaptosphericalpolynomialtools#convertcubemaptexturetosphericalpolynomial)
- [CopyTools.GenerateBase64StringFromTexture](/typedoc/classes/babylon.copytools#generatebase64stringfromtexture)

To match how WebGL works, a [flushFramebuffer](/typedoc/classes/babylon.thinengine#flushframebuffer) call is automatically performed before reading a texture to make sure you get up-to-date data. However, if you know your texture is already up to date when you call a **readPixels** method, you can avoid this flush, and save a small amount of performance, by passing the appropriate parameter to the function call (_flushRenderer_ = _false_, see docs). Note that if you are doing the read in **engine.onEndFrameObservable**, you do not need to flush, because this observer runs after the flush for the current frame has been done.

Note also that **readPixels** is currently slow if `width` is not divisible by 64. It is also very slow when reading data from half-float textures, so use full-float textures instead when possible. Improving these cases is on our roadmap.

## Creation of the WebGPU engine is asynchronous

Creating the engine is also asynchronous in WebGPU. You can do something like this to create a WebGPU engine if the browser supports it, or a WebGL engine otherwise:

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

Or you can use the `EngineFactory` helper. It first tries to create a WebGPU engine if supported, then a WebGL engine, and finally a null engine:

```javascript
async function createEngine() {
  return BABYLON.EngineFactory.CreateAsync(document.getElementById("renderCanvas"));
}
```

### WebGPU engines intended for WebXR

WebGPU has no post-creation operation that makes an adapter XR-compatible. If the engine may enter WebXR, pass `xrCompatible: true` when constructing it:

```javascript
const engine = new BABYLON.WebGPUEngine(canvas, { xrCompatible: true });
await engine.initAsync();
```

WebGPU-XR additionally requires the experimental `XRGPUBinding` projection path, `XRGPUSubImage.prototype.getViewDescriptor`, and the WebXR Layers feature. Babylon does not replace an existing WebGPU engine or scene with WebGL if XR entry fails. Applications that offer a fallback must select WebGL before scene and resource creation, or fully dispose and rebuild/reload the application with WebGL. See [WebGPU in WebXR](/features/featuresDeepDive/webXR/webGPUXR).

## Shader code differences

### Array of textures

Arrays of textures in shader code cannot be accessed with a varying index; the index must be an immediate value. For example, `myTextures[0]` and `myTextures[1]` work, but `myTextures[i]` does not, where `i` is a loop variable.

### Passing samplers to functions

In shaders, you cannot pass samplers to functions:

```javascript
vec4 getPixel(sampler2D sampler, vec2 uv) {
    return texture2D(sampler, uv);
}
```

Calling this function will fail with a compilation error in WebGPU.

To simplify porting existing code, we have added a pre-pass shader code inliner that replaces a function call with the code of the function itself. You need to tag the function or functions to be inlined with `#define inline` for the inliner to process them:

```javascript
#define inline
vec4 getPixel(sampler2D sampler, vec2 uv) {
    return texture2D(sampler, uv);
}
```

### Binding values to samplers

WebGPU is less forgiving than WebGL. All sampler variables declared in a shader must have a bound value, even if you do not use that variable. If you get a warning message like "**numBindings mismatch**", it probably means you defined a uniform sampler variable in the shader code but did not bind a value to it by calling something like **setTexture("myvar", texture)** on the shader or material.

### ShaderMaterial

If you use a custom attribute in a [ShaderMaterial](/typedoc/classes/babylon.shadermaterial), [CustomMaterial](/typedoc/classes/babylon.custommaterial), or [PBRCustomMaterial](/typedoc/classes/babylon.pbrcustommaterial), it must be declared in the list of attributes used by that shader. For example, for [ShaderMaterial](/typedoc/classes/babylon.shadermaterial), you must pass its name in the _attributes_ array of the options passed to the constructor. In WebGL, you can omit this declaration and it will still work, but that side effect is not really supported.

In WebGL, you could list the same attribute several times when creating a [ShaderMaterial](/typedoc/classes/babylon.shadermaterial), and it would work as if you had provided the attribute only once. In WebGPU, this fails.

## Miscellaneous

Unlike WebGL, the viewport cannot extend outside the framebuffer or texture. So, if you call something like:

```javascript
new BABYLON.Viewport(x, y, w, h);
```

- x, y, w, h must be >= 0 and &lt;= 1.
- x + w must be &lt;= 1
- y + h must be &lt;= 1

If you still want to use out-of-bounds values, you can use a material plugin like in this PG: <Playground id="#IIBY03#33" engine="webgpu" title="Viewport out-of-bounds values" description="Demonstrate how to support a viewport with out-of-bounds values in WebGPU"/>

The `TEXTUREFORMAT_LUMINANCE` format is not supported in WebGPU.
