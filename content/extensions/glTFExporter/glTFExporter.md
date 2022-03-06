---
title: glTF Exporter
image:
description: The glTF Exporter allowsBabylon.js models to be exported to the [glTF 2.0 format]
keywords: gltf, exporter
further-reading:
video-overview:
video-content:
---

The glTF Exporter allowsBabylon.js models to be exported to the [glTF 2.0 format](https://www.khronos.org/gltf/).

## Installation

The glTF Exporter can be installed by using the `babylonjs-serializers` module

### npm

```bash
npm install --save babylonjs babylonjs-serializers
```

### yarn

```bash
yarn add babylonjs babylonjs-serializers
```

### javascript

To include theBabylon.js serializers in javascript,
include a script tag in the html `<head>` tag, referencing the non-minified or minified compiled javascript:

```html
<!-- links to the latest version of the serializers -->
<script src="https://preview.babylonjs.com/serializers/babylonjs.serializers.js"></script>

<!-- links to the latest version of the minified serializers -->
<script src="https://preview.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
```

If only the glTF serializer is desired, it can be specifically targeted with this `<head>` tag:

```html
<!-- links to the latest version of the glTF serializer -->
<script src="https://preview.babylonjs.com/serializers/babylonjs.glTF2Serializer.js"></script>

<!-- links to the latest version of the minified glTF serializer -->
<script src="https://preview.babylonjs.com/serializers/babylonjs.glTF2Serializer.min.js"></script>
```

## Exporting a Scene to glTF

```javascript
BABYLON.GLTF2Export.GLTFAsync(scene, "fileName").then((gltf) => {
  gltf.downloadFiles();
});
```

To download to glb format, simply replace the `GLTFAsync` static function with `GLBAsync`:

```javascript
BABYLON.GLTF2Export.GLBAsync(scene, "fileName").then((glb) => {
    glb.downloadFiles();
});
```

## Export options

glTF Exporter accepts an optional `options` parameter with certain functions and properties defined.

### Excluding geometry

Sometimes you may need to exclude geometry from export, such as the skybox. You can define a boolean callback called `shouldExportNode` which accepts aBabylon.js node as an argument and returns a boolean, specifying if the node should be exported or not:

```javascript
// Initializer code...
let skybox = scene.createDefaultSkybox(hdrTexture, true, 100, 0.3);
// scene setup code...

let options = {
  shouldExportNode: function (node) {
    return node !== skybox;
  },
};

BABYLON.GLTF2Export.GLBAsync(scene, "fileName", options).then((glb) => {
  glb.downloadFiles();
});
```

## Supported features
- ✔️ Scene JSON string Export (.gltf)
- ✔️ Scene Binary Export (.glb)
- ✔️ Node Export
- ⚠️ Camera Export
    - Cameras are currently exported as an empty nodes.

- ✔️ Mesh Export
  - ✔️ Multiple UV sets
  - ✔️ Morph Targets
  - ✔️ Skinned Meshes
  - ❌ Mesh Instancing Extension [EXT_mesh_gpu_instancing](https://github.com/KhronosGroup/glTF/tree/master/toolsAndResources/2.0/Vendor/EXT_mesh_gpu_instancing)
  - ❌ Draco Mesh Compression Extension [KHR_draco_mesh_compression](https://github.com/KhronosGroup/glTF/tree/master/toolsAndResources/2.0/Khronos/KHR_draco_mesh_compression)

- ⚠️ Material Export
  - ✔️ Metal Roughness Materials [pbrMetallicRoughness](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material)
    - A conversion from `StandardMaterial` to `MetallicRoughness` has been implemented to try to match as close as visibly possible, though not all Babylon.js features are supported in glTF.
  - ❌ Specular Glossiness Materials Extension [KHR_materials_pbrSpecularGlossiness](https://github.com/KhronosGroup/glTF/tree/master/toolsAndResources/2.0/Khronos/KHR_materials_pbrSpecularGlossiness)
    - `SpecularGlossiness` has been superseeded by KHR_materials_specular. `KHR_materials_pbrSpecularGlossiness` will not be supported.
  - ❌ Specular Materials Extension [KHR_materials_specular](https://github.com/KhronosGroup/glTF/pull/1719/files?short_path=3757306#diff-3757306b203ae39ab0610702c04a45d4d598b904fe8ba4961ebc1c0409730b45)
  - ❌ Material Index of Refraction Extension [KHR_materials_ior](https://github.com/KhronosGroup/glTF/pull/1718/files?short_path=4698aba#diff-4698abaf20aa5bce525ce57cf0def8a07a476cd9dbc961226bef22e04a6a1591)
  - ❌ Material Volume Extension [KHR_materials_volume](https://github.com/KhronosGroup/glTF/pull/1726)
  - ✔️ Unlit Materials Extension [KHR_materials_unlit](https://github.com/KhronosGroup/glTF/tree/master/toolsAndResources/2.0/Khronos/KHR_materials_unlit)
  - ✔️ Occlusion, Roughness, Emissive (ORM) map
  - ✔️ Material Alpha Coverage modes
  - ✔️ Double sided materials
  - ❌ Material variants [KHR_materials_variants](https://github.com/KhronosGroup/glTF/tree/master/toolsAndResources/2.0/Khronos/KHR_materials_variants)


- ✔️ Animation
  - ✔️ Node Translate, Rotate, Scaling animation
  - ✔️ Skeletal Animation
    - As skeletons in glTF are represented as collections of nodes in the scene, skeletal animation is exported as TRS animation
  - ✔️ Morph Target Weight Animation
  - ✔️ Multiple animations
    - In scene, AnimationGroups will be exported as a single glTF Animation.
    - In scene, Animations not associated with an AnimationGroup will be exported as a single glTF animation.

- ✔️ Buffer View and Accessor Reuse
- ✔️ Extras Data
- ❌ XMP Metadata [KHR_XMP](https://github.com/KhronosGroup/glTF/tree/master/toolsAndResources/2.0/Khronos/KHR_xmp)
- ⚠️ Asset Info
    - Copyright field specification not supported.

Key:

    ✔️ Full support
    ⚠️ Partial Support
    ❌ No Support


## Coming soon

- Material Extensions
  - Clear coat [Babylon.js #10181](https://github.com/BabylonJS/Babylon.js/issues/10181)
  - Specular [Babylon.js #8968](https://github.com/BabylonJS/Babylon.js/issues/8968), however [KHR_Materials_Specular](https://github.com/KhronosGroup/glTF/pull/1719) is still in draft
  - Draco Mesh Compression [Babylon.js #8046](https://github.com/BabylonJS/Babylon.js/issues/8046)
  - Volume [KHR_Materials_Volume](https://github.com/KhronosGroup/glTF/pull/1726) is still in draft
  - IOR [KHR_Materials_IOR](https://github.com/KhronosGroup/glTF/pull/1718) is still in draft
  - Translucency [KHR_Materials_Translucency](https://github.com/KhronosGroup/glTF/pull/1825) is still in draft
- Camera Serialization [Babylon.js #9146](https://github.com/BabylonJS/Babylon.js/issues/9146)
- Mesh Instancing Extension [Babylon.js #7522](https://github.com/BabylonJS/Babylon.js/issues/7522)
