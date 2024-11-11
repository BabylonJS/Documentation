---
title: Babylon.js Breaking Changes
image:
description: Breaking changes and how to adapt for them
keywords: backwards compatibility, breaking
further-reading:
video-overview:
video-content:
toc-levels: 2
---

## 7.34.0

### `SceneLoader.Load`, `SceneLoader.Append`, `SceneLoader.ImportMesh` does not return the plugin used to load the content anymore
In order to support automatic mimetype detection, we have removed the synchronous aspect of these 3 functions and they will return void for now on.
More details: https://forum.babylonjs.com/t/potential-new-breaking-change-please-chime-in/54651

To get the plugin used to load content, you can register to `SceneLoader.OnPluginActivatedObservable`

## 7.31.0

### Instance now get the same parent as the source
Before the instances where created with no parent but this was causing a lot of rendering issues when the source was coming from a glTF object. This change will make sure the source and the instance have the same parent.

### Deprecation of CSG class in favor of CSG2

The old CSG class was made of pure JS (it was a port from https://github.com/evanw/csg.js/) and while it served us, it was not maintained and not usable anymore.
We are now encouraging everyone to switch the new CSG2 class.

### Porting from CSG to CSG2

#### Asynchronous initialization

The main difference will be that CSG2 uses the [fantastic Manifold](https://github.com/elalish/manifold) to do the boolean operations. To that extend you have to call `BABYLON.InitializeCSG2Async()` before being able to use the CSG2 class.

Example:

```
await BABYLON.InitializeCSG2Async();

const sphereCSG = BABYLON.CSG2.FromMesh(sphere);
const boxCSG = BABYLON.CSG2.FromMesh(box);

const mesh = boxCSG.subtract(sphereCSG).toMesh("test");
```

### Inverse

The inverse feature is no more supported (and it was not really working so we all should be fine)

#### ToMesh

The method `toMesh` does take 3 parameters: name, scene and options.

#### MultiMaterials

CSG2 has a far simpler way to deal with multi-materials as it will automatically rebuild meshes with multi-materials if the source meshes had different materials.

### Example

Here is an example of a PG using CSG:
<Playground id="#VYZEEQ#4" title="CSG Subtract Example" description="Simple example of using a CSG subtract operation."/>

And the converted version:
<Playground id="#PJQHYV#1" title="CSG Subtract Example" description="Simple example of using a CSG2 subtract operation."/>

### Using CSG2

Please refer to the CSG2 [class documentation for more details](/features/featuresDeepDive/mesh/mergeMeshes#merging-meshes-with-constructive-solid-geometry)

## 7.19.0

### Main materials now generate WGSL shader code when used with WebGPU

This change is an improvement as the main shaders (StandardMaterial, PBRMaterial and BackGroundMaterial) are now generating pure WGSL and does not require compilation of GLSL code with TintWASM when used with a WebGPUEngine.
If you still need to get GLSL code (for instance if you inject your own custom code with a MaterialPlugin0, you can force the materials to use the GLSL code path with a boolean in the materials' constructors.

## 7.11.0

### mesh.overrideMaterialSideOrientation was renamed to mesh.sideOrientation

This change was made to simplify the sideOrientation process. Starting with this version, mesh.sideOrientation is used UNLESS material.sideOrientation is not null.
[content/breaking-changes.md](https://github.com/BabylonJS/Babylon.js/pull/15189)

## 7.6.0

### canvas is not xrCompatible per default

This change should not influence our XR users, but is a breaking change - instead of defining the canvas XR compatible right when creating the webgl2 context, the canvas is being made xr compatible when entering XR.
[content/breaking-changes.md](https://github.com/BabylonJS/Babylon.js/pull/15027)

## 7.2.2

### Remove WebGPUEngine Dependency on Engine

**[14931](https://github.com/BabylonJS/Babylon.js/pull/14931)**
This is a rather large change to decouple `WebGPUEngine` from `Engine` where all properties of `Engine` in the library are now properties of `AbstractEngine`. The existing methods, however, are all unchanged so the impact to them should be minimal. `ThinEngine` and `Engine` are almost entirely unchanged but there are two important considerations to be mindful of:

1. `AbstractEngine` is abstract and should not be instantiated
2. All common functions have been moved from `ThinEngine` to `AbstractEngine` so they can be shared with WebGPU Engine

The main impact on user code will only happen on TypeScript as the type of all `getEngine()` functions will be `AbstractEngine` instead of `ThinEngine`.

## 7.0.0

### Thin Instances

**[#14679](https://github.com/BabylonJS/Babylon.js/pull/14679)** The default value of the thin instances staticBuffer parameter was changed to true. When staticBuffer parameter is set to false, Angle can rearrange the buffers under the hood and completely break performance when in DirectX mode. In OpenGL mode using a value of false for the staticBuffer parameter does not affect performance. Due to the performance issues in DirectX mode, the new default for staticBuffer will be true to maintain performance levels.

### WebVR

**[#14439](https://github.com/BabylonJS/Babylon.js/pull/14439)** The WebVR API was deprecated and has now been removed from the engine. The remaining part of the previous implementation of WebVR is the VR experience helper. Leaving this in the engine will help any experiences that used WebVR and the VR experience helper to continue working. In the case that the VR experience helper is called in an experience the engine will correctly fall back to using WebXR. This will enable older VR experiences to continue to function while it is updated to remove the deprecated feature.

### ArrayBufferView

**[#13946](https://github.com/BabylonJS/Babylon.js/pull/13946)** Added ArrayBufferView to be one of the accepted types in the SceneLoader import methods. The SceneLoader methods for ImportMesh, ImportMeshAsync, Load, LoadAsync, Append, AppendAsync, and LoadAssetContainer have traditionally accepted the types string and File. Now these methods will also be able to receive the type ArrayBufferView.

This was required by Babylon Native for those times when model data is passed from C++ into JavaScript by mapping native memory into ArrayBuffers. Included with this change is an additional visualization test for loading a mesh directly from binary data.

### glTF Serializer

**[#13909](https://github.com/BabylonJS/Babylon.js/pull/13909)** The glTF exporter used to attempt to change the mesh data on serialization to bake in a conversion from a left-handed scene - which is the default in Babylon.js - to a right-handed coordinate system which is expected by the glTF specification. This conversion was causing issues with some exported assets so the breaking change was to stop attempting to change the mesh data to account for a right-handed coordinate system to match the glTF specification and instead negate one axis of the asset. This results in a negative scale on one axis of the asset's root node when imported into a left-handed Babylon.js scene.

### Material Cloning

**[#13807](https://github.com/BabylonJS/Babylon.js/pull/13807)** When cloning materials, the default behavior has been to clone any textures used in multiple material channels once for each channel that uses it. To prevent duplicating a texture multiple times when cloning a material, the parameter `cloneTexturesOnlyOnce` was added to clone to prevent extra duplication of textures allowing multiple material channels to reference a single texture. Since this behavior logically should be the way clone works, the default value of `cloneTexturesOnlyOnce` is set to true, which is a breaking change from how the engine used to work. If the previous behavior is desired, setting this parameter to false will restore the previous behavior.

### ShaderPath

**[#14908](https://github.com/BabylonJS/Babylon.js/pull/14908)** Previously when using ShaderMaterial, the constructor accepted a type of _any_ for ShaderPath which could cause issues when using ShaderMaterial in TypeScript projects. This changes adds types to ShaderPath instead of _any_, which will protect type compatibility with ShaderMaterial and TypeScript.
