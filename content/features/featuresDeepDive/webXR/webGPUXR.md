---
title: WebGPU in WebXR
image:
description: Learn how to create an experimental WebGPU-backed WebXR experience in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, WebGPU, VR, AR, XRGPUBinding
further-reading:
  - title: Introduction To WebXR
    url: /features/featuresDeepDive/webXR/introToWebXR
  - title: WebXR Layers
    url: /features/featuresDeepDive/webXR/WebXRSelectedFeatures/WebXRLayers
  - title: WebXR Session Manager
    url: /features/featuresDeepDive/webXR/webXRSessionManagers
video-overview:
video-content:
---

# WebGPU in WebXR

Babylon.js can render immersive WebXR sessions with a WebGPU engine through the browser's experimental `XRGPUBinding` implementation.

<Alert severity="warning" title="Experimental WebGPU-XR support">
WebGPU-XR browser and device support is experimental and may change. Test on every target browser and headset, and keep a WebGL entry path available when WebGPU-XR is not supported.
</Alert>

## Check the three levels of support

WebGPU, immersive WebXR, and WebGPU-XR are separate capabilities:

- `WebGPUEngine.IsSupportedAsync` checks whether Babylon can create a WebGPU engine.
- `WebXRSessionManager.IsSessionSupportedAsync("immersive-vr")` checks whether the browser reports support for that immersive WebXR session mode.
- `WebXRSessionManager.IsWebGPUXRSupported` checks whether the runtime exposes the `XRGPUBinding` projection-layer methods and the `XRGPUSubImage.getViewDescriptor` method required by Babylon.

`IsWebGPUXRSupported` is an experimental, static boolean getter. It requires the `XRGPUSubImage` interface and `XRGPUSubImage.prototype.getViewDescriptor` because Babylon uses that method to create texture views for each projection sub-image. This remains an advisory API-shape check, not a guarantee that the active device, GPU adapter, permissions, and session will work together. The actual session request can still reject.

## Select the engine before creating the scene

A WebGPU engine intended for XR must request an XR-compatible adapter when it is created:

```javascript
const engine = new BABYLON.WebGPUEngine(canvas, { xrCompatible: true });
await engine.initAsync();
```

WebGPU has no equivalent to making an existing context XR-compatible later. If your application supports WebGL fallback, select the rendering backend before creating the scene or any GPU resources:

```javascript
async function createEngineForImmersiveXR(canvas) {
  const webGPUSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
  const immersiveXRSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync("immersive-vr");
  // Includes XRGPUBinding projection APIs and XRGPUSubImage.getViewDescriptor.
  const webGPUXRSupported = BABYLON.WebXRSessionManager.IsWebGPUXRSupported;

  if (webGPUSupported && immersiveXRSupported && webGPUXRSupported) {
    const engine = new BABYLON.WebGPUEngine(canvas, { xrCompatible: true });
    await engine.initAsync();
    return engine;
  }

  return new BABYLON.Engine(canvas, true);
}

const engine = await createEngineForImmersiveXR(canvas);
const scene = new BABYLON.Scene(engine);
// Create the rest of the scene and its resources only after selecting the engine.
```

Babylon.js never swaps an existing WebGPU engine or scene to WebGL. If WebGPU session negotiation later fails, falling back requires reloading or fully rebuilding the engine, scene, and all GPU resources with a WebGL engine.

## Enable WebXR Layers before entering XR

WebGPU-XR uses an `XRProjectionLayer`, so the [WebXR Layers feature](/features/featuresDeepDive/webXR/WebXRSelectedFeatures/WebXRLayers) is required. Enable it before calling `enterXRAsync`:

```javascript
const xr = await scene.createDefaultXRExperienceAsync();

const featuresManager = xr.baseExperience.featuresManager;
featuresManager.enableFeature(BABYLON.WebXRFeatureName.LAYERS, "stable");

try {
  await xr.baseExperience.enterXRAsync("immersive-vr", "local-floor");
} catch (error) {
  // Show the error and offer to reload or rebuild the application with WebGL.
  console.error("Could not start the XR session:", error);
}
```

When using ES modules with tree shaking, import the Layers feature so it is registered:

```javascript
import "@babylonjs/core/XR/features/WebXRLayers.js";
```

Babylon rejects WebGPU XR entry with actionable guidance when the required `XRGPUBinding` projection path or `XRGPUSubImage.getViewDescriptor` support is missing, or when Layers was not enabled. If the browser rejects the WebGPU session request with `NotSupportedError`, Babylon preserves the original error as the cause and reports that the application must recreate the scene with WebGL to fall back.

## Current feature caveats

- **Projection layers and sub-image view descriptors are required.** The runtime must expose `XRGPUSubImage.prototype.getViewDescriptor`; the WebGL `XRWebGLLayer` rendering path is not available to a WebGPU engine.
- **Multiview is not available with WebGPU-XR yet.** `preferMultiviewOnInit` does not enable it on this path.
- **Raw Camera Access is unavailable.** The browser exposes camera images through `XRWebGLBinding`, not `XRGPUBinding`.
- **Space Warp is unavailable.** Its current implementation depends on WebGL-specific binding functionality.
- **Quad layers are method-gated.** They are available only when the runtime's `XRGPUBinding` implements both `createQuadLayer` and `getSubImage`. Babylon warns and returns `null` when either method is missing.
- **Depth Sensing requires CPU-optimized depth.** Request CPU usage with `usagePreference: ["cpu"]`; GPU-optimized environment depth has no `XRGPUBinding` equivalent.

These limitations are specific to the experimental WebGPU-XR path. A feature may still be available in a WebGL-backed WebXR session.
