---
title: WebXR Augmented Reality Features
image:
description: Learn about WebXR augmented reality features in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR, AR features
further-reading:
  - title: Blog article about light estimation
    url: https://babylonjs.medium.com/light-estimation-in-babylon-js-285cab428dbb
video-overview:
video-content:
---

## A bit about augmented reality

The idea behind augmented reality is simple - show the real world, but add information on top of it. This is different from virtual reality, where you are fully immersed in a different scene and have no actual contact with the real world.

## Getting started with Augmented Reality

### WebXR and AR

Augmented reality in Babylon.js relies heavily on WebXR. It's recommended that you start with the [getting started with WebXR](/features/featuresDeepDive/webXR/introToWebXR) guide. Most of the information that is valid for immersive VR sessions is also valid for immersive AR sessions. The main differences between the two are explained here.

### Supported devices

Many devices support immersive AR sessions using WebXR. Most Android devices support it in a Chromium-based browser, HoloLens 2 supports it in its native browser, and Quest devices that support passthrough mode can run an AR session as well. New devices are constantly added to this list. The best way to check is to use the static `IsSessionSupported` function, available on the WebXR session manager.

Mobile phones using Android support immersive AR sessions on Chrome (Stable/Canary). Note that you will need to install [AR Core](https://play.google.com/store/apps/details?id=com.google.ar.core), otherwise it will be a very short experience.

HoloLens 2 supports WebXR and immersive AR/VR sessions when using the native Edge browser.

The new WebXR emulator supports AR sessions as well, if you want to test your experience on a local browser before trying it on a supporting device.

### Simple scene in immersive AR

The simplest immersive AR sample is a port of an immersive VR scene:

```javascript
var createScene = async function () {
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);
  sphere.position.y = 2;
  sphere.position.z = 5;

  const xr = await scene.createDefaultXRExperienceAsync({
    // ask for an ar-session
    uiOptions: {
      sessionMode: "immersive-ar",
    },
  });

  return scene;
};
```

Playground for a simple immersive AR scene: <Playground id="#F41V6N#32" title="Simple Immersive AR Scene" description="Simple example of an immersive AR scene."/>

Notice that no environment was created. As opposed to immersive VR sessions, AR doesn't require a skybox or ground. If you want to define ground and remove it when entering AR (for example, if you are developing an experience for both desktop and AR), you can use the background remover feature described later on this page.

## Features

Some features require the Incubation flag in the latest Chrome Canary. Visit [chrome://flags](chrome://flags) and enable WebXR incubation.

You will then need to ask WebXR to enable this feature. This can be done using the `optionalFeatures` parameter in the default experience helper:

```javascript
const xr = await scene.createDefaultXRExperienceAsync({
  uiOptions: {
    sessionMode: "immersive-ar",
  },
  optionalFeatures: true,
});
```

This will enable all optional features that we support. You can also add individual features by using an array instead of a boolean value:

```javascript
const xr = await scene.createDefaultXRExperienceAsync({
  uiOptions: {
    sessionMode: "immersive-ar",
  },
  optionalFeatures: ["hit-test", "anchors"],
});
```

The strings in `optionalFeatures`, such as `"anchors"`, `"plane-detection"`, and `"mesh-detection"`, are native WebXR session feature descriptors. They are different from Babylon feature names such as `WebXRFeatureName.ANCHOR_SYSTEM`, `WebXRFeatureName.PLANE_DETECTION`, and `WebXRFeatureName.MESH_DETECTION`, which are used with Babylon's features manager.

### Hit Test

Hit Test is used to send a ray into the real world and receive information about intersections in space. You can read about it in the [Hit Test w3c draft](https://immersive-web.github.io/hit-test/). Think of it as a ray broadcast from your phone's screen toward the object you are looking for. If the device's AR capabilities allow it, it will tell you the position and orientation of the point relative to you.

To enable hit-testing, add this after initializing XR:

```javascript
// featuresManager from the base webxr experience helper
const hitTest = featuresManager.enableFeature(BABYLON.WebXRHitTest, "latest");
```

In TypeScript, you can also get the type set correctly:

```typescript
// featuresManager from the base webxr experience helper
const hitTest = featuresManager.enableFeature(BABYLON.WebXRHitTest, "latest") as BABYLON.WebXRHitTest;
```

This will enable the default behavior of hit-testing which is sending a single hit-test ray from the center of the display forward on each frame.

The options that you can pass are described in the following interface:

```typescript
export interface IWebXRHitTestOptions {
  /**
   * Do not create a permanent hit test. Will usually be used when only
   * transient inputs are needed.
   */
  disablePermanentHitTest?: boolean;
  /**
   * Enable transient (for example touch-based) hit test inspections
   */
  enableTransientHitTest?: boolean;
  /**
   * Offset ray for the permanent hit test
   */
  offsetRay?: Vector3;
  /**
   * Offset ray for the transient hit test
   */
  transientOffsetRay?: Vector3;
  /**
   * Instead of using viewer space for hit tests, use the reference space defined in the session manager
   */
  useReferenceSpace?: boolean;
}
```

`disablePermanentHitTest` will disable constant hit testing, while `enableTransientHitTest` will enable hit tests when touching the screen. The offsets define the offset from which the ray will be sent (relative to the center of the device's view).

After enabling the feature, you can register to get updates using the `onHitTestResultObservable`:

```javascript
// a dot to show in the found position
const dot = BABYLON.SphereBuilder.CreateSphere(
  "dot",
  {
    diameter: 0.05,
  },
  scene,
);
dot.isVisible = false;
hitTest.onHitTestResultObservable.add((results) => {
  if (results.length) {
    dot.isVisible = true;
    results[0].transformationMatrix.decompose(dot.scaling, dot.rotationQuaternion, dot.position);
  } else {
    dot.isVisible = false;
  }
});
```

This will show the dot only if hit-test worked, and will hide it if it didn't. The dot will be projected to the real world using the information provided by the system.

A simple example for WebXR hit-test using Babylon.js: <Playground id="#XWBES1" title="WebXR Hit-Test Using Babylon.js" description="Simple example of WebXR hit testing."/>. Open this with your AR device (probably your Android smartphone) and point the device at a textured plane (like your floor or door). The marker will be shown at the right location if/when the system scanned the plane correctly.

### Anchors

Anchors are tracked points in space that the system will constantly update as you continue scanning your environment. The points' transformation will be constantly updated by the underlying system. You can read more about Anchors at the [WebXR anchors module](https://immersive-web.github.io/anchors/) w3c proposal.

Enable the Anchors system using:

```javascript
// featuresManager from the base webxr experience helper
const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem.Name, "latest");
```

or for TypeScript:

```typescript
// featuresManager from the base webxr experience helper
const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem.Name, "latest");
```

Some options can be passed to the anchor system:

```typescript
export interface IWebXRAnchorSystemOptions {
  /**
   * a node that will be used to convert local to world coordinates
   */
  worldParentNode?: TransformNode;

  /**
   * If set to true a reference of the created anchors will be kept until the next session starts
   * If not defined, anchors will be removed from the array when the feature is detached or the session ended.
   */
  doNotRemoveAnchorsOnSessionEnded?: boolean;
}
```

Anchors are session-scoped by default and are removed when exiting the XR session (the anchors are removed, not the meshes attached to them). The `doNotRemoveAnchorsOnSessionEnded` option only keeps Babylon's references; it does not make the native anchors usable in a later session. Supporting runtimes can persist anchors by handle as described below.

If you want to prevent that from happening, use the `doNotRemoveAnchorsOnSessionEnded` option when initializing the anchor system:

```javascript
const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem.Name, "latest", { doNotRemoveAnchorsOnSessionEnded: true });
```

The Anchor system works perfectly with the Hit Test feature if you want to add an anchor at a hit-test position. To do that, use the `addAnchorPointUsingHitTestResultAsync` function:

```javascript
const arTestResult = getMeTheResultINeed();
const anchorPromise = anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
```

To add an anchor in any position and rotation in the scene, use the `addAnchorAtPositionAndRotationAsync` function:

```javascript
const { position, rotationQuaternion } = anyRandomMesh;
const anchorPromise = anchorSystem.addAnchorAtPositionAndRotationAsync(position, rotationQuaternion);
```

`anchorPromise` resolves with an `IWebXRAnchor`, which contains the native `XRAnchor` in its `xrAnchor` property. The same Babylon anchor is also delivered through the anchor module's observables:

```javascript
anchorSystem.onAnchorAddedObservable.add((anchor) => {
  // ... do what you want with the anchor after it was added
});

anchorSystem.onAnchorRemovedObservable.add((anchor) => {
  // ... do what you want with the anchor after it was removed
});

anchorSystem.onAnchorUpdatedObservable.add((anchor) => {
  // ... do what you want with the anchor after it was updated
});
```

The anchor is of type `IWebXRAnchor`:

```typescript
export interface IWebXRAnchor {
  /**
   * A babylon-assigned ID for this anchor
   */
  id: number;
  /**
   * Transformation matrix to apply to an object attached to this anchor
   */
  transformationMatrix: Matrix;
  /**
   * The native anchor object
   */
  xrAnchor: XRAnchor;

  /**
   * The persistent handle assigned by the XR runtime, when one was requested or restored
   */
  persistentHandle?: string;

  /**
   * if defined, this object will be constantly updated by the anchor's position and rotation
   */
  attachedNode?: TransformNode;
}
```

To attach an anchor to a node (for example, a mesh that you want to always stay in this location in the scene), use the `attachedNode` variable. This will also update the mesh's transformation when the anchor is updated:

```javascript
const mesh = anchorSystem.onAnchorAddedObservable.add((anchor) => {
  //...
  anchor.attachedNode = mesh;
});
```

The mesh will now be tracked by the system and will be located at the requested point.

You might ask why use the anchor system with hit-test results, since hit-test results are returned by the system with a position defined by the device. Setting the mesh at the hit-test location will work just fine. The difference is that the system might later update the information it has about this position—maybe it found out the plane has a different transformation, or maybe it updated its position in space. Using the anchor system keeps the transformation updated as the system updates its understanding of the space.

#### Persistent anchors (experimental)

A session-scoped anchor is valid only in the XR session that created it. A persistent anchor has an origin-scoped string handle that a supporting runtime can use to restore the anchor in a later session. The [WebXR Anchors Module](https://immersive-web.github.io/anchors/) marks persistence as experimental, and support is currently found primarily in Meta Quest Browser. Applications must not assume that handles are retained indefinitely: user agents can limit or evict stored anchors, and clearing site data can remove them.

`WebXRAnchorSystem` exposes the following persistence APIs:

| API                                                           | Purpose                                                                                                                                       |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `IWebXRAnchor.persistentHandle?: string`                      | Contains the handle after Babylon requests or restores it.                                                                                    |
| `isPersistentAnchorSupported: boolean`                        | Reports whether the current session exposes enumeration, restoration, and deletion. It does not test handle creation on an individual anchor. |
| `persistentAnchors: ReadonlyArray<string>`                    | Enumerates the origin's handles known to the current session. The getter throws if enumeration is unavailable.                                |
| `requestPersistentHandleAsync(anchor: IWebXRAnchor): Promise<string>` | Requests a handle for a live anchor and assigns it to `anchor.persistentHandle`.                                                              |
| `restorePersistentAnchorAsync(handle: string): Promise<IWebXRAnchor>` | Restores one handle.                                                                                                                          |
| `restorePersistentAnchorsAsync(): Promise<IWebXRAnchor[]>`           | Restores every handle currently returned by `persistentAnchors`.                                                                              |
| `deletePersistentAnchorAsync(handle: string): Promise<void>`         | Deletes the handle from native persistent storage.                                                                                            |

Each native operation is feature-detected independently. In particular, check `anchor.xrAnchor.requestPersistentHandle` before requesting a new handle; `isPersistentAnchorSupported` does not cover that per-anchor method. Babylon rejects unsupported requests, restores, and deletions. It also rejects restoration while the feature is detached or if tracking is interrupted. Native failures, including invalid-state errors, are passed through, so every operation should handle errors.

The following abbreviated lifecycle creates and persists an anchor in one session, then restores and deletes it in a later session. The anchor system must be attached to an active XR session before these functions run.

```typescript
const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem.Name, "latest");
const handleStorageKey = "saved-xr-anchor";
declare const contentToRestore: BABYLON.TransformNode; // Created during scene setup.

async function createPersistentAnchor(position: BABYLON.Vector3, rotation: BABYLON.Quaternion) {
  try {
    const anchor = await anchorSystem.addAnchorAtPositionAndRotationAsync(position, rotation);

    if (typeof anchor.xrAnchor.requestPersistentHandle !== "function") {
      throw new Error("This runtime cannot create persistent anchor handles.");
    }

    const handle = await anchorSystem.requestPersistentHandleAsync(anchor);
    localStorage.setItem(handleStorageKey, handle);
  } catch (error) {
    console.error("Unable to persist the anchor:", error);
  }
}

async function restoreSavedAnchor() {
  const handle = localStorage.getItem(handleStorageKey);
  if (!handle) {
    return;
  }

  try {
    const knownHandles = anchorSystem.persistentAnchors;
    if (!knownHandles.includes(handle)) {
      localStorage.removeItem(handleStorageKey);
      return;
    }

    const restoredAnchor = await anchorSystem.restorePersistentAnchorAsync(handle);
    restoredAnchor.attachedNode = contentToRestore;
  } catch (error) {
    console.error("Unable to restore the anchor:", error);
  }
}

async function deleteSavedAnchor() {
  const handle = localStorage.getItem(handleStorageKey);
  if (!handle) {
    return;
  }

  try {
    await anchorSystem.deletePersistentAnchorAsync(handle);
    localStorage.removeItem(handleStorageKey);
  } catch (error) {
    console.error("Unable to delete the persistent anchor:", error);
  }
}
```

Use `restorePersistentAnchorsAsync()` instead when every handle returned by the runtime should be restored. Restored anchors are added to `anchorSystem.anchors` and participate in `onAnchorAddedObservable`, `onAnchorUpdatedObservable`, and `onAnchorRemovedObservable` like newly created anchors. A restore promise resolves after the restored native anchor begins tracking and the added observable has run. Deleting persistence resolves when native storage deletion completes; removal from the live anchor collection and the removed observable occur on a following XR frame.

### Plane detection

Your device may be capable of detecting plane geometries in the real world. See the [WebXR Plane Detection Module](https://immersive-web.github.io/plane-detection/) for the native API.

Babylon has an experimental plane detection module that works with the underlying system. To enable it:

```javascript
// featuresManager from the base webxr experience helper
const planeDetector = featuresManager.enableFeature(BABYLON.WebXRPlaneDetector.Name, "latest");
```

Just like any other module, you can configure it using the options object, which has this type:

```typescript
export interface IWebXRPlaneDetectorOptions {
  /**
   * The node to use to transform the local results to world coordinates
   */
  worldParentNode?: TransformNode;

  /**
   * If set to true a reference of the created planes will be kept until the next session starts
   * If not defined, planes will be removed from the array when the feature is detached or the session ended.
   */
  doNotRemovePlanesOnSessionEnded?: boolean;
}
```

Similar to the anchor system, planes do not persist between sessions. If you want to keep the native `XRPlane` objects, set `doNotRemovePlanesOnSessionEnded` to true, and Babylon will not delete them.

The plane detector works automatically and offers three observables for you to use:

```javascript
planeDetector.onPlaneAddedObservable.add((plane) => {
  // ... do what you want with the plane after it was added
});

planeDetector.onPlaneRemovedObservable.add((plane) => {
  // ... do what you want with the plane after it was removed
});

planeDetector.onPlaneUpdatedObservable.add((plane) => {
  // ... do what you want with the plane after it was updated
});
```

The plane object is of type `IWebXRPlane`:

```typescript
export interface IWebXRPlane {
  /**
   * a babylon-assigned ID for this polygon
   */
  id: number;
  /**
   * an array of vector3 points in babylon space. right/left hand system is taken into account.
   */
  polygonDefinition: Array<Vector3>;
  /**
   * A transformation matrix to apply on the mesh that will be built using the polygonDefinition
   * Local vs. World are decided if worldParentNode was provided or not in the options when constructing the module
   */
  transformationMatrix: Matrix;
  /**
   * the native xr-plane object
   */
  xrPlane: XRPlane;
  /**
   * The semantic classification supplied by the XR runtime
   */
  semanticLabel?: string | null;
}
```

To create a Babylon polygon from the plane information do the following:

```javascript
const plane = // a reference to an added plane
  // add the starting point, so the polygon will close
  plane.polygonDefinition.push(plane.polygonDefinition[0]);
// create a polygon mesh builder for the polygons returned from the system
var polygon_triangulation = new BABYLON.PolygonMeshBuilder(
  "name",
  plane.polygonDefinition.map((p) => new BABYLON.Vector2(p.x, p.z)),
  scene,
);
// build the plane with specific thickness
var polygon = polygon_triangulation.build(false, 0.01);
```

A simple use case for planes is showing them in your scene using polygons. An example for that can be found at the WebXR Plane Detection demo: <Playground id="#98TM63" title="WebXR Plane Detection Demo" description="WebXR Plane Detection Demo" image="/img/playgroundsAndNMEs/vrglasses.webp"/>

#### Semantic labels for planes and meshes (experimental)

Supporting runtimes can classify real-world geometry with semantic labels. Babylon copies `XRPlane.semanticLabel` to `IWebXRPlane.semanticLabel` and `XRMesh.semanticLabel` to `IWebXRVertexData.semanticLabel`:

```typescript
interface IWebXRPlane {
  // Other plane data...
  semanticLabel?: string | null;
}

interface IWebXRVertexData {
  // Other mesh data...
  semanticLabel?: string | null;
}
```

The property is `undefined` when the runtime does not expose semantic labels and can be `null` or an empty string when no classification is known. Values come from the runtime. The [semantic labels registry](https://github.com/immersive-web/semantic-labels) defines common labels, but applications must not treat it as a closed TypeScript enumeration or assume that every detected object has a label.

Babylon reads the label when a plane or mesh is added and refreshes it through the detector's normal update path when the runtime reports that geometry as changed. Consume both the added and updated observables:

```typescript
const planeDetector = featuresManager.enableFeature(BABYLON.WebXRPlaneDetector.Name, "latest");

function consumePlaneLabel(plane: BABYLON.IWebXRPlane) {
  const supportsLabels = "semanticLabel" in plane.xrPlane;
  const label = plane.semanticLabel;

  if (supportsLabels && typeof label === "string" && label.length > 0) {
    console.log(`Plane ${plane.id}: ${label}`);
  } else {
    console.log(`Plane ${plane.id}: unclassified`);
  }
}

planeDetector.onPlaneAddedObservable.add(consumePlaneLabel);
planeDetector.onPlaneUpdatedObservable.add(consumePlaneLabel);
```

Mesh labels are available directly on the `IWebXRVertexData` delivered by the mesh detector; they are not added to a generated Babylon mesh's metadata.

```typescript
const meshDetector = featuresManager.enableFeature(BABYLON.WebXRMeshDetector.Name, "latest");

function consumeMeshLabel(vertexData: BABYLON.IWebXRVertexData) {
  const supportsLabels = "semanticLabel" in vertexData.xrMesh;
  const label = vertexData.semanticLabel;

  if (supportsLabels && typeof label === "string" && label.length > 0) {
    console.log(`Mesh ${vertexData.id}: ${label}`);
  } else {
    console.log(`Mesh ${vertexData.id}: unclassified`);
  }
}

meshDetector.onMeshAddedObservable.add(consumeMeshLabel);
meshDetector.onMeshUpdatedObservable.add(consumeMeshLabel);
```

Semantic labels and real-world mesh detection are not broadly supported across browsers. Negotiate the native `"plane-detection"` or `"mesh-detection"` session feature as appropriate, then feature-detect `semanticLabel` on the native `XRPlane` or `XRMesh` as shown above. See the [Plane Detection Module](https://immersive-web.github.io/plane-detection/#dom-xrplane-semanticlabel) and [Real-World Meshing Module](https://immersive-web.github.io/real-world-meshing/#dom-xrmesh-semanticlabel) for the native properties.

#### Room capture (experimental)

`WebXRPlaneDetector.initiateRoomCapture(): Promise<void>` asks a supporting runtime to capture or refresh the room layout used by plane detection. Room capture is part of the plane detector, not a separate Babylon WebXR feature, and requires an active XR session with native `XRSession.initiateRoomCapture()` support. Current support is limited and depends on the browser, device, enabled `"plane-detection"` session feature, and user permissions.

The promise follows the native operation and propagates its rejection. Babylon also rejects when there is no active session or the runtime does not expose the method. Feature-detect the native method when working directly with `XRSession`, or call the Babylon method inside error handling as shown here:

```typescript
const planeDetector = featuresManager.enableFeature(BABYLON.WebXRPlaneDetector.Name, "latest");
const detectedPlanes = new Map<number, BABYLON.IWebXRPlane>();

planeDetector.onPlaneAddedObservable.add((plane) => {
  detectedPlanes.set(plane.id, plane);
});
planeDetector.onPlaneUpdatedObservable.add((plane) => {
  detectedPlanes.set(plane.id, plane);
});
planeDetector.onPlaneRemovedObservable.add((plane) => {
  detectedPlanes.delete(plane.id);
});

// Run this handler while an immersive XR session is active.
document.getElementById("capture-room")?.addEventListener("click", async () => {
  try {
    await planeDetector.initiateRoomCapture();
  } catch (error) {
    console.error("Room capture is unavailable or failed:", error);
  }
});
```

The promise does not return planes. Captured results arrive on later XR frames through the existing plane detector observables. The runtime decides whether a new capture replaces or augments previously detected planes. See the native [`initiateRoomCapture()` specification](https://immersive-web.github.io/plane-detection/#dom-xrsession-initiateroomcapture).

### Background remover

When in AR, you usually want to avoid environment meshes like a skybox and a ground (unless your goal is to keep them). If you are creating a scene that should work on both regular devices and in AR, you will want the ability to disable certain meshes when entering AR and re-enable them when leaving AR. This module does exactly that. It receives a list of meshes and disables or enables them when needed.

When using the Babylon environment helper, the module can do the work for you automatically. In that case, the skybox and ground will be automatically removed if you enabled the feature.

To enable it, use:

```javascript
const xrBackgroundRemover = featuresManager.enableFeature(BABYLON.WebXRBackgroundRemover);
```

To customize the way the module works, use the following configuration object:

```typescript
export interface IWebXRBackgroundRemoverOptions {
  /**
   * Further background meshes to disable when entering AR
   */
  backgroundMeshes?: AbstractMesh[];
  /**
   * flags to configure the removal of the environment helper.
   * If not set, the entire background will be removed. If set, flags should be set as well.
   */
  environmentHelperRemovalFlags?: {
    /**
     * Should the skybox be removed (default false)
     */
    skyBox?: boolean;
    /**
     * Should the ground be removed (default false)
     */
    ground?: boolean;
  };
  /**
   * don't disable the environment helper
   */
  ignoreEnvironmentHelper?: boolean;
}
```

For example, if you want the module to remove only the skybox and not the ground when using the environment helper, enable the feature this way:

```javascript
const xrBackgroundRemover = featuresManager.enableFeature(BABYLON.WebXRBackgroundRemover, "latest", {
  environmentHelperRemovalFlags: {
    skyBox: true,
    ground: false,
  },
});
```

### DOM Overlay

When in AR mode, you may want to show a DOM element.

When enabling the DOM overlay feature, `element` is the only required option and can be either a DOM element or a string (using the first element returned when passed to `document.querySelector`).

The final parameter of `enableFeature` may be important to you because it can set this feature as optional.

```javascript
const featuresManager = xr.baseExperience.featuresManager;
const domOverlayFeature = featuresManager.enableFeature(BABYLON.WebXRDomOverlay, "latest", { element: ".dom-overlay-container" }, undefined, false);

xr.baseExperience.onStateChangedObservable.add((webXRState) => {
  switch (webXRState) {
    case BABYLON.WebXRState.ENTERING_XR:
    case BABYLON.WebXRState.IN_XR:
      // domOverlayType will be null when not supported.
      console.log("overlay type:", domOverlayFeature.domOverlayType);
      break;
  }
});
```

Once you have entered AR you can check the feature for the DOM overlay type; `domOverlayType` will be non-null if the feature is supported in the browser.

The latest options can be found in the [WebXR DOM overlay feature's source code](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/XR/features/WebXRDOMOverlay.ts#L10).

### WebXR Light estimation

When enabling the Light Estimation feature, WebXR will start analyzing the scene and provide the developer with light estimation data that can be used to make the scene look more realistic.

For example, when placing an element on the floor, it could provide the light direction for more realistic shadows, and the environment map for more realistic reflections.

The idea is that the underlying system provides us with many details that allow us to “match” the object we are placing with the real world. Light estimation can provide us with:

- Light color (and intensity)
- Light direction
- Reflection cubemap (environment)
- Spherical harmonics coefficients
- Happiness

The data is provided per frame only if requested by the developer. This helps manage performance on older or slower devices. When enabling light estimation, you can provide the following options:

```typescript
export interface IWebXRLightEstimationOptions {
  /**
   * Disable the cube map reflection feature. In this case only light direction and color will be updated
   */
  disableCubeMapReflection?: boolean;
  /**
   * Should the scene's env texture be set to the cube map reflection texture
   * Note that this doesn't work is disableCubeMapReflection if set to false
   */
  setSceneEnvironmentTexture?: boolean;
  /**
   * How often should the cubemap update in ms.
   * If not set the cubemap will be updated every time the underlying system updates the environment texture.
   */
  cubeMapPollInterval?: number;
  /**
   * How often should the light estimation properties update in ms.
   * If not set the light estimation properties will be updated on every frame (depending on the underlying system)
   */
  lightEstimationPollInterval?: number;
  /**
   * Should a directional light source be created.
   * If created, this light source will be updated whenever the light estimation values change
   */
  createDirectionalLightSource?: boolean;
  /**
   * Define the format to be used for the light estimation texture.
   */
  reflectionFormat?: XRReflectionFormat;
  /**
   * Should the light estimation's needed vectors be constructed on each frame.
   * Use this when you use those vectors and don't want their values to change outside of the light estimation feature
   */
  disableVectorReuse?: boolean;

  /**
   * disable applying the spherical polynomial to the cube map texture
   */
  disableSphericalPolynomial?: boolean;
}
```

Note that all the following demos are expected to work incorrectly when not in AR mode!

This demo shows how to use the light estimation feature to create a directional light source including shadows and environment map:

<Playground id="#NAZYHG#5" title="Light estimation - full demo" description="Light estimation with a light source, shadows, and environment map enabled"/>

#### Enabling a light source

To enable the feature with one or more of these options, use (for example):

```javascript
const lightEstimationFeature = featuresManager.enableFeature(BABYLON.WebXRFeatureName.LIGHT_ESTIMATION, "latest", {
  createDirectionalLightSource: true,
});
```

This will create a directional light source that will be updated constantly.

<Playground id="#NAZYHG#1" title="Light estimation - light source" description="Light estimation with a light source enabled"/>

#### Enabling shadows

Since a light source is created for you, you can enable a shadow generator using this light. To do that use the following code after enabling the feature:

```javascript
const le = defaultXRExperience.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.LIGHT_ESTIMATION, "latest", {
  createDirectionalLightSource: true,
});
const shadowGenerator = new BABYLON.ShadowGenerator(512, le.directionalLight);
shadowGenerator.useBlurExponentialShadowMap = true;
shadowGenerator.setDarkness(0.1);
shadowGenerator.getShadowMap().renderList.push(meshesToAdd);
```

#### Adjusting performance

Light estimation can be a heavy task to perform on older/slower devices. You can provide an interval in which the data will be polled to improve your scene's performance:

```javascript
const lightEstimationFeature = featuresManager.enableFeature(BABYLON.WebXRFeatureName.LIGHT_ESTIMATION, "latest", {
  lightEstimationPollInterval: 1000,
  cubeMapPollInterval: 1000,
});
```

This will update both the light data itself and the environment cube map every second (instead of every time the system notifies us that the data has changed).

### Depth Sensing

Depth Sensing can be used to obtain depth information from cameras. If your device has capabilities such as depth estimation, you can access the depth buffer through this feature. For more information, please check the [explainer for WebXR Depth Sensing Module](https://github.com/immersive-web/depth-sensing/blob/main/explainer.md).

Enable Depth Sensing:

```javascript
// featuresManager from the base webxr experience helper
const depthSensing = featureManager.enableFeature(BABYLON.WebXRFeatureName.DEPTH_SENSING, "latest", {
  dataFormatPreference: ["ushort", "float"],
  usagePreference: ["cpu", "gpu"],
});
```

or for TypeScript:

```typescript
// featuresManager from the base webxr experience helper
const depthSensing = featureManager.enableFeature(BABYLON.WebXRFeatureName.DEPTH_SENSING, "latest", {
  dataFormatPreference: ["ushort", "float"],
  usagePreference: ["cpu", "gpu"],
} as BABYLON.IWebXRDepthSensingOptions) as BABYLON.WebXRDepthSensing;
```

When you enable the depth sensing feature, you must pass options.
The options are typed as `IWebXRDepthSensingOptions`.

```typescript
export type WebXRDepthUsage = "cpu" | "gpu";
export type WebXRDepthDataFormat = "ushort" | "float";

/**
 * Options for Depth Sensing feature
 */
export interface IWebXRDepthSensingOptions {
    /**
     *  The desired depth sensing usage for the session
     */
    usagePreference: WebXRDepthUsage[];
    /**
     * The desired depth sensing data format for the session
     */
    dataFormatPreference: WebXRDepthDataFormat[];

    /**
     * Depth sensing will be enabled on all materials per default, if the GPU variant is enabled.
     * If you just want to use the texture or the CPU variant instead set this to true.
     */
    disableDepthSensingOnMaterials?: boolean;

    /**
     * If set to true the occluded pixels will not be discarded but the pixel color will be changed based on the occlusion factor
     * Enabling this will lead to worse performance but slightly better outcome.
     * It is possible we will change this in the future to look even better.
     */
    useToleranceFactorForDepthSensing?: boolean;

    /**
     * If set to true the texture will be set to be used for visualization.
     * In this case it will probably NOT work correctly on the materials.
     * So be aware that, for the time being, you can only use one or the other.
     */
    prepareTextureForVisualization?: boolean;
}
```

The depth usage is currently `"cpu"` or `"gpu"`. You can specify it when you initialize this feature. If you specify both, one supported on your device will be selected.
Some information can be accessed only in CPU mode.

The data format is currently `"ushort"` or `"float"`. It describes the data format for buffers and textures.
As with depth usage, you can specify it when you initialize the feature.

Enabling this feature will automatically enable all added materials to be hidden behind real-world objects. If you want to disable this feature, you can set `disableDepthSensingOnMaterials` to `true`.

With this feature, you can access information like this:

```typescript
sessionManager.onXRFrameObservable.add(() => {
  const {
    depthUsage, // "cpu" or "gpu"
    depthDataFormat, // "ushort" or "float"

    width, // depth image width
    height, // depth image height

    rawValueToMeters, // operator of obtain depth value in meters

    normDepthBufferFromNormView, // An XRRigidTransform

    latestDepthImageTexture, // RawTexture for depth image
    latestDepthBuffer, // depth value array (cpu only)
    latestInternalTexture, // InternalTexture of depth image (gpu only)
  } = depthSensing;

  // apply depth texture to a material
  material.diffuseTexture = latestDepthImageTexture;
});

// observe `getDepthInMeters` is available
depthSensing.onGetDepthInMetersAvailable.add((getDepthInMeters) => {
  // depth value of center point of the screen
  const meters = getDepthInMeters(0.5, 0.5);
  console.log(meters);
});
```

<Playground id="#KDWCZY#601" title="Placing A Mesh In Space with depth sensing" description="See how depth sensing works when adding models to the real world" image="/img/playgroundsAndNMEs/vrglasses.webp"/>

## Demos

<Playground id="#GG06BQ#97" title="XR Measurement Tape" description="XR Measurement Tape Demo" image="/img/playgroundsAndNMEs/vrglasses.webp"/>
<Playground id="#KDWCZY" title="Placing A Mesh In Space" description="Simple example of placing a mesh in space." image="/img/playgroundsAndNMEs/vrglasses.webp"/>
