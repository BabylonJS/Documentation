---
title: CDN Babylon.js Packages
image:
description: Obtain BABYLON.js Packages via CDN.
keywords: babylon.js, CDN, code, packages, core, gui, loaders, serializers, materials, viewer
further-reading:
video-overview:
video-content:
---

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN. Please read the section below for more information."/>

## Direct Usage

These packages can be imported directly from the CDN, as needed, using

```javascript
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/babylon.max.js"></script>
<script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
<script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.js"></script>
<script src="https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
<script src="https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.js"></script>
<script src="https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
<script src="https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.js"></script>
<script src="https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
<script src="https://cdn.babylonjs.com/serializers/babylonjs.serializers.js"></script>
<script src="https://cdn.babylonjs.com/gui/babylon.gui.min.js"></script>
<script src="https://cdn.babylonjs.com/gui/babylon.gui.js"></script>
<script src="https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
<script src="https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.max.js"></script>
<script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
<script src="https://cdn.babylonjs.com/viewer/babylon.viewer.max.js"></script>
```

## View

**Babylon.js Core**  
Minimum Version - [https://cdn.babylonjs.com/babylon.js](https://cdn.babylonjs.com/babylon.js)  
Readable Version - [https://cdn.babylonjs.com/babylon.max.js](https://cdn.babylonjs.com/babylon.max.js)

**Babylon.js Supported Advanced Materials**  
Minimum Version - [https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js](https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js)  
Readable Version - [https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.js](https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.js)

**Babylon.js All Official Loaders (OBJ, STL, glTF)**  
Minimum Version - [https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js](https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js)  
Readable Version - [https://cdn.babylonjs.com/loaders/babylonjs.loaders.js](https://cdn.babylonjs.com/loaders/babylonjs.loaders.js)

**Babylon.js Post Processes**  
Minimum Version - [https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js](https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js)  
Readable Version - [https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.js](https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.js)

**Babylon.js Procedural Textures**  
Minimum Version - [https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js)  
Readable Version - [https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.js](https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.js)

**Babylon.js Scene/Mesh Serializers**  
Minimum Version - [https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js](https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js)  
Readable Version - [https://cdn.babylonjs.com/serializers/babylonjs.serializers.js](https://cdn.babylonjs.com/serializers/babylonjs.serializers.js)

**Babylon.js GUI**  
Minimum Version - [https://cdn.babylonjs.com/gui/babylon.gui.min.js](https://cdn.babylonjs.com/gui/babylon.gui.min.js)  
Readable Version - [https://cdn.babylonjs.com/gui/babylon.gui.js](https://cdn.babylonjs.com/gui/babylon.gui.js)

**Babylon.js Inspector**  
Minimum Version - [https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js](https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js)  
Readable Version - [https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.max.js](https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.max.js)

**Babylon.js Viewer**  
Minimum Version - [https://cdn.babylonjs.com/viewer/babylon.viewer.js](https://cdn.babylonjs.com/viewer/babylon.viewer.js)  
Readable Version - [https://cdn.babylonjs.com/viewer/babylon.viewer.max.js](https://cdn.babylonjs.com/viewer/babylon.viewer.max.js)

## Deploying your own version of the resources

As the notice above states, it is not recommended to use the latest CDN version directly in production. Although the Babylon team won't do it deliberately, it is always possible that something could go wrong during the build or deployment of a specific version, and that the CDN could be updated with some code that will break your production application. We also can't guarantee 100% uptime, though we do our best to keep the server online.

Babylon itself is using the CDN throughout the framework, for example with Draco or Basis decoding, or the inspector. When loading these components without loading the module yourself before, the CDN will be used to download the file.

Babylon allows you to either load the module yourself and inject it to the components that are using the external dependencies, or allow you to provide a different base URL (or a full URL) for all components, or for each component individually.

### Simple - Changing base URL for external resources

To change the base URL for all resources loaded by Babylon, use the static member of tools:

```javascript
BABYLON.Tools.CDNBaseUrl = "https://my.wonderfull.server";
```

Of course, this can be done in ES6 by importing `Tools` and setting the `CDNBaseUrl`.

Any resources loaded in our core library will be loaded from this URL instead of `https://cdn.babylonjs.com`. The structure needs to remain the structure of our CDN.

For finer control, the following properties can be configured individually. Setting both has the same effect as setting `CDNBaseUrl`:

```javascript
BABYLON.Tools.ScriptBaseUrl = "https://my.wonderfull.server";
BABYLON.Tools.AssetBaseUrl = "https://my.wonderfull.server";
```

What are the simplest way to get the resources structured? Let's dive in.

#### 1. Using the CDN but with a fixed version

Whereas our CDN base directory always holds our nightlies, we do deploy specific versions of the framework on every release. Every release is available at `https://cdn.babylonjs.com/vX.X.X` . So, for example, if you want to use version 6.30.0 for your resources, you can change the base URL to this:

```javascript
BABYLON.Tools.CDNBaseUrl = "https://cdn.babylonjs.com/v6.30.0";
```

The CDN structure is guaranteed to be correct.

#### 2. Downloading the resources and deploy them on your own CDN

This option is the best for you, as you are in full control of the resources. To get the resources in the CDN structure you can download a Github release at [Github Babylon.js releases](https://github.com/BabylonJS/Babylon.js/releases).

After downloading the cdn snapshot zip file and deploying it on your server, change the base URL to the base URL of the resources deployed.

Make sure that your Server/CDN supports CORS, at least from your own Babylon experience.

### A bit more complex - deploy and configure specific resources

Instead of downloading and deploying our entire CDN structure, you can do that specifically for the **script** resources you are using. Each of these URLs in Babylon can be configured individually:

```javascript
const baseUrl = "https://foo.bar";

BABYLON.DracoDecoder.DefaultConfiguration = {
    wasmUrl: baseUrl + "/draco_wasm_wrapper_gltf.js",
    wasmBinaryUrl: baseUrl + "/draco_decoder_gltf.wasm",
    fallbackUrl: baseUrl + "/draco_decoder_gltf.js",
};

BABYLON.MeshoptCompression.Configuration.decoder = {
    url: baseUrl + "/meshopt_decoder.js",
};

BABYLON.GLTFValidation.Configuration = {
    url: baseUrl + "/gltf_validator.js",
};

BABYLON.KhronosTextureContainer2.URLConfig = {
    jsDecoderModule: baseUrl + "/babylon.ktx2Decoder.js",
    wasmUASTCToASTC: baseUrl + "/ktx2Transcoders/1/uastc_astc.wasm",
    wasmUASTCToBC7: baseUrl + "/ktx2Transcoders/1/uastc_bc7.wasm",
    wasmUASTCToRGBA_UNORM: baseUrl + "/ktx2Transcoders/1/uastc_rgba8_unorm_v2.wasm",
    wasmUASTCToRGBA_SRGB: baseUrl + "/ktx2Transcoders/1/uastc_rgba8_srgb_v2.wasm",
    jsMSCTranscoder: baseUrl + "/ktx2Transcoders/1/msc_basis_transcoder.js",
    wasmMSCTranscoder: baseUrl + "/ktx2Transcoders/1/msc_basis_transcoder.wasm",
    wasmZSTDDecoder: baseUrl + "/zstddec.wasm",
};

BABYLON.BasisToolsOptions.JSModuleURL = baseUrl + "/basisTranscoder/1/basis_transcoder.js";
BABYLON.BasisToolsOptions.WasmModuleURL = baseUrl + "/basisTranscoder/1/basis_transcoder.wasm";
```

## Special cases

### WebGPU

WebGPU requires `glslang` and `twgsl` (including their binaries) to work correctly.

To configure their URLs individually:

```javascript
const glslangOptions = {
  jsPath: baseUrl + "/glslang/glslang.js",
  wasmPath: baseUrl + "/glslang/glslang.wasm",
};

const twgslOptions = {
  jsPath: baseUrl + "/twgsl/twgsl.js",
  wasmPath: baseUrl + "/twgsl/twgsl.wasm",
};

const options = {
  // ... webgpu options
};

const engine = new BABYLON.WebGPUEngine(window.canvas, options);
await engine.initAsync(glslangOptions, twgslOptions);
```
