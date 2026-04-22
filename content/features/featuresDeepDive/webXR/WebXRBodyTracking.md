---
title: WebXR Body Tracking Feature
image:
description: Learn about the WebXR body tracking feature in Babylon.js, which drives a full-body rigged mesh from XR joint pose data.
keywords: babylon.js, diving deeper, WebXR, VR, AR, body tracking, skeleton, rig, avatar, retargeting
further-reading:
  - title: WebXR Body Tracking Specification
    url: https://immersive-web.github.io/body-tracking/
  - title: WebXR Hand Tracking
    url: /features/featuresDeepDive/webXR/WebXRHandTracking
  - title: WebXR Features Manager
    url: /features/featuresDeepDive/webXR/webXRFeaturesManager
video-overview:
video-content:
---

## Body Tracking

Some XR devices can track the full pose of the user's body — not just their hands and head — and expose that data via the [WebXR Body Tracking specification](https://immersive-web.github.io/body-tracking/). Babylon.js provides a `WebXRBodyTracking` feature that consumes this data and, optionally, uses it to drive a rigged humanoid mesh so users can see their own avatar move with them in real time.

Up to **83 body joints** are tracked each frame, covering the full skeleton from the hips and spine up through the head, arms, and hands, and down through the legs and feet.

<Playground id="#0FOISU#2" title="WebXR Body Tracking" description="Full-body avatar driven by WebXR body tracking data" />

### Device and browser support

Body tracking is currently available on:

- **Meta Quest** devices (Quest 2, Quest Pro, Quest 3, Quest 3S) using the Meta Quest Browser.

