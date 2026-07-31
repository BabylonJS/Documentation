---
title: WebXR Hand Tracking Feature
image:
description: Learn about WebXR hand tracking in Babylon.js.
keywords: babylon.js, diving deeper, WebXR, VR, AR, hand tracking, near interaction
further-reading:
video-overview:
video-content:
---

## Hand tracking

Some devices and browsers support tracking hand joints directly, with no need for external controllers. These include Oculus Quest 1 and 2 using the native Oculus browser.

Twenty-five points on each hand are tracked and delivered on each frame. Babylon's hand-tracking feature uses this information to constantly update the WebXRHand object and the transforms of its 25 children.

Please note that when referring to "hands" on this page, we are referring to the actual handedness of the user, not to a left-handed versus right-handed system. WebXR is right-handed by nature.

### Getting started

To get started, you will first need a supported device.

Starting with version 6.40.0, hand support is enabled by default, if supported, when using the default experience helper. To configure it, pass the details when initializing the experience helper:

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

This will enable basic hand support: 25 hidden spheres will be created for each hand, and each hand will have the default hand mesh loaded and enabled:

![BabylonJS WebXR Hand tracking mesh](/img/how_to/xr/xrHandTrackingMesh.webp)

### Configuration Options

The current options for the plugin can always be found at the [WebXR hand tracking feature source code](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/XR/features/WebXRHandTracking.ts#L31). Most of them will be explained later.

### Hand meshes

Babylon's default hand meshes are enabled by default. You can disable them entirely, or provide different ones.

To disable them, use the `disableDefaultHandMesh` flag when creating the feature:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    disableDefaultHandMesh: true,
  },
});
```

This will disable mesh loading and show the 25 points (25 spheres per hand by default):

![BabylonJS WebXR Hand tracking spheres](/img/how_to/xr/handTrackingSpheres.webp)

If you want to provide different hand meshes (for example, if you want your users to wear gloves), it is recommended that you start with the current RHS (right-handed system) hand meshes from the [hand meshes](https://github.com/BabylonJS/Assets/tree/master/meshes/HandMeshes) assets directory and modify them. Otherwise, you will need to create your own skeleton/bones and weight the skin correctly.

Once you are done creating them, you will need two important objects per hand. The first is the actual mesh for each hand. The other is the mapping between the native XR tracked joints and the bones in your model. It is a structured array of bone names as strings, sorted according to the XR joint mapping. The default one is this:

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

![BabylonJS WebXR Hand tracking spheres](/img/how_to/xr/handTrackingSpheres.webp).

Each of those 25 points has an InstancedMesh created when the hand-tracking feature is enabled. Those meshes can be used for physics, gesture recognition, collision detection, and more. The default mesh is a sphere. To provide a different mesh, use the `sourceMesh` option:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    sourceMesh: BoxBuilder.CreateBox("jointParent", { size: 1 }),
  },
});
```

Babylon will take this `sourceMesh` and use it to create 25 instances per hand. This mesh will then be set invisible, unless you want it to remain visible:

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

Those instances will be visible if no hand mesh is enabled. If you want them to be invisible, set the `invisible` flag:

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

If you want to modify those meshes individually (for example, to provide a different material per joint), you can use the `onHandJointMeshGenerated` callback:

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

The underlying system will provide a native pointer ray for each hand. Babylon's `WebXR Pointer system` will automatically detect it and allow users to interact with the scene using pointer down/move/up events. Each hand will be provided with a pointer ID to differentiate its pointer events. You can use this information to find the hand object from the pointer selection and the hand-tracking feature:

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

Note that each system might have different gestures for "select". On Quest, it is executed by holding the index finger and the thumb together. Other systems might use a different gesture.

### Near interactions

Hands are perfect for near-field interactions. They are enabled by default when using the default WebXR experience helper. Otherwise, you will need to enable the WebXRNearInteraction feature.

To enable a mesh or a GUI element for near interaction, simply mark it as near-pickable (or near-grabbable):

```javascript
sphere.isNearPickable = true;
```

Now hands (and controllers) can emit pointer events directly on the mesh. This is wonderful for 2D GUI interactions.

<Playground id="#9K3MRA#1513" title="XR Near interactions" description="2D GUI with near interaction enabled" image=""/>

### Using the hand and skeleton joint data

Each hand has its own WebXRHand object associated with it. The WebXR hand object references the following information:

- the `trackedMeshes` object, holding all 25 joint meshes, sorted according to XR joint tracking
- the `handMesh` object (if enabled)
- the `xrController` associated with this hand

There are a few ways to get the hand object:

- Use the controller id as described before
- Use the handedness:

```javascript
const xrHandFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
});

// after the controllers were initialized
const rightHand = xrHandFeature.getHandByHandedness("right");
```

- The recommended way is to use the `onHandAddedObservable`:

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

To configure the physics properties (which default to a sphere with the default friction and restitution), use the physics props option:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
  xrInput: xrHelper.input,
  jointMeshes: {
    enablePhysics: true,
    physicsProps: {
      friction: 0.5,
      restitution: 0.3,
    },
  },
});
```

Notice that you can't define the mass. That is because the tracked joints will always have mass `0` to prevent them from constantly "falling down" toward the center of gravity.

<Playground id="#X7Y4H8#73" title="Hand tracking with physics" description="A simple example of a hands-enabled physics playground" image="/img/how_to/xr/handTrackingSpheres.webp"/>


### Microgestures

The Oculus Quest Browser includes support for hand tracking microgestures through a Meta OpenXR [extension](https://registry.khronos.org/OpenXR/specs/1.1/html/xrspec.html#XR_META_hand_tracking_microgestures), compatible with Quest 2, Quest Pro, Quest 3, and Quest 3S.

This extension introduces five boolean input states per hand (`menu` - only left hand, `swipe-left`, `swipe-right`, `swipe-forward`, `swipe-backward`, `tap-thumb`), enabling fine-grained interaction detection. The image below shows how to perform each microgesture:

<img src="/img/how_to/xr/hand-tracking-microgestures.webp" title="Hand tracking microgestures" alt="Hand tracking microgestures" width="500" height="900" />
<br/><br/>

If you're using ES6 modules with tree-shaking, make sure to import the controller to ensure its initialization.

 ```ts
import "@babylonjs/core/XR/motionController/webXROculusHandController";
 ```

Finally, you can subscribe to events just like with any other input controller. For example, to subscribe to the `swipe-left` microgesture event:

 ```ts
xr.input.onControllerAddedObservable.add((xrController) => {
        xrController.onMotionControllerInitObservable.add((motionController) => {
            const swipeLeftComponent = motionController.getComponent('swipe-left');
            swipeLeftComponent?.onButtonStateChangedObservable.add(() => {
                if (swipeLeftComponent.pressed) {
                    // do something here...
                }
            });
        })
    });
 ```

In the playground below, you can find subscriptions for all available events.

<Playground id="#F41V6N#2427" title="Hand tracking microgestures" description="A simple example of a hand tracking microgestures" />