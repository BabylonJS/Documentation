---
title: WebXR Augmented Reality Features
image: 
description: Learn about WebXR augmented reality features in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR, AR features
further-reading:
video-overview:
video-content:
---

## A bit about augmented reality

The idea behind augmented reality is simple - show the real world, but add information on top of it. As opposed to virtual reality where you are fully immersed in a different scene and have no actual contact to the real world, augmented reality lets you interact with it.

## Getting started with Augmented reality

### WebXR and AR

Augmented reality using Babylon.js will be heavily using WebXR, so I will recommend you to first start with the [getting started with WebXR](./Introduction_To_WebXR) guide. Most of the information that is valid for immersive VR sessions is also valid for immersive AR sessions. The few main differences between the two will be explained here.

### Supported devices

Immersive AR sessions are (currently) supported on two types of devices - mobile phones and firefox reality on the Hololens.

Mobile phones using android support immersive AR sessions on chrome (stable/canary). Note that you will need to install [AR Core](https://play.google.com/store/apps/details?id=com.google.ar.core), otherwise it will be a very short experience.

Hololens 2 supports WebXR and immersive AR sessions when using [Firefox Reality for hololens](https://www.microsoft.com/en-ca/p/firefox-reality/9npq78m7nb0r).

To check your scene on a desktop you can use the WebXR emulator, which supports a set of features of AR and lets you enter an immersive AR session when choosing the mobile mode.

### Simple scene in immersive AR

The simplest immersive AR sample is a port of an immersive VR scene:

```javascript
var createScene = async function () {
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  var light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;
  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
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

Playground for a simple immersive AR scene: <Playground id="#F41V6N#32" title="Simple Immersive AR Scene" description="Simple example of an immersive AR scene." image=""/>

Notice that no environment was created. As opposed to immersive VR sessions, AR doesn't require a skybox or ground. If you want to define ground and remove it when entering AR (for example if you develop an experience for both desktop and AR) you can use the background remover feature, defined later in this page.

## Features

Some features require the Incubation flag in the latest chrome canary. Visit chrome://flags/ and enable WebXR incubation.

You will then need to ask WebXR to enable this feature. this can be done using the optionalFeature parameter in the default experience helper:

```javascript
const xr = await scene.createDefaultXRExperienceAsync({
  uiOptions: {
    sessionMode: "immersive-ar",
  },
  optionalFeatures: true,
});
```

This will enable all optional features that we support. You can also add individual features by using an array insteaf of a boolean:

```javascript
const xr = await scene.createDefaultXRExperienceAsync({
  uiOptions: {
    sessionMode: "immersive-ar",
  },
  optionalFeatures: ["hit-test", "anchors"],
});
```

### Hit test

Hit-test is used for sending a ray into the real world and receiving information about intersection in space. You can read about it in the [hit test w3c draft](https://immersive-web.github.io/hit-test/). Think about a ray that is broadcasted from your phone's screen towards to object you are looking for. If the device's AR capabilities allows it, it will let you know the position and orientation of the point relative to you.

To enable hit-testing, add this after initializing XR

```javascript
// featuresManager from the base webxr experience helper
const hitTest = featuresManager.enableFeature(BABYLON.WebXRHitTest, "latest");
```

In typescript you can also get the type set correctly:

```javascript
// featuresManager from the base webxr experience helper
const hitTest = featuresManager.enableFeature(BABYLON.WebXRHitTest, 'latest') as BABYLON.WebXRHitTest;
```

This will enable the default behavior of hit-testing which is sending a single hit-test ray from the center of the display forward on each frame.

The options that you can pass are descriped in this interface:

```javascript
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

`disablePermanentHitTest` will disable the constant hit-testing, while `enableTransientHitTest` will enable hit-tests when touching the screen. The offsets define the offset from which the ray will be sent (relative to the center of the device's view).

After enabling the feature, you can register to get updates using the `onHitTestResultObservable`:

```javascript
// a dot to show in the found position
const dot = BABYLON.SphereBuilder.CreateSphere(
  "dot",
  {
    diameter: 0.05,
  },
  scene
);
dot.isVisible = false;
hitTest.onHitTestResultObservable.add((results) => {
  if (results.length) {
    dot.isVisible = true;
    results[0].transformationMatrix.decompose(
      dot.scaling,
      dot.rotationQuaternion,
      dot.position
    );
  } else {
    dot.isVisible = false;
  }
});
```

This will show the dot only if hit-test worked, and will hide it if it didn't. The dot will be projected to the real world using the information provided by the system.

A simple example for WebXR hit-test using Babylon.js: <Playground id="#XWBES1" title="WebXR Hit-Test Using Babylon.js" description="Simple example of WebXR hit testing." image=""/>. Open this with your AR device (probably your android smartphone) and point the device at a textured plane (like your floor or door). The marker will be shown at the right location if/when the system scanned the plane correctly. 

### Anchors

Anchors are tracked points in space that the system will constantly update as you continue scanning your environment. The points' transformation will be constantly updated by the underlying system. You can read more about anchors at the [WebXR anchors module](https://immersive-web.github.io/anchors/) w3c proposal.

Enable the anchors system using:

```javascript
// featuresManager from the base webxr experience helper
const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem, 'latest');
```

or for typescript:

```javascript
// featuresManager from the base webxr experience helper
const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem, 'latest') as BABYLON.WebXRAnchorSystem;
```

Some options can be passed to the anchor system:

```javascript
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

Anchors are removed when exiting the XR session (note that the anchors are removed, and not meshed that are attached to them), which is the recommended behavior, as anchors cannot be referenced between sessions.

If you want to prevent that from happening, use the `doNotRemoveAnchorsOnSessionEnded` when initializing the anchor system:

```javascript
const anchorSystem = featuresManager.enableFeature(BABYLON.WebXRAnchorSystem, 'latest', { doNotRemoveAnchorsOnSessionEnded: true });
```

The anchor system fits perfectly to the hit-test feature if you want to add an anchor at a hit test position. To do that use the `addAnchorPointUsingHitTestResultAsync` function:

```javascript
const arTestResult = getMeTheResultINeed();
const anchorPromise = anchorSystem.addAnchorPointUsingHitTestResultAsync(lastHitTest);
```

To add an anchor in any position and rotation in the scene, use the `addAnchorAtPositionAndRotationAsync` function:

```javascript
const { position, rotationQuaternion } = anyRandomMesh;
const anchorPromise = anchorSystem.addAnchorAtPositionAndRotationAsync(position, rotationQuaternion);
```

Note that `anchorPromise` will return a *native XRAnchor* when fulfilled. This will provide you with what the browser returns. To work with anchors **in the babylon way**, we use the observables defined in the anchor module:

```javascript
anchorSystem.onAnchorAddedObservable.add((anchor) => {
    // ... do what you want with the anchor after it was added
})

anchorSystem.onAnchorRemovedObservable.add((anchor) => {
    // ... do what you want with the anchor after it was removed
})

anchorSystem.onAnchorUpdatedObservable.add((anchor) => {
    // ... do what you want with the anchor after it was updated
})
```

The anchor is of type `IWebXRAnchor`:

```javascript
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
     * if defined, this object will be constantly updated by the anchor's position and rotation
     */
    attachedNode?: TransformNode;
}
```

To attach an anchor to a node (for example a mesh that you want to always be in this location in the scene) use the `attachedNode` variable. This will also update the mesh's transformation when the anchor is updated:

```javascript
const mesh = //...

anchorSystem.onAnchorAddedObservable.add((anchor) => {
    anchor.attachedNode = mesh;
})
```

The mesh will now be tracked by the system and will be located at the requested point. 

You might ask yourself why use the anchor system with hit-test results, as hit-test results are returned by the system with a position defined by the device. Setting the mesh at the hit-test's location will work just fine. The difference is that the system might update the information it has about this position - maybe it found out the plane is at a different transformation, maybe it updated its position in space. Using the anchor system will keep the transformation updated even when the system updated its knowledge of the space.

### Plane detection

Your device is (usually) capable of detecting plane geometries in the real world. To read more about plane detection go to the [Plane detection explainer](https://github.com/immersive-web/real-world-geometry/blob/master/plane-detection-explainer.md). 

Babylon has an experimental plane detection module that works with the underlying system. To enable it:

```javascript
// featuresManager from the base webxr experience helper
const planeDetector = featuresManager.enableFeature(BABYLON.WebXRPlaneDetector, "latest");
```

Just like any module you can configure it using the options object, which is of this type:

```javascript
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

Similar to the anchor system, planes do not stay between sessions. If you want to keep the native XRPlane objects, set the `doNotRemovePlanesOnSessionEnded` to true, and babylon will not delete them.

the plane detector works automatically and offers three observables for you to use:

```javascript
planeDetector.onPlaneAddedObservable.add((plane) => {
    // ... do what you want with the plane after it was added
})

planeDetector.onPlaneRemovedObservable.add((plane) => {
    // ... do what you want with the plane after it was removed
})

planeDetector.onPlaneUpdatedObservable.add((plane) => {
    // ... do what you want with the plane after it was updated
})
```

The plane object is of type IWebXRPlane:

```javascript
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
}
```

To create a Babylon polygon from the plane information do the following:

```javascript
const plane = // a reference to an added plane
// add the starting point, so the polygon will close
plane.polygonDefinition.push(plane.polygonDefinition[0]);
// create a polygon mesh builder for the polygons returned from the system
var polygon_triangulation = new BABYLON.PolygonMeshBuilder("name", plane.polygonDefinition.map((p) => new BABYLON.Vector2(p.x, p.z)), scene);
// build the plane with specific thickness
var polygon = polygon_triangulation.build(false, 0.01);

```

A simple usecase for planes is showing them in your scene using polygons. An example for that can be found at the WebXR Plane Detection demo: <Playground id="#98TM63" title="WebXR Plane Dedication Demo" description="WebXR Plane Dedication Demo" image=""/>


### Background remover

When in AR you want to avoid environment meshes like a skybox and a ground (unless it was your goal to keep them). If you are creating a scene that should work on both regular devices and in AR, you will want the ability to disable certain meshes when entering AR, and re-enabling them when leaving AR. This module does exactly that. It receives a list of meshes, and disables/enables them when needed.

When using the babylon environment helper, the module can do the work for you automatically. In that case, the skybox and ground will be automatically removed if you enabled the feature. 

To enable it use:

```javascript
const xrBackgroundRemover = featuresManager.enableFeature(BABYLON.WebXRBackgroundRemover);
```

To customize the way the module works, use the following configuration object:

```javascript
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

For example if you want the module to remove only the skybox and not the ground, when using the environment helper, enable the feature this way:

```javascript
const xrBackgroundRemover = featuresManager.enableFeature(BABYLON.WebXRBackgroundRemover, 'latest', {
  environmentHelperRemovalFlags: {
    skyBox: true,
    ground: false
  }
});
```

# Demos

* <Playground id="#GG06BQ#3" title="XR Measurement Tape" description="XR Measurement Tape Demo" image=""/>
* <Playground id="#KDWCZY" title="Placing A Mesh In Space" description="Simple example of placing a mesh in space." image=""/>