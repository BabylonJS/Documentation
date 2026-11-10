---
title: HTML Textures
image:
description: Render live HTML elements into a Babylon.js texture using the WICG HTML-in-Canvas API.
keywords: diving deeper, materials, html texture, html in canvas, dom, interaction
further-reading:
video-overview:
video-content:
---

## What is an HTML Texture?

`HtmlTexture` renders a **live HTML element** — a `<div>`, a form, an SVG, an entire styled DOM subtree — into a texture you can apply to any material. It is built on the experimental [WICG HTML-in-Canvas](https://github.com/WICG/html-in-canvas) API, which lets the browser lay out and rasterize a real DOM element directly into a WebGL or WebGPU texture.

Unlike a [Dynamic Texture](/features/featuresDeepDive/materials/using/dynamicTexture) (where you draw with the 2D canvas API) or a [Video Texture](/features/featuresDeepDive/materials/using/videoTexture) (which copies a `<video>` element), `HtmlTexture` snapshots arbitrary, fully styled HTML — including text, CSS layout, and nested elements.

It also ships with optional **interaction managers** that route Babylon pointer events back to the DOM, so the rendered HTML can stay interactive (buttons, links, hover states) on a 3D surface.

## Examples

<Playground id="#C9MWZC#3" title="HTML Texture Control Panel" description="An interactive HTML control panel (theme swatches, counter, toggle and animated progress bar) rendered onto a plane as an HtmlTexture."/>

<Playground id="#8RDVXG#2" title="Multiple HTML Textures" description="Two independent HtmlTextures — a live counter and an interactive button card — each on its own rotating plane."/>

Both demos load the polyfill from a CDN so they run in any browser (see [Enabling the polyfill](#enabling-the-polyfill)).

## Browser support

The underlying API is experimental and not yet broadly shipped. `HtmlTexture` renders through the first available of these paths:

- **Natively**, in a browser that exposes the API (for example, Chrome Canary with `chrome://flags/#canvas-draw-element` enabled). This is the fastest path: the browser copies the laid-out element straight into the GPU texture.
- **Via a polyfill**, using [`@underglass/html-in-canvas-polyfill`](https://www.npmjs.com/package/@underglass/html-in-canvas-polyfill), imported directly before creating the engine (see [Enabling the polyfill](#enabling-the-polyfill) below).
- **Via the built-in SVG fallback**, which works in any modern browser with no extra setup (see [The built-in SVG fallback](#the-built-in-svg-fallback) below). This is the default when neither of the above is present.

Because the SVG fallback is enabled by default, `HtmlTexture` renders in regular browsers out of the box. It never throws, so it is safe to include in code that also runs on browsers without the native API.

Both **WebGL2** and **WebGPU** engines are supported; the correct upload path is selected automatically.

## Low-level HTML-in-Canvas API compatibility

Babylon.js includes TypeScript declarations for the experimental browser API used by `HtmlTexture`. These declarations follow the current [WICG HTML-in-Canvas explainer](https://github.com/WICG/html-in-canvas) while keeping older names as deprecated aliases for browsers and polyfills that still expose them.

Use the current API names in new code:

- Set `canvas.content = "drawable"` instead of using the deprecated `layoutSubtree` property.
- Listen for `CanvasPaintEvent`; the older `PaintEvent` name remains as a deprecated alias.
- Read the default drawable size with `canvas.getElementImageDefaultSize(element)`.
- Use `texElementSubImage2D` for WebGL and `drawElementImageToTexture` for WebGPU. The older `texElementImage2D` and `copyElementImageToTexture` methods remain deprecated.

`CanvasRenderingContext2D.drawElementImage()` now returns `void`, matching browser behavior. If you need the element's current canvas transform, call `canvas.getElementTransform(element)` instead of reading the draw call's return value. Existing draw call shapes still compile, including legacy calls with optional destination dimensions.

```javascript
const canvas = document.createElement("canvas");
canvas.content = "drawable";

const element = document.createElement("div");
element.setAttribute("drawable", "");
element.textContent = "Drawn into the canvas";
canvas.appendChild(element);
document.body.appendChild(canvas);

const context = canvas.getContext("2d");

canvas.addEventListener("paint", () => {
  context.drawElementImage(element, 0, 0);
  const transform = canvas.getElementTransform(element);
  console.log(transform);
});
```

By default, `drawElementImage()` also updates the element geometry used for hit testing and accessibility. Pass `{ preserveElementGeometry: true }` to keep the current geometry instead. For `OffscreenCanvas`, geometry updates are batched and the associated HTML canvas fires `elementgeometryupdate` after they are applied.

These declaration changes do not change `HtmlTexture` runtime behavior. See [BabylonJS/Babylon.js#19116](https://github.com/BabylonJS/Babylon.js/pull/19116) for the compatibility details.

## Creating an HTML Texture

```javascript
// Any live DOM element can be the source.
const el = document.createElement("div");
el.style.cssText = "width:512px;height:512px;background:#1e293b;color:#fff;font:24px sans-serif;padding:24px;box-sizing:border-box";
el.innerHTML = "<h1>Hello DOM</h1><p>Rendered into a texture.</p>";

const htmlTexture = new BABYLON.HtmlTexture("html", el, { scene });

const material = new BABYLON.StandardMaterial("mat", scene);
material.emissiveTexture = htmlTexture;
material.disableLighting = true;

const plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 2 }, scene);
plane.material = material;
```

The element is hosted inside a hidden `<canvas content="drawable">` that Babylon adds to the document for you, so the browser can lay it out and paint it. You do not need to attach the element to the DOM yourself.

### Creation options

The third constructor argument is an `IHtmlTextureOptions` object:

| Option            | Default                            | Description                                                                                                                                       |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scene`           | —                                  | The scene the texture belongs to. Provide either `scene` or `engine`.                                                                             |
| `engine`          | —                                  | The engine to use, when no scene is available.                                                                                                    |
| `width`           | element `offsetWidth`, then `256`  | Texture width in pixels.                                                                                                                          |
| `height`          | element `offsetHeight`, then `256` | Texture height in pixels.                                                                                                                         |
| `generateMipMaps` | `false`                            | Whether mip maps are generated.                                                                                                                   |
| `samplingMode`    | `TEXTURE_BILINEAR_SAMPLINGMODE`    | The texture sampling mode.                                                                                                                        |
| `format`          | `TEXTUREFORMAT_RGBA`               | The texture format.                                                                                                                               |
| `autoUpdate`      | `true`                             | When `true`, the texture refreshes whenever the host canvas reports a paint change.                                                               |
| `useSvgFallback`  | `true`                             | When `true`, render through the built-in SVG fallback if the native (or polyfilled) API is unavailable. Set to `false` to require the native API. |

## Updating the texture

When `autoUpdate` is enabled (the default), the texture refreshes automatically whenever the hosted element repaints. You can also drive updates manually:

```javascript
// Force an immediate re-render from the current DOM state.
htmlTexture.update();

// Ask the host canvas to repaint on the next frame (falls back to update() when unsupported).
htmlTexture.requestUpdate();
```

The `onLoadObservable` fires once, the first time the texture has rendered successfully:

```javascript
htmlTexture.onLoadObservable.addOnce(() => {
  console.log("HTML texture is ready");
});
```

Call `htmlTexture.dispose()` when you are done; it removes the hidden host canvas and releases the GPU texture.

## The built-in SVG fallback

When the native WICG API (or its polyfill) is unavailable, `HtmlTexture` falls back to rasterizing the element through an SVG [`<foreignObject>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject). The element is serialized, wrapped in an SVG image, and uploaded to the texture as a [Dynamic Texture](/features/featuresDeepDive/materials/using/dynamicTexture). This works in any modern browser with no flags or extra dependencies, so it is the default behavior.

The fallback is convenient but less capable than the native path. Keep these caveats in mind:

- **Inline styles only.** External stylesheets and `<link>`-ed CSS are not applied; style the element (or its children) inline, or inject a `<style>` element into the serialized subtree.
- **Same-origin resources.** Cross-origin images, fonts, and other external resources taint the snapshot and cause the fallback to fail; the texture logs a one-time warning when this happens.
- **Static snapshot.** The fallback captures the DOM as it is at update time. Interactive states that the browser computes during real rendering — `:hover`, focus rings, native form-control state, running scripts — are not reflected.
- **Heavier than the native copy.** Each update serializes the DOM and decodes an image, so prefer driving updates explicitly (rather than per-frame) for complex content.

To require the native API and skip the fallback entirely, pass `useSvgFallback: false`. The texture then logs a one-time warning and renders nothing when the native API is missing.

```javascript
// Only render when the native WICG API (or polyfill) is available.
const htmlTexture = new BABYLON.HtmlTexture("html", el, { scene, useSvgFallback: false });
```

## Interaction

`HtmlTexture` is one-way by default: it produces a live image of the DOM, but pointer picks on the mesh do not reach the element. Two optional managers (both in `@babylonjs/core`) bridge Babylon pointer events to the DOM so the rendered HTML stays interactive. They are tree-shaken out unless you import them.

### Raycast interaction (any mesh)

`HtmlRaycastInteractionManager` works for **arbitrary meshes** — planes, boxes, and curved surfaces — because it maps the picked UV coordinate back to a pixel inside the element and dispatches a synthetic DOM pointer event there.

```javascript
// Register your DOM listeners as usual.
el.querySelector("button").addEventListener("click", () => console.log("clicked in 3D"));

new BABYLON.HtmlRaycastInteractionManager(scene, htmlTexture, plane);
```

| Option            | Default           | Description                                                                       |
| ----------------- | ----------------- | --------------------------------------------------------------------------------- |
| `targetElement`   | texture's element | The element that receives forwarded events.                                       |
| `backFaceCulling` | `true`            | Ignore hits on back-facing geometry.                                              |
| `invertY`         | `true`            | Whether the texture content is stored Y-inverted, used when mapping UV to pixels. |

> Because it relies on scene picking, `HtmlRaycastInteractionManager` requires the `Ray` side-effect import when you consume `@babylonjs/core` as ES modules. Add it once, anywhere in your app:
>
> ```javascript
> import "@babylonjs/core/Culling/ray";
> ```
>
> The UMD bundle and the Playground include this automatically. `HtmlInteractionManager` (below) does not need it.

### Overlay interaction (planar meshes)

`HtmlInteractionManager` positions the **real DOM element** as a screen-aligned overlay over the projected face of a planar mesh, so the browser hit-tests it natively. This preserves full native fidelity — focus, text selection, and form input — at the cost of being limited to flat, camera-facing surfaces (it applies position, size, and in-plane rotation, not a full perspective skew).

```javascript
new BABYLON.HtmlInteractionManager(scene, htmlTexture, plane);
```

| Option                | Default           | Description                                                         |
| --------------------- | ----------------- | ------------------------------------------------------------------- |
| `targetElement`       | texture's element | The element to overlay.                                             |
| `enablePointerEvents` | `true`            | Whether the overlay captures pointer events for native hit-testing. |

Both managers expose a `dispose()` method that detaches their observers.

> Choose `HtmlRaycastInteractionManager` when the surface is curved or non-planar, or when you want Babylon to remain in control of the pointer pipeline. Choose `HtmlInteractionManager` when you need true native DOM input (keyboard, IME, text selection) on a flat panel.

## Enabling the polyfill

Install an up-to-date polyfill such as [`@underglass/html-in-canvas-polyfill`](https://www.npmjs.com/package/@underglass/html-in-canvas-polyfill):

```bash
npm install @underglass/html-in-canvas-polyfill
```

Import its auto-installing entry before creating the engine:

```javascript
import "@underglass/html-in-canvas-polyfill/auto";
```

Installation is a no-op when the browser supports the API natively. `HtmlTexture`, `HtmlInteractionManager`, and `HtmlRaycastInteractionManager` detect the directly imported polyfill like native support, so no Babylon helper is needed.

For explicit lifecycle control, import `install` and `uninstall` from `@underglass/html-in-canvas-polyfill` instead. Call `install()` before creating the engine, and `uninstall()` after disposing the textures, interaction managers, and engine that use it.

> `InstallHtmlInCanvasPolyfill` and `UninstallHtmlInCanvasPolyfill` still work but are deprecated. The installer loads `three-html-render`, which implements an older version of the proposal and forces `HtmlTexture` onto legacy APIs. Its full-canvas overlay also blocks pointer input, breaking `HtmlRaycastInteractionManager`. Do not pass an up-to-date polyfill through `InstallHtmlInCanvasPolyfill`: that forces the legacy WebGL path, which the current polyfill does not support. Import it directly instead. See [BabylonJS/Babylon.js#19132](https://github.com/BabylonJS/Babylon.js/pull/19132).

### In the Playground or a UMD app

The package's `/iife` entry is the browser build at `dist/html-in-canvas-polyfill.iife.js`. It installs automatically on load and is a no-op with native support; no call to `HTMLInCanvasPolyfill.install()` is needed.

Load it before creating the engine. In the Playground, await it at the top level of the entry module, before defining `createScene` or `Playground.CreateScene`. In a UMD app, await it before calling `new BABYLON.Engine(...)` or initializing a `BABYLON.WebGPUEngine`:

```javascript
await BABYLON.Tools.LoadScriptAsync("https://cdn.jsdelivr.net/npm/@underglass/html-in-canvas-polyfill@0.5.0/dist/html-in-canvas-polyfill.iife.js");
```

## Putting it together

```javascript
import "@underglass/html-in-canvas-polyfill/auto";

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 4, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(true);
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  const el = document.createElement("div");
  el.style.cssText = "width:512px;height:512px;background:#1e293b;color:#fff;font:24px sans-serif;padding:24px;box-sizing:border-box";
  el.innerHTML = "<h1>Hello DOM</h1><button>Click me</button>";
  el.querySelector("button").addEventListener("click", (e) => (e.target.textContent = "Clicked!"));

  const htmlTexture = new BABYLON.HtmlTexture("html", el, { scene, autoUpdate: true });

  const material = new BABYLON.StandardMaterial("mat", scene);
  material.emissiveTexture = htmlTexture;
  material.disableLighting = true;

  const plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 2 }, scene);
  plane.material = material;

  // Forward pointer picks to the DOM so the button is clickable in 3D.
  new BABYLON.HtmlRaycastInteractionManager(scene, htmlTexture, plane);

  return scene;
};
```

## Notes and limitations

- The API is experimental; behavior and availability may change as the WICG specification evolves.
- Cross-origin content (for example, third-party `<iframe>`s) cannot be rasterized, mirroring the browser's tainted-canvas rules.
- The built-in SVG fallback only captures same-origin, inline-styled content as a static snapshot; see [The built-in SVG fallback](#the-built-in-svg-fallback) for details, or set `useSvgFallback: false` to require the native API.
- The overlay `HtmlInteractionManager` is screen-aligned and does not perspective-correct steeply oblique faces; use the raycast manager for those.
- Synthetic pointer forwarding (`HtmlRaycastInteractionManager`) delivers pointer events, but not native keyboard or IME input into rasterized form fields; use the overlay manager when real text input is required.