Check the [WebXR Body Tracking specification](https://immersive-web.github.io/body-tracking/) for the latest platform support information. The feature degrades gracefully — if the runtime does not provide body data, the feature stays inactive and fires no errors.

### Getting started

Enable the feature on the features manager after creating the default XR experience:

```javascript
const xr = await scene.createDefaultXRExperienceAsync();

const bodyTracking = xr.baseExperience.featuresManager.enableFeature(
  BABYLON.WebXRFeatureName.BODY_TRACKING,
  "latest",
  {
    // optional: attach a rigged body mesh immediately
    bodyMesh: myRiggedMesh,
  }
);
```

At this point the feature creates 83 `TransformNode` objects (one per joint) and updates them every frame with the poses reported by the XR runtime. If you provided a `bodyMesh` with a skeleton, the skeleton bones are automatically linked to those transform nodes, so the mesh animates with the user.

### The 83 tracked body joints

The joints correspond to the names defined by the [WebXR Body Tracking spec](https://immersive-web.github.io/body-tracking/#xrbody-interface). They are exposed as the `WebXRBodyJoint` string enum:

| Group | Joints |
|---|---|
| **Torso / Spine** | `hips`, `spine-lower`, `spine-middle`, `spine-upper`, `chest`, `neck`, `head` |
| **Left Arm** | `left-shoulder`, `left-scapula`, `left-arm-upper`, `left-arm-lower`, `left-hand-wrist-twist` |
| **Right Arm** | `right-shoulder`, `right-scapula`, `right-arm-upper`, `right-arm-lower`, `right-hand-wrist-twist` |
| **Left Hand** | `left-hand-palm`, `left-hand-wrist`, plus all 5 fingers (metacarpal → tip) |
| **Right Hand** | `right-hand-palm`, `right-hand-wrist`, plus all 5 fingers (metacarpal → tip) |
| **Left Leg** | `left-upper-leg`, `left-lower-leg`, `left-foot-ankle-twist`, `left-foot-ankle`, `left-foot-subtalar`, `left-foot-transverse`, `left-foot-ball` |
| **Right Leg** | `right-upper-leg`, `right-lower-leg`, `right-foot-ankle-twist`, `right-foot-ankle`, `right-foot-subtalar`, `right-foot-transverse`, `right-foot-ball` |

You can iterate over the complete ordered list with `WebXRBodyTracking.AllBodyJoints`.

### Observables

The feature exposes three observables for reacting to body tracking events:

```javascript
// Fired once when the runtime first delivers valid body data.
bodyTracking.onBodyTrackingStartedObservable.add((trackedBody) => {
  console.log("Body tracking started!");
});

// Fired every frame while body tracking is active.
bodyTracking.onBodyTrackingFrameUpdateObservable.add((trackedBody) => {
  // All joint TransformNodes are already up-to-date at this point.
  const hipsTransform = trackedBody.getJointTransform(BABYLON.WebXRBodyJoint.HIPS);
  console.log("Hips position:", hipsTransform.position);
});

// Fired when the runtime stops delivering body data.
bodyTracking.onBodyTrackingEndedObservable.add(() => {
  console.log("Body tracking lost.");
});
```

Use `bodyTracking.isTracking` to poll the current tracking state without subscribing to an observable.

### Accessing joint data

The `WebXRTrackedBody` object (received from the observables above, or via `bodyTracking.trackedBody`) provides helpers for reading individual joints or whole body parts:

```javascript
// Get the TransformNode for a single joint.
const headTransform = trackedBody.getJointTransform(BABYLON.WebXRBodyJoint.HEAD);

// Get all TransformNodes for one body part.
const leftArmTransforms = trackedBody.getBodyPartTransforms(BABYLON.BodyPart.LEFT_ARM);

// Or iterate the raw array (index matches WebXRBodyTracking.AllBodyJoints order).
const allTransforms = trackedBody.jointTransforms;
```

The available `BodyPart` values are: `TORSO`, `LEFT_ARM`, `RIGHT_ARM`, `LEFT_HAND`, `RIGHT_HAND`, `LEFT_LEG`, `RIGHT_LEG`.

### Attaching a rigged body mesh

Any humanoid mesh with a skeleton can be driven by body tracking. You tell the feature how to map the 83 XR joint names to your skeleton's bone names using a **rig mapping** object.

#### Mixamo models

For meshes exported from [Mixamo](https://www.mixamo.com/) (the most common source for humanoid characters), use the built-in `isMixamoModel` shortcut:

```javascript
const bodyTracking = xr.baseExperience.featuresManager.enableFeature(
  BABYLON.WebXRFeatureName.BODY_TRACKING,
  "latest",
  {
    bodyMesh: myMixamoMesh,
    isMixamoModel: true,
  }
);
```

Setting `isMixamoModel: true` automatically:
- Applies the built-in `MixamoRigMapping` (which covers hips, spine, head, shoulders, arms, legs, and feet).
- Enables `useBoneOrientationOffsets` for cleaner retargeting of the torso and wrist joints.
- Detects and handles the `mixamorig:` bone-name prefix automatically, so the same setting works for both prefixed and un-prefixed Mixamo exports.

#### Custom rig mapping

For other skeletons, supply a `rigMapping` object whose keys are `WebXRBodyJoint` names and whose values are the corresponding bone names in your skeleton:

```javascript
const bodyTracking = xr.baseExperience.featuresManager.enableFeature(
  BABYLON.WebXRFeatureName.BODY_TRACKING,
  "latest",
  {
    bodyMesh: myMesh,
    rigMapping: {
      "hips": "Bip01_Pelvis",
      "spine-lower": "Bip01_Spine",
      "spine-upper": "Bip01_Spine2",
      "neck": "Bip01_Neck",
      "head": "Bip01_Head",
      "left-shoulder": "Bip01_L_Clavicle",
      "left-arm-upper": "Bip01_L_UpperArm",
      "left-arm-lower": "Bip01_L_Forearm",
      "left-hand-wrist": "Bip01_L_Hand",
      "right-shoulder": "Bip01_R_Clavicle",
      "right-arm-upper": "Bip01_R_UpperArm",
      "right-arm-lower": "Bip01_R_Forearm",
      "right-hand-wrist": "Bip01_R_Hand",
      "left-upper-leg": "Bip01_L_Thigh",
      "left-lower-leg": "Bip01_L_Calf",
      "left-foot-ankle": "Bip01_L_Foot",
      "right-upper-leg": "Bip01_R_Thigh",
      "right-lower-leg": "Bip01_R_Calf",
      "right-foot-ankle": "Bip01_R_Foot",
      // … add more joints as needed
    },
  }
);
```

You do not need to map every joint — only the bones you want to animate.

#### Attaching a mesh after the feature is enabled

You can attach (or replace) a body mesh at any time with the `setBodyMesh` method:

```javascript
// Load a mesh later and attach it to the running feature.
const result = await BABYLON.SceneLoader.ImportMeshAsync("", "/models/", "avatar.glb", scene);
const avatarMesh = result.meshes[0];

bodyTracking.setBodyMesh(avatarMesh, {
  "hips": "Hips",
  // … rest of mapping …
});
```

The `onBodyMeshSetObservable` fires whenever a mesh is attached this way.

### Configuration options

All options are passed in the third argument to `enableFeature`:

| Option | Type | Default | Description |
|---|---|---|---|
| `bodyMesh` | `AbstractMesh` | — | A rigged body mesh to drive with tracked joint poses. |
| `rigMapping` | `XRBodyMeshRigMapping` | — | Maps each `WebXRBodyJoint` name to a bone name in the mesh skeleton. |
| `isMixamoModel` | `boolean` | `false` | Apply the built-in Mixamo mapping and sensible defaults automatically. |
| `jointScaleFactor` | `number` | `1.0` | Uniformly scales local joint offsets to fit avatars of different proportions. Values > 1 stretch the skeleton; values < 1 compress it. Does not affect the root (hips) position. |
| `preserveBindPoseBonePositions` | `boolean` | `false` | When `true`, mapped bones keep their bind-pose local translations and only rotations are retargeted. Useful for driving avatar rigs that have different proportions from the user without distorting segment lengths. |
| `useBoneOrientationOffsets` | `boolean` | `false` | Applies a per-bone orientation correction using each bone's bind-space child axis direction, compensating for rigs whose local axes don't match the XR joint convention. Automatically enabled when `isMixamoModel` is `true`. |
| `aimChildOverrides` | `Partial<Record<WebXRBodyJoint, WebXRBodyJoint>>` | — | Per-joint override of the "aim child" joint used when `useBoneOrientationOffsets` is enabled. Redirect noisy short segments (e.g. the very short hips→spine-lower segment) to a farther, more stable joint. |
| `jointLocalRotationOffset` | `Quaternion` | — | A rotation applied in each tracked joint's local frame before retargeting, for runtimes that emit joint data with non-standard axis conventions. |

#### Example: fitting an oversized avatar

```javascript
xr.baseExperience.featuresManager.enableFeature(
  BABYLON.WebXRFeatureName.BODY_TRACKING,
  "latest",
  {
    bodyMesh: giantAvatarMesh,
    isMixamoModel: true,
    preserveBindPoseBonePositions: true, // keep the avatar's own bone lengths
    jointScaleFactor: 1.5,              // stretch root offsets to match a taller user
  }
);
```

#### Example: adjusting the scale at runtime

The `jointScaleFactor` can also be changed at any time after the feature is enabled:

```javascript
// Make the skeleton larger dynamically
bodyTracking.trackedBody.jointScaleFactor = 1.2;
```

### Coordinate system

WebXR delivers body pose data in a **right-handed** coordinate system. Babylon.js defaults to **left-handed**. The `WebXRBodyTracking` feature handles this conversion automatically:

- Joint matrices are converted in-place (Z-axis negation) before being written to the `TransformNode`s.
- For meshes authored in a right-handed tool (glTF, Blender exports), bone data is un-flipped so the skeleton interprets poses correctly.
- If you have set `scene.useRightHandedSystem = true`, no conversion is applied.

You do not need to do anything special — this is handled transparently.

### Further reading

- [WebXR Body Tracking Specification](https://immersive-web.github.io/body-tracking/)
- [WebXR Hand Tracking](/features/featuresDeepDive/webXR/WebXRHandTracking)
- [WebXR Features Manager](/features/featuresDeepDive/webXR/webXRFeaturesManager)
- [Source code: WebXRBodyTracking.ts](https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/XR/features/WebXRBodyTracking.ts)
