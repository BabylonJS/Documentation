---
title: Native ES Modules in the Browser
image:
description: Run Babylon.js or Babylon Lite as native browser ES modules with import maps and no application bundler.
keywords: babylon.js, babylon lite, esm, es modules, browser, import maps, no bundler, jsdelivr, unpkg
further-reading:
  - title: ES6 / NPM Support
    url: /setup/frameworkPackages/es6Support
  - title: CDN Support
    url: /setup/frameworkPackages/CDN
video-overview:
video-content:
---

## Using ESM Without a Bundler

Modern browsers can load Babylon packages as native ES modules. An [import map](https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap) maps package specifiers such as `@babylonjs/core` or `@babylonjs/lite` to self-hosted files or a pinned npm CDN URL. Your application can then use standard `import` statements inside a `<script type="module">` without bundling Babylon.js.

These complete demos show the same approach for both Babylon.js and Babylon Lite:

| Package | Live demos | Source |
| ------- | ---------- | ------ |
| Babylon.js | [Babylon.js native ESM in the browser](https://raananw.github.io/babylonjs-esm-in-browser/) | [RaananW/babylonjs-esm-in-browser](https://github.com/RaananW/babylonjs-esm-in-browser) |
| Babylon Lite | [Babylon Lite in the browser](https://raananw.github.io/babylon-lite-in-browser/) | [RaananW/babylon-lite-in-browser](https://github.com/RaananW/babylon-lite-in-browser) |

The Babylon.js project runs one application against three module sources: self-hosted `@babylonjs/core` and `@babylonjs/loaders` package files, jsDelivr, and unpkg. It uses granular `.pure.js` imports so the unbundled browser does not fetch every re-export from a package barrel.

The Babylon Lite project includes a gallery of plain HTML and JavaScript scenes. It demonstrates both a local copy of the official `@babylonjs/lite` browser distribution and pinned jsDelivr or unpkg URLs. Babylon Lite is WebGPU-only, so its examples require a current browser with WebGPU support.

## When to Use This Approach

Native browser ESM is useful for learning, prototypes, static pages, and environments where a bundling pipeline is undesirable. Keep these tradeoffs in mind:

- Browsers do not tree-shake modules. Use an ESM-aware bundler when minimizing the production payload is more important than avoiding a build step.
- Pin exact package versions when loading modules from an npm CDN.
- Prefer self-hosting when you need offline development, predictable caching and availability, or a strict Content Security Policy.
- Serve the files over HTTP or HTTPS instead of opening the HTML through a `file://` URL.

The live demos expose their import maps and application source, and their GitHub repositories include the complete build and deployment configuration.
