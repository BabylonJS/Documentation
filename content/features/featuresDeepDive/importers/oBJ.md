---
title: .obj File Loader Plugin
image:
description: Learn about the .obj File Loader Plugin available in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, .obj, obj
further-reading:
video-overview:
video-content:
---

## OBJ File Import

To use it, you just have to reference the loader file:

```html
<script src="babylon.js"></script>
<script src="babylon.objFileLoader.js"></script>
```

You can find it [here](https://cdn.babylonjs.com/loaders/babylon.objFileLoader.js)

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

If you are using UMD imports via NPM, you need to reference with side-effects:

```javascript
import "babylonjs-loaders";
```

If you wish to benefit from the tree-shakeable ES6 package, you need to reference:

```javascript
import "@babylonjs/loaders/OBJ/objFileLoader";
```

You can read more about [NPM support](/setup/frameworkPackages/npmSupport)

### Load

See [how to load from any file type](/features/featuresDeepDive/importers/loadingFileTypes)
Babylon.js will know how to load the obj file and its mtl file automatically:

## Good things to know

- Your model doesn't have to be triangulated, as this loader will do it automatically.
- A Babylon.Mesh will be created for each object/group
- The obj model should be exported with -Z axis forward, and Y axis upward to be compatible with Babylon.js

![Axis](/img/how_to/import-obj/axys.jpg)

- By default, due to optimization in the code for loading time, UVs problems can appear, like this :

![Batman UVs problem](/img/how_to/import-obj/uv-issue.jpg)

If you meet this problem, set the variable:

```javascript
BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
```

Then, you'll have a better texture, but with a longer loading.

![Batman UVs ok](/img/how_to/import-obj/uv-fixed.jpg)

Depending on the modeling program you export your OBJ files from, textures may appear distorted or inverted. As a workaround, you can modify your imported model's UV coordinate scale via setting the variable:

```javascript
BABYLON.OBJFileLoader.UV_SCALE = new BABYLON.Vector2(xValue, yValue);
```

Although not part of Wavefront OBJ file format, some OBJ files include vertex colors. If you are loading such a file and want vertices with colors, set the variable:

```javascript
BABYLON.OBJFileLoader.IMPORT_VERTEX_COLORS = true;
```

If you have an OBJ file without normals or wish to have them calculated for you, set the variable:

```javascript
BABYLON.OBJFileLoader.COMPUTE_NORMALS = true;
```

When using OPTIMIZE_WITH_UV = true you may experience some discontinuities in shading. Setting OPTIMIZE_NORMALS will help with this problem:

```javascript
BABYLON.OBJFileLoader.OPTIMIZE_NORMALS = true;
```

To have your imported model inverted on the y-axis, set the variable:

```javascript
BABYLON.OBJFileLoader.INVERT_Y = true;
```

To invert your imported textures on the y-axis, set the variable:

```javascript
BABYLON.OBJFileLoader.INVERT_TEXTURE_Y = true;
```

By default if a MTL file cannot be loaded (missing/error) it will silently fail. The model will still be loaded, but if you want to enforce a stricter loading of materials you can use onSuccess() and onError() callbacks accordingly. Set the variable:

```javascript
BABYLON.OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = false;
```

If a MTL is defined in your OBJ and you wish to have it ignored, set the variable:

```javascript
BABYLON.OBJFileLoader.SKIP_MATERIALS = true;
```

## Supported

- Object/group
- Geometric vertex
  - colors
- Faces
  - triangles
  - quads
  - polygons
- Colors
  - diffuseColor
  - ambientColor
  - specularColor
  - specularPower
  - alpha
- Textures
  - ambientTexture
  - diffuseTexture
  - specularTexture
  - bumpTexture
  - opacityTexture
- Multimaterial
  - For each material defined in the same mesh, it creates a new BABYLON.Mesh.
  - The name of the created BABYLON.Mesh follows this syntax: meshName_mmX
  - X is the nth BABYLON.Mesh created with this method

## Not supported currently

- Smoothing groups (s parameter in OBJ file)
- Illumination (illum parameter in MTL file)
- The differents options for loading textures in MTL file.
- A good description about MTL files and their options can be found here: http://paulbourke.net/dataformats/mtl/
