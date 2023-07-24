---
title: WebXR Features Manager
image: 
description: Learn all about the powerful WebXR features manager in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR, features manager
further-reading:
video-overview:
video-content:
---

## Why is it needed

The Features manager, our XR plugin system, was born out of a simple need - stay backwards compatible, but still deliver cutting edge APIs in a production system.

Since APIs like [Hit Test](https://github.com/immersive-web/hit-test) and [anchors](https://github.com/immersive-web/anchors) are constantly changing, and currently still have different support in different browser versions, there was a need for the “versioning” of the current development to keep up with API modifications over time.

If you are a bit impatient you can check the [selected WebXR features](/features/featuresDeepDive/webXR/WebXRSelectedFeatures) section, but it is recommended to at least read this section quickly.

## How to use

### Construct a new features manager

If you are using the [base WebXR experience helper](/features/featuresDeepDive/webXR/webXRExperienceHelpers) a features manager will be created for you and will be available in `xrBaseHelper.featuresManager`. If not, you only need to provide an XR session manager object to initialize a new one:

``` javascript
const fm = new FeaturesManager(xrSessionManager);
```

Note that even before creating the features manager you could call its static methods (check availability, register a new feature, etc.).

### What is available

To check what feature is available, use the features manager's static `GetAvailableFeatures` function, which will return an array of strings corresponding to specific features:

``` javascript
const availableFeatures = WebXRFeaturesManager.GetAvailableFeatures(); // in plain JS, use BABYLON.WebXRFeaturesManager

// availableFeatures = ["xr-hit-test", "xr-pointer-selection", ...]
```

To find if a specific feature is available use this code:

``` javascript
const availableFeatures = WebXRFeaturesManager.GetAvailableFeatures();
// using indexOf, but you can use any other method - includes, find, findIndex, in, etc'
if (availableFeatures.indexOf(WebXRFeatureName.POINTER_SELECTION) !== -1) {
    // Pointer selection is available
}
```

`WebXRFeatureName` will always contain the list of possible features.

When using ES6, make sure to import the feature you want to use, otherwise it won't be registered:

``` javascript
import {
    WebXRControllerPhysics
} from '@babylonjs/core/XR/features/WebXRControllerPhysics';

// The physics controller support will now be available and can be enabled:

fm.enableFeature(WebXRControllerPhysics.Name, "latest");
```

### Versioning

Just like any plugin system, the features are versioned numerically. The version is a number. Higher the number, the newer the version (pretty simple).

Two extra definitions available - `stable` for the latest stable version of this feature, and `latest` which is always updated with the plugin with the highest version number. Keep in mind that the `latest` definition will always be available, but the `stable` might not be — for features that are not yet considered "stable".

To get the available versions use the `GetAvailableVersions` static method. It will return an array of available versions, for example:

``` javascript
const availableVersions = featuresManager.GetAvailableVersions(WebXRFeatureName.POINTER_SELECTION);

// availableVersions = ["latest", "stable", "1", "2"];
```

This means that you can ask for version 1, but also for the stable version which will be one of the 2 - "1" or "2", depends on our definition. The "latest" version will load "2".

### Enable and disable a feature

Enabling a feature means that the feature is ready to be used in a working session. When a feature is enabled, it is ready to be attached, which technically means - influence the scene actively.

As an example, **enabling** the teleportation feature will register the `onControllerAdded` and `onControllerRemoved` observers. **Attaching** this feature will register all observers required for each controller to work properly, while **detaching** it will remove such observers. Furthermore, **disabling** the teleportation feature will make sure that the meshes are invisible and the `onControllerAdded` and `onControllerRemoved` observers will be removed. Finally, **disposing** of the feature will release everything, including all associated meshes.

To enable the feature use a constructed features manager's `enableFeature` function with the name and version you wish to load:

``` javascript
// get the features manager
const fm = xr.baseExperience.featuresManager;

// disable an already-enabled feature
fm.disableFeature(WebXRFeatureName.POINTER_SELECTION);

// enable the latest version of the "Hit Test" feature
const xrHitTestLatest = fm.enableFeature(WebXRFeatureName.HIT_TEST, "latest");

// enable the specific version of the "Hit Test" feature. This will disable an older implementation and enable the new one
const xrHitTest1 = fm.enableFeature(WebXRFeatureName.HIT_TES, 1);
```

### Configuring the feature

Every feature (as of now) has a different configuration options object that can be provided when enabling the feature. Each feature has an options interface. For example, Version "1" of the "Hit Test" feature has the following options available:

``` javascript
interface IWebXRHitTestOptions {
    /**
     * Only test when user interacted with the scene. Default - hit test every frame
     */
    testOnPointerDownOnly ? : boolean;
    /**
     * The node to use to transform the local results to world coordinates
     */
    worldParentNode ? : TransformNode;
}
```

To use it:

``` javascript
// get the features manager
const fm = xr.baseExperience.featuresManager;

// enable the latest version of the "Hit Test" feature with a configuration object. The old "enabled" version will be disposed of
const xrHitTestLatest = fm.enableFeature(WebXRFeatureName.HIT_TEST, "latest", {
    testOnPointerDownOnly: true
});

// enable the specific version of the "Hit Test" feature with default configuration. The old config will be lost
const xrHitTest1 = fm.enableFeature(WebXRFeatureName.HIT_TES, 1);
```

### Attach and detach a feature

Once you have a feature enabled, you can synchronously attach (or detach) it to the scene:

``` javascript
// enable version "1" of the "Hit Test" feature
// Feature will be auto-attached once the session starts
const xrHitTest1 = fm.enableFeature(BABYLON.WebXRFeatureName.HIT_TEST, 1);

// detach the feature, but keep it enabled (for reattachment). This also disables auto-attach, if not already attached
xrHitTest1.detach();

// re-attach
xrHitTest1.attach();
```

Enabling a feature will attach it automatically when an XR session starts. If you want to only enable but not attach a feature (so you have full control of when it starts working), set the `attachIfPossible` argument to `false` (defaults to `true`):

``` javascript
// get the features manager
const fm = xr.baseExperience.featuresManager;
const xrHitTestLatest = fm.enableFeature(WebXRFeatureName.HIT_TEST, "latest", {
    testOnPointerDownOnly: true
}, false /* prevent attaching automatically */ );
```

## ES6 passive loader

When using the ES6 module loader you will notice that no features apart from transportation and pointer selection are available. You'll have to import other features (and their versions) by yourself. This ensures that resulting bundle will include only the code that your experience actually needs to load, when it needs it. Wonderful for the "tree shaking"!

So this won't work in ES6

``` javascript
const featuresManager = giveMeMyFeaturesManagerSomehow();
// The "Hit Test" feature is not available
const xrHitTest1 = featuresManager.enableFeature("xr-hit-test", 1);
// Error thrown, "feature not found"
```

Adding an import will make it work:

``` javascript
// other imports...
import {
    WebXRHitTestLegacy
} from "@babylonjs/core/Cameras/xr/features/WebXRHitTestLegacy";

const featuresManager = giveMeMyFeaturesManagerSomehow();
// feature will now be enabled
const xrHitTest1 = featuresManager.enableFeature(WebXRFeatureName.HIT_TEST /* Same as "xr-hit-test" */ , 1);
```

## Writing a new feature

If you want to add your own feature here are a few guidelines:

### IWebXRFeature

The feature should implement the `IWebXRFeature` interface, which looks like this:

``` javascript
interface IWebXRFeature extends IDisposable {
    /**
     * Is this feature attached
     */
    attached: boolean;
    /**
     * Should auto-attach be disabled?
     */
    disableAutoAttach: boolean;
    /**
     * Attach the feature to the session
     * Will usually be called by the features manager
     *
     * @param force should attachment be forced (even when already attached)
     * @returns true if successful.
     */
    attach(force ? : boolean): boolean;
    /**
     * Detach the feature from the session
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    detach(): boolean;
}
```

In order to ease this process you can, instead, extend the `WebXRAbstractFeature`, which has a few extra help-functions and implements most functions needed for a working feature.

After creating the feature, you will need to register it with the features manager, so it can be enabled.

To register it, use the static `AddWebXRFeature` function:

``` javascript
const nameOfFeature = "awesome-name";
const version = 1;
const isTheFeatureStable = true
WebXRFeaturesManager.AddWebXRFeature(nameOfFeature, (xrSessionManager, options) => {
    return () => new MyNewFeature(xrSessionManager, options);
}, version, isTheFeatureStable);
```

This way you can enable the feature using its name whenever you wish to use it.
