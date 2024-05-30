---
title: WebXR Movement
image:
description: Learn about how to move in a WebXR scene
keywords: babylon.js, diving deeper, WebXR, VR, AR, movement, locomotion
further-reading:
video-overview:
video-content:
---

## Movement Module

The movement feature allows movement in the scene with the controllers. It is separate from the teleportation module and designed to not be used at the same time.

In order to enable this feature you must first ensure that teleportation is not switched on.

Teleportation can be disabled in the default XR experience:

```javascript
const xr = await scene.createDefaultXRExperienceAsync({
  disableTeleportation: true,
});
```

You can also disable teleportation manually before enabling the movement feature.

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;
featureManager.disableFeature(BABYLON.WebXRFeatureName.TELEPORTATION);
```

The movement feature enables the camera's position to be changed with the controllers.
Default configuration (can be changed in options below):

1. Left Controller - Rotation counter + clockwise
2. Right Controller - Move forward/backwards/left/right

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, "latest", {
  xrInput: xrHelper.input,
});
```

<Playground id="#AZML8U" title="Movement with controllers" description="A simple example of controller movement with collisions and gravity" image="/img/how_to/xr/xr-movement-playground.png"/>

It is also possible to use the controller to set the movement direction. To do that you need to disable the head-direction settings. You can optionally define which hand will control the rotation:

```javascript
const featureManager = xrHelper.baseExperience.featuresManager;

const movementFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, "latest", {
  xrInput: xr.input,
  // add options here
  movementOrientationFollowsViewerPose: false, // default true
  movementOrientationFollowsController: true, // enable controller direction
  orientationPreferredHandedness: "left", // the preferred hand for rotation. Defaults to right. If hand is not found it will use the first found controller.
});
```

<Playground id="#AZML8U#242" title="Movement with controllers, direction with controller" description="A simple example of controller movement with collisions and gravity using the controller as direction" image="/img/how_to/xr/xr-movement-playground.png"/>

### Movement Configuration Options

