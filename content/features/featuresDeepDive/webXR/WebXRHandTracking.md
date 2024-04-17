---
title: WebXR Hand Tracking Feature
image:
description: Learn about key WebXR hand tracking in Babylon.js
keywords: babylon.js, diving deeper, WebXR, VR, AR, hand tracking, near interaction
further-reading:
video-overview:
video-content:
---

## Hand tracking

Some devices and browsers support tracking the hand joints directly, with no need for external controllers. Such devices are the Oculus Quest (1 and 2) using the native Oculus browser.

25 points on each hand are being tracked and delivered to you on each frame. Babylon's hand tracking feature uses this information to constantly update the WebXRHand object and its 25 children transformations.

Please note that when referring to "hands" on this page we are referring to the actual handedness of the user and not left-handed vs. right-handed system. WebXR is right-handed in its nature.

### Getting started

To get started you will first need a supported device.

Starting version 6.40.0, hand support is enabled per default, if supported, when using the default experience helper. To configure it, pass the details when initializing the experience helper:

```javascript
const xrHelper = scene.createDefaultXRExperienceAsync({
  handSupportOptions: {
    // options you want to change
  },
});
```

To enable hand support in older versions (or to change the configuration), enable the WebXR feature:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  // other options
});
```

This will enable basic hand support - 25 hidden spheres will be created for each hand, and each hand will have the default hand mesh loaded and enabled:

![BabylonJS WebXR Hand tracking mesh](/img/how_to/xr/xrHandTrackingMesh.jpg)

### Configuration Options

The current options for the plugin can always be found at the [WebXR hand tracking feature source code](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/XR/features/WebXRHandTracking.ts#L31). Most of them will be explained later.

### Hand meshes

Babylon's default hand meshes are enabled per default. You can disable them entirely, or provide different ones.

To disable them use the `disableDefaultHandMesh` flag when creating the feature:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    disableDefaultHandMesh: true,
  },
});
```

This will disable the mesh load and will enable the 25 points to be shown (defaults to 25 spheres per hand):

![BabylonJS WebXR Hand tracking spheres](/img/how_to/xr/handTrackingSpheres.jpg)

If you want to provide different hand meshes (for example if you want to have your users wear gloves) it is recommended to take the current RHS (right hand system) hand meshes from the [hand meshes](https://github.com/BabylonJS/Assets/tree/master/meshes/HandMeshes) assets directory and modify them. Otherwise you will need to create your own skeleton/bones and weight the skin correctly.

Once you are down creating you will need two important objects per hand. The first is the actual mesh per hand. The other is the mapping between the native XR tracked joint and the bone in your model. It is a structured array with the names of the bones of each hand as strings, sorted according to the XR mapping of the joints. The default one is this:

```javascript
this._rigMapping = [
  "wrist_",
  "thumb_metacarpal_",
  "thumb_proxPhalanx_",
  "thumb_distPhalanx_",
  "thumb_tip_",
  "index_metacarpal_",
  "index_proxPhalanx_",
  "index_intPhalanx_",
  "index_distPhalanx_",
  "index_tip_",
  "middle_metacarpal_",
  "middle_proxPhalanx_",
  "middle_intPhalanx_",
  "middle_distPhalanx_",
  "middle_tip_",
  "ring_metacarpal_",
  "ring_proxPhalanx_",
  "ring_intPhalanx_",
  "ring_distPhalanx_",
  "ring_tip_",
  "little_metacarpal_",
  "little_proxPhalanx_",
  "little_intPhalanx_",
  "little_distPhalanx_",
  "little_tip_",
].map((joint) => `${joint}${handedness === "right" ? "R" : "L"}`);
```

Once you have both objects per hand, you can provide them when enabling the feature:

```javascript
const rightHandMesh = getRightHandMesh(); // get it any way you want
const leftHandMesh = getLeftHandMesh(); // get it any way you want
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    disableDefaultHandMesh: true,
    handMeshes: {
      right: rightHandMesh,
      left: leftHandMesh,
    },
    rigMapping: {
      right: [
        //... mapping for the right hand mesh
      ],
      left: [
        //... mapping for the left hand mesh
      ],
    },
  },
});
```

### 25 tracked points per hand

As mentioned before, WebXR allows us to track 25 points per hand. Those points are listed here: [XR Skeleton Joints](https://immersive-web.github.io/webxr-hand-input/#skeleton-joints-section).

It looks roughly like this:

![BabylonJS WebXR Hand tracking spheres](/img/how_to/xr/handTrackingSpheres.jpg).

Each of those 25 points has an InstancedMesh created upon enabling the hand tracking feature. Those meshes can be used for physics, gesture recognition, collision detection and more. The default mesh is a sphere. To provide a different mesh use the `sourceMesh` option:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    sourceMesh: BoxBuilder.CreateBox("jointParent", { size: 1 }),
  },
});
```

Babylon will take this sourceMesh and use it to create the 25 instances per hand. This mesh will then be set invisible, unless you ask for it to stay visible for your own reasons:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    sourceMesh: BoxBuilder.CreateBox("jointParent", { size: 1 }),
    keepOriginalVisible: true, // will keep the original instance visible
  },
});
```

