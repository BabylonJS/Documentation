---
title: MultiViews Part 1
image:
description: Learn how to leverage multi-views in Babylon.js.
keywords: diving deeper, multiview
further-reading:
video-overview:
video-content:
---

# How to use Multiview

## Introduction

The [WebGL Multiview extension](https://www.khronos.org/registry/webgl/extensions/OVR_multiview2/) allows rendering multiple views (eg. each eye for VR scenarios) in a single render pass. This can make rendering around 1.5 to 2.0 times faster.

Multiview is not currently supported in all browsers. If it is supported, the multiview capability should be present.

```javascript
scene.getEngine().getCaps().multiview;
```

**Note:** Multiview rendering renders to a texture array instead of a standard texture. This may cause unexpected issues when applying postprocessing with custom shaders, effects, or postprocessing (_e.g._, the highlight layer will have no effect).

## Using with VRExperienceHelper

Multiview can be enabled by setting the `useMultiview` option to `true`.

```javascript
scene.createDefaultVRExperience({ useMultiview: true });
```

<Playground id="#SRV2A0" title="VR Experience Multiview Example" description="A simple example of using multiviews for a VR experience." image="/img/playgroundsAndNMEs/divingDeeperMultiviews1.jpg"/>

## Using with VRDeviceOrientationFreeCamera to display on the screen

Enable through the option in the [VRCameraMetrics](/typedoc/classes/babylon.vrcamerametrics) object:

```javascript
// Enable multiview
var multiviewMetrics = BABYLON.VRCameraMetrics.GetDefault();
multiviewMetrics.multiviewEnabled = true;
// Create camera
var multiviewCamera = new BABYLON.VRDeviceOrientationFreeCamera("", new BABYLON.Vector3(-10, 5, 0), scene, undefined, multiviewMetrics);
```

<Playground id="#EZDZZV" title="VRDeviceOrientationFreeCamera Multiview Example" description="A simple example of using multiviews to create a VRDeviceOrientationFreeCamera." image="/img/playgroundsAndNMEs/divingDeeperMultiviews2.jpg"/>
