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

## Browser support

The underlying API is experimental and not yet broadly shipped. You can run `HtmlTexture` in two ways:

- **Natively**, in a browser that exposes the API (for example, Chrome Canary with `chrome://flags/#canvas-draw-element` enabled).
- **Via a polyfill**, using [`three-html-render`](https://github.com/repalash/three-html-render), installed through the helper in `@babylonjs/addons` (see [Enabling the polyfill](#enabling-the-polyfill) below).

When neither is available, `HtmlTexture` logs a one-time warning and renders nothing — it never throws — so it is safe to include in code that also runs on unsupported browsers.

Both **WebGL2** and **WebGPU** engines are supported; the correct upload path is selected automatically.

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

The element is hosted inside a hidden `<canvas layoutsubtree>` that Babylon adds to the document for you, so the browser can lay it out and paint it. You do not need to attach the element to the DOM yourself.

### Creation options

The third constructor argument is an `IHtmlTextureOptions` object:

| Option            | Default                            | Description                                                                         |
| ----------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| `scene`           | —                                  | The scene the texture belongs to. Provide either `scene` or `engine`.               |
| `engine`          | —                                  | The engine to use, when no scene is available.                                      |
| `width`           | element `offsetWidth`, then `256`  | Texture width in pixels.                                                            |
| `height`          | element `offsetHeight`, then `256` | Texture height in pixels.                                                           |
| `generateMipMaps` | `false`                            | Whether mip maps are generated.                                                     |
| `samplingMode`    | `TEXTURE_BILINEAR_SAMPLINGMODE`    | The texture sampling mode.                                                          |
| `format`          | `TEXTUREFORMAT_RGBA`               | The texture format.                                                                 |
| `autoUpdate`      | `true`                             | When `true`, the texture refreshes whenever the host canvas reports a paint change. |

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

When the native API is not present, install the polyfill helper from `@babylonjs/addons`. It lazily imports `three-html-render` only when needed, so it never adds to your bundle unless it is actually used.

```javascript
import { InstallHtmlInCanvasPolyfill } from "@babylonjs/addons/htmlInCanvas";

// No-op when the API is supported natively; installs the polyfill otherwise.
await InstallHtmlInCanvasPolyfill();
```

Helpers available in `@babylonjs/addons`:

- `IsHtmlInCanvasSupportedNatively()` — returns `true` when the browser exposes the API natively.
- `InstallHtmlInCanvasPolyfill(options?)` — installs the polyfill and resolves to `true` when it was installed. By default it is a no-op when native support is present; pass `{ force: true }` to install regardless. Appending `?polyfillHIC` to the page URL also forces installation.
- `UninstallHtmlInCanvasPolyfill()` — removes a previously installed polyfill.

## Putting it together

```javascript
import { InstallHtmlInCanvasPolyfill } from "@babylonjs/addons/htmlInCanvas";

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 4, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(true);
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Use the native API when present, fall back to the polyfill otherwise.
  await InstallHtmlInCanvasPolyfill();

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
- The overlay `HtmlInteractionManager` is screen-aligned and does not perspective-correct steeply oblique faces; use the raycast manager for those.
- Synthetic pointer forwarding (`HtmlRaycastInteractionManager`) delivers pointer events, but not native keyboard or IME input into rasterized form fields; use the overlay manager when real text input is required.