Those instances will be visible if there is no hand mesh enabled. if you want them to be invisible set the `invisible` flag:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    disableDefaultHandMesh: true,
    invisible: true,
  },
});
```

If you want to modify those meshes individually (for example provide a different material per joint) you can use the `onHandJointMeshGenerated` callback:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    disableDefaultHandMesh: true,
    onHandJointMeshGenerated: (instance) => {
      // do whatever you want with the instance
      return instance; // you can return a whole new mesh or the instance itself. If the instance is not returned, babylon will dispose the unused instance for you.
    },
  },
});
```

### Pointer support

The underlying system will provide native pointer ray for each hand. Babylon's `WebXR Pointer system` will automatically detect it and will allow the user to interact with the scene using the pointer down/move/up events. Each hand will be provided with a pointer id to differentiate its pointer events. You can use this information to find the hand object from the pointer selection and the hand tracking features:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

const xrHandFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
});

// ... at a later point

scene.onPointerObservable.add((evt) => {
  const pointerId = evt.event.pointerId;
  const xrController = xrHelper.pointerSelection.getXRControllerByPointerId(pointerId);
  const webxrHandObject = xrHandFeature.getHandByControllerId(xrController.uniqueId);
});
```

Note that each system might have different gestures for "select". In the Quest it is executed when holding the index finger and the thumb together. Other systems might have a different gesture for that.

### Near interactions

The hands are perfect for near-field interactions. There are enabled per default when using the default WebXR experience helper. Otherwise you will need to enable the WebXRNearInteraction feature.

To enable a mesh or a GUI element to be near-interactable, simply set it to be netPickable (or near grabbable):

```javascript
sphere.isNearPickable = true;
```

Now hands (and controllers) can emit pointer events straight on the mesh. Wonderful for 2D GUI interactions.

<Playground id="#9K3MRA#1513" title="XR Near interactions" description="2D GUI with near interaction enabled" image=""/>

### Using the hand and skeleton joint data

Each hand has its own WebXRHand object associated with it. The WebXR hand object references the following information:

- the `trackedMeshes` object, holding all 25 joint meshes, sorting according to the XR joints tracking
- the `handMesh` object (if enabled)
- the `xrController` associated with this hand

There are a few ways to get the hand object:

- Use the controller id as described before
- use the handedness:

```javascript
const xrHandFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
});

// after the controllers were initialized
const rightHand = xrHandFeature.getHandByHandedness("right");
```

- The recommended way - use the `onHandAddedObservable`:

```javascript
const xrHandFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
});

xrHandFeature.onHandAddedObservable.add((newHand) => {
  // celebrate, we have a new hand!
  scene.onBeforeRenderObservable.add(() => {
    // get the real world wrist position on each frame
    console.log(newHand.trackedMeshes[0].position);
  });
});
```

### Hands physics

To enable physics on each of the 25 tracked points use the `enablePhysics` flag:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    enablePhysics: true,
  },
});
```

To configure the physics impostor (which defaults to a sphere with the default friction and restitution) use the physics props option:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    enablePhysics: true,
    physicsProps: {
      impostorType: PhysicsImpostor.BoxImpostor,
      friction: 0.5,
      restitution: 0.3,
    },
  },
});
```

Notice that you can't define the mass. that is because the tracked joints will always have mass `0` to prevent them from constantly "falling down" towards the center of gravity.

<Playground id="#X7Y4H8#73" title="Hand tracking with legacy physics" description="A simple example of a hands-enabled legacy physics playground" image="/img/how_to/xr/handTrackingSpheres.jpg"/>
