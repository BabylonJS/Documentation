---
title: MMD Loader
image: /img/extensions/mmdLoader/ModelWithInspector.png
description: babylon-mmd is a MMD(MikuMikuDance) 3D model loader and animation runtime for the Babylon.js.
keywords: extensions, mmd, runtime, extension, external libraries
further-reading: 
video-overview: 
video-content: 
---

## **[babylon-mmd](https://github.com/noname0310/babylon-mmd)**: The MMD Loader and Runtime for Babylon.js

![Screenshot showing the MMD model in the playground](/img/extensions/mmdLoader/ModelWithInspector.png)
*[YYB Hatsune Miku_10th](https://www.deviantart.com/sanmuyyb/art/YYB-Hatsune-Miku-10th-DL-702119716) by YYB (modified)*

MMD is a Japanese 3D animation creation software that has its own 3D model format, PMD/PMX, and motion formats, VPD and VMD.

babylon-mmd is a library focused on loading PMX models and VMD motion files into babylon js and playing high-quality dance animations.

## Features

- Load PMX models and VMD motion files
- Solve IK, AppendTransform(a.k.a. Append, Grant) and RigidBody / Joint simulation
- MMD morph system
- MmdStandardMaterial for PMX models
- Support multiple models and motions
- Synced audio playback
- Player controls (play, pause, etc.)
- Optimized custom format for MMD models and motions

## Example

![Playground example of a MMD](/img/extensions/mmdLoader/PGScreenshot.png)
<Playground id="#028YR6#41" title="Complete MMD Example" description="Example of a MMD model with a VMD motion file and audio." />

*Music: [メランコリ・ナイト](https://youtu.be/y__uZETTuL8) by higma*

*Model: [YYB Hatsune Miku_10th](https://www.deviantart.com/sanmuyyb/art/YYB-Hatsune-Miku-10th-DL-702119716) by YYB (modified)*

*Motion / Camera: https://www.nicovideo.jp/watch/sm41164308 by ほうき堂*

## Usage

These are just a few code snippets, please refer to the documentation for full usage

### Installation

ES6 module:

```bash
npm add @babylonjs/core @babylonjs/havok babylon-mmd
```

UMD module using the html script tag:

```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/havok/HavokPhysics_umd.js"></script>
<script src="https://www.unpkg.com/babylon-mmd/umd/babylon.mmd.min.js"></script>
```

UMD module in Playgrounds:

```typescript
declare const BABYLONMMD: any;

await new Promise((resolve) => {
    const babylonMmdScript = document.createElement("script");
    babylonMmdScript.src = "https://www.unpkg.com/babylon-mmd/umd/babylon.mmd.min.js";
    document.head.appendChild(babylonMmdScript);
    babylonMmdScript.onload = resolve;
});
```

### Import PMX Model

<Playground id="#FY1L15#3" title="Import PMX Model" description="Example of importing a PMX model." />

```typescript
import "babylon-mmd/esm/Loader/pmxLoader"; // side effect import

const mmdMesh = await SceneLoader.ImportMeshAsync(undefined, "your_model_path.pmx", undefined, scene).then((result) => result.meshes[0]);
```

load PMX model by `SceneLoader.ImportMeshAsync` always returns a 1-length array, so you can get the mesh by `result.meshes[0]`.

### Import VMD Motion

```typescript
const vmdLoader = new VmdLoader(scene);
const modelMotion = await vmdLoader.loadAsync("model_motion_1", "your_model_motion_path.vmd");
```

### Play MMD Animation

```typescript
const mmdRuntime = new MmdRuntime();
mmdRuntime.register(scene);
const mmdModel = mmdRuntime.createMmdModel(mmdMesh);
mmdModel.addAnimation(modelMotion);
mmdModel.setAnimation("model_motion_1");
```

## Documentation

In **[this document](https://noname0310.github.io/babylon-mmd/)**, you'll learn how to fully utilize babylon-mmd by creating two pieces of work together.
