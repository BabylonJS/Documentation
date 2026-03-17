---
title: Code Blocks Test
description: Tests code block rendering with syntax highlighting
keywords: code, syntax, highlighting
further-reading:
video-overview:
video-content:
---

## JavaScript

```javascript
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 5, -10), scene);
```

## TypeScript

```typescript
interface MeshOptions {
    name: string;
    position: BABYLON.Vector3;
    rotation?: BABYLON.Vector3;
}

const createMesh = (options: MeshOptions): BABYLON.Mesh => {
    const mesh = BABYLON.MeshBuilder.CreateBox(options.name, {}, scene);
    mesh.position = options.position;
    return mesh;
};
```

## Shell Commands

```shell
npm install babylonjs --save
```

## GLSL

```glsl
precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;

void main(void) {
    gl_FragColor = texture2D(textureSampler, vUV);
}
```

## Inline Code

Use `BABYLON.Engine` to create the engine and `scene.render()` to render.
