---
title: glTF Exporter
image:
description: The glTF Exporter allows Babylon.js scenes to be exported to the [glTF 2.0 format]
keywords: gltf, exporter
further-reading:
video-overview:
video-content:
---

## Overview

The glTF Exporter allows Babylon scenes to be exported to [glTF 2.0](https://www.khronos.org/gltf/), an open-standard file format for transmitting and loading 3D scenes. It comes in two variants.

- glTF (`.gltf`), which uses JSON to describe the scene hierarchy. It may reference both external binary files (`.bin`) that contain geometry and animation data, as well as image files (`.png`, `.jpg`) that contain texture images.
- GLB (`.glb`), which packages all data, including scene hierarchy, geometry, animation, and image data, into a single binary file for easier distribution.

## Installation

### CDN

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

To quickly use the glTF Exporter in a page, import the compiled UMD Javascript from the Babylon CDN like so:

<CodePen pen="raNGBqG" tab="html,result" title="glTF Exporter - Using the CDN" />

### NPM

When ready to build and bundle an app, use the `@babylonjs/serializers` ES6 package:

```bash
npm install @babylonjs/core @babylonjs/serializers
```

```javascript
import { GLTF2Export } from "@babylonjs/serializers";

// Scene setup code...

GLTF2Export.GLTFAsync(scene, "fileName").then((data) => {
  console.log("Exported GLTF:", data.files["fileName.gltf"]);
  data.downloadFiles();
});
```

## Basic Usage

To download a `.gltf` along with its accompanying binary and image files:

```javascript
GLTF2Export.GLTFAsync(scene, "fileName").then((gltf) => {
  gltf.downloadFiles();
});
```

To download a `.glb`, simply replace the `GLTFAsync` static function with `GLBAsync`:

```javascript
GLTF2Export.GLBAsync(scene, "fileName").then((glb) => {
  glb.downloadFiles();
});
```

## Export options

The glTF Exporter accepts an optional `options` parameter with certain functions and properties defined.

```typescript
const options: IExportOptions = {
  // Function to indicate whether a Babylon node in the scene should be exported or not.
  shouldExportNode: (node: Node): boolean => {
    return node.name === "myCamera" || node.name === "myMesh" || node.name === "myLight";
  },
  // Function to indicate whether an animation in the scene should be exported or not.
  shouldExportAnimation: (animation: Animation): boolean => {
    return animation.name === "myAnimation";
  },
  // The sample rate to bake animation curves. Defaults to 1 / 60.
  animationSampleRate: 1 / 60,
  // Begin serialization without waiting for the scene to be ready. Defaults to false.
  exportWithoutWaitingForScene: false,
  // Indicates if unused UV vertex attributes should be included in export. Defaults to false.
  exportUnusedUVs: false,
  // Remove no-op root nodes when possible. Defaults to true.
  removeNoopRootNodes: true,
  // The mesh compression method to use. Defaults to "None".
  meshCompressionMethod: "None",
};

GLTF2Export.GLTFAsync(scene, "fileName", options);
```

### Details

- `shouldExportNode`: Sometimes, you may need to exclude geometry from export, such as the skybox. You can define a callback which accepts a Babylon.js node as an argument and returns a boolean, specifying if the node should be exported or not.
- `removeNoopRootNodes`: When importing a glTF asset into a left-handed scene (the Babylon default), the glTF Loader inserts the imported asset under a brand new node at the scene's root. This node helps to quickly convert the asset's right-handed coordinate system (the glTF default) to the scene's left-handed one. If you'd like to keep this root conversion node on export, or keep any other "no-op" root nodes, you can specify `true`.
- `meshCompressionMethod`: For scenes with complex or large models, it may be preferable to compress their geometries for smaller export sizes. You can specify `"Draco"` to compress all geometries in the exported scene using the [Draco compression scheme](https://github.com/google/draco?tab=readme-ov-file#description).

## Loading referenced CDN files locally

If exporting a scene using the `"Draco"` mesh compression option, the glTF Exporter will request additional files from `cdn.babylonjs.com` by default. If you want to deliver these files locally (e.g. for GDPR compliance), you can set the `DracoEncoder.DefaultConfiguration` object to use local files:

```typescript
import { DracoEncoder } from "@babylonjs/core";

DracoEncoder.DefaultConfiguration = {
  wasmUrl: "/babylon-draco-files/draco_encoder_wasm_wrapper.js",
  wasmBinaryUrl: "/babylon-draco-files/draco_encoder.wasm",
  fallbackUrl: "/babylon-draco-files/draco_encoder.js",
};
```

Be sure to download the files first (from `https://cdn.babylonjs.com/[FILENAME]`) and put them in a local path (`public/babylon-draco-files`, in this case).

## List of supported features

Key:
✔️ Full support
⚠️ Partial Support
❌ No Support

##### Scene

- ✔️ .gltf Export
- ✔️ .glb Export
- ✔️ Camera Export
- ✔️ Punctual Lights Extension [KHR_lights_punctual](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_lights_punctual)

##### Meshes

- ✔️ Multiple UV sets
- ✔️ Morph Targets
- ✔️ Skinned Meshes
- ✔️ Instancing
- ✔️ 8 to 32 bit Vertex Data
- ✔️ Buffer View and Accessor Reuse
- ✔️ GPU/Thin Instancing Extension [EXT_mesh_gpu_instancing](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing)
- ❌ Mesh Quantization Extension [KHR_mesh_quantization](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_mesh_quantization)
- ✔️ Draco Compression Extension [KHR_draco_mesh_compression](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression)
  - There is currently no built-in support for roundtripping Draco-compressed glTF assets.
- ❌ Meshopt Compression Extension [EXT_meshopt_compression](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_meshopt_compression/README.md)
- ❌ Pivot points

##### Materials

- ✔️ Metallic-Roughness [pbrMetallicRoughness](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material)
  - For `StandardMaterial`, `PBRSpecularGlossinessMaterial`, and any `PBRMaterial` whose `PBRMaterial.isMetallicWorkflow() === false`, the material will be converted to a metallic-roughness workflow while matching the original as closely as possible, though not all of their original Babylon.js features are supported in glTF.
- ✔️ Occlusion, Roughness, Metallic (ORM) map
- ✔️ Alpha coverage modes
- ✔️ Double-sided materials
- ❌ Specular-Glossiness Extension [KHR_materials_pbrSpecularGlossiness](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness)
  - `SpecularGlossiness` has been superseeded by KHR_materials_specular. `KHR_materials_pbrSpecularGlossiness` will not be supported.
- ✔️ Index of Refraction Extension [KHR_materials_ior](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_ior)
- ✔️ Volume Extension [KHR_materials_volume](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_volume)
- ✔️ Unlit Materials Extension [KHR_materials_unlit](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_unlit)
- ❌ Material Variants Extension [KHR_materials_variants](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_variants)
- ✔️ Clearcoat Extension [KHR_materials_clearcoat](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_clearcoat)
- ✔️ Specular Extension [KHR_materials_specular](https://github.com/KhronosGroup/glTF/pull/1719/files)
- ✔️ Transmission Extension [KHR_materials_transmission](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_transmission)
- ✔️ Diffuse Transmission Extension [KHR_materials_diffuse_transmission](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_diffuse_transmission)
- ✔️ Dispersion Extension [KHR_materials_dispersion](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_dispersion)
- ✔️ Anisotropy Extension [KHR_materials_anisotropy](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_anisotropy)
- ✔️ Emissive Strength Extension [KHR_materials_emissive_strength](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_emissive_strength)
- ✔️ Iridescence Extension [KHR_materials_iridescence](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_iridescence)
- ✔️ Sheen Extension [KHR_materials_sheen](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen)

##### Textures

- ✔️ PNG export
- ⚠️ JPG, WEBP export
- ✔️ Texture reuse
- ✔️ Texture Transform Extension [KHR_texture_transform](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_texture_transform)
- ❌ Basis Universal Texture Compression Extension [KHR_texture_basisu](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_texture_basisu)

##### Animations

- ✔️ Node Translate, Rotate, Scaling animation
- ✔️ Skeletal Animation
  - As skeletons in glTF are represented as collections of nodes in the scene, skeletal animation is exported as TRS animation
- ✔️ Morph Target Weight Animation
- ✔️ Multiple animations
  - In scene, AnimationGroups will be exported as a single glTF Animation.
  - In scene, Animations not associated with an AnimationGroup will be exported as a single glTF animation.
- ❌ Animation Pointer Extension [KHR_animation_pointer](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_animation_pointer)

##### Metadata

- ✔️ Extras Data
- ❌ XMP Metadata [KHR_xmp_json_ld](https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_xmp_json_ld)
- ⚠️ Asset Info
  - Copyright field specification not supported.
