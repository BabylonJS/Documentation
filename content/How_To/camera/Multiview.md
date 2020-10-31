# How to use Multiview

# Introduction

The [WebGL Multiview extension](https://www.khronos.org/registry/webgl/extensions/WEBGL_multiview/) allows rendering multiple views (eg. each eye for VR scenarios) in a single render pass. This can make rendering around 1.5 to 2.0 times faster.

Currently, Multiview is not supported in all browsers. If its supported the multiview capability should be present.

```javascript
scene.getEngine().getCaps().multiview
```

**Note:** Multiview rendering renders to a texture array instead of a standard texture. This may be unexpected issues when applying postprocessing with custom shaders, effects or postprocessing. (e.g. highlight layer will have no effect)

# Using with the VRExperienceHelper

Multiview can be enabled by setting the useMultiview option to true.

```javascript
scene.createDefaultVRExperience({useMultiview: true});
```

- [VR Experience Multiview Example](https://playground.babylonjs.com/pg/CZJYG7/revision/2)

# Using with VRDeviceOrientationFreeCamera to display to screen

Enable through the option in the VRCameraMetrics object:

```javascript
// Enable multiview
var multiviewMetrics = BABYLON.VRCameraMetrics.GetDefault();
multiviewMetrics.multiviewEnabled = true;
// Create camera
var multiviewCamera = new BABYLON.VRDeviceOrientationFreeCamera(
  "",
  new BABYLON.Vector3(-10, 5, 0),
  scene,
  undefined,
  multiviewMetrics
);
```

- [VRDeviceOrientationFreeCamera Multiview Example](https://playground.babylonjs.com/pg/CZJYG7)
