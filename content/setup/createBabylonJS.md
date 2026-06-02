---
title: Scaffold a Babylon.js Project with create-babylonjs
image:
description: Use the create-babylonjs CLI to generate a ready-to-run Babylon.js project with your choice of module format, language, and bundler.
keywords: babylon.js, setup, scaffold, create, CLI, template, vite, webpack, rollup, ES6, UMD, typescript, javascript, npm
further-reading:
  - title: ES6 / NPM Support
    url: /setup/frameworkPackages/es6Support
  - title: UMD / NPM Support
    url: /setup/frameworkPackages/npmSupport
  - title: CDN Support
    url: /setup/frameworkPackages/CDN
  - title: Starter HTML Template
    url: /setup/starterHTML
video-overview:
video-content:
---

## Overview

`create-babylonjs` is the official Babylon.js project scaffolder. Running a single command launches an interactive CLI that asks you a few questions and then generates a fully configured, ready-to-run project. No manual wiring of bundlers, TypeScript configs, or Babylon.js imports required.

## Quick Start

```bash
npm create babylonjs
```

Then follow the on-screen prompts, and start your app:

```bash
cd my-babylonjs-app
npm install
npm run dev
```

You can also pass a project name directly to skip the first prompt:

```bash
npm create babylonjs my-scene
```

## What the CLI Asks

The CLI walks you through four choices:

| Prompt            | Options                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------ |
| **Project name**  | Any name (defaults to `my-babylonjs-app`)                                                  |
| **Module format** | ES6 (`@babylonjs/core` — tree-shakeable) or UMD (`babylonjs` — global `BABYLON` namespace) |
| **Language**      | TypeScript or JavaScript                                                                   |
| **Bundler**       | Vite, Webpack, Rollup, or None (CDN script tags — UMD only)                                |

<Alert severity="info" title="CDN-only option" description="The 'None' bundler option is only available when UMD is selected as the module format. It generates a single index.html file with CDN script tags — no npm install or build step needed." />

## Generated Project

Every scaffolded project includes:

- A starter scene that loads a glTF model (`boombox.glb`) with environment lighting
- `SceneLoader.AppendAsync` for async model loading
- `scene.createDefaultCamera()` to automatically frame the loaded model
- `scene.createDefaultEnvironment()` for a skybox, reflective ground, and image-based lighting (IBL)
- A render loop with canvas resize handling
- `package.json` with `dev`, `build`, and `build:prod` scripts

### ES6 Template

Uses tree-shakeable imports from `@babylonjs/core` and `@babylonjs/loaders`, along with the required side-effect imports for tree-shaken builds:

```typescript
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/loaders/glTF";
```

### UMD Template

Uses the `babylonjs` and `babylonjs-loaders` packages with the global `BABYLON` namespace:

```typescript
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
```

### CDN-only Template (No Bundler)

A single `index.html` with `<script>` tags — no `npm install` required:

```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```

<Alert severity="warning" title="CDN in production" description="The CDN is intended for learning and prototyping. For production applications, serve Babylon.js from your own CDN or bundle it with your application." />

## Template Matrix

The combination of module format, language, and bundler determines the generated files:

| Module Format | Language | Bundler                 | Generated Files                                                                                     |
| ------------- | -------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| ES6           | TS or JS | Vite                    | `src/index.{ts,js}`, `vite.config.{ts,js}`, `index.html`, `package.json`, `tsconfig.json` (TS only) |
| ES6           | TS or JS | Webpack                 | `src/index.{ts,js}`, `webpack.config.js`, `index.html`, `package.json`, `tsconfig.json` (TS only)   |
| ES6           | TS or JS | Rollup                  | `src/index.{ts,js}`, `rollup.config.mjs`, `index.html`, `package.json`, `tsconfig.json` (TS only)   |
| UMD           | TS or JS | Vite / Webpack / Rollup | Same structure, but uses `babylonjs` + `babylonjs-loaders` packages                                 |
| UMD           | JS       | None                    | `index.html` only (CDN `<script>` tags)                                                             |

## Bundler Configurations

Each bundler template includes a `dev` script for local development and a `build:prod` script for production:

| Bundler | Config File                         | Dev Command                                    |
| ------- | ----------------------------------- | ---------------------------------------------- |
| Vite    | `vite.config.ts` / `vite.config.js` | `npm run dev`                                  |
| Webpack | `webpack.config.js`                 | `npm run dev` (webpack-dev-server)             |
| Rollup  | `rollup.config.mjs`                 | `npm run dev` (rollup with watch + livereload) |
| None    | —                                   | Open `index.html` directly in a browser        |

## Production Build

All bundler-based templates include a `build:prod` script that creates an optimized production bundle:

```bash
npm run build:prod
```

| Bundler | Output           | Preview                                         |
| ------- | ---------------- | ----------------------------------------------- |
| Vite    | `dist/`          | `npm run preview`                               |
| Webpack | `dist/`          | Serve `dist/` with any static HTTP server       |
| Rollup  | `dist/bundle.js` | Open `index.html` (references `dist/bundle.js`) |

Deploy the contents of `dist/` (or the project root for CDN-only) to any static hosting provider.

## Choosing a Module Format

If you are starting a new project, **ES6 is recommended**. It enables tree-shaking — only the parts of Babylon.js your code actually uses are included in the bundle, keeping the final size as small as possible.

**UMD** is the better choice when:

- You want to use Babylon.js via `<script>` tags without a bundler (CDN-only option)
- You are copying examples directly from the Babylon.js documentation (most doc examples use the `BABYLON.*` namespace)
- You need a quick prototype without setting up a build pipeline

See [ES6 / NPM Support](/setup/frameworkPackages/es6Support) and [UMD / NPM Support](/setup/frameworkPackages/npmSupport) for a deeper comparison.

## Next Steps

After scaffolding, the generated `src/index.ts` (or `.js`) is your entry point. From there you can:

- Replace the sample model load with your own assets
- Add meshes, lights, cameras, and materials
- Explore the [Babylon.js documentation](https://doc.babylonjs.com) and [Playground](https://playground.babylonjs.com) for inspiration
- Install additional Babylon.js packages (`@babylonjs/gui`, `@babylonjs/inspector`, etc.) with `npm install`
