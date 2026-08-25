---
title: WebXR Layers
image:
description: Create and manage projection, quad, cylinder, equirectangular, cube, and media layers in Babylon.js WebXR experiences.
keywords: babylon.js, diving deeper, WebXR, VR, AR, layers, composition layers, media layers, fullscreen, antialias
further-reading:
video-overview:
video-content:
---

# WebXR Layers

WebXR Layers lets the XR compositor present content separately from the application's projection layer. A composition layer can produce sharper text and video, avoid an extra projection-rendering pass for media, and place content on a quad, cylinder, equirectangular surface, or cube around the viewer.

The feature depends on the browser and XR runtime implementing the relevant parts of the [WebXR Layers specification](https://www.w3.org/TR/webxrlayers-1/). Support is runtime-dependent, so applications must check capabilities and handle a `null` result when creating an optional layer.

## Supported layer types

Babylon.js supports the projection layer used to render the XR scene and the following additional layer types:

| Shape           | Graphics factory        | Media factory                | Typical use                                      |
| --------------- | ----------------------- | ---------------------------- | ------------------------------------------------ |
| Quad            | `createQuadLayer()`     | `createMediaQuadLayer()`     | Flat panels, video screens, and HUD-like content |
| Cylinder        | `createCylinderLayer()` | `createMediaCylinderLayer()` | Curved interfaces and panoramic video            |
| Equirectangular | `createEquirectLayer()` | `createMediaEquirectLayer()` | Partial or full 360-degree content               |
| Cube            | `createCubeLayer()`     | Not available                | Cubemap content surrounding the viewer           |

Graphics layers use `XRWebGLBinding` with a WebGL engine or `XRGPUBinding` with a WebGPU engine. Media layers use `XRMediaBinding` and receive video content directly from an `HTMLVideoElement`.

New layers are automatically appended to the session's layer list after the projection layer, in creation order.

## Enable WebXR Layers

Enable the feature before entering XR. It creates the session's initial projection layer when the feature attaches:

```javascript
const xr = await scene.createDefaultXRExperienceAsync();
const featuresManager = xr.baseExperience.featuresManager;

const layers = featuresManager.enableFeature(BABYLON.WebXRFeatureName.LAYERS, "stable");

await xr.baseExperience.enterXRAsync("immersive-vr", "local-floor");
```

When using ES modules with tree shaking, import the feature so that it is registered:

```javascript
import "@babylonjs/core/XR/features/WebXRLayers.js";
```

Additional composition and media layers can only be created during an active XR session. Calling a creation factory before the session starts throws an error. The projection layer must also be initialized first; enabling the feature before `enterXRAsync` handles this automatically.

## Check runtime support

Use `isLayerTypeSupported()` to check whether the active rendering backend exposes a graphics or media factory:

```javascript
const supportsGraphicsCylinder = layers.isLayerTypeSupported("XRCylinderLayer");
const supportsMediaCylinder = layers.isLayerTypeSupported("XRCylinderLayer", "media");
```

The supported type names are:

- `"XRProjectionLayer"`
- `"XRQuadLayer"`
- `"XRCylinderLayer"`
- `"XREquirectLayer"`
- `"XRCubeLayer"`

The optional source is `"graphics"` by default and can be set to `"media"`. Projection and cube layers do not have media variants.

`isLayerTypeSupported()` only checks whether the corresponding native factory exists. It does not validate creation options, guarantee that the active device can create the layer, or check `XRGPUBinding.getSubImage` on WebGPU. Always handle a `null` result, and allow exceptions from invalid native initialization dictionaries to surface.

## Create a media layer

Media layers are the most direct way to present video through the XR compositor. The application owns the video element and remains responsible for loading, playing, pausing, and disposing it:

```javascript
const video = document.createElement("video");
video.src = "/videos/demo.mp4";
video.loop = true;
video.muted = true;
video.playsInline = true;

// Start playback from a user gesture when required by the browser.
await video.play();

const screenNode = new BABYLON.TransformNode("media screen", scene);
screenNode.position.set(0, 1.5, 2);

const mediaLayer = layers.createMediaQuadLayer(video, {
  transformNode: screenNode,
  layerInit: {
    width: 2,
    height: 1.125,
  },
});

if (!mediaLayer) {
  console.warn("Native WebXR media quad layers are unavailable.");
}
```

`createMediaQuadLayer()`, `createMediaCylinderLayer()`, and `createMediaEquirectLayer()` pass the video directly to `XRMediaBinding`. Babylon does not create a render target for a native media layer and does not call `video.play()`.

Common media initialization values include `space`, `layout`, and `invertStereo`, plus the shape-specific values listed below.

<Playground id="#D35HOL#0" title="WebXR media quad layer" description="Compare a Babylon VideoTexture plane with a native WebXR media quad layer." image=""/>

## Create graphics-backed layers

The graphics factories create and manage compositor-owned layers for advanced workflows:

<Alert severity="warning" title="Advanced layer-management API">
Babylon internally wraps graphics-layer subimages as render targets, but a stable generic public API for scheduling arbitrary Babylon rendering into those targets is not yet defined. Do not rely on internal render-target provider classes or observables. Use a specialized path such as `addFullscreenAdvancedDynamicTexture()`, the media factories, or the cube layer's raw subimage API when it fits the content.
</Alert>

```javascript
const panelNode = new BABYLON.TransformNode("curved panel", scene);
panelNode.position.set(0, 1.4, 2);

const cylinderLayer = layers.createCylinderLayer({
  transformNode: panelNode,
  layerInit: {
    radius: 3,
    centralAngle: Math.PI,
    aspectRatio: 2,
    viewPixelWidth: 2048,
    viewPixelHeight: 1024,
    layout: "mono",
  },
});

if (!cylinderLayer) {
  console.warn("Native WebXR cylinder layers are unavailable.");
}
```

The example creates, configures, and places the native layer; it does not populate the layer's graphics content. The factories currently provide native layer initialization, placement, ordering, removal, disposal, capability detection, and fallback management.

For a ready-made Babylon content path, `addFullscreenAdvancedDynamicTexture()` renders an existing fullscreen ADT through a quad layer. Cube layers are deliberately low-level and expose `getSubImage(frame, eye?)` so the application can populate all six cubemap faces.

Graphics initialization uses `layerInit` for WebGL-compatible values and `gpuLayerInit` for WebGPU-specific overrides:

```javascript
const quadLayer = layers.createQuadLayer({
  layerInit: {
    width: 1.6,
    height: 0.9,
    layout: "mono",
    isStatic: true,
  },
  gpuLayerInit: {
    colorFormat: "rgba8unorm",
  },
});
```

On WebGPU, Babylon copies the shared values from `layerInit` and then applies `gpuLayerInit`, so WebGPU-specific values take precedence. WebGL-only fields are not copied.

When omitted, Babylon supplies:

- The current XR reference space.
- The projection layer's pixel dimensions.
- `layout: "mono"`.
- WebGL `textureType: "texture"` and `clearOnAccess: true`.
- Square cube faces using the smaller projection-layer dimension.

Cube `viewPixelWidth` and `viewPixelHeight` values must be equal. When `isStatic` is enabled, Babylon only acquires compositor subimages while the native layer's `needsRedraw` flag is set.

## Layer initialization values

Each shape accepts its matching WebXR initialization dictionary:

| Layer           | Shape-specific values                                                                       |
| --------------- | ------------------------------------------------------------------------------------------- |
| Quad            | `transform`, `width`, `height`                                                              |
| Cylinder        | `transform`, `radius`, `centralAngle`, `aspectRatio`                                        |
| Equirectangular | `transform`, `radius`, `centralHorizontalAngle`, `upperVerticalAngle`, `lowerVerticalAngle` |
| Cube            | `orientation`; square `viewPixelWidth` and `viewPixelHeight`                                |

Graphics dictionaries also support values such as pixel dimensions, `space`, `layout`, `isStatic`, texture formats, and mip levels. Media dictionaries support `space`, `layout`, and `invertStereo`.

Use values from the WebXR Layers specification. Invalid values are passed to the native factory and can cause it to throw; an invalid dictionary does not activate the mesh fallback.

## Position and rotate layers

Pass a `TransformNode` to position a layer with Babylon scene coordinates:

```javascript
const layerNode = new BABYLON.TransformNode("layer transform", scene);
layerNode.position.set(0, 1.6, 1.5);
layerNode.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, 0, 0);

const layer = layers.createMediaQuadLayer(video, {
  transformNode: layerNode,
  layerInit: { width: 1.8, height: 1 },
});
```

Babylon synchronizes the node's world position and rotation to the native layer every XR frame. It converts position using the session's `worldScalingFactor` and handles left-handed scene conversion. Node scaling does not change the physical dimensions of a native layer; use the layer initialization values to size it.

Cube layers synchronize rotation only because the WebXR Layers API does not support cube-layer translation.

When no `transformNode` is supplied, Babylon creates one from `layerInit.transform` or the cube orientation. Babylon owns and disposes that generated node. A node supplied by the application remains application-owned.

If `space` is omitted, the layer uses the session reference space and follows reference-space changes such as recentering. When the application supplies an explicit `space`, Babylon leaves it unchanged.

## Handle creation results

A successful factory returns a wrapper around either a native composition layer or an optional mesh fallback:

- Native spatial wrappers expose `layer`, `layerType`, `transformNode`, and `usesSessionReferenceSpace`.
- Native media wrappers additionally expose `isMediaLayer`.
- Native cube wrappers expose `getSubImage(frame, eye?)`.
- Mesh fallback wrappers have `layer === null`, `isNative === false`, and expose `mesh`, `texture`, and `transformNode`.

Factories return `null` when the required runtime API is unavailable and no requested fallback can be created.

For native cube layers, WebGL applications must populate all six cubemap faces. WebGPU applications must populate six consecutive texture-array layers beginning at the returned subimage's base array layer.

## Opt in to mesh fallbacks

A composition-layer fallback is an ordinary Babylon mesh rendered through the projection layer. It does not provide the quality or performance characteristics of a native compositor layer, but it can preserve visible content on runtimes that do not expose the requested factory.

Fallback rendering is excluded from projection-only, tree-shaken bundles. Import it explicitly:

```javascript
import "@babylonjs/core/XR/features/WebXRLayersFallback.js";
```

Pure registrations can opt in without the side-effect entry point:

```javascript
import { RegisterWebXRLayersFallback } from "@babylonjs/core/XR/features/WebXRLayersFallback.pure.js";

RegisterWebXRLayersFallback();
```

Request the fallback with `fallbackMode: "mesh"`:

```javascript
const result = layers.createCylinderLayer({
  fallbackMode: "mesh",
  fallbackTexture: panelTexture,
  transformNode: panelNode,
  layerInit: {
    radius: 2,
    centralAngle: Math.PI,
    aspectRatio: 2,
  },
});

if (result?.layer === null) {
  console.log("Using a projection-rendered mesh fallback.");
}
```

Graphics fallbacks require `fallbackTexture`. Cube fallbacks require a cube texture. Media fallbacks create an owned `VideoTexture` from the supplied video element, but playback remains application-owned. Caller-provided textures and transform nodes are not disposed by the wrapper.

Fallback geometry uses the requested shape dimensions. Omitted values default to:

| Shape           | Fallback defaults                                         |
| --------------- | --------------------------------------------------------- |
| Quad            | Width `1`, height `1`                                     |
| Cylinder        | Radius `2`, central angle `Math.PI / 4`, aspect ratio `2` |
| Equirectangular | Radius `1000`, full horizontal and vertical sphere        |
| Cube            | Inward-facing box with size `1000`                        |

Fallback dimensions are converted using `worldScalingFactor`. Cube fallbacks remain centered on the viewer and use the transform node's rotation only.

## Remove and dispose layers

Use `removeLayer()` with any result returned by a spatial or media factory:

```javascript
if (mediaLayer) {
  layers.removeLayer(mediaLayer);
}
```

It removes native layers from `XRRenderState.layers`, removes fallback meshes from Babylon's fallback list, and disposes wrapper-owned resources by default. Pass `false` to retain the wrapper and take responsibility for its cleanup:

```javascript
if (mediaLayer) {
  layers.removeLayer(mediaLayer, false);
  mediaLayer.dispose();
}
```

`removeXRSessionLayer()` is the lower-level equivalent for native session-layer wrappers. The active projection layer cannot be removed. Removing a wrapper that is not currently managed returns `false`.

Detaching or disposing the WebXR Layers feature disposes all wrappers and resources it owns. It does not dispose application-owned video elements, textures, or transform nodes.

## Backend and fallback support

| Source or backend      | Quad | Cylinder | Equirectangular | Cube |
| ---------------------- | ---- | -------- | --------------- | ---- |
| WebGL `XRWebGLBinding` | Yes  | Yes      | Yes             | Yes  |
| WebGPU `XRGPUBinding`  | Yes  | Yes      | Yes             | Yes  |
| `XRMediaBinding`       | Yes  | Yes      | Yes             | No   |
| Opt-in mesh fallback   | Yes  | Yes      | Yes             | Yes  |
| Babylon Native XR      | No   | No       | No              | No   |

Every "Yes" remains conditional on the active browser and XR runtime. WebGPU graphics layers require both the corresponding creation factory and `XRGPUBinding.getSubImage`. Babylon Native XR continues to use its native render target path and does not expose WebXR Layers.

### WebGPU-XR

WebXR Layers is optional for WebGL-backed XR but required for WebGPU-XR. Enable the feature before calling `enterXRAsync`; it creates the `XRGPUBinding` projection layer used to render the session.

<Alert severity="warning" title="Experimental WebGPU-XR support">
WebGPU-XR currently requires projection layers and does not support multiview. The WebGPU engine must be created with `{ xrCompatible: true }`. See [WebGPU in WebXR](/features/featuresDeepDive/webXR/webGPUXR) for complete setup and fallback guidance.
</Alert>

The graphics factories require the matching `XRGPUBinding.create*Layer` method and `XRGPUBinding.getSubImage`. Babylon logs a warning and returns `null` when either requirement is unavailable, unless an enabled mesh fallback is requested and can be created.

## Enable multiview

WebXR Layers can enable multiview rendering of the projection layer. Multiview renders both eyes with one render call instead of rendering two cameras separately and can improve scene rendering performance on supported runtimes.

To prefer multiview:

```javascript
featuresManager.enableFeature(BABYLON.WebXRFeatureName.LAYERS, "stable", {
  preferMultiviewOnInit: true,
});
```

If the browser supports multiview, Babylon enables it. Otherwise, the feature silently uses non-multiview rendering. On supported WebGL extensions, enabling multiview can also enable antialiasing in XR.

Multiview is not currently supported on the WebGPU-XR path. Setting `preferMultiviewOnInit` with a WebGPU engine still uses non-multiview rendering.

## Fullscreen 2D GUI support

`addFullscreenAdvancedDynamicTexture()` displays an Advanced Dynamic Texture through a quad layer. This allows the same GUI to appear in a desktop application and in XR:

```javascript
const guiLayer = layers.addFullscreenAdvancedDynamicTexture(advancedTexture, {
  distanceFromHeadset: 1.5,
});
```

The GUI behaves like a HUD and cannot be interacted with through this layer. The method is experimental and can return `null` when the runtime does not support the required quad-layer path.

<Playground id="#JA1ND3#941" title="WebXR 2D GUI example" description="WebXR fullscreen 2D GUI support with multiview." image=""/>