The current options for the plugin can always be found at the [WebXR movement feature source code](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/XR/features/WebXRControllerMovement.ts#L20). Most of them will be explained here.

One important option is `movementOrientationFollowsViewerPose`, which defaults to `true`. When configured to `false` the forward direction will not adjust with the viewer pose, but only to the controller rotation. This can be useful for some experiences where the viewer pose should not affect movement direction. ie: If you are moving forward and look left that you should not drift left, but continue straight. You can try out in the above playground by changing the option.

The controllers themselves can be configured differently. If you want to swap which hand controls rotation vs. movement for example, then override the option `customRegistrationConfigurations` array. The movement state rotation and movement is handled automatically by the feature and ignored accordingly if rotation (`rotationEnabled`) or movement (`movementEnabled`) are not enabled and will automatically be adjusted to speed (`rotationSpeed` & `movementSpeed`).

This would swap handedness of the default configuration and maintain feature sensitivity thresholds:

```javascript
const swappedHandednessConfiguration = [
  {
    allowedComponentTypes: [BABYLON.WebXRControllerComponent.THUMBSTICK_TYPE, BABYLON.WebXRControllerComponent.TOUCHPAD_TYPE],
    forceHandedness: "right",
    axisChangedHandler: (axes, movementState, featureContext, xrInput) => {
      movementState.rotateX = Math.abs(axes.x) > featureContext.rotationThreshold ? axes.x : 0;
      movementState.rotateY = Math.abs(axes.y) > featureContext.rotationThreshold ? axes.y : 0;
    },
  },
  {
    allowedComponentTypes: [WebXRControllerComponent.THUMBSTICK_TYPE, WebXRControllerComponent.TOUCHPAD_TYPE],
    forceHandedness: "left",
    axisChangedHandler: (axes, movementState, featureContext, xrInput) => {
      movementState.moveX = Math.abs(axes.x) > featureContext.movementThreshold ? axes.x : 0;
      movementState.moveY = Math.abs(axes.y) > featureContext.movementThreshold ? axes.y : 0;
    },
  },
];

const featureManager = xrHelper.baseExperience.featuresManager;

featureManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, "latest", {
  xrInput: xrHelper.input,
  customRegistrationConfigurations: swappedHandednessConfiguration,
});
```

Other useful options are to change movement and rotation speed and to enable/disable movement (`movementEnabled`) and rotation (`rotationEnabled`), but these ones are also available on the feature itself to change at runtime. The threshold options determine the sensitivity when the input is accepted - the default is 0.25, which prevents accidental movements and jittering.

## Walking Locomotion

`WebXRWalkingLocomition` is an experimental Babylon.js capability which
enables users to traverse VR spaces by "walking in place."

```javascript
scene.createDefaultXRExperienceAsync({ disableTeleportation: true }).then((xr) => {
  const xrRoot = new BABYLON.TransformNode("xrRoot", scene);
  xr.baseExperience.camera.parent = xrRoot;
  xr.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.WALKING_LOCOMOTION, "latest", { locomotionTarget: xrRoot });
});
```

<Playground id="#HE33TR#11" title="Walking Locomotion Demo" description="Basic demo of walking locomotion"/>

While it is highly recommended to articulate the `WebXRCamera`'s parent
node in order to avoid conflating virtual positional data with XR
sensory readings, it is also possible to articulate the `WebXRCamera`
itself.

```javascript
scene.createDefaultXRExperienceAsync({ disableTeleportation: true }).then((xr) => {
  xr.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.WALKING_LOCOMOTION, "latest", { locomotionTarget: xr.baseExperience.camera.parent });
});
```

<Playground id="#HE33TR#10" title="WebXRCamera Walking Locomotion" description="Walking locomotion operating on the WebXRCamera directly"/>

To move, simply face in the direction you want to go and "walk in place,"
lifting and replacing each foot in turn much as you would if you were
actually walking forward. This is a control technique and is not expected
to work "magically"; it may take a small amount of practice to perform a
motion that the system recognizes as walking.

Under the hood, what the XR system is actually reacting to is the user's
head motion, specifically the characteristic back-and-forth "rocking"
motion traced by most people's heads when walking in place (or, for
example, on a treadmill). Because of this, walking-in-place motions which
keep the head stationary, or which cause the head to move erratically,
will not be recognized as "walking" by the `WebXRWalkingLocomotion`
feature. However, once a recognizable motion is performed, it should be
very easy and comfortable to replicate. Walking detection of a recognizable
motion should also be resilient to head orientation; because walking is
recognized from the movement of the head (at a guesstimated "nape of the
neck" position, which remains relatively stationary as the head rotates),
looking around while performing a recognizable "walking in place" motion
will not disrupt the locomotion feature.

### When to Use This Feature

`WebXRWalkingLocomotion` is a form of _continuous traversal_, similar to
walking around in real life and distinct from _discontinuous traversal_
alternatives such as teleportation. The most common example of continuous
traversal in VR, as in other forms of interactive 3D, is controller-based
and typically leverages a thumbstick to sort of "slide" the user around
the world in a continuous manner. Many users find this "sliding" effect
to be uncomfortable in VR, and for this reason teleportation is often
chosen as the default traversal alternative in VR applications.

However, there are times when teleportation and other discontinuous
traversal techniques are unsuitable, and in such circumstances
`WebXRWalkingLocomotion` can serve as an alternative to controller-based
continuous traversal. Early tests indicate that walking locomotion can
feel noticeably more comfortable than controller-based continuous
traversal, perhaps because the familiar "walking" motion reduces the
dissonance between the visual and vestibular stimuli presented to the
user.

It is also notable that `WebXRWalkingLocomotion`, because it assesses only
head motion, can be used entirely controller-free. This is particularly
powerful in combination with `WebXRHandTracking` because it allows for a
fully traversal-enabled VR experience where users can use their natural
hands without any controllers at all. This is not possible using other
traversal technologies without customizing the virtual space to support
point-to-point navigation and/or advanced hand gestures.
